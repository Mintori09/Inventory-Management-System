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

describe("Users API", () => {
  const testEmail = `testuser-${Date.now()}@example.com`;

  it("should list users (admin only)", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeGreaterThanOrEqual(2);
  });

  it("should reject listing users for staff", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${staffToken}`);
    expect(res.status).toBe(403);
  });

  it("should create a user", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        fullName: "Test User",
        email: testEmail,
        password: "123456",
        role: "staff",
      });
    expect(res.status).toBe(201);
    expect(res.body.data.email).toBe(testEmail);
  });

  it("should reject duplicate email", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        fullName: "Test User",
        email: testEmail,
        password: "123456",
        role: "staff",
      });
    expect(res.status).toBe(400);
  });

  it("should get user by id", async () => {
    const res = await request(app)
      .get("/api/users/1")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(1);
  });

  it("should return 404 for non-existent user", async () => {
    const res = await request(app)
      .get("/api/users/99999")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
  });

  it("should update a user", async () => {
    const listRes = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${adminToken}`);
    const userId = listRes.body.data.items.find(
      (u: any) => u.email === testEmail
    )?.id;
    if (!userId) return;

    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ fullName: "Updated Name" });
    expect(res.status).toBe(200);
    expect(res.body.data.fullName).toBe("Updated Name");
  });

  it("should deactivate a user", async () => {
    const listRes = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${adminToken}`);
    const userId = listRes.body.data.items.find(
      (u: any) => u.email === testEmail
    )?.id;
    if (!userId) return;

    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);

    const getRes = await request(app)
      .get(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(getRes.body.data.isActive).toBe(false);
  });
});

describe("Categories API", () => {
  it("should list categories", async () => {
    const res = await request(app)
      .get("/api/categories")
      .set("Authorization", `Bearer ${staffToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(6);
  });

  it("should create category (admin)", async () => {
    const res = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: `Test Cat ${Date.now()}` });
    expect(res.status).toBe(201);
  });

  it("should reject create category for staff", async () => {
    const res = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ name: "Staff Cat" });
    expect(res.status).toBe(403);
  });

  it("should reject duplicate category name", async () => {
    const res = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Bàn phím" });
    expect(res.status).toBe(400);
  });

  it("should update category", async () => {
    const res = await request(app)
      .put("/api/categories/1")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ description: "Updated description" });
    expect(res.status).toBe(200);
  });
});

describe("Suppliers API", () => {
  it("should list suppliers", async () => {
    const res = await request(app)
      .get("/api/suppliers")
      .set("Authorization", `Bearer ${staffToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(3);
  });

  it("should create supplier (admin)", async () => {
    const res = await request(app)
      .post("/api/suppliers")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: `Test Supplier ${Date.now()}`, phone: "0900000000" });
    expect(res.status).toBe(201);
  });

  it("should reject create supplier for staff", async () => {
    const res = await request(app)
      .post("/api/suppliers")
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ name: "Staff Supplier" });
    expect(res.status).toBe(403);
  });
});
