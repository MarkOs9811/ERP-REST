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
import { Eventos } from "../pages/moduloIncidencias/Eventos";
import { AreasCargo } from "../pages/moduloAreasCargos/AreasCargos";
import { Proveedores } from "../pages/moduloAlmacen/Proveedores";
import { CocinaDespacho } from "../pages/modulosVender/CocinaDespacho";
import { Cajas } from "../pages/moduloVentas/Cajas";
import AjustesVentas from "../pages/moduloVentas/AjustesVentas";
import { ReportesVentas } from "../pages/moduloVentas/ReportesVentas";
import { Mesas } from "../pages/moduloVentas/Mesas";
import { RealizarSolicitud } from "../pages/moduloVentas/RealizarSolicitud";
import { Solicitud } from "../pages/moduloVentas/Solicitud";
import { Inventario } from "../pages/moduloVentas/Inventario";
import { Ventas } from "../pages/moduloVentas/Ventas";
import { AjustesPlanilla } from "../pages/moduloPlanilla/AjustesPlanilla";
import { ReportePlanilla } from "../pages/moduloPlanilla/ReportePlanilla";
import { Vacaciones } from "../pages/moduloPlanilla/Vacaciones";
import { AdelantoSueldo } from "../pages/moduloPlanilla/AdelantoSueldo";
import { HorasExtras } from "../pages/moduloPlanilla/HorasExtras";
import { Asistencia } from "../pages/moduloPlanilla/Asistencia";
import { Nomina } from "../pages/moduloPlanilla/Nomina";
import { IngresoPlanilla } from "../pages/moduloPlanilla/IngresoPlanilla";
import { AjustesAlmacen } from "../pages/moduloAlmacen/AjustesAlmancen";
import { ReportesAlmacen } from "../pages/moduloAlmacen/ReportesAlmacen";
import { LayOutAtencion } from "./LayOutAtencion";
import { useState } from "react";
import ModalGenerales from "../components/componentesReutilizables/ModalGenerales";
import { StepSede } from "../components/componentesFirstSteps/StepSede";
import { StepBienvenida } from "../components/componentesFirstSteps/StepBienvenida";
import { StepAreaCargo } from "../components/componentesFirstSteps/StepAreaCargo";
import { StepCaja } from "../components/componentesFirstSteps/StepCaja";
import { StepPlatosProductos } from "../components/componentesFirstSteps/StepPlatosPorductos";
import { StepUsuario } from "../components/componentesFirstSteps/StepUsuario";
import { Usuarios } from "../pages/moduloPlanilla/Usuarios";
import { LayOutDelivery } from "./LayOutDelivery";
import { PedidosRider } from "../pages/moduloDelivery/PedidosRider";
import { DashboardDelivery } from "../pages/moduloDelivery/DashboardDelivery";
import { Repartidores } from "../pages/moduloDelivery/Repartidores";
import { ZonaTarifa } from "../pages/moduloDelivery/ZonaTarifa";
import { Promociones } from "../pages/moduloDelivery/Promociones";
import { useDispatch, useSelector } from "react-redux";
import { SubMenuTabs } from "../components/SubMenuTabs";
import { IAMoodle } from "../pages/moduloIAmoodle/IAMoodle";
import { DetallesVentas } from "../pages/moduloVentas/DetallesVentas";
import { ReporteDelivery } from "../pages/moduloDelivery/ReporteDelivery";
import { Compras } from "../pages/moduloAlmacen/Compras";
import { PedidosAsignados } from "../pages/moduloDelivery/PedidosAsignados";
import { MisEntregas } from "../pages/moduloDelivery/MisEntregas";
import { PedidosDelivery } from "../pages/moduloDelivery/PedidosDelivery";
import Banner from "../pages/moduloDelivery/Banners";
import { DashboardCliente } from "../pages/moduloClientes/DashboardCliente";
import { Clientes } from "../pages/moduloClientes/Clientes";
import { FeedBack } from "../pages/moduloClientes/FeedBacks";
import { Fidelizacion } from "../pages/moduloClientes/Fidelización";
import { Platos } from "../pages/moduloPlatos/Platos";
import { Combos } from "../pages/moduloPlatos/Combos";
import { CategoriaPlatosCombos } from "../pages/moduloPlatos/CategoriaPlatosCombos";
import { LayOutCocina } from "./LayOutCocina";
import { LayOutMozo } from "./LayOutMozo";
// IMPORTAMOS LA FUNCIÓN DEL DICCIONARIO
import { getCargosPermitidos } from "../utils/diccionarioRoles";
// IMPORTAMOS ÍCONOS EXTRA PARA LA CABECERA MÓVIL
import { ArrowLeft, X } from "lucide-react";
import { setSidebarCompressed } from "../redux/sideBarSlice";
import { toggleSidebarMobile } from "../redux/sideBarMobilSlice";
import { ReservasMesas } from "../pages/moduloVentas/ReservasMesas";
// NOTA: Asegúrate de importar las acciones correctamente según tus rutas de Redux

