import { useEffect } from "react";
import {
  //HashRouter as Router, // PARA produccion
  BrowserRouter as Router, // para desarrollo
  Routes,
  Route,
} from "react-router-dom";

import "./App.css";

// --- ¡CAMBIO! Importamos useAuth ---
import { AuthProvider, useAuth } from "./AuthContext";

// IMPORTACION DE CONTEXTOS
import { CajaProtectedRoute } from "../src/components/CajaProtectedRoute";
import { CajaProvider } from "../src/CajaContext";

import { PrivateRoute } from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Login } from "./pages/Login";

import { ToLlevar } from "./components/componenteVender/ToLlevar";
import { ToMesa } from "./components/componenteVender/ToMesa";

import { CerrarCaja } from "./pages/CerrarCaja";
import { PreventaMesa } from "./components/componenteVender/PreventaMesa";
import { DetallesPago } from "./components/componenteVender/DetallesPago";

import { PedidosWeb } from "./pages/PedidosWeb";
import { TakeAsistencia } from "./pages/TakeAsistencia";
import { CocinaDespacho } from "./pages/modulosVender/CocinaDespacho";
import LayoutPOS from "./LayoutPOS";
import { ErrorVista } from "./pages/ErrorVista";

import { MesasList } from "./components/componenteVender/MesasList";
import { MainLayout } from "./LayOut/MainLayout";
import { ContenedorPrincipal } from "./components/componentesReutilizables/ContenedorPrincipal";
import { LoginAdmin } from "./pageAdmin/LoginAdmin";

import { LayOutAdmin } from "./LayOut/LayOutAdmin";
import { AuthProviderAdmin } from "./AuthContextAdmin";
const BASE_URL = process.env.REACT_APP_BASE_URL;

function App() {
  useEffect(() => {
    // ... (Tu lógica de favicon/título está perfecta) ...
    const miEmpresa = JSON.parse(localStorage.getItem("empresa"));
    if (miEmpresa) {
      document.title = miEmpresa.nombre;
      const favicon = document.getElementById("favicon");
      const logoUrl = `${BASE_URL}/storage/${miEmpresa.logo}`;
      favicon.href = logoUrl;
    }
  }, []);

  return (
    // AuthProvider envuelve todo
    <AuthProvider>
      <AuthProviderAdmin>
        <CajaProvider>
          <Router>
            <Routes>
              {/* --- RUTAS PÚBLICAS (Sin cambios) --- */}
              <Route path="/errorVista" element={<ErrorVista />} />
              <Route path="/login" element={<Login />} />
              <Route path="/tomarAsistencia" element={<TakeAsistencia />} />

              {/* --- RUTAS POS (Sin cambios) --- */}
              <Route
                path="/vender/*"
                element={
                  <CajaProtectedRoute>
                    <ToastContainer />
                    <LayoutPOS>
                      <Routes>
                        <Route path="mesas" element={<MesasList />} />
                        <Route path="ventasLlevar" element={<ToLlevar />} />
                        <Route path="mesas/platos" element={<ToMesa />} />
                        <Route path="pedidosWeb" element={<PedidosWeb />} />
                        <Route
                          path="mesas/preVenta"
                          element={<PreventaMesa />}
                        />
                        <Route
                          path="mesas/detallesPago/:idPedidoWeb?"
                          element={<DetallesPago />}
                        />
                        <Route path="cerrarCaja" element={<CerrarCaja />} />
                        <Route path="cocina" element={<CocinaDespacho />} />
                      </Routes>
                    </LayoutPOS>
                  </CajaProtectedRoute>
                }
              />
              {/* RUTAS PARA ADMIN MASTER */}
              <Route
                path="/masterAdmin"
                element={
                  <ContenedorPrincipal>
                    <LoginAdmin />
                  </ContenedorPrincipal>
                }
              />
              <Route path="/masterAdmin/*" element={<LayOutAdmin />} />

              {/* ================================================ */}
              <Route
                path="/*"
                element={
                  <PrivateRoute>
                    <MainLayout />
                  </PrivateRoute>
                }
              />
              {/* ====================== */}
            </Routes>
          </Router>
        </CajaProvider>
      </AuthProviderAdmin>
    </AuthProvider>
  );
}

export default App;
