import { useEffect } from "react";
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
import { Vender } from "./pages/modulosVender/Vender";
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
import { Transferencias } from "./pages/moduloAlmacen/Transferencias";
import { Solicitudes } from "./pages/moduloAlmacen/Solicitudes";
import { Kardex } from "./pages/moduloAlmacen/Kardex";
import { ReportesAlmacen } from "./pages/moduloAlmacen/ReportesAlmacen";
import { AjustesAlmacen } from "./pages/moduloAlmacen/AjustesAlmancen";
import { Compras } from "./pages/Compras";
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
import LayoutPOS from "./LayoutPOS";
import { ErrorVista } from "./pages/ErrorVista";
import { Nomina } from "./pages/moduloPlanilla/Nomina";
import { ContenedorPrincipal } from "./components/componentesReutilizables/ContenedorPrincipal";
import { MesasList } from "./components/componenteVender/MesasList";

const BASE_URL = process.env.REACT_APP_BASE_URL;
function App() {
  // useEffect para poder actualizar el logo icono y el nombre en el proyecto - pestaña
  useEffect(() => {
    // Obtener datos de la empresa desde localStorage
    const miEmpresa = JSON.parse(localStorage.getItem("empresa"));

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
            <Route path="/errorVista" element={<ErrorVista />} />
            <Route path="/google" element={<GoogleRedirectHandler />} />
            <Route path="/login" element={<Login />} />
            <Route path="/tomarAsistencia" element={<TakeAsistencia />} />

            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <div className="main-container p-0 m-0 h-screen flex">
                    <SideBar />
                    <div className={`content p-0`}>
                      <div className="card p-0 m-0 rounded-0 vh-100">
                        {/* Header fijo
                        <div className="card-header p-0 rounded-0 m-0 shrink-0  py-2">
                          
                        </div> */}

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
                              <div
                                className="d-flex flex-column  position-fixed "
                                style={{
                                  zIndex: 100,
                                  width: "calc(100% - 230px)", // 👈 resta el ancho del sidebar
                                }}
                              >
                                <Header />
                                <Navegacion />
                              </div>
                              <ContenedorPrincipal>
                                <ToastContainer />
                                <Routes>
                                  <Route path="/" element={<Home />} />
                                  <Route
                                    path="/usuarios"
                                    element={
                                      <PrivateRoute
                                        allowedRoles={[
                                          "usuario",
                                          "administrador",
                                        ]}
                                      >
                                        <Usuarios />
                                      </PrivateRoute>
                                    }
                                  />

                                  {/* RUTAS PARA MODULO ALMACEN */}
                                  <Route path="/almacen">
                                    <Route
                                      index
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "almacen",
                                            "administrador",
                                          ]}
                                        >
                                          <Almacen />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="Almacenes"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "almacen",
                                            "administrador",
                                          ]}
                                        >
                                          <Almacen />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="registro"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "almacen",
                                            "administrador",
                                          ]}
                                        >
                                          <Registro />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="transferencia"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "almacen",
                                            "administrador",
                                          ]}
                                        >
                                          <Transferencias />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="solicitud"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "almacen",
                                            "administrador",
                                          ]}
                                        >
                                          <Solicitudes />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="kardex"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "almacen",
                                            "administrador",
                                          ]}
                                        >
                                          <Kardex />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="reportes"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "almacen",
                                            "administrador",
                                          ]}
                                        >
                                          <ReportesAlmacen />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="ajustes"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "almacen",
                                            "administrador",
                                          ]}
                                        >
                                          <AjustesAlmacen />
                                        </PrivateRoute>
                                      }
                                    />
                                  </Route>

                                  {/* RUTAS PARA MODULO RECURSOS HUMANOS PLANILLAS */}
                                  <Route path="/rrhh">
                                    <Route
                                      index
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "RRHH",
                                            "administrador",
                                          ]}
                                        >
                                          <ListaTrabajadorCargo />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="usuarios"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "RRHH",
                                            "administrador",
                                          ]}
                                        >
                                          <ListaTrabajadorCargo />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="planilla"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "RRHH",
                                            "administrador",
                                          ]}
                                        >
                                          <ListaTrabajadorCargo />
                                        </PrivateRoute>
                                      }
                                    />

                                    <Route
                                      path="planilla/ListaTrabajador/:idCargo?"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "RRHH",
                                            "administrador",
                                          ]}
                                        >
                                          <ListaTrabajador />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="ingreso-a-planilla"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "RRHH",
                                            "administrador",
                                          ]}
                                        >
                                          <IngresoPlanilla />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="nomina"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "RRHH",
                                            "administrador",
                                          ]}
                                        >
                                          <Nomina />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="asistencia"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "RRHH",
                                            "administrador",
                                          ]}
                                        >
                                          <Asistencia />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="horas-extras"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "RRHH",
                                            "administrador",
                                          ]}
                                        >
                                          <HorasExtras />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="adelanto-de-sueldo"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "RRHH",
                                            "administrador",
                                          ]}
                                        >
                                          <AdelantoSueldo />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="vacaciones"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "RRHH",
                                            "administrador",
                                          ]}
                                        >
                                          <Vacaciones />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="reportes"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "RRHH",
                                            "administrador",
                                          ]}
                                        >
                                          <ReportePlanilla />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="ajustes"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "RRHH",
                                            "administrador",
                                          ]}
                                        >
                                          <AjustesPlanilla />
                                        </PrivateRoute>
                                      }
                                    />
                                  </Route>

                                  {/* RUTAS PARA MODULO COMPRAS */}
                                  <Route
                                    path="/compras"
                                    element={
                                      <PrivateRoute
                                        allowedRoles={[
                                          "compras",
                                          "administrador",
                                        ]}
                                      >
                                        <Compras />
                                      </PrivateRoute>
                                    }
                                  />

                                  {/* RUTAS PARA MODULO VENTAS */}
                                  <Route path="/ventas">
                                    <Route
                                      index
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "ventas",
                                            "administrador",
                                          ]}
                                        >
                                          <Ventas />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="mis-ventas"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "ventas",
                                            "administrador",
                                          ]}
                                        >
                                          <Ventas />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="inventario"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "ventas",
                                            "administrador",
                                          ]}
                                        >
                                          <Inventario />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="solicitud"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "ventas",
                                            "administrador",
                                          ]}
                                        >
                                          <Solicitud />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="solicitud/realizarSolicitud"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "ventas",
                                            "administrador",
                                          ]}
                                        >
                                          <RealizarSolicitud />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="reportes"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "ventas",
                                            "administrador",
                                          ]}
                                        >
                                          <Reportes />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="ajustes-ventas"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "ventas",
                                            "administrador",
                                          ]}
                                        >
                                          <AjustesVentas />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="cajas"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "ventas",
                                            "administrador",
                                          ]}
                                        >
                                          <Cajas />
                                        </PrivateRoute>
                                      }
                                    />
                                  </Route>

                                  {/* RUTA PARA UNICAMENTE COCINA */}
                                  <Route
                                    path="/vender/cocina"
                                    element={
                                      <PrivateRoute
                                        allowedRoles={[
                                          "cocina",
                                          "administrador",
                                        ]}
                                      >
                                        <CocinaDespacho />
                                      </PrivateRoute>
                                    }
                                  />

                                  {/* Proveedores */}
                                  <Route
                                    path="/proveedores"
                                    element={
                                      <PrivateRoute
                                        allowedRoles={[
                                          "proveedores",
                                          "administrador",
                                        ]}
                                      >
                                        <Proveedores />
                                      </PrivateRoute>
                                    }
                                  />

                                  {/* Áreas y cargos */}
                                  <Route
                                    path="/areas-y-cargos"
                                    element={
                                      <PrivateRoute
                                        allowedRoles={[
                                          "areas y cargos",
                                          "administrador",
                                        ]}
                                      >
                                        <AreasCargo />
                                      </PrivateRoute>
                                    }
                                  />

                                  {/* RUTAS PARA MODULO INCIDENCIAS */}
                                  <Route path="/incidencias">
                                    <Route
                                      index
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "incidencias",
                                            "administrador",
                                          ]}
                                        >
                                          <Eventos />
                                        </PrivateRoute>
                                      }
                                    />
                                  </Route>

                                  {/* Platos */}
                                  <Route
                                    path="/platos"
                                    element={
                                      <PrivateRoute
                                        allowedRoles={[
                                          "platos",
                                          "administrador",
                                        ]}
                                      >
                                        <MenuPlato />
                                      </PrivateRoute>
                                    }
                                  />

                                  {/* RUTAS PARA MODULO FINANZAS */}
                                  <Route path="/finanzas">
                                    <Route
                                      index
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "finanzas",
                                            "administrador",
                                          ]}
                                        >
                                          <InformesFinancieros />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="informes-financieros"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "finanzas",
                                            "administrador",
                                          ]}
                                        >
                                          <InformesFinancieros />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="presupuestos"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "finanzas",
                                            "administrador",
                                          ]}
                                        >
                                          <Presupuestos />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="ajustes"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "finanzas",
                                            "administrador",
                                          ]}
                                        >
                                          <AjustesFinanzas />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="reportes-financieros"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "finanzas",
                                            "administrador",
                                          ]}
                                        >
                                          <ReportesFinanzas />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="firmar-solicitud"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "finanzas",
                                            "administrador",
                                          ]}
                                        >
                                          <FirmasSolicitud />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="libro-diario"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "finanzas",
                                            "administrador",
                                          ]}
                                        >
                                          <LibroDiario />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="libro-mayor"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "finanzas",
                                            "administrador",
                                          ]}
                                        >
                                          <LibroMayor />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="cuentas-por-cobrar"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "finanzas",
                                            "administrador",
                                          ]}
                                        >
                                          <CuentasPorCobrar />
                                        </PrivateRoute>
                                      }
                                    />
                                    <Route
                                      path="cuentas-por-pagar"
                                      element={
                                        <PrivateRoute
                                          allowedRoles={[
                                            "finanzas",
                                            "administrador",
                                          ]}
                                        >
                                          <CuentasPorPagar />
                                        </PrivateRoute>
                                      }
                                    />
                                  </Route>

                                  {/* Configuración */}
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
                                  <Route
                                    path="/abrirCaja"
                                    element={<AbrirCaja />}
                                  />
                                </Routes>
                              </ContenedorPrincipal>
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
                  <ToastContainer />
                  <LayoutPOS>
                    <Routes>
                      <Route path="mesas" element={<MesasList />} />
                      <Route path="ventasLlevar" element={<ToLlevar />} />
                      <Route path="mesas/platos" element={<ToMesa />} />
                      <Route path="pedidosWeb" element={<PedidosWeb />} />
                      <Route path="mesas/preVenta" element={<PreventaMesa />} />
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
            {/* ====================== */}
          </Routes>
        </Router>
      </CajaProvider>
    </AuthProvider>
  );
}

export default App;
