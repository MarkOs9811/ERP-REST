import React, { useEffect, useRef, useState } from "react";
import {
  //HashRouter as Router, // PARA produccion
  BrowserRouter as Router, // para desarrollo
  Routes,
  Route,
} from "react-router-dom";

import "./App.css";

// IMPORTACION DE CONTEXTOS
import { CajaProtectedRoute } from "../src/components/CajaProtectedRoute";
import { CajaProvider } from "../src/CajaContext";

import { PrivateRoute } from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Header } from "./components/Header";
import { SideBar } from "./components/SideBar";
import { Navegacion } from "./components/Navegacion";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { MenuPlato } from "./pages/MenuPlato";
import { Usuarios } from "./pages/Usuarios";
import { Almacen } from "./pages/moduloAlmacen/Almacen";
import { Configuracion } from "./pages/moduloConfiguracion/Configuracion";
import { AuthProvider } from "./AuthContext";
import { Vender } from "./pages/Vender";
import { ToLlevar } from "./components/componenteVender/ToLlevar";
import { ToMesa } from "./components/componenteVender/ToMesa";
import { Proveedores } from "./pages/Proveedores";
import { AbrirCaja } from "./pages/AbrirCaja";
import { CerrarCaja } from "./pages/CerrarCaja";
import { PreventaMesa } from "./components/componenteVender/PreventaMesa";
import { DetallesPago } from "./components/componenteVender/DetallesPago";
import { Ventas } from "./pages/moduloVentas/Ventas";
import { Inventario } from "./pages/moduloVentas/Inventario";
import { Cajas } from "./pages/moduloVentas/Cajas";
import { Solicitud } from "./pages/moduloVentas/Solicitud";
import { RealizarSolicitud } from "./pages/moduloVentas/RealizarSolicitud";
import { Reportes } from "./pages/moduloVentas/Reportes";
import AjustesVentas from "./pages/moduloVentas/AjustesVentas";
import { Registro } from "./pages/moduloAlmacen/Registro";
import { useDispatch, useSelector } from "react-redux";
import { Transferencias } from "./pages/moduloAlmacen/Transferencias";
import { Solicitudes } from "./pages/moduloAlmacen/Solicitudes";
import { Kardex } from "./pages/moduloAlmacen/Kardex";
import { ReportesAlmacen } from "./pages/moduloAlmacen/ReportesAlmacen";
import { AjustesAlmacen } from "./pages/moduloAlmacen/AjustesAlmancen";
import { Compras } from "./pages/Compras";
import { SubMenu } from "./components/SubMenu";

import { PedidosWeb } from "./pages/PedidosWeb";
import { AreasCargo } from "./pages/moduloAreasCargos/AreasCargos";
import { ListaTrabajadorCargo } from "./pages/moduloPlanilla/ListaTrabajadorCargo";
import { ListaTrabajador } from "./pages/moduloPlanilla/ListaTrabajador";
import { IngresoPlanilla } from "./pages/moduloPlanilla/IngresoPlanilla";
import { TakeAsistencia } from "./pages/TakeAsistencia";
import { Asistencia } from "./pages/moduloPlanilla/Asistencia";
import { HorasExtras } from "./pages/moduloPlanilla/HorasExtras";
import { AdelantoSueldo } from "./pages/moduloPlanilla/AdelantoSueldo";
import { Vacaciones } from "./pages/moduloPlanilla/Vacaciones";
import { AjustesPlanilla } from "./pages/moduloPlanilla/AjustesPlanilla";
import { GoogleRedirectHandler } from "./pages/GoogleRedirectHandler";
import { Eventos } from "./pages/moduloIncidencias/Eventos";
import { ReportePlanilla } from "./pages/moduloPlanilla/ReportePlanilla";
import { InformesFinancieros } from "./pages/moduloFinanzas/InformesFinancieros";
import { Presupuestos } from "./pages/moduloFinanzas/Presupuestos";
import { AjustesFinanzas } from "./pages/moduloFinanzas/AjustesFinanzas";
import { ReportesFinanzas } from "./pages/moduloFinanzas/ReportesFinanzas";
import { LibroMayor } from "./pages/moduloFinanzas/LibroMayor";
import { LibroDiario } from "./pages/moduloFinanzas/LibroDiario";
import { CuentasPorCobrar } from "./pages/moduloFinanzas/CuentasPorCobrar";
import { CuentasPorPagar } from "./pages/moduloFinanzas/CuentasPorPagar";
import { FirmasSolicitud } from "./pages/moduloFinanzas/FirmasSolicitud";
import { Generales } from "./components/componenteConfiguracion/Generales";
import { MiPerfil } from "./components/componenteConfiguracion/MiPerfil";
import { MiEmpresa } from "./components/componenteConfiguracion/MiEmpresa";
import { Integraciones } from "./components/componenteConfiguracion/Integraciones";
import { ServicioSunat } from "./components/componenteConfiguracion/ServicioSunat";
import { Mantenimiento } from "./components/componenteConfiguracion/Mantenimiento";
import { SoporteContacto } from "./components/componenteConfiguracion/SoporteContacto";
import { CocinaDespacho } from "./pages/modulosVender/CocinaDespacho";
import { setSidebarCompressed } from "./redux/sideBarSlice";
import LayoutPOS from "./LayoutPOS";

