import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "./Pagination";

describe("Pagination Component", () => {
  it("should not render if totalPages is 1 or less", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />,
    );
    const nav = container.querySelector(".pagination");
    expect(nav).toBeFalsy();
  });

  it("should render pagination nav element", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />,
    );
    const nav = container.querySelector(".pagination");
    expect(nav).toBeTruthy();
  });

  it("should have aria-label for accessibility", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />,
    );
    const nav = container.querySelector(".pagination");
    expect(nav?.getAttribute("aria-label")).toBe("Table pagination");
  });

  it("should render Previous button", () => {
    render(
      <Pagination currentPage={2} totalPages={3} onPageChange={() => {}} />,
    );
    const prevButton = screen.getByRole("button", { name: "Previous" });
    expect(prevButton).toBeTruthy();
  });

  it("should render Next button", () => {
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />,
    );
    const nextButton = screen.getByRole("button", { name: "Next" });
    expect(nextButton).toBeTruthy();
  });

  it("should render page number buttons", () => {
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />,
    );
    const pageButtons = screen.getAllByRole("button");
    // Previous + 3 pages + Next = 5 buttons
    expect(pageButtons.length).toBe(5);
  });

  it("should disable Previous button on first page", () => {
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />,
    );
    const prevButton = screen.getByRole("button", {
      name: "Previous",
    }) as HTMLButtonElement;
    expect(prevButton.disabled).toBe(true);
  });

  it("should disable Next button on last page", () => {
    render(
      <Pagination currentPage={3} totalPages={3} onPageChange={() => {}} />,
    );
    const nextButton = screen.getByRole("button", {
      name: "Next",
    }) as HTMLButtonElement;
    expect(nextButton.disabled).toBe(true);
  });

  it("should not disable Previous button on middle page", () => {
    render(
      <Pagination currentPage={2} totalPages={3} onPageChange={() => {}} />,
    );
    const prevButton = screen.getByRole("button", {
      name: "Previous",
    }) as HTMLButtonElement;
    expect(prevButton.disabled).toBe(false);
  });

  it("should not disable Next button on middle page", () => {
    render(
      <Pagination currentPage={2} totalPages={3} onPageChange={() => {}} />,
    );
    const nextButton = screen.getByRole("button", {
      name: "Next",
    }) as HTMLButtonElement;
    expect(nextButton.disabled).toBe(false);
  });

  it("should call onPageChange when clicking a page button", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />,
    );

    const page2Button = screen.getByRole("button", { name: "2" });
    await user.click(page2Button);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("should call onPageChange with previous page when clicking Previous", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={2} totalPages={3} onPageChange={onPageChange} />,
    );

    const prevButton = screen.getByRole("button", { name: "Previous" });
    await user.click(prevButton);

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("should call onPageChange with next page when clicking Next", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />,
    );

    const nextButton = screen.getByRole("button", { name: "Next" });
    await user.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("should mark current page button as primary variant", () => {
    render(
      <Pagination currentPage={2} totalPages={3} onPageChange={() => {}} />,
    );

    const page2Button = screen.getByRole("button", { name: "2" });
    expect(page2Button.className).toContain("button--primary");
  });

  it("should not mark non-current page buttons as primary variant", () => {
    render(
      <Pagination currentPage={2} totalPages={3} onPageChange={() => {}} />,
    );

    const page1Button = screen.getByRole("button", { name: "1" });
    const page3Button = screen.getByRole("button", { name: "3" });

    expect(page1Button.className).not.toContain("button--primary");
    expect(page3Button.className).not.toContain("button--primary");
  });
});
