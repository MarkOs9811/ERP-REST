import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CheckmarkDoneOutline,
  CheckmarkOutline,
  SendOutline,
} from "react-ionicons";
import "../../css/EstilosPedidosWsp.css";
import { GetChat } from "../../service/GetChat";
import moment from "moment";
import "moment/locale/es";
import { sendMessage } from "../../service/SendMessage";
import { CategoriaPlatos } from "./tareasVender/CategoriaPlatos";
import { CardPlatos } from "./CardPlatos";
import { useDispatch, useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import { GetPlatos } from "../../service/GetPlatos";
import CarritoComprasWsp from "./CarritoComprasWsp";
import {
  addItem,
  removeItem,
  clearPedidoWeb,
} from "../../redux/pedidoWebSlice";
import ModalRight from "../componentesReutilizables/ModalRight";

export function MensajeriaPedido() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [newMessage, setNewMessage] = useState("");
  const pedidosWeb = useSelector((state) => state.pedidoWeb.items);
  const pedidosWebPlato = useSelector((state) => state.pedidoWeb);
  const totalPlatos = pedidosWeb.length; // Cantidad de platos únicos en el pedido

  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const categoriaFiltroPlatos = useSelector(
    (state) => state.categoriaFiltroPlatos.estado
  );

  // ✅ Memoizamos el pedido para evitar renders innecesarios
  const pedido = useMemo(() => {
    try {
      const pedidoString = searchParams.get("pedido");
      return pedidoString ? JSON.parse(decodeURIComponent(pedidoString)) : null;
    } catch (error) {
      console.error("Error al parsear el pedido:", error);
      return null;
    }
  }, [searchParams]);

  // 🚀 Obtener mensajes con React Query
  const {
    data: messages,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["chat", pedido?.id], // Clave fija
    queryFn: async () => {
      if (!pedido?.id) return []; // No ejecutar si no hay ID
      return await GetChat({ idPedido: pedido.id });
    },
    enabled: Boolean(pedido?.id), // React Query solo ejecutará cuando haya ID
    refetchInterval: 5000,
  });

  // ✉️ Enviar mensaje
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await sendMessage({
        idPedido: pedido.id,
        mensaje: newMessage,
      });

      setNewMessage(""); // Limpiar input después de enviar el mensaje
    } catch (error) {
      console.error("Error enviando mensaje:", error);
    }
  };

  // 🔹 Función para formatear fecha y hora
  const formatFecha = (fecha) => {
    const fechaMensaje = moment(fecha);
    const hoy = moment().startOf("day");

    if (fechaMensaje.isSame(hoy, "day")) {
      return `HOY ${fechaMensaje.format("HH:mm")}`;
    }
    return fechaMensaje.format("DD/MM/YYYY HH:mm");
  };

  const {
    data: productos,
    isLoading: isLoadingProductos,
    error: errorProductos,
  } = useQuery({
    queryKey: ["productos"], // id podría no ser necesario si los productos son generales
    queryFn: GetPlatos,
  });

  const handleAddPlatoPreventa = (producto) => {
    // Añadir el plato para la mesa actual
    dispatch(addItem({ ...producto }));
  };
  const handleRemovePlatoPreventa = (productoId) => {
    // Eliminar el plato de la mesa actual
    dispatch(removeItem({ id: productoId }));
  };
  const handleEliminarTodo = () => {
    dispatch(clearPedidoWeb());
  };

  const hanldleRealizarPago = () => {
    dispatch(setEstado("llevar"));
    navigate("/vender/ventasMesas/detallesPago");
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="row g-2 h-100 w-100 ">
      {/* Card principal */}
      <div className="col-md-4 col-sm-12 ">
        <div className="card shadow-sm h-100 d-flex flex-column">
          {/* Header con ID del pedido y opciones */}
          <div className="card-header d-flex justify-content-between align-items-center bg-light text-dark">
            <h5 className="text-success fw-bold">
              {pedido ? pedido.cliente : "Desconocido"}
            </h5>
            <div className="d-flex ms-auto align-middle align-items-center">
              <h6 className="mb-0 me-3">
                Pedido N° {pedido ? pedido.id : "Desconocido"}
              </h6>
              <select className="form-select w-auto">
                <option>En proceso</option>
                <option>En camino</option>
                <option>Entregado</option>
              </select>
            </div>
          </div>

          {/* Chat body con scroll */}
          <div
            className="card-body overflow-auto"
            style={{ height: "calc(100vh - 480px)" }}
          >
            {isLoading ? (
              <p>Cargando mensajes...</p>
            ) : isError ? (
              <p>Error al cargar mensajes</p>
            ) : messages?.length > 0 ? (
              messages.map((msg, index) => {
                const esOperador = msg.remitente === "operador"; // Determinar si es operador

                return (
                  <div
                    key={index}
                    className={`d-flex ${
                      esOperador
                        ? "justify-content-end"
                        : "justify-content-start"
                    }`}
                  >
                    <div
                      className={`p-2 rounded shadow-sm mb-2 ${
                        esOperador ? "burbuja-myMsn text-white " : "bg-light"
                      }`}
                      style={{ maxWidth: "75%" }}
                    >
                      <p className="mb-1">{msg.mensaje}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          {formatFecha(msg.created_at)}
                        </small>
                        <small>
                          {msg.status === "visto" ? (
                            <CheckmarkDoneOutline color="green" />
                          ) : (
                            <CheckmarkOutline />
                          )}
                        </small>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No hay mensajes en este chat</p>
            )}
          </div>
          {/* Input para escribir mensajes */}
          <div className="card-footer d-flex">
            <textarea
              className="form-control me-2"
              placeholder="Escribe un mensaje..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // Evita el salto de línea por defecto
                  handleSendMessage(); // Envía el mensaje
                }
              }}
              rows="3" // Ajusta la altura
            />
            <button className="btn btn-primary" onClick={handleSendMessage}>
              <SendOutline color={"auto"} /> Enviar
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-8 d-flex flex-column ">
        <div className="card flex-grow-1 h-100 d-flex flex-column ">
          <div className="card-header d-flex flex-wrap bg-white border-bottom  ">
            <div className="d-flex align-items-center gap-2 w-100">
              <h4 className="mb-0 text-dark">Platos</h4>

              {/* Opciones rápidas */}
              <div className="d-flex flex-wrap gap-2 ms-auto">
                <CategoriaPlatos />
              </div>
            </div>
          </div>

          <div
            className="card-body overflow-y-auto overflow-x-hidden"
            style={{ height: "calc(100vh - 480px)" }}
          >
            <div className="justify-content-start contenedor-platos pb-5">
              {isLoadingProductos ? <p>Cargando productos...</p> : null}
              {errorProductos ? <p>Error: {errorProductos.message}</p> : null}
              {productos && productos.length > 0 ? (
                productos
                  .filter(
                    (producto) =>
                      categoriaFiltroPlatos === "todo" ||
                      producto.categoria?.nombre === categoriaFiltroPlatos
                  )
                  .map((producto) => {
                    const mesaId = id; // Mesa actual desde useParams
                    const isSelected = pedidosWebPlato?.items?.some(
                      (item) => item.id === producto.id
                    );
                    return (
                      <CardPlatos
                        key={producto.id}
                        item={producto}
                        isSelected={isSelected}
                        handleAdd={handleAddPlatoPreventa}
                        handleRemove={handleRemovePlatoPreventa}
                        BASE_URL={BASE_URL}
                        capitalizeFirstLetter={capitalizeFirstLetter}
                      />
                    );
                  })
              ) : (
                <p>No hay productos disponibles</p>
              )}
            </div>
          </div>
        </div>
        <CarritoComprasWsp
          cantidad={totalPlatos}
          onOpenModal={() => setIsModalOpen(true)}
        />

        <ModalRight
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Pedidos Web"
          submitText="Confirmar Pedido"
          onSubmit={() => {
            console.log("Acción confirmada");
            setIsModalOpen(false);
          }}
        >
          {/* Contenido personalizado del modal */}
          <div className="card p-3">
            <div className="card-header">
              <p className="h3">Lista de pedido</p>
            </div>
            <p>Este es el contenido personalizado del modal.</p>
            <input type="text" className="form-control" placeholder="Ejemplo" />
          </div>
        </ModalRight>
      </div>
    </div>
  );
}
