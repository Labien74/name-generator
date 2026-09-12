import type { HistoricalDataset } from "../types";

export const historicalDataset: HistoricalDataset = {
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
  usa_20th_century: {
    male: ["Walter", "Harold", "Frank", "Raymond", "Eugene", "Arthur", "Clarence", "Elmer"],
    female: ["Dorothy", "Mildred", "Betty", "Shirley", "Doris", "Helen", "Evelyn", "Gladys"],
    neutral: ["Francis", "Marion", "Leslie", "Jordan"],
  },
  europe_20th_century: {
    male: ["Heinrich", "Jean", "Giovanni", "Klaus", "Pierre", "Hans", "Luigi", "Werner"],
    female: ["Ingrid", "Brigitte", "Francesca", "Greta", "Margot", "Elsa", "Simone", "Renate"],
    neutral: ["Jean", "Andrea", "Kim", "Noel"],
  },
};
