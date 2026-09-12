import { fantasyDataset } from "./datasets/fantasy";
import type { Gender, Setting, SettingDataset } from "./types";

const datasets: Record<Setting, SettingDataset> = {
  fantasy: fantasyDataset,
};

export interface GenerateNamesOptions {
  setting: Setting;
  gender: Gender;
  count: number;
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function buildName(prefixes: string[], suffixes: string[]): string {
  return `${pickRandom(prefixes)}${pickRandom(suffixes)}`;
}

export function generateNames({ setting, gender, count }: GenerateNamesOptions): string[] {
  const { prefixes, suffixes } = datasets[setting][gender];
  const names = new Set<string>();
  const maxAttempts = count * 50;

  let attempts = 0;
  while (names.size < count && attempts < maxAttempts) {
    names.add(buildName(prefixes, suffixes));
    attempts++;
  }

  return Array.from(names);
}
