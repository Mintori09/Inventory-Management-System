import { create } from "zustand";

export type ToastType = "success" | "error" | "info" | "warning";

type ToastItem = {
  id: string;
  type: ToastType;
  message: string;
};

type ToastStore = {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType) => void;
};

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  showToast: (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2);
    set((state) => ({ toasts: [...state.toasts, { id, type, message }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
}));

export function showToast(message: string, type: ToastType = "info") {
  useToastStore.getState().showToast(message, type);
}

export function useToast() {
  return { toasts: useToastStore((s) => s.toasts) };
}
