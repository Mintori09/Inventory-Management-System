import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../src/app";

let adminToken: string;

beforeAll(async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@example.com", password: "123456" });
  adminToken = res.body.data.token;
});

describe("CSV Export API", () => {
  it("should return CSV file with correct headers", async () => {
    const res = await request(app)
      .get("/api/inventory/export")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/csv");
    expect(res.headers["content-disposition"]).toContain(
      "inventory-export.csv"
    );
  });

  it("should return CSV with header row and at least one data row", async () => {
    const res = await request(app)
      .get("/api/inventory/export")
      .set("Authorization", `Bearer ${adminToken}`);
    const lines = res.text.split("\n").filter((l) => l.trim());
    expect(lines.length).toBeGreaterThan(1);
    expect(lines[0]).toContain("SKU");
    expect(lines[0]).toContain("Tên sản phẩm");
    expect(lines[0]).toContain("Tồn kho");
    expect(lines[1]).toContain('"');
  });
});
