import React, { useState } from "react";
import { Bell, LogOut, Menu, Search, UserRound } from "lucide-react";

import { useAuth } from "../AuthContextAdmin";
import { Button } from "../components/ui/button";

export const AdminHeader = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <header className="relative z-10 flex min-h-[4.5rem] shrink-0 items-center gap-3 border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0 text-slate-600 lg:hidden"
        aria-label="Abrir menú de navegación"
        onClick={onMenuClick}
      >
        <Menu size={20} strokeWidth={1.8} />
      </Button>

      <div className="relative hidden w-full max-w-md sm:block">
        <Search
          size={17}
          strokeWidth={1.8}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          aria-label="Buscar en el panel"
          placeholder="Buscar empresas, usuarios, módulos..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100/70"
        />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative text-slate-500 hover:bg-violet-50 hover:text-violet-700"
          title="Notificaciones"
          aria-label="Notificaciones"
        >
          <Bell size={19} strokeWidth={1.8} />
        </Button>

        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        <div className="hidden items-center gap-2.5 px-1 sm:flex">
          <span className="flex size-8 items-center justify-center rounded-full bg-violet-50 text-violet-700">
            <UserRound size={16} strokeWidth={1.8} />
          </span>
          <span className="max-w-32 truncate text-sm font-medium text-slate-700">
            {user?.name || "Administrador"}
          </span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={logout}
          className="ml-1 gap-2 rounded-xl px-2.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 sm:px-3"
          aria-label="Cerrar sesión"
        >
          <LogOut size={17} strokeWidth={1.8} />
          <span className="hidden sm:inline">Cerrar sesión</span>
        </Button>
      </div>
    </header>
  );
};
