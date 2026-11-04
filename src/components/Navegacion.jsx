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

export function Navegacion({ tipoNavegacion = null }) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const navigate = useNavigate();

  const rolesLocalStorage =
    JSON.parse(
      localStorage.getItem("roles") || sessionStorage.getItem("roles"),
    ) || [];
  const userStr =
    localStorage.getItem("user") || sessionStorage.getItem("user");
  // VALIDAR VARIANTES DE LOS CARGOS PARA VALIDAR CADA OPCION DE BOTON

  const rol = userStr ? JSON.parse(userStr) : null;
  // 1. Obtenemos el nombre del cargo en minúsculas de forma segura
  const nombreCargo = rol?.empleado?.cargo?.nombre?.toLowerCase() || "";

  // 2. Definimos las raíces o palabras clave bloqueadas
  const palabrasBloqueadas = [
    // Variantes para Delivery
    "delivery",
    "repartid",
    "motorizad",
    "despachad",
    // Variantes para Cocina
    "cocin",
    "chef",
    // Variantes para Mozo
    "mozo",
    "moso",
    "meser",
    "camarer",
  ];

  // 3. Evaluamos si el cargo CONTIENE alguna de las palabras bloqueadas
  // Retorna TRUE si encuentra alguna coincidencia
  const esRolBloqueadoParaCaja = palabrasBloqueadas.some((palabra) =>
    nombreCargo.includes(palabra),
  );
  // =====================================

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

  // === BUSCADOR GLOBAL MINIMALISTA ===
  const searchOptions = Object.values(subMenuGroups)
    .flat()
    .map(({ label, path }) => ({ label, path }));
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

  const filteredSearch = searchOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
  // ===================================
  const { data: configEmpresa = [] } = useQuery({
    queryKey: ["confiEmpresa"],
    queryFn: GetConfi,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // 2. Filtramos la configuración
  const configTipoVenta = configEmpresa.find(
    (item) => item.nombre === "Tipo Venta",
  );

  const claveVenta = configTipoVenta?.clave;
  const esComida = claveVenta === "restaurante";
  const actionButtonClass =
    "inline-flex h-9 items-center justify-center gap-2 rounded-lg border-border bg-background px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3";

  return (
    <div className={`mb-3 w-full ${navegacionAnchura ? "px-3" : "px-0"}`}>
      <nav
        aria-label="Navegación de la página"
        className="flex min-h-[50px] w-full flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border/60 px-3 py-2 sm:px-4"
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
          {/* --- BUSCADOR MINIMALISTA --- */}
          <div className="relative hidden w-[220px] md:block" ref={searchRef}>
            <Search
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              aria-label="Buscar vista"
              className="h-9 w-full rounded-lg border-input bg-background pl-9 pr-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
              placeholder="Buscar vista..."
              value={searchTerm}
              aria-controls="navegacion-resultados-busqueda"
              aria-activedescendant={
                filteredSearch[activeSearchIndex]
                  ? `resultado-busqueda-${activeSearchIndex}`
                  : undefined
              }
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
            {showSearchDropdown && searchTerm.trim() !== "" && (
              <div className="absolute left-0 top-full z-50 mt-1 max-h-[250px] w-full overflow-y-auto rounded-lg border-border bg-popover py-1 text-popover-foreground shadow-md">
                <ul
                  id="navegacion-resultados-busqueda"
                  role="listbox"
                  className="m-0 list-none p-0"
                >
                  {filteredSearch.length > 0 ? (
                    filteredSearch.map((item, idx) => (
                      <li key={item.path}>
                        <Button
                          id={`resultado-busqueda-${idx}`}
                          type="button"
                          role="option"
                          aria-selected={idx === activeSearchIndex}
                          className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                            idx === activeSearchIndex
                              ? "bg-accent text-accent-foreground"
                              : "text-foreground hover:bg-accent/70"
                          }`}
                          onMouseEnter={() => setActiveSearchIndex(idx)}
                          onClick={() => selectSearchOption(item)}
                          variant="default"
                        >
                          {item.label}
                        </Button>
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2 text-center text-sm text-muted-foreground">
                      Sin resultados
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
          {/* 1. Asistencia */}
          <Button asChild className={actionButtonClass} variant="outline">
            <Link to="/marcarAsistencia" title="Asistencia">
              <UserRoundCheck size={17} />
              <span className="hidden sm:inline">Asistencia</span>
            </Link>
          </Button>
          {/* 2. Eventos */}
          {rolesLocalStorage.some((r) => r.nombre === "incidencias") && (
            <Button asChild className={actionButtonClass} variant="outline">
              <Link to="/incidencias" title="Eventos">
                <Megaphone size={17} />
                <span className="hidden sm:inline">Eventos</span>
              </Link>
            </Button>
          )}
          {/* PARA MIS ENTREGAS DEL DELIVERY CONDUCTOR */}
          {rolesLocalStorage.some((r) => r.nombre === "mis entregas") && (
            <Button asChild className={actionButtonClass} variant="outline">
              <Link to="/mis-entregas" title="Mis entregas">
                <Package size={17} />
                <span className="hidden sm:inline">Mis entregas</span>
              </Link>
            </Button>
          )}

          {/* 3. Pedidos Delivery (NUEVO - Solo visible para delivery y administradores) */}
          {["delivery", "conductor", "administrador"].includes(
            rol?.empleado?.cargo?.nombre,
          ) && (
            <Button asChild className={actionButtonClass} variant="outline">
              <Link to="/pedidosDelivery" title="Pedidos delivery">
                <BikeIcon size={17} />
                <span className="hidden sm:inline">Pedidos</span>
              </Link>
            </Button>
          )}
          {/* 4. POS (Oculto estrictamente para roles que no abren caja usando palabras clave) */}
          {!esRolBloqueadoParaCaja && (
            <Button
              asChild
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg px-2.5 text-sm font-medium shadow-sm sm:px-3"
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
          {["cocinero", "administrador"].includes(
            rol?.empleado?.cargo?.nombre,
          ) && (
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
