"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Shield } from "lucide-react";
import type { AuthUser } from "@/types/auth.type";

type UserMenuProps = {
  user: AuthUser | null;
};

export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
          {user.fullName.charAt(0).toUpperCase()}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border bg-white p-2 shadow-lg">
          <div className="border-b px-3 py-2">
            <p className="text-sm font-medium">{user.fullName}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              <Shield className="h-3 w-3" />
              {user.role === "admin" ? "Admin" : "Nhân viên"}
            </span>
          </div>
          <button
            onClick={logout}
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger hover:bg-danger/5"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
