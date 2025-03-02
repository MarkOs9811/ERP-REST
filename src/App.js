import React, { useEffect, useState } from "react";
import {
  HashRouter as Router,
  // BrowserRouter as Router, // Cambiado de BrowserRouter a HashRouter
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

const BASE_URL = process.env.REACT_APP_BASE_URL;
function App() {
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

            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <div className="main-container">
                    <SideBar />
                    <div className={`content ${isCompressed ? "" : "open"}`}>
                      <Header />
                      <Navegacion />
                      <div className="container-fluid py-3 px-3 ">
                        <ToastContainer />
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/usuarios" element={<Usuarios />} />
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
                          <Route path="/almacen/kardex" element={<Kardex />} />
                          <Route
                            path="/almacen/reportes"
                            element={<ReportesAlmacen />}
                          />
                          <Route
                            path="/almacen/ajustes"
                            element={<AjustesAlmacen />}
                          />

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

                          <Route path="/ventas/cajas" element={<Cajas />} />
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
                                    path="ventasMesas/preVenta"
                                    element={<PreventaMesa />}
                                  />
                                  <Route
                                    path="ventasMesas/detallesPago"
                                    element={<DetallesPago />}
                                  />
                                  <Route
                                    path="cerrarCaja"
                                    element={<CerrarCaja />}
                                  />
                                </Routes>
                              </CajaProtectedRoute>
                            }
                          />
                          <Route path="/abrirCaja" element={<AbrirCaja />} />
                          <Route
                            path="/proveedores"
                            element={<Proveedores />}
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
