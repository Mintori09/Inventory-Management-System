import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";

describe("Button", () => {
  it("renders with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("handles click", async () => {
    let clicked = false;
    render(<Button onClick={() => { clicked = true; }}>Click</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(clicked).toBe(true);
  });

  it("shows loading state", () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});

describe("Badge", () => {
  it("renders with variant and text", () => {
    render(<Badge variant="success">Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });
});

describe("Input", () => {
  it("renders with label", () => {
    render(<Input label="Email" placeholder="Enter email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<Input label="Name" error="Required" />);
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("accepts user input", async () => {
    render(<Input label="Search" />);
    const input = screen.getByLabelText("Search");
    await userEvent.type(input, "test");
    expect(input).toHaveValue("test");
  });
});

describe("Select", () => {
  const options = [
    { value: "", label: "All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  it("renders with options", () => {
    render(<Select label="Status" options={options} />);
    expect(screen.getByLabelText("Status")).toBeInTheDocument();
  });
});

describe("LoadingSkeleton", () => {
  it("renders multiple items", () => {
    const { container } = render(<LoadingSkeleton count={3} />);
    expect(container.children.length).toBe(3);
  });
});

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(<EmptyState title="No data" description="Nothing to show" />);
    expect(screen.getByText("No data")).toBeInTheDocument();
    expect(screen.getByText("Nothing to show")).toBeInTheDocument();
  });

  it("renders action button", () => {
    render(<EmptyState title="Empty" actionLabel="Add" onAction={() => {}} />);
    expect(screen.getByText("Add")).toBeInTheDocument();
  });
});

describe("Pagination", () => {
  it("renders page info", () => {
    render(<Pagination page={1} totalPages={3} onPageChange={() => {}} />);
    expect(screen.getByText(/Trang 1 \/ 3/)).toBeInTheDocument();
  });

  it("shows two navigation buttons", () => {
    render(<Pagination page={1} totalPages={3} onPageChange={() => {}} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(2);
  });
});
