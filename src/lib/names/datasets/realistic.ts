import type { RealisticDataset, RealisticPeriod, RealisticPeriodMeta } from "../types";

export const realisticPeriodMeta: Record<RealisticPeriod, RealisticPeriodMeta> = {
  western_europe_1200_1600: { region: "western_europe", century: "1200_1600" },
  eastern_europe_1200_1600: { region: "eastern_europe", century: "1200_1600" },
  western_europe_20th_century: { region: "western_europe", century: "20th_century" },
  eastern_europe_20th_century: { region: "eastern_europe", century: "20th_century" },
  usa_20th_century: { region: "usa", century: "20th_century" },
  latin_america_20th_century: { region: "latin_america", century: "20th_century" },
};

export const realisticDataset: RealisticDataset = {
  western_europe_1200_1600: {
    male: ["Guillaume", "Henri", "Baldwin", "Conrad", "Frederick", "Edmund", "Geoffrey", "Lucas"],
    female: ["Isabeau", "Eleanor", "Beatrice", "Constance", "Mathilde", "Adelaide", "Blanche", "Catherine"],
    neutral: ["Robin", "Jocelyn", "Avery", "Evelyn"],
  },
  eastern_europe_1200_1600: {
    male: ["Bogdan", "Miroslav", "Casimir", "Vladislav", "Jaromir", "Ladislaus", "Stanislav", "Ottokar"],
    female: ["Zofia", "Jadwiga", "Milica", "Anastasia", "Wanda", "Dobrava", "Kunigunde", "Ludmila"],
    neutral: ["Bogdana", "Dragomir", "Miloslav", "Zorislava"],
  },
  western_europe_20th_century: {
    male: ["Heinrich", "Jean", "Giovanni", "Klaus", "Pierre", "Hans", "Luigi", "Werner"],
    female: ["Ingrid", "Brigitte", "Francesca", "Greta", "Margot", "Elsa", "Simone", "Renate"],
    neutral: ["Jean", "Andrea", "Kim", "Noel"],
  },
  eastern_europe_20th_century: {
    male: ["Ivan", "Dmitri", "Andrzej", "Tomasz", "Viktor", "Karel", "Zoltán", "Mihai"],
    female: ["Natasha", "Katarzyna", "Elena", "Irena", "Zsófia", "Magda", "Vesna", "Olga"],
    neutral: ["Sasha", "Jovan", "Nikola", "Dragan"],
  },
  usa_20th_century: {
    male: ["Walter", "Harold", "Frank", "Raymond", "Eugene", "Arthur", "Clarence", "Elmer"],
    female: ["Dorothy", "Mildred", "Betty", "Shirley", "Doris", "Helen", "Evelyn", "Gladys"],
    neutral: ["Francis", "Marion", "Leslie", "Jordan"],
  },
  latin_america_20th_century: {
    male: ["Carlos", "Miguel", "Rafael", "Eduardo", "Fernando", "Ricardo", "Diego", "Alejandro"],
    female: ["María", "Carmen", "Isabel", "Lucía", "Gabriela", "Rosa", "Adriana", "Valentina"],
    neutral: ["Guadalupe", "Trinidad", "Cruz", "Ángel"],
  },
};
