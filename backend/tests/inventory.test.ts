import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../src/app";

let adminToken: string;
let staffToken: string;
let testProductId: number;

beforeAll(async () => {
  const adminRes = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@example.com", password: "123456" });
  adminToken = adminRes.body.data.token;

  const staffRes = await request(app)
    .post("/api/auth/login")
    .send({ email: "staff@example.com", password: "123456" });
  staffToken = staffRes.body.data.token;

  const productRes = await request(app)
    .post("/api/products")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      categoryId: 1,
      sku: `INV-${Date.now()}`,
      name: "Inventory Test Product",
      unit: "cái",
      costPrice: 100000,
      sellingPrice: 200000,
      currentStock: 10,
      minStock: 2,
    });
  testProductId = productRes.body.data.id;
});

describe("Inventory API", () => {
  it("should import stock and increase current stock", async () => {
    const res = await request(app)
      .post("/api/inventory/import")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        productId: testProductId,
        quantity: 50,
        importPrice: 900000,
        note: "Test import",
      });

    expect(res.status).toBe(201);
    expect(res.body.data.stockBefore).toBe(10);
    expect(res.body.data.stockAfter).toBe(60);
  });

  it("should export stock and decrease current stock", async () => {
    const res = await request(app)
      .post("/api/inventory/export")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        productId: testProductId,
        quantity: 5,
        exportPrice: 1590000,
        note: "Test export",
      });

    expect(res.status).toBe(201);
    expect(res.body.data.stockBefore).toBe(60);
    expect(res.body.data.stockAfter).toBe(55);
  });

  it("should fail export when insufficient stock", async () => {
    const res = await request(app)
      .post("/api/inventory/export")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        productId: testProductId,
        quantity: 9999,
        exportPrice: 1590000,
        note: "Over-export test",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Không đủ tồn kho");
  });

  it("should reject adjust stock for staff", async () => {
    const res = await request(app)
      .post("/api/inventory/adjust")
      .set("Authorization", `Bearer ${staffToken}`)
      .send({
        productId: testProductId,
        adjustmentType: "increase",
        quantity: 10,
        note: "Staff adjust test",
      });

    expect(res.status).toBe(403);
  });

  it("should allow admin to adjust stock", async () => {
    const res = await request(app)
      .post("/api/inventory/adjust")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        productId: testProductId,
        adjustmentType: "increase",
        quantity: 10,
        note: "Admin adjust test",
      });

    expect(res.status).toBe(201);
    expect(res.body.data.stockAfter).toBe(65);
  });

  it("should list movements", async () => {
    const res = await request(app)
      .get("/api/inventory/movements")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeGreaterThan(0);
  });

  it("should list low stock products", async () => {
    const res = await request(app)
      .get("/api/inventory/low-stock")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
