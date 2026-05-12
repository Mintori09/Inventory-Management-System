"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { ImportExportChartData } from "@/types/dashboard.type";

type Props = {
  data?: ImportExportChartData[];
  isLoading: boolean;
};

export function ImportExportChart({ data, isLoading }: Props) {
  if (isLoading) {
    return <div className="h-72 animate-pulse rounded-xl bg-gray-200" />;
  }

  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Nhập - Xuất kho</h3>
      {!data || data.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-gray-500">
          Chưa có dữ liệu
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="imports" name="Nhập kho" fill="#16a34a" radius={[4, 4, 0, 0]} />
            <Bar dataKey="exports" name="Xuất kho" fill="#0891b2" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
