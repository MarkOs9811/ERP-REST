// pageAdmin/LayOutAdmin.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Importa tu ContenedorPrincipal (que sigue siendo el mismo)
import { ContenedorPrincipal } from "../components/componentesReutilizables/ContenedorPrincipal";

// Importa tus páginas
import { HomeAdmin } from "../pageAdmin/HomeAdmin";
import { EmpresasAdmin } from "../pageAdmin/EmpresasAdmin";
// === IMPORTAMOS EL CSS PRINCIPAL ===
import "../cssAdmin/estilosGeneralesAdmin.css"; // Ruta ajustada si es necesario
import { AdminSidebar } from "../pageAdmin/AdminSideBar";
import { AdminHeader } from "../pageAdmin/AdminHeader";

export const LayOutAdmin = () => {
  return (
    <div className="d-flex vh-100">
      <div className="contenedorSideBar h-100 p-0">
        <AdminSidebar />
      </div>
      <div className=" w-100 h-100 d-flex flex-column p-0">
        <AdminHeader />
        <ContenedorPrincipal>
          <ToastContainer />
          <Routes>
            {/* Rutas relativas al "/masterAdmin/panel" */}
            <Route index element={<HomeAdmin />} />
            <Route path="home" element={<HomeAdmin />} />
            <Route path="empresas" element={<EmpresasAdmin />} />

            <Route path="*" element={<Navigate to="" replace />} />
          </Routes>
        </ContenedorPrincipal>
      </div>
    </div>
  );
};
