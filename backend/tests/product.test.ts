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

describe("Products API", () => {
  it("should create a product (admin)", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        categoryId: 1,
        sku: `TEST-${Date.now()}`,
        name: "Test Product",
        unit: "cái",
        costPrice: 100000,
        sellingPrice: 200000,
        currentStock: 10,
        minStock: 2,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.sku).toBeDefined();
  });

  it("should reject duplicate SKU", async () => {
    const sku = `DUP-${Date.now()}`;
    await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        categoryId: 1,
        sku,
        name: "Original",
        unit: "cái",
        costPrice: 100000,
        sellingPrice: 200000,
        currentStock: 10,
        minStock: 2,
      });

    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        categoryId: 1,
        sku,
        name: "Duplicate",
        unit: "cái",
        costPrice: 100000,
        sellingPrice: 200000,
        currentStock: 10,
        minStock: 2,
      });

    expect(res.status).toBe(400);
  });

  it("should reject product creation by staff", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${staffToken}`)
      .send({
        categoryId: 1,
        sku: `STAFF-${Date.now()}`,
        name: "Staff Product",
        unit: "cái",
        costPrice: 100000,
        sellingPrice: 200000,
      });

    expect(res.status).toBe(403);
  });

  it("should list products", async () => {
    const res = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.items).toBeDefined();
    expect(Array.isArray(res.body.data.items)).toBe(true);
  });
});
