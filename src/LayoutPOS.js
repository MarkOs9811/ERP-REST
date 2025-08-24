import { useLocation, useNavigate } from "react-router-dom";
import RippleWrapper from "./components/componentesReutilizables/RippleWrapper";
import {
  ArrowBigLeft,
  ChevronLeft,
  HandPlatter,
  Inbox,
  LockKeyhole,
  MessageCircleMore,
} from "lucide-react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKitchenSet } from "@fortawesome/free-solid-svg-icons";

export default function LayoutPOS({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const caja = useSelector((state) => state.caja.caja);
  const cargo = JSON.parse(localStorage.getItem("user") || "{}") || {};
  return (
    <div className="w-full h-screen flex flex-col bg-gray-100">
      {/* Barra de botones POS */}
      <div className="p-2 shadow d-flex gap-2 bg-white">
        <button className="btn btn-dark" onClick={() => navigate("/")}>
          <ChevronLeft className="color-auto" />
          Volver
        </button>
        <div className="d-flex gap-2 flex-wrap justify-content-between flex-grow-1">
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

          {/* Botón Cerrar Caja */}
          <div className="ms-auto float-right d-flex">
            {["atencion al cliente", "administrador"].includes(
              cargo?.empleado?.cargo?.nombre
            ) &&
              caja?.estado === "abierto" && (
                <button
                  type="button"
                  className={
                    "btn btn-outline-danger d-flex align-items-center gap-1"
                  }
                  onClick={() => navigate("/vender/cerrarCaja")}
                  style={{ height: 44 }}
                >
                  <LockKeyhole
                    className="text-auto"
                    height="22px"
                    width="22px"
                  />
                  Cerrar Caja
                </button>
              )}
          </div>
        </div>
      </div>

      {/* Contenido dinámico */}
      <div
        className="flex-1 overflow-auto p-3 vh-100"
        style={{ background: "#F2F2F2" }}
      >
        {children}
      </div>
    </div>
  );
}
