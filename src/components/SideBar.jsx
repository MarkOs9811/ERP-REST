import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { subMenuClick } from "../redux/subMenuSlice";
import "../css/EstilosSideBar.css";
import {
  Building2,
  Calendar,
  Hamburger,
  Home,
  Megaphone,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Truck,
  UserRoundCheckIcon,
  Warehouse,
  UsersRoundIcon,
  BikeIcon,
  X,
  PackageCheckIcon,
  Landmark,
  UserRoundCogIcon,
} from "lucide-react";
import { capitalizeFirstLetter } from "../hooks/FirstLetterUp";
import { useEffect } from "react";
import { toggleSidebarMobile } from "../redux/sideBarMobilSlice";
import { setSidebarCompressed } from "../redux/sideBarSlice";

export function SideBar() {
  // OBTENEMOS AMBOS ESTADOS DE REDUX
  const isCompressedMobile = useSelector(
    (state) => state.sidebarMobile.isCompressedMobile,
  );
  const isCompressed = useSelector((state) => state.sidebar.isCompressed);

  const location = useLocation();
  const dispatch = useDispatch();

  const empresaString =
    localStorage.getItem("empresa") || sessionStorage.getItem("empresa");
  const miEmpresa = empresaString ? JSON.parse(empresaString) : {};
  const fotoEmpresa = miEmpresa.logo_url;

  const rolesString =
    localStorage.getItem("roles") || sessionStorage.getItem("roles");
  const roles = rolesString ? JSON.parse(rolesString) : [];

  const icons = {
    inicio: Home,
    usuarios: UsersRoundIcon,
    ventas: ShoppingBag,
    incidenciasempleado: Home,
    incidencias: Megaphone,
    almacen: Warehouse,
    vender: ShoppingCart,
    proveedores: Truck,
    compras: Calendar,
    platos: Hamburger,
    clientes: UserRoundCheckIcon,
    rrhh: UserRoundCogIcon,
    finanzas: Landmark,
    "areas-y-cargos": Building2,
    configuracion: Settings,
    "mis-entregas": PackageCheckIcon,
    delivery: BikeIcon,
  };

  const customOrder = [
    "ventas",
    "delivery",
    "mis-entregas",
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
    "clientes",
  ];

  const getIconForRole = (roleName) => {
    const roleKey = roleName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/\./g, "-")
      .trim();
    return icons[roleKey] || Home;
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

  useEffect(() => {
    const storageData = localStorage.getItem("estiloEmpresa");
    if (storageData) {
      const parsedData = JSON.parse(storageData);
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        const estiloObj = parsedData[0];
        if (estiloObj.clave)
          document.documentElement.style.setProperty(
            "--color-brand",
            estiloObj.clave,
          );
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
      className={`sidebar sidebar-compressed 
      ${isCompressedMobile && isCompressed ? "sidebar-mobile-active" : "sidebar-mobile-hidden"}`}
    >
      {/* CORRECCIÓN: Separamos la imagen de la clase que se oculta y centramos el contenido */}
      <div className="sidebar-header my-3 position-relative d-flex align-items-center justify-content-center">
        <div className="d-flex align-items-center gap-2">
          {fotoEmpresa && (
            <img
              src={fotoEmpresa}
              alt="logo empresa"
              className="img-fluid"
              style={{
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          )}
          <p
            className="h6 fw-bold p-0 m-0 text-truncate sidebar-text"
            style={{ color: "var(--text-main)", maxWidth: "120px" }}
          >
            {miEmpresa.nombre}
          </p>
        </div>

        {/* El botón de cerrar móvil ahora es absoluto para no romper el centrado */}
        <button
          className={`d-md-none btn-close-sudeBar-mobile shadow-sm position-absolute`}
          style={{ right: "15px" }}
          onClick={() => dispatch(toggleSidebarMobile())}
        >
          <X size={18} />
        </button>
      </div>

      <div className="sidebar-menu my-2 ">
        <ul className="menu-list h-100">
          <Link
            to={"/"}
            className="link-opcion text-decoration-none"
            title="Inicio"
            onClick={(e) => {
              handleModuloSeleccionado("accesos rapido", e);
              dispatch(setSidebarCompressed(true));
            }}
          >
            <li
              className={`menu-item  ${location.pathname === `/` ? "active" : ""}`}
            >
              <div className="d-flex w-100 gap-2 align-items-center justify-content-md-start m-auto px-2">
                <Home className="icon-lucide flex-shrink-0" size={25} />
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
            const ocultos = [
              "vender",
              "incidencias",
              "usuarios",
              "compras",
              "proveedores",
              "areas y cargos",
              "mis entregas",
              "cocina",
            ];
            if (ocultos.includes(roleName)) return null;

            const isActive = location.pathname.includes(`/${roleUrl}`);
            const IconComponent = getIconForRole(role.nombre);

            return (
              <div key={role.id}>
                <Link
                  to={`/${roleUrl}`}
                  className="link-opcion text-decoration-none"
                  title={role.nombre}
                  onClick={(e) => {
                    handleModuloSeleccionado(roleUrl, e);
                    dispatch(setSidebarCompressed(false));
                  }}
                >
                  <li className={`menu-item  ${isActive ? "active" : ""}`}>
                    <div className="d-flex w-100 gap-2 align-items-center justify-content-md-start m-auto px-2">
                      <IconComponent
                        className="icon-lucide flex-shrink-0"
                        size={25}
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
              </div>
            );
          })}
        </ul>
      </div>

      <div
        className="menu-footer d-flex flex-column align-items-center w-100"
        style={{ margin: "15px 0" }}
      >
        <Link
          to="/configuracion/general"
          className="link-opcion text-decoration-none w-100"
          onClick={(e) => handleModuloSeleccionado("", e)}
        >
          <li
            className={`menu-item ${location.pathname.includes("/configuracion") ? "active" : ""}`}
            onClick={() => dispatch(setSidebarCompressed(true))}
            style={{ listStyle: "none" }}
          >
            <div className="d-flex w-100 gap-2 align-items-center justify-content-md-start m-auto px-2">
              <Settings className="icon-lucide flex-shrink-0" size={25} />
              <small
                className="small sidebar-text"
                style={{ fontSize: "14px", transition: "opacity 0.2s" }}
              >
                Ajustes
              </small>
            </div>
          </li>
        </Link>
      </div>
    </div>
  );
}
