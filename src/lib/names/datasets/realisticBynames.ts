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

  // 1100-1300. The byname is now everywhere, but it is still personal rather
  // than inherited, and the occupational kind appears for the first time —
  // these are the bynames that would freeze into hereditary surnames over the
  // next two centuries ("John the Smith" becoming "John Smith").
  //
  // Occupational bynames reuse the descriptive rule: mechanically a particle
  // plus a word, even though the meaning is a trade rather than a trait.
  western_europe_1100_1300: {
    england: [
      {
        kind: "patronymic",
        male: { prefix: "son of" },
        female: { prefix: "daughter of" },
      },
      {
        kind: "patronymic",
        male: { prefix: "fitz" },
        female: { prefix: "fitz" },
      },
      {
        kind: "toponymic",
        particle: "of",
        places: [
          "York",
          "Lincoln",
          "Norwich",
          "Bristol",
          "Winchester",
          "Coventry",
          "Durham",
          "Salisbury",
          "Chester",
          "Exeter",
          "Oxford",
          "Beverley",
        ],
      },
      {
        kind: "descriptive",
        particle: "the",
        epithets: [
          "Smith",
          "Baker",
          "Miller",
          "Fletcher",
          "Wright",
          "Chapman",
          "Tanner",
          "Dyer",
          "Mason",
          "Cook",
          "Carter",
          "Shepherd",
        ],
      },
    ],

    france: [
      {
        kind: "toponymic",
        particle: "de",
        places: [
          "Montfort",
          "Beaumont",
          "Chartres",
          "Blois",
          "Nevers",
          "Rouen",
          "Senlis",
          "Vendome",
          "Clermont",
          "Laon",
        ],
      },
      {
        kind: "descriptive",
        particle: "le",
        epithets: [
          "Fevre",
          "Boulanger",
          "Charpentier",
          "Tisserand",
          "Mercier",
          "Pelletier",
          "Barbier",
          "Tonnelier",
        ],
      },
    ],

    german: [
      {
        kind: "toponymic",
        particle: "von",
        places: [
          "Hohenstaufen",
          "Meissen",
          "Thuringen",
          "Baden",
          "Nassau",
          "Isenburg",
          "Falkenstein",
          "Regensburg",
          "Magdeburg",
          "Lubeck",
        ],
      },
      {
        kind: "descriptive",
        particle: "der",
        epithets: [
          "Schmied",
          "Becker",
          "Muller",
          "Weber",
          "Schneider",
          "Fischer",
          "Topfer",
          "Gerber",
        ],
      },
    ],

    italy: [
      {
        kind: "patronymic",
        male: { prefix: "di" },
        female: { prefix: "di" },
      },
      {
        kind: "toponymic",
        particle: "da",
        places: [
          "Firenze",
          "Pisa",
          "Siena",
          "Lucca",
          "Verona",
          "Padova",
          "Cremona",
          "Rimini",
          "Arezzo",
          "Bologna",
        ],
      },
    ],

    iberia: [
      // The -ez patronymic: Rodrigo gives Rodriguez, Fernando gives
      // Fernandez. It is the same form for sons and daughters, and it is
      // exactly this byname that froze into the modern Spanish surname.
      {
        kind: "patronymic",
        male: { suffix: "ez" },
        female: { suffix: "ez" },
      },
      {
        kind: "toponymic",
        particle: "de",
        places: [
          "Castilla",
          "Leon",
          "Navarra",
          "Aragon",
          "Toledo",
          "Burgos",
          "Zamora",
          "Carrion",
          "Haro",
          "Lara",
        ],
      },
    ],
  },

  eastern_europe_1100_1300: {
    rus: [
      {
        kind: "patronymic",
        male: { suffix: "ovich" },
        female: { suffix: "ovna" },
      },
      {
        kind: "toponymic",
        particle: "of",
        places: [
          "Vladimir",
          "Suzdal",
          "Ryazan",
          "Galich",
          "Volyn",
          "Pskov",
          "Murom",
          "Novgorod",
        ],
      },
    ],

    poland: [
      {
        kind: "patronymic",
        male: { suffix: "owic" },
        female: { suffix: "owna" },
      },
      {
        kind: "toponymic",
        particle: "z",
        places: [
          "Krakowa",
          "Mazowsza",
          "Wielkopolski",
          "Kujaw",
          "Opola",
          "Sieradza",
        ],
      },
    ],

    bohemia: [
      {
        kind: "patronymic",
        male: { suffix: "ovic" },
        female: { suffix: "ova" },
      },
      {
        kind: "toponymic",
        particle: "z",
        places: ["Rozmberka", "Krumlova", "Pardubic", "Lipe", "Hradce", "Zerotina"],
      },
    ],

    hungary: [
      // Hungarian puts the possessor first: "Istvan fia" is son of Istvan.
      {
        kind: "patronymic",
        male: { suffix: " fia" },
        female: { suffix: " leanya" },
      },
      {
        kind: "toponymic",
        particle: "de",
        places: ["Zala", "Nyitra", "Somogy", "Bihar", "Veszprem", "Sopron"],
      },
    ],
  },

  eastern_europe_600_1100: {
    // East Slavic. The -ovich / -ovna patronymic is the form that survived
    // into the modern Russian middle name.
    rus: [
      {
        kind: "patronymic",
        male: { suffix: "ovich" },
        female: { suffix: "ovna" },
      },
      {
        kind: "toponymic",
        particle: "of",
        places: [
          "Kiev",
          "Novgorod",
          "Chernigov",
          "Polotsk",
          "Smolensk",
          "Pereyaslavl",
          "Rostov",
          "Tmutarakan",
          "Galich",
          "Vladimir",
        ],
      },
      {
        kind: "descriptive",
        particle: "the",
        epithets: [
          "Wise",
          "Bold",
          "Great",
          "Blessed",
          "Red",
          "Elder",
          "Younger",
          "Lame",
          "Proud",
        ],
      },
    ],

    poland: [
      {
        kind: "patronymic",
        male: { suffix: "owic" },
        female: { suffix: "owna" },
      },
      {
        kind: "toponymic",
        particle: "z",
        places: [
          "Krakowa",
          "Gniezna",
          "Poznania",
          "Plocka",
          "Wroclawia",
          "Sandomierza",
          "Leczycy",
          "Kalisza",
        ],
      },
    ],

    bohemia: [
      {
        kind: "patronymic",
        male: { suffix: "ovic" },
        female: { suffix: "ova" },
      },
      {
        kind: "toponymic",
        particle: "z",
        places: ["Prahy", "Brna", "Olomouce", "Plzne", "Zatce", "Libice"],
      },
    ],

    serbia: [
      {
        kind: "patronymic",
        male: { suffix: "ovic" },
        female: { suffix: "ova" },
      },
      {
        kind: "descriptive",
        particle: "the",
        epithets: ["Grey", "Bold", "Silent", "Elder", "Younger", "Stern"],
      },
    ],
  },
};
