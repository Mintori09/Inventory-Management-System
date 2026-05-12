import { prisma } from "../../config/prisma";
import { getPagination } from "../../common/utils/pagination";
import { NotFoundError } from "../../common/errors/NotFoundError";
import { Prisma } from "@prisma/client";

export async function getAuditLogs(query: {
  search?: string;
  action?: string;
  userId?: string;
  from?: string;
  to?: string;
  page?: string;
  limit?: string;
}) {
  const { page, limit, skip } = getPagination(
    query.page ? Number(query.page) : undefined,
    query.limit ? Number(query.limit) : undefined
  );

  const where: Prisma.AuditLogWhereInput = {};

  if (query.search) {
    where.description = { contains: query.search, mode: "insensitive" };
  }
  if (query.action) where.action = query.action;
  if (query.userId) where.userId = parseInt(query.userId);
  if (query.from || query.to) {
    where.createdAt = {};
    if (query.from) where.createdAt.gte = new Date(query.from);
    if (query.to) where.createdAt.lte = new Date(query.to);
  }

  const [items, totalItems] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        user: { select: { id: true, fullName: true } },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.auditLog.count({ where }),
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

export async function getAuditLogById(id: number) {
  const log = await prisma.auditLog.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, fullName: true } },
    },
  });

  if (!log) throw new NotFoundError("Audit log không tồn tại");
  return log;
}
