import { faBurger, faTruckFast } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Activity, LayoutPanelTop, User } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";

export function CabeceraHome({ ventasList, load, error }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // Obtener el mes y año actual
  const currentMonth = new Date().getMonth() + 1; // Los meses en JavaScript son 0-indexados
  const currentYear = new Date().getFullYear();

  // Contar los pedidos para "llevar" y "mesa" del presente mes
  let totalPedidosLlevar = 0;
  let totalPedidosMesa = 0;

  ventasList.forEach((venta) => {
    if (venta.pedido) {
      const { tipoVenta, detalle_pedidos, fechaPedido } = venta.pedido;

      // Verificar que el pedido sea del presente mes
      const fechaPedidoDate = new Date(fechaPedido);
      const esDelMesActual =
        fechaPedidoDate.getMonth() + 1 === currentMonth &&
        fechaPedidoDate.getFullYear() === currentYear;

      if (esDelMesActual) {
        if (tipoVenta === "llevar" && Array.isArray(detalle_pedidos)) {
          totalPedidosLlevar += detalle_pedidos.length; // Contar los platos en detalle_pedidos
        } else if (tipoVenta === "mesa" && Array.isArray(detalle_pedidos)) {
          totalPedidosMesa += detalle_pedidos.length; // Contar los platos en detalle_pedidos
        }
      }
    }
  });

  // Filtrar las ventas por web del presente mes
  const ventasWebMes =
    ventasList?.filter((venta) => {
      const fechaVenta = new Date(venta.fechaVenta);
      return (
        venta.idPedidoWeb !== null && // idPedidoWeb no es null
        fechaVenta.getMonth() + 1 === currentMonth && // Mismo mes
        fechaVenta.getFullYear() === currentYear // Mismo año
      );
    }) || []; // Asegúrate de que sea un array

  // Contar las ventas por web
  const totalVentasWeb = ventasWebMes.length || 0;
  const navigate = useNavigate();
  const goVender = () => {
    navigate("/vender");
  };
  return (
    <div className="row mb-3 g-3">
      <div className="col-md-6 col-sm-12">
        {/* Header Bienvenida */}
        <CondicionCarga isLoading={load} isError={error}>
          <div
            className="position-relative h-100 "
            style={{
              backgroundImage: "url('/images/background2.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            {/* Capa de opacidad */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1,
              }}
            ></div>

            {/* Contenido */}
            <div
              className="card-body text-auto position-relative p-5"
              style={{ zIndex: 2, color: "white" }}
            >
              <h2 className="mb-1 text-white">
                <strong>
                  Hola, {user?.empleado?.persona?.nombre || "Usuario"}
                </strong>
              </h2>
              <button className="btn btn-danger" onClick={() => goVender()}>
                Iniciar
              </button>
              <User
                color={"#fff"}
                height="30px"
                width="30px"
                style={{ position: "absolute", right: "20px", top: "20px" }}
              />
              <div className="d-flex align-items-center mt-2">
                <Activity color={"#fff"} height="18px" width="18px" />
                <small className="opacity-75 ms-2">
                  Panel de control - {new Date().toLocaleDateString()} | Última
                  actualización: {new Date().toLocaleTimeString()}
                </small>
              </div>
            </div>
          </div>
        </CondicionCarga>
      </div>

      <div className="col-md-2 col-sm-12">
        <CondicionCarga isLoading={load} isError={error}>
          <div className="card shadow-sm h-100 card-pedidos-web">
            <div className="card-header-web position-relative"></div>
            <div className="card-body text-auto position-relative">
              <div className="ico-bagde resumen-mes-pedidos-web">
                <LayoutPanelTop color={"white"} />
              </div>
              <div className="contenido-card-cabecera text-center mt-3">
                <p className="h2 fw-bold">{totalVentasWeb}</p>
                <p className="h6">Pedidos Web</p>
                <small>Este Mes</small>
              </div>
            </div>
          </div>
        </CondicionCarga>
      </div>
      <div className="col-md-2 col-sm-12">
        <CondicionCarga isLoading={load} isError={error}>
          <div className="card shadow-sm h-100 card-pedido-llevar">
            <div className="card-header-llevar position-relative"></div>
            <div className="card-body text-auto position-relative">
              <div className="ico-bagde resumen-mes-pedidos-llevar">
                <FontAwesomeIcon icon={faTruckFast} />
              </div>
              <div className="contenido-card-cabecera text-center mt-3">
                <p className="h2 fw-bold">{totalPedidosLlevar}</p>
                <p className="h6">Pedidos Llevar</p>
                <small>Este Mes</small>
              </div>
            </div>
          </div>
        </CondicionCarga>
      </div>
      <div className="col-md-2 col-sm-12">
        <CondicionCarga isLoading={load} isError={error}>
          <div className="card shadow-sm h-100 card-pedido-mesa">
            <div className="card-header-mesa position-relative"></div>
            <div className="card-body text-auto position-relative">
              <div className="ico-bagde resumen-mes-pedidos-mesa">
                <FontAwesomeIcon icon={faBurger} />
              </div>
              <div className="contenido-card-cabecera text-center mt-3">
                <p className="h2 fw-bold">{totalPedidosMesa}</p>
                <p className="h6">Pedidos Mesa</p>
                <small>Este Mes</small>
              </div>
            </div>
          </div>
        </CondicionCarga>
      </div>
    </div>
  );
}
