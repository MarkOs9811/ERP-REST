import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../api/AxiosInstance";
import { useDispatch } from "react-redux";
import { subMenuClick } from "../redux/subMenuSlice";
import "../css/EstilosSideBar.css";
import RippleWrapper from "./componentesReutilizables/RippleWrapper";
import { setSidebarCompressed } from "../redux/sideBarSlice";
import {
  Archive,
  Building2,
  Calendar,
  Hamburger,
  Home,
  LogOutIcon,
  Megaphone,
  Settings,
  Settings2,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Truck,
  User,
  Users,
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { capitalizeFirstLetter } from "../hooks/FirstLetterUp";

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

  // Mapeo dinámico de iconos usando react-ionicons
  const icons = {
    inicio: Home,
    usuarios: Users,
    ventas: ShoppingBag, // En lugar de StorefrontOutline
    incidenciasempleado: Home,
    incidencias: Megaphone,
    almacen: Archive, // En lugar de FileTrayStackedOutline
    vender: ShoppingCart,
    proveedores: Truck, // En lugar de CubeOutline (para logística)
    compras: Calendar,
    platos: Hamburger, // Para FastFoodOutline
    "rr-hh": Users, // En lugar de ManOutline
    finanzas: TrendingUp,
    "areas-y-cargos": Building2, // En lugar de BusinessOutline
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

  // Obtener el icono correspondiente al rol
  const getIconForRole = (roleName) => {
    const roleKey = roleName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/\./g, "-")
      .trim();
    return icons[roleKey] || Home; // Icono por defecto: Home
  };
  const { logout } = useAuth();
  // Cerrar sesión
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

  // Formatear el nombre del rol para la URL
  const formatRoleToUrl = (roleName) => {
    return roleName.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "-");
  };

  // Ordenar roles según el orden personalizado
  const orderedRoles = roles.sort((a, b) => {
    const indexA = customOrder.indexOf(a.nombre.toLowerCase());
    const indexB = customOrder.indexOf(b.nombre.toLowerCase());
    return (
      (indexA !== -1 ? indexA : Infinity) - (indexB !== -1 ? indexB : Infinity)
    );
  });

  // Manejar la selección de un módulo
  const handleModuloSeleccionado = (nombreOpcion, event) => {
    // 👈 actualiza la posición
    dispatch(subMenuClick(nombreOpcion));
    dispatch(setSidebarCompressed(true));
  };

  return (
    <div className={`sidebar compressed `}>
      <div className="sidebar-header  d-flex">
        {fotoEmpresa && (
          <img
            src={fotoEmpresa}
            alt="logo empresa"
            className="img-fluid m-auto"
            style={{
              maxWidth: "35px",
              borderRadius: "50%",
              marginLeft: "10px",
              height: "28px",
            }}
          />
        )}
      </div>

      <div className="sidebar-menu my-2">
        <ul className="menu-list h-100">
          {/* Ícono de Inicio */}

          <Link
            to={"/"}
            className="link-opcion text-decoration-none"
            title="Inicio"
            onClick={(e) => handleModuloSeleccionado("accesos rapido", e)}
          >
            <li
              className={`menu-item  p-0 py-2  h-100 ${
                location.pathname === `/` ? "active" : ""
              }`}
            >
              <div className="d-flex flex-column align-items-center m-auto">
                <Home className="icon-lucide" />
                <small
                  className="small text-white"
                  style={{ fontSize: "10px" }}
                >
                  Inicio
                </small>
              </div>
            </li>
          </Link>

          {/* Módulos dinámicos */}
          {orderedRoles.map((role) => {
            if (role.nombre.toLowerCase() === "vender") return null;
            if (role.nombre.toLowerCase() === "incidencias") return null;
            if (role.nombre.toLowerCase() === "usuarios") return null;
            const roleUrl = formatRoleToUrl(role.nombre);
            const isActive = location.pathname.includes(`/${roleUrl}`);
            const IconComponent = getIconForRole(role.nombre);

            return (
              <Link
                key={role.id}
                to={`/${roleUrl}`}
                className="link-opcion text-decoration-none"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title={role.nombre}
                onClick={(e) => handleModuloSeleccionado(roleUrl, e)} // al entrar
              >
                <li
                  className={`menu-item p-0 py-2 my-2 h-100 ${
                    isActive ? "active" : ""
                  }`}
                >
                  <div className="d-flex flex-column m-auto align-items-center">
                    <IconComponent className="icon-lucide" />
                    <small
                      className="small text-white"
                      style={{ fontSize: "10px" }}
                    >
                      {capitalizeFirstLetter(role.nombre)}
                    </small>
                  </div>
                </li>
              </Link>
            );
          })}

          {/* Configuración y Salir */}
          <div className="menu-footer d-flex flex-column mt-auto">
            <RippleWrapper className="rounded-md">
              <Link
                to={"/configuracion"}
                className="link-opcion text-decoration-none"
                onClick={(e) => handleModuloSeleccionado("", e)}
              >
                <li
                  className={`menu-item  p-0 py-2 h-100 ${
                    location.pathname.includes("/configuracion") ? "active" : ""
                  }`}
                >
                  <div className="d-flex flex-column align-items-center m-auto">
                    <Settings2 className="icon-lucide" />
                    <small
                      className="small text-white"
                      style={{ fontSize: "10px" }}
                    >
                      Ajustes
                    </small>
                  </div>
                </li>
              </Link>
            </RippleWrapper>

            <Link
              onClick={cerrarSession}
              className="logout-btn link-opcion text-decoration-none"
              title="Cerrar sesión"
            >
              <li className={`menu-item  p-0 py-2 h-100 `}>
                <div className="d-flex flex-column align-items-center m-auto">
                  <LogOutIcon className="icon-lucide " />
                  <small
                    className="small text-white"
                    style={{ fontSize: "10px" }}
                  >
                    Salir
                  </small>
                </div>
              </li>
            </Link>
          </div>
        </ul>
      </div>
    </div>
  );
}
