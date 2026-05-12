import { prisma } from "../../config/prisma";

export async function findAll(options?: { isActive?: boolean }) {
  return prisma.category.findMany({
    where: { isActive: options?.isActive ?? true },
    orderBy: { name: "asc" },
  });
}

export async function findById(id: number) {
  return prisma.category.findUnique({ where: { id } });
}

export async function findByName(name: string) {
  return prisma.category.findUnique({ where: { name } });
}

export async function create(data: {
  name: string;
  description?: string;
  isActive?: boolean;
}) {
  return prisma.category.create({ data });
}

export async function update(
  id: number,
  data: { name?: string; description?: string; isActive?: boolean }
) {
  return prisma.category.update({ where: { id }, data });
}

export async function deactivate(id: number) {
  return prisma.category.update({
    where: { id },
    data: { isActive: false },
  });
}
