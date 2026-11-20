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

const EARLY = "early_medieval" as const;
const LATE = "late_medieval" as const;
const MODERN = "modern" as const;

export const realisticPeriodMeta: Record<RealisticPeriod, RealisticPeriodMeta> = {
  western_europe_600_1100: { region: "western_europe", century: "600_1100", era: EARLY },
  eastern_europe_600_1100: { region: "eastern_europe", century: "600_1100", era: EARLY },
  western_europe_1300_1550: { region: "western_europe", century: "1300_1550", era: LATE },
  eastern_europe_1300_1550: { region: "eastern_europe", century: "1300_1550", era: LATE },
  western_europe_20th_century: { region: "western_europe", century: "20th_century", era: MODERN },
  eastern_europe_20th_century: { region: "eastern_europe", century: "20th_century", era: MODERN },
  usa_20th_century: { region: "usa", century: "20th_century", era: MODERN },
  latin_america_20th_century: { region: "latin_america", century: "20th_century", era: MODERN },
  western_europe_21st_century: { region: "western_europe", century: "21st_century", era: MODERN },
  eastern_europe_21st_century: { region: "eastern_europe", century: "21st_century", era: MODERN },
  usa_21st_century: { region: "usa", century: "21st_century", era: MODERN },
  latin_america_21st_century: { region: "latin_america", century: "21st_century", era: MODERN },
  central_asia_21st_century: { region: "central_asia", century: "21st_century", era: MODERN },
  india_21st_century: { region: "india", century: "21st_century", era: MODERN },
  japan_21st_century: { region: "japan", century: "21st_century", era: MODERN },
  china_21st_century: { region: "china", century: "21st_century", era: MODERN },
};

