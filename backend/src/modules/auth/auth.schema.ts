import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token không được để trống"),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token không được để trống"),
});
