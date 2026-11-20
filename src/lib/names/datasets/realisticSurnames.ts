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

// The same imported data, grouped by country instead of flattened, so a given
// name can be paired with a surname from its own country.
//
// Country coverage differs between the two source files: CY (western Europe),
// KG and TJ (central Asia), PK (India) and several Latin American codes have
// forenames but no surnames, so they simply have no entry here and callers
// fall back to the flat regional pool above.
export const realisticSurnamesByCulture: Record<
  RealisticRegion,
  Record<string, string[]>
> = Object.fromEntries(
  (Object.keys(realisticSurnames) as RealisticRegion[]).map((region) => {
    const byCountry: Record<string, string[]> = {};
    for (const entry of imported[region]) {
      (byCountry[entry.country] ??= []).push(entry.name);
    }
    return [region, byCountry];
  })
) as Record<RealisticRegion, Record<string, string[]>>;
