// components/admin/AdminHeader.js
import React, { useState } from "react";
import { Search, Bell, User, LogOut } from "lucide-react";
import "../cssAdmin/estilosGeneralesAdmin.css";
import { useAuth } from "../AuthContextAdmin";

export const AdminHeader = () => {
  const { logout } = useAuth(); // Asumo que `user` también viene del contexto
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    // Puedes agregar un modal de confirmación aquí
    logout();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Aquí puedes añadir lógica para buscar en tiempo real
    console.log("Buscando:", e.target.value);
  };

  return (
    <header className="w-100 admin-header d-flex p-3 border-bottom align-items-center justify-content-between">
      <div className="admin-header-search">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Buscar empresas, usuarios, módulos..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="admin-header-actions">
        <button title="Notificaciones">
          <Bell size={20} />
        </button>
        {/* Aquí puedes tener un menú desplegable de usuario */}
        <button title="Perfil de usuario">
          <User size={20} />
        </button>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={18} style={{ marginRight: "8px" }} />{" "}
          {/* Ícono al lado del texto */}
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};
