import { describe, it, expect, vi } from "vitest";
import { generateNames, hasRealisticPeriod } from "../generateNames";
import { realisticDataset, realisticPeriodMeta } from "../datasets/realistic";
import { realisticSurnames, realisticSurnamesByCulture } from "../datasets/realisticSurnames";
import { realisticPeriodSurnames } from "../datasets/realisticPeriodSurnames";
import { realisticTitles, realisticEpithets } from "../datasets/realisticTitlesAndEpithets";
import type { CulturedName, RealisticPeriod } from "../types";

// Surnames can themselves contain spaces (e.g. "De Los Santos"), so split
// only on the first space to separate the first name from the surname.
function firstNameOf(fullName: string): string {
  const spaceIndex = fullName.indexOf(" ");
  return spaceIndex === -1 ? fullName : fullName.slice(0, spaceIndex);
}

function namesIn(pool: CulturedName[]): string[] {
  return pool.map((entry) => entry.name);
}

function surnameOf(fullName: string): string {
  const spaceIndex = fullName.indexOf(" ");
  return spaceIndex === -1 ? "" : fullName.slice(spaceIndex + 1);
}

const EXPECTED_PERIODS = [
  "western_europe_1300_1550",
  "eastern_europe_1300_1550",
  "western_europe_20th_century",
  "eastern_europe_20th_century",
  "usa_20th_century",
  "latin_america_20th_century",
  "western_europe_21st_century",
  "eastern_europe_21st_century",
  "usa_21st_century",
  "latin_america_21st_century",
  "central_asia_21st_century",
  "india_21st_century",
  "japan_21st_century",
  "china_21st_century",
].sort();

describe("realisticDataset", () => {
  it("covers all 14 sub-periods/regions with names for every gender", () => {
    const periods = Object.keys(realisticDataset).sort();
    expect(periods).toEqual(EXPECTED_PERIODS);

    for (const period of periods) {
      const pool = realisticDataset[period as keyof typeof realisticDataset];
      expect(pool.male.length).toBeGreaterThan(0);
      expect(pool.female.length).toBeGreaterThan(0);
      expect(pool.neutral.length).toBeGreaterThan(0);
    }
  });
});

