
import { describe, it, expect, beforeEach } from "vitest";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "../App";
import { ToastProvider } from "../Context/Toast";
import { TaskProvider } from "../Context/Task";

describe("Task creation workflow", () => {
  beforeEach(() => {
    // Start with an empty localStorage for every test.
    localStorage.clear();
  });

  it("should create a task and display it on the board", async () => {
    // Arrange
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <TaskProvider>
          <App />
        </TaskProvider>
      </ToastProvider>
    );

    // Act 1: Open the create task modal.
    await user.click(
      screen.getByRole("button", { name: /new task/i })
    );

    // Act 2: Enter the task title.
    const titleInput = screen.getByPlaceholderText(
      "Enter task title"
    );

    await user.type(titleInput, "Prepare release checklist");

    // Act 3: Submit the form.
    const createButton = screen.getByRole("button", {
      name: /create task/i,
    });

    expect(createButton).toBeEnabled();

    await user.click(createButton);

    // Assert: Verify the task appears on the board.
    expect(
      await screen.findByText("Prepare release checklist")
    ).toBeInTheDocument();
  });
});
