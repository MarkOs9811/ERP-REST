import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/AxiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import ModalAlertQuestion from "../componenteToast/ModalAlertQuestion";

// Redux
import { addItem, removeItem, clearPedido } from "../../redux/pedidoSlice";
import {
  setMesaSeparada,
  setItemSeleccionado,
  removeitemSeparado,
  clearCuentaSeparada,
} from "../../redux/cuentaSeparadaSlice";


import { CardPlatos } from "./CardPlatos";
import ToastAlert from "../componenteToast/ToastAlert";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import { TransferirToMesa } from "./tareasVender/TransferirToMesa";
import { setIdPreventaMesa } from "../../redux/mesaSlice";
import { setEstado } from "../../redux/tipoVentaSlice";
import { CategoriaPlatos } from "./tareasVender/CategoriaPlatos";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { GetPlatosVender } from "../../service/accionesVender/GetPlatosVender";
import {
  BanIcon,
  CheckCheck,
  ChevronLeft,
  ClipboardList,
  Minus,
  Plus,
  Repeat,
  Trash2,
  Printer,
  Utensils,
  ChefHat,
  Scissors,
  XCircle,
  Hamburger,
  Clock,
} from "lucide-react";
import { getPreventaMesa } from "../../service/preventaService";
import { BuscadorPlatos } from "./tareasVender/BuscadorPlatos";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";
import BotonAnimado from "../componentesReutilizables/BotonAnimado";
import { TicketPreVenta } from "./TiketsType/TicketPreVenta";
import { FilaPlatoUnificado } from "./tareasVender/FilaPlatoUnificado";
import { BadgeComponent } from "../componentesReutilizables/BadgeComponent";
import { ImprimirTicket } from "./tareasVender/ImprimiTIcket";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function PreventaMesa() {
  const idMesa = useSelector((state) => state.mesa.idPreventaMesa);
  const categoriaFiltroPlatos = useSelector(
    (state) => state.categoriaFiltroPlatos.estado,
  );
  const navigate = useNavigate();
  const caja = useSelector((state) => state.caja.caja);

  const [searchTerm, setSearchTerm] = useState("");

  const { idMesa: idMesaSeparada, itemsSeleccionados } = useSelector(
    (state) => state.cuentaSeparada,
  );
  const isSplitMode = idMesaSeparada === idMesa;

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const pedido = useSelector((state) => state.pedido);
  const mesas = useSelector((state) => state.pedido.mesas);
  const componentRef = useRef();
  const [datosPreventa, setDatosPreventa] = useState(null);

  const [imprimirTicket, setImprimirTicket] = useState(false);

  // Consultas GET (useQuery)
  const {
    data: preventas = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["preventaMesa", idMesa, caja?.id],
    queryFn: () => getPreventaMesa(idMesa, caja.id),
    enabled: !!idMesa && !!caja?.id,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const {
    data: productos = [],
    isLoading: loadinPlatos,
    isError: errorPlatos,
  } = useQuery({
    queryKey: ["platos"],
    queryFn: GetPlatosVender,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const mesaNumero = preventas?.[0]?.mesa?.numero || "";
  const notaPedido = preventas?.[0]?.estadoPedido?.detalles_extras;

  // Filtros de estados
  const platosEnEspera = preventas.filter((p) => p.estadoPedido?.estado === 0);
  const platosCocinando = preventas.filter((p) => p.estadoPedido?.estado === 2);
  const platosEntregados = preventas.filter(
    (p) => p.estadoPedido?.estado === 1,
  );
  const itemsCarrito = pedido.mesas[idMesa]?.items || [];

  // ==========================================
  // MUTACIONES (POST, PUT, DELETE)
  // 1. Mutación para eliminar un plato de la mesa
  const eliminarPlatoMutation = useMutation({
    mutationFn: async (idProducto) => {
      return (
        await axiosInstance.delete(
          `/vender/preventa/deletePlatoPreventa/${idProducto}/${idMesa}`,
        )
      ).data;
    },
    onSuccess: (data) => {
      if (data.success) {
        ToastAlert("success", "Pedido eliminado de la mesa");

        queryClient.invalidateQueries(["preventaMesa", idMesa, caja?.id]);

        //  Redirección segura usando la bandera del backend
        if (data.mesaLiberada && itemsCarrito.length === 0) {
          navigate(-1); // replace: true evita errores en el botón de retroceso
        }
      } else {
        ToastAlert("error", data.message || "Error al eliminar");
      }
    },
    onError: () => {
      ToastAlert("error", "Error de conexión al eliminar el plato");
    },
  });
  // 2. Mutación para enviar platos a cocina
  const enviarCocinaMutation = useMutation({
    mutationFn: async ({ datosEnvio, notaPedido, imprimirTicket }) => {
      return (
        await axiosInstance.post("/vender/addPlatosPreVentaMesa", {
          pedidos: datosEnvio,
          nota: notaPedido,
          imprimirTicket: imprimirTicket,
        })
      ).data;
    },
    onSuccess: (data) => {
      if (data.success) {
        ToastAlert("success", data.message);
        dispatch(clearPedido(idMesa));
        queryClient.invalidateQueries(["mesas"]);
        navigate(-1);
      } else {
        ToastAlert("error", data.message);
      }
    },
    onError: (error) => {
      const msg = error.response?.data?.message || error.message;
      ToastAlert("error", "Error: " + msg);
    },
  });

  // 3. Mutación para anular la mesa completa
  const anularMesaMutation = useMutation({
    mutationFn: async (idEliminar) => {
      return (
        await axiosInstance.delete(`/vender/eliminarPreventaMesa/${idEliminar}`)
      ).data;
    },
    onSuccess: (data) => {
      if (data.success) {
        ToastAlert("success", data.message);
        queryClient.invalidateQueries(["mesas"]);
        setModalQuestion(false);
        navigate(`/vender/mesas`);
      } else {
        ToastAlert("error", data.message);
      }
    },
    onError: () => {
      ToastAlert("error", "Error al anular pedido");
    },
  });

  // 4. Mutación para imprimir el ticket
  const imprimirTicketMutation = useMutation({
    mutationFn: async (payload) => {
      return (await axiosInstance.post("/vender/imprimirGenerico", payload))
        .data;
    },
    onSuccess: (data) => {
      if (data.success) {
        ToastAlert("success", "Pre-cuenta enviada a la impresora");
      } else {
        ToastAlert("error", data.message || "Error al imprimir");
      }
    },
    onError: (error) => {
      const mensajeError =
        error.response?.data?.message || "Error de conexión con el servidor";
      ToastAlert("error", mensajeError);
    },
  });

  // 5. Mutación para actualizar cantidades (Optimizada con UI previa)
  const actualizarCantidadMutation = useMutation({
    mutationFn: async ({ idPlato, nuevaCantidad }) => {
      return (
        await axiosInstance.put(
          `/vender/preventa/actualizarCantidad/${idPlato}/${idMesa}`,
          { cantidad: nuevaCantidad },
        )
      ).data;
    },
    onMutate: async ({ idPlato, nuevaCantidad }) => {
      const queryKey = ["preventaMesa", idMesa, caja?.id];
      await queryClient.cancelQueries({ queryKey });
      const previousPreventas = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData) return oldData;
        const isArray = Array.isArray(oldData);
        const dataList = isArray ? oldData : oldData.data;
        if (!dataList) return oldData;

        const newDataList = dataList.map((item) => {
          if (item.idPlato === idPlato || item.id === idPlato) {
            return { ...item, cantidad: nuevaCantidad };
          }
          return item;
        });
        return isArray ? newDataList : { ...oldData, data: newDataList };
      });
      return { previousPreventas, queryKey };
    },
    onError: (err, variables, context) => {
      if (context?.previousPreventas) {
        queryClient.setQueryData(context.queryKey, context.previousPreventas);
      }
      const mensajeError =
        err.response?.data?.message || "Error al actualizar la cantidad";
      ToastAlert("error", mensajeError);
    },
    onSettled: (data, error, variables, context) => {
      if (context?.queryKey) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }
    },
  });

  // ==========================================
  // HANDLERS (Usando las mutaciones)
  // ==========================================

  const handleAddPlatoPreventa = (producto) => {
    if (isSplitMode) return;
    dispatch(addItem({ ...producto, mesaId: idMesa }));
  };

  const handleDecrementNewItem = (idProducto) => {
    if (isSplitMode) return;
    dispatch(removeItem({ id: idProducto, mesaId: idMesa }));
  };

  const handleRemovePlatoPreventa = (productoId) => {
    if (isSplitMode) return;
    if (eliminarPlatoMutation.isPending) return;
    eliminarPlatoMutation.mutate(productoId);
  };

  const handleAddPlatoPreventaMesas = () => {
    const platosParaEnviar = mesas[idMesa]?.items || [];
    if (platosParaEnviar.length === 0) {
      return ToastAlert("error", "Agrega platos nuevos para enviar a cocina.");
    }

    const datosEnvio = platosParaEnviar.map((item) => ({
      idCaja: caja.id,
      idPlato: item.id,
      idMesa: idMesa,
      cantidad: item.cantidad,
      precio: item.precio,
    }));

    enviarCocinaMutation.mutate({ datosEnvio, notaPedido, imprimirTicket });
  };

  const handleImprimirTicket = () => {
    const dataActual = preventas?.data || preventas;

    if (dataActual && dataActual.length > 0) {
      const contenidoFormateado = dataActual.map((item) => {
        const nombrePlato =
          item.plato?.nombre || item.descripcion || "Item desconocido";
        const cantidad = item.cantidad || 1;
        const precio = item.precio || item.valor_unitario || 0;

        return {
          nombre: nombrePlato,
          cantidad: cantidad,
          precio: precio,
          subtotal: cantidad * precio,
        };
      });

      const totalMesa = contenidoFormateado.reduce(
        (acc, curr) => acc + curr.subtotal,
        0,
      );

      imprimirTicketMutation.mutate({
        titulo: "PRE-CUENTA MESA " + mesaNumero,
        contenido: contenidoFormateado,
        total: totalMesa,
      });
    } else {
      ToastAlert("error", "No hay platos registrados en esta mesa");
    }
  };

  const handleEliminarPreventeMesa = (idEliminar) => {
    if (anularMesaMutation.isPending) return;
    anularMesaMutation.mutate(idEliminar);
  };

  const handleUpdateQuantity = (idReferencia, nuevaCantidad, tipo) => {
    if (tipo !== "nuevo") {
      if (actualizarCantidadMutation.isPending) return;

      actualizarCantidadMutation.mutate({
        idPlato: idReferencia,
        nuevaCantidad: nuevaCantidad,
      });
    }
  };

  // ==========================================
  // ESTADOS Y MODALES LOCALES
  // ==========================================

  const [modalQuestion, setModalQuestion] = useState(false);
  const [idMesaEliminar, setIdMesaEliminar] = useState(null);
  const [modalTransferir, setModalTransferir] = useState(false);

  const handleCancelarPedidosQuestion = () => {
    setModalQuestion(true);
    setIdMesaEliminar(idMesa);
  };

  const handleCloseModalQuestionEliminar = () => {
    setModalQuestion(false);
    setIdMesaEliminar(null);
  };

  const handleVolverMesas = () => {
    if (isSplitMode) dispatch(clearCuentaSeparada());
    navigate(-1);
  };

  const handleTranferirToMesa = () => setModalTransferir(true);
  const handleCloseTransferir = () => setModalTransferir(false);

  const handleRealizarPago = () => {
    dispatch(clearCuentaSeparada());
    dispatch(setIdPreventaMesa(idMesa));
    dispatch(setEstado("mesa"));
    navigate("/vender/mesas/detallesPago");
  };

  const toggleSplitMode = () => {
    isSplitMode
      ? dispatch(clearCuentaSeparada())
      : dispatch(setMesaSeparada(idMesa));
  };

  const handleCheckItem = (item) => {
    const pedidoId = item.id;
    const exists = itemsSeleccionados.find((i) => i.id === pedidoId);
    if (exists) {
      dispatch(removeitemSeparado(pedidoId));
    } else {
      dispatch(
        setItemSeleccionado({
          id: pedidoId,
          plato: item.plato.nombre || item.nombre,
          precio: item.plato.precio || item.precio,
          cantidad: item.cantidad,
        }),
      );
    }
  };

  const handleChangeSplitQuantity = (itemId, change, maxQuantity) => {
    const itemEnRedux = itemsSeleccionados.find((i) => i.id === itemId);
    if (!itemEnRedux) return;
    const newQty = itemEnRedux.cantidad + change;
    if (newQty > 0 && newQty <= maxQuantity) {
      dispatch(setItemSeleccionado({ ...itemEnRedux, cantidad: newQty }));
    }
  };

  const handleCobrarSeleccion = () => {
    if (itemsSeleccionados.length === 0)
      return ToastAlert("error", "Selecciona platos para cobrar.");
    navigate("/vender/mesas/detallesPago");
  };

  // Cálculos de totales
  const totalCarrito = itemsCarrito.reduce(
    (acc, i) => acc + i.cantidad * i.precio,
    0,
  );
  const totalEnEspera = platosEnEspera.reduce(
    (acc, i) => acc + i.cantidad * i.plato.precio,
    0,
  );
  const totalCocinando = platosCocinando.reduce(
    (acc, i) => acc + i.cantidad * i.plato.precio,
    0,
  );
  const totalEntregados = platosEntregados.reduce(
    (acc, i) => acc + i.cantidad * i.plato.precio,
    0,
  );

  const granTotal =
    totalCarrito + totalEnEspera + totalCocinando + totalEntregados;

  const totalSeleccionado = itemsSeleccionados.reduce(
    (acc, i) => acc + i.subtotal,
    0,
  );

  // Reemplazamos los estados manuales por los estados nativos de useMutation
  const isSendingToKitchen = enviarCocinaMutation.isPending;
  const deletingProductId = eliminarPlatoMutation.isPending
    ? eliminarPlatoMutation.variables
    : null;
  const isPrinting = imprimirTicketMutation.isPending;
  const isAnulando = anularMesaMutation.isPending;

  return (
    <div className="min-h-full bg-transparent lg:h-full lg:min-h-0">
      <div className="grid min-h-full grid-cols-1 gap-3 lg:h-full lg:min-h-0 lg:grid-cols-12">
        <div className="order-2 min-h-[28rem] lg:order-2 lg:col-span-4 lg:min-h-0">
          <Card
            className={`flex h-full min-h-0 flex-col overflow-hidden rounded-xl border-border/70 py-0 shadow-none ${isSplitMode ? "ring-2 ring-primary/15" : ""}`}
          >
            <CardHeader
              className={`flex flex-col gap-2 border-b px-3 py-3 ${isSplitMode ? "bg-muted/70" : "bg-background"}`}
            >
              {/* 1. CONTENEDOR SUPERIOR (Título y Botón) */}
              <div className="flex justify-between items-center w-full">
                <div>
                  <h2 className="mb-0 flex items-center gap-2 text-sm font-semibold tracking-tight">
                    {isSplitMode && <Scissors className="size-4" />}{" "}
                    {isSplitMode ? "Separar Cuenta" : `Mesa ${mesaNumero}`}
                    <BadgeComponent
                      label={`PED-${preventas?.[0]?.idPedido}`}
                      className="text-xs px-2"
                      variant="secondary"
                    />
                  </h2>
                  <small className="text-xs text-muted-foreground">
                    {isSplitMode
                      ? "Selecciona items a pagar"
                      : "Resumen de cuenta"}
                  </small>
                </div>

                <Button
                  size="sm"
                  className="h-8 gap-1.5 rounded-lg border-border/70"
                  onClick={isSplitMode ? toggleSplitMode : handleVolverMesas}
                  variant="outline"
                >
                  {isSplitMode ? (
                    <>
                      <XCircle className="size-4" /> Cancelar
                    </>
                  ) : (
                    <>
                      <ChevronLeft className="size-4" /> Volver
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="min-h-0 flex-1 overflow-auto p-2">
              {/* POR CONFIRMAR */}
              {itemsCarrito.length > 0 && (
                <div
                  className={`mb-3 animate__animated animate__fadeIn ${isSplitMode ? "opacity-50" : ""}`}
                >
                  <h6 className="text-amber-600 dark:text-amber-400 font-bold text-sm ms-1 mb-2 flex items-center gap-1">
                    <Plus size={14} /> Por confirmar
                  </h6>
                  {itemsCarrito.map((i) => (
                    <FilaPlatoUnificado
                      key={`cart-${i.id}`}
                      item={i}
                      tipo="nuevo"
                      onUpdateQuantity={handleUpdateQuantity}
                      loadingUpdate={null}
                      onDelete={handleDecrementNewItem}
                      loadingDelete={deletingProductId}
                      isSplitMode={isSplitMode}
                    />
                  ))}
                </div>
              )}

              {/* EN ESPERA */}
              {platosEnEspera.length > 0 && (
                <div className="mb-2">
                  <h6 className="text-amber-600 dark:text-amber-400 font-bold text-sm ms-1 mb-2 flex items-center gap-1">
                    <Clock size={14} /> En espera
                  </h6>
                  {platosEnEspera.map((i) => (
                    <FilaPlatoUnificado
                      key={`esp-${i.id}`}
                      item={i}
                      tipo="enviado"
                      onUpdateQuantity={handleUpdateQuantity}
                      loadingUpdate={
                        actualizarCantidadMutation.isPending &&
                        actualizarCantidadMutation.variables?.idPlato === i.id
                          ? i.id
                          : null
                      }
                      onDelete={handleRemovePlatoPreventa}
                      loadingDelete={deletingProductId}
                      isSplitMode={isSplitMode}
                      reduxItem={itemsSeleccionados.find((s) => s.id === i.id)}
                      onToggleSelect={handleCheckItem}
                      onChangeSplitQty={handleChangeSplitQuantity}
                    />
                  ))}
                </div>
              )}

              {/* EN PREPARACIÓN */}
              {platosCocinando.length > 0 && (
                <div className="mb-2">
                  <h6 className="text-muted-foreground font-bold text-sm ms-1 mb-2 flex items-center gap-1">
                    <ChefHat size={14} /> En preparación
                  </h6>
                  {platosCocinando.map((i) => (
                    <FilaPlatoUnificado
                      key={`coc-${i.id}`}
                      item={i}
                      tipo="cocinando"
                      isSplitMode={isSplitMode}
                      reduxItem={itemsSeleccionados.find((s) => s.id === i.id)}
                      onToggleSelect={handleCheckItem}
                      onChangeSplitQty={handleChangeSplitQuantity}
                    />
                  ))}
                </div>
              )}

              {/* ENTREGADOS */}
              {platosEntregados.length > 0 && (
                <div className="mb-2">
                  <h6 className="text-emerald-600 dark:text-emerald-400 font-bold text-sm ms-1 mb-2 flex items-center gap-1">
                    <CheckCheck size={14} /> Entregados
                  </h6>
                  {platosEntregados.map((i) => (
                    <FilaPlatoUnificado
                      key={`ent-${i.id}`}
                      item={i}
                      tipo="entregado"
                      isSplitMode={isSplitMode}
                      reduxItem={itemsSeleccionados.find((s) => s.id === i.id)}
                      onToggleSelect={handleCheckItem}
                      onChangeSplitQty={handleChangeSplitQuantity}
                    />
                  ))}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex-col items-stretch gap-3 border-t bg-background px-3 py-3">
              <ImprimirTicket
                itemsCarrito={itemsCarrito}
                imprimirTicket={imprimirTicket}
                setImprimirTicket={setImprimirTicket}
              />
              <div className="flex items-end justify-between gap-3">
              <div className="text-xs leading-tight text-muted-foreground">
                  {isSplitMode ? (
                    <div className="font-medium text-foreground">
                      Seleccionados: {itemsSeleccionados.length}
                    </div>
                  ) : (
                    <div>
                      Items:{" "}
                      {itemsCarrito.length +
                        platosEnEspera.length +
                        platosCocinando.length +
                        platosEntregados.length}
                    </div>
                  )}
                  {!isSplitMode && (
                    <div>IGV (18%): S/. {(granTotal * 0.18).toFixed(2)}</div>
                  )}
                </div>
                <div className="text-right">
                  <small className="text-muted-foreground block">
                    {isSplitMode ? "Total Seleccionado" : "Total a Pagar"}
                  </small>
                  <h3 className="m-0 text-xl font-semibold tracking-tight text-foreground">
                    S/.{" "}
                    {(isSplitMode ? totalSeleccionado : granTotal).toFixed(2)}
                  </h3>
                </div>
              </div>

              {isSplitMode ? (
                <BotonAnimado
                  className="mb-2 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  onClick={handleCobrarSeleccion}
                  disabled={totalSeleccionado === 0}
                >
                  Cobrar selección
                </BotonAnimado>
              ) : (
                <>
                  {itemsCarrito.length > 0 ? (
                    <>
                      <div className="flex flex-col gap-2">
                        <BotonAnimado
                          className="mb-2 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                          onClick={handleAddPlatoPreventaMesas}
                          loading={isSendingToKitchen}
                        >
                          Enviar a cocina
                        </BotonAnimado>
                      </div>
                    </>
                  ) : (
                    <BotonAnimado
                      className="mb-2 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                      onClick={handleRealizarPago}
                      disabled={granTotal === 0}
                    >
                      Cobrar mesa
                    </BotonAnimado>
                  )}
                </>
              )}

              {!isSplitMode && itemsCarrito.length === 0 && (
                <div className="col-span-full mb-2">
                  <Button
                    className="h-10 w-full rounded-lg font-medium"
                    onClick={toggleSplitMode}
                    disabled={granTotal === 0}
                    variant="outline"
                  >
                    <Scissors className="size-4" /> Separar cuenta
                  </Button>
                </div>
              )}

              {!isSplitMode && (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Button
                      size="sm"
                      className="h-8 w-full border-border/70 px-1 text-xs"
                      onClick={handleTranferirToMesa}
                      variant="outline"
                    >
                      <Repeat className="size-3.5" /> Mover
                    </Button>
                  </div>
                  <div>
                    <Button
                      size="sm"
                      className="h-8 w-full border-border/70 px-1 text-xs"
                      onClick={handleImprimirTicket}
                      disabled={isPrinting}
                      variant="outline"
                    >
                      <Printer className="size-3.5" />{" "}
                      {isPrinting ? "Imprimiendo..." : "Ticket"}
                    </Button>
                  </div>
                  <div>
                    <Button
                      size="sm"
                      className="h-8 w-full px-1 text-xs"
                      onClick={handleCancelarPedidosQuestion}
                      disabled={platosEntregados.length > 0 || isAnulando}
                      variant="destructive"
                    >
                      <BanIcon className="size-3.5" /> Anular
                    </Button>
                  </div>
                  <div className="col-span-3 mt-1">
                    <div
                      className="flex min-h-14 items-start gap-2 rounded-lg border border-dashed border-border bg-muted/40 p-3"
                    >
                      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground ring-1 ring-border">
                        <ClipboardList className="size-4" strokeWidth={1.8} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <small className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Observaciones:
                        </small>
                        <p
                          className={`m-0 text-sm leading-snug text-foreground ${notaPedido ? "font-medium" : "italic text-muted-foreground"}`}
                        >
                          {notaPedido || (
                            <>Sin notas adicionales...</>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
        <div
          className={`order-1 min-h-[34rem] lg:order-1 lg:col-span-8 lg:min-h-0 ${isSplitMode ? "pointer-events-none opacity-50" : ""}`}
        >
          <Card className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border-border/70 py-0 shadow-none">
            <CardHeader className="m-0 flex flex-col items-stretch gap-3 border-b border-border/70 bg-background/90 px-3 py-3 sm:px-4">
              <div className="flex min-w-0 flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Hamburger className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="m-0 truncate text-sm font-semibold tracking-tight">
                      Menú de platos
                    </h2>
                    <p className="mb-0 text-xs text-muted-foreground">
                      Selecciona productos para la mesa
                    </p>
                  </div>
                </div>
                <div className="min-w-0 w-full sm:max-w-xs">
                  <BuscadorPlatos
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                </div>
              </div>
              <div className="min-w-0">
                <CategoriaPlatos
                  claveVenta={"restaurante"}
                  clearSearch={setSearchTerm}
                />
              </div>
            </CardHeader>
            <CondicionCarga
              isLoading={loadinPlatos}
              isError={errorPlatos}
              mode="cards"
            >
              <CardContent className="grid min-h-0 flex-1 grid-cols-2 content-start gap-2.5 overflow-y-auto bg-muted/20 p-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[1800px]:grid-cols-6 sm:gap-3">
                {productos
                  .filter((p) => {
                    const matchCategoria =
                      categoriaFiltroPlatos === "todo" ||
                      p.categoria?.nombre === categoriaFiltroPlatos;
                    const matchSearch = p.nombre
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase());
                    return matchCategoria && matchSearch;
                  })
                  .map((p) => {
                    const itemEnCarrito = itemsCarrito.find(
                      (item) => item.id === p.id,
                    );
                    return (
                    <CardPlatos
                      key={p.id}
                      item={p}
                      isSelected={!!itemEnCarrito}
                      cantidadEnCarrito={itemEnCarrito?.cantidad || 0}
                      handleAdd={handleAddPlatoPreventa}
                      handleRemove={handleDecrementNewItem}
                      capitalizeFirstLetter={capitalizeFirstLetter}
                      esComida
                    />
                    );
                  })}
              </CardContent>
            </CondicionCarga>
          </Card>
        </div>
      </div>
      <div style={{ display: "none" }}>
        <TicketPreVenta ref={componentRef} dataActual={datosPreventa} />
      </div>

      <ModalAlertQuestion
        show={modalQuestion}
        idEliminar={idMesaEliminar}
        nombre={`Mesa ${mesaNumero || ""}`}
        tipo="Pedidos"
        handleEliminar={handleEliminarPreventeMesa}
        handleCloseModal={handleCloseModalQuestionEliminar}
      />

      <TransferirToMesa
        show={modalTransferir}
        idMesa={idMesa}
        mesa={mesaNumero}
        handleCloseModal={handleCloseTransferir}
      />
    </div>
  );
}
