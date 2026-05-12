"use client";

import { useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

type Toast = {
  id: string;
  type: ToastType;
  message: string;
};

let toastListeners: Array<(toasts: Toast[]) => void> = [];
let toasts: Toast[] = [];

export function showToast(message: string, type: ToastType = "info") {
  const id = Math.random().toString(36).slice(2);
  const toast: Toast = { id, type, message };
  toasts = [...toasts, toast];
  toastListeners.forEach((fn) => fn(toasts));
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    toastListeners.forEach((fn) => fn(toasts));
  }, 4000);
}

export function useToast() {
  const [state, setState] = useState<Toast[]>([]);

  const subscribe = useCallback(() => {
    toastListeners.push(setState);
    return () => {
      toastListeners = toastListeners.filter((fn) => fn !== setState);
    };
  }, []);

  return { toasts: state, subscribe };
}
