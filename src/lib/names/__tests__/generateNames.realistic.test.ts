import { describe, it, expect, vi } from "vitest";
import { generateNames, hasRealisticPeriod } from "../generateNames";
import { realisticDataset, realisticPeriodMeta } from "../datasets/realistic";
import { realisticSurnames, realisticSurnamesByCulture } from "../datasets/realisticSurnames";
import { realisticPeriodSurnames } from "../datasets/realisticPeriodSurnames";
import { realisticBynames } from "../datasets/realisticBynames";
import {
  realisticTitlesByEra,
  realisticEpithets,
} from "../datasets/realisticTitlesAndEpithets";

const allRealisticTitles = Object.values(realisticTitlesByEra).flat();
import type { CulturedName, RealisticCentury, RealisticPeriod } from "../types";

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
  "western_europe_1550_1800",
  "eastern_europe_1550_1800",
  "western_europe_1100_1300",
  "eastern_europe_1100_1300",
  "eastern_europe_600_1100",
  "western_europe_600_1100",
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
  it("covers all 20 sub-periods/regions with gendered names", () => {
    const periods = Object.keys(realisticDataset).sort();
    expect(periods).toEqual(EXPECTED_PERIODS);

    for (const period of periods) {
      const pool = realisticDataset[period as keyof typeof realisticDataset];
      expect(pool.male.length).toBeGreaterThan(0);
      expect(pool.female.length).toBeGreaterThan(0);
    }
  });

  it("offers neutral names only where they are not invented", () => {
    // Modern periods have a hand-picked neutral pool. Pre-modern European
    // name stocks had no epicene pool, so theirs stay empty on purpose.
    for (const period of Object.keys(realisticDataset) as RealisticPeriod[]) {
      const isModern = realisticPeriodMeta[period].era === "modern";
      expect(
        realisticDataset[period].neutral.length > 0,
        `${period} neutral pool`
      ).toBe(isModern);
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
      expect(allRealisticTitles.some((title: string) => name.startsWith(`${title} `))).toBe(false);
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
      expect(allRealisticTitles.some((title: string) => name.startsWith(`${title} `))).toBe(true);
    }
  });

  it("appends an epithet when includeNickname is true", () => {
    // Pinned to a surname-era period: in the pre-surname periods a
    // descriptive byname already is an epithet, and the engine deliberately
    // does not stack a second one on top (see the 600-1100 suite).
    const names = generateNames({
      setting: "realistic",
      gender: "male",
      count: 10,
      century: "21st_century",
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

describe("western_europe_600_1100 (pre-surname era)", () => {
  const PERIOD = "western_europe_600_1100";

  function cultureMap(gender: "male" | "female") {
    return new Map(
      realisticDataset[PERIOD][gender].map((entry) => [entry.name, entry.culture])
    );
  }

  // Every byname the rules of a culture can possibly produce, expanded.
  function possibleBynames(culture: string, gender: "male" | "female"): Set<string> {
    const rules = realisticBynames[PERIOD]![culture];
    const fathers = realisticDataset[PERIOD].male
      .filter((entry) => entry.culture === culture)
      .map((entry) => entry.name);

    const out = new Set<string>();
    for (const rule of rules) {
      if (rule.kind === "toponymic") {
        for (const place of rule.places) out.add(`${rule.particle} ${place}`);
      } else if (rule.kind === "descriptive") {
        for (const epithet of rule.epithets) out.add(`${rule.particle} ${epithet}`);
      } else {
        const { prefix, suffix } = gender === "female" ? rule.female : rule.male;
        for (const father of fathers) {
          out.add(`${prefix ? `${prefix} ` : ""}${father}${suffix ?? ""}`);
        }
      }
    }
    return out;
  }

  it("builds a byname instead of a surname", () => {
    for (const gender of ["male", "female"] as const) {
      const cultures = cultureMap(gender);

      const names = generateNames({
        setting: "realistic",
        gender,
        count: 10,
        region: "western_europe",
        century: "600_1100",
      });

      expect(names).toHaveLength(10);

      for (const name of names) {
        const culture = cultures.get(firstNameOf(name));
        expect(culture).toBeDefined();
        expect(possibleBynames(culture!, gender)).toContain(surnameOf(name));
      }
    }
  });

  it("never pairs an early medieval name with a modern surname", () => {
    const names = generateNames({
      setting: "realistic",
      gender: "male",
      count: 10,
      region: "western_europe",
      century: "600_1100",
    });

    for (const name of names) {
      expect(realisticSurnames.western_europe).not.toContain(surnameOf(name));
    }
  });

  it("builds patronymics from given names of the same culture", () => {
    const norseFathers = realisticDataset[PERIOD].male
      .filter((entry) => entry.culture === "norse")
      .map((entry) => entry.name);

    const patronymics = [...possibleBynames("norse", "male")].filter((byname) =>
      byname.endsWith("sson")
    );

    expect(patronymics.length).toBe(norseFathers.length);
    for (const father of norseFathers) {
      expect(patronymics).toContain(`${father}sson`);
    }
  });

  it("does not stack a nickname on top of a descriptive byname", () => {
    for (let batch = 0; batch < 20; batch++) {
      const names = generateNames({
        setting: "realistic",
        gender: "male",
        count: 10,
        region: "western_europe",
        century: "600_1100",
        includeNickname: true,
      });

      for (const name of names) {
        // "Eadric the Red the Wise" would mean two epithets in one name.
        const theCount = name.split(" the ").length - 1;
        expect(theCount).toBeLessThanOrEqual(1);
      }
    }
  });
});

describe("titles by era", () => {
  it("gives every period an era", () => {
    for (const period of Object.keys(realisticDataset) as RealisticPeriod[]) {
      expect(realisticTitlesByEra[realisticPeriodMeta[period].era]).toBeDefined();
    }
  });

  it("never puts a modern title on a pre-modern name", () => {
    for (const century of ["600_1100", "1300_1550"] as const) {
      const names = generateNames({
        setting: "realistic",
        gender: "male",
        count: 10,
        region: "western_europe",
        century,
        includeTitle: true,
      });

      for (const name of names) {
        for (const modernTitle of realisticTitlesByEra.modern) {
          expect(name.startsWith(`${modernTitle} `)).toBe(false);
        }
      }
    }
  });

  it("uses the era-appropriate title list for each century", () => {
    const expected = {
      "600_1100": realisticTitlesByEra.early_medieval,
      "1300_1550": realisticTitlesByEra.late_medieval,
      "20th_century": realisticTitlesByEra.modern,
    } as const;

    for (const [century, titles] of Object.entries(expected)) {
      const names = generateNames({
        setting: "realistic",
        gender: "male",
        count: 10,
        region: "western_europe",
        century: century as keyof typeof expected,
        includeTitle: true,
      });

      for (const name of names) {
        expect(titles.some((title) => name.startsWith(`${title} `))).toBe(true);
      }
    }
  });
});

describe("pool sizes", () => {
  // The hand-written cells used to hold eight names per gender, which made a
  // batch of ten repeat itself. This locks the expansion in: a new period
  // cannot land as a token sample.
  const MINIMUM_PER_GENDER = 15;

  it("gives every period a usable pool for both genders", () => {
    for (const period of Object.keys(realisticDataset) as RealisticPeriod[]) {
      for (const gender of ["male", "female"] as const) {
        expect(
          realisticDataset[period][gender].length,
          `${period}.${gender} is too small`
        ).toBeGreaterThanOrEqual(MINIMUM_PER_GENDER);
      }
    }
  });

  it("tags every name in the pre-surname periods with a culture", () => {
    // Without a culture there is no byname rule to apply, so such a name
    // would silently fall back to a modern surname.
    // Every period that builds bynames, not a hardcoded pair: the list grew
    // from two to four and the guard has to grow with it.
    for (const period of Object.keys(realisticBynames) as RealisticPeriod[]) {
      for (const gender of ["male", "female"] as const) {
        for (const entry of realisticDataset[period][gender]) {
          expect(entry.culture, `${entry.name} in ${period}`).toBeDefined();
          expect(realisticBynames[period]![entry.culture!]).toBeDefined();
        }
      }
    }
  });
});

describe("neutral gender on pre-modern periods", () => {
  it("reports that pre-modern centuries have no neutral names", () => {
    expect(hasRealisticPeriod(undefined, "600_1100", "male")).toBe(true);
    expect(hasRealisticPeriod(undefined, "600_1100", "female")).toBe(true);
    expect(hasRealisticPeriod(undefined, "600_1100", "neutral")).toBe(false);

    expect(hasRealisticPeriod(undefined, "1300_1550", "neutral")).toBe(false);
    expect(hasRealisticPeriod(undefined, "21st_century", "neutral")).toBe(true);
    expect(hasRealisticPeriod("western_europe", "600_1100", "neutral")).toBe(false);
  });

  it("stays backwards compatible when no gender is passed", () => {
    expect(hasRealisticPeriod(undefined, "600_1100")).toBe(true);
    expect(hasRealisticPeriod("japan", "600_1100")).toBe(false);
  });

  it("never draws a neutral name from a period that has none", () => {
    const modernNeutral = new Set(
      (Object.keys(realisticDataset) as RealisticPeriod[])
        .filter((period) => realisticPeriodMeta[period].era === "modern")
        .flatMap((period) => namesIn(realisticDataset[period].neutral))
    );

    const names = generateNames({
      setting: "realistic",
      gender: "neutral",
      count: 10,
    });

    expect(names).toHaveLength(10);
    for (const name of names) {
      expect(modernNeutral).toContain(firstNameOf(name));
    }
  });

  it("falls back to modern periods instead of throwing on an impossible combination", () => {
    // The UI disables this, but the API still has to survive it.
    expect(() =>
      generateNames({
        setting: "realistic",
        gender: "neutral",
        count: 5,
        region: "western_europe",
        century: "600_1100",
      })
    ).not.toThrow();

    const names = generateNames({
      setting: "realistic",
      gender: "neutral",
      count: 5,
      region: "western_europe",
      century: "600_1100",
    });

    expect(names).toHaveLength(5);
  });
});

describe("every pre-surname period", () => {
  const bynamePeriods = Object.keys(realisticBynames) as RealisticPeriod[];

  // Every byname the rules of one culture can possibly produce, expanded.
  function possibleBynamesFor(
    period: RealisticPeriod,
    culture: string,
    gender: "male" | "female"
  ): Set<string> {
    const fathers = realisticDataset[period].male
      .filter((entry) => entry.culture === culture)
      .map((entry) => entry.name);

    const out = new Set<string>();
    for (const rule of realisticBynames[period]![culture]) {
      if (rule.kind === "toponymic") {
        for (const place of rule.places) out.add(`${rule.particle} ${place}`);
      } else if (rule.kind === "descriptive") {
        for (const epithet of rule.epithets) out.add(`${rule.particle} ${epithet}`);
      } else {
        const { prefix, suffix } = gender === "female" ? rule.female : rule.male;
        for (const father of fathers) {
          out.add(`${prefix ? `${prefix} ` : ""}${father}${suffix ?? ""}`);
        }
      }
    }
    return out;
  }

  it("covers both early medieval and high medieval periods", () => {
    expect(bynamePeriods).toHaveLength(4);
  });

  it.each(bynamePeriods)("builds only valid bynames for %s", (period) => {
    const { region, century } = realisticPeriodMeta[period];

    for (const gender of ["male", "female"] as const) {
      const cultures = new Map(
        realisticDataset[period][gender].map((entry) => [entry.name, entry.culture])
      );

      const names = generateNames({
        setting: "realistic",
        gender,
        count: 10,
        region,
        century,
      });

      expect(names).toHaveLength(10);

      for (const name of names) {
        const culture = cultures.get(firstNameOf(name));
        expect(culture, `${name} in ${period}`).toBeDefined();
        expect(possibleBynamesFor(period, culture!, gender)).toContain(
          surnameOf(name)
        );
      }
    }
  });

  it.each(bynamePeriods)("never uses a modern surname in %s", (period) => {
    const { region, century } = realisticPeriodMeta[period];

    const names = generateNames({
      setting: "realistic",
      gender: "male",
      count: 10,
      region,
      century,
    });

    for (const name of names) {
      expect(realisticSurnames[region]).not.toContain(surnameOf(name));
    }
  });
});

describe("1550-1800 (early modern)", () => {
  it("uses hereditary surnames, not bynames", () => {
    expect(realisticBynames.western_europe_1550_1800).toBeUndefined();
    expect(realisticBynames.eastern_europe_1550_1800).toBeUndefined();

    for (const region of ["western_europe", "eastern_europe"] as const) {
      const names = generateNames({
        setting: "realistic",
        gender: "male",
        count: 10,
        region,
        century: "1550_1800",
      });

      expect(names).toHaveLength(10);
      for (const name of names) {
        expect(realisticSurnames[region]).toContain(surnameOf(name));
      }
    }
  });

  it("carries both halves of the confessional split", () => {
    const pool = realisticDataset.western_europe_1550_1800;
    const male = namesIn(pool.male);
    const female = namesIn(pool.female);

    // Protestant: Old Testament and virtue names, the reason 1550 is a
    // boundary at all.
    expect(male).toEqual(expect.arrayContaining(["Ezekiel", "Obadiah"]));
    expect(female).toEqual(
      expect.arrayContaining(["Patience", "Prudence", "Mercy"])
    );

    // Catholic: the saints carry on.
    expect(male).toEqual(expect.arrayContaining(["Giuseppe", "José"]));
    expect(female).toEqual(expect.arrayContaining(["Josefa", "Marie"]));
  });

  it("gets early modern titles rather than medieval or modern ones", () => {
    const names = generateNames({
      setting: "realistic",
      gender: "male",
      count: 10,
      region: "western_europe",
      century: "1550_1800",
      includeTitle: true,
    });

    for (const name of names) {
      expect(
        realisticTitlesByEra.early_modern.some((title) =>
          name.startsWith(`${title} `)
        )
      ).toBe(true);
    }
  });
});

describe("the European period grid", () => {
  it("is complete: every historical century has a western and an eastern cell", () => {
    const historical = ["600_1100", "1100_1300", "1300_1550", "1550_1800"] as const;

    for (const century of historical) {
      for (const region of ["western_europe", "eastern_europe"] as const) {
        expect(
          hasRealisticPeriod(region, century, "male"),
          `${region} ${century}`
        ).toBe(true);
      }
    }
  });

  it("gives each historical century its own era", () => {
    const eraOf = (century: RealisticCentury) =>
      (Object.keys(realisticDataset) as RealisticPeriod[])
        .filter((period) => realisticPeriodMeta[period].century === century)
        .map((period) => realisticPeriodMeta[period].era);

    expect(eraOf("600_1100")).toEqual(["early_medieval", "early_medieval"]);
    expect(eraOf("1100_1300")).toEqual(["high_medieval", "high_medieval"]);
    expect(eraOf("1300_1550")).toEqual(["late_medieval", "late_medieval"]);
    expect(eraOf("1550_1800")).toEqual(["early_modern", "early_modern"]);
  });
});
