import { describe, it, expect, vi } from "vitest";
import { generateNames } from "../generateNames";
import { fantasyDataset } from "../datasets/fantasy";
import { fantasyRealNames } from "../datasets/fantasyRealNames";
import { fantasySurnames } from "../datasets/fantasySurnames";
import { fantasyTitles, fantasyEpithets } from "../datasets/fantasyTitlesAndEpithets";

function firstNameOf(fullName: string): string {
  return fullName.slice(0, fullName.indexOf(" "));
}

function surnameOf(fullName: string): string {
  return fullName.slice(fullName.indexOf(" ") + 1);
}

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

  it("only returns first names built from the syllable pool or the curated real-name pool", () => {
    const gender = "female";
    const { prefixes, suffixes } = fantasyDataset[gender];
    const validCombos = new Set([
      ...prefixes.flatMap((prefix) => suffixes.map((suffix) => `${prefix}${suffix}`)),
      ...fantasyRealNames[gender],
    ]);

    const names = generateNames({ setting: "fantasy", gender, count: 10 });

    for (const name of names) {
      expect(validCombos.has(firstNameOf(name))).toBe(true);
    }
  });

  it("blends in curated real names alongside syllable-generated ones", () => {
    const gender = "male";
    const realNames = new Set(fantasyRealNames[gender]);

    const names = generateNames({ setting: "fantasy", gender, count: 20 });

    const includesARealName = names.some((name) => realNames.has(firstNameOf(name)));
    expect(includesARealName).toBe(true);
  });

  it("always includes a surname from the fantasy surname pool", () => {
    const validSurnames = new Set(fantasySurnames);

    const names = generateNames({ setting: "fantasy", gender: "male", count: 10 });

    for (const name of names) {
      expect(name.includes(" ")).toBe(true);
      expect(validSurnames.has(surnameOf(name))).toBe(true);
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

  it("omits title and nickname by default", () => {
    // Surnames can themselves be multi-word (e.g. "Van Tahl"), so this
    // can't just check the token count — it checks for the specific
    // title/epithet markers instead.
    const allTitles = [...fantasyTitles.male, ...fantasyTitles.female, ...fantasyTitles.neutral];
    const names = generateNames({ setting: "fantasy", gender: "male", count: 10 });

    for (const name of names) {
      expect(allTitles.some((title) => name.startsWith(`${title} `))).toBe(false);
      expect(fantasyEpithets.some((epithet) => name.endsWith(` ${epithet}`))).toBe(false);
    }
  });

  it("prepends a gender-matched title when includeTitle is true", () => {
    const gender = "female";
    const validTitles = new Set(fantasyTitles[gender]);

    const names = generateNames({
      setting: "fantasy",
      gender,
      count: 10,
      includeTitle: true,
    });

    for (const name of names) {
      const title = name.split(" ")[0];
      expect(validTitles.has(title)).toBe(true);
    }
  });

  it("appends an epithet when includeNickname is true", () => {
    const names = generateNames({
      setting: "fantasy",
      gender: "male",
      count: 10,
      includeNickname: true,
    });

    for (const name of names) {
      const epithet = "the " + name.split(" the ")[1];
      expect(fantasyEpithets).toContain(epithet);
    }
  });

  it("combines title and nickname together", () => {
    const gender = "male";
    const validTitles = new Set(fantasyTitles[gender]);

    const names = generateNames({
      setting: "fantasy",
      gender,
      count: 5,
      includeTitle: true,
      includeNickname: true,
    });

    for (const name of names) {
      const parts = name.split(" ");
      expect(validTitles.has(parts[0])).toBe(true);
      const epithet = "the " + name.split(" the ")[1];
      expect(fantasyEpithets).toContain(epithet);
    }
  });
});
