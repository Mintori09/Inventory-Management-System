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

describe("Stock Statistics API", () => {
  it("should return statistics without date params", async () => {
    const res = await request(app)
      .get("/api/inventory/statistics")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(typeof res.body.data.totalImportQuantity).toBe("number");
    expect(typeof res.body.data.totalImportValue).toBe("number");
    expect(typeof res.body.data.totalExportQuantity).toBe("number");
    expect(typeof res.body.data.totalExportValue).toBe("number");
    expect(typeof res.body.data.netStockChange).toBe("number");
  });

  it("should return statistics grouped by day", async () => {
    const res = await request(app)
      .get("/api/inventory/statistics?groupBy=day")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.breakdown)).toBe(true);
    if (res.body.data.breakdown.length > 0) {
      expect(res.body.data.breakdown[0]).toHaveProperty("period");
      expect(res.body.data.breakdown[0]).toHaveProperty("importQuantity");
    }
  });

  it("should return statistics filtered by date range", async () => {
    const res = await request(app)
      .get(
        `/api/inventory/statistics?from=2020-01-01&to=${new Date().toISOString().split("T")[0]}`
      )
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.totalImportQuantity).toBeGreaterThanOrEqual(0);
  });
});
