#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { buildPlan } from './plan.js';
import { renderMarkdown } from './render.js';
import { getPlatform, PLATFORMS } from './platforms.js';
import { adapt } from './rewrite.js';
import { review, type PostMetric } from './review.js';
import { dueSlots, markPublished, todayIso } from './tick.js';
import { publishToPostiz } from './publish/postiz.js';
import { publishToSau } from './publish/sau.js';
import type { Plan, PlatformId } from './types.js';

function parseArgs(argv: string[]): { positional: string[]; flags: Record<string, string | boolean> } {
  const positional: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(arg);
    }
  }
  return { positional, flags };
}

const PLATFORM_IDS = Object.keys(PLATFORMS).join(', ');

const HELP = `beinfluencer

  plan     生成 30 天起号排期
    --platform <id>   平台：${PLATFORM_IDS}
    --account <name>  账号描述
    --niche <text>    细分方向
    --days <n>        天数，默认 30
    --start <date>    起始日期，默认今天
    --json            输出 JSON
    --out <file>      写到文件

  adapt    把一个选题改写成各平台版本
    --topic <text>    选题
    --niche <text>    细分方向
    --to <ids>        逗号分隔，例如 x,xiaohongshu,tiktok

  review   复盘：输入各条内容的曝光/互动/涨粉，输出该复制还是该改
    --metrics <file>  JSON：[{ "topic", "platform", "impressions", "interactions", "follows" }]
    --out <file>      写到文件

  publish  把排期交给外部发布工具
    --plan <file>     排期 JSON
    --to postiz|sau   发布目标
    --dry-run         只打印，不发（默认）

  tick     自动循环：把今天到期、还没发的内容发出去
    --plan <file>     排期 JSON
    --to postiz|sau
    --dry-run         只打印，不发（默认）
    --date <date>     指定「今天」，默认当前日期
`;

function parsePlatforms(value: string): PlatformId[] {
  const ids = value.split(',').map((s) => s.trim()).filter(Boolean);
  for (const id of ids) getPlatform(id);
  return ids as PlatformId[];
}

async function publishSlots(slots: Plan['slots'], target: string, dryRun: boolean): Promise<unknown> {
  if (target === 'postiz') {
    const apiKey = process.env.POSTIZ_API_KEY ?? '';
    const integrationId = process.env.POSTIZ_INTEGRATION_ID ?? '';
    if (!dryRun && (!apiKey || !integrationId)) {
      throw new Error('真实发布需要 POSTIZ_API_KEY 和 POSTIZ_INTEGRATION_ID');
    }
    return publishToPostiz(slots, { apiKey, integrationId, apiPath: process.env.POSTIZ_API_PATH }, dryRun);
  }
  if (target === 'sau') {
    const command = process.env.SAU_CMD ?? '';
    if (!command) throw new Error('需要设置 SAU_CMD，例如：SAU_CMD="python /path/main.py"');
    return publishToSau(slots, { command, args: process.env.SAU_ARGS ?? '' }, dryRun);
  }
  throw new Error(`未知发布目标：${target}`);
}

async function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2));
  const command = positional[0];

  if (!command || flags.help) {
    console.log(HELP);
    return;
  }

  if (command === 'plan') {
    const platform = String(flags.platform ?? '');
    if (!platform) throw new Error('缺少 --platform');
    const input = {
      platform: platform as PlatformId,
      account: String(flags.account ?? '未命名账号'),
      niche: String(flags.niche ?? ''),
      days: Number(flags.days ?? 30),
      startDate: String(flags.start ?? todayIso()),
    };
    getPlatform(input.platform);
    const plan = buildPlan(input);
    const output = flags.json ? JSON.stringify(plan, null, 2) : renderMarkdown(plan);
    await emit(output, typeof flags.out === 'string' ? flags.out : undefined);
    return;
  }

  if (command === 'adapt') {
    const topic = String(flags.topic ?? '');
    if (!topic) throw new Error('缺少 --topic');
    const targets = parsePlatforms(String(flags.to ?? 'x,xiaohongshu,tiktok'));
    const variants = adapt(topic, String(flags.niche ?? ''), targets);
    const md = variants
      .map((v) => `## ${PLATFORMS[v.platform].name} · ${v.format}\n\n\`\`\`\n${v.content}\n\`\`\`\n\n- ${v.tips.join('\n- ')}`)
      .join('\n\n');
    await emit(md, typeof flags.out === 'string' ? flags.out : undefined);
    return;
  }

  if (command === 'review') {
    const file = String(flags.metrics ?? '');
    if (!file) throw new Error('缺少 --metrics');
    const metrics = JSON.parse(await readFile(file, 'utf8')) as PostMetric[];
    const report = review(metrics);
    await emit(renderReview(report), typeof flags.out === 'string' ? flags.out : undefined);
    return;
  }

  if (command === 'publish' || command === 'tick') {
    const file = String(flags.plan ?? '');
    if (!file) throw new Error('缺少 --plan');
    const plan = JSON.parse(await readFile(file, 'utf8')) as Plan;
    const target = String(flags.to ?? 'postiz');
    const dryRun = flags['dry-run'] !== false;

    const slots = command === 'tick' ? await dueSlots(plan, String(flags.date ?? todayIso())) : plan.slots;
    if (!slots.length) {
      console.log(command === 'tick' ? '今天没有到期内容。' : '排期为空。');
      return;
    }

    const result = await publishSlots(slots, target, dryRun);
    console.log(JSON.stringify(result, null, 2));

    if (command === 'tick' && !dryRun) {
      await markPublished(slots);
      console.log(`已标记 ${slots.length} 条为已发布。`);
    }
    return;
  }

  console.log(HELP);
}

async function emit(content: string, out?: string) {
  if (out) {
    await writeFile(out, content, 'utf8');
    console.log(`已写入 ${out}`);
  } else {
    console.log(content);
  }
}

function renderReview(report: ReturnType<typeof review>): string {
  const lines = [
    `# 复盘（样本 ${report.sample} 条，中位曝光 ${Math.round(report.medianImpressions)}）`,
    '',
    `整体涨粉率：${(report.overallFollowRate * 100).toFixed(2)}%`,
    '',
    '| 内容 | 曝光 | 相对中位 | 互动率 | 涨粉率 | 判定 |',
    '| --- | --- | --- | --- | --- | --- |',
    ...report.verdicts.map(
      (v) =>
        `| ${v.topic} | ${v.impressions} | ${v.ratio.toFixed(2)}× | ${(v.interactionRate * 100).toFixed(1)}% | ${(v.followRate * 100).toFixed(2)}% | ${v.verdict} |`,
    ),
    '',
    '## 下一步',
    ...report.next.map((s) => `- ${s}`),
  ];
  return lines.join('\n');
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
