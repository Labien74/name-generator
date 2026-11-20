import type { RealisticBynames } from "../types";

/**
 * Bynames for periods that predate hereditary surnames.
 *
 * Before roughly 1300 most of Europe had no family names. A second name
 * element existed, but it was a byname: whose child you were, where you came
 * from, or what you were known for — and it died with you rather than passing
 * to your children. A period listed here builds that instead of a surname;
 * periods absent from this table use the surname pools.
 *
 * Patronymics multiply rather than add: they are built from the given names
 * of the same culture, so twenty names and one rule already give twenty
 * bynames. That is the opposite of the surname pools, which only ever hold
 * what was typed into them.
 *
 * Known approximation: no morphology is applied to the name of the father.
 * Real Old Norse and Old Irish would inflect it ("Haraldr" -> "Haraldsson",
 * "Niall" -> "mac Neill"); here the name is used as it stands. See
 * data-import/README.md.
 */
export const realisticBynames: RealisticBynames = {
  western_europe_600_1100: {
    // Anglo-Saxon England. No patronymic particle in common written use, so
    // place and byname-epithet only.
    anglo_saxon: [
      {
        kind: "toponymic",
        particle: "of",
        places: [
          "Wessex",
          "Mercia",
          "Northumbria",
          "Kent",
          "East Anglia",
          "Wintanceaster",
          "Eoforwic",
          "Lunden",
          "Hamtun",
          "Exanceaster",
          "Gleawanceaster",
          "Snotingaham",
        ],
      },
      {
        kind: "descriptive",
        particle: "the",
        epithets: [
          "Bold",
          "Black",
          "Red",
          "Tall",
          "Wise",
          "Strong",
          "Younger",
          "Elder",
          "Quiet",
          "Lame",
        ],
      },
    ],

    // Norse. The patronymic is the dominant form and is still live in
    // Iceland today.
    norse: [
      {
        kind: "patronymic",
        male: { suffix: "sson" },
        female: { suffix: "sdottir" },
      },
      {
        kind: "descriptive",
        particle: "the",
        epithets: [
          "Red",
          "Black",
          "Bold",
          "Lucky",
          "Strong",
          "Silent",
          "Wise",
          "Old",
          "Far-Travelled",
          "Shipwright",
        ],
      },
    ],

    // Frankish and early French. Descriptive epithets here are the ones the
    // Carolingians actually carried — Charles the Bald, Louis the Pious.
    frankish: [
      {
        kind: "toponymic",
        particle: "de",
        places: [
          "Vermandois",
          "Anjou",
          "Aquitaine",
          "Neustrie",
          "Austrasie",
          "Provence",
          "Toulouse",
          "Flandre",
          "Bourgogne",
          "Lorraine",
          "Poitiers",
          "Soissons",
        ],
      },
      {
        kind: "descriptive",
        particle: "the",
        epithets: [
          "Bald",
          "Pious",
          "Simple",
          "Young",
          "Great",
          "Stammerer",
          "Fat",
          "Quarrelsome",
          "Hammer",
          "Short",
        ],
      },
    ],

    // Gaelic Ireland and Scotland.
    gaelic: [
      {
        kind: "patronymic",
        male: { prefix: "mac" },
        female: { prefix: "ingen" },
      },
      {
        kind: "patronymic",
        male: { prefix: "ua" },
        female: { prefix: "ua" },
      },
      {
        kind: "descriptive",
        particle: "the",
        epithets: [
          "Fair",
          "Dark",
          "Swift",
          "Red-Handed",
          "One-Eyed",
          "Pilgrim",
          "Elder",
          "Younger",
        ],
      },
    ],
  },
};
