import { describe, it, expect, vi } from "vitest";
import { generateNames } from "../generateNames";
import { historicalDataset, historicalPeriodMeta } from "../datasets/historical";

const EXPECTED_PERIODS = [
  "western_europe_1200_1600",
  "eastern_europe_1200_1600",
  "usa_20th_century",
  "europe_20th_century",
].sort();

describe("historicalDataset", () => {
  it("covers all 4 sub-periods/regions with names for every gender", () => {
    const periods = Object.keys(historicalDataset).sort();
    expect(periods).toEqual(EXPECTED_PERIODS);

    for (const period of periods) {
      const pool = historicalDataset[period as keyof typeof historicalDataset];
      expect(pool.male.length).toBeGreaterThan(0);
      expect(pool.female.length).toBeGreaterThan(0);
      expect(pool.neutral.length).toBeGreaterThan(0);
    }
  });
});

describe("generateNames (historical)", () => {
  it("returns exactly 1 name when count is 1", () => {
    const names = generateNames({ setting: "historical", gender: "male", count: 1 });
    expect(names).toHaveLength(1);
  });

  it("returns exactly 10 names when count is 10", () => {
    const names = generateNames({ setting: "historical", gender: "male", count: 10 });
    expect(names).toHaveLength(10);
  });

  it("produces a different batch across consecutive calls", () => {
    const first = generateNames({ setting: "historical", gender: "female", count: 10 });
    const second = generateNames({ setting: "historical", gender: "female", count: 10 });
    expect(first).not.toEqual(second);
  });

  it("only returns names present in the requested gender's pool across all periods", () => {
    const gender = "female";
    const validNames = new Set(
      Object.values(historicalDataset).flatMap((period) => period[gender])
    );

    const names = generateNames({ setting: "historical", gender, count: 10 });

    for (const name of names) {
      expect(validNames.has(name)).toBe(true);
    }
  });

  it("never touches the network, even if fetch is available", () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const names = generateNames({ setting: "historical", gender: "male", count: 5 });

    expect(names).toHaveLength(5);
    expect(fetchSpy).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it("generates 10 names in under 1 second", () => {
    const start = Date.now();
    generateNames({ setting: "historical", gender: "male", count: 10 });
    expect(Date.now() - start).toBeLessThan(1000);
  });

  it("restricts to a single region's periods when a region is given", () => {
    const gender = "male";
    const validNames = new Set(
      (Object.keys(historicalDataset) as (keyof typeof historicalDataset)[])
        .filter((period) => historicalPeriodMeta[period].region === "western_europe")
        .flatMap((period) => historicalDataset[period][gender])
    );

    const names = generateNames({
      setting: "historical",
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
      (Object.keys(historicalDataset) as (keyof typeof historicalDataset)[])
        .filter((period) => historicalPeriodMeta[period].century === "20th_century")
        .flatMap((period) => historicalDataset[period][gender])
    );

    const names = generateNames({
      setting: "historical",
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
    const validNames = new Set(historicalDataset.usa_20th_century[gender]);

    const names = generateNames({
      setting: "historical",
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
        setting: "historical",
        gender: "male",
        count: 5,
        region: "western_europe",
        century: "20th_century",
      })
    ).not.toThrow();

    const names = generateNames({
      setting: "historical",
      gender: "male",
      count: 5,
      region: "western_europe",
      century: "20th_century",
    });
    expect(names).toHaveLength(5);
  });
});
