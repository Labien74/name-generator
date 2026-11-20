import { fantasyDataset } from "./datasets/fantasy";
import { fantasyRealNames } from "./datasets/fantasyRealNames";
import { fantasySurnames } from "./datasets/fantasySurnames";
import { fantasyTitles, fantasyEpithets } from "./datasets/fantasyTitlesAndEpithets";
import { realisticDataset, realisticPeriodMeta } from "./datasets/realistic";
import { realisticSurnames, realisticSurnamesByCulture } from "./datasets/realisticSurnames";
import { realisticPeriodSurnames } from "./datasets/realisticPeriodSurnames";
import { realisticBynames } from "./datasets/realisticBynames";
import {
  realisticTitlesByEra,
  realisticEpithets,
} from "./datasets/realisticTitlesAndEpithets";
import type {
  BynameRule,
  Gender,
  RealisticCentury,
  RealisticPeriod,
  RealisticRegion,
  Setting,
  SyllableDataset,
} from "./types";

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

/**
 * Pre-modern European name stocks were strongly gendered and had no epicene
 * pool, so those periods carry no "neutral" names at all rather than an
 * invented placeholder list. A period offers a gender only if it has names
 * for it.
 */
export function periodSupportsGender(
  period: RealisticPeriod,
  gender: Gender
): boolean {
  return realisticDataset[period][gender].length > 0;
}

function periodMatches(
  period: RealisticPeriod,
  region: RealisticRegion | undefined,
  century: RealisticCentury | undefined,
  gender: Gender | undefined
): boolean {
  const meta = realisticPeriodMeta[period];
  return (
    (!region || meta.region === region) &&
    (!century || meta.century === century) &&
    (!gender || periodSupportsGender(period, gender))
  );
}

// Whether any realistic period has data for this region+century+gender
// combination. Used by the UI to disable filter combinations that would
// otherwise fall back to the full mix.
export function hasRealisticPeriod(
  region: RealisticRegion | undefined,
  century: RealisticCentury | undefined,
  gender?: Gender
): boolean {
  return allRealisticPeriods.some((period) =>
    periodMatches(period, region, century, gender)
  );
}

function resolveRealisticPeriods(
  region: RealisticRegion | undefined,
  century: RealisticCentury | undefined,
  gender: Gender
): RealisticPeriod[] {
  const withGender = allRealisticPeriods.filter((period) =>
    periodSupportsGender(period, gender)
  );

  // Everything below assumes at least one period can serve the gender. If a
  // pool is ever emptied and that stops being true, fail with a readable
  // message instead of letting pickRandom hand back undefined and blowing up
  // one line later on realisticDataset[undefined].
  if (withGender.length === 0) {
    throw new Error(`No realistic period has names for gender "${gender}"`);
  }

  if (!region && !century) {
    return withGender;
  }

  const matching = withGender.filter((period) =>
    periodMatches(period, region, century, gender)
  );

  // No period matches this combination (e.g. sparse data, or "neutral" on a
  // pre-modern century) — fall back to the full mix for that gender rather
  // than returning nothing.
  return matching.length > 0 ? matching : withGender;
}

// How often the surname is drawn from the given name's own culture rather
// than from the whole region. Deliberately below 1: strict culture pairing
// reads as more authentic but is noticeably less varied — some countries
// contribute only ten surnames to the dataset — and for a GM tool variety
// matters slightly more than full historical accuracy. Raise it towards 1 for
// accuracy, lower it for variety.
const SAME_CULTURE_SURNAME_CHANCE = 0.7;

// The surname always follows the first name's own period — not the requested
// filter — so it stays consistent even when the filter is "any" and the drawn
// periods span several regions.
function surnamePoolFor(
  period: RealisticPeriod,
  culture: string | undefined
): string[] {
  const periodPools = realisticPeriodSurnames[period];
  const widePool = periodPools
    ? Object.values(periodPools).flat()
    : realisticSurnames[realisticPeriodMeta[period].region];

  if (!culture || Math.random() >= SAME_CULTURE_SURNAME_CHANCE) {
    return widePool;
  }

  // Cultures with no surnames of their own (CY, KG, TJ, PK and several Latin
  // American codes) fall back to the wide pool.
  const ownPool = periodPools
    ? periodPools[culture]
    : realisticSurnamesByCulture[realisticPeriodMeta[period].region][culture];

  return ownPool?.length ? ownPool : widePool;
}

function applyByname(
  rule: BynameRule,
  period: RealisticPeriod,
  culture: string,
  gender: Gender
): string | undefined {
  if (rule.kind === "toponymic") {
    return `${rule.particle} ${pickRandom(rule.places)}`;
  }
  if (rule.kind === "descriptive") {
    return `${rule.particle} ${pickRandom(rule.epithets)}`;
  }

  // Irregular languages list their forms explicitly rather than having them
  // concatenated.
  if (rule.forms) {
    const forms = Object.values(rule.forms);
    return forms.length > 0 ? pickRandom(forms) : undefined;
  }

  // Patronymic: built from a male given name of the same culture, which is
  // why these multiply instead of needing their own word list.
  const fathers = realisticDataset[period].male.filter(
    (entry) => entry.culture === culture
  );
  if (fathers.length === 0) {
    return undefined;
  }

  const father = pickRandom(fathers).name;
  const { prefix, suffix } = gender === "female" ? rule.female : rule.male;
  return `${prefix ? `${prefix} ` : ""}${father}${suffix ?? ""}`;
}

/**
 * The second element of a name in a period that predates surnames. Returns
 * the text plus whether it was a descriptive epithet, because the optional
 * nickname is the same shape and stacking them reads badly ("the Red the
 * Wise").
 */
function buildByname(
  period: RealisticPeriod,
  culture: string | undefined,
  gender: Gender
): { text: string; isDescriptive: boolean } | undefined {
  const rules = culture ? realisticBynames[period]?.[culture] : undefined;
  if (!rules?.length) {
    return undefined;
  }

  const rule = pickRandom(rules);
  const text = applyByname(rule, period, culture!, gender);
  return text ? { text, isDescriptive: rule.kind === "descriptive" } : undefined;
}

function buildRealisticName(
  gender: Gender,
  region: RealisticRegion | undefined,
  century: RealisticCentury | undefined,
  includeTitle: boolean,
  includeNickname: boolean
): string {
  const periods = resolveRealisticPeriods(region, century, gender);
  const period = pickRandom(periods);
  const firstName = pickRandom(realisticDataset[period][gender]);

  // Periods listed in realisticBynames have no hereditary surnames, so the
  // second element is a byname instead. A culture with no rules there (the
  // untagged placeholder names) still falls back to a surname.
  const byname = realisticBynames[period]
    ? buildByname(period, firstName.culture, gender)
    : undefined;

  const secondElement =
    byname?.text ?? pickRandom(surnamePoolFor(period, firstName.culture));
  const baseName = `${firstName.name} ${secondElement}`;

  return withTitleAndNickname(
    baseName,
    includeTitle
      ? pickRandom(realisticTitlesByEra[realisticPeriodMeta[period].era])
      : undefined,
    includeNickname && !byname?.isDescriptive
      ? pickRandom(realisticEpithets)
      : undefined
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
  return buildFantasyName(gender, includeTitle, includeNickname);
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
