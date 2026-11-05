import React from "react";
import { NavLink } from "react-router-dom";
import {
  Building2,
  Command,
  LayoutGrid,
  Settings2,
  ShieldCheck,
  UsersRound,
  X,
} from "lucide-react";

import { useAuth } from "../AuthContextAdmin";
import { Button } from "../components/ui/button";

const navigation = [
  { label: "Inicio", to: "/masterAdmin/home", icon: LayoutGrid, end: true },
  { label: "Empresas", to: "/masterAdmin/empresas", icon: Building2 },
  { label: "Módulos", to: "/masterAdmin/modulos", icon: Command },
  { label: "Usuarios Admin", to: "/masterAdmin/usuarios", icon: UsersRound },
  {
    label: "Configuración",
    to: "/masterAdmin/configuracion",
    icon: Settings2,
  },
];

export const AdminSidebar = ({ isOpen = false, onClose = () => {} }) => {
  const { user } = useAuth();
  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("")
    : "JD";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] flex-col border-r border-slate-200/80 bg-white/95 shadow-xl shadow-slate-900/5 backdrop-blur-xl transition-transform duration-300 lg:static lg:z-auto lg:w-64 lg:translate-x-0 lg:shadow-none ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      aria-label="Navegación de administración"
    >
      <div className="flex h-[4.5rem] shrink-0 items-center justify-between border-b border-slate-100 px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20">
            <ShieldCheck size={21} strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-slate-900">
              AdminPanel
            </p>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">
              Workspace
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-slate-500 hover:text-slate-900 lg:hidden"
          aria-label="Cerrar menú"
          onClick={onClose}
        >
          <X size={19} strokeWidth={1.8} />
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-6">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Menú principal
        </p>
        <ul className="m-0 list-none space-y-1 p-0">
          {navigation.map(({ label, to, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors ${
                    isActive
                      ? "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-100"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      strokeWidth={1.8}
                      className={
                        isActive
                          ? "text-violet-600"
                          : "text-slate-400 transition-colors group-hover:text-slate-600"
                      }
                    />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-slate-100 p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 text-xs font-semibold text-violet-700 ring-1 ring-inset ring-violet-200/70">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {user?.name || "Juan Pérez"}
            </p>
            <p className="truncate text-xs text-slate-500">
              {user?.role || "Super Admin"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
