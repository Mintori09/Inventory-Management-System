import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import userRoutes from "../modules/users/user.routes";
import categoryRoutes from "../modules/categories/category.routes";
import supplierRoutes from "../modules/suppliers/supplier.routes";
import productRoutes from "../modules/products/product.routes";
import inventoryRoutes from "../modules/inventory/inventory.routes";
import dashboardRoutes from "../modules/dashboard/dashboard.routes";
import auditLogRoutes from "../modules/audit-logs/audit-log.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/suppliers", supplierRoutes);
router.use("/products", productRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/audit-logs", auditLogRoutes);

export default router;
