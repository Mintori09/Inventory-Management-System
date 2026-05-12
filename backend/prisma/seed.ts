import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

function daysAgo(d: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - d);
  date.setHours(8, 0, 0, 0);
  return date;
}

async function main() {
  const hashedPassword = await bcrypt.hash("123456", 10);

  // Clean data (reverse dependency order)
  await prisma.auditLog.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.stockExport.deleteMany();
  await prisma.stockImport.deleteMany();
  await prisma.product.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // =====================
  // 1. USERS
  // =====================
  const admin = await prisma.user.create({
    data: {
      fullName: "Admin Demo",
      email: "admin@example.com",
      passwordHash: hashedPassword,
      role: Role.admin,
      isActive: true,
    },
  });

  await prisma.user.create({
    data: {
      fullName: "Staff Demo",
      email: "staff@example.com",
      passwordHash: hashedPassword,
      role: Role.staff,
      isActive: true,
    },
  });

  // =====================
  // 2. CATEGORIES
  // =====================
  const C = {
    keyboard: await prisma.category.create({ data: { name: "Bàn phím", description: "Các loại bàn phím máy tính" } }),
    mouse: await prisma.category.create({ data: { name: "Chuột máy tính", description: "Các loại chuột máy tính" } }),
    monitor: await prisma.category.create({ data: { name: "Màn hình", description: "Các loại màn hình máy tính" } }),
    ram: await prisma.category.create({ data: { name: "RAM", description: "RAM máy tính" } }),
    ssd: await prisma.category.create({ data: { name: "Ổ cứng SSD", description: "SSD các loại" } }),
    network: await prisma.category.create({ data: { name: "Thiết bị mạng", description: "Switch, router, thiết bị mạng" } }),
    laptop: await prisma.category.create({ data: { name: "Laptop", description: "Laptop các hãng" } }),
    headphone: await prisma.category.create({ data: { name: "Tai nghe", description: "Tai nghe, micro, loa" } }),
    accessory: await prisma.category.create({ data: { name: "Phụ kiện", description: "Cáp, adapter, linh kiện nhỏ" } }),
  };

  // =====================
  // 3. SUPPLIERS
  // =====================
  const S = {
    techWorld: await prisma.supplier.create({ data: { name: "Công ty TNHH TechWorld", phone: "0901234567", email: "info@techworld.vn", address: "TP. Hồ Chí Minh" } }),
    gearTech: await prisma.supplier.create({ data: { name: "Công ty CP GearTech", phone: "0907654321", email: "contact@geartech.vn", address: "Hà Nội" } }),
    hnComputer: await prisma.supplier.create({ data: { name: "Siêu Thị Máy Tính Hà Nội", phone: "0241234567", email: "info@maytinhhanoi.vn", address: "Hà Nội" } }),
    hoangHa: await prisma.supplier.create({ data: { name: "Công ty CP Hoàng Hà", phone: "0283456789", email: "sales@hoangha.vn", address: "TP. Hồ Chí Minh" } }),
    anPhat: await prisma.supplier.create({ data: { name: "Công ty TNHH An Phát", phone: "0249876543", email: "info@anphat.vn", address: "Hà Nội" } }),
  };

  // =====================
  // 4. PRODUCTS + STOCK MOVEMENTS
  // =====================
  interface ExportDef {
    qty: number;
    daysAgo: number;
  }

  interface ProductSeed {
    sku: string;
    name: string;
    cid: number;
    sid?: number;
    unit: string;
    costPrice: number;
    sellingPrice: number;
    stock: number;
    minStock: number;
    exports?: ExportDef[];
  }

  const products: ProductSeed[] = [
    { sku: "KB-EK87", name: "Bàn phím cơ DareU EK87", cid: C.keyboard.id, sid: S.techWorld.id, unit: "cái", costPrice: 900000, sellingPrice: 1590000, stock: 10, minStock: 5 },
    { sku: "MO-MX3S", name: "Chuột Logitech MX Master 3S", cid: C.mouse.id, sid: S.gearTech.id, unit: "cái", costPrice: 1500000, sellingPrice: 2490000, stock: 8, minStock: 3 },
    { sku: "RAM-K16", name: "RAM Kingston 16GB DDR4", cid: C.ram.id, sid: S.hnComputer.id, unit: "cây", costPrice: 800000, sellingPrice: 1290000, stock: 20, minStock: 5 },
    { sku: "SSD-S1T", name: "Ổ cứng SSD Samsung 1TB", cid: C.ssd.id, sid: S.techWorld.id, unit: "cái", costPrice: 2500000, sellingPrice: 3890000, stock: 0, minStock: 3 },
    { sku: "LG-27", name: "Màn hình LG 27 inch", cid: C.monitor.id, sid: S.gearTech.id, unit: "cái", costPrice: 4000000, sellingPrice: 5990000, stock: 3, minStock: 5 },
    { sku: "LT-DELL15", name: "Laptop Dell Inspiron 15", cid: C.laptop.id, sid: S.hnComputer.id, unit: "cái", costPrice: 12000000, sellingPrice: 15990000, stock: 5, minStock: 2 },
    { sku: "LT-ASUS-TUF", name: "Laptop Asus TUF Gaming", cid: C.laptop.id, sid: S.hoangHa.id, unit: "cái", costPrice: 18000000, sellingPrice: 24990000, stock: 3, minStock: 3 },
    { sku: "MO-EM901", name: "Chuột không dây DareU EM901", cid: C.mouse.id, sid: S.anPhat.id, unit: "cái", costPrice: 250000, sellingPrice: 450000, stock: 15, minStock: 5 },
    { sku: "MO-G102", name: "Chuột Logitech G102", cid: C.mouse.id, sid: S.techWorld.id, unit: "cái", costPrice: 180000, sellingPrice: 350000, stock: 30, minStock: 10, exports: [{ qty: 3, daysAgo: 3 }, { qty: 2, daysAgo: 1 }] },
    { sku: "KB-AKKO", name: "Bàn phím cơ Akko 3087", cid: C.keyboard.id, sid: S.gearTech.id, unit: "cái", costPrice: 800000, sellingPrice: 1390000, stock: 7, minStock: 5 },
    { sku: "KB-LOGI", name: "Bàn phím văn phòng Logitech K380", cid: C.keyboard.id, sid: S.anPhat.id, unit: "cái", costPrice: 400000, sellingPrice: 690000, stock: 0, minStock: 5 },
    { sku: "DELL-24", name: "Màn hình Dell 24 inch", cid: C.monitor.id, sid: S.hnComputer.id, unit: "cái", costPrice: 3500000, sellingPrice: 4990000, stock: 2, minStock: 5 },
    { sku: "SS-32", name: "Màn hình Samsung 32 inch 4K", cid: C.monitor.id, sid: S.techWorld.id, unit: "cái", costPrice: 7000000, sellingPrice: 10990000, stock: 10, minStock: 3 },
    { sku: "RAM-K32", name: "RAM Kingston 32GB DDR5", cid: C.ram.id, sid: S.hoangHa.id, unit: "cây", costPrice: 1800000, sellingPrice: 2890000, stock: 12, minStock: 5 },
    { sku: "SSD-WD240", name: "SSD WD Green 240GB", cid: C.ssd.id, sid: S.anPhat.id, unit: "cái", costPrice: 600000, sellingPrice: 990000, stock: 25, minStock: 10, exports: [{ qty: 5, daysAgo: 5 }] },
    { sku: "SW-TL8", name: "Switch TP-Link 8-port", cid: C.network.id, sid: S.techWorld.id, unit: "cái", costPrice: 350000, sellingPrice: 590000, stock: 6, minStock: 2 },
    { sku: "RT-TL6", name: "Router WiFi 6 TP-Link", cid: C.network.id, sid: S.hoangHa.id, unit: "cái", costPrice: 800000, sellingPrice: 1390000, stock: 4, minStock: 3 },
    { sku: "HS-G733", name: "Tai nghe Logitech G733", cid: C.headphone.id, sid: S.gearTech.id, unit: "cái", costPrice: 1800000, sellingPrice: 2990000, stock: 9, minStock: 3 },
    { sku: "WC-C920", name: "Webcam Logitech C920", cid: C.accessory.id, sid: S.anPhat.id, unit: "cái", costPrice: 800000, sellingPrice: 1390000, stock: 0, minStock: 5 },
    { sku: "CB-HDMI2", name: "Cáp HDMI 2.0 2m", cid: C.accessory.id, sid: S.hnComputer.id, unit: "cái", costPrice: 50000, sellingPrice: 120000, stock: 50, minStock: 20, exports: [{ qty: 5, daysAgo: 4 }, { qty: 3, daysAgo: 1 }] },
  ];

  const importDaysAgo = 14;

  for (const p of products) {
    const totalExports = (p.exports ?? []).reduce((s, e) => s + e.qty, 0);
    const importQty = p.stock + totalExports;

    const product = await prisma.product.create({
      data: {
        sku: p.sku,
        name: p.name,
        categoryId: p.cid,
        supplierId: p.sid ?? null,
        unit: p.unit,
        costPrice: p.costPrice,
        sellingPrice: p.sellingPrice,
        currentStock: p.stock,
        minStock: p.minStock,
        createdById: admin.id,
        createdAt: daysAgo(importDaysAgo),
      },
    });

    if (importQty === 0) continue;

    const importRecord = await prisma.stockImport.create({
      data: {
        productId: product.id,
        supplierId: p.sid ?? null,
        quantity: importQty,
        importPrice: p.costPrice,
        totalAmount: p.costPrice * importQty,
        note: "Nhập kho ban đầu",
        createdById: admin.id,
        createdAt: daysAgo(importDaysAgo),
      },
    });

    await prisma.stockMovement.create({
      data: {
        productId: product.id,
        type: "import",
        quantityChange: importQty,
        stockBefore: 0,
        stockAfter: importQty,
        referenceType: "stock_import",
        referenceId: importRecord.id,
        note: "Nhập kho ban đầu",
        createdById: admin.id,
        createdAt: daysAgo(importDaysAgo),
      },
    });

    if (p.exports) {
      let runningStock = importQty;
      for (const exp of p.exports) {
        runningStock -= exp.qty;
        const exportRecord = await prisma.stockExport.create({
          data: {
            productId: product.id,
            quantity: exp.qty,
            exportPrice: p.sellingPrice,
            totalAmount: p.sellingPrice * exp.qty,
            note: "Xuất bán cho khách hàng",
            createdById: admin.id,
            createdAt: daysAgo(exp.daysAgo),
          },
        });

        await prisma.stockMovement.create({
          data: {
            productId: product.id,
            type: "export",
            quantityChange: -exp.qty,
            stockBefore: runningStock + exp.qty,
            stockAfter: runningStock,
            referenceType: "stock_export",
            referenceId: exportRecord.id,
            note: "Xuất bán cho khách hàng",
            createdById: admin.id,
            createdAt: daysAgo(exp.daysAgo),
          },
        });
      }
    }
  }

  console.log("Seed completed successfully");
  console.log(`  Users: 2`);
  console.log(`  Categories: ${Object.keys(C).length}`);
  console.log(`  Suppliers: ${Object.keys(S).length}`);
  console.log(`  Products: ${products.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
