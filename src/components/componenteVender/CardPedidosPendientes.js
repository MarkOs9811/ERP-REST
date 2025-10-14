import NotificacionBtn from "../componentesReutilizables/componentesPedidosWeb/NotificacionBtn";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setEstado } from "../../redux/tipoVentaSlice";
import { GetPedidoWeb } from "../../service/GetPedidoWeb";
import { useQuery } from "@tanstack/react-query";
import { addItem } from "../../redux/pedidoWebSlice";
import {
  AlarmClock,
  CheckCheck,
  CheckCheckIcon,
  Megaphone,
  Phone,
  Printer,
  PrinterIcon,
  UserRound,
} from "lucide-react";

const PedidoCard = ({ pedido, onOpenModal }) => {
  // Definir clases y estilos basados en el estado
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    data: pedidoData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["pedido", pedido.id], // Usamos la propiedad 'queryKey' en vez de pasar un arreglo
    queryFn: () => GetPedidoWeb({ id: pedido.id }), // Definimos la función que obtiene los datos
    enabled: false, // Solo ejecutamos si 'pedido.id' está disponible
  });

  const handleRealizarPago = async () => {
    try {
      const { data } = await refetch(); // ejecuta manualmente la consulta

      if (!data || data.length === 0) {
        console.error("No se encontró el pedido o está vacío");
        return;
      }

      // Recorrer todos los ítems del pedido y despacharlos al carrito
      data.forEach((item) => {
        const { id, precio, cantidad } = item;
        const nombre = item.plato?.nombre || "Sin nombre";

        const itemToAdd = { id, nombre, precio, cantidad };

        console.log("🛒 Item que entra a addItem:", itemToAdd);

        dispatch(addItem(itemToAdd));
      });

      // Estado "web" y navegación
      dispatch(setEstado("web"));
      navigate(`/vender/ventasMesas/detallesPago/${pedido.id}`);
    } catch (error) {
      console.error("Error al realizar pago:", error);
    }
  };

  const estadoClases = {
    3: {
      bgColor: "bg-light",
      estadoTexto: "Pagar en Caja",
      estadoClase: "bg-warning text-dark",
      icono: <AlarmClock color="#ffc100" size={16} />,
      botones: (
        <div className="d-flex flex-column justify-content-end gap-2 p-0 me-2">
          <button
            className="btn btn-sm btn-light p-1 ms-auto"
            title="Notificar al cliente"
          >
            <Megaphone size={"auto"} className="text-auto" />
          </button>
        </div>
      ),
    },
    4: {
      bgColor: "bg-light",
      estadoTexto: "En proceso",
      estadoClase: "bg-primary text-white",
      icono: <AlarmClock color="#007bff" size={16} />,
      botones: (
        <div className="d-flex flex-column justify-content-end gap-2 p-0 me-2">
          <button className="btn btn-sm btn-light p-1 ms-auto">
            <Printer size={14} className="text-auto" />
          </button>
          <NotificacionBtn pedido={pedido} className="text-auto" />
        </div>
      ),
    },
    5: {
      bgColor: "bg-light",
      estadoTexto: "Pagado",
      estadoClase: "bg-success",
      icono: <CheckCheck color="#28a745" size={16} />,
      botones: (
        <div className="d-flex flex-column justify-content-end gap-2 p-0 me-2">
          <button
            className="btn btn-sm btn-light border  p-1 ms-auto"
            onClick={() => handleRealizarPago()}
          >
            <CheckCheckIcon size={14} className="text-auto" />
          </button>
          <button className="btn btn-sm btn-light  p-1 ms-auto">
            <PrinterIcon size={14} className="text-auto" />
          </button>
          <NotificacionBtn pedido={pedido} className="text-auto" />
        </div>
      ),
    },
  };

  const estadoActual = estadoClases[pedido.estado_pedido] || estadoClases[3];

  return (
    <div
      className={`mb-2 p-3 rounded position-relative shadow-sm ${estadoActual.bgColor}`}
      style={{
        borderLeft: `4px solid ${
          pedido.estado_pago === "pagado" ? "#28a745" : "#ffc100"
        }`,
      }}
    >
      <div className="row align-items-center">
        {/* Columna Izquierda */}
        <div className="col-md-7" onClick={onOpenModal}>
          <div className="fw-bold mb-1">{pedido.codigo_pedido}</div>
          <div className="text-muted small">
            <div className="d-flex align-items-center">
              <UserRound className="me-1 text-auto" size={12} />
              {pedido.nombre_cliente || "Cliente"}
            </div>
            <div className="d-flex align-items-center">
              <Phone className="me-1 text-auto" size={12} />
              {pedido.numero_cliente}
            </div>
          </div>
        </div>

        {/* Columna Derecha */}
        <div
          className="col-md-4 text-end d-flex flex-column"
          onClick={onOpenModal}
        >
          <span className="fw-bold ms-auto my-2">
            S/.{" "}
            {pedido?.detalles_pedido
              ?.reduce(
                (total, detalle) => total + parseFloat(detalle.precio),
                0
              )
              .toFixed(2)}
          </span>

          {/* Badge de Estado de Pago */}
          <span
            className={`badge ${
              pedido.estado_pago === "pagado"
                ? "bg-success text-white"
                : "bg-warning text-dark"
            }`}
            style={{ padding: "0.3rem 0.8rem" }}
          >
            {pedido.estado_pago === "pagado" ? "Pagado" : "Por Pagar"}
          </span>
        </div>
        <div className="col-md-1 p-0 m-0">{estadoActual.botones}</div>
      </div>
    </div>
  );
};

export default PedidoCard;
