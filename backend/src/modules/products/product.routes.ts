import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { requireRole } from "../../common/middlewares/role.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import { createProductSchema, updateProductSchema } from "./product.schema";
import * as productController from "./product.controller";

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Danh sách sản phẩm
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm theo tên hoặc SKU
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Lọc theo danh mục
 *       - in: query
 *         name: supplierId
 *         schema:
 *           type: integer
 *         description: Lọc theo nhà cung cấp
 *       - in: query
 *         name: stockStatus
 *         schema:
 *           type: string
 *           enum: [in_stock, low_stock, out_of_stock]
 *         description: Lọc theo trạng thái tồn kho
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: string
 *           enum: [true, false]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm có phân trang
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

/**
 * @openapi
 * /api/products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Tạo sản phẩm (admin-only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductInput'
 *     responses:
 *       201:
 *         description: Tạo sản phẩm thành công
 *       400:
 *         description: SKU đã tồn tại hoặc dữ liệu không hợp lệ
 *       403:
 *         description: Không có quyền
 */
router.post(
  "/",
  requireRole("admin"),
  validate(createProductSchema),
  productController.createProduct
);

/**
 * @openapi
 * /api/products/{id}:
 *   put:
 *     tags:
 *       - Products
 *     summary: Cập nhật sản phẩm (admin-only, không sửa tồn kho)
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
 *             $ref: '#/components/schemas/CreateProductInput'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: SKU đã tồn tại
 */
router.put(
  "/:id",
  requireRole("admin"),
  validate(updateProductSchema),
  productController.updateProduct
);

/**
 * @openapi
 * /api/products/{id}:
 *   delete:
 *     tags:
 *       - Products
 *     summary: Ẩn sản phẩm (soft-delete, admin-only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ẩn sản phẩm thành công
 */
router.delete("/:id", requireRole("admin"), productController.deactivateProduct);

export default router;
