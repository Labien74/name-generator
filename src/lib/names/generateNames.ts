import { fantasyDataset } from "./datasets/fantasy";
import { scifiDataset } from "./datasets/scifi";
import { historicalDataset } from "./datasets/historical";
import type { Gender, HistoricalPeriod, Setting, SyllableDataset } from "./types";

const syllableDatasets: Partial<Record<Setting, SyllableDataset>> = {
  fantasy: fantasyDataset,
  scifi: scifiDataset,
};

const historicalPeriods = Object.keys(historicalDataset) as HistoricalPeriod[];

export interface GenerateNamesOptions {
  setting: Setting;
  gender: Gender;
  count: number;
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function buildSyllableName(dataset: SyllableDataset, gender: Gender): string {
  const { prefixes, suffixes } = dataset[gender];
  return `${pickRandom(prefixes)}${pickRandom(suffixes)}`;
}

function buildHistoricalName(gender: Gender): string {
  const period = pickRandom(historicalPeriods);
  return pickRandom(historicalDataset[period][gender]);
}

function buildName(setting: Setting, gender: Gender): string {
  if (setting === "historical") {
    return buildHistoricalName(gender);
  }
  return buildSyllableName(syllableDatasets[setting]!, gender);
}

export function generateNames({ setting, gender, count }: GenerateNamesOptions): string[] {
  const names = new Set<string>();
  const maxAttempts = count * 50;

  let attempts = 0;
  while (names.size < count && attempts < maxAttempts) {
    names.add(buildName(setting, gender));
    attempts++;
  }

  return Array.from(names);
}
