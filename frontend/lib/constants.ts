export const PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50];

export const STOCK_STATUS_OPTIONS = [
  { value: "in_stock", label: "Còn hàng" },
  { value: "low_stock", label: "Sắp hết" },
  { value: "out_of_stock", label: "Hết hàng" },
] as const;

export const MOVEMENT_TYPE_OPTIONS = [
  { value: "import", label: "Nhập kho" },
  { value: "export", label: "Xuất kho" },
  { value: "adjustment", label: "Điều chỉnh" },
] as const;

export const USER_ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "staff", label: "Nhân viên" },
] as const;
