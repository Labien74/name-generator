import { fantasyDataset } from "./datasets/fantasy";
import { fantasyRealNames } from "./datasets/fantasyRealNames";
import { scifiDataset } from "./datasets/scifi";
import { realisticDataset, realisticPeriodMeta } from "./datasets/realistic";
import { realisticSurnames } from "./datasets/realisticSurnames";
import type {
  Gender,
  RealisticCentury,
  RealisticPeriod,
  RealisticRegion,
  Setting,
  SyllableDataset,
} from "./types";

const syllableDatasets: Partial<Record<Setting, SyllableDataset>> = {
  fantasy: fantasyDataset,
  scifi: scifiDataset,
};

const allRealisticPeriods = Object.keys(realisticDataset) as RealisticPeriod[];

// Chance that a fantasy name is pulled from the curated real-name pool
// instead of built from the invented syllable pool, for extra variety.
const FANTASY_REAL_NAME_CHANCE = 0.4;

export interface GenerateNamesOptions {
  setting: Setting;
  gender: Gender;
  count: number;
  region?: RealisticRegion;
  century?: RealisticCentury;
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function buildSyllableName(dataset: SyllableDataset, gender: Gender): string {
  const { prefixes, suffixes } = dataset[gender];
  return `${pickRandom(prefixes)}${pickRandom(suffixes)}`;
}

function resolveRealisticPeriods(
  region: RealisticRegion | undefined,
  century: RealisticCentury | undefined
): RealisticPeriod[] {
  if (!region && !century) {
    return allRealisticPeriods;
  }

  const matching = allRealisticPeriods.filter((period) => {
    const meta = realisticPeriodMeta[period];
    return (!region || meta.region === region) && (!century || meta.century === century);
  });

  // No period matches this region+century combination (e.g. sparse data) —
  // fall back to the full mix rather than returning nothing.
  return matching.length > 0 ? matching : allRealisticPeriods;
}

function buildRealisticName(
  gender: Gender,
  region: RealisticRegion | undefined,
  century: RealisticCentury | undefined
): string {
  const periods = resolveRealisticPeriods(region, century);
  const period = pickRandom(periods);
  const firstName = pickRandom(realisticDataset[period][gender]);

  // Surnames aren't split by century, so pair with the first name's own
  // region (not the requested filter) — always consistent even when the
  // region filter is "any" and periods span multiple regions.
  const surname = pickRandom(realisticSurnames[realisticPeriodMeta[period].region]);

  return `${firstName} ${surname}`;
}

function buildName(
  setting: Setting,
  gender: Gender,
  region: RealisticRegion | undefined,
  century: RealisticCentury | undefined
): string {
  if (setting === "realistic") {
    return buildRealisticName(gender, region, century);
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
