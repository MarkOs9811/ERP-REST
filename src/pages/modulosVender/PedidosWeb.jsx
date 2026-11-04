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
import { Card } from "@/components/ui/card";


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
      <div className="h-full min-h-0 overflow-x-auto">
        <div className="grid h-full min-h-0 min-w-[900px] grid-cols-3 gap-3 lg:min-w-0">
        {[
          {
            key: "pendientes",
            title: "Pendientes - Pago",
            description: "Esperando confirmación",
            color: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
            icon: (
              <Hourglass className="size-[18px]" />
            ),
            colLoading: isLoading,
            colError: isError,
            items: pedidos.pendientes,
          },
          {
            key: "proceso",
            title: "En Proceso",
            description: "Preparando pedidos",
            color: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
            icon: (
              <CookingPot className="size-[18px]" />
            ),
            colLoading: isLoadingProceso,
            colError: isErrorProceso,
            items: pedidos.proceso,
          },
          {
            key: "listos",
            title: "Listo - Para recoger",
            description: "Pedidos listos para despacho",
            color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
            icon: (
              <CheckCheck className="size-[18px]" />
            ),
            colLoading: isLoadingListos,
            colError: isErrorListos,
            items: pedidos.listos,
          },
        ].map(
          ({
            key,
            title,
            description,
            color,
            icon,
            colLoading,
            colError,
            items,
          }) => (
            <Card
              key={key}
              className="flex min-h-0 min-w-0 flex-col gap-0 overflow-hidden rounded-xl border-border/70 bg-muted/30 p-0 shadow-none"
            >
              <div className="flex items-center justify-between gap-3 border-b border-border/70 bg-card px-3 py-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${color}`}
                  >
                    {icon}
                  </span>
                  <div className="min-w-0">
                    <h3 className="mb-0 truncate text-sm font-semibold tracking-tight text-foreground">
                      {title}
                    </h3>
                    <p className="mb-0 truncate text-xs text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex min-w-7 items-center justify-center rounded-full px-2 py-1 text-xs font-semibold tabular-nums ${color}`}
                >
                  {items?.length > 0 && (
                    <span
                      className={`mr-1.5 size-1.5 rounded-full ${
                        key === "pendientes"
                          ? "animate-pulse bg-amber-500"
                          : key === "proceso"
                            ? "bg-sky-500"
                            : "bg-emerald-500"
                      }`}
                    />
                  )}
                  {items?.length || 0}
                </span>
              </div>

              <Droppable droppableId={key}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto bg-muted/20 p-2"
                  >
                    {colLoading && (
                      <div className="flex min-h-32 flex-1 items-center justify-center">
                        <div className="animate-spin">
                          <Cargando />
                        </div>
                      </div>
                    )}

                    {colError && (
                      <div className="flex min-h-32 flex-1 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 px-3 text-center text-sm text-destructive">
                        No se pudieron cargar los pedidos.
                      </div>
                    )}

                    {!colLoading && !colError && items?.length === 0 && (
                      <div className="flex min-h-32 flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-border/70 bg-background/60 px-3 py-6 text-center">
                        <CheckCheck className="mb-2 size-5 text-muted-foreground/60" />
                        <p className="mb-0 text-xs text-muted-foreground">
                          No hay pedidos en esta etapa
                        </p>
                      </div>
                    )}

                    {!colLoading &&
                      !colError &&
                      items?.map((pedido, index) => (
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
                              className="min-w-0"
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
            </Card>
          ),
        )}
        </div>
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
          <div className="p-0 rounded-none border-none flex flex-col h-full">
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
