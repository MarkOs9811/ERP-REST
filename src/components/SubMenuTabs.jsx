import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useQuery } from "@tanstack/react-query";
import { GetConfi } from "../service/accionesConfiguracion/GetConfi";
import {
  hasModuleAccess,
  isModuleAvailableForBusiness,
  isPathAvailableForBusiness,
} from "../utils/modulePermissions";
import {
  LayoutGrid,
  Users,
  Wallet,
  Box,
  ShoppingCart,
  Truck,
  Building,
  Calendar,
  FileText,
  PieChart,
  Settings,
  Settings2,
  ChartArea,
  BikeIcon,
  GiftIcon,
  MessageCircleHeart,
  Calendar1Icon,
} from "lucide-react";

export const subMenuGroups = {
  "/rrhh": [
    { label: "Usuarios", path: "/rrhh", icon: <Users size={18} /> },
    { label: "Nómina", path: "/rrhh/nomina", icon: <Wallet size={18} /> },
    {
      label: "Ingreso P.",
      path: "/rrhh/ingreso-a-planilla",
      icon: <FileText size={18} />,
    },
    {
      label: "Asistencia",
      path: "/rrhh/asistencia",
      icon: <Calendar size={18} />,
    },
    {
      label: "Horas Extras",
      path: "/rrhh/horas-extras",
      icon: <Calendar size={18} />,
    },
    {
      label: "Adelantos",
      path: "/rrhh/adelanto-de-sueldo",
      icon: <Wallet size={18} />,
    },
    {
      label: "Vacaciones",
      path: "/rrhh/vacaciones",
      icon: <Calendar size={18} />,
    },
    {
      label: "Áreas y Cargos",
      path: "/rrhh/areas-y-cargos",
      icon: <Building size={18} />,
    },
    { label: "Reportes", path: "/rrhh/reportes", icon: <PieChart size={18} /> },
    { label: "Ajustes", path: "/rrhh/ajustes", icon: <Settings2 size={18} /> },
  ],
  "/platos": [
    { label: "Platos", path: "/platos", icon: <Box size={18} /> },
    { label: "Combos", path: "/platos/combos", icon: <Box size={18} /> },
    {
      label: "Categorias",
      path: "/platos/categorias",
      icon: <Box size={18} />,
    },
  ],
  "/clientes": [
    { label: "Dashboard", path: "/clientes", icon: <PieChart size={18} /> },
    {
      label: "Lista de Clientes",
      path: "/clientes/lista",
      icon: <Users size={18} />,
    },
    {
      label: "FeedBacks",
      path: "/clientes/comentarios",
      icon: <MessageCircleHeart size={18} />,
    },
    {
      label: "Fidelización",
      path: "/clientes/fidelizacion",
      icon: <GiftIcon size={18} />,
    },
  ],
  "/finanzas": [
    { label: "Informes Fin.", path: "/finanzas", icon: <PieChart size={18} /> },
    {
      label: "Presupuestos",
      path: "/finanzas/presupuestos",
      icon: <Wallet size={18} />,
    },
    {
      label: "Libro Diario",
      path: "/finanzas/libro-diario",
      icon: <FileText size={18} />,
    },
    {
      label: "Libro Mayor",
      path: "/finanzas/libro-mayor",
      icon: <FileText size={18} />,
    },
    {
      label: "Cx Cobrar",
      path: "/finanzas/cuentas-por-cobrar",
      icon: <Wallet size={18} />,
    },
    {
      label: "Cx Pagar",
      path: "/finanzas/cuentas-por-pagar",
      icon: <Wallet size={18} />,
    },
    {
      label: "Firmas",
      path: "/finanzas/firmar-solicitud",
      icon: <FileText size={18} />,
    },
    {
      label: "Reportes Fin.",
      path: "/finanzas/reportes-financieros",
      icon: <PieChart size={18} />,
    },
  ],
  "/almacen": [
    { label: "Almacenes", path: "/almacen", icon: <Building size={18} /> },
    { label: "Kardex", path: "/almacen/kardex", icon: <Box size={18} /> },
    {
      label: "Registro",
      path: "/almacen/registro",
      icon: <FileText size={18} />,
    },
    {
      label: "Compras",
      path: "/almacen/compras",
      icon: <ShoppingCart size={18} />,
    },
    {
      label: "Proveedores",
      path: "/almacen/proveedores",
      icon: <Truck size={18} />,
    },
    {
      label: "Transferencia",
      path: "/almacen/transferencia",
      icon: <Truck size={18} />,
    },
    {
      label: "Solicitud",
      path: "/almacen/solicitud",
      icon: <FileText size={18} />,
    },
    {
      label: "Reportes",
      path: "/almacen/reportes",
      icon: <PieChart size={18} />,
    },
    {
      label: "Ajustes",
      path: "/almacen/ajustes",
      icon: <Settings2 size={18} />,
    },
  ],
  "/ventas": [
    { label: "Dashboard", path: "/ventas", icon: <ChartArea size={18} /> },
    {
      label: "Mis Ventas",
      path: "/ventas/mis-ventas",
      icon: <ShoppingCart size={18} />,
    },
    {
      label: "Inventario",
      path: "/ventas/inventario",
      icon: <Box size={18} />,
    },
    { label: "Cajas", path: "/ventas/cajas", icon: <Wallet size={18} /> },
    {
      label: "Solicitud",
      path: "/ventas/solicitud",
      icon: <FileText size={18} />,
    },
    { label: "Mesas", path: "/ventas/mesas", icon: <Building size={18} /> },
    {
      label: "Reserva",
      path: "/ventas/reservasMesas",
      icon: <Calendar1Icon size={18} />,
    },
    {
      label: "Reportes",
      path: "/ventas/reportes",
      icon: <PieChart size={18} />,
    },
    {
      label: "Ajustes",
      path: "/ventas/ajustesVentas",
      icon: <Settings size={18} />,
    },
  ],
  "/delivery": [
    { label: "Despacho", path: "/delivery", icon: <Truck size={18} /> },
    {
      label: "Pedidos",
      path: "/delivery/pedidos",
      icon: <ShoppingCart size={18} />,
    },
    {
      label: "Asignados",
      path: "/delivery/pedidosAsignados",
      icon: <BikeIcon size={18} />,
    },
    {
      label: "Repartidores",
      path: "/delivery/repartidores",
      icon: <Users size={18} />,
    },
    {
      label: "Mis Envios",
      path: "/delivery/mis-entregas",
      icon: <ShoppingCart size={18} />,
    },
    {
      label: "Zonas y Tarifas",
      path: "/delivery/zonas-y-tarifas",
      icon: <Building size={18} />,
    },
    {
      label: "Promociones App",
      path: "/delivery/promociones-app",
      icon: <Box size={18} />,
    },
    {
      label: "Banners Eventos",
      path: "/delivery/banners",
      icon: <Box size={18} />,
    },
    {
      label: "Reportes",
      path: "/delivery/reportes",
      icon: <PieChart size={18} />,
    },
  ],
};

