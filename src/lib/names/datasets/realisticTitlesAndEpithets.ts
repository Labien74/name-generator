import type { NameEra } from "../types";

// Hand-picked, not from an external dataset — real-world titles of each era
// and the historical "byname" convention (Peter the Great, Richard the
// Lionheart, Ivan the Terrible) rather than fantasy-style epithets.
//
// Titles are split by era because one flat list produced anachronisms: the
// generator was happily handing out "Detective" and "Professor" to people
// born in 1400.
export const realisticTitlesByEra: Record<NameEra, string[]> = {
  early_medieval: [
    "Ealdorman",
    "Thegn",
    "Jarl",
    "Abbot",
    "Bishop",
    "Reeve",
    "Chieftain",
    "Steward",
    "Priest",
    "Huscarl",
    "Skald",
    "King",
  ],
  high_medieval: [
    "Lord",
    "Sir",
    "Knight",
    "Prior",
    "Canon",
    "Deacon",
    "Marshal",
    "Seneschal",
    "Burgess",
    "Provost",
    "Chaplain",
    "Castellan",
  ],
  late_medieval: [
    "Master",
    "Sir",
    "Friar",
    "Abbot",
    "Bishop",
    "Alderman",
    "Sheriff",
    "Bailiff",
    "Squire",
    "Herald",
    "Chancellor",
    "Constable",
  ],
  early_modern: [
    "Master",
    "Mistress",
    "Goodman",
    "Goodwife",
    "Reverend",
    "Doctor",
    "Captain",
    "Alderman",
    "Magistrate",
    "Parson",
    "Squire",
    "Burgomaster",
  ],
  modern: [
    "Dr.",
    "Professor",
    "Captain",
    "Judge",
    "Detective",
    "Officer",
    "Reverend",
    "Chief",
    "Coach",
    "Ambassador",
  ],
};

export const realisticEpithets: string[] = [
  "the Great",
  "the Bold",
  "the Wise",
  "the Fair",
  "the Lionheart",
  "the Terrible",
  "the Younger",
  "the Elder",
  "the Conqueror",
  "the Good",
  "the Just",
  "the Unready",
];
