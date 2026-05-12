import { prisma } from "../../config/prisma";

export async function createAuditLog(
  userId: number,
  action: string,
  tableName: string,
  recordId: number,
  description?: string
) {
  return prisma.auditLog.create({
    data: {
      userId,
      action,
      tableName,
      recordId,
      description,
    },
  });
}
