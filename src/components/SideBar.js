import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../api/AxiosInstance";
import { useDispatch } from "react-redux";
import { subMenuClick } from "../redux/subMenuSlice";
import "../css/EstilosSideBar.css";
import { setSidebarCompressed } from "../redux/sideBarSlice";
import {
  Building2,
  Calendar,
  Hamburger,
  Home,
  Megaphone,
  Settings,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users,
  ChevronDown,
  ChevronRight,
  Warehouse,
  UsersRound,
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { capitalizeFirstLetter } from "../hooks/FirstLetterUp";
import { useState } from "react";

export function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const miEmpresa = JSON.parse(localStorage.getItem("empresa")) || {};
  const fotoEmpresa = miEmpresa.logo
    ? `${BASE_URL}/storage/${miEmpresa.logo}`
    : null;

  const roles = JSON.parse(localStorage.getItem("roles")) || [];
  const dispatch = useDispatch();
  const { logout } = useAuth();

  // Estado para abrir/cerrar acordeones
  const [openAccordion, setOpenAccordion] = useState(null);

  const icons = {
    inicio: Home,
    usuarios: Users,
    ventas: ShoppingBag,
    incidenciasempleado: Home,
    incidencias: Megaphone,
    almacen: Warehouse,
    vender: ShoppingCart,
    proveedores: Truck,
    compras: Calendar,
    platos: Hamburger,
    rrhh: UsersRound,
    finanzas: TrendingUp,
    "areas-y-cargos": Building2,
    configuracion: Settings,
  };

  const customOrder = [
    "ventas",
    "platos",
    "vender",
    "almacen",
    "proveedores",
    "compras",
    "usuarios",
    "finanzas",
    "rr-hh",
    "areas-y-cargos",
    "configuracion",
  ];

  const subMenus = {
    ventas: [
      "Mis Ventas",
      "Inventario",
      "Cajas",
      "Solicitud",
      "Reportes",
      "Mesas",
      "Ajustes Ventas",
    ],
    rrhh: [
      "Usuarios",
      "Nomina",
      "Ingreso a Planilla",
      "Asistencia",
      "Horas Extras",
      "Adelanto de Sueldo",
      "Vacaciones",
      "Reportes",
      "Ajustes",
    ],
    finanzas: [
      "Informes Financieros",
      "Presupuestos",
      "Libro Diario",
      "Libro Mayor",
      "Cuentas por Cobrar",
      "Cuentas por Pagar",
      "Firmar Solicitud",
      "Reportes Financieros",
      "Ajustes",
    ],
    almacen: [
      "Almacenes",
      "Registro",
      "Transferencia",
      "Solicitud",
      "Movimientos",
      "Kardex",
      "Reportes",
      "Ajustes",
    ],
  };

  const getIconForRole = (roleName) => {
    const roleKey = roleName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/\./g, "-")
      .trim();
    return icons[roleKey] || Home;
  };

  const cerrarSession = async () => {
    try {
      await axiosInstance.post(
        "/logout",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const formatRoleToUrl = (roleName) => {
    return roleName.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "-");
  };

  const orderedRoles = roles.sort((a, b) => {
    const indexA = customOrder.indexOf(a.nombre.toLowerCase());
    const indexB = customOrder.indexOf(b.nombre.toLowerCase());
    return (
      (indexA !== -1 ? indexA : Infinity) - (indexB !== -1 ? indexB : Infinity)
    );
  });

  const handleModuloSeleccionado = (nombreOpcion, event) => {
    dispatch(subMenuClick(nombreOpcion));
    dispatch(setSidebarCompressed(true));
  };

  const handleAccordionToggle = (roleName) => {
    setOpenAccordion(openAccordion === roleName ? null : roleName);
  };

  return (
    <div className={`sidebar compressed justify-content-between m-auto`}>
      <div className="sidebar-header d-flex">
        {fotoEmpresa && (
          <img
            src={fotoEmpresa}
            alt="logo empresa"
            className="img-fluid"
            style={{
              maxWidth: "35px",
              borderRadius: "50%",
              marginLeft: "10px",
              height: "28px",
            }}
          />
        )}
        <div className="p-0 m-0">
          <p className="h5 fw-bold p-0 my-2 text-white">Fire Wok</p>
        </div>
      </div>

      <div className="sidebar-menu my-2 mx-3">
        <ul className="menu-list h-100">
          {/* Inicio */}
          <Link
            to={"/"}
            className="link-opcion text-decoration-none"
            title="Inicio"
            onClick={(e) => handleModuloSeleccionado("accesos rapido", e)}
          >
            <li
              className={`menu-item p-2 my-2 h-100 ${
                location.pathname === `/` ? "active" : ""
              }`}
            >
              <div className="d-flex gap-2 align-items-center m-auto">
                <Home className="icon-lucide" size={20} />
                <small className="small " style={{ fontSize: "14px" }}>
                  Inicio
                </small>
              </div>
            </li>
          </Link>

          {/* Módulos dinámicos */}
          {orderedRoles.map((role) => {
            const roleName = role.nombre.toLowerCase();
            if (["vender", "incidencias", "usuarios"].includes(roleName))
              return null;

            const roleUrl = formatRoleToUrl(role.nombre);
            const isActive = location.pathname.includes(`/${roleUrl}`);
            const IconComponent = getIconForRole(role.nombre);
            const hasSubmenu = subMenus[roleName];

            if (hasSubmenu) {
              return (
                <div key={role.id}>
                  <li
                    className={`menu-item p-2 mx-1 h-100 ${
                      isActive ? "active" : ""
                    }`}
                    onClick={() => handleAccordionToggle(roleName)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex gap-2 align-items-center justify-content-between">
                      <div className="d-flex gap-2 align-items-center">
                        <IconComponent className="icon-lucide" size={20} />
                        <small className="small " style={{ fontSize: "14px" }}>
                          {capitalizeFirstLetter(role.nombre)}
                        </small>
                      </div>
                      {openAccordion === roleName ? (
                        <ChevronDown size={18} color="#fff" />
                      ) : (
                        <ChevronRight size={18} color="#fff" />
                      )}
                    </div>
                  </li>

                  <div
                    className={`submenu px-2 mx-2 shadow-none ${
                      openAccordion === roleName ? "submenu-open" : ""
                    }`}
                  >
                    {hasSubmenu.map((sub, index) => {
                      const subUrl =
                        formatRoleToUrl(sub) === roleUrl
                          ? roleUrl
                          : `${roleUrl}/${formatRoleToUrl(sub)}`;
                      return (
                        <Link
                          key={index}
                          to={`/${subUrl}`}
                          className="link-opcion text-decoration-none "
                          onClick={(e) => handleModuloSeleccionado(subUrl, e)}
                        >
                          <li
                            className={`menu-item-sub px-4 py-1 my-1 ${
                              location.pathname.includes(`/${subUrl}`)
                                ? "active-sub"
                                : ""
                            }`}
                          >
                            <small style={{ fontSize: "12px" }}>{sub}</small>
                          </li>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            // Roles sin submenú
            return (
              <Link
                key={role.id}
                to={`/${roleUrl}`}
                className="link-opcion text-decoration-none"
                title={role.nombre}
                onClick={(e) => handleModuloSeleccionado(roleUrl, e)}
              >
                <li
                  className={`menu-item p-2 mx-1 my-2 h-100 ${
                    isActive ? "active" : ""
                  }`}
                >
                  <div className="d-flex gap-2 align-items-center m-auto">
                    <IconComponent className="icon-lucide" size={20} />
                    <small className="small " style={{ fontSize: "14px" }}>
                      {capitalizeFirstLetter(role.nombre)}
                    </small>
                  </div>
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
      <div
        className="menu-footer d-flex flex-column align-items-center w-100"
        style={{ margin: "15px 0" }}
      >
        <Link
          to="/configuracion"
          className="text-decoration-none w-90"
          style={{ width: "85%" }} // deja un margen lateral bonito
          onClick={(e) => handleModuloSeleccionado("", e)}
        >
          <button
            className={`menu-item btn border-0 w-100 d-flex align-items-center justify-content-start ${
              location.pathname.includes("/configuracion") ? "active" : ""
            }`}
            style={{
              padding: "15px 10px",
              borderRadius: "8px",
            }}
          >
            <Settings className="icon-lucide me-2" size={20} />
            <small
              className="text-white"
              style={{ fontSize: "14px", textAlign: "left" }}
            >
              Ajustes
            </small>
          </button>
        </Link>
      </div>
    </div>
  );
}
