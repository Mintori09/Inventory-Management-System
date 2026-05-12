import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "@/components/ui/Modal";
import { Drawer } from "@/components/ui/Drawer";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

describe("Modal", () => {
  it("renders when open", () => {
    render(<Modal open title="Test Modal" onClose={() => {}}><p>Content</p></Modal>);
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<Modal open={false} title="Hidden" onClose={() => {}}><p>Hidden</p></Modal>);
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("calls onClose on close button", async () => {
    let closed = false;
    render(<Modal open title="Close" onClose={() => { closed = true; }}><p>X</p></Modal>);
    const closeBtn = screen.getByRole("button", { name: /đóng/i });
    await userEvent.click(closeBtn);
    expect(closed).toBe(true);
  });
});

describe("Drawer", () => {
  it("renders when open", () => {
    render(<Drawer open title="Detail" onClose={() => {}}><p>Details</p></Drawer>);
    expect(screen.getByText("Detail")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<Drawer open={false} title="Hidden" onClose={() => {}}><p>Nope</p></Drawer>);
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });
});

describe("ConfirmDialog", () => {
  it("renders with message", () => {
    render(<ConfirmDialog open title="Confirm" message="Are you sure?" onClose={() => {}} onConfirm={() => {}} />);
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("calls onConfirm on confirm", async () => {
    let confirmed = false;
    render(<ConfirmDialog open title="Sure?" message="Proceed?" onClose={() => {}} onConfirm={() => { confirmed = true; }} />);
    await userEvent.click(screen.getByRole("button", { name: /xác nhận/i }));
    expect(confirmed).toBe(true);
  });

  it("calls onClose on cancel", async () => {
    let closed = false;
    render(<ConfirmDialog open title="Sure?" message="Really?" onClose={() => { closed = true; }} onConfirm={() => {}} />);
    await userEvent.click(screen.getByRole("button", { name: /hủy/i }));
    expect(closed).toBe(true);
  });
});
