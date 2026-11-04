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

import { AdminSidebar } from "../pageAdmin/AdminSideBar";
import { AdminHeader } from "../pageAdmin/AdminHeader";
import { ConfiguracionGeneral } from "../pageAdmin/ConfiguracionGeneral";

export const LayOutAdmin = () => {
  return (
    <div className="flex h-screen">
      <div className="contenedorSideBar h-full p-0">
        <AdminSidebar />
      </div>
      <div className="w-full h-full flex flex-col p-0 bg-muted">
        <AdminHeader />
        <div className="py-4">
          <ContenedorPrincipal>
            <ToastContainer />
            <Routes>
              {/* Rutas relativas al "/masterAdmin/panel" */}
              <Route index element={<HomeAdmin />} />
              <Route path="home" element={<HomeAdmin />} />
              <Route path="empresas" element={<EmpresasAdmin />} />
              <Route path="configuracion" element={<ConfiguracionGeneral />} />

              <Route path="*" element={<Navigate to="" replace />} />
            </Routes>
          </ContenedorPrincipal>
        </div>
      </div>
    </div>
  );
};