describe("generateNames (realistic)", () => {
  it("returns exactly 1 name when count is 1", () => {
    const names = generateNames({ setting: "realistic", gender: "male", count: 1 });
    expect(names).toHaveLength(1);
  });

  it("returns exactly 10 names when count is 10", () => {
    const names = generateNames({ setting: "realistic", gender: "male", count: 10 });
    expect(names).toHaveLength(10);
  });

  it("produces a different batch across consecutive calls", () => {
    const first = generateNames({ setting: "realistic", gender: "female", count: 10 });
    const second = generateNames({ setting: "realistic", gender: "female", count: 10 });
    expect(first).not.toEqual(second);
  });

  it("only returns names present in the requested gender's pool across all periods", () => {
    const gender = "female";
    const validNames = new Set(
      Object.values(realisticDataset).flatMap((period) => namesIn(period[gender]))
    );

    const names = generateNames({ setting: "realistic", gender, count: 10 });

    for (const name of names) {
      expect(validNames.has(firstNameOf(name))).toBe(true);
    }
  });

  it("never touches the network, even if fetch is available", () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const names = generateNames({ setting: "realistic", gender: "male", count: 5 });

    expect(names).toHaveLength(5);
    expect(fetchSpy).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it("generates 10 names in under 1 second", () => {
    const start = Date.now();
    generateNames({ setting: "realistic", gender: "male", count: 10 });
    expect(Date.now() - start).toBeLessThan(1000);
  });

  it("restricts to a single region's periods when a region is given", () => {
    const gender = "male";
    const validNames = new Set(
      (Object.keys(realisticDataset) as (keyof typeof realisticDataset)[])
        .filter((period) => realisticPeriodMeta[period].region === "western_europe")
        .flatMap((period) => namesIn(realisticDataset[period][gender]))
    );

    const names = generateNames({
      setting: "realistic",
      gender,
      count: 5,
      region: "western_europe",
    });

    expect(names).toHaveLength(5);
    for (const name of names) {
      expect(validNames.has(firstNameOf(name))).toBe(true);
    }
  });

  it("restricts to a single century's periods when a century is given", () => {
    const gender = "female";
    const validNames = new Set(
      (Object.keys(realisticDataset) as (keyof typeof realisticDataset)[])
        .filter((period) => realisticPeriodMeta[period].century === "20th_century")
        .flatMap((period) => namesIn(realisticDataset[period][gender]))
    );

    const names = generateNames({
      setting: "realistic",
      gender,
      count: 5,
      century: "20th_century",
    });

    expect(names).toHaveLength(5);
    for (const name of names) {
      expect(validNames.has(firstNameOf(name))).toBe(true);
    }
  });

  it("combines region and century to a single matching period", () => {
    const gender = "male";
    const validNames = new Set(namesIn(realisticDataset.usa_20th_century[gender]));

    const names = generateNames({
      setting: "realistic",
      gender,
      count: 5,
      region: "usa",
      century: "20th_century",
    });

    expect(names).toHaveLength(5);
    for (const name of names) {
      expect(validNames.has(firstNameOf(name))).toBe(true);
    }
  });

  it("falls back to the full mix when region+century match no period, instead of throwing", () => {
    expect(() =>
      generateNames({
        setting: "realistic",
        gender: "male",
        count: 5,
        region: "usa",
        century: "1300_1550",
      })
    ).not.toThrow();

    const names = generateNames({
      setting: "realistic",
      gender: "male",
      count: 5,
      region: "usa",
      century: "1300_1550",
    });
    expect(names).toHaveLength(5);
  });

  it("restricts to Latin America's 20th-century period", () => {
    const gender = "female";
    const validNames = new Set(namesIn(realisticDataset.latin_america_20th_century[gender]));

    const names = generateNames({
      setting: "realistic",
      gender,
      count: 5,
      region: "latin_america",
      century: "20th_century",
    });

    expect(names).toHaveLength(5);
    for (const name of names) {
      expect(validNames.has(firstNameOf(name))).toBe(true);
    }
  });

  it("restricts to Japan's 21st-century period (new region)", () => {
    const gender = "male";
    const validNames = new Set(namesIn(realisticDataset.japan_21st_century[gender]));

    const names = generateNames({
      setting: "realistic",
      gender,
      count: 5,
      region: "japan",
    });

    expect(names).toHaveLength(5);
    for (const name of names) {
      expect(validNames.has(firstNameOf(name))).toBe(true);
    }
  });

  it("restricts to the 21st century across all regions when only century is given", () => {
    const gender = "female";
    const validNames = new Set(
      (Object.keys(realisticDataset) as (keyof typeof realisticDataset)[])
        .filter((period) => realisticPeriodMeta[period].century === "21st_century")
        .flatMap((period) => namesIn(realisticDataset[period][gender]))
    );

    const names = generateNames({
      setting: "realistic",
      gender,
      count: 10,
      century: "21st_century",
    });

    expect(names).toHaveLength(10);
    for (const name of names) {
      expect(validNames.has(firstNameOf(name))).toBe(true);
    }
  });

  it("always includes a surname alongside the first name", () => {
    const names = generateNames({ setting: "realistic", gender: "male", count: 10 });

    for (const name of names) {
      expect(name.includes(" ")).toBe(true);
      expect(surnameOf(name).length).toBeGreaterThan(0);
    }
  });

  it("pairs a first name and surname from the same region", () => {
    const gender = "male";
    const validFirstNames = new Set(namesIn(realisticDataset.japan_21st_century[gender]));
    const validSurnames = new Set(realisticSurnames.japan);

    const names = generateNames({
      setting: "realistic",
      gender,
      count: 10,
      region: "japan",
    });

    for (const name of names) {
      expect(validFirstNames.has(firstNameOf(name))).toBe(true);
      expect(validSurnames.has(surnameOf(name))).toBe(true);
    }
  });

  it("omits title and nickname by default", () => {
    const names = generateNames({ setting: "realistic", gender: "male", count: 10 });

    for (const name of names) {
      expect(realisticTitles.some((title) => name.startsWith(`${title} `))).toBe(false);
      expect(realisticEpithets.some((epithet) => name.endsWith(` ${epithet}`))).toBe(false);
    }
  });

  it("prepends a title when includeTitle is true", () => {
    const names = generateNames({
      setting: "realistic",
      gender: "male",
      count: 10,
      includeTitle: true,
    });

    for (const name of names) {
      expect(realisticTitles.some((title) => name.startsWith(`${title} `))).toBe(true);
    }
  });

  it("appends an epithet when includeNickname is true", () => {
    const names = generateNames({
      setting: "realistic",
      gender: "male",
      count: 10,
      includeNickname: true,
    });

    for (const name of names) {
      expect(realisticEpithets.some((epithet) => name.endsWith(` ${epithet}`))).toBe(true);
    }
  });

  it("reports which region+century combinations have data", () => {
    expect(hasRealisticPeriod(undefined, undefined)).toBe(true);
    expect(hasRealisticPeriod("japan", undefined)).toBe(true);
    expect(hasRealisticPeriod(undefined, "1300_1550")).toBe(true);
    expect(hasRealisticPeriod("western_europe", "1300_1550")).toBe(true);
    expect(hasRealisticPeriod("japan", "21st_century")).toBe(true);
    expect(hasRealisticPeriod("japan", "1300_1550")).toBe(false);
    expect(hasRealisticPeriod("usa", "1300_1550")).toBe(false);
    expect(hasRealisticPeriod("india", "20th_century")).toBe(false);
  });
});

describe("western_europe_1300_1550 (late medieval spike cell)", () => {
  it("has a pool large enough to be representative, not a token sample", () => {
    const pool = realisticDataset.western_europe_1300_1550;

    expect(pool.male.length).toBeGreaterThanOrEqual(40);
    expect(pool.female.length).toBeGreaterThanOrEqual(35);
  });

  it("has no duplicate entries in either gender pool", () => {
    const pool = realisticDataset.western_europe_1300_1550;

    expect(new Set(namesIn(pool.male)).size).toBe(pool.male.length);
    expect(new Set(namesIn(pool.female)).size).toBe(pool.female.length);
  });

  it("pairs given names with period surnames, not the modern regional pool", () => {
    const periodSurnames = realisticPeriodSurnames.western_europe_1300_1550;
    expect(periodSurnames).toBeDefined();
    const everySurname = Object.values(periodSurnames!).flat();

    const names = generateNames({
      setting: "realistic",
      gender: "male",
      count: 10,
      region: "western_europe",
      century: "1300_1550",
    });

    for (const name of names) {
      expect(everySurname).toContain(surnameOf(name));
    }
  });

  it("draws most surnames from the culture of the given name itself", () => {
    const periodSurnames = realisticPeriodSurnames.western_europe_1300_1550!;
    const cultureOf = new Map(
      realisticDataset.western_europe_1300_1550.male.map((entry) => [
        entry.name,
        entry.culture,
      ])
    );

    let sameCulture = 0;
    let total = 0;

    for (let batch = 0; batch < 40; batch++) {
      const names = generateNames({
        setting: "realistic",
        gender: "male",
        count: 10,
        region: "western_europe",
        century: "1300_1550",
      });

      for (const name of names) {
        const culture = cultureOf.get(firstNameOf(name));
        if (!culture) continue;
        total += 1;
        if (periodSurnames[culture]?.includes(surnameOf(name))) {
          sameCulture += 1;
        }
      }
    }

    // Five culture blocks, so picking blindly would land on the matching one
    // roughly 20% of the time. The engine aims for SAME_CULTURE_SURNAME_CHANCE
    // (0.7) plus incidental hits, so anything above 0.5 proves the pairing is
    // deliberate rather than accidental.
    expect(total).toBeGreaterThan(100);
    expect(sameCulture / total).toBeGreaterThan(0.5);
  });

  it("still falls back to the regional surname pool for periods without their own", () => {
    expect(realisticPeriodSurnames.usa_20th_century).toBeUndefined();

    const names = generateNames({
      setting: "realistic",
      gender: "male",
      count: 10,
      region: "usa",
      century: "20th_century",
    });

    for (const name of names) {
      expect(realisticSurnames.usa).toContain(surnameOf(name));
    }
  });
});

describe("culture tagging", () => {
  it("tags every imported 21st-century name with an ISO country code", () => {
    const periods = (Object.keys(realisticDataset) as RealisticPeriod[]).filter(
      (period) => realisticPeriodMeta[period].century === "21st_century"
    );

    expect(periods).toHaveLength(8);

    for (const period of periods) {
      for (const gender of ["male", "female"] as const) {
        for (const entry of realisticDataset[period][gender]) {
          expect(entry.culture).toMatch(/^[A-Z]{2}$/);
        }
      }
    }
  });

  it("groups imported surnames by country without losing any", () => {
    for (const region of Object.keys(realisticSurnames) as (keyof typeof realisticSurnames)[]) {
      const grouped = Object.values(realisticSurnamesByCulture[region]).flat();
      expect(grouped).toHaveLength(realisticSurnames[region].length);
    }
  });

  it("still fills the batch for countries that have names but no surnames", () => {
    // central_asia keeps surnames only for KZ, india only for BD/IN/NP — the
    // rest have to fall back to the regional pool rather than come up empty.
    for (const region of ["central_asia", "india"] as const) {
      const names = generateNames({
        setting: "realistic",
        gender: "male",
        count: 10,
        region,
        century: "21st_century",
      });

      expect(names).toHaveLength(10);
      for (const name of names) {
        expect(realisticSurnames[region]).toContain(surnameOf(name));
      }
    }
  });
});
