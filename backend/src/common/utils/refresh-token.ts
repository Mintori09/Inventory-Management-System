import crypto from "crypto";
import { env } from "../../config/env";

export function generateRefreshToken(): string {
  return crypto.randomBytes(40).toString("hex");
}

export function getRefreshTokenExpiry(): Date {
  return new Date(Date.now() + env.jwtRefreshExpiresInMs);
}
