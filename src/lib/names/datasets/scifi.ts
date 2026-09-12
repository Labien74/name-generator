import type { SyllableDataset } from "../types";

export const scifiDataset: SyllableDataset = {
  male: {
    prefixes: ["Zar", "Kade", "Thren", "Kryo", "Jaxx", "Voss", "Drex", "Orin"],
    suffixes: ["on", "ex", "ius", "ak", "en", "yx", "or", "ade"],
  },
  female: {
    prefixes: ["Zora", "Kira", "Nyra", "Sila", "Aria", "Vekka", "Xylo", "Rho"],
    suffixes: ["a", "ix", "essa", "yra", "ona", "ith", "eia", "ara"],
  },
  neutral: {
    prefixes: ["Ryn", "Zeta", "Novak", "Lexo", "Quor", "Veyn", "Arka", "Drix"],
    suffixes: ["en", "ix", "ael", "ax", "io", "el", "or", "yn"],
  },
};
