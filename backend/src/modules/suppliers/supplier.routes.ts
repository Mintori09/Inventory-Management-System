import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { requireRole } from "../../common/middlewares/role.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import {
  createSupplierSchema,
  updateSupplierSchema,
} from "./supplier.schema";
import * as supplierController from "./supplier.controller";

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/suppliers:
 *   get:
 *     tags:
 *       - Suppliers
 *     summary: Danh sách nhà cung cấp
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách nhà cung cấp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Supplier'
 */
router.get("/", supplierController.getSuppliers);
router.get("/:id", supplierController.getSupplierById);

/**
 * @openapi
 * /api/suppliers:
 *   post:
 *     tags:
 *       - Suppliers
 *     summary: Tạo nhà cung cấp (admin-only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSupplierInput'
 *     responses:
 *       201:
 *         description: Tạo nhà cung cấp thành công
 *       422:
 *         description: Dữ liệu không hợp lệ
 */
router.post(
  "/",
  requireRole("admin"),
  validate(createSupplierSchema),
  supplierController.createSupplier
);

/**
 * @openapi
 * /api/suppliers/{id}:
 *   put:
 *     tags:
 *       - Suppliers
 *     summary: Cập nhật nhà cung cấp (admin-only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSupplierInput'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put(
  "/:id",
  requireRole("admin"),
  validate(updateSupplierSchema),
  supplierController.updateSupplier
);
router.delete("/:id", requireRole("admin"), supplierController.deactivateSupplier);

export default router;
