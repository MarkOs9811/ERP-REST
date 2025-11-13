import { ToastContainer } from "react-toastify";
import { ContenedorPrincipal } from "../components/componentesReutilizables/ContenedorPrincipal";
import { Header } from "../components/Header";
import { Navegacion } from "../components/Navegacion";
import { PrivateRoute } from "../components/PrivateRoute";
import { SideBar } from "../components/SideBar";
import { Route, Routes } from "react-router-dom";
import { TakeAsistencia } from "../pages/TakeAsistencia";
import { Home } from "../pages/Home";
import { Registro } from "../pages/moduloAlmacen/Registro";
import { Almacen } from "../pages/moduloAlmacen/Almacen";
import { Transferencias } from "../pages/moduloAlmacen/Transferencias";
import { Kardex } from "../pages/moduloAlmacen/Kardex";
import { Solicitudes } from "../pages/moduloAlmacen/Solicitudes";
import { Generales } from "../components/componenteConfiguracion/Generales";
import { Configuracion } from "../pages/moduloConfiguracion/Configuracion";
import { MiPerfil } from "../components/componenteConfiguracion/MiPerfil";
import { MiEmpresa } from "../components/componenteConfiguracion/MiEmpresa";
import { Integraciones } from "../components/componenteConfiguracion/Integraciones";
import { ServicioSunat } from "../components/componenteConfiguracion/ServicioSunat";
import { Mantenimiento } from "../components/componenteConfiguracion/Mantenimiento";
import { SoporteContacto } from "../components/componenteConfiguracion/SoporteContacto";
import { AbrirCaja } from "../pages/AbrirCaja";
import { CuentasPorPagar } from "../pages/moduloFinanzas/CuentasPorPagar";
import { CuentasPorCobrar } from "../pages/moduloFinanzas/CuentasPorCobrar";
import { LibroMayor } from "../pages/moduloFinanzas/LibroMayor";
import { LibroDiario } from "../pages/moduloFinanzas/LibroDiario";
import { FirmasSolicitud } from "../pages/moduloFinanzas/FirmasSolicitud";
import { ReportesFinanzas } from "../pages/moduloFinanzas/ReportesFinanzas";
import { AjustesFinanzas } from "../pages/moduloFinanzas/AjustesFinanzas";
import { Presupuestos } from "../pages/moduloFinanzas/Presupuestos";
import { InformesFinancieros } from "../pages/moduloFinanzas/InformesFinancieros";
import { MenuPlato } from "../pages/MenuPlato";
import { Eventos } from "../pages/moduloIncidencias/Eventos";
import { AreasCargo } from "../pages/moduloAreasCargos/AreasCargos";
import { Proveedores } from "../pages/Proveedores";
import { CocinaDespacho } from "../pages/modulosVender/CocinaDespacho";
import { Cajas } from "../pages/moduloVentas/Cajas";
import AjustesVentas from "../pages/moduloVentas/AjustesVentas";
import { Reportes } from "../pages/moduloVentas/Reportes";
import { Mesas } from "../pages/moduloVentas/Mesas";
import { RealizarSolicitud } from "../pages/moduloVentas/RealizarSolicitud";
import { Solicitud } from "../pages/moduloVentas/Solicitud";
import { Inventario } from "../pages/moduloVentas/Inventario";
import { Ventas } from "../pages/moduloVentas/Ventas";
import { Compras } from "../pages/Compras";
import { AjustesPlanilla } from "../pages/moduloPlanilla/AjustesPlanilla";
import { ReportePlanilla } from "../pages/moduloPlanilla/ReportePlanilla";
import { Vacaciones } from "../pages/moduloPlanilla/Vacaciones";
import { AdelantoSueldo } from "../pages/moduloPlanilla/AdelantoSueldo";
import { HorasExtras } from "../pages/moduloPlanilla/HorasExtras";
import { Asistencia } from "../pages/moduloPlanilla/Asistencia";
import { Nomina } from "../pages/moduloPlanilla/Nomina";
import { IngresoPlanilla } from "../pages/moduloPlanilla/IngresoPlanilla";
import { ListaTrabajador } from "../pages/moduloPlanilla/ListaTrabajador";
import { ListaTrabajadorCargo } from "../pages/moduloPlanilla/ListaTrabajadorCargo";
import { AjustesAlmacen } from "../pages/moduloAlmacen/AjustesAlmancen";
import { ReportesAlmacen } from "../pages/moduloAlmacen/ReportesAlmacen";
import { Usuarios } from "../pages/Usuarios";
import { LayOutAtencion } from "./LayOutAtencion";

