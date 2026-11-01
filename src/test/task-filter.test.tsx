
import { describe, it, expect, beforeEach } from "vitest";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "../App";
import { ToastProvider } from "../Context/Toast";
import { TaskProvider } from "../Context/Task";

describe("Task filtering", () => {
  beforeEach(() => {
    localStorage.clear();

    // Reset URL before every test.
    window.history.replaceState({}, "", "/");
  });

  it("should display only high-priority tasks when High filter is selected", async () => {
    // Arrange
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <TaskProvider>
          <App />
        </TaskProvider>
      </ToastProvider>
    );

    // Act: Select High priority.
    const highFilter = screen.getByRole("button", {
      name: /^high$/i,
    });

    await user.click(highFilter);

    // Assert: High-priority tasks should be visible.
    expect(
      screen.getByText("Implement user authentication")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Fix task filtering issues")
    ).toBeInTheDocument();

    // Assert: Other priority tasks should not be visible.
    expect(
      screen.queryByText("Design dashboard interface")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("Create reusable button components")
    ).not.toBeInTheDocument();

    // Assert: The URL should contain the selected filter.
    await waitFor(() => {
      expect(window.location.search).toContain("priority=High");
    });
  });
});
