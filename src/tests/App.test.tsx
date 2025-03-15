import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "@vitest/browser/context";

import { App } from "../components/App";

describe("App component", () => {
  test("should render default state correctly", async () => {
    render(<App />);

    const propertySelector = page.getByText("Select a property...");
    const operatorSelector = page.getByText("Select an operator...");
    const clearButton = page.getByRole("button", { name: "Clear" });

    await expect.element(propertySelector).toBeInTheDocument();
    await expect.element(operatorSelector).toBeInTheDocument();
    await expect.element(clearButton).toBeInTheDocument();
  });
});