export const realisticDataset: RealisticDataset = {
  // Early medieval western Europe: the Germanic, Norse and Gaelic name stock
  // that the Christian saint names of 1300-1550 later displaced. Nobody here
  // has a surname — see realisticBynames.ts for what goes in its place.
  //
  // The cultures are deliberately kept apart because they share almost
  // nothing: Æthelred, Harald, Chlodovech and Diarmait belong to four
  // different naming worlds that happened to sit next to each other.
  western_europe_600_1100: {
    male: [
      ...tag("anglo_saxon", [
        "Æthelred", "Eadric", "Wulfstan", "Leofric", "Godwine", "Ælfric",
        "Beorhtric", "Cuthbert", "Dunstan", "Eadmund", "Oswald", "Osric",
        "Sigeric", "Wulfric", "Beornwulf", "Ceolwulf", "Eadwig", "Ælfheah",
        "Æthelstan", "Byrhtnoth", "Hereward", "Wiglaf", "Swithun", "Eadgar",
      ]),
      ...tag("norse", [
        "Eirik", "Harald", "Bjorn", "Sigurd", "Olaf", "Ragnar", "Thorvald",
        "Gunnar", "Ivar", "Halfdan", "Leif", "Ketil", "Sten", "Ulf", "Rolf",
        "Arnbjorn", "Thorstein", "Egil", "Grim", "Hakon", "Sigvaldi", "Ottar",
      ]),
      ...tag("frankish", [
        "Chlodovech", "Charles", "Pepin", "Bernard", "Gerard", "Hildebrand",
        "Lothar", "Theuderic", "Sigibert", "Childeric", "Arnulf", "Ansgar",
        "Berengar", "Dagobert", "Gislebert", "Guntram", "Odo", "Ratbod",
        "Wichard", "Fulk",
      ]),
      ...tag("gaelic", [
        "Áed", "Niall", "Diarmait", "Conchobar", "Domnall", "Cormac",
        "Muirchertach", "Flann", "Ruaidrí", "Brian", "Cathal", "Fergal",
        "Lorcán", "Tadg", "Eógan", "Donnchad", "Sitriuc", "Óengus",
      ]),
    ],
    female: [
      ...tag("anglo_saxon", [
        "Æthelflæd", "Eadgifu", "Ælfgifu", "Wulfrun", "Godgifu", "Cwenburh",
        "Eadburh", "Hildeburh", "Leofgifu", "Mildthryth", "Osgifu", "Sæthryth",
        "Wulfgifu", "Æthelthryth", "Beorhtgifu", "Eanflæd", "Hereswith",
        "Seaxburh",
      ]),
      ...tag("norse", [
        "Astrid", "Gudrun", "Sigrid", "Thora", "Helga", "Ingrid", "Ragnhild",
        "Asa", "Freydis", "Hallgerd", "Jorunn", "Solveig", "Thyra", "Unn",
        "Yrsa", "Bergljot",
      ]),
      ...tag("frankish", [
        "Bertrada", "Hildegard", "Gisela", "Rotrude", "Ermengard", "Judith",
        "Adelheid", "Clotilde", "Fredegund", "Brunhild", "Richildis",
        "Theodrada", "Waldrada", "Emma", "Bertha",
      ]),
      ...tag("gaelic", [
        "Gormlaith", "Dervorgilla", "Mór", "Sadb", "Órlaith", "Lassar",
        "Muirenn", "Ailbe", "Cacht", "Findabair", "Étaín", "Eithne", "Rónnat",
        "Bébinn",
      ]),
    ],
    // Same placeholder problem as the other pre-modern cells: these name
    // stocks were strongly gendered and had no epicene pool. Kept only so the
    // option is not empty; the PRD calls for disabling it on pre-19th-century
    // periods outright.
    neutral: untagged(["Sigrun", "Alfwyn", "Ethelwyn", "Mael"]),
  },

  // Early medieval eastern Europe: the pre-Christian and early Christian
  // Slavic name stock, built mostly from two-part compounds the same way the
  // Germanic names are (slav = glory, mir = peace, volod = rule).
  eastern_europe_600_1100: {
    male: [
      ...tag("rus", [
        "Vladimir", "Yaroslav", "Svyatoslav", "Mstislav", "Izyaslav",
        "Vsevolod", "Rostislav", "Oleg", "Igor", "Gleb", "Boris", "Dobrynya",
        "Ratibor", "Putyata", "Volodar", "Bryachislav", "Vyacheslav",
        "Sudislav",
      ]),
      ...tag("poland", [
        "Mieszko", "Boleslaw", "Kazimierz", "Wladyslaw", "Zbigniew",
        "Siemowit", "Lestek", "Przemysl", "Dobromir", "Radzim", "Sobieslaw",
        "Wszebor", "Gniewomir", "Warcislaw",
      ]),
      ...tag("bohemia", [
        "Vratislav", "Borivoj", "Spytihnev", "Sobeslav", "Udalrich",
        "Bretislav", "Nezamysl", "Krok", "Hostivit", "Mnata", "Vojen",
        "Oldrich",
      ]),
      ...tag("serbia", [
        "Vlastimir", "Mutimir", "Caslav", "Strojimir", "Gojnik", "Pribislav",
        "Klonimir", "Tihomir", "Zavida", "Desa",
      ]),
    ],
    female: [
      ...tag("rus", [
        "Olga", "Malusha", "Predslava", "Rogneda", "Yaroslava", "Zvenislava",
        "Verkhuslava", "Sbyslava", "Gorislava", "Mstislava", "Peredslava",
        "Dobronega",
      ]),
      ...tag("poland", [
        "Dobrawa", "Swietoslawa", "Rycheza", "Zwinislawa", "Wyszeslawa",
        "Dobroniega", "Bogna", "Miloslawa", "Bozena", "Sieciecha",
      ]),
      ...tag("bohemia", [
        "Libuse", "Drahomira", "Ludmila", "Vlasta", "Kazi", "Teta", "Svatava",
        "Hedvika",
      ]),
      ...tag("serbia", [
        "Jelena", "Vojislava", "Radoslava", "Desislava", "Ljubica", "Zorka",
        "Vida", "Mirjana",
      ]),
    ],
    // Same placeholder problem as the other pre-modern cells.
    neutral: untagged(["Slavomir", "Bogdana", "Miroslava", "Zorislav"]),
  },

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
      ...tag("poland", [
        "Casimir", "Stanislav", "Wladyslaw", "Jan", "Mikolaj", "Piotr",
        "Andrzej", "Jakub", "Marcin", "Wojciech",
      ]),
      ...tag("bohemia", [
        "Miroslav", "Vladislav", "Jaromir", "Ottokar", "Vaclav", "Jiri",
        "Petr", "Tomas", "Matej", "Zdenek",
      ]),
      ...tag("hungary", [
        "Ladislaus", "Istvan", "Bela", "Geza", "Lajos", "Matyas", "Janos",
        "Imre",
      ]),
      ...tag("rus", [
        "Bogdan", "Ivan", "Vasily", "Fyodor", "Andrei", "Mikhail", "Semyon",
        "Timofey",
      ]),
      ...tag("serbia", ["Stefan", "Lazar", "Vuk", "Milos", "Djuradj", "Nikola"]),
    ],
    female: [
      ...tag("poland", [
        "Zofia", "Jadwiga", "Wanda", "Katarzyna", "Agnieszka", "Malgorzata",
        "Barbara", "Elzbieta",
      ]),
      ...tag("bohemia", [
        "Dobrava", "Kunigunde", "Ludmila", "Anezka", "Katerina", "Marketa",
        "Zdenka",
      ]),
      ...tag("serbia", ["Milica", "Jelena", "Mara", "Olivera", "Despina"]),
      ...tag("rus", [
        "Anastasia", "Evdokia", "Maria", "Agrafena", "Vasilisa", "Praskovya",
      ]),
      ...tag("hungary", [
        "Erzsebet", "Margit", "Ilona", "Katalin", "Borbala", "Zsofia",
      ]),
    ],
    neutral: untagged(["Bogdana", "Dragomir", "Miloslav", "Zorislava"]),
  },

  // 20th-century periods are hand-picked but tagged with ISO country codes,
  // the same keys the region-wide surname pools use — so these pair by
  // country for free.
  western_europe_20th_century: {
    male: [
      ...tag("DE", [
        "Heinrich", "Klaus", "Hans", "Werner", "Günther", "Helmut", "Dieter",
        "Wolfgang", "Horst", "Manfred",
      ]),
      ...tag("FR", [
        "Jean", "Pierre", "André", "Michel", "Jacques", "Robert", "Henri",
        "Marcel",
      ]),
      ...tag("IT", [
        "Giovanni", "Luigi", "Giuseppe", "Salvatore", "Franco", "Mario",
        "Carlo", "Bruno",
      ]),
      ...tag("ES", [
        "José", "Manuel", "Francisco", "Jesús", "Rafael", "Enrique",
      ]),
      ...tag("GB", [
        "Albert", "Harold", "Reginald", "Cyril", "Stanley", "Norman",
        "Leonard", "Alfred",
      ]),
    ],
    female: [
      ...tag("DE", [
        "Brigitte", "Greta", "Elsa", "Renate", "Ursula", "Helga", "Gisela",
        "Ingeborg", "Hannelore",
      ]),
      ...tag("FR", [
        "Margot", "Simone", "Jacqueline", "Monique", "Colette", "Yvonne",
        "Denise",
      ]),
      ...tag("IT", [
        "Francesca", "Giuseppina", "Rosa", "Angela", "Carmela", "Teresa",
      ]),
      ...tag("ES", ["Carmen", "Pilar", "Dolores", "Josefa", "Concepción"]),
      ...tag("NO", ["Ingrid", "Solveig", "Astrid", "Liv"]),
      ...tag("GB", [
        "Doris", "Vera", "Joyce", "Edith", "Marjorie", "Gwendolyn",
      ]),
    ],
    neutral: untagged(["Jean", "Andrea", "Kim", "Noel"]),
  },
  eastern_europe_20th_century: {
    male: [
      ...tag("RU", [
        "Ivan", "Dmitri", "Viktor", "Nikolai", "Sergei", "Vladimir", "Boris",
        "Yuri", "Pavel", "Anatoly",
      ]),
      ...tag("PL", [
        "Andrzej", "Tomasz", "Zbigniew", "Jerzy", "Stanislaw", "Henryk",
        "Ryszard", "Marek",
      ]),
      ...tag("CZ", [
        "Karel", "Jaroslav", "Milos", "Vaclav", "Zdenek", "Frantisek",
      ]),
      ...tag("HU", ["Zoltán", "László", "Ferenc", "Gábor", "Attila", "Sándor"]),
      ...tag("RO", ["Mihai", "Ion", "Gheorghe", "Nicolae", "Vasile"]),
      ...tag("BG", ["Georgi", "Dimitar", "Todor", "Stoyan", "Kiril"]),
    ],
    female: [
      ...tag("RU", [
        "Natasha", "Elena", "Olga", "Galina", "Tatiana", "Svetlana",
        "Lyudmila", "Nina", "Valentina",
      ]),
      ...tag("PL", [
        "Katarzyna", "Irena", "Magda", "Halina", "Danuta", "Krystyna",
        "Bozena",
      ]),
      ...tag("HU", ["Zsófia", "Erzsébet", "Ildikó", "Márta", "Piroska"]),
      ...tag("SI", ["Vesna", "Mojca", "Metka", "Darja"]),
      ...tag("CZ", ["Jarmila", "Vera", "Hana", "Libuse", "Dagmar"]),
      ...tag("RO", ["Ioana", "Aurelia", "Lenuta", "Rodica"]),
    ],
    neutral: untagged(["Sasha", "Jovan", "Nikola", "Dragan"]),
  },
  usa_20th_century: {
    male: tag("US", [
      "Walter", "Harold", "Frank", "Raymond", "Eugene", "Arthur", "Clarence",
      "Elmer", "Earl", "Howard", "Chester", "Leonard", "Vernon", "Floyd",
      "Herbert", "Melvin", "Norman", "Glenn", "Lyle", "Marvin", "Wendell",
      "Delbert", "Orville", "Virgil", "Warren", "Leroy", "Dale", "Clifford",
      "Roscoe", "Alton",
    ]),
    female: tag("US", [
      "Dorothy", "Mildred", "Betty", "Shirley", "Doris", "Helen", "Evelyn",
      "Gladys", "Bernice", "Lorraine", "Marjorie", "Geraldine", "Eileen",
      "Phyllis", "Thelma", "Wanda", "Darlene", "Joyce", "Lois", "Virginia",
      "Arlene", "Beverly", "Rosemary", "Harriet", "Maxine", "Edna", "Opal",
      "Vivian", "Marlene", "Juanita",
    ]),
    neutral: untagged(["Francis", "Marion", "Leslie", "Jordan"]),
  },
  // Deliberately untagged: these are pan-Hispanic given names used across the
  // whole region, so pinning each one to a single country would be invention.
  // They keep using the region-wide surname pool.
  latin_america_20th_century: {
    male: untagged([
      "Carlos", "Miguel", "Rafael", "Eduardo", "Fernando", "Ricardo", "Diego",
      "Alejandro", "Jorge", "Luis", "Javier", "Roberto", "Sergio", "Oscar",
      "Héctor", "Ramón", "Alberto", "Gustavo", "Arturo", "Ernesto",
      "Mauricio", "Julio", "Hernán", "Octavio", "Rodolfo", "Salvador",
      "Emilio", "Ignacio", "Rogelio", "Efraín",
    ]),
    female: untagged([
      "María", "Carmen", "Isabel", "Lucía", "Gabriela", "Rosa", "Adriana",
      "Valentina", "Teresa", "Beatriz", "Mercedes", "Elena", "Patricia",
      "Alicia", "Silvia", "Marisol", "Dolores", "Esperanza", "Consuelo",
      "Lourdes", "Graciela", "Norma", "Blanca", "Yolanda", "Soledad", "Pilar",
      "Amparo", "Rocío", "Estela", "Mariela",
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