export function SubMenuTabs() {
  const location = useLocation();
  const { user } = useAuth();
  const currentPath = location.pathname;
  const { data: configurations = [] } = useQuery({
    queryKey: ["confiEmpresa"],
    queryFn: GetConfi,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const activeModule = Object.keys(subMenuGroups).find(
    (prefix) =>
      currentPath.startsWith(prefix) || `${currentPath}/` === `${prefix}/`,
  );

  if (!activeModule) return null;
  const moduleKey = {
    "/rrhh": "rrhh",
    "/platos": "platos",
    "/clientes": "clientes",
    "/finanzas": "finanzas",
    "/almacen": "almacen",
    "/ventas": "ventas",
    "/delivery": "delivery",
  }[activeModule];
  if (!isModuleAvailableForBusiness(moduleKey, configurations)) return null;
  if (!hasModuleAccess(user, moduleKey)) return null;

  const tabs = subMenuGroups[activeModule].filter((tab) => {
    return isPathAvailableForBusiness(tab.path, configurations);
  });
  const moduleName =
    {
      "/rrhh": "Recursos humanos",
      "/platos": "Productos",
      "/clientes": "Clientes",
      "/finanzas": "Finanzas",
      "/almacen": "Almacén",
      "/ventas": "Ventas",
      "/delivery": "Delivery",
    }[activeModule] || "Módulo";

  return (
    <nav aria-label="Submenú del módulo" className="w-full">
      <div className="mb-5 flex items-center gap-3 px-2 pt-1">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LayoutGrid size={17} strokeWidth={1.8} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight text-foreground">
            {moduleName}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Navegación
          </p>
        </div>
      </div>
      <ul className="flex w-full flex-col gap-1">
        {tabs.map((tab, idx) => {
          const isActive =
            currentPath === tab.path ||
            (`${currentPath}/` === `${tab.path}/` &&
              tab.path !== activeModule) ||
            (currentPath === activeModule && tab.path === activeModule);

          return (
            <li className="w-full" key={idx}>
              <Link
                to={tab.path}
                aria-current={isActive ? "page" : undefined}
                className={`group relative flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  isActive
                    ? "bg-primary/10 font-semibold text-primary ring-1 ring-inset ring-primary/10"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {isActive && (
                  <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-primary" />
                )}
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isActive
                      ? "bg-background text-primary shadow-sm ring-1 ring-primary/15"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {tab.icon}
                </span>
                <span className="truncate text-sm">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
