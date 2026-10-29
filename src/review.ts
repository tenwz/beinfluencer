export interface PostMetric {
  topic: string;
  platform?: string;
  impressions: number;
  interactions: number;
  follows: number;
}

export interface Verdict {
  topic: string;
  platform?: string;
  impressions: number;
  ratio: number;
  interactionRate: number;
  followRate: number;
  verdict: 'scale' | 'keep' | 'kill';
  note: string;
}

export interface ReviewReport {
  sample: number;
  medianImpressions: number;
  overallFollowRate: number;
  verdicts: Verdict[];
  next: string[];
}

/**
 * 复盘引擎：只做「和自己比」，不套用平台的绝对阈值——
 * 平台从未公开过流量池门槛，任何绝对数字都不可信。
 * 相对中位数是唯一能在任何平台上成立的判据。
 */
export function review(metrics: PostMetric[]): ReviewReport {
  const sample = metrics.length;
  if (sample === 0) {
    return {
      sample: 0,
      medianImpressions: 0,
      overallFollowRate: 0,
      verdicts: [],
      next: ['还没有数据。先发 10 条，把曝光、互动、涨粉记下来。'],
    };
  }

  const median = medianOf(metrics.map((m) => m.impressions));
  const totalFollows = sum(metrics.map((m) => m.follows));
  const totalImpressions = sum(metrics.map((m) => m.impressions));

  const verdicts: Verdict[] = metrics
    .map((m) => {
      const ratio = median > 0 ? m.impressions / median : 0;
      const interactionRate = m.impressions > 0 ? m.interactions / m.impressions : 0;
      const followRate = m.impressions > 0 ? m.follows / m.impressions : 0;
      const verdict: Verdict['verdict'] = ratio >= 1.5 ? 'scale' : ratio <= 0.5 ? 'kill' : 'keep';
      const note =
        verdict === 'scale'
          ? '结构有效，复制它做 3 个变体'
          : verdict === 'kill'
            ? '不是赛道问题，是钩子问题——换开头，别换方向'
            : '保留观察，下一轮只改一个变量';
      return {
        topic: m.topic,
        platform: m.platform,
        impressions: m.impressions,
        ratio,
        interactionRate,
        followRate,
        verdict,
        note,
      };
    })
    .sort((a, b) => b.ratio - a.ratio);

  return {
    sample,
    medianImpressions: median,
    overallFollowRate: totalImpressions > 0 ? totalFollows / totalImpressions : 0,
    verdicts,
    next: nextSteps(verdicts, sample),
  };
}

function nextSteps(verdicts: Verdict[], sample: number): string[] {
  const steps: string[] = [];
  const winners = verdicts.filter((v) => v.verdict === 'scale');
  const losers = verdicts.filter((v) => v.verdict === 'kill');

  if (sample < 3) {
    steps.push('样本太少（少于 3 条），这一轮不算数，继续发。');
  }
  if (winners.length) {
    steps.push(`把「${winners[0].topic}」的结构复制 3 次，只换选题不换骨架。`);
  }
  if (losers.length >= Math.ceil(sample / 2)) {
    steps.push('过半内容低于账号中位数：先停下加量，用一个下午重写钩子再测一轮。');
  }
  if (winners.length === 0 && sample >= 3) {
    steps.push('没有明显赢家：说明还没找到切口，下一轮每条只改一个变量（选题/开头/格式）。');
  }
  const bestFollow = [...verdicts].sort((a, b) => b.followRate - a.followRate)[0];
  if (bestFollow && bestFollow.followRate > 0) {
    steps.push(`涨粉效率最高的是「${bestFollow.topic}」（${(bestFollow.followRate * 100).toFixed(2)}%），检查它是否值得做成系列。`);
  }
  return steps;
}

function medianOf(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}
