import dotenv from "dotenv";
dotenv.config();

function requireEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  port: parseInt(process.env.PORT || "4000", 10),
  nodeEnv: process.env.NODE_ENV || "development",

  databaseUrl: requireEnv("DATABASE_URL"),

  jwtSecret: requireEnv("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  jwtRefreshExpiresInMs: 7 * 24 * 60 * 60 * 1000,

  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",

  get isProduction() {
    return this.nodeEnv === "production";
  },
  get isDevelopment() {
    return this.nodeEnv === "development";
  },
};