const BASE_URL = process.env.REACT_APP_BASE_URL;
function App() {
  const isCompressed = useSelector((state) => state.sidebar.isCompressed);
  const dispatch = useDispatch();
  // useEffect para poder actualizar el logo icono y el nombre en el proyecto - pestaña
  useEffect(() => {
    // Obtener datos de la empresa desde localStorage
    const miEmpresa = JSON.parse(localStorage.getItem("miEmpresa"));

    if (miEmpresa) {
      // Actualizar el título de la página
      document.title = miEmpresa.nombre;

      // Actualizar el favicon
      const favicon = document.getElementById("favicon");
      const logoUrl = `${BASE_URL}/storage/${miEmpresa.logo}`; // URL del logo dinámico
      favicon.href = logoUrl;
    }
  }, []);

  return (
    <AuthProvider>
      <CajaProvider>
        <Router>
          <Routes>
            <Route path="/google" element={<GoogleRedirectHandler />} />
            <Route path="/login" element={<Login />} />
            <Route path="/tomarAsistencia" element={<TakeAsistencia />} />

            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <div className="main-container p-0 m-0 h-screen flex">
                    <SideBar />
                    <div className={`content  w-100  p-0`}>
                      <div className="card p-0 m-0 rounded-0 vh-100">
                        {/* Header fijo */}
                        <div className="card-header p-0 rounded-0 m-0 shrink-0 ">
                          <Header />
                          <Navegacion />
                          <SubMenu />
                        </div>

                        {/* Cuerpo flexible con scroll interno si es necesario */}
                        <div className="card-body  shadow-none p-0 h-100 contenido">
                          <div className="row h-100 g-0 d-flex ">
                            {/* Contenido principal (también animado) */}
                            <div
                              className={`h-100  flex-column align-items-center justify-content-center overflow-auto p-0
                              transition-all`}
                              style={{
                                transition: "width 0.3s ease, margin 0.3s ease", // Animación para width/margin
                              }}
                            >
                              <ToastContainer />
                              <Routes>
                                <Route path="/" element={<Home />} />
                                <Route
                                  path="/usuarios"
                                  element={<Usuarios />}
                                />
                                {/* RUTAS PARA MODULO ALMACEN */}
                                <Route path="/almacen">
                                  <Route index element={<Almacen />} />
                                  <Route
                                    path="/almacen/registro"
                                    element={<Registro />}
                                  />
                                  <Route
                                    path="/almacen/transferencia"
                                    element={<Transferencias />}
                                  />
                                  <Route
                                    path="/almacen/solicitud"
                                    element={<Solicitudes />}
                                  />
                                  <Route
                                    path="/almacen/kardex"
                                    element={<Kardex />}
                                  />
                                  <Route
                                    path="/almacen/reportes"
                                    element={<ReportesAlmacen />}
                                  />
                                  <Route
                                    path="/almacen/ajustes"
                                    element={<AjustesAlmacen />}
                                  />
                                </Route>

                                {/* RUTAS PARA MODULO RECURSOS HUMANOS PLANILLAS */}
                                <Route path="/rr-hh">
                                  <Route
                                    index
                                    element={<ListaTrabajadorCargo />}
                                  />
                                  <Route
                                    path="planilla"
                                    element={<ListaTrabajadorCargo />}
                                  />
                                </Route>
                                <Route path="/rr-hh">
                                  <Route
                                    index
                                    element={<ListaTrabajadorCargo />}
                                  />
                                  <Route
                                    index
                                    element={<ListaTrabajadorCargo />}
                                  />
                                  <Route
                                    path="planilla/ListaTrabajador/:idCargo?"
                                    element={<ListaTrabajador />}
                                  />
                                  <Route
                                    path="ingreso-a-planilla"
                                    element={<IngresoPlanilla />}
                                  />
                                  <Route
                                    path="asistencia"
                                    element={<Asistencia />}
                                  />
                                  <Route
                                    path="horas-extras"
                                    element={<HorasExtras />}
                                  />
                                  <Route
                                    path="adelanto-sueldo"
                                    element={<AdelantoSueldo />}
                                  />
                                  <Route
                                    path="vacaciones"
                                    element={<Vacaciones />}
                                  />
                                  <Route
                                    path="reportes"
                                    element={<ReportePlanilla />}
                                  />
                                  <Route
                                    path="ajustes"
                                    element={<AjustesPlanilla />}
                                  />
                                </Route>
                                {/* RUTAS PARA MODULO COMPRAS */}
                                <Route path="/compras/" element={<Compras />} />
                                {/* RUTAS PARA MODULO VENTAS */}
                                <Route path="/ventas">
                                  <Route index element={<Ventas />} />
                                  <Route
                                    path="inventario"
                                    element={<Inventario />}
                                  />
                                  <Route
                                    path="solicitud"
                                    element={<Solicitud />}
                                  />
                                  <Route
                                    path="solicitud/realizarSolicitud"
                                    element={<RealizarSolicitud />}
                                  />
                                  <Route
                                    path="reportes"
                                    element={<Reportes />}
                                  />
                                  <Route
                                    path="ajustes-ventas"
                                    element={<AjustesVentas />}
                                  />
                                  <Route path="cajas" element={<Cajas />} />
                                </Route>

                                {/* RUTA PARA UNICAMENTE COCINA */}
                                <Route
                                  path="/vender/cocina"
                                  element={<CocinaDespacho />}
                                />
                                {/* ====================== */}
                                <Route
                                  path="/abrirCaja"
                                  element={<AbrirCaja />}
                                />
                                <Route
                                  path="/proveedores"
                                  element={<Proveedores />}
                                />
                                <Route
                                  path="/areas-y-cargos"
                                  element={<AreasCargo />}
                                />
                                {/* RUTAS PARA MODULO INCIDENCIAS */}
                                <Route path="/incidencias">
                                  <Route index element={<Eventos />} />
                                </Route>

                                <Route path="/platos" element={<MenuPlato />} />

                                {/* RUTAS PARA MODULO FINANZAS */}
                                <Route path="/finanzas">
                                  <Route
                                    index
                                    element={<InformesFinancieros />}
                                  />
                                  <Route
                                    path="informes-financieros"
                                    element={<InformesFinancieros />}
                                  />
                                  <Route
                                    path="presupuestos"
                                    element={<Presupuestos />}
                                  />
                                  <Route
                                    path="ajustes"
                                    element={<AjustesFinanzas />}
                                  />
                                  <Route
                                    path="reportesFinanzas"
                                    element={<ReportesFinanzas />}
                                  />
                                  <Route
                                    path="firmar-solicitud"
                                    element={<FirmasSolicitud />}
                                  />
                                  <Route
                                    path="libro-diario"
                                    element={<LibroDiario />}
                                  />
                                  <Route
                                    path="libro-mayor"
                                    element={<LibroMayor />}
                                  />
                                  <Route
                                    path="cuentas-por-cobrar"
                                    element={<CuentasPorCobrar />}
                                  />
                                  <Route
                                    path="cuentas-por-pagar"
                                    element={<CuentasPorPagar />}
                                  />
                                </Route>
                                <Route
                                  path="/configuracion"
                                  element={<Configuracion />}
                                >
                                  <Route index element={<Generales />} />
                                  <Route
                                    path="MiPerfil"
                                    element={<MiPerfil />}
                                  />
                                  <Route
                                    path="MiEmpresa"
                                    element={<MiEmpresa />}
                                  />
                                  <Route
                                    path="Integraciones"
                                    element={<Integraciones />}
                                  />
                                  <Route
                                    path="ServicioSunat"
                                    element={<ServicioSunat />}
                                  />
                                  <Route
                                    path="Mantenimiento"
                                    element={<Mantenimiento />}
                                  />
                                  <Route
                                    path="SoporteContacto"
                                    element={<SoporteContacto />}
                                  />
                                </Route>
                              </Routes>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </PrivateRoute>
              }
            />
            {/* RUTAS PARA MODULO DE VENDER */}
            <Route
              path="/vender/*"
              element={
                <CajaProtectedRoute>
                  <LayoutPOS>
                    <ToastContainer />
                    <Routes>
                      <Route path="ventasMesas" element={<Vender />} />
                      <Route path="ventasLlevar" element={<ToLlevar />} />
                      <Route path="ventasMesas/platos" element={<ToMesa />} />
                      <Route path="pedidosWeb" element={<PedidosWeb />} />
                      <Route
                        path="ventasMesas/preVenta"
                        element={<PreventaMesa />}
                      />
                      <Route
                        path="ventasMesas/detallesPago/:idPedidoWeb?"
                        element={<DetallesPago />}
                      />
                      <Route path="cerrarCaja" element={<CerrarCaja />} />
                      <Route path="cocina" element={<CocinaDespacho />} />
                    </Routes>
                  </LayoutPOS>
                </CajaProtectedRoute>
              }
            />
            {/* ====================== */}
          </Routes>
        </Router>
      </CajaProvider>
    </AuthProvider>
  );
}

export default App;
