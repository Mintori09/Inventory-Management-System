import { prisma } from "../../config/prisma";
import { getPagination } from "../../common/utils/pagination";
import { Prisma } from "@prisma/client";

export async function findUsers(query: {
  search?: string;
  role?: string;
  isActive?: string;
  page?: string;
  limit?: string;
}) {
  const { search, role, isActive: isActiveStr } = query;
  const { page, limit, skip } = getPagination(
    query.page ? Number(query.page) : undefined,
    query.limit ? Number(query.limit) : undefined
  );

  const where: Prisma.UserWhereInput = { isActive: true };

  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  if (role) {
    where.role = role as any;
  }

  if (isActiveStr !== undefined) {
    where.isActive = isActiveStr === "true";
  }

  const [items, totalItems] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
}

export async function findUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(data: {
  fullName: string;
  email: string;
  passwordHash: string;
  role: string;
  isActive: boolean;
}) {
  return prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.role as any,
      isActive: data.isActive,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
}

export async function updateUser(
  id: number,
  data: Record<string, unknown>
) {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
}

export async function deactivateUser(id: number) {
  return prisma.user.update({
    where: { id },
    data: { isActive: false },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
}
