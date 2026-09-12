export type Gender = "male" | "female" | "neutral";

export type Setting = "fantasy" | "scifi" | "realistic";

export interface SyllablePool {
  prefixes: string[];
  suffixes: string[];
}

export type SyllableDataset = Record<Gender, SyllablePool>;

export type RealisticPeriod =
  | "western_europe_1200_1600"
  | "eastern_europe_1200_1600"
  | "western_europe_20th_century"
  | "eastern_europe_20th_century"
  | "usa_20th_century"
  | "latin_america_20th_century";

export type RealisticDataset = Record<RealisticPeriod, Record<Gender, string[]>>;

export type RealisticRegion = "western_europe" | "eastern_europe" | "usa" | "latin_america";

export type RealisticCentury = "1200_1600" | "20th_century";

export interface RealisticPeriodMeta {
  region: RealisticRegion;
  century: RealisticCentury;
}
