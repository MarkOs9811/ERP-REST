import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/AxiosInstance";

import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import ToastAlert from "../componenteToast/ToastAlert";
import { useDispatch, useSelector } from "react-redux";
import { addItem, clearPedido, removeItem } from "../../redux/pedidoSlice";

import { CardPlatos } from "./CardPlatos";
import { CategoriaPlatos } from "./tareasVender/CategoriaPlatos";
import { GetMesasVender } from "../../service/accionesVender/GetMesasVender";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { setIdPreventaMesa } from "../../redux/mesaSlice";
import { GetPlatosVender } from "../../service/accionesVender/GetPlatosVender";
import {
  FileText,
  Hamburger,
  Minus,
  Notebook,
  Plus,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import BotonAnimado from "../componentesReutilizables/BotonAnimado";
import { BuscadorPlatos } from "./tareasVender/BuscadorPlatos";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";
import { ImprimirTicket } from "./tareasVender/ImprimiTIcket";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

export function ToMesa() {
  const id = useSelector((state) => state.mesa.idPreventaMesa);
  const [imprimirTicket, setImprimirTicket] = useState(true);
  const categoriaFiltroPlatos = useSelector(
    (state) => state.categoriaFiltroPlatos.estado,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [notaPedido, setNotaPedido] = useState("");

  const dispatch = useDispatch();
  const pedido = useSelector((state) => state.pedido);
  const mesas = useSelector((state) => state.pedido.mesas);
  const caja = useSelector((state) => state.caja.caja);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: mesasList = [] } = useQuery({
    queryKey: ["mesas"],
    queryFn: GetMesasVender,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const {
    data: productos = [],
    isLoading: loadinPlatos,
    isError: errorPlatos,
  } = useQuery({
    queryKey: ["platos"],
    queryFn: GetPlatosVender,
  });

  // MUTACIÓN PARA ENVIAR PEDIDO
  const addPlatosMutation = useMutation({
    mutationFn: async ({ datosPreventa, notaPedido, imprimirTicket }) => {
      const response = await axiosInstance.post(
        "/vender/addPlatosPreVentaMesa",
        {
          pedidos: datosPreventa,
          nota: notaPedido,
          imprimirTicket: imprimirTicket,
        },
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        // 1. Mostrar alerta de éxito
        ToastAlert(
          "success",
          `${data.message} MESA ${data.data[0]?.mesa.numero}`,
        );

        // 2. Limpiar estados
        setNotaPedido("");
        dispatch(clearPedido(id));

        // 3. Refrescar datos y redirigir
        queryClient.invalidateQueries(["mesas"]);
        navigate(`/vender/mesas`);
      } else {
        ToastAlert("error", data.message);
      }
    },
    onError: (error) => {
      ToastAlert("error", "Error de conexión: " + error.message);
    },
  });

  const handleVolverToMesas = () => navigate(`/vender/mesas`);

  const handleAddPlatoPreventa = (producto) => {
    dispatch(addItem({ ...producto, mesaId: id }));
  };

  const handleRemovePlatoPreventa = (productoId, eliminarFila = false) => {
    dispatch(removeItem({ id: productoId, mesaId: id, total: eliminarFila }));
  };

  const handleLimpiarMesa = () => {
    dispatch(clearPedido(id));
    setNotaPedido("");
  };

  // PREPARAR DATOS Y EJECUTAR MUTACIÓN
  const handleAddPlatoPreventaMesas = () => {
    console.log("Se hace click en el botón de realizar pedido");
    if (!mesas[id] || mesas[id].items.length === 0) {
      return ToastAlert("error", "No hay platos en el pedido");
    }

    const datosPreventa =
      mesas[id]?.items.map((item) => ({
        idCaja: caja.id,
        idPlato: item.id,
        idMesa: id,
        cantidad: item.cantidad,
        precio: item.precio,
        nota: notaPedido,
      })) || [];

    // Disparamos la mutación
    addPlatosMutation.mutate({
      datosPreventa,
      notaPedido,
      imprimirTicket,
    });
  };

  return (
    <div className="min-h-full bg-transparent lg:h-full lg:min-h-0">
      <div className="grid min-h-full grid-cols-1 gap-3 lg:h-full lg:min-h-0 lg:grid-cols-12">
        <div className="order-2 min-h-[28rem] lg:order-2 lg:col-span-4 lg:min-h-0 xl:col-span-3">
          <Card className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border-border/70 py-0 shadow-none">
            <CardHeader className="border-b bg-background px-3 py-3">
              <div className="flex w-full items-center gap-2">
                <Select
                  value={id ? String(id) : undefined}
                  onValueChange={(value) =>
                    dispatch(setIdPreventaMesa(parseInt(value, 10)))
                  }
                >
                  <SelectTrigger className="min-w-0 flex-1">
                    <SelectValue placeholder="Seleccionar mesa" />
                  </SelectTrigger>
                  <SelectContent>
                    {mesasList
                      .filter((mesa) => mesa.estado === 1)
                      .map((mesa) => (
                        <SelectItem key={mesa.id} value={String(mesa.id)}>
                          Mesa {mesa.numero}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <div className="flex shrink-0 gap-1.5">
                  <Button
                    size="icon"
                    className="size-8"
                    title="Limpiar Pedido"
                    onClick={handleLimpiarMesa}
                    variant="destructive"
                    aria-label="Limpiar pedido"
                  >
                    <Trash2 className="size-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="outline"
                    className="size-8 border-border/70"
                    onClick={handleVolverToMesas}
                    aria-label="Volver a mesas"
                  >
                    <ArrowLeft className="size-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 overflow-auto p-0">
              {pedido.mesas[id] && pedido.mesas[id].items.length > 0 ? (
                <div className="overflow-auto rounded-none">
                  <table className="w-full text-sm [&_th]:border-0 [&_td]:border-0">
                    <thead className="sticky top-0 border-b bg-background text-xs text-muted-foreground">
                      <tr>
                        <th scope="col" className="py-2.5 pl-3 text-left font-medium">
                          Desc.
                        </th>
                        <th
                          scope="col"
                          className="py-2.5 text-center font-medium"
                        >
                          Cant.
                        </th>
                        <th
                          scope="col"
                          className="py-2.5 pr-3 text-right font-medium"
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedido.mesas[id].items.map((item) => (
                        <tr key={item.id} className="border-b border-border/50 last:border-0">
                          <td className="py-2.5 pl-3">
                            <div className="flex flex-col">
                              <span className="line-clamp-2 text-sm font-medium text-foreground">
                                {item.nombre}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                S/. {Number(item.precio).toFixed(2)}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 text-center">
                            <div className="mx-auto flex w-fit items-center justify-center rounded-lg border border-border/70 bg-background px-0.5">
                              <Button
                                size="icon-sm"
                                className="text-muted-foreground"
                                onClick={() =>
                                  handleRemovePlatoPreventa(item.id)
                                }
                                variant="ghost"
                                aria-label={`Quitar una unidad de ${item.nombre}`}
                              >
                                <Minus className="size-3.5" />
                              </Button>
                              <span className="mx-1 min-w-5 text-sm font-medium tabular-nums">
                                {item.cantidad}
                              </span>
                              <Button
                                size="icon-sm"
                                className="text-muted-foreground"
                                onClick={() => handleAddPlatoPreventa(item)}
                                variant="ghost"
                                aria-label={`Agregar una unidad de ${item.nombre}`}
                              >
                                <Plus className="size-3.5" />
                              </Button>
                            </div>
                          </td>
                          <td
                            className="py-2.5 pr-3 text-right font-medium text-foreground"
                          >
                            S/. {Number(item.cantidad * item.precio).toFixed(2)}
                          </td>
                          <td className="py-2 text-center pr-2">
                            <Button
                              size="icon-sm"
                              className="size-7"
                              onClick={() =>
                                handleRemovePlatoPreventa(item.id, true)
                              }
                              variant="destructive"
                              aria-label={`Eliminar ${item.nombre} del pedido`}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex h-full min-h-40 flex-col items-center justify-center gap-2 text-muted-foreground">
                  <FileText className="size-8 opacity-50" />
                  <p className="mb-0 text-sm">Mesa vacía</p>
                </div>
              )}
            </CardContent>

            <CardFooter
              className="z-10 flex-col items-stretch gap-3 border-t bg-background p-3"
            >
              <ImprimirTicket
                itemsCarrito={pedido.mesas[id]?.items}
                imprimirTicket={imprimirTicket}
                setImprimirTicket={setImprimirTicket}
              />
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Notebook className="size-3.5" /> Notas del pedido
                </label>
                <Textarea
                  className="min-h-14 resize-none bg-background text-sm"
                  rows={2}
                  placeholder="Ej.: sin sal, término medio..."
                  value={notaPedido}
                  onChange={(e) => setNotaPedido(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-muted-foreground">
                  Total
                </span>
                <span className="text-xl font-semibold tracking-tight text-foreground">
                  S/.{" "}
                  {(
                    pedido.mesas?.[id]?.items?.reduce(
                      (acc, item) => acc + item.cantidad * item.precio,
                      0,
                    ) || 0
                  ).toFixed(2)}
                </span>
              </div>

              <BotonAnimado
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                onClick={() => handleAddPlatoPreventaMesas()}
                loading={
                  addPlatosMutation.isPending || addPlatosMutation.isLoading
                }
                disabled={
                  !pedido.mesas[id] || pedido.mesas[id].items.length === 0
                }
              >
                Realizar pedido
              </BotonAnimado>
            </CardFooter>
          </Card>
        </div>

        <div className="order-1 min-h-[34rem] lg:order-1 lg:col-span-8 lg:min-h-0 xl:col-span-9">
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
                      Selecciona productos para el pedido
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
                  .filter((producto) => {
                    const matchCat =
                      categoriaFiltroPlatos === "todo" ||
                      producto.categoria?.nombre === categoriaFiltroPlatos;
                    const matchBus = producto.nombre
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase());
                    return matchCat && matchBus;
                  })
                  .map((producto) => {
                    const itemEnCarrito = pedido.mesas[id]?.items.find(
                      (item) => item.id === producto.id,
                    );
                    return (
                      <CardPlatos
                        key={producto.id}
                        item={producto}
                        isSelected={!!itemEnCarrito}
                        cantidadEnCarrito={itemEnCarrito?.cantidad || 0}
                        handleAdd={handleAddPlatoPreventa}
                        handleRemove={handleRemovePlatoPreventa}
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
    </div>
  );
}
