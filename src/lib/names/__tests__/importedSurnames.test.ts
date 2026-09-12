import { describe, it, expect } from "vitest";
import importedSurnames from "../data-import/imported-surnames.json";

const EXPECTED_REGIONS = [
  "western_europe",
  "eastern_europe",
  "usa",
  "latin_america",
  "central_asia",
  "india",
  "japan",
  "china",
];

describe("imported-surnames.json", () => {
  it("has exactly the expected regions, each with a non-empty surname list", () => {
    expect(Object.keys(importedSurnames).sort()).toEqual(EXPECTED_REGIONS.sort());

    for (const region of EXPECTED_REGIONS) {
      const list = (importedSurnames as Record<string, unknown[]>)[region];
      expect(list.length).toBeGreaterThan(0);
    }
  });

  it("every entry has a non-empty country code and name", () => {
    for (const region of EXPECTED_REGIONS) {
      const list = (importedSurnames as Record<string, { country: string; name: string }[]>)[
        region
      ];

      for (const entry of list) {
        expect(entry.country).toMatch(/^[A-Z]{2}$/);
        expect(entry.name.length).toBeGreaterThan(0);
      }
    }
  });
});
