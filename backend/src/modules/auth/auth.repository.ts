import { prisma } from "../../config/prisma";

export async function createRefreshToken(
  token: string,
  userId: number,
  expiresAt: Date
) {
  return prisma.refreshToken.create({
    data: { token, userId, expiresAt },
  });
}

export async function findRefreshToken(token: string) {
  return prisma.refreshToken.findUnique({ where: { token } });
}

export async function revokeRefreshToken(token: string) {
  return prisma.refreshToken.update({
    where: { token },
    data: { revokedAt: new Date() },
  });
}

export async function revokeAllUserRefreshTokens(userId: number) {
  return prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
