import type { Phase, Plan, PlanInput, Slot } from './types.js';
import { getPlatform } from './platforms.js';

const ANGLES: Record<Phase, string[]> = {
  定标签: [
    '自我介绍：我是谁、在为谁解决什么',
    '{niche} 的领域地图：一张图讲清有哪些坑',
    '一个反常识判断：{niche} 里最被高估的做法',
  ],
  测试: [
    '{niche} 最常见的 3 个错误',
    '我做 {niche} 的第一笔结果，完整拆解',
    '{niche} 前后对比：改了哪一处，差别在哪',
    '一个新手 30 天就能抄的 {niche} 流程',
    '回答一个被问最多的问题：{niche} 到底难在哪',
    '我今天踩的一个坑，以及怎么绕过去',
    '把 {niche} 里最贵的一步，用最低成本重做一遍',
    '不是我厉害，是这一步大多数人不做',
  ],
  收敛: [
    '系列第 N 集：{niche} 的关键变量',
    '上一篇的延伸：换一个场景再讲一遍',
    '把最好的一条重做：同一结构，换一个选题',
    '读者追问最多的问题，单独做一条',
  ],
  放大: [
    '{niche} 合集：这一个月的所有方法',
    '可保存清单：{niche} 的执行步骤',
    '一次完整复盘：哪条有效，为什么',
    '给自己设一个 30 天挑战并公开进度',
  ],
};

const WATCH: Record<Phase, string> = {
  定标签: '看系统有没有开始给你打标签（推荐人群是否变准）',
  测试: '看是否过首测门槛；不过就换钩子，不要换赛道',
  收敛: '看同一结构复用后的数据是否稳定',
  放大: '看涨粉是否来自内容本身，而不是单条爆款',
};

function phaseOf(day: number, days: number): Phase {
  const tagDays = Math.max(3, Math.round(days * 0.1));
  if (day <= tagDays) return '定标签';
  const p = day / days;
  if (p <= 0.45) return '测试';
  if (p <= 0.7) return '收敛';
  return '放大';
}

function cadenceFor(phase: Phase, c: [number, number, number]): number {
  if (phase === '测试' || phase === '定标签') return c[0];
  if (phase === '收敛') return c[1];
  return c[2];
}

function addDays(start: string, n: number): string {
  const d = new Date(`${start}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function buildPlan(input: PlanInput): Plan {
  const platform = getPlatform(input.platform);
  const slots: Slot[] = [];
  let carry = 0.999;
  let seriesNo = 0;

  for (let day = 1; day <= input.days; day++) {
    const phase = phaseOf(day, input.days);
    carry += cadenceFor(phase, platform.cadence) / 7;
    if (carry < 1) continue;
    carry -= 1;

    const angles = ANGLES[phase];
    let topic = angles[slots.length % angles.length].replaceAll('{niche}', input.niche);
    if (topic.includes('N')) topic = topic.replace('N', String(++seriesNo));

    // 合集/系列只在收敛和放大阶段用，测试期靠单一格式让系统打标签
    const pool =
      phase === '定标签' || phase === '测试'
        ? platform.formats.filter((f) => !f.includes('合集') && !f.includes('系列'))
        : platform.formats;
    const usable = pool.length ? pool : platform.formats;
    const format = usable[slots.length % usable.length];

    slots.push({
      day,
      date: addDays(input.startDate, day - 1),
      phase,
      format,
      topic,
      hook: hookFor(platform.name, phase, format),
      watch: WATCH[phase],
    });
  }

  return { input, platform, slots };
}

function hookFor(platform: string, phase: Phase, format: string): string {
  if (phase === '定标签') return '一句话说清「我是谁 + 给谁 + 关注能得到什么」';
  if (format.includes('thread')) return '第一条给结论，后面每条一个论点 + 一个证据';
  if (format.includes('视频') || format.includes('Reels') || format.includes('竖屏') || format.includes('Shorts')) {
    return '前 3 秒给冲突或结果，不铺垫';
  }
  if (platform === '小红书') return '封面大字报给结论，标题前 18 字放核心词';
  if (platform === '微博') return '第一句就是观点，带 2–3 个话题';
  if (format.includes('长') || format.includes('text post')) return '标题带具体数字或反差，开头 3 行给承诺';
  return '第一句给结论，第二句给理由';
}
