import { Link, useLocation } from "react-router-dom";
import {
  Users,
  Wallet,
  Box,
  ShoppingCart,
  Truck,
  Building,
  Calendar, // For absences/vacations
  FileText,
  PieChart,
  Settings,
  Settings2,
  ChartArea,
  BikeIcon,
} from "lucide-react";

const subMenuGroups = {
  "/rrhh": [
    { label: "Usuarios", path: "/rrhh", icon: <Users size={16} /> },
    { label: "Nómina", path: "/rrhh/nomina", icon: <Wallet size={16} /> },
    {
      label: "Ingreso P.",
      path: "/rrhh/ingreso-a-planilla",
      icon: <FileText size={16} />,
    },
    {
      label: "Asistencia",
      path: "/rrhh/asistencia",
      icon: <Calendar size={16} />,
    },
    {
      label: "Horas Extras",
      path: "/rrhh/horas-extras",
      icon: <Calendar size={16} />,
    },
    {
      label: "Adelantos",
      path: "/rrhh/adelanto-de-sueldo",
      icon: <Wallet size={16} />,
    },
    {
      label: "Vacaciones",
      path: "/rrhh/vacaciones",
      icon: <Calendar size={16} />,
    },

    {
      label: "Áreas y Cargos",
      path: "/rrhh/areas-y-cargos",
      icon: <Building size={16} />,
    },
    { label: "Reportes", path: "/rrhh/reportes", icon: <PieChart size={16} /> },
    { label: "Ajustes", path: "/rrhh/ajustes", icon: <Settings2 size={16} /> },
  ],
  "/finanzas": [
    {
      label: "Informes Fin.",
      path: "/finanzas/informes-financieros",
      icon: <PieChart size={16} />,
    },
    {
      label: "Presupuestos",
      path: "/finanzas/presupuestos",
      icon: <Wallet size={16} />,
    },
    {
      label: "Libro Diario",
      path: "/finanzas/libro-diario",
      icon: <FileText size={16} />,
    },
    {
      label: "Libro Mayor",
      path: "/finanzas/libro-mayor",
      icon: <FileText size={16} />,
    },
    {
      label: "Cx Cobrar",
      path: "/finanzas/cuentas-por-cobrar",
      icon: <Wallet size={16} />,
    },
    {
      label: "Cx Pagar",
      path: "/finanzas/cuentas-por-pagar",
      icon: <Wallet size={16} />,
    },
    {
      label: "Firmas",
      path: "/finanzas/firmar-solicitud",
      icon: <FileText size={16} />,
    },
    {
      label: "Reportes Fin.",
      path: "/finanzas/reportes-financieros",
      icon: <PieChart size={16} />,
    },
  ],
  "/almacen": [
    { label: "Almacenes", path: "/almacen", icon: <Building size={16} /> },
    { label: "Kardex", path: "/almacen/kardex", icon: <Box size={16} /> },
    {
      label: "Registro",
      path: "/almacen/registro",
      icon: <FileText size={16} />,
    },
    {
      label: "Compras",
      path: "/almacen/compras",
      icon: <ShoppingCart size={16} />,
    },
    {
      label: "Proveedores",
      path: "/almacen/proveedores",
      icon: <Truck size={16} />,
    },

    {
      label: "Transferencia",
      path: "/almacen/transferencia",
      icon: <Truck size={16} />,
    },
    {
      label: "Solicitud",
      path: "/almacen/solicitud",
      icon: <FileText size={16} />,
    },
    {
      label: "Reportes",
      path: "/almacen/reportes",
      icon: <PieChart size={16} />,
    },
    {
      label: "Ajustes",
      path: "/almacen/ajustes",
      icon: <Settings2 size={16} />,
    },
  ],
  "/ventas": [
    { label: "Dashboard", path: "/ventas", icon: <ChartArea size={16} /> },
    {
      label: "Mis Ventas",
      path: "/ventas/mis-ventas",
      icon: <ShoppingCart size={16} />,
    },
    {
      label: "Inventario",
      path: "/ventas/inventario",
      icon: <Box size={16} />,
    },

    { label: "Cajas", path: "/ventas/cajas", icon: <Wallet size={16} /> },
    {
      label: "Solicitud",
      path: "/ventas/solicitud",
      icon: <FileText size={16} />,
    },
    { label: "Mesas", path: "/ventas/mesas", icon: <Building size={16} /> },
    {
      label: "Reportes",
      path: "/ventas/reportes",
      icon: <PieChart size={16} />,
    },
    {
      label: "Ajustes",
      path: "/ventas/ajustesVentas",
      icon: <Settings size={16} />,
    },
  ],
  "/delivery": [
    { label: "Despacho", path: "/delivery", icon: <Truck size={16} /> },
    {
      label: "Pedidos",
      path: "/delivery/pedidos",
      icon: <ShoppingCart size={16} />,
    },
    {
      label: "Asignados",
      path: "/delivery/pedidosAsignados",
      icon: <BikeIcon size={16} />,
    },
    {
      label: "Repartidores",
      path: "/delivery/repartidores",
      icon: <Users size={16} />,
    },
    {
      label: "Zonas y Tarifas",
      path: "/delivery/zonas-y-tarifas",
      icon: <Building size={16} />,
    },
    {
      label: "Promociones App",
      path: "/delivery/promociones-app",
      icon: <Box size={16} />,
    },
    {
      label: "Reportes",
      path: "/delivery/reportes",
      icon: <PieChart size={16} />,
    },
  ],
};

export function SubMenuTabs() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Determinar en qué "módulo principal" estamos basándonos en la ruta actual
  const activeModule = Object.keys(subMenuGroups).find(
    (prefix) =>
      currentPath.startsWith(prefix) || `${currentPath}/` === `${prefix}/`,
  );

  if (!activeModule) return null;

  const tabs = subMenuGroups[activeModule];

  return (
    <div
      className="submenu-tabs-container px-4  pb-0  mb-4 w-100  p-3"
      style={{ marginTop: "-10px" }}
    >
      <ul className="nav nav-tabs border-0 " style={{ gap: "4px" }}>
        {tabs.map((tab, idx) => {
          // Ajuste fino para la ruta base ("/" de cada módulo)
          // Se considera activo si el currentPath corresponde exactamente, o si es la base
          const isActive =
            currentPath === tab.path ||
            (`${currentPath}/` === `${tab.path}/` &&
              tab.path !== activeModule) ||
            (currentPath === activeModule && tab.path === activeModule);

          return (
            <li className="nav-item" key={idx}>
              <Link
                to={tab.path}
                className={`nav-link submenu-tab-link d-flex align-items-center gap-2 ${
                  isActive
                    ? "active border-bottom-0 fw-bold"
                    : "text-muted border-0"
                }`}
              >
                {tab.icon}
                <span
                  className="d-none d-md-inline"
                  style={{ fontSize: "14px" }}
                >
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
