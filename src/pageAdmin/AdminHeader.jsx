// components/admin/AdminHeader.js
import React, { useState } from "react";
import { Search, Bell, User, LogOut } from "lucide-react";

import { useAuth } from "../AuthContextAdmin";
import { Button } from "../components/ui/button";

export const AdminHeader = () => {
  const { logout } = useAuth(); // Asumo que `user` también viene del contexto
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    // Puedes agregar un modal de confirmación aquí
    logout();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <header className="admin-header bg-background flex border-b items-center justify-between">
      <div
        className="border rounded-full flex items-center p-2 mx-3 search-bar"
        style={{ width: "350px" }}
      >
        <Search size={18} className="search-icon mx-3" />
        <input
          type="text"
          placeholder="Buscar empresas, usuarios, módulos..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border-0 w-full"
        />
      </div>
      <div className="flex ms-auto me-3 gap-2">
        <Button title="Notificaciones" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-muted text-foreground shadow-sm hover:bg-muted/80" variant="default">
          <Bell size={20} />
        </Button>
        {/* Aquí puedes tener un menú desplegable de usuario */}
        <Button title="Perfil de usuario" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-muted text-foreground shadow-sm hover:bg-muted/80" variant="default">
          <User size={20} />
        </Button>
        <Button onClick={handleLogout} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90" variant="destructive">
          <LogOut size={18} style={{ marginRight: "8px" }} />{" "}
          {/* Ícono al lado del texto */}
          Cerrar Sesión
        </Button>
      </div>
    </header>
  );
};
