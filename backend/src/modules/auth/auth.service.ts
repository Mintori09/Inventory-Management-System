import { prisma } from "../../config/prisma";
import { comparePassword } from "../../common/utils/hash";
import { signToken } from "../../common/utils/jwt";
import {
  generateRefreshToken,
  getRefreshTokenExpiry,
} from "../../common/utils/refresh-token";
import { UnauthorizedError } from "../../common/errors/UnauthorizedError";
import { ForbiddenError } from "../../common/errors/ForbiddenError";
import { BadRequestError } from "../../common/errors/BadRequestError";
import * as authRepository from "./auth.repository";

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new UnauthorizedError("Email hoặc mật khẩu không đúng");
  }

  if (!user.isActive) {
    throw new ForbiddenError("Tài khoản đã bị khóa");
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new UnauthorizedError("Email hoặc mật khẩu không đúng");
  }

  const token = signToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken();
  await authRepository.createRefreshToken(
    refreshToken,
    user.id,
    getRefreshTokenExpiry()
  );

  return {
    token,
    refreshToken,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
}

export async function refreshAccessToken(refreshTokenStr: string) {
  const stored = await authRepository.findRefreshToken(refreshTokenStr);
  if (!stored) throw new BadRequestError("Refresh token không hợp lệ");

  if (stored.revokedAt) {
    throw new BadRequestError("Refresh token đã bị thu hồi");
  }

  if (stored.expiresAt < new Date()) {
    throw new BadRequestError("Refresh token đã hết hạn");
  }

  const user = await prisma.user.findUnique({
    where: { id: stored.userId },
  });
  if (!user || !user.isActive) {
    throw new UnauthorizedError("Người dùng không tồn tại hoặc đã bị khóa");
  }

  const newToken = signToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  const newRefreshToken = generateRefreshToken();
  await authRepository.createRefreshToken(
    newRefreshToken,
    user.id,
    getRefreshTokenExpiry()
  );

  await authRepository.revokeRefreshToken(refreshTokenStr);

  return {
    token: newToken,
    refreshToken: newRefreshToken,
  };
}

export async function logout(refreshTokenStr: string) {
  const stored = await authRepository.findRefreshToken(refreshTokenStr);
  if (!stored) throw new BadRequestError("Refresh token không hợp lệ");

  await authRepository.revokeRefreshToken(refreshTokenStr);
  return { message: "Đăng xuất thành công" };
}

export async function logoutAll(userId: number) {
  await authRepository.revokeAllUserRefreshTokens(userId);
  return { message: "Đăng xuất khỏi tất cả thiết bị thành công" };
}

export async function getMe(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  if (!user) {
    throw new UnauthorizedError("Người dùng không tồn tại");
  }

  return user;
}
