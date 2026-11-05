import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { ContenedorPrincipal } from "../components/componentesReutilizables/ContenedorPrincipal";
import { AdminSidebar } from "../pageAdmin/AdminSideBar";
import { AdminHeader } from "../pageAdmin/AdminHeader";
import { HomeAdmin } from "../pageAdmin/HomeAdmin";
import { EmpresasAdmin } from "../pageAdmin/EmpresasAdmin";
import { ConfiguracionGeneral } from "../pageAdmin/ConfiguracionGeneral";

export const LayOutAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-dvh min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Cerrar menú de navegación"
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl"
        />
        <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="relative min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
          <ContenedorPrincipal>
            <ToastContainer
              position="top-right"
              theme="light"
              toastClassName="rounded-xl border border-slate-200 shadow-lg"
            />
            <Routes>
              <Route index element={<HomeAdmin />} />
              <Route path="home" element={<HomeAdmin />} />
              <Route path="empresas" element={<EmpresasAdmin />} />
              <Route path="configuracion" element={<ConfiguracionGeneral />} />
              <Route path="*" element={<Navigate to="" replace />} />
            </Routes>
          </ContenedorPrincipal>
        </main>
      </div>
    </div>
  );
};
