"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap = {
  success: "border-success/20 bg-success/5 text-success",
  error: "border-danger/20 bg-danger/5 text-danger",
  info: "border-info/20 bg-info/5 text-info",
  warning: "border-warning/20 bg-warning/5 text-warning",
};

export function ToastContainer() {
  const { toasts, subscribe } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsub = subscribe();
    return unsub;
  }, [subscribe]);

  if (!mounted) return null;

  return (
    <div className="fixed right-4 top-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type];
        return (
          <div
            key={toast.id}
            className={cn(
              "flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg",
              colorMap[toast.type]
            )}
          >
            {Icon && <Icon className="h-5 w-5" />}
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        );
      })}
    </div>
  );
}
