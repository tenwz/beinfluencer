import { spawn } from 'node:child_process';
import type { Slot } from '../types.js';

/**
 * 国内平台适配器：调用 dreammis/social-auto-upload。
 *
 * 这个项目的调用方式随版本变化，所以不在这里写死，
 * 用环境变量把命令拼好，例如：
 *
 *   SAU_CMD="python /path/social-auto-upload/uploader/xiaohongshu_uploader/main.py"
 *   SAU_ARGS='--account {account} --title "{title}" --date {date}'
 *
 * {title} {date} {platform} 会被替换。
 */
export interface SauOptions {
  command: string;
  args: string;
  cwd?: string;
}

export function buildSauCommand(slot: Slot, opts: SauOptions): { cmd: string; args: string[] } {
  const [cmd, ...baseArgs] = opts.command.split(' ').filter(Boolean);
  const templated = opts.args
    .replaceAll('{title}', slot.topic)
    .replaceAll('{date}', slot.date)
    .replaceAll('{platform}', slot.phase);
  return { cmd, args: [...baseArgs, ...splitArgs(templated)] };
}

function splitArgs(input: string): string[] {
  const out: string[] = [];
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(input))) out.push(m[1] ?? m[2] ?? m[3]);
  return out;
}

export async function publishToSau(
  slots: Slot[],
  opts: SauOptions,
  dryRun: boolean,
): Promise<string[]> {
  const commands = slots.map((s) => buildSauCommand(s, opts));
  if (dryRun) {
    return commands.map((c) => `${c.cmd} ${c.args.join(' ')}`);
  }
  const log: string[] = [];
  for (const c of commands) {
    const code = await run(c.cmd, c.args, opts.cwd);
    log.push(`${c.cmd} → exit ${code}`);
    if (code !== 0) throw new Error(`发布失败：${c.cmd} 退出码 ${code}`);
  }
  return log;
}

function run(cmd: string, args: string[], cwd?: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: 'inherit' });
    child.on('error', reject);
    child.on('close', (code) => resolve(code ?? 1));
  });
}
