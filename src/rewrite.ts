import type { PlatformId } from './types.js';

export interface Variant {
  platform: PlatformId;
  format: string;
  content: string;
  tips: string[];
}

/**
 * 一稿多投的改写器：同一个选题，按平台重新组织。
 * 这不是翻译，是换一套信息结构——X 要观点，小红书要封面和标签，
 * 短视频要前三秒，公众号要小标题。
 */
export function adapt(topic: string, niche: string, targets: PlatformId[]): Variant[] {
  return targets.map((platform) => variantFor(platform, topic, niche));
}

function variantFor(platform: PlatformId, topic: string, niche: string): Variant {
  switch (platform) {
    case 'x':
      return {
        platform,
        format: '单帖（<200 字符）+ thread',
        content: `${topic}\n\nthread 骨架：\n1. 结论一句话\n2. 我是怎么发现的（一个具体场景）\n3. 反例：大多数人怎么做的\n4. 你可以立刻做的一步`,
        tips: ['单帖不要放链接，链接放首条回复', '发完 2 小时内守评论区'],
      };

    case 'threads':
      return {
        platform,
        format: '对话体短帖',
        content: `${topic}\n\n换个说法：${niche} 这件事，我见过最多的误解是……（补一句你的真实经历）`,
        tips: ['回复别人的帖子比发自己的更重要', '只带 1 个窄标签'],
      };

    case 'xiaohongshu':
      return {
        platform,
        format: '图文 6–9 张 3:4',
        content: [
          `封面大字：${shorten(topic, 12)}`,
          `标题：${topic}｜${niche}必看`,
          '',
          '正文：',
          `1. 先说结论：${topic}`,
          '2. 为什么大多数人做错（配对比图）',
          '3. 我的做法（步骤图）',
          '4. 结果与代价',
          `标签：${tagsOf(niche)}`,
        ].join('\n'),
        tips: ['标题前 18 字放核心搜索词', '收藏率比点赞重要'],
      };

    case 'tiktok':
      return {
        platform,
        format: '9:16 竖屏 15–45 秒',
        content: [
          `0–3 秒（钩子）：${topic}`,
          '3–10 秒：为什么这事和你有关系（说人话）',
          '10–30 秒：三步做法，一步一个画面',
          '30–40 秒：结果 + 一句反问',
          '',
          '字幕：全程大字幕，一条只讲一件事',
        ].join('\n'),
        tips: ['前 3 帧给冲突，不要自我介绍', '发布后 30 分钟置顶补充评论'],
      };

    case 'youtube':
      return {
        platform,
        format: 'Shorts 或 8–12 分钟',
        content: [
          `标题：${topic}（用具体数字或反差）`,
          `缩略图：3–4 个字 + 一个可辨认主体`,
          '',
          '前 30 秒：先给结果，不要片头',
          '正文结构：问题 → 一次性讲透 → 演示 → 适用边界',
        ].join('\n'),
        tips: ['标题覆盖搜索意图', '必须加字幕'],
      };

    case 'bilibili':
      return {
        platform,
        format: '横屏 8–15 分钟',
        content: [
          `标题：${topic}｜${niche}实测`,
          '',
          '前 30 秒：抛结论 + 给预期回报',
          '第 1 段：我为什么做这件事',
          '第 2 段：完整过程（留弹幕槽点）',
          '第 3 段：结果与翻车的地方',
          '',
          '标签：前 3 个必须精准',
        ].join('\n'),
        tips: ['合集做关注转化', '预埋可被吐槽的细节'],
      };

    case 'wechat':
      return {
        platform,
        format: '1500–3000 字长图文',
        content: [
          `标题：${topic}`,
          '',
          '导语：一个具体场景，3 行内说完',
          '小标题 1：问题是怎么发生的',
          '小标题 2：大多数人错在哪',
          '小标题 3：我的做法（可执行清单）',
          '结尾：一个具体问题，引导留言',
        ].join('\n'),
        tips: ['发布后 30 分钟发朋友圈和精准群', '不做诱导分享'],
      };

    case 'wechat-channels':
      return {
        platform,
        format: '竖屏 15–60 秒',
        content: `前 3 秒：${topic}\n中段：一个具体场景 + 一个做法\n结尾：转发给需要的人（不说"转发有奖"）`,
        tips: ['发布后立刻转 3–5 个精准群', '前 30 分钟的熟人互动决定破圈'],
      };

    case 'weibo':
      return {
        platform,
        format: '短图文 ≤140 字',
        content: `${topic}\n\n#${niche}# #干货#`,
        tips: ['第一句就是观点', '热榜 30 分钟内跟进'],
      };

    case 'instagram':
      return {
        platform,
        format: 'Reels 15–30 秒',
        content: `0–3 秒：${topic}\n3–20 秒：三步演示\n结尾：一句让人觉得「要发给朋友」的话`,
        tips: ['设计一个转发理由', '标签 ≤5 个'],
      };

    case 'facebook':
      return {
        platform,
        format: 'Reels 15–30 秒',
        content: `0–3 秒：${topic}\n中段：一个前后对比\n结尾：提问，引导评论`,
        tips: ['原生上传，不带水印', '帖子发出后邀请点赞者关注'],
      };

    case 'reddit':
      return {
        platform,
        format: 'text post 800–1500 词',
        content: `${topic}\n\n结构：背景 → 我试了什么 → 数据 → 踩的坑 → 你可以直接抄的部分\n\n品牌和链接放评论区。`,
        tips: ['先攒 karma 再发', '选 1–5 万人的小 sub 验证'],
      };

    case 'telegram':
      return {
        platform,
        format: '图文推送',
        content: `${topic}\n\n要点 1 / 2 / 3\n\n（附一个可保存的资源）`,
        tips: ['固定时段推', '做能被转发的资源帖'],
      };

    case 'discord':
      return {
        platform,
        format: '话题 prompt',
        content: `${topic}\n\n问一句能让人开口的话，而不是发一篇公告。`,
        tips: ['先聊起来，再发内容', '每周固定活动'],
      };
  }
}

function shorten(text: string, n: number): string {
  return text.length > n ? `${text.slice(0, n)}…` : text;
}

function tagsOf(niche: string): string {
  return [...new Set([niche, '实操', '避坑', shorten(niche, 6)].filter(Boolean))]
    .map((t) => `#${t}`)
    .join(' ');
}
