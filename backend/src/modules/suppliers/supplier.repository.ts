import { prisma } from "../../config/prisma";

export async function findAll(options?: { isActive?: boolean }) {
  return prisma.supplier.findMany({
    where: { isActive: options?.isActive ?? true },
    orderBy: { name: "asc" },
  });
}

export async function findById(id: number) {
  return prisma.supplier.findUnique({ where: { id } });
}

export async function create(data: {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive?: boolean;
}) {
  return prisma.supplier.create({ data });
}

export async function update(
  id: number,
  data: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    isActive?: boolean;
  }
) {
  return prisma.supplier.update({ where: { id }, data });
}

export async function deactivate(id: number) {
  return prisma.supplier.update({
    where: { id },
    data: { isActive: false },
  });
}
