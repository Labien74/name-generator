import type {
  CulturedName,
  RealisticDataset,
  RealisticPeriod,
  RealisticPeriodMeta,
} from "../types";
import importedForenames from "../data-import/imported-forenames.json";

type ImportedEntry = { country: string; name: string };
type ImportedRegion = { F: ImportedEntry[]; M: ImportedEntry[] };

const imported = importedForenames as Record<string, ImportedRegion>;

// Imported names carry the country from the source dataset as their culture,
// so the surname can usually be drawn from the same country rather than from
// the whole region.
function importedNames(region: string, genderKey: "F" | "M"): CulturedName[] {
  return imported[region][genderKey].map((entry) => ({
    name: entry.name,
    culture: entry.country,
  }));
}

// Tags a block of hand-written names with one culture.
function tag(culture: string, names: string[]): CulturedName[] {
  return names.map((name) => ({ name, culture }));
}

// Names with no single culture — pan-regional given names and the unverified
// neutral pools. These always use the region-wide surname pool.
function untagged(names: string[]): CulturedName[] {
  return names.map((name) => ({ name }));
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
  //
  // Cultures here are slugs, not ISO codes: the matching surname pools live in
  // realisticPeriodSurnames.ts under the same slugs.
  western_europe_1300_1550: {
    male: [
      ...tag("england", [
        "John", "William", "Thomas", "Richard", "Robert", "Henry", "Roger",
        "Walter", "Adam", "Nicholas", "Hugh", "Geoffrey", "Simon", "Ralph",
        "Gilbert", "Stephen", "Edmund", "Humphrey", "Lawrence", "Bartholomew",
        "Christopher", "Giles", "Miles", "Oliver",
      ]),
      ...tag("france", [
        "Guillaume", "Jean", "Pierre", "Jacques", "Colin", "Gautier", "Thibault",
        "Raoul", "Girard", "Étienne", "Guy", "Hugues", "Renaud", "Denis",
      ]),
      ...tag("german", [
        "Hans", "Heinrich", "Konrad", "Dietrich", "Ulrich", "Albrecht",
        "Friedrich", "Hermann", "Jakob", "Kaspar",
      ]),
      ...tag("italy", [
        "Giovanni", "Antonio", "Francesco", "Niccolò", "Lorenzo", "Matteo",
        "Bartolomeo", "Domenico",
      ]),
      ...tag("iberia", [
        "Juan", "Pedro", "Alfonso", "Diego", "Rodrigo", "Fernando", "Gonzalo",
        "Sancho",
      ]),
    ],
    female: [
      ...tag("england", [
        "Alice", "Agnes", "Joan", "Matilda", "Isabel", "Margaret", "Margery",
        "Emma", "Cecily", "Juliana", "Elizabeth", "Katherine", "Eleanor",
        "Beatrice", "Avice", "Maud", "Edith", "Anne", "Alison",
      ]),
      ...tag("france", [
        "Jeanne", "Marguerite", "Isabeau", "Perrette", "Colette", "Jacquette",
        "Marie", "Mahaut", "Blanche", "Agnès",
      ]),
      ...tag("german", [
        "Anna", "Margarethe", "Elsbeth", "Barbara", "Ursula", "Gertrud",
        "Kunigunde", "Adelheid",
      ]),
      ...tag("italy", [
        "Caterina", "Francesca", "Lucia", "Maddalena", "Antonia", "Lisabetta",
        "Bartolomea",
      ]),
      ...tag("iberia", [
        "Juana", "María", "Constanza", "Leonor", "Teresa", "Mencía",
      ]),
    ],
    // Inherited from the earlier dataset and NOT verified: medieval European
    // given names were strongly gendered and there is no real epicene pool
    // for this period. The PRD calls for disabling the neutral option on
    // pre-19th-century periods; until that lands, these stay as a placeholder.
    neutral: untagged(["Robin", "Jocelyn", "Avery", "Evelyn"]),
  },

  // Historical slugs again. No period surname pool exists for eastern Europe
  // yet, so these fall back to the region-wide pool — the same behaviour as
  // before the culture tagging. The tags are here so a period pool can be
  // added later without touching the names.
  eastern_europe_1300_1550: {
    male: [
      ...tag("poland", ["Casimir", "Stanislav"]),
      ...tag("bohemia", ["Miroslav", "Vladislav", "Jaromir", "Ottokar"]),
      ...tag("hungary", ["Ladislaus"]),
      ...tag("rus", ["Bogdan"]),
    ],
    female: [
      ...tag("poland", ["Zofia", "Jadwiga", "Wanda"]),
      ...tag("bohemia", ["Dobrava", "Kunigunde", "Ludmila"]),
      ...tag("serbia", ["Milica"]),
      ...tag("rus", ["Anastasia"]),
    ],
    neutral: untagged(["Bogdana", "Dragomir", "Miloslav", "Zorislava"]),
  },

  // 20th-century periods are hand-picked but tagged with ISO country codes,
  // the same keys the region-wide surname pools use — so these pair by
  // country for free.
  western_europe_20th_century: {
    male: [
      ...tag("DE", ["Heinrich", "Klaus", "Hans", "Werner"]),
      ...tag("FR", ["Jean", "Pierre"]),
      ...tag("IT", ["Giovanni", "Luigi"]),
    ],
    female: [
      ...tag("DE", ["Brigitte", "Greta", "Elsa", "Renate"]),
      ...tag("FR", ["Margot", "Simone"]),
      ...tag("IT", ["Francesca"]),
      ...tag("NO", ["Ingrid"]),
    ],
    neutral: untagged(["Jean", "Andrea", "Kim", "Noel"]),
  },
  eastern_europe_20th_century: {
    male: [
      ...tag("RU", ["Ivan", "Dmitri", "Viktor"]),
      ...tag("PL", ["Andrzej", "Tomasz"]),
      ...tag("CZ", ["Karel"]),
      ...tag("HU", ["Zoltán"]),
      ...tag("RO", ["Mihai"]),
    ],
    female: [
      ...tag("RU", ["Natasha", "Elena", "Olga"]),
      ...tag("PL", ["Katarzyna", "Irena", "Magda"]),
      ...tag("HU", ["Zsófia"]),
      ...tag("SI", ["Vesna"]),
    ],
    neutral: untagged(["Sasha", "Jovan", "Nikola", "Dragan"]),
  },
  usa_20th_century: {
    male: tag("US", [
      "Walter", "Harold", "Frank", "Raymond", "Eugene", "Arthur", "Clarence",
      "Elmer",
    ]),
    female: tag("US", [
      "Dorothy", "Mildred", "Betty", "Shirley", "Doris", "Helen", "Evelyn",
      "Gladys",
    ]),
    neutral: untagged(["Francis", "Marion", "Leslie", "Jordan"]),
  },
  // Deliberately untagged: these are pan-Hispanic given names used across the
  // whole region, so pinning each one to a single country would be invention.
  // They keep using the region-wide surname pool.
  latin_america_20th_century: {
    male: untagged([
      "Carlos", "Miguel", "Rafael", "Eduardo", "Fernando", "Ricardo", "Diego",
      "Alejandro",
    ]),
    female: untagged([
      "María", "Carmen", "Isabel", "Lucía", "Gabriela", "Rosa", "Adriana",
      "Valentina",
    ]),
    neutral: untagged(["Guadalupe", "Trinidad", "Cruz", "Ángel"]),
  },

  // 21st-century periods below are built from a real CC0-licensed dataset
  // (popular given names by country, mostly 2010s) rather than hand-picked —
  // see src/lib/names/data-import/README.md for source, license, and scope.
  // "neutral" has no source data (the dataset is F/M only) and is hand-picked.
  western_europe_21st_century: {
    male: importedNames("western_europe", "M"),
    female: importedNames("western_europe", "F"),
    neutral: untagged(["Charlie", "Alex", "Sam", "Noor"]),
  },
  eastern_europe_21st_century: {
    male: importedNames("eastern_europe", "M"),
    female: importedNames("eastern_europe", "F"),
    neutral: untagged(["Sasha", "Vanya", "Zlata", "Miron"]),
  },
  usa_21st_century: {
    male: importedNames("usa", "M"),
    female: importedNames("usa", "F"),
    neutral: untagged(["Jordan", "Riley", "Avery", "Rowan"]),
  },
  latin_america_21st_century: {
    male: importedNames("latin_america", "M"),
    female: importedNames("latin_america", "F"),
    neutral: untagged(["Ángel", "Cruz", "Guadalupe", "Trinidad"]),
  },
  central_asia_21st_century: {
    male: importedNames("central_asia", "M"),
    female: importedNames("central_asia", "F"),
    neutral: untagged(["Ayan", "Nurlan", "Dinara", "Aidos"]),
  },
  india_21st_century: {
    male: importedNames("india", "M"),
    female: importedNames("india", "F"),
    neutral: untagged(["Kiran", "Amrit", "Simran", "Jyot"]),
  },
  japan_21st_century: {
    male: importedNames("japan", "M"),
    female: importedNames("japan", "F"),
    neutral: untagged(["Hikari", "Kaoru", "Makoto", "Sora"]),
  },
  china_21st_century: {
    male: importedNames("china", "M"),
    female: importedNames("china", "F"),
    neutral: untagged(["Yang", "Wei", "Jun", "Min"]),
  },
};