export const MainLayout = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const cargoUsuario = user?.empleado?.cargo?.nombre; // ej: "atencion al cliente"
  const showFullLayout = cargoUsuario != "atencion al cliente";
  const showHeader = cargoUsuario != "atencion al cliente";

  return (
    <div className="main-container p-0 m-0 h-screen flex">
      {/* --- RENDERIZADO CONDICIONAL --- */}
      {showFullLayout && <SideBar />}

      <div
        className={`content p-0`}
        style={{
          width: showFullLayout ? "calc(100% - 230px)" : "100%",
          marginLeft: showFullLayout ? "230px" : "0px",
        }}
      >
        <div className="card p-0 m-0 rounded-0 vh-100">
          <div className="card-body shadow-none p-0 h-100 contenido">
            <div className="row h-100 g-0 d-flex ">
              <div
                className={`h-100 flex-column align-items-center justify-content-center overflow-auto p-0
                transition-all`}
                style={{
                  transition: "width 0.3s ease, margin 0.3s ease",
                }}
              >
                {/* --- RENDERIZADO CONDICIONAL --- */}
                <div
                  className="d-flex flex-column position-fixed "
                  style={{
                    zIndex: 100,
                    width: showFullLayout ? "calc(100% - 230px)" : "100%",
                  }}
                >
                  {!showHeader && <Header />}
                  {showFullLayout && <Header />}
                  {/* Tu PrivateRoute original para Navegacion está perfecto */}
                  {showFullLayout && (
                    <PrivateRoute allowedRoles={["ventas", "administrador"]}>
                      <Navegacion />
                    </PrivateRoute>
                  )}
                  {!showHeader && <Navegacion />}
                </div>

                {/* Esta es tu estructura de rutas original */}
                <ContenedorPrincipal>
                  <ToastContainer />
                  <Routes>
                    <Route
                      path="/marcarAsistencia"
                      element={<TakeAsistencia />}
                    />
                    <Route
                      path="/"
                      element={
                        cargoUsuario !== "atencion al cliente" ? (
                          <Home />
                        ) : (
                          <LayOutAtencion />
                        )
                      }
                    />
                    <Route
                      path="/usuarios"
                      element={
                        <PrivateRoute
                          allowedRoles={["usuario", "administrador"]}
                        >
                          <Usuarios />
                        </PrivateRoute>
                      }
                    />

                    {/* --- PEGADO DE TODAS TUS RUTAS --- */}

                    {/* RUTAS PARA MODULO ALMACEN */}
                    <Route path="/almacen">
                      <Route
                        index
                        element={
                          <PrivateRoute
                            allowedRoles={["almacen", "administrador"]}
                          >
                            <Almacen />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="Almacenes"
                        element={
                          <PrivateRoute
                            allowedRoles={["almacen", "administrador"]}
                          >
                            <Almacen />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="registro"
                        element={
                          <PrivateRoute
                            allowedRoles={["almacen", "administrador"]}
                          >
                            <Registro />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="transferencia"
                        element={
                          <PrivateRoute
                            allowedRoles={["almacen", "administrador"]}
                          >
                            <Transferencias />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="solicitud"
                        element={
                          <PrivateRoute
                            allowedRoles={["almacen", "administrador"]}
                          >
                            <Solicitudes />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="kardex"
                        element={
                          <PrivateRoute
                            allowedRoles={["almacen", "administrador"]}
                          >
                            <Kardex />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="reportes"
                        element={
                          <PrivateRoute
                            allowedRoles={["almacen", "administrador"]}
                          >
                            <ReportesAlmacen />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="ajustes"
                        element={
                          <PrivateRoute
                            allowedRoles={["almacen", "administrador"]}
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
                            allowedRoles={["RRHH", "administrador"]}
                          >
                            <ListaTrabajadorCargo />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="usuarios"
                        element={
                          <PrivateRoute
                            allowedRoles={["RRHH", "administrador"]}
                          >
                            <ListaTrabajadorCargo />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="planilla"
                        element={
                          <PrivateRoute
                            allowedRoles={["RRHH", "administrador"]}
                          >
                            <ListaTrabajadorCargo />
                          </PrivateRoute>
                        }
                      />

                      <Route
                        path="planilla/ListaTrabajador/:idCargo?"
                        element={
                          <PrivateRoute
                            allowedRoles={["RRHH", "administrador"]}
                          >
                            <ListaTrabajador />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="ingreso-a-planilla"
                        element={
                          <PrivateRoute
                            allowedRoles={["RRHH", "administrador"]}
                          >
                            <IngresoPlanilla />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="nomina"
                        element={
                          <PrivateRoute
                            allowedRoles={["RRHH", "administrador"]}
                          >
                            <Nomina />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="asistencia"
                        element={
                          <PrivateRoute
                            allowedRoles={["RRHH", "administrador"]}
                          >
                            <Asistencia />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="horas-extras"
                        element={
                          <PrivateRoute
                            allowedRoles={["RRHH", "administrador"]}
                          >
                            <HorasExtras />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="adelanto-de-sueldo"
                        element={
                          <PrivateRoute
                            allowedRoles={["RRHH", "administrador"]}
                          >
                            <AdelantoSueldo />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="vacaciones"
                        element={
                          <PrivateRoute
                            allowedRoles={["RRHH", "administrador"]}
                          >
                            <Vacaciones />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="reportes"
                        element={
                          <PrivateRoute
                            allowedRoles={["RRHH", "administrador"]}
                          >
                            <ReportePlanilla />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="ajustes"
                        element={
                          <PrivateRoute
                            allowedRoles={["RRHH", "administrador"]}
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
                          allowedRoles={["compras", "administrador"]}
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
                            allowedRoles={["ventas", "administrador"]}
                          >
                            <Ventas />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="mis-ventas"
                        element={
                          <PrivateRoute
                            allowedRoles={["ventas", "administrador"]}
                          >
                            <Ventas />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="inventario"
                        element={
                          <PrivateRoute
                            allowedRoles={["ventas", "administrador"]}
                          >
                            <Inventario />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="solicitud"
                        element={
                          <PrivateRoute
                            allowedRoles={["ventas", "administrador"]}
                          >
                            <Solicitud />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="solicitud/realizarSolicitud"
                        element={
                          <PrivateRoute
                            allowedRoles={["ventas", "administrador"]}
                          >
                            <RealizarSolicitud />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="mesas"
                        element={
                          <PrivateRoute
                            allowedRoles={["ventas", "administrador"]}
                          >
                            <Mesas />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="reportes"
                        element={
                          <PrivateRoute
                            allowedRoles={["ventas", "administrador"]}
                          >
                            <Reportes />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="ajustes-ventas"
                        element={
                          <PrivateRoute
                            allowedRoles={["ventas", "administrador"]}
                          >
                            <AjustesVentas />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="cajas"
                        element={
                          <PrivateRoute
                            allowedRoles={["ventas", "administrador"]}
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
                          allowedRoles={["cocina", "administrador"]}
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
                          allowedRoles={["proveedores", "administrador"]}
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
                          allowedRoles={["areas y cargos", "administrador"]}
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
                            allowedRoles={["incidencias", "administrador"]}
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
                          allowedRoles={["platos", "administrador"]}
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
                            allowedRoles={["finanzas", "administrador"]}
                          >
                            <InformesFinancieros />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="informes-financieros"
                        element={
                          <PrivateRoute
                            allowedRoles={["finanzas", "administrador"]}
                          >
                            <InformesFinancieros />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="presupuestos"
                        element={
                          <PrivateRoute
                            allowedRoles={["finanzas", "administrador"]}
                          >
                            <Presupuestos />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="ajustes"
                        element={
                          <PrivateRoute
                            allowedRoles={["finanzas", "administrador"]}
                          >
                            <AjustesFinanzas />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="reportes-financieros"
                        element={
                          <PrivateRoute
                            allowedRoles={["finanzas", "administrador"]}
                          >
                            <ReportesFinanzas />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="firmar-solicitud"
                        element={
                          <PrivateRoute
                            allowedRoles={["finanzas", "administrador"]}
                          >
                            <FirmasSolicitud />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="libro-diario"
                        element={
                          <PrivateRoute
                            allowedRoles={["finanzas", "administrador"]}
                          >
                            <LibroDiario />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="libro-mayor"
                        element={
                          <PrivateRoute
                            allowedRoles={["finanzas", "administrador"]}
                          >
                            <LibroMayor />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="cuentas-por-cobrar"
                        element={
                          <PrivateRoute
                            allowedRoles={["finanzas", "administrador"]}
                          >
                            <CuentasPorCobrar />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="cuentas-por-pagar"
                        element={
                          <PrivateRoute
                            allowedRoles={["finanzas", "administrador"]}
                          >
                            <CuentasPorPagar />
                          </PrivateRoute>
                        }
                      />
                    </Route>

                    {/* Configuración */}
                    <Route path="/configuracion" element={<Configuracion />}>
                      <Route index element={<Generales />} />
                      <Route path="MiPerfil" element={<MiPerfil />} />
                      <Route path="MiEmpresa" element={<MiEmpresa />} />
                      <Route path="Integraciones" element={<Integraciones />} />
                      <Route path="ServicioSunat" element={<ServicioSunat />} />
                      <Route path="Mantenimiento" element={<Mantenimiento />} />
                      <Route
                        path="SoporteContacto"
                        element={<SoporteContacto />}
                      />
                    </Route>
                    <Route path="/abrirCaja" element={<AbrirCaja />} />
                  </Routes>
                </ContenedorPrincipal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
