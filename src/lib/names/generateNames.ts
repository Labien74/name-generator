import { fantasyDataset } from "./datasets/fantasy";
import { scifiDataset } from "./datasets/scifi";
import type { Gender, Setting, SyllableDataset } from "./types";

const syllableDatasets: Record<Setting, SyllableDataset> = {
  fantasy: fantasyDataset,
  scifi: scifiDataset,
};

export interface GenerateNamesOptions {
  setting: Setting;
  gender: Gender;
  count: number;
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function buildSyllableName(prefixes: string[], suffixes: string[]): string {
  return `${pickRandom(prefixes)}${pickRandom(suffixes)}`;
}

export function generateNames({ setting, gender, count }: GenerateNamesOptions): string[] {
  const { prefixes, suffixes } = syllableDatasets[setting][gender];
  const names = new Set<string>();
  const maxAttempts = count * 50;

  let attempts = 0;
  while (names.size < count && attempts < maxAttempts) {
    names.add(buildSyllableName(prefixes, suffixes));
    attempts++;
  }

  return Array.from(names);
}
