import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/NavegacionEstilos.css";

import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../redux/sideBarSlice";
import {
  CookingPotIcon,
  Megaphone,
  StoreIcon,
  UserRoundCheck,
  BikeIcon,
  Search,
  Package,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetConfi } from "../service/accionesConfiguracion/GetConfi";
import { subMenuGroups } from "./SubMenuTabs";

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

  const dispatch = useDispatch();

  const handleSideBar = () => {
    dispatch(toggleSidebar());
  };

  // === BUSCADOR GLOBAL MINIMALISTA ===
  const searchOptions = Object.values(subMenuGroups)
    .flat()
    .map(({ label, path }) => ({ label, path }));
  const isCompressed = useSelector((state) => state.sidebar.isCompressed);
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
  const {
    data: configEmpresa = [],
    isLoading: isLoadingConfig,
    isError: isErrorConfig,
  } = useQuery({
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
  return (
    <div
      className={`
        nav-navegacion   mb-3 ${navegacionAnchura ? "mx-3" : "mx-0"} ${
          isCompressed ? "compressedNavegacion" : ""
        }
      `}
    >
      <nav
        aria-label="breadcrumb"
        className="d-flex justify-content-between align-items-center w-100 flex-wrap border-none "
        style={{
          minHeight: "50px",
          height: "auto",
        }}
      >
        <div className="d-flex align-items-center ">
          {/* Breadcrumbs */}
          <div
            className="d-flex align-items-center breadcrumb-nav ms-3 "
            style={{ gap: 8 }}
          >
            {pathnames.length === 0 ? (
              <span className="fw-semibold" style={{ color: "#222" }}>
                {routeNames[""]}
              </span>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-decoration-none fw-semibold small"
                  style={{ color: "#222" }}
                >
                  {routeNames[""]}
                </Link>
                {pathnames.map((pathname, index) => {
                  const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                  const isLast = index === pathnames.length - 1;
                  return (
                    <span key={to} className="d-flex align-items-center small">
                      <span
                        className="mx-2"
                        style={{ color: "#b0b0b0", fontSize: 18 }}
                      >
                        •
                      </span>
                      {isLast ? (
                        <span
                          className="fw-semibold"
                          style={{ color: "#7a7a7a", opacity: 0.7 }}
                        >
                          {routeNames[pathname] || pathname}
                        </span>
                      ) : (
                        <Link
                          to={to}
                          className="text-decoration-none fw-semibold"
                          style={{ color: "#222" }}
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
        <div className="d-flex align-items-center flex-wrap justify-content-end gap-2 pe-3 mt-2 mt-sm-0">
          {/* --- BUSCADOR MINIMALISTA --- */}
          <div
            className="d-none d-md-block position-relative me-2"
            ref={searchRef}
            style={{ width: "220px" }}
          >
            <Search
              size={15}
              className="text-muted position-absolute"
              style={{
                top: "50%",
                left: "85%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              type="text"
              className="form-control shadow-none"
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
              <div
                className="position-absolute bg-white shadow border rounded-3 w-100 mt-1"
                style={{
                  top: "100%",
                  left: 0,
                  zIndex: 1050,
                  maxHeight: "250px",
                  overflowY: "auto",
                }}
              >
                <ul
                  id="navegacion-resultados-busqueda"
                  className="list-unstyled m-0 py-1"
                >
                  {filteredSearch.length > 0 ? (
                    filteredSearch.map((item, idx) => (
                      <li key={item.path}>
                        <button
                          id={`resultado-busqueda-${idx}`}
                          type="button"
                          className={`btn btn-sm w-100 text-start px-3 py-2 border-0 ${
                            idx === activeSearchIndex
                              ? "bg-dark text-white"
                              : "text-dark bg-transparent"
                          }`}
                          style={{ transition: "background-color 0.2s" }}
                          onMouseEnter={() => setActiveSearchIndex(idx)}
                          onClick={() => selectSearchOption(item)}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2 text-muted small text-center">
                      Sin resultados
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
          {/* 1. Asistencia */}
          <button
            className="btn btn-outline-dark d-flex align-items-center gap-1 px-2 p-1 px-md-3"
            onClick={() => navigate("/marcarAsistencia")}
            title="Asistencia" // El title ayuda a que en celular, si lo mantienen presionado, diga qué es
          >
            <UserRoundCheck size={20} />
            <span className="d-none d-md-inline">Asistencia</span>
          </button>
          {/* 2. Eventos */}
          {rolesLocalStorage.some((r) => r.nombre === "incidencias") && (
            <button
              className="btn btn-outline-dark d-flex align-items-center gap-1 px-2 p-1 px-md-3"
              onClick={() => navigate("/incidencias")}
              title="Eventos"
            >
              <Megaphone size={20} className="text-auto" />
              <span className="d-none d-md-inline">Eventos</span>
            </button>
          )}
          {/* PARA MIS ENTREGAS DEL DELIVERY CONDUCTOR */}
          {rolesLocalStorage.some((r) => r.nombre === "mis entregas") && (
            <button
              className="btn btn-outline-dark d-flex align-items-center gap-1 px-2 p-1 px-md-3"
              onClick={() => navigate("/mis-entregas")}
              title="Mis Entregas"
            >
              <Package size={20} className="text-auto" />
              <span className="d-none d-md-inline">Mis Entregas</span>
            </button>
          )}

          {/* 3. Pedidos Delivery (NUEVO - Solo visible para delivery y administradores) */}
          {["delivery", "conductor", "administrador"].includes(
            rol?.empleado?.cargo?.nombre,
          ) && (
            <button
              className="btn btn-outline-dark d-flex align-items-center gap-1 px-2 p-1 px-md-3"
              onClick={() => navigate("/pedidosDelivery")}
              title="Pedidos Delivery"
            >
              <BikeIcon size={20} />
              <span className="d-none d-md-inline">Pedidos</span>
            </button>
          )}
          {/* 4. POS (Oculto estrictamente para roles que no abren caja usando palabras clave) */}
          {!esRolBloqueadoParaCaja && (
            <button
              className="btn-guardar d-flex align-items-center gap-1 px-2 p-1 px-md-3"
              onClick={() => {
                esComida
                  ? navigate("/vender/mesas")
                  : navigate("/vender/ventasLlevar/");
              }}
              title="Abrir ventas"
            >
              <StoreIcon size={20} />
              <span className="d-none d-md-inline">Vender</span>
            </button>
          )}
          {/* 5. Cocina */}
          {["cocinero", "administrador"].includes(
            rol?.empleado?.cargo?.nombre,
          ) && (
            <button
              className="btn btn-outline-dark d-flex align-items-center gap-1 px-2 p-1 px-md-3"
              onClick={() => navigate("/cocina")}
              title="Cocina"
            >
              <CookingPotIcon size={20} className="text-auto" />
              <span className="d-none d-md-inline">Cocina</span>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
