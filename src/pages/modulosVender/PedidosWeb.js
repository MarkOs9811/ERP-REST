import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPedidosPendientes } from "../../service/GetPedidosPendientes";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Cargando } from "../../components/componentesReutilizables/Cargando";
import axiosInstance from "../../api/AxiosInstance";
import { getPedidosEnProceso } from "../../service/GetPedidosProceso";

import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { ModalFooter } from "../../components/componenteVender/cuerpoModalRight/ModalFooter";
import { ModalCabecera } from "../../components/componenteVender/cuerpoModalRight/ModalCabecera";
import { ModalCuerpo } from "../../components/componenteVender/cuerpoModalRight/ModalCuerpo";
import { CheckCheck, CookingPot, Hourglass } from "lucide-react";
import { getPedidosListos } from "../../service/GetPedidosListos";
import CardPedidoDelivery from "../../components/componenteVender/CardPedidosDelivery";

export function PedidosWeb() {
  const queryClient = useQueryClient();

  const {
    data: listaPedidosProceso = [],
    isLoading: isLoadingProceso,
    isError: isErrorProceso,
  } = useQuery({
    queryKey: ["listaPedidosProceso"],
    queryFn: getPedidosEnProceso,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const {
    data: listaPedidosListos = [],
    isLoading: isLoadingListos,
    isError: isErrorListos,
  } = useQuery({
    queryKey: ["listaPedidosListos"],
    queryFn: getPedidosListos,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const {
    data: listaPedidos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pedidosPendientes"],
    queryFn: getPedidosPendientes,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const pedidos = {
    pendientes: listaPedidos,
    proceso: listaPedidosProceso,
    listos: listaPedidosListos,
  };

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
  const queryKeyMap = {
    pendientes: ["pedidosPendientes"],
    proceso: ["listaPedidosProceso"],
    listos: ["listaPedidosListos"],
  };
  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return; // Si se suelta fuera de un droppable, no hacer nada.

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;

    if (sourceColumn === destColumn) return; // Si se suelta en la misma columna, no hacer nada.

    const nuevoEstado = estadoMap[destColumn];

    if (!nuevoEstado) {
      console.error(`❌ Estado inválido: ${destColumn}`);
      return;
    }

    // Identificar las llaves exactas de React Query
    const sourceQueryKey = queryKeyMap[sourceColumn];
    const destQueryKey = queryKeyMap[destColumn];

    // 2. Obtener los datos actuales directamente de la caché de React Query
    const sourceItems = queryClient.getQueryData(sourceQueryKey) || [];
    const destItems = queryClient.getQueryData(destQueryKey) || [];

    // Clonar listas antes de modificarlas
    const copiedSourceItems = [...sourceItems];
    const [movedItem] = copiedSourceItems.splice(source.index, 1);

    const copiedDestItems = [...destItems];
    movedItem.estado_pedido = nuevoEstado; // Actualizar el estado del pedido
    copiedDestItems.splice(destination.index, 0, movedItem);

    // 3. ACTUALIZACIÓN OPTIMISTA: Reemplazamos el setPedidos por setQueryData
    // Esto hace que la UI reaccione al instante sin esperar a Laravel
    queryClient.setQueryData(sourceQueryKey, copiedSourceItems);
    queryClient.setQueryData(destQueryKey, copiedDestItems);

    try {
      // 4. Hacer la petición real de fondo
      await axiosInstance.put("/pedidosPendientes/cambiarEstado", {
        idPedido: movedItem.id,
        nuevoEstado: nuevoEstado,
      });

      // (Opcional) Puedes hacer un invalidateQueries aquí si quieres estar
      // 100% seguro de que nadie más modificó la BD en ese mismo segundo.
      queryClient.invalidateQueries({ queryKey: sourceQueryKey });
      queryClient.invalidateQueries({ queryKey: destQueryKey });
    } catch (error) {
      console.error("Error al mover el pedido:", error);

      // 5. ROLLBACK: Si el backend falla, devolvemos la tarjeta a su lugar original
      queryClient.setQueryData(sourceQueryKey, sourceItems);
      queryClient.setQueryData(destQueryKey, destItems);
      // Aquí podrías agregar un ToastAlert("error", "No se pudo mover el pedido")
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null); // Estado para el pedido seleccionado

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban-container h-100 px-md-0">
        {[
          {
            key: "pendientes",
            title: "Pendientes - Pago",
            color: "#ebf3fa",
            border: "#7ab0e0",
            icon: (
              <Hourglass className="text-auto" height="35px" width="35px" />
            ),
            // Asignamos los estados específicos para esta columna
            colLoading: isLoading,
            colError: isError,
          },
          {
            key: "proceso",
            title: "En Proceso",
            color: "#eef4f9",
            border: "#5a7a98",
            icon: (
              <CookingPot className="text-auto" height="35px" width="35px" />
            ),
            // Asignamos los estados específicos para esta columna
            colLoading: isLoadingProceso,
            colError: isErrorProceso,
          },
          {
            key: "listos",
            title: "Listo - Para recoger",
            color: "#f6fef9",
            border: "#28A745",
            icon: (
              <CheckCheck className="text-auto" height="35px" width="35px" />
            ),
            // Asignamos los estados específicos para esta columna
            colLoading: isLoadingListos,
            colError: isErrorListos,
          },
        ].map(({ key, title, border, icon, colLoading, colError }) => (
          <div key={key} className="kanban-col">
            <div
              className=" kanban-column flex-grow-1 h-100 d-flex flex-column bg-white"
              style={{
                borderTop: `10px solid ${border}`,
                borderRadius: "0.5rem",
              }}
            >
              <div className="d-flex bg-transparent border-bottom p-2 align-items-center">
                <h3 className="text-dark mb-0 fs-5 fw-bold">{title}</h3>
                <div className="text-end ms-auto">{icon}</div>
              </div>

              <Droppable droppableId={key}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-grow-1 overflow-auto p-2 p-md-3"
                  >
                    {/* ESTADOS ESPECÍFICOS DE CARGA PARA CADA COLUMNA */}
                    {colLoading && (
                      <div className="d-flex justify-content-center align-items-center py-4">
                        {/* Opción 1: Tu componente con estilo inline para forzar que gire 
                          (Necesitas tener @keyframes spin definido en tu CSS global, o usar clases como fa-spin) 
                        */}
                        <div style={{ animation: "spin 1s linear infinite" }}>
                          <Cargando />
                        </div>

                        {/* Opción 2: Si el de arriba sigue sin girar, comenta el de arriba 
                          y descomenta este spinner nativo de Bootstrap garantizado al 100%:
                        
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                          </div>
                        */}
                      </div>
                    )}

                    {colError && (
                      <div className="error text-danger text-center fw-bold py-3">
                        Error al cargar Pedidos
                      </div>
                    )}

                    {/* Solo mapeamos los pedidos si NO está cargando */}
                    {!colLoading &&
                      pedidos[key]?.map((pedido, index) => (
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
                              className="mb-3"
                            >
                              <CardPedidoDelivery
                                pedido={pedido}
                                onOpenModal={() => {
                                  setSelectedPedido(pedido);
                                  setIsModalOpen(true);
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

      {/* MODAL (Se queda exactamente igual) */}
      <ModalRight
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPedido(null);
        }}
        title="Detalles del Pedido"
        submitText="Pagar"
        hideFooter={true}
        onSubmit={() => {
          setIsModalOpen(false);
        }}
      >
        {selectedPedido ? (
          <div className="p-0 rounded-0 border-none d-flex flex-column h-100">
            <ModalCabecera selectedPedido={selectedPedido} />
            <ModalCuerpo selectedPedido={selectedPedido} />
            <ModalFooter selectedPedido={selectedPedido} />
          </div>
        ) : (
          <p>Cargando detalles...</p>
        )}
      </ModalRight>
    </DragDropContext>
  );
}
