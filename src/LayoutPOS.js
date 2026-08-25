import { Link, useLocation, useNavigate } from "react-router-dom";
import RippleWrapper from "./components/componentesReutilizables/RippleWrapper";
import {
  BikeIcon,
  HandPlatter,
  Inbox,
  LockKeyhole,
  LogOut,
  ShoppingCartIcon,
} from "lucide-react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKitchenSet } from "@fortawesome/free-solid-svg-icons";
import "./css/EstilosPOS.css";
import { fetchCajaClose } from "./pages/modulosVender/CerrarCaja";
import { useQuery } from "@tanstack/react-query";
import { GetConfi } from "./service/accionesConfiguracion/GetConfi";
import { HoraLive } from "./utils/HoraLive";

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

  // Consulta de configuración
  const { data: configEmpresa = [] } = useQuery({
    queryKey: ["confiEmpresa"],
    queryFn: GetConfi,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const configTipoVenta = configEmpresa.find(
    (item) => item.nombre == "Tipo Venta",
  );

  const esComida = configTipoVenta?.clave == "restaurante";

  // Consulta para obtener los datos de la caja
  const { data: cajaData } = useQuery({
    queryKey: ["cajaClose", cajaDatos?.id],
    queryFn: () => fetchCajaClose(cajaDatos?.id),
    enabled: !!cajaDatos?.id,
  });

  return (
    <div className="w-100 p-0 pb-3 overflow-hidden d-flex flex-column h-100">
      {/* HEADER LIMPIO SIN BORDES INVENTADOS */}
      <div className="card-header p-0 m-0 rounded-0 d-flex flex-column flex-md-row align-items-stretch align-items-md-center bg-white shadow-sm">
        {/* ========================================================= */}
        {/* LADO IZQUIERDO: Exactamente con tu diseño original */}
        {/* ========================================================= */}
        <div className="d-flex h-100 overflow-x-auto">
          {esComida &&
            ["atencion al cliente", "administrador"].includes(
              cargo?.empleado?.cargo?.nombre,
            ) && (
              <RippleWrapper>
                <Link
                  className={`boton-venta d-flex align-items-center justify-content-center  h-100 ${
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

          {["atencion al cliente", "administrador"].includes(
            cargo?.empleado?.cargo?.nombre,
          ) && (
            <RippleWrapper>
              <Link
                className={`boton-venta d-flex align-items-center justify-content-center  h-100 ${
                  location.pathname === "/vender/ventasLlevar" ? "activo" : ""
                }`}
                to="/vender/ventasLlevar"
              >
                {esComida ? (
                  <Inbox
                    className="text-auto pos-icon"
                    height="22px"
                    width="22px"
                  />
                ) : (
                  <ShoppingCartIcon
                    className="text-auto pos-icon"
                    height="22px"
                    width="22px"
                  />
                )}
                <span className="pos-btn-text ms-1">
                  {esComida ? "Llevar" : "Ventas"}
                </span>
              </Link>
            </RippleWrapper>
          )}

          {esComida &&
            ["cocinero", "administrador"].includes(
              cargo?.empleado?.cargo?.nombre,
            ) && (
              <RippleWrapper>
                <Link
                  className={`boton-venta d-flex align-items-center justify-content-center  h-100 ${
                    location.pathname === "/vender/cocina" ? "activo" : ""
                  }`}
                  to="/vender/cocina"
                >
                  <FontAwesomeIcon icon={faKitchenSet} className="pos-icon" />
                  <span className="pos-btn-text ms-1">Cocina</span>
                </Link>
              </RippleWrapper>
            )}
          {esComida &&
            ["atencion al cliente", "administrador"].includes(
              cargo?.empleado?.cargo?.nombre,
            ) && (
              <RippleWrapper>
                <Link
                  className={`boton-venta d-flex align-items-center justify-content-center h-100 ${
                    location.pathname === "/vender/pedidosWeb" ? "activo" : ""
                  }`}
                  to="/vender/pedidosWeb"
                >
                  <BikeIcon className="pos-icon" height="22px" width="22px" />
                  <span className="pos-btn-text ms-1">Delivery</span>
                </Link>
              </RippleWrapper>
            )}
        </div>

        {/* ========================================================= */}
        {/* LADO DERECHO: Alineado, separado por 'gap' y sin líneas */}
        {/* ========================================================= */}
        <div className="d-flex flex-wrap flex-md-nowrap flex-grow-1 align-items-center justify-content-center justify-content-md-end p-2 pe-md-4 gap-4">
          <div className="d-flex align-items-center">
            <p className="fw-bold mb-0">
              <HoraLive />
            </p>
          </div>
          {/* Info Caja */}
          <div className="d-flex align-items-center gap-2 text-nowrap">
            <span className="text-muted small mb-0">Caja:</span>
            <strong
              className="text-dark border rounded px-2 py-1 bg-light shadow-sm text-uppercase mb-0"
              style={{ fontSize: "0.85rem", letterSpacing: "0.5px" }}
            >
              {cajaDatos?.nombre ||
                caja?.nombre ||
                `CAJA ${cajaDatos?.id || ""}`}
            </strong>
          </div>

          {/* Info Cajero */}
          <div className="d-flex align-items-center gap-2 text-nowrap">
            <span className="text-muted small mb-0">Cajero:</span>
            <strong
              className="text-dark text-truncate mb-0"
              style={{ fontSize: "0.85rem", maxWidth: "160px" }}
            >
              {cajaData?.datosRegistroCaja?.usuario?.empleado?.persona?.nombre}{" "}
              {
                cajaData?.datosRegistroCaja?.usuario?.empleado?.persona
                  ?.apellidos
              }
            </strong>
          </div>

          {/* Botones de Acción */}
          <div className="d-flex align-items-center gap-3">
            {["atencion al cliente", "administrador"].includes(
              cargo?.empleado?.cargo?.nombre,
            ) &&
              caja?.estado === "abierto" && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/vender/cerrarCaja");
                  }}
                  className="pos-action-link cerrar-caja d-flex align-items-center gap-2 text-decoration-none h-100"
                >
                  <LockKeyhole
                    className="text-auto pos-icon"
                    height="18px"
                    width="18px"
                  />
                  <span className="pos-btn-text text-nowrap">Cerrar Caja</span>
                </button>
              )}

            <button
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
              className="pos-action-link salir d-flex align-items-center gap-2 text-decoration-none h-100"
            >
              <LogOut className="pos-icon" height="18px" width="18px" />
              <span className="pos-btn-text text-nowrap">Salir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido dinámico */}
      <div className="contenedor-scroll p-3 flex-grow-1">{children}</div>
    </div>
  );
}
