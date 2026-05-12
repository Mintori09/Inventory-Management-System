export interface ImportResult {
  id: number;
  productId: number;
  quantity: number;
  stockBefore: number;
  stockAfter: number;
}

export interface ExportResult {
  id: number;
  productId: number;
  quantity: number;
  stockBefore: number;
  stockAfter: number;
}

export interface AdjustResult {
  productId: number;
  stockBefore: number;
  stockAfter: number;
  adjustmentType: string;
  quantity: number;
}

export interface StockStats {
  totalImportQuantity: number;
  totalImportValue: number;
  totalExportQuantity: number;
  totalExportValue: number;
  netStockChange: number;
  breakdown?: Array<{
    period: string;
    importQuantity: number;
    importValue: number;
    exportQuantity: number;
    exportValue: number;
  }>;
}
