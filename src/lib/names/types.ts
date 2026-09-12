export type Gender = "male" | "female" | "neutral";

export type Setting = "fantasy" | "scifi" | "historical";

export interface SyllablePool {
  prefixes: string[];
  suffixes: string[];
}

export type SyllableDataset = Record<Gender, SyllablePool>;

export type HistoricalPeriod =
  | "western_europe_1200_1600"
  | "eastern_europe_1200_1600"
  | "western_europe_20th_century"
  | "eastern_europe_20th_century"
  | "usa_20th_century"
  | "latin_america_20th_century";

export type HistoricalDataset = Record<HistoricalPeriod, Record<Gender, string[]>>;

export type HistoricalRegion = "western_europe" | "eastern_europe" | "usa" | "latin_america";

export type HistoricalCentury = "1200_1600" | "20th_century";

export interface HistoricalPeriodMeta {
  region: HistoricalRegion;
  century: HistoricalCentury;
}
