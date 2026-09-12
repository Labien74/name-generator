import type { RealisticDataset, RealisticPeriod, RealisticPeriodMeta } from "../types";
import importedForenames from "../data-import/imported-forenames.json";

type ImportedEntry = { country: string; name: string };
type ImportedRegion = { F: ImportedEntry[]; M: ImportedEntry[] };

const imported = importedForenames as Record<string, ImportedRegion>;

function importedNames(region: string, genderKey: "F" | "M"): string[] {
  return imported[region][genderKey].map((entry) => entry.name);
}

export const realisticPeriodMeta: Record<RealisticPeriod, RealisticPeriodMeta> = {
  western_europe_1200_1600: { region: "western_europe", century: "1200_1600" },
  eastern_europe_1200_1600: { region: "eastern_europe", century: "1200_1600" },
  western_europe_20th_century: { region: "western_europe", century: "20th_century" },
  eastern_europe_20th_century: { region: "eastern_europe", century: "20th_century" },
  usa_20th_century: { region: "usa", century: "20th_century" },
  latin_america_20th_century: { region: "latin_america", century: "20th_century" },
  western_europe_21st_century: { region: "western_europe", century: "21st_century" },
  eastern_europe_21st_century: { region: "eastern_europe", century: "21st_century" },
  usa_21st_century: { region: "usa", century: "21st_century" },
  latin_america_21st_century: { region: "latin_america", century: "21st_century" },
  central_asia_21st_century: { region: "central_asia", century: "21st_century" },
  india_21st_century: { region: "india", century: "21st_century" },
  japan_21st_century: { region: "japan", century: "21st_century" },
  china_21st_century: { region: "china", century: "21st_century" },
};

export const realisticDataset: RealisticDataset = {
  western_europe_1200_1600: {
    male: ["Guillaume", "Henri", "Baldwin", "Conrad", "Frederick", "Edmund", "Geoffrey", "Lucas"],
    female: ["Isabeau", "Eleanor", "Beatrice", "Constance", "Mathilde", "Adelaide", "Blanche", "Catherine"],
    neutral: ["Robin", "Jocelyn", "Avery", "Evelyn"],
  },
  eastern_europe_1200_1600: {
    male: ["Bogdan", "Miroslav", "Casimir", "Vladislav", "Jaromir", "Ladislaus", "Stanislav", "Ottokar"],
    female: ["Zofia", "Jadwiga", "Milica", "Anastasia", "Wanda", "Dobrava", "Kunigunde", "Ludmila"],
    neutral: ["Bogdana", "Dragomir", "Miloslav", "Zorislava"],
  },
  western_europe_20th_century: {
    male: ["Heinrich", "Jean", "Giovanni", "Klaus", "Pierre", "Hans", "Luigi", "Werner"],
    female: ["Ingrid", "Brigitte", "Francesca", "Greta", "Margot", "Elsa", "Simone", "Renate"],
    neutral: ["Jean", "Andrea", "Kim", "Noel"],
  },
  eastern_europe_20th_century: {
    male: ["Ivan", "Dmitri", "Andrzej", "Tomasz", "Viktor", "Karel", "Zoltán", "Mihai"],
    female: ["Natasha", "Katarzyna", "Elena", "Irena", "Zsófia", "Magda", "Vesna", "Olga"],
    neutral: ["Sasha", "Jovan", "Nikola", "Dragan"],
  },
  usa_20th_century: {
    male: ["Walter", "Harold", "Frank", "Raymond", "Eugene", "Arthur", "Clarence", "Elmer"],
    female: ["Dorothy", "Mildred", "Betty", "Shirley", "Doris", "Helen", "Evelyn", "Gladys"],
    neutral: ["Francis", "Marion", "Leslie", "Jordan"],
  },
  latin_america_20th_century: {
    male: ["Carlos", "Miguel", "Rafael", "Eduardo", "Fernando", "Ricardo", "Diego", "Alejandro"],
    female: ["María", "Carmen", "Isabel", "Lucía", "Gabriela", "Rosa", "Adriana", "Valentina"],
    neutral: ["Guadalupe", "Trinidad", "Cruz", "Ángel"],
  },

  // 21st-century periods below are built from a real CC0-licensed dataset
  // (popular given names by country, mostly 2010s) rather than hand-picked —
  // see src/lib/names/data-import/README.md for source, license, and scope.
  // "neutral" has no source data (the dataset is F/M only) and is hand-picked.
  western_europe_21st_century: {
    male: importedNames("western_europe", "M"),
    female: importedNames("western_europe", "F"),
    neutral: ["Charlie", "Alex", "Sam", "Noor"],
  },
  eastern_europe_21st_century: {
    male: importedNames("eastern_europe", "M"),
    female: importedNames("eastern_europe", "F"),
    neutral: ["Sasha", "Vanya", "Zlata", "Miron"],
  },
  usa_21st_century: {
    male: importedNames("usa", "M"),
    female: importedNames("usa", "F"),
    neutral: ["Jordan", "Riley", "Avery", "Rowan"],
  },
  latin_america_21st_century: {
    male: importedNames("latin_america", "M"),
    female: importedNames("latin_america", "F"),
    neutral: ["Ángel", "Cruz", "Guadalupe", "Trinidad"],
  },
  central_asia_21st_century: {
    male: importedNames("central_asia", "M"),
    female: importedNames("central_asia", "F"),
    neutral: ["Ayan", "Nurlan", "Dinara", "Aidos"],
  },
  india_21st_century: {
    male: importedNames("india", "M"),
    female: importedNames("india", "F"),
    neutral: ["Kiran", "Amrit", "Simran", "Jyot"],
  },
  japan_21st_century: {
    male: importedNames("japan", "M"),
    female: importedNames("japan", "F"),
    neutral: ["Hikari", "Kaoru", "Makoto", "Sora"],
  },
  china_21st_century: {
    male: importedNames("china", "M"),
    female: importedNames("china", "F"),
    neutral: ["Yang", "Wei", "Jun", "Min"],
  },
};
