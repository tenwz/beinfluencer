import { randomUUID } from 'node:crypto';
import type { Slot } from '../types.js';

export interface PostizOptions {
  apiKey: string;
  /** 自部署实例的 API 地址，默认 https://api.postiz.com */
  apiPath?: string;
  /** 目标平台在 Postiz 里的 integration id */
  integrationId: string;
}

interface PostizPostDto {
  type: 'draft' | 'schedule' | 'now';
  date: string;
  shortLink: boolean;
  tags: { value: string; label: string }[];
  posts: {
    integration: { id: string };
    value: { content: string; image: unknown[] }[];
    group: string;
    settings: Record<string, unknown>;
  }[];
}

/**
 * 把排期翻译成 Postiz 的 CreatePostDto。
 * 发布时间统一落在 09:00 UTC，接入后按平台最佳时段调。
 */
export function toPostizPayload(slots: Slot[], integrationId: string): PostizPostDto[] {
  return slots.map((slot) => ({
    type: 'schedule' as const,
    date: `${slot.date}T09:00:00.000Z`,
    shortLink: false,
    tags: [],
    posts: [
      {
        integration: { id: integrationId },
        value: [{ content: `${slot.topic}\n\n${slot.hook}`, image: [] }],
        group: randomUUID(),
        settings: {},
      },
    ],
  }));
}

/**
 * 通过 Postiz 官方 SDK 提交。SDK 是可选依赖：
 * 没装 @postiz/node 时这里会抛错，而不是拖垮整个 CLI。
 */
export async function publishToPostiz(
  slots: Slot[],
  opts: PostizOptions,
  dryRun: boolean,
): Promise<unknown> {
  const payload = toPostizPayload(slots, opts.integrationId);
  if (dryRun) return payload;

  let Postiz: typeof import('@postiz/node').default;
  try {
    ({ default: Postiz } = await import('@postiz/node'));
  } catch {
    throw new Error('缺少依赖 @postiz/node，先运行 npm install');
  }

  const client = new Postiz(opts.apiKey, opts.apiPath);
  const results = [];
  for (const post of payload) {
    results.push(await client.post(post as never));
  }
  return results;
}
