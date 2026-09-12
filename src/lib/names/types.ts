export type Gender = "male" | "female" | "neutral";

export type Setting = "fantasy";

export interface SyllablePool {
  prefixes: string[];
  suffixes: string[];
}

export type SettingDataset = Record<Gender, SyllablePool>;
