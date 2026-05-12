import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("123456", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      fullName: "Admin Demo",
      email: "admin@example.com",
      passwordHash: hashedPassword,
      role: Role.admin,
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { email: "staff@example.com" },
    update: {},
    create: {
      fullName: "Staff Demo",
      email: "staff@example.com",
      passwordHash: hashedPassword,
      role: Role.staff,
      isActive: true,
    },
  });

  const keyboard = await prisma.category.upsert({
    where: { name: "Bàn phím" },
    update: {},
    create: { name: "Bàn phím", description: "Các loại bàn phím máy tính" },
  });
  const mouseCategory = await prisma.category.upsert({
    where: { name: "Chuột máy tính" },
    update: {},
    create: { name: "Chuột máy tính", description: "Các loại chuột máy tính" },
  });
  const monitor = await prisma.category.upsert({
    where: { name: "Màn hình" },
    update: {},
    create: { name: "Màn hình", description: "Các loại màn hình máy tính" },
  });
  const ram = await prisma.category.upsert({
    where: { name: "RAM" },
    update: {},
    create: { name: "RAM", description: "RAM máy tính" },
  });
  const ssd = await prisma.category.upsert({
    where: { name: "Ổ cứng SSD" },
    update: {},
    create: { name: "Ổ cứng SSD", description: "SSD các loại" },
  });
  await prisma.category.upsert({
    where: { name: "Thiết bị mạng" },
    update: {},
    create: { name: "Thiết bị mạng", description: "Switch, router, etc." },
  });

  const techWorld = await prisma.supplier.create({
    data: {
      name: "Công ty TNHH TechWorld",
      phone: "0901234567",
      email: "info@techworld.vn",
      address: "TP. Hồ Chí Minh",
    },
  });
  const gearTech = await prisma.supplier.create({
    data: {
      name: "Công ty CP GearTech",
      phone: "0907654321",
      email: "contact@geartech.vn",
      address: "Hà Nội",
    },
  });
  const hnComputer = await prisma.supplier.create({
    data: {
      name: "Siêu Thị Máy Tính Hà Nội",
      phone: "0241234567",
      email: "info@maytinhhanoi.vn",
      address: "Hà Nội",
    },
  });

  await prisma.product.upsert({
    where: { sku: "KB-EK87" },
    update: {},
    create: {
      categoryId: keyboard.id,
      supplierId: techWorld.id,
      sku: "KB-EK87",
      name: "Bàn phím cơ DareU EK87",
      unit: "cái",
      costPrice: 900000,
      sellingPrice: 1590000,
      currentStock: 10,
      minStock: 5,
      createdById: admin.id,
    },
  });
  await prisma.product.upsert({
    where: { sku: "MO-MX3S" },
    update: {},
    create: {
      categoryId: mouseCategory.id,
      supplierId: gearTech.id,
      sku: "MO-MX3S",
      name: "Chuột Logitech MX Master 3S",
      unit: "cái",
      costPrice: 1500000,
      sellingPrice: 2490000,
      currentStock: 8,
      minStock: 3,
      createdById: admin.id,
    },
  });
  await prisma.product.upsert({
    where: { sku: "RAM-K16" },
    update: {},
    create: {
      categoryId: ram.id,
      supplierId: hnComputer.id,
      sku: "RAM-K16",
      name: "RAM Kingston 16GB DDR4",
      unit: "cây",
      costPrice: 800000,
      sellingPrice: 1290000,
      currentStock: 20,
      minStock: 5,
      createdById: admin.id,
    },
  });
  await prisma.product.upsert({
    where: { sku: "SSD-S1T" },
    update: {},
    create: {
      categoryId: ssd.id,
      supplierId: techWorld.id,
      sku: "SSD-S1T",
      name: "Ổ cứng SSD Samsung 1TB",
      unit: "cái",
      costPrice: 2500000,
      sellingPrice: 3890000,
      currentStock: 0,
      minStock: 3,
      createdById: admin.id,
    },
  });
  await prisma.product.upsert({
    where: { sku: "LG-27" },
    update: {},
    create: {
      categoryId: monitor.id,
      supplierId: gearTech.id,
      sku: "LG-27",
      name: "Màn hình LG 27 inch",
      unit: "cái",
      costPrice: 4000000,
      sellingPrice: 5990000,
      currentStock: 3,
      minStock: 5,
      createdById: admin.id,
    },
  });

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
