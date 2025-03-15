import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "@vitest/browser/context";

import { App } from "../components/App";

describe("App component", () => {
  test("should render default state correctly", async () => {
    render(<App />);

    const propertySelector = page.getByRole("combobox", {
      name: "Properties",
    });
    const operatorSelector = page.getByRole("combobox", {
      name: "Operators",
    });
    const clearButton = page.getByRole("button", { name: "Clear" });
    const table = page.getByRole("table");

    await expect.element(propertySelector).toBeInTheDocument();
    await expect.element(operatorSelector).toBeInTheDocument();
    await expect.element(clearButton).toBeInTheDocument();
    await expect.element(table).toBeInTheDocument();

    // table header + 6 products = 7 rows
    expect(page.getByRole("row").elements().length).toBe(7);

    const tableHeader = page.getByRole("rowheader");
  });

  test("should show input when selecting string or number property", async () => {
    render(<App />);

    const propertySelector = page.getByRole("combobox", {
      name: "Properties",
    });

    const operatorSelector = page.getByRole("combobox", {
      name: "Operators",
    });

    await propertySelector.selectOptions("Product Name");
    await operatorSelector.selectOptions("Equals");

    const inputElement = page.getByPlaceholder("Filter value...");
    await expect.element(inputElement).toBeInTheDocument();

    await propertySelector.selectOptions("weight (oz)");
    await expect.element(inputElement).toBeInTheDocument();

    const listbox = page.getByRole("listbox");
    await expect.element(listbox).not.toBeInTheDocument();
  });

  test("should show listbox when selecting enumerable property", async () => {
    render(<App />);

    const propertySelector = page.getByRole("combobox", {
      name: "Properties",
    });

    const operatorSelector = page.getByRole("combobox", {
      name: "Operators",
    });

    await propertySelector.selectOptions("category");
    await operatorSelector.selectOptions("Is any of");

    const listbox = page.getByRole("listbox");
    await expect.element(listbox).toBeInTheDocument();

    const inputElement = page.getByPlaceholder("Filter value...");
    await expect.element(inputElement).not.toBeInTheDocument();
  });

  test("should not show input or listbox when 'any' or 'none' operators are selected", async () => {
    render(<App />);

    const propertySelector = page.getByRole("combobox", {
      name: "Properties",
    });

    const operatorSelector = page.getByRole("combobox", {
      name: "Operators",
    });

    await propertySelector.selectOptions("color");
    await operatorSelector.selectOptions("Has any value");

    const listbox = page.getByRole("listbox");
    await expect.element(listbox).not.toBeInTheDocument();

    const inputElement = page.getByPlaceholder("Filter value...");
    await expect.element(inputElement).not.toBeInTheDocument();
  });

  test("should clear inputs", async () => {
    render(<App />);

    const propertySelector = page.getByRole("combobox", {
      name: "Properties",
    });

    const operatorSelector = page.getByRole("combobox", {
      name: "Operators",
    });

    await propertySelector.selectOptions("Product Name");
    await operatorSelector.selectOptions("Equals");

    const inputElement = page.getByPlaceholder("Filter value...");
    await inputElement.fill("test");

    expect(page.getByRole("row").elements().length).toBe(1);

    const clearButton = page.getByRole("button", { name: "Clear" });
    await clearButton.click();

    await expect.element(propertySelector).toHaveValue("");
    await expect.element(operatorSelector).toHaveValue("");
    await expect.element(inputElement).not.toBeInTheDocument();
    expect(page.getByRole("row").elements().length).toBe(7);
  });

  test("should match exactly when using the 'Equals' operator", async () => {
    render(<App />);

    const propertySelector = page.getByRole("combobox", {
      name: "Properties",
    });

    const operatorSelector = page.getByRole("combobox", {
      name: "Operators",
    });

    await propertySelector.selectOptions("color");
    await operatorSelector.selectOptions("Equals");

    const inputElement = page.getByPlaceholder("Filter value...");
    await inputElement.fill("silver");

    expect(page.getByRole("row").elements().length).toBe(2);
    await expect
      .element(page.getByRole("cell", { name: "Key" }))
      .toBeInTheDocument();

    await inputElement.fill("sil");
    expect(page.getByRole("row").elements().length).toBe(1);
    await expect
      .element(page.getByRole("cell", { name: "Key" }))
      .not.toBeInTheDocument();
  });

  test("should apply the 'greater than' operator correctly", async () => {
    render(<App />);

    const propertySelector = page.getByRole("combobox", {
      name: "Properties",
    });

    const operatorSelector = page.getByRole("combobox", {
      name: "Operators",
    });

    await propertySelector.selectOptions("weight (oz)");
    await operatorSelector.selectOptions("Is greater than");

    const inputElement = page.getByPlaceholder("Filter value...");
    await inputElement.fill("3");

    expect(page.getByRole("row").elements().length).toBe(4);

    await expect
      .element(page.getByRole("cell", { name: "Headphones" }))
      .toBeInTheDocument();

    await expect
      .element(page.getByRole("cell", { name: "Keyboard" }))
      .toBeInTheDocument();

    await expect
      .element(page.getByRole("cell", { name: "Hammer" }))
      .toBeInTheDocument();
  });

  test("should apply the 'greater than' operator correctly", async () => {
    render(<App />);

    const propertySelector = page.getByRole("combobox", {
      name: "Properties",
    });

    const operatorSelector = page.getByRole("combobox", {
      name: "Operators",
    });

    await propertySelector.selectOptions("weight (oz)");
    await operatorSelector.selectOptions("Is greater than");

    const inputElement = page.getByPlaceholder("Filter value...");
    await inputElement.fill("3");

    expect(page.getByRole("row").elements().length).toBe(4);

    await expect
      .element(page.getByRole("cell", { name: "Headphones" }))
      .toBeInTheDocument();

    await expect
      .element(page.getByRole("cell", { name: "Keyboard" }))
      .toBeInTheDocument();

    await expect
      .element(page.getByRole("cell", { name: "Hammer" }))
      .toBeInTheDocument();
  });
});
