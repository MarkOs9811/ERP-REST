import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../api/AxiosInstance";
import { useDispatch, useSelector } from "react-redux";
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
  BikeIcon,
  LucideActivity,
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { capitalizeFirstLetter } from "../hooks/FirstLetterUp";
import { useEffect, useState } from "react";

export function SideBar() {
  const isCompressed = useSelector((state) => state.sidebar.isCompressed);
  const location = useLocation();
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const miEmpresa = JSON.parse(localStorage.getItem("empresa")) || {};
  const formatLogoUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    let p = path.startsWith("/") ? path.substring(1) : path;
    if (!p.startsWith("storage/")) {
      p = "storage/" + p;
    }
    return `${BASE_URL}/${p}`;
  };
  const fotoEmpresa = formatLogoUrl(miEmpresa.logo);

  const roles = JSON.parse(localStorage.getItem("roles")) || [];
  const dispatch = useDispatch();
  const { logout } = useAuth();

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
    delivery: BikeIcon,
  };

  const customOrder = [
    "ventas",
    "delivery",
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
        },
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
  };

  // para estilo del header
  useEffect(() => {
    const storageData = localStorage.getItem("estiloEmpresa");

    if (storageData) {
      const parsedData = JSON.parse(storageData);

      if (Array.isArray(parsedData) && parsedData.length > 0) {
        const estiloObj = parsedData[0];

        if (estiloObj.clave) {
          document.documentElement.style.setProperty(
            "--color-brand",
            estiloObj.clave,
          );
        }
      } else if (parsedData.clave) {
        document.documentElement.style.setProperty(
          "--color-brand",
          parsedData.clave,
        );
      }
    }
  }, []);
  return (
    <div
      className={`sidebar justify-content-between m-auto ${isCompressed ? "sidebar-compressed" : ""}`}
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "var(--glass-blur)",
        borderRight: "1px solid var(--glass-border)",
        boxShadow: "var(--shadow-soft)",
        transition: "all var(--transition-smooth)",
      }}
    >
      <div className="sidebar-header d-flex flex-nowrap">
        {fotoEmpresa && (
          <img
            src={fotoEmpresa}
            alt="logo empresa"
            className="img-fluid"
            style={{
              maxWidth: "35px",
              borderRadius: "50%",
              height: "28px",
            }}
          />
        )}
        <div className="p-0 m-0 sidebar-text-container">
          <p
            className="h5 fw-bold p-0 my-2 text-truncate"
            style={{ color: "var(--text-main)", maxWidth: "140px" }}
          >
            {miEmpresa.nombre}
          </p>
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
              className={`menu-item px-3 py-2 mx-2 my-1 ${
                location.pathname === `/` ? "active" : ""
              }`}
            >
              <div className="d-flex w-100 gap-2 align-items-center justify-content-md-start m-auto px-2">
                <Home className="icon-lucide flex-shrink-0" size={20} />
                <small
                  className="small sidebar-text"
                  style={{ fontSize: "14px", transition: "opacity 0.2s" }}
                >
                  Inicio
                </small>
              </div>
            </li>
          </Link>

          {orderedRoles.map((role) => {
            const roleName = role.nombre.toLowerCase();
            const roleUrl = formatRoleToUrl(role.nombre);

            // Ocultamos los modulos que ahora viven dentro de otros como tabs (ej. compras -> almacen)
            const ocultos = [
              "vender",
              "incidencias",
              "usuarios",
              "compras",
              "proveedores",
              "areas y cargos",
            ];
            if (ocultos.includes(roleName)) return null;

            const isActive = location.pathname.includes(`/${roleUrl}`);
            const IconComponent = getIconForRole(role.nombre);

            // Roles ahora son items de nivel superior directos sin submenus en el sidebar
            return (
              <Link
                key={role.id}
                to={`/${roleUrl}`}
                className="link-opcion text-decoration-none"
                title={role.nombre}
                onClick={(e) => handleModuloSeleccionado(roleUrl, e)}
              >
                <li
                  className={`menu-item px-3 py-2 mx-2 my-1 ${
                    isActive ? "active" : ""
                  }`}
                >
                  <div className="d-flex w-100 gap-2 align-items-center justify-content-md-start m-auto px-2">
                    <IconComponent
                      className="icon-lucide flex-shrink-0"
                      size={20}
                    />
                    <small
                      className="small sidebar-text"
                      style={{ fontSize: "14px", transition: "opacity 0.2s" }}
                    >
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
          to="/iaMoodle"
          className="text-decoration-none w-90"
          style={{ width: "85%" }} // deja un margen lateral bonito
          onClick={(e) => handleModuloSeleccionado("", e)}
        >
          <button
            className={`menu-item btn border-0 w-100 d-flex align-items-center justify-content-start ${
              location.pathname.includes("/iaMoodle") ? "active" : ""
            }`}
            style={{
              padding: "15px 10px",
              borderRadius: "var(--radius-md)",
              transition:
                "transform var(--transition-bounce), background-color var(--transition-smooth)",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.03)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <LucideActivity
              className="icon-lucide flex-shrink-0 me-0 me-md-2"
              size={20}
            />
            <small
              className="sidebar-text"
              style={{
                fontSize: "14px",
                textAlign: "left",
                color: "var(--text-main)",
                transition: "opacity 0.2s",
              }}
            >
              IA Moodle
            </small>
          </button>
        </Link>
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
              borderRadius: "var(--radius-md)",
              transition:
                "transform var(--transition-bounce), background-color var(--transition-smooth)",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.03)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Settings
              className="icon-lucide flex-shrink-0 me-0 me-md-2"
              size={20}
            />
            <small
              className="sidebar-text"
              style={{
                fontSize: "14px",
                textAlign: "left",
                color: "var(--text-main)",
                transition: "opacity 0.2s",
              }}
            >
              Ajustes
            </small>
          </button>
        </Link>
      </div>
    </div>
  );
}
