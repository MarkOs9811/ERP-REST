import React from "react";
import { NavLink } from "react-router-dom";

// ===============================================
// ¡AQUÍ ESTÁ LA CORRECCIÓN!
// Asumiendo que tu archivo está en "src/components/admin/"
// y tu CSS está en "src/cssAdmin/"
// ===============================================


// Importamos los íconos de Lucide
import {
  Home,
  Building,
  Users,
  Settings,
  LayoutGrid,
  HardHat,
} from "lucide-react";
import { useAuth } from "../AuthContextAdmin";

export const AdminSidebar = () => {
  const { user } = useAuth();

  // Esta función es solo para la clase 'active', está correcta.
  const getLinkClass = ({ isActive }) => (isActive ? "active" : "");

  const renderIcon = (IconComponent) => (
    <span className="icon text-auto">
      <IconComponent size={20} strokeWidth={2} />
    </span>
  );

  return (
    <div className="admin-sidebar bg-muted h-full">
      <div className="sidebar-header-admin border-b flex items-center justify-center p-3">
        <div className="flex justify-center items-center w-full gap-2">
          <span className="relative w-full rounded-lg text-sm bg-primary text-white p-2 mb-0 flex items-center">
            <HardHat size={25} />
          </span>
          <span className="admin-sidebar-header-logo">AdminPanel</span>
        </div>
      </div>

      {/* El CSS se encargará de estilizar esto */}
      <nav className="admin-sidebar-nav">
        <ul className="m-0 list-none p-0">
          <li>
            <NavLink to="/masterAdmin/home" end className={getLinkClass}>
              {renderIcon(Home)}
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink to="/masterAdmin/empresas" className={getLinkClass}>
              {renderIcon(Building)}
              Empresas
            </NavLink>
          </li>
          <li>
            <NavLink to="/masterAdmin/modulos" className={getLinkClass}>
              {renderIcon(LayoutGrid)}
              Módulos
            </NavLink>
          </li>
          <li>
            <NavLink to="/masterAdmin/usuarios" className={getLinkClass}>
              {renderIcon(Users)}
              Usuarios Admin
            </NavLink>
          </li>
          <li>
            <NavLink to="/masterAdmin/configuracion" className={getLinkClass}>
              {renderIcon(Settings)}
              Configuración
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 w-full p-3 border-t flex items-center">
        <div
          className="admin-sidebar-user-avatar flex items-center justify-center bg-primary text-white rounded-full shrink-0"
          style={{ width: 44, height: 44, overflow: "hidden" }}
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              className="rounded-full"
            />
          ) : (
            <span className="font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : "JD"}
            </span>
          )}
        </div>

        <div className="admin-sidebar-user-info ms-3 truncate">
          <div
            className="name font-semibold truncate"
            style={{ maxWidth: 150 }}
          >
            {user?.name || "Juan Pérez"}
          </div>
          <div
            className="role text-muted-foreground text-sm truncate"
            style={{ maxWidth: 150 }}
          >
            {user?.role || "Super Admin"}
          </div>
        </div>
      </div>
    </div>
  );
};
