import { Link, useLocation, useNavigate } from "react-router-dom";
import RippleWrapper from "./components/componentesReutilizables/RippleWrapper";
import {
  BikeIcon,
  HandPlatter,
  Inbox,
  LockKeyhole,
  LogOut,
  ShoppingCartIcon,
} from "lucide-react"; // <- Agregué LogOut
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKitchenSet } from "@fortawesome/free-solid-svg-icons";
import "./css/EstilosPOS.css";
import { fetchCajaClose } from "./pages/CerrarCaja";
import { useQuery } from "@tanstack/react-query";
import { GetConfi } from "./service/accionesConfiguracion/GetConfi";

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

  // Consulta de configuración (usará el caché automáticamente)
  const { data: configEmpresa = [] } = useQuery({
    queryKey: ["confiEmpresa"],
    queryFn: GetConfi,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const configTipoVenta = configEmpresa.find(
    (item) => item.nombre == "Tipo Venta",
  );

  // Condición clave
  const esComida = configTipoVenta?.clave == "restaurante";
  // Consulta con React Query para obtener los datos de la caja
  const { data: cajaData } = useQuery({
    queryKey: ["cajaClose", cajaDatos?.id],
    queryFn: () => fetchCajaClose(cajaDatos?.id),
    enabled: !!cajaDatos?.id,
  });
  return (
    <div className="w-100 p-0 pb-3 overflow-hidden d-flex flex-column h-100">
      {/* Barra de módulos POS mejorada */}
      <div
        className="card-header flex-column p-0 m-0 rounded-0 d-flex align-items-center"
        style={{
          height: "auto",
          borderBottom: "1px solid var(--fw-border, #ddd)",
        }}
      >
        {/* Lado Izquierdo: Módulos sin espacios */}
        <div className="d-flex flex-nowrap flex-grow-1 barra-modulos-pos w-100 h-100">
          {/* Mesas - ¡SOLO SI ES COMIDA! */}
          {esComida &&
            ["atencion al cliente", "administrador"].includes(
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

          {/* Delivery - ¡SOLO SI ES COMIDA! */}
          {esComida &&
            ["atencion al cliente", "administrador"].includes(
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

          {/* Llevar / Ventas - ¡SE MUESTRA SIEMPRE, PERO CAMBIA DE NOMBRE! */}
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
                {/* Cambiamos el icono dinámicamente si quieres */}
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

                {/* Cambiamos el texto dinámicamente */}
                <span className="pos-btn-text ms-1">
                  {esComida ? "Llevar" : "Ventas"}
                </span>
              </Link>
            </RippleWrapper>
          )}

          {/* Cocina - ¡SOLO SI ES COMIDA! */}
          {esComida &&
            ["cocinero", "administrador"].includes(
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
          {/* Información de la Caja y el Cajero */}
          <div
            className="d-flex align-items-center px-3 h-100 gap-3"
            style={{ borderRight: "1px solid var(--fw-border, #ddd)" }}
          >
            {/* 👉 NUEVO: Mostramos el nombre de la Caja */}
            <span
              style={{ fontSize: "0.9rem" }}
              className="d-flex align-items-center"
            >
              <span className="text-muted me-2">Caja:</span>
              <strong
                className="text-dark border rounded px-2 py-1 bg-light shadow-sm text-uppercase"
                style={{ fontSize: "0.85rem", letterSpacing: "0.5px" }}
              >
                {/* Intentamos sacar el nombre de cajaDatos (localStorage) o de caja (Redux) */}
                {cajaDatos?.nombre ||
                  caja?.nombre ||
                  `CAJA ${cajaDatos?.id || ""}`}
              </strong>
            </span>

            {/* Información del Cajero (Existente) */}
            <span
              style={{
                fontSize: "0.9rem",
                borderLeft: "1px solid #eee",
                paddingLeft: "15px",
              }}
            >
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
