export type Gender = "male" | "female" | "neutral";

export type Setting = "fantasy" | "realistic";

export interface SyllablePool {
  prefixes: string[];
  suffixes: string[];
}

export type SyllableDataset = Record<Gender, SyllablePool>;

export type RealisticPeriod =
  | "western_europe_600_1100"
  | "eastern_europe_600_1100"
  | "western_europe_1100_1300"
  | "eastern_europe_1100_1300"
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

export type RealisticCentury =
  | "600_1100"
  | "1100_1300"
  | "1300_1550"
  | "20th_century"
  | "21st_century";

/**
 * Which name formula and which titles a period uses.
 *
 * - `early_medieval` — no hereditary surnames yet. The second element of a
 *   name is a byname: a patronymic, a place, or a descriptive epithet.
 * - `late_medieval` — hereditary surnames exist, titles are period ones.
 * - `modern` — surnames and present-day professional titles.
 */
export type NameEra =
  | "early_medieval"
  | "high_medieval"
  | "late_medieval"
  | "modern";

export interface RealisticPeriodMeta {
  region: RealisticRegion;
  century: RealisticCentury;
  era: NameEra;
}

/**
 * How a byname is built for one culture in a period that has no hereditary
 * surnames. A culture usually offers several rules and one is drawn per name.
 */
export interface PatronymicByname {
  kind: "patronymic";
  /**
   * How the name of the father is turned into a patronymic, per gender of the
   * bearer: either wrapped in a particle ("mac Niall") or suffixed
   * ("Haraldsson"). No morphology is applied to the name of the father — see
   * data-import/README.md for that approximation.
   */
  male: { prefix?: string; suffix?: string };
  female: { prefix?: string; suffix?: string };
}

export interface ToponymicByname {
  kind: "toponymic";
  particle: string;
  places: string[];
}

export interface DescriptiveByname {
  kind: "descriptive";
  particle: string;
  epithets: string[];
}

export type BynameRule = PatronymicByname | ToponymicByname | DescriptiveByname;

export type RealisticBynames = Partial<
  Record<RealisticPeriod, Record<string, BynameRule[]>>
>;
