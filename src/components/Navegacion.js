import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/NavegacionEstilos.css";

import { useDispatch } from "react-redux";
import { toggleSidebar } from "../redux/sideBarSlice";
import { Megaphone, StoreIcon, UserRoundCheck } from "lucide-react";

export function Navegacion() {
  const location = useLocation(); // Obtiene la ubicación actual
  const pathnames = location.pathname.split("/").filter((x) => x);
  const navigate = useNavigate();

  const rolesLocalStorage = JSON.parse(localStorage.getItem("roles")) || [];
  console.log(rolesLocalStorage);
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
    <div className="nav-navegacion">
      <nav
        aria-label="breadcrumb"
        className="d-flex justify-content-between align-items-center  w-100 "
        style={{
          height: "50px",
          boxShadow: "0px 3px 10px 1px rgba(0,0,0,0.2)!important",
        }}
      >
        {/* Contenedor flexible para alinear el botón y la navegación */}
        <div className="d-flex align-items-center">
          {/* Botón de compresión de sidebar */}
          {/* <button
            className="btn me-3 ms-2 d-flex align-items-center"
            onClick={handleSideBar}
          >
            <FontAwesomeIcon icon={faBars} size="lg" className="text-auto" />
          </button> */}

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
        <div className="d-flex align-items-center ">
          <div className="d-flex me-3 gap-2 align-items-center">
            <button
              className="btn btn-outline-dark d-flex align-items-center gap-1"
              onClick={() => navigate("/marcarAsistencia")}
            >
              <UserRoundCheck /> Asistencia
            </button>
          </div>
          {rolesLocalStorage.some((rol) => rol.nombre === "incidencias") && (
            <div className="d-flex me-3 gap-2 align-items-center">
              <button
                className="btn btn-outline-dark d-flex align-items-center gap-1"
                onClick={() => navigate("/incidencias")}
              >
                <Megaphone className="text-auto" />
                Incidencias
              </button>
            </div>
          )}
          <div className="d-flex me-3 gap-2 align-items-center">
            <button
              className="btn btn-outline-dark d-flex align-items-center gap-1"
              onClick={() => navigate("/vender/mesas")}
            >
              <StoreIcon /> POS
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
