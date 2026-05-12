import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../src/app";

let adminToken: string;

beforeAll(async () => {
  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@example.com", password: "123456" });
  adminToken = loginRes.body.data.token;
});

describe("Inventory Concurrency & Atomicity", () => {
  it("should rollback on failed export and keep stock unchanged", async () => {
    const productRes = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        categoryId: 1,
        sku: `ATOMIC-${Date.now()}`,
        name: "Atomic Rollback Test",
        unit: "cái",
        costPrice: 1000,
        sellingPrice: 2000,
        currentStock: 10,
      });
    const pid = productRes.body.data.id;

    const exportRes = await request(app)
      .post("/api/inventory/export")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        productId: pid,
        quantity: 999,
        exportPrice: 500,
        note: "Should fail - not enough stock",
      });
    expect(exportRes.status).toBe(400);

    const getRes = await request(app)
      .get(`/api/products/${pid}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(getRes.body.data.currentStock).toBe(10);
  });

  it("should not create movement record on failed export", async () => {
    const productRes = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        categoryId: 1,
        sku: `ATOMIC2-${Date.now()}`,
        name: "Atomic No Movement Test",
        unit: "cái",
        costPrice: 1000,
        sellingPrice: 2000,
        currentStock: 5,
      });
    const pid = productRes.body.data.id;

    const movementsBefore = await request(app)
      .get(`/api/inventory/movements?productId=${pid}`)
      .set("Authorization", `Bearer ${adminToken}`);

    await request(app)
      .post("/api/inventory/export")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        productId: pid,
        quantity: 999,
        exportPrice: 500,
      });

    const movementsAfter = await request(app)
      .get(`/api/inventory/movements?productId=${pid}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(movementsAfter.body.data.items.length).toBe(
      movementsBefore.body.data.items.length
    );
  });

  it("should handle sequential import and export correctly", async () => {
    const productRes = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        categoryId: 1,
        sku: `SEQ-${Date.now()}`,
        name: "Sequential Test",
        unit: "cái",
        costPrice: 1000,
        sellingPrice: 2000,
        currentStock: 20,
      });
    const pid = productRes.body.data.id;

    await request(app)
      .post("/api/inventory/import")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ productId: pid, quantity: 10, importPrice: 500 });

    await request(app)
      .post("/api/inventory/export")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ productId: pid, quantity: 5, exportPrice: 600 });

    const getRes = await request(app)
      .get(`/api/products/${pid}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(getRes.body.data.currentStock).toBe(25);
  });
});
