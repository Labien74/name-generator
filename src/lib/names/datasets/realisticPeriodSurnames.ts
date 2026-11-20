import type { RealisticPeriod } from "../types";

// Surnames tied to one specific period, overriding the region-wide pool in
// realisticSurnames.ts.
//
// The region-wide pools come from a modern dataset of popular surnames
// (mostly 2010s statistics), which is a poor match for pre-modern periods:
// it pairs a late medieval given name with whatever happens to be common in
// any of the 18 western European countries today. A period that has its own
// entry here uses it instead; periods with no entry keep the regional pool.
//
// Hand-curated, not imported — see data-import/README.md for why no open
// dataset of medieval names exists and what these lists are based on.
export const realisticPeriodSurnames: Partial<Record<RealisticPeriod, string[]>> = {
  western_europe_1300_1550: [
    // England — occupational and toponymic bynames that had become
    // hereditary surnames by this period.
    "Smith",
    "Wright",
    "Baker",
    "Fletcher",
    "Chandler",
    "Cooper",
    "Taylor",
    "Clerk",
    "Carter",
    "Miller",
    "Mason",
    "Webster",
    "Walker",
    "Chapman",
    "Forester",
    "Shepherd",
    "Thatcher",
    "Turner",
    "Palmer",
    "Sawyer",
    // France
    "le Fèvre",
    "du Bois",
    "Charpentier",
    "Boulanger",
    "Mercier",
    "Fournier",
    "Chastel",
    "de Beaumont",
    "de Montfort",
    "Lenoir",
    // German-speaking lands
    "Schmidt",
    "Müller",
    "Weber",
    "Becker",
    "Zimmermann",
    "Schneider",
    "Hoffmann",
    "Fischer",
    "Wagner",
    "Vogel",
    // Italy
    "Ferraro",
    "Fabbri",
    "Conti",
    "Marino",
    "Greco",
    "Bianchi",
    // Iberia — patronymic surnames, already hereditary by this period.
    "Rodríguez",
    "Fernández",
    "González",
    "Martínez",
    "Álvarez",
    "Núñez",
  ],
};
