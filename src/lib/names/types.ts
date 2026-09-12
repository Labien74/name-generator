export type Gender = "male" | "female" | "neutral";

export type Setting = "fantasy" | "scifi";

export interface SyllablePool {
  prefixes: string[];
  suffixes: string[];
}

export type SyllableDataset = Record<Gender, SyllablePool>;
