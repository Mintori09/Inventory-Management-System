"use client";

import { Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { UserMenu } from "./UserMenu";

type AppTopbarProps = {
  onMenuToggle: () => void;
};

export function AppTopbar({ onMenuToggle }: AppTopbarProps) {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-white px-4 lg:px-6">
      <button onClick={onMenuToggle} className="lg:hidden" aria-label="Mở menu">
        <Menu className="h-6 w-6" />
      </button>
      <div className="flex-1" />
      <UserMenu user={user} />
    </header>
  );
}
