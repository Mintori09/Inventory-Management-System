import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Inventory Management API",
      version: "1.0.0",
      description:
        "API quản lý kho hàng — hỗ trợ nhập/xuất/điều chỉnh kho, phân quyền admin/staff, audit log và dashboard.",
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error message" },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Dữ liệu không hợp lệ" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 10 },
            totalItems: { type: "integer", example: 100 },
            totalPages: { type: "integer", example: 10 },
          },
        },
        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "admin@example.com" },
            password: { type: "string", example: "123456" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Đăng nhập thành công" },
            data: {
              type: "object",
              properties: {
                token: { type: "string" },
                refreshToken: { type: "string" },
                user: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    fullName: { type: "string" },
                    email: { type: "string" },
                    role: { type: "string", enum: ["admin", "staff"] },
                  },
                },
              },
            },
          },
        },
        RefreshTokenInput: {
          type: "object",
          required: ["refreshToken"],
          properties: {
            refreshToken: { type: "string" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            fullName: { type: "string" },
            email: { type: "string" },
            role: { type: "string", enum: ["admin", "staff"] },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        CreateUserInput: {
          type: "object",
          required: ["fullName", "email", "password", "role"],
          properties: {
            fullName: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
            role: { type: "string", enum: ["admin", "staff"] },
            isActive: { type: "boolean", default: true },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            description: { type: "string" },
            isActive: { type: "boolean" },
          },
        },
        CreateCategoryInput: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            isActive: { type: "boolean", default: true },
          },
        },
        Supplier: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            phone: { type: "string" },
            email: { type: "string" },
            address: { type: "string" },
            isActive: { type: "boolean" },
          },
        },
        CreateSupplierInput: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string" },
            phone: { type: "string" },
            email: { type: "string", format: "email" },
            address: { type: "string" },
            isActive: { type: "boolean", default: true },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "integer" },
            sku: { type: "string" },
            name: { type: "string" },
            category: {
              type: "object",
              properties: {
                id: { type: "integer" },
                name: { type: "string" },
              },
            },
            supplier: {
              type: "object",
              properties: {
                id: { type: "integer" },
                name: { type: "string" },
              },
              nullable: true,
            },
            unit: { type: "string" },
            costPrice: { type: "integer" },
            sellingPrice: { type: "integer" },
            currentStock: { type: "integer" },
            minStock: { type: "integer" },
            stockStatus: {
              type: "string",
              enum: ["in_stock", "low_stock", "out_of_stock"],
            },
            isActive: { type: "boolean" },
          },
        },
        CreateProductInput: {
          type: "object",
          required: ["categoryId", "sku", "name", "costPrice", "sellingPrice"],
          properties: {
            categoryId: { type: "integer" },
            supplierId: { type: "integer" },
            sku: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            unit: { type: "string", default: "cái" },
            costPrice: { type: "integer", minimum: 0 },
            sellingPrice: { type: "integer", minimum: 0 },
            currentStock: { type: "integer", minimum: 0, default: 0 },
            minStock: { type: "integer", minimum: 0, default: 0 },
            imageUrl: { type: "string", format: "uri" },
            isActive: { type: "boolean", default: true },
          },
        },
        ImportStockInput: {
          type: "object",
          required: ["productId", "quantity", "importPrice"],
          properties: {
            productId: { type: "integer" },
            supplierId: { type: "integer" },
            quantity: { type: "integer", minimum: 1 },
            importPrice: { type: "integer", minimum: 0 },
            note: { type: "string" },
          },
        },
        ExportStockInput: {
          type: "object",
          required: ["productId", "quantity", "exportPrice"],
          properties: {
            productId: { type: "integer" },
            quantity: { type: "integer", minimum: 1 },
            exportPrice: { type: "integer", minimum: 0 },
            note: { type: "string" },
          },
        },
        AdjustStockInput: {
          type: "object",
          required: ["productId", "adjustmentType", "quantity", "note"],
          properties: {
            productId: { type: "integer" },
            adjustmentType: {
              type: "string",
              enum: ["increase", "decrease"],
            },
            quantity: { type: "integer", minimum: 1 },
            note: { type: "string" },
          },
        },
        ImportResult: {
          type: "object",
          properties: {
            id: { type: "integer" },
            productId: { type: "integer" },
            quantity: { type: "integer" },
            stockBefore: { type: "integer" },
            stockAfter: { type: "integer" },
          },
        },
        ExportResult: {
          type: "object",
          properties: {
            id: { type: "integer" },
            productId: { type: "integer" },
            quantity: { type: "integer" },
            stockBefore: { type: "integer" },
            stockAfter: { type: "integer" },
          },
        },
        AdjustResult: {
          type: "object",
          properties: {
            productId: { type: "integer" },
            stockBefore: { type: "integer" },
            stockAfter: { type: "integer" },
            adjustmentType: { type: "string" },
            quantity: { type: "integer" },
          },
        },
        StockMovement: {
          type: "object",
          properties: {
            id: { type: "integer" },
            type: { type: "string", enum: ["import", "export", "adjustment"] },
            quantityChange: { type: "integer" },
            stockBefore: { type: "integer" },
            stockAfter: { type: "integer" },
            note: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            product: {
              type: "object",
              properties: {
                id: { type: "integer" },
                sku: { type: "string" },
                name: { type: "string" },
              },
            },
            createdBy: {
              type: "object",
              properties: {
                id: { type: "integer" },
                fullName: { type: "string" },
              },
            },
          },
        },
        StockOverview: {
          type: "object",
          properties: {
            productId: { type: "integer" },
            sku: { type: "string" },
            name: { type: "string" },
            categoryName: { type: "string" },
            currentStock: { type: "integer" },
            minStock: { type: "integer" },
            unit: { type: "string" },
            stockStatus: { type: "string", enum: ["in_stock", "low_stock", "out_of_stock"] },
          },
        },
        DashboardSummary: {
          type: "object",
          properties: {
            totalProducts: { type: "integer" },
            lowStockCount: { type: "integer" },
            outOfStockCount: { type: "integer" },
            todayImportCount: { type: "integer" },
            todayExportCount: { type: "integer" },
            inventoryValue: { type: "integer" },
          },
        },
        AuditLog: {
          type: "object",
          properties: {
            id: { type: "integer" },
            action: { type: "string" },
            tableName: { type: "string" },
            recordId: { type: "integer" },
            description: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            user: {
              type: "object",
              properties: {
                id: { type: "integer" },
                fullName: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/modules/**/*.routes.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
