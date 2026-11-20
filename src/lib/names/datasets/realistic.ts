import type { RealisticDataset, RealisticPeriod, RealisticPeriodMeta } from "../types";
import importedForenames from "../data-import/imported-forenames.json";

type ImportedEntry = { country: string; name: string };
type ImportedRegion = { F: ImportedEntry[]; M: ImportedEntry[] };

const imported = importedForenames as Record<string, ImportedRegion>;

function importedNames(region: string, genderKey: "F" | "M"): string[] {
  return imported[region][genderKey].map((entry) => entry.name);
}

export const realisticPeriodMeta: Record<RealisticPeriod, RealisticPeriodMeta> = {
  western_europe_1300_1550: { region: "western_europe", century: "1300_1550" },
  eastern_europe_1300_1550: { region: "eastern_europe", century: "1300_1550" },
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
  // Late medieval western Europe. The Christian name stock of this period was
  // small and heavily concentrated — in the English tax rolls of 1377-1381
  // John alone accounts for roughly a third of men — so these lists are close
  // to exhaustive rather than a sample. Hand-curated across England, France,
  // the German lands, Italy and Iberia; see data-import/README.md.
  western_europe_1300_1550: {
    male: [
      // England and Anglo-Norman
      "John", "William", "Thomas", "Richard", "Robert", "Henry", "Roger",
      "Walter", "Adam", "Nicholas", "Hugh", "Geoffrey", "Simon", "Ralph",
      "Gilbert", "Stephen", "Edmund", "Humphrey", "Lawrence", "Bartholomew",
      "Christopher", "Giles", "Miles", "Oliver",
      // France
      "Guillaume", "Jean", "Pierre", "Jacques", "Colin", "Gautier", "Thibault",
      "Raoul", "Girard", "Étienne", "Guy", "Hugues", "Renaud", "Denis",
      // German-speaking lands
      "Hans", "Heinrich", "Konrad", "Dietrich", "Ulrich", "Albrecht",
      "Friedrich", "Hermann", "Jakob", "Kaspar",
      // Italy
      "Giovanni", "Antonio", "Francesco", "Niccolò", "Lorenzo", "Matteo",
      "Bartolomeo", "Domenico",
      // Iberia
      "Juan", "Pedro", "Alfonso", "Diego", "Rodrigo", "Fernando", "Gonzalo",
      "Sancho",
    ],
    female: [
      // England and Anglo-Norman
      "Alice", "Agnes", "Joan", "Matilda", "Isabel", "Margaret", "Margery",
      "Emma", "Cecily", "Juliana", "Elizabeth", "Katherine", "Eleanor",
      "Beatrice", "Avice", "Maud", "Edith", "Anne", "Alison",
      // France
      "Jeanne", "Marguerite", "Isabeau", "Perrette", "Colette", "Jacquette",
      "Marie", "Mahaut", "Blanche", "Agnès",
      // German-speaking lands
      "Anna", "Margarethe", "Elsbeth", "Barbara", "Ursula", "Gertrud",
      "Kunigunde", "Adelheid",
      // Italy
      "Caterina", "Francesca", "Lucia", "Maddalena", "Antonia", "Lisabetta",
      "Bartolomea",
      // Iberia
      "Juana", "María", "Constanza", "Leonor", "Teresa", "Mencía",
    ],
    // Inherited from the earlier dataset and NOT verified: medieval European
    // given names were strongly gendered and there is no real epicene pool
    // for this period. The PRD calls for disabling the neutral option on
    // pre-19th-century periods; until that lands, these stay as a placeholder.
    neutral: ["Robin", "Jocelyn", "Avery", "Evelyn"],
  },
  eastern_europe_1300_1550: {
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
