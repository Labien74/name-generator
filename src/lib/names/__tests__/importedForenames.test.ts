import { describe, it, expect } from "vitest";
import importedForenames from "../data-import/imported-forenames.json";

const EXPECTED_REGIONS = ["western_europe", "eastern_europe", "usa", "latin_america"];

describe("imported-forenames.json (staging data, not wired into the app)", () => {
  it("has exactly the expected regions, each with non-empty F and M lists", () => {
    expect(Object.keys(importedForenames).sort()).toEqual(EXPECTED_REGIONS.sort());

    for (const region of EXPECTED_REGIONS) {
      const pool = (importedForenames as Record<string, { F: unknown[]; M: unknown[] }>)[region];
      expect(pool.F.length).toBeGreaterThan(0);
      expect(pool.M.length).toBeGreaterThan(0);
    }
  });

  it("every entry has a non-empty country code and name", () => {
    for (const region of EXPECTED_REGIONS) {
      const pool = (
        importedForenames as Record<string, { F: { country: string; name: string }[]; M: { country: string; name: string }[] }>
      )[region];

      for (const entry of [...pool.F, ...pool.M]) {
        expect(entry.country).toMatch(/^[A-Z]{2}$/);
        expect(entry.name.length).toBeGreaterThan(0);
      }
    }
  });
});
