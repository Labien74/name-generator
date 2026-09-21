import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import Home from "../page";

describe("Home (name generator screen)", () => {
  it("renders all controls with no results yet", () => {
    render(<Home />);

    expect(screen.getByText("Setting")).toBeInTheDocument();
    expect(screen.getByText("Gender")).toBeInTheDocument();
    expect(screen.getByText("Count")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Generate" })).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("generates exactly the requested count of names and switches the button to 'More'", () => {
    render(<Home />);

    const countInput = screen.getByLabelText("Count");
    fireEvent.change(countInput, { target: { value: "7" } });

    fireEvent.click(screen.getByRole("button", { name: "Generate" }));

    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(7);
    expect(screen.getByRole("button", { name: "More" })).toBeInTheDocument();
  });

  it("regenerates a new batch when clicking 'More' again, keeping the chosen filters", () => {
    render(<Home />);

    const settingSelect = screen.getByLabelText("Setting") as HTMLSelectElement;
    fireEvent.change(settingSelect, { target: { value: "scifi" } });

    fireEvent.click(screen.getByRole("button", { name: "Generate" }));
    const firstBatch = within(screen.getByRole("list"))
      .getAllByRole("listitem")
      .map((item) => item.textContent);

    fireEvent.click(screen.getByRole("button", { name: "More" }));
    const secondBatch = within(screen.getByRole("list"))
      .getAllByRole("listitem")
      .map((item) => item.textContent);

    expect(settingSelect.value).toBe("scifi");
    expect(secondBatch).not.toEqual(firstBatch);
  });

  it("respects the gender filter end-to-end through the UI", () => {
    render(<Home />);

    fireEvent.change(screen.getByLabelText("Setting"), { target: { value: "fantasy" } });
    fireEvent.change(screen.getByLabelText("Gender"), { target: { value: "female" } });
    fireEvent.click(screen.getByRole("button", { name: "Generate" }));

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

  it("shows region and century selects only when 'Realistic' is chosen", () => {
    render(<Home />);

    expect(screen.queryByLabelText("Region")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Century")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Setting"), { target: { value: "realistic" } });

    expect(screen.getByLabelText("Region")).toBeInTheDocument();
    expect(screen.getByLabelText("Century")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Setting"), { target: { value: "fantasy" } });

    expect(screen.queryByLabelText("Region")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Century")).not.toBeInTheDocument();
  });

  it("restricts generated names to the chosen realistic region", () => {
    render(<Home />);

    fireEvent.change(screen.getByLabelText("Setting"), { target: { value: "realistic" } });
    fireEvent.change(screen.getByLabelText("Region"), { target: { value: "usa" } });
    fireEvent.change(screen.getByLabelText("Century"), { target: { value: "20th_century" } });
    fireEvent.change(screen.getByLabelText("Gender"), { target: { value: "male" } });
    fireEvent.click(screen.getByRole("button", { name: "Generate" }));

    const names = within(screen.getByRole("list"))
      .getAllByRole("listitem")
      .map((item) => item.textContent);

    const usaMaleNames = [
      "Walter",
      "Harold",
      "Frank",
      "Raymond",
      "Eugene",
      "Arthur",
      "Clarence",
      "Elmer",
    ];
    for (const name of names) {
      const firstName = name?.split(" ")[0];
      expect(usaMaleNames).toContain(firstName);
      expect(name?.includes(" ")).toBe(true);
    }
  });

  it("shows title/nickname checkboxes for Fantasy and Realistic, but not Sci-Fi", () => {
    render(<Home />);

    // Fantasy is the default setting.
    expect(screen.getByText("Include title")).toBeInTheDocument();
    expect(screen.getByText("Include nickname")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Setting"), { target: { value: "scifi" } });
    expect(screen.queryByText("Include title")).not.toBeInTheDocument();
    expect(screen.queryByText("Include nickname")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Setting"), { target: { value: "realistic" } });
    expect(screen.getByText("Include title")).toBeInTheDocument();
    expect(screen.getByText("Include nickname")).toBeInTheDocument();
  });

  it("includes a title and nickname in generated names when both checkboxes are checked", () => {
    render(<Home />);

    fireEvent.click(screen.getByLabelText("Include title"));
    fireEvent.click(screen.getByLabelText("Include nickname"));
    fireEvent.click(screen.getByRole("button", { name: "Generate" }));

    const names = within(screen.getByRole("list"))
      .getAllByRole("listitem")
      .map((item) => item.textContent ?? "");

    for (const name of names) {
      // Title is the first word, nickname is signalled by " the " somewhere
      // in the string (fantasy epithets are stored as "the X").
      expect(name.includes(" the ")).toBe(true);
    }
  });

  it("disables region/century options that have no data for the other filter", () => {
    render(<Home />);

    fireEvent.change(screen.getByLabelText("Setting"), { target: { value: "realistic" } });

    const option = (label: string, text: string) =>
      within(screen.getByLabelText(label)).getByRole("option", { name: text }) as HTMLOptionElement;

    // Nothing selected yet — every option is available.
    expect(option("Century", "1200–1600").disabled).toBe(false);
    expect(option("Region", "Japan").disabled).toBe(false);

    fireEvent.change(screen.getByLabelText("Region"), { target: { value: "japan" } });
    expect(option("Century", "1200–1600").disabled).toBe(true);
    expect(option("Century", "20th century").disabled).toBe(true);
    expect(option("Century", "21st century").disabled).toBe(false);
    expect(option("Century", "Any").disabled).toBe(false);

    fireEvent.change(screen.getByLabelText("Region"), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("Century"), { target: { value: "1200_1600" } });
    expect(option("Region", "Japan").disabled).toBe(true);
    expect(option("Region", "USA").disabled).toBe(true);
    expect(option("Region", "Western Europe").disabled).toBe(false);
    expect(option("Region", "Any").disabled).toBe(false);
  });
});
