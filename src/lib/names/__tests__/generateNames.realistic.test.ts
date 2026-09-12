import { describe, it, expect, vi } from "vitest";
import { generateNames } from "../generateNames";
import { realisticDataset, realisticPeriodMeta } from "../datasets/realistic";

const EXPECTED_PERIODS = [
  "western_europe_1200_1600",
  "eastern_europe_1200_1600",
  "western_europe_20th_century",
  "eastern_europe_20th_century",
  "usa_20th_century",
  "latin_america_20th_century",
].sort();

describe("realisticDataset", () => {
  it("covers all 6 sub-periods/regions with names for every gender", () => {
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
      expect(validNames.has(name)).toBe(true);
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
      expect(validNames.has(name)).toBe(true);
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
      expect(validNames.has(name)).toBe(true);
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
      expect(validNames.has(name)).toBe(true);
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
    });

    expect(names).toHaveLength(5);
    for (const name of names) {
      expect(validNames.has(name)).toBe(true);
    }
  });
});
