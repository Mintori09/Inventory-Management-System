"use client";

import { FileText } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Button } from "@/components/ui/Button";

type Props = {
  title: string;
  headers: string[];
  data: (string | number)[][];
  filename: string;
  buttonLabel?: string;
};

export function ExportPdfButton({ title, headers, data, filename, buttonLabel = "Xuất PDF" }: Props) {
  const handleExport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(title, 14, 20);
    (doc as any).autoTable({ head: [headers], body: data, startY: 30 });
    doc.save(`${filename}.pdf`);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <FileText className="h-4 w-4" />
      {buttonLabel}
    </Button>
  );
}
