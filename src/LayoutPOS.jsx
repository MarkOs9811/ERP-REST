import { Link, useLocation } from "react-router-dom";
import {
  Bike,
  ChefHat,
  Clock3,
  HandPlatter,
  Inbox,
  LockKeyhole,
  LogOut,
  ShoppingCart,
  Store,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { fetchCajaClose } from "./pages/modulosVender/CerrarCaja";
import { GetConfi } from "./service/accionesConfiguracion/GetConfi";
import { HoraLive } from "./utils/HoraLive";
import { isRestaurantBusiness } from "./utils/modulePermissions";
import { Button } from "./components/ui/button";

export default function LayoutPOS({ children }) {
  const location = useLocation();
  const caja = useSelector((state) => state.caja.caja);

  const cargo =
    JSON.parse(
      localStorage.getItem("user") || sessionStorage.getItem("user"),
    ) || {};

  const cajaDatos = JSON.parse(
    localStorage.getItem("caja") || sessionStorage.getItem("caja"),
  );
  const empresaString =
    localStorage.getItem("empresa") || sessionStorage.getItem("empresa");
  const miEmpresa = empresaString ? JSON.parse(empresaString) : {};
  const cargoNombre = cargo?.empleado?.cargo?.nombre;

  const { data: configEmpresa = [] } = useQuery({
    queryKey: ["confiEmpresa"],
    queryFn: GetConfi,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const esComida = isRestaurantBusiness(configEmpresa);

  const { data: cajaData } = useQuery({
    queryKey: ["cajaClose", cajaDatos?.id],
    queryFn: () => fetchCajaClose(cajaDatos?.id),
    enabled: !!cajaDatos?.id,
  });

  const puedeAtender = ["atencion al cliente", "administrador"].includes(
    cargoNombre,
  );
  const navigation = [
    esComida &&
      puedeAtender && {
        to: "/vender/mesas",
        label: "Mesas",
        icon: HandPlatter,
      },
    puedeAtender && {
      to: "/vender/ventasLlevar",
      label: esComida ? "Para llevar" : "Ventas",
      icon: esComida ? Inbox : ShoppingCart,
    },
    esComida &&
      ["cocinero", "administrador"].includes(cargoNombre) && {
        to: "/vender/cocina",
        label: "Cocina",
        icon: ChefHat,
      },
    esComida &&
      puedeAtender && {
        to: "/vender/pedidosWeb",
        label: "Delivery",
        icon: Bike,
      },
  ].filter(Boolean);

  const nombreCajero = [
    cajaData?.datosRegistroCaja?.usuario?.empleado?.persona?.nombre,
    cajaData?.datosRegistroCaja?.usuario?.empleado?.persona?.apellidos,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex h-dvh min-h-[480px] w-full flex-col overflow-hidden bg-muted/30 text-foreground">
      <header className="relative z-20 shrink-0 border-b border-border/70 bg-background/95 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/85">
        <div className="mx-auto flex min-h-16 w-full max-w-[1920px] flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2 sm:px-5 lg:flex-nowrap lg:px-6">
          <div className="flex min-w-0 items-center gap-3 lg:w-56 lg:shrink-0">
            {miEmpresa.logo_url ? (
              <img
                src={miEmpresa.logo_url}
                alt=""
                className="size-9 shrink-0 rounded-xl border border-border/70 bg-muted object-cover"
              />
            ) : (
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                <Store className="size-5" />
              </span>
            )}
            <span className="truncate text-sm font-semibold tracking-tight">
              {miEmpresa.nombre || "Punto de venta"}
            </span>
          </div>

          <nav
            aria-label="Navegación de ventas"
            className="-mx-1 flex min-w-0 flex-1 items-center gap-1 overflow-x-auto px-1 pb-0.5 lg:mx-0"
          >
            {navigation.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Button
                  key={to}
                  asChild
                  size="default"
                  variant={isActive ? "secondary" : "ghost"}
                  className={`shrink-0 gap-2 rounded-lg px-3 ${
                    isActive
                      ? "bg-secondary text-secondary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Link
                    to={to}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="size-4" strokeWidth={1.8} />
                    {label}
                  </Link>
                </Button>
              );
            })}
          </nav>

          <div className="flex w-full flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-2 sm:justify-end lg:w-auto lg:shrink-0 lg:border-0 lg:pt-0">
            <div className="flex min-w-0 items-center gap-2 text-xs">
              <span className="hidden items-center gap-1.5 text-muted-foreground xl:inline-flex">
                <Clock3 className="size-3.5" />
                <HoraLive />
              </span>
              <span className="hidden h-5 w-px bg-border xl:block" />
              <span className="text-muted-foreground">Caja</span>
              <span className="max-w-28 truncate rounded-md border border-border/70 bg-muted/60 px-2 py-1 font-medium text-foreground">
                {cajaDatos?.nombre ||
                  caja?.nombre ||
                  `CAJA ${cajaDatos?.id || ""}`}
              </span>
              {nombreCajero && (
                <>
                  <span className="hidden h-5 w-px bg-border sm:block" />
                  <span className="hidden max-w-36 truncate text-muted-foreground sm:inline">
                    {nombreCajero}
                  </span>
                </>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              {puedeAtender && caja?.estado === "abierto" && (
                <Button asChild size="sm" variant="outline" className="gap-2 border-border/70">
                  <Link to="/vender/cerrarCaja">
                    <LockKeyhole className="size-3.5" strokeWidth={1.8} />
                    <span className="hidden sm:inline">Cerrar caja</span>
                  </Link>
                </Button>
              )}
              <Button asChild size="sm" variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                <Link to="/">
                  <LogOut className="size-3.5" strokeWidth={1.8} />
                  Salir
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-muted/30 p-3 sm:p-4">
        <div className="mx-auto h-full min-h-0 w-full max-w-[1920px]">{children}</div>
      </main>
    </div>
  );
}
