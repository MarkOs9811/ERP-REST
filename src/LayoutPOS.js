import { useLocation, useNavigate } from "react-router-dom";
import RippleWrapper from "./components/componentesReutilizables/RippleWrapper";
import { BikeIcon, HandPlatter, Inbox, LockKeyhole } from "lucide-react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKitchenSet } from "@fortawesome/free-solid-svg-icons";
import "./css/EstilosPOS.css";

export default function LayoutPOS({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const caja = useSelector((state) => state.caja.caja);
  const cargo = JSON.parse(localStorage.getItem("user") || "{}") || {};
  return (
    <div className="card w-full h-screen p-0 m-0">
      {/* Barra de botones POS */}
      <div className="card-header p-2  m-0 rounded-0 d-flex gap-2 ">
        <div className="d-flex gap-2 flex-wrap justify-content-between flex-grow-1">
          {/* Mesas */}
          {["atencion al cliente", "administrador"].includes(
            cargo?.empleado?.cargo?.nombre,
          ) && (
            <RippleWrapper>
              <button
                type="button"
                className={`boton-venta ${
                  location.pathname === "/vender/mesas" ? "activo" : ""
                }`}
                onClick={() => navigate("/vender/mesas")}
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
            cargo?.empleado?.cargo?.nombre,
          ) && (
            <RippleWrapper>
              <button
                type="button"
                className={`boton-venta ${
                  location.pathname === "/vender/pedidosWeb" ? "activo" : ""
                }`}
                onClick={() => navigate("/vender/pedidosWeb")}
              >
                <BikeIcon />
                Delivery
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
            cargo?.empleado?.cargo?.nombre,
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

          {/* Botón Cerrar Caja */}
          <div className="ms-auto float-right d-flex gap-2">
            {["atencion al cliente", "administrador"].includes(
              cargo?.empleado?.cargo?.nombre,
            ) &&
              caja?.estado === "abierto" && (
                <button
                  type="button"
                  className="btn btn-outline-dark d-flex align-items-center justify-content-center"
                  onClick={() => navigate("/vender/cerrarCaja")}
                >
                  <LockKeyhole className="text-auto" />
                  Cerrar Caja
                </button>
              )}
            <button
              type="button"
              className="btn btn-danger d-flex align-items-center justify-content-center "
              onClick={() => navigate("/")}
            >
              Salir
            </button>
          </div>
        </div>
      </div>

      {/* Contenido dinámico */}
      <div className="contenedor-scroll p-3">{children}</div>
    </div>
  );
}
