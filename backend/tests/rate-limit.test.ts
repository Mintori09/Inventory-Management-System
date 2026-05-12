import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";

describe("Rate Limiting", () => {
  it("should include RateLimit headers on login response", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "123456" });
    expect(res.status).toBe(200);
    expect(res.headers["ratelimit-limit"]).toBeDefined();
    expect(res.headers["ratelimit-remaining"]).toBeDefined();
  });

  it("should decrease remaining limit on each request", async () => {
    const r1 = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "123456" });
    const remaining1 = Number(r1.headers["ratelimit-remaining"]);

    const r2 = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "123456" });
    const remaining2 = Number(r2.headers["ratelimit-remaining"]);

    expect(remaining2).toBeLessThan(remaining1);
  });
});
