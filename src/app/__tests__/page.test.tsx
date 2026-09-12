import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import Home from "../page";

describe("Home (name generator screen)", () => {
  it("renders all controls with no results yet", () => {
    render(<Home />);

    expect(screen.getByText("Сеттинг")).toBeInTheDocument();
    expect(screen.getByText("Пол")).toBeInTheDocument();
    expect(screen.getByText("Количество вариантов")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Сгенерировать" })).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("generates exactly the requested count of names and switches the button to 'Ещё'", () => {
    render(<Home />);

    const countInput = screen.getByLabelText("Количество вариантов");
    fireEvent.change(countInput, { target: { value: "7" } });

    fireEvent.click(screen.getByRole("button", { name: "Сгенерировать" }));

    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(7);
    expect(screen.getByRole("button", { name: "Ещё" })).toBeInTheDocument();
  });

  it("regenerates a new batch when clicking 'Ещё' again, keeping the chosen filters", () => {
    render(<Home />);

    const settingSelect = screen.getByLabelText("Сеттинг") as HTMLSelectElement;
    fireEvent.change(settingSelect, { target: { value: "scifi" } });

    fireEvent.click(screen.getByRole("button", { name: "Сгенерировать" }));
    const firstBatch = within(screen.getByRole("list"))
      .getAllByRole("listitem")
      .map((item) => item.textContent);

    fireEvent.click(screen.getByRole("button", { name: "Ещё" }));
    const secondBatch = within(screen.getByRole("list"))
      .getAllByRole("listitem")
      .map((item) => item.textContent);

    expect(settingSelect.value).toBe("scifi");
    expect(secondBatch).not.toEqual(firstBatch);
  });

  it("respects the gender filter end-to-end through the UI", () => {
    render(<Home />);

    fireEvent.change(screen.getByLabelText("Сеттинг"), { target: { value: "fantasy" } });
    fireEvent.change(screen.getByLabelText("Пол"), { target: { value: "female" } });
    fireEvent.click(screen.getByRole("button", { name: "Сгенерировать" }));

    const names = within(screen.getByRole("list"))
      .getAllByRole("listitem")
      .map((item) => item.textContent);

    // Female fantasy prefixes never overlap with male ones (see generateNames.scifi.test.ts
    // for the same assumption applied to prefixes across settings).
    const maleOnlyPrefixes = ["Ar", "Bal", "Cor", "Dor", "Ivor"];
    for (const name of names) {
      expect(maleOnlyPrefixes.some((prefix) => name?.startsWith(prefix))).toBe(false);
    }
  });
});
