import { describe, it, expect, vi } from "vitest";
import { generateNames } from "../generateNames";
import { realisticDataset, realisticPeriodMeta } from "../datasets/realistic";
import { realisticSurnames } from "../datasets/realisticSurnames";
import { realisticTitles, realisticEpithets } from "../datasets/realisticTitlesAndEpithets";

// Surnames can themselves contain spaces (e.g. "De Los Santos"), so split
// only on the first space to separate the first name from the surname.
function firstNameOf(fullName: string): string {
  const spaceIndex = fullName.indexOf(" ");
  return spaceIndex === -1 ? fullName : fullName.slice(0, spaceIndex);
}

function surnameOf(fullName: string): string {
  const spaceIndex = fullName.indexOf(" ");
  return spaceIndex === -1 ? "" : fullName.slice(spaceIndex + 1);
}

const EXPECTED_PERIODS = [
  "western_europe_1200_1600",
  "eastern_europe_1200_1600",
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
      Object.values(realisticDataset).flatMap((period) => period[gender])
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
        .flatMap((period) => realisticDataset[period][gender])
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
        .flatMap((period) => realisticDataset[period][gender])
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
    const validNames = new Set(realisticDataset.usa_20th_century[gender]);

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
        century: "1200_1600",
      })
    ).not.toThrow();

    const names = generateNames({
      setting: "realistic",
      gender: "male",
      count: 5,
      region: "usa",
      century: "1200_1600",
    });
    expect(names).toHaveLength(5);
  });

  it("restricts to Latin America's 20th-century period", () => {
    const gender = "female";
    const validNames = new Set(realisticDataset.latin_america_20th_century[gender]);

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
    const validNames = new Set(realisticDataset.japan_21st_century[gender]);

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
        .flatMap((period) => realisticDataset[period][gender])
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
    const validFirstNames = new Set(realisticDataset.japan_21st_century[gender]);
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
});
