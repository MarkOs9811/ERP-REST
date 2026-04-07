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
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function Navegacion() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const navigate = useNavigate();

  const rolesLocalStorage = JSON.parse(localStorage.getItem("roles")) || [];
  const userStr = localStorage.getItem("user");
  const rol = userStr ? JSON.parse(userStr) : null;

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
  const searchOptions = [
    { label: "Dashboard (Inicio)", path: "/" },
    { label: "POS / Vender", path: "/vender/mesas" },
    { label: "Delivery", path: "/delivery" },
    { label: "Cocina", path: "/cocina" },
    { label: "Usuarios (RRHH)", path: "/rrhh" },
    { label: "Nómina (RRHH)", path: "/rrhh/nomina" },
    { label: "Ingreso a Planilla", path: "/rrhh/ingreso-a-planilla" },
    { label: "Asistencia (RRHH)", path: "/rrhh/asistencia" },
    { label: "Áreas y Cargos", path: "/rrhh/areas-y-cargos" },
    { label: "Finanzas - Informes", path: "/finanzas/informes-financieros" },
    { label: "Libro Diario", path: "/finanzas/libro-diario" },
    { label: "Libro Mayor", path: "/finanzas/libro-mayor" },
    { label: "Almacenes", path: "/almacen" },
    { label: "Compras", path: "/almacen/compras" },
    { label: "Proveedores", path: "/almacen/proveedores" },
    { label: "Kardex", path: "/almacen/kardex" },
    { label: "Ventas / Mis Ventas", path: "/ventas" },
    { label: "Inventario (Ventas)", path: "/ventas/inventario" },
    { label: "Cajas", path: "/ventas/cajas" },
    { label: "Mesas", path: "/ventas/mesas" },
    { label: "Platos", path: "/platos" },
    { label: "Configuración", path: "/configuracion" },
  ];
  const isCompressed = useSelector((state) => state.sidebar.isCompressed);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
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
  // ===================================

  return (
    <div
      className={
        "nav-navegacion  border-none " +
        (isCompressed ? " compressedNavegacion" : "")
      }
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
                  className="text-decoration-none fw-semibold"
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
                left: "12px",
                transform: "translateY(-50%)",
              }}
            />
            <input
              type="text"
              className="form-control shadow-none"
              placeholder="Buscar vista..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              style={{
                borderRadius: "20px",
                paddingLeft: "34px",
                fontSize: "0.85rem",
                backgroundColor: "rgba(0,0,0,0.03)",
                border: "1px solid rgba(0,0,0,0.08)",
                transition: "all 0.2s ease",
              }}
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
                <ul className="list-unstyled m-0 py-1">
                  {filteredSearch.length > 0 ? (
                    filteredSearch.map((item, idx) => (
                      <li key={idx}>
                        <button
                          className="btn btn-sm w-100 text-start px-3 py-2 text-dark bg-transparent border-0"
                          style={{ transition: "background-color 0.2s" }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "rgba(0,0,0,0.04)")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "transparent")
                          }
                          onClick={() => {
                            navigate(item.path);
                            setSearchTerm("");
                            setShowSearchDropdown(false);
                          }}
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

          {/* 3. Pedidos Delivery (NUEVO - Solo visible para delivery y administradores) */}
          {["delivery", "administrador"].includes(
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

          {/* 4. POS (Oculto estrictamente si el rol es "delivery") */}
          {rol?.empleado?.cargo?.nombre !== "delivery" && (
            <button
              className="btn btn-outline-dark d-flex align-items-center gap-1 px-2 p-1 px-md-3"
              onClick={() => navigate("/vender/mesas")}
              title="POS"
            >
              <StoreIcon size={20} />
              <span className="d-none d-md-inline">POS</span>
            </button>
          )}

          {/* 5. Cocina */}
          {rol?.empleado?.cargo?.nombre === "cocinero" && (
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
