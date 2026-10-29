import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { Plan, Slot } from './types.js';

const STATE_PATH = '.beinfluencer/published.json';

export function slotKey(slot: Slot): string {
  return `${slot.date}|${slot.topic}`;
}

async function loadState(): Promise<string[]> {
  try {
    return JSON.parse(await readFile(STATE_PATH, 'utf8')) as string[];
  } catch {
    return [];
  }
}

async function saveState(keys: string[]): Promise<void> {
  await mkdir(dirname(STATE_PATH), { recursive: true });
  await writeFile(STATE_PATH, JSON.stringify([...new Set(keys)].sort(), null, 2), 'utf8');
}

/** 到期但还没发过的内容。日期用 <= 比较，错过的会在下一次补上。 */
export async function dueSlots(plan: Plan, today: string): Promise<Slot[]> {
  const done = new Set(await loadState());
  return plan.slots.filter((s) => s.date <= today && !done.has(slotKey(s)));
}

export async function markPublished(slots: Slot[]): Promise<void> {
  const done = await loadState();
  await saveState([...done, ...slots.map(slotKey)]);
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
