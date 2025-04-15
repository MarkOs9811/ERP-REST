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

export function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const miEmpresa = JSON.parse(localStorage.getItem("miEmpresa")) || {};

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
  };

  return (
    <div className={`sidebar ${isCompressed ? "compressed" : ""}`}>
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
        {!isCompressed && (
          <span className="header-title">
            {capitalizeWords(miEmpresa.nombre)}
          </span>
        )}
      </div>

      <div className="sidebar-menu">
        <ul className="menu-list ">
          {/* Ícono de Inicio */}
          <li
            className={`menu-item  p-0 py-2 ${
              location.pathname === `/` ? "active" : ""
            } ${isCompressed ? "center" : ""}`}
          >
            <Link
              to={`/`}
              className="link-opcion"
              key="Inicio"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              title="Inicio"
              onClick={() => handleModuloSeleccionado("")}
            >
              <HomeOutline color={"#auto"} />
              {!isCompressed && <span className="ms-2">Inicio</span>}
            </Link>
          </li>

          {/* Módulos dinámicos */}
          {orderedRoles.map((role) => {
            const roleUrl = formatRoleToUrl(role.nombre);
            const isActive = location.pathname.startsWith(`/${roleUrl}`);
            const IconComponent = getIconForRole(role.nombre); // Obtener el componente del icono

            return (
              <li
                key={role.id}
                className={`menu-item  p-0 py-2  ${isActive ? "active" : ""} ${
                  isCompressed ? "center" : ""
                }`}
              >
                <Link
                  to={`/${roleUrl}`}
                  className="link-opcion  "
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title={role.nombre}
                  onClick={() => handleModuloSeleccionado(roleUrl)}
                >
                  <IconComponent color={"auto"} />
                  {!isCompressed && <span className="">{role.nombre}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
        {/* Configuración y Salir */}
        <div className="menu-footer d-flex flex-column mt-auto">
          <Link
            to={"/configuracion"}
            className="link-opcion"
            onClick={() => handleModuloSeleccionado("")}
          >
            <li
              className={`menu-item ${
                location.pathname === `/configuracion` ? "active" : ""
              } ${isCompressed ? "center" : ""}`}
            >
              <SettingsOutline color={"auto"} />
              {!isCompressed && <span>Configuración</span>}
            </li>
          </Link>
          <Link onClick={cerrarSession} className="logout-btn link-opcion">
            <li className={`menu-item ${isCompressed ? "center" : ""}`}>
              <LogOutOutline color={"auto"} />
              {!isCompressed && <span>Salir</span>}
            </li>
          </Link>
        </div>
      </div>
    </div>
  );
}
