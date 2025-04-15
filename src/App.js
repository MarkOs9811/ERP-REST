import React, { useEffect, useState } from "react";
import {
  // HashRouter as Router,
  BrowserRouter as Router, // Cambiado de BrowserRouter a HashRouter
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";

// IMPORTACION DE CONTEXTOS
import { CajaProtectedRoute } from "../src/components/CajaProtectedRoute";
import { CajaProvider } from "../src/CajaContext";

import { PrivateRoute } from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";
import { Header } from "./components/Header";
import { SideBar } from "./components/SideBar";
import { Navegacion } from "./components/Navegacion";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { MenuPlato } from "./pages/MenuPlato";
import { Usuarios } from "./pages/Usuarios";
import { Almacen } from "./pages/moduloAlmacen/Almacen";
import { Configuracion } from "./pages/Configuracion";
import { AuthProvider, useAuth } from "./AuthContext";
import { Vender } from "./pages/Vender";
import { Llevar, ToLlevar } from "./components/componenteVender/ToLlevar";
import { Platos, ToMesa } from "./components/componenteVender/ToMesa";
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
import { PedidosWsp } from "./components/PedidosWsp";
import { MensajeriaPedido } from "./components/componenteVender/MensajeriaPedido";
import ToastAlert from "./components/componenteToast/ToastAlert";
import { PedidosWeb } from "./pages/PedidosWeb";
import { AreasCargo } from "./pages/AreasCargos";
import { ListaTrabajadorCargo } from "./pages/moduloPlanilla/ListaTrabajadorCargo";
import { ListaTrabajador } from "./pages/moduloPlanilla/ListaTrabajador";
import { IngresoPlanilla } from "./pages/moduloPlanilla/IngresoPlanilla";
import { TakeAsistencia } from "./pages/TakeAsistencia";
import { Asistencia } from "./pages/moduloPlanilla/Asistencia";
import { HorasExtras } from "./pages/moduloPlanilla/HorasExtras";

const BASE_URL = process.env.REACT_APP_BASE_URL;
function App() {
  const moduloAplicado = useSelector((state) => state.subMenu.moduloAplicado);
  const isCompressed = useSelector((state) => state.sidebar.isCompressed);

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

  const isAuthenticated = !!localStorage.getItem("token"); // Verifica si hay token

  return (
    <AuthProvider>
      <CajaProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/tomarAsistencia" element={<TakeAsistencia />} />

            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <div className="main-container p-0 m-0 h-screen flex">
                    <SideBar />
                    <div
                      className={`content ${
                        isCompressed ? "" : "open"
                      } w-100  p-0`}
                    >
                      <div className="card p-0 m-0 rounded-0 vh-100">
                        {/* Header fijo */}
                        <div className="card-header p-0 rounded-0 m-0 shrink-0 ">
                          <Header />
                          <Navegacion />
                        </div>
                        {/* Cuerpo flexible con scroll interno si es necesario */}
                        <div
                          className="card-body  p-0 h-100"
                          style={{ background: "#f9f6f6" }}
                        >
                          <div className="row h-100 py-2 g-0">
                            <div
                              className={` ${
                                moduloAplicado === ""
                                  ? "d-none"
                                  : "col-md-2 h-100 d-flex align-items-center justify-content-center p-0"
                              }`}
                            >
                              <SubMenu />
                            </div>
                            <div
                              className={`h-100 d-flex align-items-center justify-content-center overflow-auto pe-3 p-0 ${
                                moduloAplicado === ""
                                  ? "col-md-12 mx-2"
                                  : "col-md-10 "
                              }`}
                            >
                              <ToastContainer />
                              <Routes>
                                <Route path="/" element={<Home />} />
                                <Route
                                  path="/usuarios"
                                  element={<Usuarios />}
                                />
                                <Route
                                  path="/almacen/productos"
                                  element={<Almacen />}
                                />
                                {/* RUTAS PARA MODULO ALMACEN */}
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
                                <Route path="/rr.hh">
                                  <Route
                                    index
                                    element={<ListaTrabajadorCargo />}
                                  />
                                  <Route
                                    path="planilla"
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
                                </Route>

                                {/* RUTAS PARA MODULO COMPRAS */}

                                <Route path="/compras/" element={<Compras />} />

                                {/* RUTAS PARA MODULO VENTAS */}
                                <Route
                                  path="/ventas/misVentas"
                                  element={<Ventas />}
                                />
                                <Route
                                  path="/ventas/inventario"
                                  element={<Inventario />}
                                />
                                <Route
                                  path="/ventas/solicitud"
                                  element={<Solicitud />}
                                />
                                <Route
                                  path="/ventas/solicitud/realizarSolicitud"
                                  element={<RealizarSolicitud />}
                                />
                                <Route
                                  path="/ventas/reportes"
                                  element={<Reportes />}
                                />
                                <Route
                                  path="/ventas/ajustes-ventas"
                                  element={<AjustesVentas />}
                                />

                                <Route
                                  path="/ventas/cajas"
                                  element={<Cajas />}
                                />

                                {/* RUTAS PARA MODULO DE VENDER */}
                                <Route
                                  path="/vender/*"
                                  element={
                                    <CajaProtectedRoute>
                                      <Routes>
                                        <Route
                                          path="ventasMesas"
                                          element={<Vender />}
                                        />
                                        <Route
                                          path="ventasLlevar"
                                          element={<ToLlevar />}
                                        />
                                        <Route
                                          path="ventasMesas/platos"
                                          element={<ToMesa />}
                                        />
                                        <Route
                                          path="pedidosWeb"
                                          element={<PedidosWeb />}
                                        />
                                        <Route
                                          path="ventasMesas/preVenta"
                                          element={<PreventaMesa />}
                                        />
                                        <Route
                                          path="ventasMesas/detallesPago/:idPedidoWeb?"
                                          element={<DetallesPago />}
                                        />
                                        <Route
                                          path="cerrarCaja"
                                          element={<CerrarCaja />}
                                        />
                                        <Route
                                          path="mensajeriaPedido"
                                          element={<MensajeriaPedido />}
                                        />
                                      </Routes>
                                    </CajaProtectedRoute>
                                  }
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
                                <Route
                                  path="/configuracion"
                                  element={<Configuracion />}
                                />
                                <Route path="/platos" element={<MenuPlato />} />
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
          </Routes>
        </Router>
      </CajaProvider>
    </AuthProvider>
  );
}

export default App;
