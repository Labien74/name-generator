import type { RealisticRegion } from "../types";
import importedSurnames from "../data-import/imported-surnames.json";

type ImportedEntry = { country: string; name: string };

const imported = importedSurnames as Record<string, ImportedEntry[]>;

// Surnames aren't tied to a century in the source dataset (it's not
// period-specific), so unlike first names they're pooled per region only —
// the same surname pool is reused across every century within a region.
export const realisticSurnames: Record<RealisticRegion, string[]> = {
  western_europe: imported.western_europe.map((entry) => entry.name),
  eastern_europe: imported.eastern_europe.map((entry) => entry.name),
  usa: imported.usa.map((entry) => entry.name),
  latin_america: imported.latin_america.map((entry) => entry.name),
  central_asia: imported.central_asia.map((entry) => entry.name),
  india: imported.india.map((entry) => entry.name),
  japan: imported.japan.map((entry) => entry.name),
  china: imported.china.map((entry) => entry.name),
};
