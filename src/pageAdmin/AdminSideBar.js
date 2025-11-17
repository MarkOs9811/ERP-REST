import React from "react";
import { NavLink } from "react-router-dom";

// ===============================================
// ¡AQUÍ ESTÁ LA CORRECCIÓN!
// Asumiendo que tu archivo está en "src/components/admin/"
// y tu CSS está en "src/cssAdmin/"
// ===============================================
import "../cssAdmin/estilosGeneralesAdmin.css";

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
    <aside className="admin-sidebar bg-light h-100">
      <div className="p-3 border-bottom">
        <div className="d-flex justify-content-center align-items-center w-100 gap-2">
          <span className="alert bg-primary text-white p-2 mb-0 d-flex align-items-center">
            <HardHat size={25} />
          </span>
          <span className="admin-sidebar-header-logo">AdminPanel</span>
        </div>
      </div>

      {/* El CSS se encargará de estilizar esto */}
      <nav className="admin-sidebar-nav">
        <ul>
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

      {/* Sección de usuario (sin cambios) */}
      <div className="admin-sidebar-user-section">
        <div className="admin-sidebar-user-avatar">
          {user?.avatar ? (
            <img src={user.avatar} alt="Avatar" />
          ) : (
            <span>{user?.name ? user.name.charAt(0).toUpperCase() : "JD"}</span>
          )}
        </div>
        <div className="admin-sidebar-user-info">
          <div className="name">{user?.name || "Juan Pérez"}</div>
          <div className="role">{user?.role || "Super Admin"}</div>
        </div>
      </div>
    </aside>
  );
};
