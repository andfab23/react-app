/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import React from "react";
import { expect, test } from "vitest";
import App from "./App";

test("renders learn react link", () => {
  render(React.createElement(App));
  const linkElement = screen.getByText(/¡Universidad Católica de Pereira !/i);
  expect(linkElement).toBeInTheDocument();
});
