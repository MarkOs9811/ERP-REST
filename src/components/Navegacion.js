import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/NavegacionEstilos.css";

import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faKitchenSet } from "@fortawesome/free-solid-svg-icons";
import { toggleSidebar } from "../redux/sideBarSlice";
import RippleWrapper from "./componentesReutilizables/RippleWrapper";
import {
  HandPlatter,
  Inbox,
  LockKeyhole,
  MessageCircleMore,
} from "lucide-react";

export function Navegacion() {
  const location = useLocation(); // Obtiene la ubicación actual
  const pathnames = location.pathname.split("/").filter((x) => x);
  const navigate = useNavigate();
  const caja = useSelector((state) => state.caja.caja);
  const cajaDetalles = JSON.parse(localStorage.getItem("caja"));
  const cargo = JSON.parse(localStorage.getItem("user") || "{}") || {};

  // Mapea las rutas a nombres amigables
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
    <div
      className="d-flex border-none rounded-0 shadow-sm position-relative navegacion"
      style={{ height: "50px" }}
    >
      <nav
        aria-label="breadcrumb"
        className="d-flex justify-content-between align-items-center  w-100"
      >
        {/* Contenedor flexible para alinear el botón y la navegación */}
        <div className="d-flex align-items-center">
          {/* Botón de compresión de sidebar */}
          <button
            className="btn me-3 ms-2 d-flex align-items-center"
            onClick={handleSideBar}
          >
            <FontAwesomeIcon icon={faBars} size="lg" className="text-auto" />
          </button>

          {/* Breadcrumbs */}
          <div
            className="d-flex align-items-center breadcrumb-nav"
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
        <div className="d-flex me-3 gap-2 align-items-center">
          {/* Botón Cerrar Caja */}
          {["atencion al cliente", "administrador"].includes(
            cargo?.empleado?.cargo?.nombre
          ) &&
            caja?.estado === "abierto" && (
              <Link
                to="vender/cerrarCaja"
                className="btn btn-outline-danger d-flex align-items-center gap-1"
                style={{ height: 44 }}
              >
                <LockKeyhole className="text-auto" height="22px" width="22px" />
                Cerrar Caja
              </Link>
            )}

          {/* Mesas */}
          {["atencion al cliente", "administrador"].includes(
            cargo?.empleado?.cargo?.nombre
          ) && (
            <RippleWrapper>
              <button
                type="button"
                className={`boton-venta ${
                  location.pathname === "/vender/ventasMesas" ? "activo" : ""
                }`}
                onClick={() => navigate("/vender/ventasMesas")}
              >
                <HandPlatter
                  className="text-auto me-1"
                  height="22px"
                  width="22px"
                />
                Mesas
              </button>
            </RippleWrapper>
          )}

          {/* WhatsApp */}
          {["atencion al cliente", "administrador"].includes(
            cargo?.empleado?.cargo?.nombre
          ) && (
            <RippleWrapper>
              <button
                type="button"
                className={`boton-venta ${
                  location.pathname === "/vender/pedidosWeb" ? "activo" : ""
                }`}
                onClick={() => navigate("/vender/pedidosWeb")}
              >
                <MessageCircleMore
                  className="text-auto me-1"
                  height="22px"
                  width="22px"
                />
                WhatsApp
              </button>
            </RippleWrapper>
          )}

          {/* Llevar */}
          {["atencion al cliente", "administrador"].includes(
            cargo?.empleado?.cargo?.nombre
          ) && (
            <RippleWrapper>
              <button
                type="button"
                className={`boton-venta ${
                  location.pathname === "/vender/ventasLlevar" ? "activo" : ""
                }`}
                onClick={() => navigate("/vender/ventasLlevar")}
              >
                <Inbox className="text-auto me-1" height="22px" width="22px" />
                Llevar
              </button>
            </RippleWrapper>
          )}

          {/* Cocina */}
          {["cocinero", "administrador"].includes(
            cargo?.empleado?.cargo?.nombre
          ) && (
            <RippleWrapper>
              <button
                type="button"
                className={`boton-venta ${
                  location.pathname === "/vender/cocina" ? "activo" : ""
                }`}
                onClick={() => navigate("/vender/cocina")}
              >
                <FontAwesomeIcon icon={faKitchenSet} className="me-1" />
                Cocina
              </button>
            </RippleWrapper>
          )}
        </div>
      </nav>
    </div>
  );
}
