import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CookingPotIcon,
  Megaphone,
  StoreIcon,
  UserRoundCheck,
  BikeIcon,
  Search,
  Package,
  ChevronRight,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetConfi } from "../service/accionesConfiguracion/GetConfi";
import { subMenuGroups } from "./SubMenuTabs";
import { Button } from "./ui/button";
import { useAuth } from "../AuthContext";
import {
  hasModuleAccess,
  isRestaurantBusiness,
  isPathAvailableForBusiness,
} from "../utils/modulePermissions";
import { Input } from "./ui/input";

export function Navegacion({ tipoNavegacion = null }) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const navigate = useNavigate();
  const { user: rol } = useAuth();
  
  const nombreCargo = rol?.empleado?.cargo?.nombre?.toLowerCase() || "";

  const palabrasBloqueadas = [
    "delivery",
    "repartid",
    "motorizad",
    "despachad",
    "cocin",
    "chef",
    "mozo",
    "moso",
    "meser",
    "camarer",
  ];

  const esRolBloqueadoParaCaja = palabrasBloqueadas.some((palabra) =>
    nombreCargo.includes(palabra),
  );

  const navegacionAnchura = tipoNavegacion;
  const routeNames = {
    "": "Inicio",
    productos: "Productos",
    registro: "Registro",
    transferencia: "Transferencia",
    solicitud: "Solicitud",
    movimientos: "Movimientos",
    kardex: "Kardex",
    reportes: "Reportes",
    ajustes: "Ajustes",
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [activeSearchIndex, setActiveSearchIndex] = useState(0);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectSearchOption = (option) => {
    if (!option) return;
    navigate(option.path);
    setSearchTerm("");
    setActiveSearchIndex(0);
    setShowSearchDropdown(false);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Escape") {
      setShowSearchDropdown(false);
      return;
    }

    if (!showSearchDropdown || filteredSearch.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveSearchIndex((currentIndex) =>
        currentIndex === filteredSearch.length - 1 ? 0 : currentIndex + 1,
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSearchIndex((currentIndex) =>
        currentIndex === 0 ? filteredSearch.length - 1 : currentIndex - 1,
      );
    }

    if (event.key === "Enter") {
      event.preventDefault();
      selectSearchOption(filteredSearch[activeSearchIndex]);
    }
  };

  const { data: configEmpresa = [] } = useQuery({
    queryKey: ["confiEmpresa"],
    queryFn: GetConfi,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const esComida = isRestaurantBusiness(configEmpresa);
  const modulesByPath = {
    rrhh: "rrhh",
    platos: "platos",
    clientes: "clientes",
    finanzas: "finanzas",
    almacen: "almacen",
    ventas: "ventas",
    delivery: "delivery",
  };

  const searchOptions = Object.values(subMenuGroups)
    .flat()
    .filter(({ path }) => {
      const moduleName = modulesByPath[path.split("/")[1]];
      return (
        Boolean(moduleName) &&
        isPathAvailableForBusiness(path, configEmpresa) &&
        hasModuleAccess(rol, moduleName)
      );
    })
    .map(({ label, path }) => ({ label, path }));

  const filteredSearch = searchOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const actionButtonClass =
    "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-background px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:px-3";

  return (
    <div className={`w-full ${navegacionAnchura ? "px-3" : "px-0"}`}>
      <nav
        aria-label="Navegación de la página"
        className="flex min-h-12.5 w-full flex-wrap items-center justify-between gap-x-4 gap-y-2 border-border/60 bg-transparent px-3 py-2 sm:px-4"
      >
        <div className="flex min-w-0 items-center">
          {/* Breadcrumbs */}
          <div className="flex min-w-0 flex-wrap items-center gap-1.5 text-sm">
            {pathnames.length === 0 ? (
              <span className="font-medium text-foreground">
                {routeNames[""]}
              </span>
            ) : (
              <>
                <Link
                  to="/"
                  className="font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {routeNames[""]}
                </Link>
                {pathnames.map((pathname, index) => {
                  const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                  const isLast = index === pathnames.length - 1;
                  return (
                    <span
                      key={to}
                      className="flex min-w-0 items-center gap-1.5"
                    >
                      <ChevronRight
                        size={14}
                        aria-hidden="true"
                        className="shrink-0 text-muted-foreground/60"
                      />
                      {isLast ? (
                        <span className="truncate font-medium text-foreground">
                          {routeNames[pathname] || pathname}
                        </span>
                      ) : (
                        <Link
                          to={to}
                          className="truncate font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {routeNames[pathname] || pathname}
                        </Link>
                      )}
                    </span>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* --- CONTENEDOR DERECHO (Buscador + Acciones) --- */}
        <div className="ml-auto flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
          
          {/* --- BUSCADOR MINIMALISTA MODERNIZADO --- */}
          <div className="relative hidden w-64 md:block" ref={searchRef}>
            <Search
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="text"
              aria-label="Buscar vista"
              className="h-9 w-full rounded-md border-input bg-background/60 pl-9 pr-3 text-sm text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground hover:bg-background focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Buscar vista..."
              value={searchTerm}
              aria-controls="navegacion-resultados-busqueda"
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setActiveSearchIndex(0);
                setShowSearchDropdown(true);
              }}
              onFocus={() => {
                setActiveSearchIndex(0);
                setShowSearchDropdown(true);
              }}
              onKeyDown={handleSearchKeyDown}
            />
            
            {/* DROPDOWN FLUIDO */}
            {showSearchDropdown && searchTerm.trim() !== "" && (
              <div className="absolute left-0 top-full z-50 mt-1.5 w-full overflow-hidden rounded-md border border-border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95">
                <div className="max-h-[260px] overflow-y-auto p-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50 [&::-webkit-scrollbar-track]:bg-transparent">
                  <ul
                    id="navegacion-resultados-busqueda"
                    role="listbox"
                    className="flex flex-col gap-0.5 m-0 list-none p-0"
                  >
                    {filteredSearch.length > 0 ? (
                      filteredSearch.map((item, idx) => (
                        <li key={item.path}>
                          <button
                            id={`resultado-busqueda-${idx}`}
                            type="button"
                            role="option"
                            aria-selected={idx === activeSearchIndex}
                            className={`flex w-full items-center rounded-sm px-2.5 py-1.5 text-left text-sm outline-none transition-colors ${
                              idx === activeSearchIndex
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                            }`}
                            onMouseEnter={() => setActiveSearchIndex(idx)}
                            onClick={() => selectSearchOption(item)}
                          >
                            <Search size={14} className="mr-2 opacity-50 shrink-0" />
                            <span className="truncate">{item.label}</span>
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="px-3 py-4 text-center text-sm text-muted-foreground">
                        No se encontraron resultados
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* 1. Asistencia */}
          {hasModuleAccess(rol, "rrhh") && (
            <Button asChild className={actionButtonClass} variant="outline">
              <Link to="/marcarAsistencia" title="Asistencia">
                <UserRoundCheck size={17} />
                <span className="hidden sm:inline">Asistencia</span>
              </Link>
            </Button>
          )}
          {/* 2. Eventos */}
          {hasModuleAccess(rol, "incidencias") && (
            <Button asChild className={actionButtonClass} variant="outline">
              <Link to="/incidencias" title="Eventos">
                <Megaphone size={17} />
                <span className="hidden sm:inline">Eventos</span>
              </Link>
            </Button>
          )}
          {/* PARA MIS ENTREGAS DEL DELIVERY CONDUCTOR */}
          {hasModuleAccess(rol, "mis-entregas") && (
            <Button asChild className={actionButtonClass} variant="outline">
              <Link to="/mis-entregas" title="Mis entregas">
                <Package size={17} />
                <span className="hidden sm:inline">Mis entregas</span>
              </Link>
            </Button>
          )}

          {/* 3. Pedidos Delivery */}
          {hasModuleAccess(rol, "delivery") && (
            <Button asChild className={actionButtonClass} variant="outline">
              <Link to="/pedidosDelivery" title="Pedidos delivery">
                <BikeIcon size={17} />
                <span className="hidden sm:inline">Pedidos</span>
              </Link>
            </Button>
          )}
          {/* 4. POS */}
          {hasModuleAccess(rol, "ventas") && !esRolBloqueadoParaCaja && (
            <Button
              asChild
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg px-2.5 text-sm font-medium shadow-sm sm:px-3 transition-transform active:scale-95"
            >
              <Link
                to={esComida ? "/vender/mesas" : "/vender/ventasLlevar"}
                title="Abrir ventas"
              >
                <StoreIcon size={17} />
                <span className="hidden sm:inline">Vender</span>
              </Link>
            </Button>
          )}
          {/* 5. Cocina */}
          {esComida && hasModuleAccess(rol, "cocina") && (
            <Button asChild className={actionButtonClass} variant="outline">
              <Link to="/cocina" title="Cocina">
                <CookingPotIcon size={17} />
                <span className="hidden sm:inline">Cocina</span>
              </Link>
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
}