import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";

describe("Auth API", () => {
  it("should login with valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "123456" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe("admin@example.com");
    expect(res.body.data.user.role).toBe("admin");
  });

  it("should fail with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "wrong" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should return 422 with invalid email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "not-an-email", password: "123456" });

    expect(res.status).toBe(422);
  });

  it("should return user info from /me with valid token", async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "123456" });

    const token = loginRes.body.data.token;

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe("admin@example.com");
  });

  it("should return 401 for /me without token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});
