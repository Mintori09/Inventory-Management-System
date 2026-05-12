"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { CategoryStockData } from "@/types/dashboard.type";

const COLORS = ["#2563eb", "#16a34a", "#d97706", "#dc2626", "#0891b2", "#8b5cf6", "#ec4899"];

type Props = {
  data?: CategoryStockData[];
  isLoading: boolean;
};

export function CategoryStockChart({ data, isLoading }: Props) {
  if (isLoading) {
    return <div className="h-72 animate-pulse rounded-xl bg-gray-200" />;
  }

  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Tồn kho theo danh mục</h3>
      {!data || data.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-gray-500">
          Chưa có dữ liệu
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey="totalStock"
              nameKey="categoryName"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
