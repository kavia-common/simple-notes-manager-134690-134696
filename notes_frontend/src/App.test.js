import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders app chrome and actions", () => {
  render(<App />);
  expect(screen.getByText(/Simple Notes/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /new note/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Switch to/i })).toBeInTheDocument();
});
