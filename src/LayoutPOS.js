import { useLocation, useNavigate } from "react-router-dom";
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
  const {
    data: cajaData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["cajaClose", cajaDatos?.id],
    queryFn: () => fetchCajaClose(cajaDatos?.id),
    enabled: !!cajaDatos?.id,
  });
  return (
    <div className="card w-full h-screen p-0 m-0 overflow-hidden">
      {/* Barra de botones POS */}
      <div className="card-header p-2 m-0 rounded-0 d-flex gap-2">
        {/* Lado Izquierdo: Módulos (Agregamos overflow-x-auto por si hay pantallas muy muy pequeñas) */}
        <div className="d-flex gap-1 gap-md-2 flex-nowrap flex-grow-1 barra-modulos-pos">
          {/* Mesas */}
          {["atencion al cliente", "administrador"].includes(
            cargo?.empleado?.cargo?.nombre,
          ) && (
            <RippleWrapper>
              <button
                type="button"
                className={`boton-venta d-flex align-items-center justify-content-center ${
                  location.pathname === "/vender/mesas" ? "activo" : ""
                }`}
                onClick={() => navigate("/vender/mesas")}
              >
                <HandPlatter
                  className="text-auto pos-icon"
                  height="22px"
                  width="22px"
                />
                <span className="pos-btn-text ms-1">Mesas</span>
              </button>
            </RippleWrapper>
          )}

          {/* Delivery */}
          {["atencion al cliente", "administrador"].includes(
            cargo?.empleado?.cargo?.nombre,
          ) && (
            <RippleWrapper>
              <button
                type="button"
                className={`boton-venta d-flex align-items-center justify-content-center ${
                  location.pathname === "/vender/pedidosWeb" ? "activo" : ""
                }`}
                onClick={() => navigate("/vender/pedidosWeb")}
              >
                <BikeIcon className="pos-icon" height="22px" width="22px" />
                <span className="pos-btn-text ms-1">Delivery</span>
              </button>
            </RippleWrapper>
          )}

          {/* Llevar */}
          {["atencion al cliente", "administrador"].includes(
            cargo?.empleado?.cargo?.nombre,
          ) && (
            <RippleWrapper>
              <button
                type="button"
                className={`boton-venta d-flex align-items-center justify-content-center ${
                  location.pathname === "/vender/ventasLlevar" ? "activo" : ""
                }`}
                onClick={() => navigate("/vender/ventasLlevar")}
              >
                <Inbox
                  className="text-auto pos-icon"
                  height="22px"
                  width="22px"
                />
                <span className="pos-btn-text ms-1">Llevar</span>
              </button>
            </RippleWrapper>
          )}

          {/* Cocina */}
          {["cocinero", "administrador"].includes(
            cargo?.empleado?.cargo?.nombre,
          ) && (
            <RippleWrapper>
              <button
                type="button"
                className={`boton-venta d-flex align-items-center justify-content-center ${
                  location.pathname === "/vender/cocina" ? "activo" : ""
                }`}
                onClick={() => navigate("/vender/cocina")}
              >
                <FontAwesomeIcon icon={faKitchenSet} className="pos-icon" />
                <span className="pos-btn-text ms-1">Cocina</span>
              </button>
            </RippleWrapper>
          )}
        </div>

        {/* Lado Derecho: Acciones de Caja (Se mantienen a la derecha y no se encojen) */}
        <div className="ms-auto d-flex gap-1 gap-md-2 flex-shrink-0 justify-content-around align-items-center">
          <span>
            <span className="text-muted">Cajero: </span>
            {cajaData?.datosRegistroCaja?.usuario?.empleado?.persona?.nombre +
              " " +
              cajaData?.datosRegistroCaja?.usuario?.empleado?.persona
                ?.apellidos}
          </span>
          {/* Botón Cerrar Caja */}
          {["atencion al cliente", "administrador"].includes(
            cargo?.empleado?.cargo?.nombre,
          ) &&
            caja?.estado === "abierto" && (
              <button
                type="button"
                className="btn btn-outline-dark btn-pos-action d-flex align-items-center justify-content-center"
                onClick={() => navigate("/vender/cerrarCaja")}
              >
                <LockKeyhole
                  className="text-auto pos-icon"
                  height="20px"
                  width="20px"
                />
                <span className="pos-btn-text ms-1">Cerrar Caja</span>
              </button>
            )}

          {/* Botón Salir */}
          <button
            type="button"
            className=" btn-eliminar d-flex align-items-center justify-content-center"
            onClick={() => navigate("/")}
          >
            {/* Ícono nuevo para que no quede un cuadro rojo vacío en celular */}
            <LogOut className="pos-icon" height="20px" width="20px" />
            <span className="pos-btn-text ms-1">Salir</span>
          </button>
        </div>
      </div>

      {/* Contenido dinámico */}
      <div className="contenedor-scroll p-3">{children}</div>
    </div>
  );
}
