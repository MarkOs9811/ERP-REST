// components/admin/AdminHeader.js
import React, { useState } from "react";
import { Search, Bell, User, LogOut } from "lucide-react";
import "../cssAdmin/estilosCuerpoAdmin.css";
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
    <header className="admin-header bg-white d-flex border-bottom align-items-center justify-content-between">
      <div
        className=" border rounded-pill d-flex align-items-center p-2 mx-3 search-bar "
        style={{ width: "350px" }}
      >
        <Search size={18} className="search-icon mx-3" />
        <input
          type="text"
          placeholder="Buscar empresas, usuarios, módulos..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border-0 w-100"
        />
      </div>
      <div className="d-flex ms-auto me-3 gap-2">
        <button title="Notificaciones" className="btn btn-light">
          <Bell size={20} />
        </button>
        {/* Aquí puedes tener un menú desplegable de usuario */}
        <button title="Perfil de usuario" className="btn btn-light">
          <User size={20} />
        </button>
        <button onClick={handleLogout} className="btn btn-danger">
          <LogOut size={18} style={{ marginRight: "8px" }} />{" "}
          {/* Ícono al lado del texto */}
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};
