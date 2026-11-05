import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { subMenuClick } from "../redux/subMenuSlice";
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
  ArrowLeft,
  X,
  PackageCheckIcon,
  Landmark,
  UserRoundCogIcon,
} from "lucide-react";
import { useEffect } from "react";
import { toggleSidebarMobile } from "../redux/sideBarMobilSlice";
import { setSidebarCompressed } from "../redux/sideBarSlice";
import { SubMenuTabs } from "./SubMenuTabs";
import { Button } from "./ui/button";
import { useAuth } from "../AuthContext";
import { useQuery } from "@tanstack/react-query";
import { GetConfi } from "../service/accionesConfiguracion/GetConfi";
import {
  getUserModuleNames,
  isModuleAvailableForBusiness,
  normalizeModuleName,
} from "../utils/modulePermissions";

export function SideBar() {
  const { user } = useAuth();
  const isCompressedMobile = useSelector(
    (state) => state.sidebarMobile.isCompressedMobile,
  );
  // Controla si el panel SECUNDARIO (Submódulos) se muestra o no
  const isCompressed = useSelector((state) => state.sidebar.isCompressed);

  const location = useLocation();
  const dispatch = useDispatch();

  const empresaString =
    localStorage.getItem("empresa") || sessionStorage.getItem("empresa");
  const miEmpresa = empresaString ? JSON.parse(empresaString) : {};
  const fotoEmpresa = miEmpresa.logo_url;

  const roles = Array.isArray(user?.roles) ? user.roles : [];
  const { data: configurations = [] } = useQuery({
    queryKey: ["confiEmpresa"],
    queryFn: GetConfi,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const enabledRoleNames = new Set(getUserModuleNames(user));

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
    "rrhh",
    "areas-y-cargos",
    "configuracion",
    "clientes",
  ];

  const getIconForRole = (roleName) => {
    const roleKey =
      {
        "recursos humanos": "rrhh",
        "rr hh": "rrhh",
      }[normalizeModuleName(roleName)] ??
      roleName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/\./g, "-")
        .trim();
    return icons[roleKey] || Home;
  };

  const formatRoleToUrl = (roleName) => {
    const normalizedName = normalizeModuleName(roleName);
    return (
      {
        "recursos humanos": "rrhh",
        "rr hh": "rrhh",
      }[normalizedName] ??
      roleName.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "-")
    );
  };

  const visibleRoles = roles
    .map((role) => ({
      role,
      name: typeof role === "string" ? role : role?.nombre ?? role?.name ?? "",
    }))
    .filter(({ name }) => {
      const normalizedName = normalizeModuleName(name);
      return (
        isModuleAvailableForBusiness(normalizedName, configurations) &&
        enabledRoleNames.has(normalizedName)
      );
    });
  const orderedRoles = [...visibleRoles].sort((a, b) => {
    const indexA = customOrder.indexOf(a.name.toLowerCase());
    const indexB = customOrder.indexOf(b.name.toLowerCase());
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
      const colorHex =
        Array.isArray(parsedData) && parsedData.length > 0
          ? parsedData[0].clave
          : parsedData.clave;

      if (colorHex) {
        document.documentElement.style.setProperty("--color-brand", colorHex);
      }
    }
  }, []);

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen shrink-0 md:sticky md:top-0 transition-transform duration-300 ease-in-out ${isCompressedMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
    >
      {/*
        NIVEL 1: BARRA PRINCIPAL (Siempre visible, solo iconos)
      */}
      <div className="z-20 flex h-full w-[72px] shrink-0 flex-col items-center border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        {/* Header: Logo Empresa */}
        <div className="flex h-16 w-full shrink-0 items-center justify-center">
          {fotoEmpresa && (
            <img
              src={fotoEmpresa}
              alt="logo empresa"
              className="size-10 rounded-xl object-cover ring-1 ring-sidebar-border"
            />
          )}
          {!fotoEmpresa && (
            <div
              aria-label="Logo de la empresa"
              className="flex size-10 items-center justify-center rounded-xl bg-primary text-xs font-bold tracking-wide text-primary-foreground"
            >
              ERP
            </div>
          )}
        </div>

        {/* Navegación de Iconos */}
        <nav
          aria-label="Navegación principal"
          className="mt-4 flex w-full flex-1 flex-col items-center gap-2 overflow-y-auto px-2 py-2 custom-scrollbar"
        >
          <Link
            to={"/"}
            title="Inicio"
            aria-label="Inicio"
            aria-current={location.pathname === "/" ? "page" : undefined}
            onClick={(e) => {
              handleModuloSeleccionado("accesos rapido", e);
              dispatch(setSidebarCompressed(true));
            }}
            className={`flex size-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              location.pathname === `/`
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <Home size={22} strokeWidth={location.pathname === `/` ? 2.5 : 2} />
          </Link>

          {orderedRoles.map(({ role, name: roleDisplayName }, index) => {
            const roleName = roleDisplayName.toLowerCase();
            const roleUrl = formatRoleToUrl(roleDisplayName);
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
            const IconComponent = getIconForRole(roleDisplayName);

            return (
              <Link
                key={role?.id ?? roleUrl ?? index}
                to={`/${roleUrl}`}
                title={roleDisplayName}
                aria-label={roleDisplayName}
                aria-current={isActive ? "page" : undefined}
                onClick={(e) => {
                  handleModuloSeleccionado(roleUrl, e);
                  dispatch(setSidebarCompressed(false)); // Despliega el Nivel 2
                }}
                className={`flex size-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <IconComponent size={22} strokeWidth={isActive ? 2.5 : 2} />
              </Link>
            );
          })}
        </nav>

        {/* Footer: Ajustes */}
        <div className="mb-3 mt-auto w-full border-t border-sidebar-border px-2 pt-3">
          <Link
            to="/configuracion/general"
            title="Ajustes"
            aria-label="Ajustes"
            aria-current={
              location.pathname.includes("/configuracion") ? "page" : undefined
            }
            onClick={(e) => {
              handleModuloSeleccionado("", e);
              dispatch(setSidebarCompressed(true));
            }}
            className={`mx-auto flex size-11 items-center justify-center rounded-2xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              location.pathname.includes("/configuracion")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <Settings
              size={22}
              strokeWidth={
                location.pathname.includes("/configuracion") ? 2.5 : 2
              }
            />
          </Link>
        </div>
      </div>

      {/*
        NIVEL 2: PANEL DE SUBMÓDULOS (Desplazable y empuja contenido)
      */}
      <div
        className={`relative z-10 flex h-full shrink-0 flex-col overflow-hidden border-r border-border/70 bg-[var(--submenu-background)] text-foreground transition-[width,opacity] duration-300 ease-in-out md:hidden ${!isCompressed ? "w-64 opacity-100" : "w-0 opacity-0"}`}
      >
        <div className="relative z-10 flex h-16 w-64 shrink-0 items-center justify-end gap-1 border-b border-border/70 bg-[var(--submenu-background)] px-3">
          <Button
            type="button"
            aria-label="Volver a los módulos"
            className="flex h-9 items-center gap-2 rounded-lg px-2 text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => dispatch(setSidebarCompressed(true))}
            title="Volver a los módulos"
            variant="ghost"
          >
            <ArrowLeft size={15} />
            Volver
          </Button>

          <Button
            type="button"
            aria-label="Cerrar menú"
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => dispatch(toggleSidebarMobile())}
            variant="ghost"
          >
            <X size={18} />
          </Button>
        </div>

        {/* CONTENEDOR DEL SUBMENÚ */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -left-20 size-56 rounded-full bg-emerald-300/25 blur-3xl dark:bg-teal-400/15"
        />
        <div className="relative z-10 w-64 flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
          <SubMenuTabs />
        </div>
      </div>
    </aside>
  );
}
