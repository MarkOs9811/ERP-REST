import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/NavegacionEstilos.css";

import { useDispatch } from "react-redux";
import { toggleSidebar } from "../redux/sideBarSlice";
import {
  CookingPotIcon,
  Megaphone,
  StoreIcon,
  UserRoundCheck,
  BikeIcon, // <- 1. Importamos el ícono para el botón de Delivery
} from "lucide-react";

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

  return (
    <div className="nav-navegacion">
      <nav
        aria-label="breadcrumb"
        className="d-flex justify-content-between align-items-center w-100 flex-wrap py-2"
        style={{
          minHeight: "50px",
          height: "auto",
          boxShadow: "0px 3px 10px 1px rgba(0,0,0,0.2)!important",
        }}
      >
        <div className="d-flex align-items-center">
          {/* Breadcrumbs */}
          <div
            className="d-flex align-items-center breadcrumb-nav ms-3"
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

        {/* --- CONTENEDOR DE BOTONES DE ACCIÓN --- */}
        {/* Usamos gap-2 para separar los botones y pe-2 para que no pegue al borde derecho */}
        <div className="d-flex align-items-center flex-wrap justify-content-end gap-2 pe-3 mt-2 mt-sm-0">
          {/* 1. Asistencia */}
          <button
            className="btn btn-outline-dark d-flex align-items-center gap-1 px-2 px-md-3"
            onClick={() => navigate("/marcarAsistencia")}
            title="Asistencia" // El title ayuda a que en celular, si lo mantienen presionado, diga qué es
          >
            <UserRoundCheck size={20} />
            <span className="d-none d-md-inline">Asistencia</span>
          </button>

          {/* 2. Eventos */}
          {rolesLocalStorage.some((r) => r.nombre === "incidencias") && (
            <button
              className="btn btn-outline-dark d-flex align-items-center gap-1 px-2 px-md-3"
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
              className="btn btn-outline-dark d-flex align-items-center gap-1 px-2 px-md-3"
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
              className="btn btn-outline-dark d-flex align-items-center gap-1 px-2 px-md-3"
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
              className="btn btn-outline-dark d-flex align-items-center gap-1 px-2 px-md-3"
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
