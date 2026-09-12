"use client";

import { useState } from "react";
import { generateNames } from "@/lib/names/generateNames";
import type { Gender, RealisticCentury, RealisticRegion, Setting } from "@/lib/names/types";

const SETTINGS: { value: Setting; label: string }[] = [
  { value: "fantasy", label: "Фэнтези" },
  { value: "scifi", label: "Sci-Fi / космоопера / киберпанк" },
  { value: "realistic", label: "Реалистичное" },
];

const GENDERS: { value: Gender; label: string }[] = [
  { value: "male", label: "Мужское" },
  { value: "female", label: "Женское" },
  { value: "neutral", label: "Нейтральное" },
];

const REGIONS: { value: RealisticRegion | ""; label: string }[] = [
  { value: "", label: "Любой" },
  { value: "western_europe", label: "Западная Европа" },
  { value: "eastern_europe", label: "Восточная Европа" },
  { value: "usa", label: "США" },
  { value: "latin_america", label: "Латинская Америка" },
];

const CENTURIES: { value: RealisticCentury | ""; label: string }[] = [
  { value: "", label: "Любой" },
  { value: "1200_1600", label: "1200–1600" },
  { value: "20th_century", label: "XX век" },
];

export default function Home() {
  const [setting, setSetting] = useState<Setting>("fantasy");
  const [gender, setGender] = useState<Gender>("male");
  const [count, setCount] = useState(5);
  const [region, setRegion] = useState<RealisticRegion | "">("");
  const [century, setCentury] = useState<RealisticCentury | "">("");
  const [names, setNames] = useState<string[]>([]);

  function handleGenerate() {
    setNames(
      generateNames({
        setting,
        gender,
        count,
        region: region || undefined,
        century: century || undefined,
      })
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <main className="flex w-full max-w-xl flex-col gap-8">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Генератор имён под сеттинг
        </h1>

        <div className="flex flex-col gap-4 rounded-xl border border-black/[.08] bg-white p-6 dark:border-white/[.145] dark:bg-zinc-950">
          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Сеттинг
            <select
              className="rounded-md border border-black/[.08] bg-white px-3 py-2 text-black dark:border-white/[.145] dark:bg-black dark:text-zinc-50"
              value={setting}
              onChange={(event) => setSetting(event.target.value as Setting)}
            >
              {SETTINGS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {setting === "realistic" && (
            <>
              <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Регион
                <select
                  className="rounded-md border border-black/[.08] bg-white px-3 py-2 text-black dark:border-white/[.145] dark:bg-black dark:text-zinc-50"
                  value={region}
                  onChange={(event) =>
                    setRegion(event.target.value as RealisticRegion | "")
                  }
                >
                  {REGIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Век
                <select
                  className="rounded-md border border-black/[.08] bg-white px-3 py-2 text-black dark:border-white/[.145] dark:bg-black dark:text-zinc-50"
                  value={century}
                  onChange={(event) =>
                    setCentury(event.target.value as RealisticCentury | "")
                  }
                >
                  {CENTURIES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}

          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Пол
            <select
              className="rounded-md border border-black/[.08] bg-white px-3 py-2 text-black dark:border-white/[.145] dark:bg-black dark:text-zinc-50"
              value={gender}
              onChange={(event) => setGender(event.target.value as Gender)}
            >
              {GENDERS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Количество вариантов
            <input
              className="rounded-md border border-black/[.08] bg-white px-3 py-2 text-black dark:border-white/[.145] dark:bg-black dark:text-zinc-50"
              type="number"
              min={1}
              max={10}
              value={count}
              onChange={(event) =>
                setCount(Math.min(10, Math.max(1, Number(event.target.value) || 1)))
              }
            />
          </label>

          <button
            className="mt-2 rounded-full bg-foreground px-5 py-3 font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            onClick={handleGenerate}
          >
            {names.length === 0 ? "Сгенерировать" : "Ещё"}
          </button>
        </div>

        {names.length > 0 && (
          <ul className="flex flex-col gap-2 rounded-xl border border-black/[.08] bg-white p-6 dark:border-white/[.145] dark:bg-zinc-950">
            {names.map((name, index) => (
              <li
                key={`${name}-${index}`}
                className="text-lg text-black dark:text-zinc-50"
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
