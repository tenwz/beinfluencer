import type { Plan } from './types.js';

export function renderMarkdown(plan: Plan): string {
  const { input, platform, slots } = plan;
  const byPhase = new Map<string, number>();
  for (const s of slots) byPhase.set(s.phase, (byPhase.get(s.phase) ?? 0) + 1);

  const lines: string[] = [];
  lines.push(`# ${platform.name} · ${input.days} 天起号排期`);
  lines.push('');
  lines.push(`账号：${input.account}`);
  lines.push(`细分：${input.niche}`);
  lines.push(`平台关键指标：${platform.primaryMetric}`);
  lines.push(`首测门槛：${platform.firstGate}`);
  lines.push('');
  lines.push(`共 ${slots.length} 条内容：` +
    [...byPhase.entries()].map(([p, n]) => `${p} ${n} 条`).join(' · '));
  lines.push('');
  lines.push('| 日期 | 阶段 | 格式 | 选题 | 钩子 | 观察 |');
  lines.push('| --- | --- | --- | --- | --- | --- |');
  for (const s of slots) {
    lines.push(`| ${s.date} (D${s.day}) | ${s.phase} | ${s.format} | ${s.topic} | ${s.hook} | ${s.watch} |`);
  }
  lines.push('');
  lines.push('## 这个平台的三个杠杆');
  for (const l of platform.levers) lines.push(`- ${l}`);
  lines.push('');
  lines.push('## 依据');
  lines.push('平台打法来自内部知识库，不随仓库公开。');
  lines.push('');
  lines.push('> 排期是起点，不是保证。按首测门槛判断是否换钩子，不要因为一条没起来就换赛道。');
  return lines.join('\n');
}
