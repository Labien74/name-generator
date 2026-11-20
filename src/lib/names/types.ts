export type Gender = "male" | "female" | "neutral";

export type Setting = "fantasy" | "realistic";

export interface SyllablePool {
  prefixes: string[];
  suffixes: string[];
}

export type SyllableDataset = Record<Gender, SyllablePool>;

export type RealisticPeriod =
  | "western_europe_1300_1550"
  | "eastern_europe_1300_1550"
  | "western_europe_20th_century"
  | "eastern_europe_20th_century"
  | "usa_20th_century"
  | "latin_america_20th_century"
  | "western_europe_21st_century"
  | "eastern_europe_21st_century"
  | "usa_21st_century"
  | "latin_america_21st_century"
  | "central_asia_21st_century"
  | "india_21st_century"
  | "japan_21st_century"
  | "china_21st_century";

/**
 * A given name together with the culture it was drawn from, so a surname can
 * be picked from the same culture instead of from the whole region.
 *
 * `culture` is an ISO 3166-1 alpha-2 country code for imported data and a
 * slug ("england", "france") for the hand-written historical periods. It is
 * optional: some names genuinely have no single culture (pan-Hispanic given
 * names, the unverified `neutral` pools), and those fall back to the
 * region-wide surname pool.
 */
export interface CulturedName {
  name: string;
  culture?: string;
}

export type RealisticDataset = Record<RealisticPeriod, Record<Gender, CulturedName[]>>;

export type RealisticRegion =
  | "western_europe"
  | "eastern_europe"
  | "usa"
  | "latin_america"
  | "central_asia"
  | "india"
  | "japan"
  | "china";

export type RealisticCentury = "1300_1550" | "20th_century" | "21st_century";

export interface RealisticPeriodMeta {
  region: RealisticRegion;
  century: RealisticCentury;
}
