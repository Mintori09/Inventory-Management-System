import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../src/app";

let adminToken: string;
let staffToken: string;

beforeAll(async () => {
  const adminRes = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@example.com", password: "123456" });
  adminToken = adminRes.body.data.token;

  const staffRes = await request(app)
    .post("/api/auth/login")
    .send({ email: "staff@example.com", password: "123456" });
  staffToken = staffRes.body.data.token;
});

describe("Dashboard API", () => {
  it("should return summary", async () => {
    const res = await request(app)
      .get("/api/dashboard/summary")
      .set("Authorization", `Bearer ${staffToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.totalProducts).toBeGreaterThanOrEqual(5);
    expect(typeof res.body.data.inventoryValue).toBe("number");
  });

  it("should return recent movements", async () => {
    const res = await request(app)
      .get("/api/dashboard/recent-movements")
      .set("Authorization", `Bearer ${staffToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should reject unauthenticated requests", async () => {
    const res = await request(app).get("/api/dashboard/summary");
    expect(res.status).toBe(401);
  });
});

describe("Audit Logs API", () => {
  it("should list audit logs (admin only)", async () => {
    const res = await request(app)
      .get("/api/audit-logs")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeGreaterThanOrEqual(1);
  });

  it("should reject list audit logs for staff", async () => {
    const res = await request(app)
      .get("/api/audit-logs")
      .set("Authorization", `Bearer ${staffToken}`);
    expect(res.status).toBe(403);
  });

  it("should get audit log by id", async () => {
    const listRes = await request(app)
      .get("/api/audit-logs")
      .set("Authorization", `Bearer ${adminToken}`);
    const logId = listRes.body.data.items[0]?.id;
    if (!logId) return;

    const res = await request(app)
      .get(`/api/audit-logs/${logId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(logId);
  });
});

describe("Auth Refresh Token", () => {
  let refreshToken: string;

  it("should return refresh token on login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "staff@example.com", password: "123456" });
    expect(res.status).toBe(200);
    expect(res.body.data.refreshToken).toBeDefined();
    refreshToken = res.body.data.refreshToken;
  });

  it("should refresh access token", async () => {
    const res = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    refreshToken = res.body.data.refreshToken;
  });

  it("should reject invalid refresh token", async () => {
    const res = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: "invalid-token" });
    expect(res.status).toBe(400);
  });

  it("should logout and revoke refresh token", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .send({ refreshToken });
    expect(res.status).toBe(200);
  });

  it("should reject revoked refresh token", async () => {
    const res = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken });
    expect(res.status).toBe(400);
  });
});

describe("Edge Cases", () => {
  it("should reject negative product quantity on create", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        categoryId: 1,
        sku: `EDGE-${Date.now()}`,
        name: "Edge Test",
        costPrice: -100,
        sellingPrice: 100,
        currentStock: -5,
      });
    expect(res.status).toBe(422);
  });

  it("should reject invalid categoryId on product create", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        categoryId: 99999,
        sku: `EDGE2-${Date.now()}`,
        name: "Edge Test 2",
        costPrice: 100,
        sellingPrice: 200,
      });
    expect(res.status).toBe(400);
  });

  it("should reject invalid product id in inventory operations", async () => {
    const res = await request(app)
      .post("/api/inventory/import")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        productId: 99999,
        quantity: 10,
        importPrice: 1000,
      });
    expect(res.status).toBe(400);
  });

  it("should require auth for protected routes", async () => {
    const res = await request(app).get("/api/products");
    expect(res.status).toBe(401);
  });

  it("should reject empty request body on create product", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});
    expect(res.status).toBe(422);
  });

  it("should filter products by stock status", async () => {
    const res = await request(app)
      .get("/api/products?stockStatus=out_of_stock")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.items)).toBe(true);
  });
});
