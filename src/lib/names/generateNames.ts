import { fantasyDataset } from "./datasets/fantasy";
import { fantasyRealNames } from "./datasets/fantasyRealNames";
import { scifiDataset } from "./datasets/scifi";
import { historicalDataset, historicalPeriodMeta } from "./datasets/historical";
import type {
  Gender,
  HistoricalCentury,
  HistoricalPeriod,
  HistoricalRegion,
  Setting,
  SyllableDataset,
} from "./types";

const syllableDatasets: Partial<Record<Setting, SyllableDataset>> = {
  fantasy: fantasyDataset,
  scifi: scifiDataset,
};

const allHistoricalPeriods = Object.keys(historicalDataset) as HistoricalPeriod[];

// Chance that a fantasy name is pulled from the curated real-name pool
// instead of built from the invented syllable pool, for extra variety.
const FANTASY_REAL_NAME_CHANCE = 0.4;

export interface GenerateNamesOptions {
  setting: Setting;
  gender: Gender;
  count: number;
  region?: HistoricalRegion;
  century?: HistoricalCentury;
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function buildSyllableName(dataset: SyllableDataset, gender: Gender): string {
  const { prefixes, suffixes } = dataset[gender];
  return `${pickRandom(prefixes)}${pickRandom(suffixes)}`;
}

function resolveHistoricalPeriods(
  region: HistoricalRegion | undefined,
  century: HistoricalCentury | undefined
): HistoricalPeriod[] {
  if (!region && !century) {
    return allHistoricalPeriods;
  }

  const matching = allHistoricalPeriods.filter((period) => {
    const meta = historicalPeriodMeta[period];
    return (!region || meta.region === region) && (!century || meta.century === century);
  });

  // No period matches this region+century combination (e.g. sparse data) —
  // fall back to the full mix rather than returning nothing.
  return matching.length > 0 ? matching : allHistoricalPeriods;
}

function buildHistoricalName(
  gender: Gender,
  region: HistoricalRegion | undefined,
  century: HistoricalCentury | undefined
): string {
  const periods = resolveHistoricalPeriods(region, century);
  const period = pickRandom(periods);
  return pickRandom(historicalDataset[period][gender]);
}

function buildName(
  setting: Setting,
  gender: Gender,
  region: HistoricalRegion | undefined,
  century: HistoricalCentury | undefined
): string {
  if (setting === "historical") {
    return buildHistoricalName(gender, region, century);
  }
  if (setting === "fantasy" && Math.random() < FANTASY_REAL_NAME_CHANCE) {
    return pickRandom(fantasyRealNames[gender]);
  }
  return buildSyllableName(syllableDatasets[setting]!, gender);
}

export function generateNames({
  setting,
  gender,
  count,
  region,
  century,
}: GenerateNamesOptions): string[] {
  const names = new Set<string>();
  const maxAttempts = count * 50;

  let attempts = 0;
  while (names.size < count && attempts < maxAttempts) {
    names.add(buildName(setting, gender, region, century));
    attempts++;
  }

  return Array.from(names);
}
