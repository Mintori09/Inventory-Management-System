"use client";

import { FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/Button";

export type ExcelColumn = {
  key: string;
  header: string;
};

type Props = {
  columns: ExcelColumn[];
  data: Record<string, unknown>[];
  filename: string;
  buttonLabel?: string;
};

export function ExportExcelButton({ columns, data, filename, buttonLabel = "Xuất Excel" }: Props) {
  const handleExport = () => {
    const rows = data.map((row) => {
      const obj: Record<string, unknown> = {};
      for (const col of columns) {
        obj[col.header] = row[col.key];
      }
      return obj;
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <FileDown className="h-4 w-4" />
      {buttonLabel}
    </Button>
  );
}
