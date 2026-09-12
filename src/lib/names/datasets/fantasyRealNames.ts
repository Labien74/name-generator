import type { Gender } from "../types";

// Real historical/mythological names commonly borrowed by fantasy fiction
// (Norse, Celtic, Germanic, Arthurian, Greek) — public-domain names, not
// characters from any copyrighted work, blended in alongside the invented
// syllable-generated names for extra variety.
export const fantasyRealNames: Record<Gender, string[]> = {
  male: [
    "Alaric",
    "Cedric",
    "Osric",
    "Gideon",
    "Percival",
    "Tristan",
    "Roderick",
    "Leopold",
    "Magnus",
    "Torvald",
    "Ragnar",
    "Cassius",
    "Alistair",
  ],
  female: [
    "Rowena",
    "Elowen",
    "Seraphina",
    "Isolde",
    "Freya",
    "Morgana",
    "Guinevere",
    "Rosalind",
    "Vivienne",
    "Ophelia",
    "Elspeth",
    "Thora",
    "Celestine",
  ],
  neutral: ["Robin", "Quinn", "Rowan", "Ashwyn", "Sage", "Wren", "Briar"],
};
