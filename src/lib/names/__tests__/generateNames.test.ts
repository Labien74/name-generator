import { describe, it, expect, vi } from "vitest";
import { generateNames } from "../generateNames";
import { fantasyDataset } from "../datasets/fantasy";

describe("generateNames (fantasy)", () => {
  it("returns exactly 1 name when count is 1", () => {
    const names = generateNames({ setting: "fantasy", gender: "male", count: 1 });
    expect(names).toHaveLength(1);
  });

  it("returns exactly 10 names when count is 10", () => {
    const names = generateNames({ setting: "fantasy", gender: "male", count: 10 });
    expect(names).toHaveLength(10);
  });

  it("produces a different batch across consecutive calls", () => {
    const first = generateNames({ setting: "fantasy", gender: "neutral", count: 10 });
    const second = generateNames({ setting: "fantasy", gender: "neutral", count: 10 });
    expect(first).not.toEqual(second);
  });

  it("only returns names built from the requested gender's syllable pool", () => {
    const gender = "female";
    const { prefixes, suffixes } = fantasyDataset[gender];
    const validCombos = new Set(
      prefixes.flatMap((prefix) => suffixes.map((suffix) => `${prefix}${suffix}`))
    );

    const names = generateNames({ setting: "fantasy", gender, count: 10 });

    for (const name of names) {
      expect(validCombos.has(name)).toBe(true);
    }
  });

  it("never touches the network, even if fetch is available", () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const names = generateNames({ setting: "fantasy", gender: "male", count: 5 });

    expect(names).toHaveLength(5);
    expect(fetchSpy).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it("generates 10 names in under 1 second", () => {
    const start = Date.now();
    generateNames({ setting: "fantasy", gender: "male", count: 10 });
    expect(Date.now() - start).toBeLessThan(1000);
  });
});
