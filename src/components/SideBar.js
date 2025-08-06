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
  Home,
  LogOut,
  LogOutIcon,
  Megaphone,
  OutdentIcon,
  Sandwich,
  Settings,
  Settings2,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Truck,
  User,
  Users,
} from "lucide-react";

export function SideBar({ setMousePos }) {
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
    platos: Sandwich, // Para FastFoodOutline
    "rr-hh": User, // En lugar de ManOutline
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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("roles");
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
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    setMousePos({ x: mouseX, y: mouseY }); // 👈 actualiza la posición
    dispatch(subMenuClick(nombreOpcion));
    dispatch(setSidebarCompressed(true));
  };

  const handleMouseQuitar = (nombreOpcion) => {
    dispatch(subMenuClick(nombreOpcion));
    dispatch(setSidebarCompressed(false));
  };

  return (
    <div className={`sidebar compressed z-3`}>
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

      <div className="sidebar-menu">
        <ul className="menu-list ">
          {/* Ícono de Inicio */}

          <Link
            to={"/"}
            className="link-opcion "
            title="Inicio"
            onMouseEnter={(e) => handleModuloSeleccionado("accesos rapido", e)}
          >
            <li
              className={`menu-item  p-0 py-2  ${
                location.pathname === `/` ? "active" : ""
              }`}
            >
              <Home className="icon-lucide" />
            </li>
          </Link>

          {/* Módulos dinámicos */}
          {orderedRoles.map((role) => {
            if (role.nombre.toLowerCase() === "vender") return null; // ⛔ Omitir si es "vender"

            const roleUrl = formatRoleToUrl(role.nombre);
            const isActive = location.pathname.includes(`/${roleUrl}`);
            const IconComponent = getIconForRole(role.nombre);

            return (
              <Link
                key={role.id}
                to={`/${roleUrl}`}
                className="link-opcion"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title={role.nombre}
                onMouseEnter={(e) => handleModuloSeleccionado(roleUrl, e)} // al entrar
              >
                <li
                  className={`menu-item p-0 py-2 ${isActive ? "active" : ""}`}
                >
                  <IconComponent className="icon-lucide" />
                </li>
              </Link>
            );
          })}

          {/* Configuración y Salir */}
          <div className="menu-footer d-flex flex-column mt-auto">
            <RippleWrapper className="rounded-md">
              <Link
                to={"/configuracion"}
                className="link-opcion"
                onMouseEnter={(e) => handleModuloSeleccionado("", e)}
              >
                <li
                  className={`menu-item  p-0 py-2 ${
                    location.pathname.includes("/configuracion") ? "active" : ""
                  }`}
                >
                  <Settings2 className="icon-lucide" />
                </li>
              </Link>
            </RippleWrapper>

            <Link onClick={cerrarSession} className="logout-btn link-opcion">
              <li className={`menu-item  p-0 py-2 `}>
                <LogOutIcon className="icon-lucide " />
              </li>
            </Link>
          </div>
        </ul>
      </div>
    </div>
  );
}
