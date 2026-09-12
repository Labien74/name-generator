import { fantasyDataset } from "./datasets/fantasy";
import { fantasyRealNames } from "./datasets/fantasyRealNames";
import { fantasySurnames } from "./datasets/fantasySurnames";
import { fantasyTitles, fantasyEpithets } from "./datasets/fantasyTitlesAndEpithets";
import { scifiDataset } from "./datasets/scifi";
import { realisticDataset, realisticPeriodMeta } from "./datasets/realistic";
import { realisticSurnames } from "./datasets/realisticSurnames";
import { realisticTitles, realisticEpithets } from "./datasets/realisticTitlesAndEpithets";
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
  includeTitle?: boolean;
  includeNickname?: boolean;
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function buildSyllableName(dataset: SyllableDataset, gender: Gender): string {
  const { prefixes, suffixes } = dataset[gender];
  return `${pickRandom(prefixes)}${pickRandom(suffixes)}`;
}

function withTitleAndNickname(
  baseName: string,
  title: string | undefined,
  epithet: string | undefined
): string {
  const withTitle = title ? `${title} ${baseName}` : baseName;
  return epithet ? `${withTitle} ${epithet}` : withTitle;
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
  century: RealisticCentury | undefined,
  includeTitle: boolean,
  includeNickname: boolean
): string {
  const periods = resolveRealisticPeriods(region, century);
  const period = pickRandom(periods);
  const firstName = pickRandom(realisticDataset[period][gender]);

  // Surnames aren't split by century, so pair with the first name's own
  // region (not the requested filter) — always consistent even when the
  // region filter is "any" and periods span multiple regions.
  const surname = pickRandom(realisticSurnames[realisticPeriodMeta[period].region]);
  const baseName = `${firstName} ${surname}`;

  return withTitleAndNickname(
    baseName,
    includeTitle ? pickRandom(realisticTitles) : undefined,
    includeNickname ? pickRandom(realisticEpithets) : undefined
  );
}

function buildFantasyName(
  gender: Gender,
  includeTitle: boolean,
  includeNickname: boolean
): string {
  const firstName =
    Math.random() < FANTASY_REAL_NAME_CHANCE
      ? pickRandom(fantasyRealNames[gender])
      : buildSyllableName(fantasyDataset, gender);
  const surname = pickRandom(fantasySurnames);
  const baseName = `${firstName} ${surname}`;

  return withTitleAndNickname(
    baseName,
    includeTitle ? pickRandom(fantasyTitles[gender]) : undefined,
    includeNickname ? pickRandom(fantasyEpithets) : undefined
  );
}

function buildName(
  setting: Setting,
  gender: Gender,
  region: RealisticRegion | undefined,
  century: RealisticCentury | undefined,
  includeTitle: boolean,
  includeNickname: boolean
): string {
  if (setting === "realistic") {
    return buildRealisticName(gender, region, century, includeTitle, includeNickname);
  }
  if (setting === "fantasy") {
    return buildFantasyName(gender, includeTitle, includeNickname);
  }
  return buildSyllableName(syllableDatasets[setting]!, gender);
}

export function generateNames({
  setting,
  gender,
  count,
  region,
  century,
  includeTitle = false,
  includeNickname = false,
}: GenerateNamesOptions): string[] {
  const names = new Set<string>();
  const maxAttempts = count * 50;

  let attempts = 0;
  while (names.size < count && attempts < maxAttempts) {
    names.add(buildName(setting, gender, region, century, includeTitle, includeNickname));
    attempts++;
  }

  return Array.from(names);
}
