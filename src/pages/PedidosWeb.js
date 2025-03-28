import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPedidosPendientes } from "../service/GetPedidosPendientes";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import PedidoCard from "../components/componenteVender/CardPedidosPendientes";
import { Cargando } from "../components/componentesReutilizables/Cargando";
import axiosInstance from "../api/AxiosInstance";
import { getPedidosEnProceso } from "../service/GetPedidosProceso";
import { getPedidosListos } from "../service/GetPedidosListos";

import {
  CheckmarkDoneCircleOutline,
  ColorFillOutline,
  HourglassOutline,
} from "react-ionicons";
import ModalRight from "../components/componentesReutilizables/ModalRight";
import { ModalFooter } from "../components/componenteVender/cuerpoModalRight/ModalFooter";
import { ModalCabecera } from "../components/componenteVender/cuerpoModalRight/ModalCabecera";
import { ModalCuerpo } from "../components/componenteVender/cuerpoModalRight/ModalCuerpo";

export function PedidosWeb() {
  const queryClient = useQueryClient();

  const {
    data: listaPedidosProceso = [],
    isLoading: isLoadingProceso,
    isError: isErrorProceso,
  } = useQuery({
    queryKey: ["listaPedidosProceso"],
    queryFn: getPedidosEnProceso,
  });

  const {
    data: listaPedidosListos = [],
    isLoading: isLoadingListos,
    isError: isErrorListos,
  } = useQuery({
    queryKey: ["listaPedidosListos"],
    queryFn: getPedidosListos,
  });

  const {
    data: listaPedidos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pedidosPendientes"],
    queryFn: getPedidosPendientes,
  });

  const [pedidos, setPedidos] = useState({
    pendientes: [],
    proceso: [],
    listos: [],
  });

  // PEDIDOS PENDIENTES
  useEffect(() => {
    if (listaPedidos.length > 0 && pedidos.pendientes !== listaPedidos) {
      setPedidos((prev) => ({ ...prev, pendientes: listaPedidos }));
    }
  }, [listaPedidos]);

  // PEDIDOS EN PROCESO
  useEffect(() => {
    if (
      listaPedidosProceso.length > 0 &&
      pedidos.proceso !== listaPedidosProceso
    ) {
      setPedidos((prev) => ({ ...prev, proceso: listaPedidosProceso }));
    }
  }, [listaPedidosProceso]);

  // PEDIDOS LISTOS
  useEffect(() => {
    if (
      listaPedidosListos.length > 0 &&
      pedidos.listos !== listaPedidosListos
    ) {
      setPedidos((prev) => ({ ...prev, listos: listaPedidosListos }));
    }
  }, [listaPedidosListos]);

  useEffect(() => {
    const pusher = new Pusher("3a474e6680223eaa4e3f", {
      cluster: "eu",
      forceTLS: true,
    });

    const channel = pusher.subscribe("pedidosPendiente");
    channel.bind("pedido.creado", () => {
      console.log("🎯 Nuevo pedido recibido. Actualizando lista...");
      queryClient.invalidateQueries(["pedidosPendientes"]);
    });

    return () => {
      channel.unbind_all();
      pusher.disconnect();
    };
  }, [queryClient]);

  const estadoMap = {
    pendientes: 3,
    proceso: 4,
    listos: 5,
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return; // Si se suelta fuera de un droppable, no hacer nada.

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;

    if (sourceColumn === destColumn) return; // Si se suelta en la misma columna, no hacer nada.

    // Convertir el identificador de la columna destino a su número de estado correspondiente
    const nuevoEstado = estadoMap[destColumn];

    if (!nuevoEstado) {
      console.error(`❌ Estado inválido: ${destColumn}`);
      return;
    }

    // Clonar listas antes de modificarlas
    const copiedSourceItems = [...pedidos[sourceColumn]];
    const [movedItem] = copiedSourceItems.splice(source.index, 1);

    const copiedDestItems = [...pedidos[destColumn]];
    movedItem.estado_pedido = nuevoEstado; // 🔹 Actualizar el estado del pedido
    copiedDestItems.splice(destination.index, 0, movedItem);

    // Actualizar estado localmente
    setPedidos((prev) => ({
      ...prev,
      [sourceColumn]: copiedSourceItems,
      [destColumn]: copiedDestItems,
    }));

    try {
      await axiosInstance.put("/pedidosPendientes/cambiarEstado", {
        idPedido: movedItem.id,
        nuevoEstado: nuevoEstado, // Ahora es un número
      });
      console.log(`✅ Pedido ${movedItem.id} cambiado a estado ${nuevoEstado}`);
    } catch (error) {
      console.error("❌ Error al actualizar el estado del pedido:", error);
      // Opcional: Revertir el estado si la actualización falla
      setPedidos((prev) => ({
        ...prev,
        [sourceColumn]: [...copiedSourceItems, movedItem],
        [destColumn]: copiedDestItems.filter(
          (item) => item.id !== movedItem.id
        ),
      }));
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null); // Estado para el pedido seleccionado

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="row g-2 w-100 h-100">
        {[
          {
            key: "pendientes",
            title: "Pendientes - Pago",
            color: "#FFF8F1",
            border: "#ffc100",
            icon: (
              <HourglassOutline color={"#5F4100"} height="50px" width="50px" />
            ),
          },
          {
            key: "proceso",
            title: "En Proceso",
            color: "#EDF1FF",
            border: "#00A8E4",
            icon: (
              <ColorFillOutline color={"#1D4468"} height="50px" width="50px" />
            ),
          },
          {
            key: "listos",
            title: "Listo - Para recoger",
            color: "#EDFFF4",
            border: "#28A745",
            icon: (
              <CheckmarkDoneCircleOutline
                color={"#0F3F09"}
                height="50px"
                width="50px"
              />
            ),
          },
        ].map(({ key, title, color, border, icon }) => (
          <div key={key} className="col-md-4 d-flex flex-column">
            <div
              className="shadow-sm flex-grow-1 h-100 d-flex flex-column rounded"
              style={{
                borderTop: `10px solid ${border}`,
                background: color,
              }}
            >
              <div className="d-flex card-header bg-transparent border-bottom p-3 text-center">
                <h3 className="text-dark">{title}</h3>
                <div className="text-end ms-auto">{icon}</div>
              </div>
              <Droppable droppableId={key}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="card-body overflow-auto p-3"
                    style={{ height: "calc(100vh - 215px)" }}
                  >
                    {isLoading && <Cargando />}
                    {isError && (
                      <div className="error">
                        Error al cargar Pedidos Pendientes
                      </div>
                    )}
                    {pedidos[key].map((pedido, index) => (
                      <Draggable
                        key={pedido.id}
                        draggableId={pedido.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <PedidoCard
                              pedido={pedido}
                              onOpenModal={() => {
                                setSelectedPedido(pedido); // Guardar el pedido seleccionado
                                setIsModalOpen(true); // Abrir el modal
                              }}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        ))}
      </div>
      <ModalRight
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPedido(null); // Limpiar el pedido seleccionado al cerrar
        }}
        title="Detalles del Pedido"
        submitText="Pagar"
        hideFooter={true}
        onSubmit={() => {
          setIsModalOpen(false);
        }}
      >
        {selectedPedido ? (
          <div className="card p-0 rounded-0 border-none ">
            {/* ============================= */}
            {/* CABECERA DEL MODAL*/}
            {/* ============================= */}
            <ModalCabecera selectedPedido={selectedPedido} />
            {/* ============================= */}
            {/* CUERPO DEL MODAL*/}
            {/* ============================= */}
            <ModalCuerpo selectedPedido={selectedPedido} />

            {/* ============================= */}
            {/* PIES DEL MODAL*/}
            {/* ============================= */}
            <ModalFooter selectedPedido={selectedPedido} />
          </div>
        ) : (
          <p>Cargando detalles...</p>
        )}
      </ModalRight>
    </DragDropContext>
  );
}
