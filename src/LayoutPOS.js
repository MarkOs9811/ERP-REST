import { Link, useLocation, useNavigate } from "react-router-dom";
import RippleWrapper from "./components/componentesReutilizables/RippleWrapper";
import {
  BikeIcon,
  HandPlatter,
  Inbox,
  LockKeyhole,
  LogOut,
} from "lucide-react"; // <- Agregué LogOut
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKitchenSet } from "@fortawesome/free-solid-svg-icons";
import "./css/EstilosPOS.css";
import { fetchCajaClose } from "./pages/CerrarCaja";
import { useQuery } from "@tanstack/react-query";

export default function LayoutPOS({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const caja = useSelector((state) => state.caja.caja);
  const cargo =
    JSON.parse(
      localStorage.getItem("user") || sessionStorage.getItem("user"),
    ) || {};

  const cajaDatos = JSON.parse(
    localStorage.getItem("caja") || sessionStorage.getItem("caja"),
  );

  // Consulta con React Query para obtener los datos de la caja
  const { data: cajaData } = useQuery({
    queryKey: ["cajaClose", cajaDatos?.id],
    queryFn: () => fetchCajaClose(cajaDatos?.id),
    enabled: !!cajaDatos?.id,
  });
  return (
    <div className="card w-full h-screen p-0 m-0 overflow-hidden">
      {/* Barra de módulos POS mejorada */}
      <div
        className="card-header p-0 m-0 rounded-0 d-flex align-items-center"
        style={{
          height: "58px",
          borderBottom: "1px solid var(--fw-border, #ddd)",
        }}
      >
        {/* Lado Izquierdo: Módulos sin espacios */}
        <div
          className="d-flex flex-nowrap flex-grow-1 barra-modulos-pos"
          style={{ gap: "0" }}
        >
          {/* Mesas */}
          {["atencion al cliente", "administrador"].includes(
            cargo?.empleado?.cargo?.nombre,
          ) && (
            <RippleWrapper>
              <Link
                className={`boton-venta d-flex align-items-center justify-content-center ${
                  location.pathname === "/vender/mesas" ? "activo" : ""
                }`}
                to="/vender/mesas"
              >
                <HandPlatter
                  className="text-auto pos-icon"
                  height="22px"
                  width="22px"
                />
                <span className="pos-btn-text ms-1">Mesas</span>
              </Link>
            </RippleWrapper>
          )}

          {/* Delivery */}
          {["atencion al cliente", "administrador"].includes(
            cargo?.empleado?.cargo?.nombre,
          ) && (
            <RippleWrapper>
              <Link
                className={`boton-venta d-flex align-items-center justify-content-center ${
                  location.pathname === "/vender/pedidosWeb" ? "activo" : ""
                }`}
                to="/vender/pedidosWeb"
              >
                <BikeIcon className="pos-icon" height="22px" width="22px" />
                <span className="pos-btn-text ms-1">Delivery</span>
              </Link>
            </RippleWrapper>
          )}

          {/* Llevar */}
          {["atencion al cliente", "administrador"].includes(
            cargo?.empleado?.cargo?.nombre,
          ) && (
            <RippleWrapper>
              <Link
                className={`boton-venta d-flex align-items-center justify-content-center ${
                  location.pathname === "/vender/ventasLlevar" ? "activo" : ""
                }`}
                to="/vender/ventasLlevar"
              >
                <Inbox
                  className="text-auto pos-icon"
                  height="22px"
                  width="22px"
                />
                <span className="pos-btn-text ms-1">Llevar</span>
              </Link>
            </RippleWrapper>
          )}

          {/* Cocina */}
          {["cocinero", "administrador"].includes(
            cargo?.empleado?.cargo?.nombre,
          ) && (
            <RippleWrapper>
              <Link
                className={`boton-venta d-flex align-items-center justify-content-center ${
                  location.pathname === "/vender/cocina" ? "activo" : ""
                }`}
                to="/vender/cocina"
              >
                <FontAwesomeIcon icon={faKitchenSet} className="pos-icon" />
                <span className="pos-btn-text ms-1">Cocina</span>
              </Link>
            </RippleWrapper>
          )}
        </div>

        {/* Lado Derecho: Información y Acciones */}
        <div
          className="ms-auto d-flex align-items-center"
          style={{ height: "100%", gap: "0" }}
        >
          {/* Información del Cajero */}
          <div
            className="d-flex align-items-center px-3 h-100"
            style={{ borderRight: "1px solid var(--fw-border, #ddd)" }}
          >
            <span style={{ fontSize: "0.9rem" }}>
              <span className="text-muted me-2">Cajero:</span>
              <strong>
                {cajaData?.datosRegistroCaja?.usuario?.empleado?.persona
                  ?.nombre +
                  " " +
                  cajaData?.datosRegistroCaja?.usuario?.empleado?.persona
                    ?.apellidos}
              </strong>
            </span>
          </div>

          {/* Botón Cerrar Caja como Link */}
          {["atencion al cliente", "administrador"].includes(
            cargo?.empleado?.cargo?.nombre,
          ) &&
            caja?.estado === "abierto" && (
              <a
                href="#cerrar-caja"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/vender/cerrarCaja");
                }}
                className="pos-action-link cerrar-caja d-flex align-items-center justify-content-center"
              >
                <LockKeyhole
                  className="text-auto pos-icon"
                  height="18px"
                  width="18px"
                />
                <span className="pos-btn-text">Cerrar Caja</span>
              </a>
            )}

          {/* Botón Salir como Link */}
          <a
            href="#salir"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
            className="pos-action-link salir d-flex align-items-center justify-content-center"
          >
            <LogOut className="pos-icon" height="18px" width="18px" />
            <span className="pos-btn-text">Salir</span>
          </a>
        </div>
      </div>

      {/* Contenido dinámico */}
      <div className="contenedor-scroll p-3">{children}</div>
    </div>
  );
}