export const MainLayout = () => {
  const dispatch = useDispatch();

  // 1. OBTENCIÓN DE ESTADOS Y DATOS LOCALES
  const isCompressed = useSelector(
    (state) => state.sidebar?.isCompressed || false,
  );
  const isCompressedMobile = useSelector(
    (state) => state.sidebarMobile?.isCompressedMobile || false,
  );

  const user =
    JSON.parse(
      localStorage.getItem("user") || sessionStorage.getItem("user"),
    ) || {};
  const empresa =
    JSON.parse(
      localStorage.getItem("empresa") || sessionStorage.getItem("empresa"),
    ) || {};

  // 2. IDENTIFICACIÓN DEL ROL (CARGO)
  const cargoUsuario = user?.empleado?.cargo?.nombre?.toLowerCase();

  const rolesEspecialesValidos = getCargosPermitidos([
    "atencion al cliente",
    "moso",
    "mozo",
    "cocinero",
    "delivery",
    "conductor",
    "clientes",
    "cocina",
  ]);

  const esRolEspecial = rolesEspecialesValidos.includes(cargoUsuario);
  const showFullLayout = !esRolEspecial;
  const showHeader = !esRolEspecial;

  // 3. BARRA DE PROGRESO DE CONFIGURACIÓN DE LA EMPRESA
  const [step, setStep] = useState((empresa?.setup_steps || 0) < 5);
  const [showWelcome, setShowWelcome] = useState(empresa?.setup_steps == 0);

  const currentStep = Number(empresa.setup_steps) || 0;
  const totalSteps = 5;
  const rawPercentage = ((currentStep + 1) / totalSteps) * 100;
  const progressPercentage = Math.min(100, rawPercentage);

  const renderHomePorRol = () => {
    if (cargoUsuario === "atencion al cliente") return <LayOutAtencion />;
    if (cargoUsuario === "cocinero" || cargoUsuario === "cosinero")
      return <LayOutCocina />;
    if (
      cargoUsuario === "moso" ||
      cargoUsuario === "mozo" ||
      cargoUsuario === "mesa"
    )
      return <LayOutMozo />;
    if (cargoUsuario === "delivery" || cargoUsuario === "conductor")
      return <LayOutDelivery />;
    return <Home />;
  };

  return (
    <div className="p-0 m-0 vh-100 d-flex overflow-hidden">
      {showFullLayout && (
        <div className="sidebar-main-wrapper border-0">
          <SideBar />
        </div>
      )}

      {showFullLayout && (
        <div
          className={`submenu-secundario-wrapper border-0 bg-white 
            ${isCompressed ? "subMenuComprimido" : ""} 
            ${isCompressedMobile && !isCompressed ? "mobile-submenu-active" : ""}`}
        >
          {/* =========================================
              CABECERA MÓVIL DEL SUBMENÚ (SOLO MÓVILES)
              ========================================= */}
          <div
            className="d-flex d-md-none align-items-center justify-content-between p-3 border-bottom shadow-sm"
            style={{ backgroundColor: "#f8fafc" }}
          >
            <button
              className="btn btn-light d-flex align-items-center gap-2 fw-bold text-dark border-0 rounded-pill px-3 "
              onClick={() => dispatch(setSidebarCompressed(true))}
            >
              <ArrowLeft size={18} /> Volver
            </button>
            <button
              className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center"
              onClick={() => dispatch(toggleSidebarMobile())}
              style={{ width: "35px", height: "35px" }}
            >
              <X size={18} />
            </button>
          </div>

          <SubMenuTabs />
        </div>
      )}

      <div className="content-wrapper d-flex flex-column flex-grow-1 overflow-hidden">
        {!showHeader && <Header tipoHeader={esRolEspecial} />}
        {showFullLayout && <Header tipoHeader={esRolEspecial} />}

        {showFullLayout && (
          <PrivateRoute
            allowedRoles={getCargosPermitidos([
              "ventas",
              "finanzas",
              "delivery",
              "conductor",
              "cocinero",
              "administrador",
            ])}
          >
            <Navegacion tipoNavegacion={esRolEspecial} />
          </PrivateRoute>
        )}

        {!showHeader && <Navegacion tipoNavegacion={esRolEspecial} />}

        <div className="flex-grow-1 overflow-auto overflow-x-hidden contenedor-scroll-principal p-3">
          <ContenedorPrincipal>
            <ToastContainer />
            <Routes>
              {/* ====================================
                   AQUÍ SE MANTIENEN TODAS TUS RUTAS INTACTAS
                   ==================================== */}
              <Route path="/" element={renderHomePorRol()} />
              <Route
                path="/cocina"
                element={
                  <PrivateRoute
                    allowedRoles={getCargosPermitidos([
                      "cocinero",
                      "administrador",
                    ])}
                  >
                    <CocinaDespacho />
                  </PrivateRoute>
                }
              />
              <Route path="/marcarAsistencia" element={<TakeAsistencia />} />

              <Route
                path="/usuarios"
                element={
                  <PrivateRoute
                    allowedRoles={getCargosPermitidos([
                      "usuario",
                      "administrador",
                    ])}
                  >
                    <Usuarios />
                  </PrivateRoute>
                }
              />
              <Route
                path="/pedidosDelivery"
                element={
                  <PrivateRoute
                    allowedRoles={getCargosPermitidos([
                      "delivery",
                      "conductor",
                      "administrador",
                    ])}
                  >
                    <PedidosRider />
                  </PrivateRoute>
                }
              />
              <Route
                path="/mis-entregas"
                element={
                  <PrivateRoute
                    allowedRoles={getCargosPermitidos([
                      "mis entregas",
                      "delivery",
                      "conductor",
                      "administrador",
                    ])}
                  >
                    <MisEntregas />
                  </PrivateRoute>
                }
              />
              <Route
                path="/platos"
                element={
                  <PrivateRoute
                    allowedRoles={getCargosPermitidos([
                      "ventas",
                      "administrador",
                    ])}
                  >
                    <Platos />
                  </PrivateRoute>
                }
              />
              <Route
                path="/platos/combos"
                element={
                  <PrivateRoute
                    allowedRoles={getCargosPermitidos([
                      "ventas",
                      "administrador",
                    ])}
                  >
                    <Combos />
                  </PrivateRoute>
                }
              />
              <Route
                path="/platos/categorias"
                element={
                  <PrivateRoute
                    allowedRoles={getCargosPermitidos([
                      "ventas",
                      "administrador",
                    ])}
                  >
                    <CategoriaPlatosCombos />
                  </PrivateRoute>
                }
              />

              <Route path="/almacen">
                <Route
                  index
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "almacen",
                        "administrador",
                      ])}
                    >
                      <Almacen />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="Almacenes"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "almacen",
                        "administrador",
                      ])}
                    >
                      <Almacen />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="registro"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "almacen",
                        "administrador",
                      ])}
                    >
                      <Registro />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="transferencia"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "almacen",
                        "administrador",
                      ])}
                    >
                      <Transferencias />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="solicitud"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "almacen",
                        "administrador",
                      ])}
                    >
                      <Solicitudes />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="kardex"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "almacen",
                        "administrador",
                      ])}
                    >
                      <Kardex />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="reportes"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "almacen",
                        "administrador",
                      ])}
                    >
                      <ReportesAlmacen />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="ajustes"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "almacen",
                        "administrador",
                      ])}
                    >
                      <AjustesAlmacen />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="compras"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "compras",
                        "administrador",
                      ])}
                    >
                      <Compras />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="proveedores"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "proveedores",
                        "administrador",
                      ])}
                    >
                      <Proveedores />
                    </PrivateRoute>
                  }
                />
              </Route>

              <Route path="/rrhh">
                <Route
                  index
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "RRHH",
                        "administrador",
                      ])}
                    >
                      <Usuarios />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="usuarios"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "RRHH",
                        "administrador",
                      ])}
                    >
                      <Usuarios />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="planilla"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "RRHH",
                        "administrador",
                      ])}
                    >
                      <Usuarios />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="ingreso-a-planilla"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "RRHH",
                        "administrador",
                      ])}
                    >
                      <IngresoPlanilla />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="nomina"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "RRHH",
                        "administrador",
                      ])}
                    >
                      <Nomina />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="asistencia"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "RRHH",
                        "administrador",
                      ])}
                    >
                      <Asistencia />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="horas-extras"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "RRHH",
                        "administrador",
                      ])}
                    >
                      <HorasExtras />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="adelanto-de-sueldo"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "RRHH",
                        "administrador",
                      ])}
                    >
                      <AdelantoSueldo />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="vacaciones"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "RRHH",
                        "administrador",
                      ])}
                    >
                      <Vacaciones />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="reportes"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "RRHH",
                        "administrador",
                      ])}
                    >
                      <ReportePlanilla />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="ajustes"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "RRHH",
                        "administrador",
                      ])}
                    >
                      <AjustesPlanilla />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="areas-y-cargos"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "areas y cargos",
                        "administrador",
                      ])}
                    >
                      <AreasCargo />
                    </PrivateRoute>
                  }
                />
              </Route>

              <Route path="/clientes">
                <Route
                  index
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "clientes",
                        "administrador",
                      ])}
                    >
                      <DashboardCliente />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="dashboard"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "clientes",
                        "administrador",
                      ])}
                    >
                      <DashboardCliente />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="lista"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "clientes",
                        "administrador",
                      ])}
                    >
                      <Clientes />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="comentarios"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "clientes",
                        "administrador",
                      ])}
                    >
                      <FeedBack />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="fidelizacion"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "clientes",
                        "administrador",
                      ])}
                    >
                      <Fidelizacion />
                    </PrivateRoute>
                  }
                />
              </Route>

              <Route path="/ventas">
                <Route
                  index
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "ventas",
                        "administrador",
                      ])}
                    >
                      <Ventas />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="dashboard"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "ventas",
                        "administrador",
                      ])}
                    >
                      <Ventas />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="mis-ventas"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "ventas",
                        "administrador",
                      ])}
                    >
                      <DetallesVentas />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="inventario"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "ventas",
                        "administrador",
                      ])}
                    >
                      <Inventario />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="solicitud"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "ventas",
                        "administrador",
                      ])}
                    >
                      <Solicitud />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="solicitud/realizarSolicitud"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "ventas",
                        "administrador",
                      ])}
                    >
                      <RealizarSolicitud />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="mesas"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "ventas",
                        "administrador",
                      ])}
                    >
                      <Mesas />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="reservasMesas"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "ventas",
                        "administrador",
                      ])}
                    >
                      <ReservasMesas />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="reportes"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "ventas",
                        "administrador",
                      ])}
                    >
                      <ReportesVentas />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="ajustesVentas"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "ventas",
                        "administrador",
                      ])}
                    >
                      <AjustesVentas />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="cajas"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "ventas",
                        "administrador",
                      ])}
                    >
                      <Cajas />
                    </PrivateRoute>
                  }
                />
              </Route>

              <Route path="/delivery">
                <Route
                  index
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "delivery",
                        "administrador",
                      ])}
                    >
                      <DashboardDelivery />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="pedidos"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "delivery",
                        "administrador",
                      ])}
                    >
                      <PedidosDelivery />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="pedidosAsignados"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "delivery",
                        "administrador",
                      ])}
                    >
                      <PedidosAsignados />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="repartidores"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "delivery",
                        "administrador",
                      ])}
                    >
                      <Repartidores />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="mis-entregas"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "delivery",
                        "conductor",
                        "administrador",
                      ])}
                    >
                      <MisEntregas />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="zonas-y-tarifas"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "delivery",
                        "administrador",
                      ])}
                    >
                      <ZonaTarifa />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="promociones-app"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "delivery",
                        "administrador",
                      ])}
                    >
                      <Promociones />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="banners"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "delivery",
                        "administrador",
                      ])}
                    >
                      <Banner />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="mesas"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "delivery",
                        "administrador",
                      ])}
                    >
                      <Mesas />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="reportes"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "delivery",
                        "administrador",
                      ])}
                    >
                      <ReporteDelivery />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="ajustes-ventas"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "delivery",
                        "administrador",
                      ])}
                    >
                      <AjustesVentas />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="cajas"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "delivery",
                        "administrador",
                      ])}
                    >
                      <Cajas />
                    </PrivateRoute>
                  }
                />
              </Route>

              <Route
                path="/vender/cocina"
                element={
                  <PrivateRoute
                    allowedRoles={getCargosPermitidos([
                      "cocina",
                      "administrador",
                    ])}
                  >
                    <CocinaDespacho />
                  </PrivateRoute>
                }
              />

              <Route path="/incidencias">
                <Route
                  index
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "incidencias",
                        "administrador",
                      ])}
                    >
                      <Eventos />
                    </PrivateRoute>
                  }
                />
              </Route>

              <Route path="/finanzas">
                <Route
                  index
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "finanzas",
                        "administrador",
                      ])}
                    >
                      <InformesFinancieros />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="informes-financieros"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "finanzas",
                        "administrador",
                      ])}
                    >
                      <InformesFinancieros />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="presupuestos"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "finanzas",
                        "administrador",
                      ])}
                    >
                      <Presupuestos />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="ajustes"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "finanzas",
                        "administrador",
                      ])}
                    >
                      <AjustesFinanzas />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="reportes-financieros"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "finanzas",
                        "administrador",
                      ])}
                    >
                      <ReportesFinanzas />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="firmar-solicitud"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "finanzas",
                        "administrador",
                      ])}
                    >
                      <FirmasSolicitud />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="libro-diario"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "finanzas",
                        "administrador",
                      ])}
                    >
                      <LibroDiario />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="libro-mayor"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "finanzas",
                        "administrador",
                      ])}
                    >
                      <LibroMayor />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="cuentas-por-cobrar"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "finanzas",
                        "administrador",
                      ])}
                    >
                      <CuentasPorCobrar />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="cuentas-por-pagar"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos([
                        "finanzas",
                        "administrador",
                      ])}
                    >
                      <CuentasPorPagar />
                    </PrivateRoute>
                  }
                />
              </Route>

              <Route path="/configuracion" element={<Configuracion />}>
                <Route
                  path="general"
                  element={
                    <PrivateRoute
                      allowedRoles={getCargosPermitidos(["administrador"])}
                    >
                      <Generales />
                    </PrivateRoute>
                  }
                />
                <Route path="MiPerfil" element={<MiPerfil />} />
                <Route path="MiEmpresa" element={<MiEmpresa />} />
                <Route path="Integraciones" element={<Integraciones />} />
                <Route path="ServicioSunat" element={<ServicioSunat />} />
                <Route path="SoporteContacto" element={<SoporteContacto />} />
              </Route>

              <Route
                path="/abrirCaja"
                element={
                  <PrivateRoute
                    allowedRoles={getCargosPermitidos([
                      "ventas",
                      "administrador",
                      "atención al cliente",
                    ])}
                  >
                    <AbrirCaja />
                  </PrivateRoute>
                }
              />
              <Route path="/iaMoodle" element={<IAMoodle />} />
            </Routes>
          </ContenedorPrincipal>
        </div>

        {/* MODAL GENERALES OMITIDO POR ESPACIO PERO SE QUEDA IGUAL QUE TU ARCHIVO */}
        <ModalGenerales
          show={step}
          handleCloseModal={() => setStep(false)}
          showButtons={false}
          width="900px"
        >
          <div
            className="w-100 bg-light position-relative"
            style={{
              height: "8px",
              borderTopLeftRadius: "calc(0.3rem - 1px)",
              borderTopRightRadius: "calc(0.3rem - 1px)",
              overflow: "hidden",
            }}
          >
            <div
              className="h-100 bg-primary transition-all"
              style={{
                width: `${progressPercentage}%`,
                transition: "width 0.5s ease-in-out",
                background:
                  "linear-gradient(90deg, #d31919ff 0%, #ff5f5fff 100%)",
              }}
            ></div>
          </div>
          {empresa.setup_steps == 0 && (
            <>
              {showWelcome ? (
                <StepBienvenida onStart={() => setShowWelcome(false)} />
              ) : (
                <StepSede onFinish={() => setStep(false)} />
              )}
            </>
          )}
          {empresa.setup_steps == 1 && (
            <StepAreaCargo onFinish={() => setStep(false)} />
          )}
          {empresa.setup_steps == 2 && (
            <StepCaja onFinish={() => setStep(false)} />
          )}
          {empresa.setup_steps == 3 && (
            <StepPlatosProductos onFinish={() => setStep(false)} />
          )}
          {empresa.setup_steps == 4 && (
            <StepUsuario onFinish={() => setStep(false)} />
          )}
        </ModalGenerales>
      </div>
    </div>
  );
};
