import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../api/AxiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { subMenuClick } from "../redux/subMenuSlice";
import {
  HomeOutline,
  PeopleOutline,
  CartOutline,
  StorefrontOutline,
  TruckOutline,
  CalendarOutline,
  FastFoodOutline,
  IdCardOutline,
  TrendingUpOutline,
  BusinessOutline,
  SettingsOutline,
  LogOutOutline,
  FileTrayStackedOutline,
  ArchiveOutline,
  CubeOutline,
  MegaphoneOutline,
  ManOutline,
} from "react-ionicons";
import RippleWrapper from "./componentesReutilizables/RippleWrapper";
import { setSidebarCompressed, toggleSidebar } from "../redux/sideBarSlice";

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
  const isCompressed = useSelector((state) => state.sidebar.isCompressed);

  // Mapeo dinámico de iconos usando react-ionicons
  const icons = {
    inicio: HomeOutline,
    usuarios: PeopleOutline,
    ventas: StorefrontOutline,
    incidenciasempleado: HomeOutline,
    incidencias: MegaphoneOutline,
    almacen: FileTrayStackedOutline,
    vender: CartOutline,
    proveedores: CubeOutline,
    compras: CalendarOutline,
    platos: FastFoodOutline,
    "rr-hh": ManOutline,
    finanzas: TrendingUpOutline,
    "areas-y-cargos": BusinessOutline,
    configuracion: SettingsOutline,
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
    return icons[roleKey] || HomeOutline; // Icono por defecto: HomeOutline
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

  // Capitalizar palabras
  const capitalizeWords = (string) => {
    return string
      ? string
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "";
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
  const handleModuloSeleccionado = (nombreOpcion) => {
    dispatch(subMenuClick(nombreOpcion));
    dispatch(setSidebarCompressed(false));
  };

  return (
    <div className={`sidebar compressed`}>
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
            className="link-opcion"
            title="Inicio"
            onClick={() => handleModuloSeleccionado("")}
          >
            <li
              className={`menu-item text-center ${
                location.pathname === `/` ? "active" : ""
              }`}
            >
              <HomeOutline color={"auto"} className={"ms-auto text-center"} />
            </li>
          </Link>

          {/* Módulos dinámicos */}
          {orderedRoles.map((role) => {
            if (role.nombre.toLowerCase() === "vender") return null; // ⛔ Omitir si es "vender"

            const roleUrl = formatRoleToUrl(role.nombre);
            const isActive = location.pathname.startsWith(`/${roleUrl}`);
            const IconComponent = getIconForRole(role.nombre);

            return (
              <Link
                key={role.id}
                to={`/${roleUrl}`}
                className="link-opcion"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title={role.nombre}
                onClick={() => handleModuloSeleccionado(roleUrl)}
              >
                <li
                  className={`menu-item p-0 py-2 ${isActive ? "active" : ""}`}
                >
                  <IconComponent color={"auto"} className={"text-center"} />
                </li>
              </Link>
            );
          })}
        </ul>
        {/* Configuración y Salir */}
        <div className="menu-footer d-flex flex-column mt-auto">
          <RippleWrapper className="rounded-md">
            <Link
              to={"/configuracion"}
              className="link-opcion"
              onClick={() => handleModuloSeleccionado("")}
            >
              <li
                className={`menu-item ${
                  location.pathname === `/configuracion` ? "active" : ""
                }`}
              >
                <SettingsOutline color={"auto"} />
              </li>
            </Link>
          </RippleWrapper>

          <Link onClick={cerrarSession} className="logout-btn link-opcion">
            <li className={`menu-item`}>
              <LogOutOutline color={"auto"} />
            </li>
          </Link>
        </div>
      </div>
    </div>
  );
}
