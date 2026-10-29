export type PlatformId =
  | 'x'
  | 'threads'
  | 'reddit'
  | 'telegram'
  | 'discord'
  | 'tiktok'
  | 'youtube'
  | 'instagram'
  | 'facebook'
  | 'xiaohongshu'
  | 'bilibili'
  | 'wechat'
  | 'wechat-channels'
  | 'weibo';

export type Phase = '定标签' | '测试' | '收敛' | '放大';

export interface PlatformProfile {
  id: PlatformId;
  name: string;
  /** 每周发布量：[测试期, 收敛期, 放大期] */
  cadence: [number, number, number];
  formats: string[];
  /** 起号阶段最该盯的数 */
  primaryMetric: string;
  /** 首测门槛：内容进入下一级流量池的可观察信号 */
  firstGate: string;
  /** 该平台的冷启动杠杆 */
  levers: string[];
  docs: string;
}

export interface PlanInput {
  platform: PlatformId;
  /** 账号描述，例如「独立开发者」「卖猫粮的小公司」 */
  account: string;
  /** 细分方向，越窄越好 */
  niche: string;
  days: number;
  startDate: string;
}

export interface Slot {
  day: number;
  date: string;
  phase: Phase;
  format: string;
  topic: string;
  hook: string;
  watch: string;
}

export interface Plan {
  input: PlanInput;
  platform: PlatformProfile;
  slots: Slot[];
}
