#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { buildPlan } from './plan.js';
import { renderMarkdown } from './render.js';
import { getPlatform } from './platforms.js';
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

const HELP = `beinfluencer

  plan     生成 30 天起号排期
    --platform <id>   平台（x, threads, reddit, telegram, discord, tiktok, youtube,
                      instagram, facebook, xiaohongshu, bilibili, wechat,
                      wechat-channels, weibo）
    --account <name>  账号描述
    --niche <text>    细分方向
    --days <n>        天数，默认 30
    --start <date>    起始日期，默认今天
    --json            输出 JSON（给发布适配器用）
    --out <file>      写到文件

  publish  把排期交给外部发布工具
    --plan <file>     由 --json 生成的排期文件
    --to postiz|sau   发布目标
    --dry-run         只打印将要提交的内容（默认开启）
`;

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
      startDate: String(flags.start ?? new Date().toISOString().slice(0, 10)),
    };
    getPlatform(input.platform);
    const plan = buildPlan(input);
    const output = flags.json ? JSON.stringify(plan, null, 2) : renderMarkdown(plan);

    const out = typeof flags.out === 'string' ? flags.out : undefined;
    if (out) {
      await writeFile(out, output, 'utf8');
      console.log(`已写入 ${out}`);
    } else {
      console.log(output);
    }
    return;
  }

  if (command === 'publish') {
    const file = String(flags.plan ?? '');
    if (!file) throw new Error('缺少 --plan');
    const plan = JSON.parse(await readFile(file, 'utf8')) as Plan;
    const target = String(flags.to ?? 'postiz');
    const dryRun = flags['dry-run'] !== false;

    if (target === 'postiz') {
      const apiKey = process.env.POSTIZ_API_KEY ?? '';
      const integrationId = process.env.POSTIZ_INTEGRATION_ID ?? '';
      if (!dryRun && (!apiKey || !integrationId)) {
        throw new Error('真实发布需要 POSTIZ_API_KEY 和 POSTIZ_INTEGRATION_ID');
      }
      const result = await publishToPostiz(
        plan.slots,
        { apiKey, integrationId, apiPath: process.env.POSTIZ_API_PATH },
        dryRun,
      );
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    if (target === 'sau') {
      const command = process.env.SAU_CMD ?? '';
      if (!command) throw new Error('需要设置 SAU_CMD，例如：SAU_CMD="python /path/main.py"');
      const result = await publishToSau(
        plan.slots,
        { command, args: process.env.SAU_ARGS ?? '' },
        dryRun,
      );
      console.log(result.join('\n'));
      return;
    }

    throw new Error(`未知发布目标：${target}`);
  }

  console.log(HELP);
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
