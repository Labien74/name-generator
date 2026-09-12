import type { SyllableDataset } from "../types";

export const fantasyDataset: SyllableDataset = {
  male: {
    prefixes: ["Ar", "Bal", "Cor", "Dor", "Fen", "Gor", "Hal", "Ivor"],
    suffixes: ["dun", "rik", "wyn", "thas", "mir", "dor", "ian", "gard"],
  },
  female: {
    prefixes: ["Ael", "Bry", "Cyn", "Del", "Fael", "Gwen", "Isol", "Lyra"],
    suffixes: ["wen", "lia", "wyth", "dra", "issa", "wyn", "iel", "ara"],
  },
  neutral: {
    prefixes: ["Ash", "Bren", "Cal", "Dree", "Ely", "Fenn", "Gale", "Hesk"],
    suffixes: ["wyn", "ra", "dan", "lis", "mor", "ren", "wick", "dale"],
  },
};
