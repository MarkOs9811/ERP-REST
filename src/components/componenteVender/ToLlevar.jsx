import { useNavigate } from "react-router-dom";

import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import { CardPlatos } from "./CardPlatos";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  clearPedidoLlevar,
  removeItem,
  setDescripcion, // Importamos la nueva acción
} from "../../redux/pedidoLlevarSlice";

import { setEstado } from "../../redux/tipoVentaSlice";
import { CategoriaPlatos } from "./tareasVender/CategoriaPlatos";
import { useQuery } from "@tanstack/react-query";
import { GetPlatosVender } from "../../service/accionesVender/GetPlatosVender";
import {
  CheckCheckIcon,
  Minus,
  Plus,
  Trash2,
  FileText, // Icono para la nota
  User,
  Utensils,
  Notebook,
  Hamburger,
  StoreIcon,
  ListOrderedIcon, // Icono para cliente/nota
} from "lucide-react";
import { BuscadorPlatos } from "./tareasVender/BuscadorPlatos";
import { useEffect, useMemo, useRef, useState } from "react";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";
import { GetConfi } from "../../service/accionesConfiguracion/GetConfi";
import { GetInventario } from "../../service/GetInventario";
import { OffcanvasColaLlevar } from "./tareasVender/OffCanvaColaLlevar";
import { GetPedidosCocina } from "../../service/accionesVender/GetPedidosCocina";
import {
  isRestaurantBusiness,
  normalizeModuleName,
} from "../../utils/modulePermissions";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import ToastAlert from "../componenteToast/ToastAlert";

export function ToLlevar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [colaAbierta, setColaAbierta] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  
  // Obtenemos items y la descripción del estado
  const { items, descripcion } = useSelector((state) => state.pedidoLlevar);

  const categoriaFiltroPlatos = useSelector(
    (state) => state.categoriaFiltroPlatos.estado,
  );

  const {
    data: configEmpresa = [],
    isLoading: isLoadingConfig,
    isError: isErrorConfig,
  } = useQuery({
    queryKey: ["confiEmpresa"],
    queryFn: GetConfi,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const configTipoVenta = Array.isArray(configEmpresa)
    ? configEmpresa.find(
        (item) => normalizeModuleName(item?.nombre) === "tipo venta",
      )
    : undefined;

  const esComida = isRestaurantBusiness(configEmpresa);
  const claveVenta = esComida
    ? "restaurante"
    : normalizeModuleName(configTipoVenta?.clave);

  // consulta de pedidos detalles pedidos PARA LLEVAR
  const {
    data: todosLosPedidos = [],
    isLoading: isLoadingPedidos,
    isError: isErrorPedidos,
  } = useQuery({
    queryKey: ["pedidosEstado"],
    queryFn: GetPedidosCocina,
    enabled: esComida,
    retry: 0, //  Apagamos el retry local porque Axios ya lo maneja
    refetchOnWindowFocus: false,
    staleTime: 2000, //  Espera 2 segundos antes de permitir otra recarga masiva por WebSockets
  });
  const pedidosLlevar = useMemo(() => {
    return (Array.isArray(todosLosPedidos) ? todosLosPedidos : []).filter(
      (pedido) => pedido.tipo_pedido === "llevar",
    );
  }, [todosLosPedidos]);

  // 2. Solo los pendientes (exclusivo para el contador del botón)
  const pedidosLlevarPendientes = useMemo(() => {
    return pedidosLlevar.filter((pedido) => pedido.estado === 0);
  }, [pedidosLlevar]);

  // 3. Hacemos UNA sola consulta dinámica dependiendo de la clave
  const {
    data: productos = [],
    isLoading: isLoadingProductos,
    isError: isErrorProductos,
  } = useQuery({
    // Usamos keys diferentes para no mezclar la memoria caché
    queryKey: esComida ? ["platos"] : ["inventario"],

    // Llamamos a la función correspondiente
    queryFn: esComida ? GetPlatosVender : GetInventario,

    // Esto evita que la consulta se dispare hasta que claveVenta tenga un valor (se haya cargado la config)
    enabled: !!claveVenta,

    retry: 1,
    refetchOnWindowFocus: false,
  });
  // ===============================

  const handleAddPlatoPreventa = (producto) => {
    // Si NO es comida (es decir, es Tienda/Inventario), validamos el stock
    if (!esComida) {
      // 👉 BUSCAMOS EL PRODUCTO ORIGINAL PARA SABER EL STOCK REAL
      const productoOriginal = productos.find((p) => p.id === producto.id);
      const stockReal = productoOriginal ? productoOriginal.stock : 0;

      const itemEnCarrito = items.find((i) => i.id === producto.id);
      const cantidadActual = itemEnCarrito ? itemEnCarrito.cantidad : 0;

      // 👉 AHORA SÍ COMPARAMOS CON EL STOCK REAL
      if (cantidadActual >= stockReal) {
        return;
      }
    }

    dispatch(addItem({ ...producto, tipo: claveVenta }));
  };
  const handleRemovePlatoPreventa = (productoId) => {
    dispatch(removeItem({ id: productoId }));
  };
  const handleEliminarTodo = () => {
    // Podrías agregar un confirm("¿Seguro?") aquí si deseas
    dispatch(clearPedidoLlevar());
  };

  // Manejador para el cambio de texto
  const handleDescripcionChange = (e) => {
    dispatch(setDescripcion(e.target.value));
  };

  const hanldleRealizarPago = () => {
    dispatch(setEstado("llevar"));
    navigate("/vender/mesas/detallesPago");
  };

  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F2") {
        e.preventDefault();
        if (itemsRef.current.length > 0) {
          hanldleRealizarPago();
        } else {
          ToastAlert("info", "No hay productos en la cuenta para cobrar.");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [items]);

  return (
    <div className="min-h-full bg-transparent lg:h-full lg:min-h-0">
      <div className="grid min-h-full grid-cols-1 gap-3 lg:h-full lg:min-h-0 lg:grid-cols-12">
        <div className="order-2 min-h-[28rem] lg:order-2 lg:col-span-4 lg:min-h-0 xl:col-span-3">
          <Card className="h-full min-h-0 flex flex-col overflow-hidden rounded-xl border-border/70 py-0 shadow-none">
            {/* Header: Título y Botón Eliminar (Reubicado) */}
            <CardHeader className="m-0 flex items-center justify-between border-b   px-3 py-3">
              <h2 className="mb-0 text-sm font-semibold tracking-tight text-foreground">
                Para llevar
              </h2>
              <div className="flex items-center gap-2">

                {claveVenta === "restaurante" ? (
                   <Button
                  size="sm"
                  variant="outline"
                  className="relative h-8 gap-2 rounded-lg border-border/70 px-3"
                  aria-controls="offcanvasColaLlevar"
                  aria-haspopup="dialog"
                  aria-expanded={colaAbierta}
                  onClick={() => setColaAbierta(true)}
                >
                  <ListOrderedIcon className="size-4" strokeWidth={1.8} />
                  Cola
                  {pedidosLlevarPendientes?.length > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 inline-flex min-w-5 items-center justify-center rounded-full border border-background bg-primary px-1.5 py-0.5 text-[10px] font-semibold leading-none text-primary-foreground">
                      {pedidosLlevarPendientes.length}
                    </span>
                  )}
                </Button>
                ) : ("")}
               
                {items.length > 0 && (
                  <Button
                    size="sm"
                    className="h-8 gap-1.5 rounded-lg"
                    onClick={handleEliminarTodo}
                    title="Limpiar cuenta"
                    variant="destructive"
                  >
                    <Trash2 className="size-3.5" />
                    <span>Limpiar</span>
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="min-h-0 flex-1 overflow-auto p-0">
              {/* Lista de Platos */}

              {items.length > 0 ? (
                <div className="overflow-auto rounded-none">
                  <table className="w-full text-sm [&_th]:border-0 [&_td]:border-0">
                    <thead className="sticky top-0 border-b   text-xs text-muted-foreground">
                      <tr>
                        <th
                          scope="col"
                          className="py-2.5 pl-3 text-left font-medium"
                        >
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
                      {items.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-border/50 last:border-0"
                        >
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
                            <div className="mx-auto flex w-fit items-center justify-center rounded-lg border border-border/70   px-0.5">
                              <Button
                                size="icon-sm"
                                className="size-7 text-muted-foreground"
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
                                className="size-7 text-muted-foreground"
                                onClick={() => handleAddPlatoPreventa(item)}
                                variant="ghost"
                                aria-label={`Agregar una unidad de ${item.nombre}`}
                              >
                                <Plus className="size-3.5" />
                              </Button>
                            </div>
                          </td>
                          <td className="py-2.5 pr-3 text-right font-medium text-foreground">
                            S/. {(item.cantidad * item.precio).toFixed(2)}
                          </td>
                          <td className="py-2 text-center pr-2">
                            <Button
                              size="icon-sm"
                              className="size-7"
                              onClick={() =>
                                handleRemovePlatoPreventa(item.id, true)
                              }
                              variant="destructive"
                              aria-label={`Eliminar ${item.nombre} de la cuenta`}
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
                  <p className="mb-0 text-sm">La cuenta está vacía</p>
                </div>
              )}
            </CardContent>

            {/* Footer: Totales y Botón Pagar */}
            <CardFooter className="z-10 flex-col items-stretch gap-3 border-t   p-3">
              {/* SECCIÓN NUEVA: Input de Descripción General */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Notebook className="size-3.5" /> Cliente / notas
                </label>
                <textarea
                  className="min-h-14 w-full resize-none rounded-lg border border-input   px-3 py-2 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
                  rows="2"
                  placeholder="Ej.: Juan Pérez, sin cremas..."
                  value={descripcion}
                  onChange={handleDescripcionChange}
                />
              </div>
              <div className="flex items-end justify-between gap-3">
                <div className="space-y-0.5 text-xs text-muted-foreground">
                  <div>Productos: {items.length}</div>
                  <div>
                    Cant: {items.reduce((acc, i) => acc + i.cantidad, 0)}
                  </div>
                </div>
                <div className="text-right">
                  <small className="block text-xs text-muted-foreground">
                    Total a pagar
                  </small>
                  <span className="text-xl font-semibold tracking-tight text-foreground">
                    S/.{" "}
                    {items
                      .reduce(
                        (acc, item) => acc + item.cantidad * item.precio,
                        0,
                      )
                      .toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                className="h-11 w-full gap-2 rounded-lg font-semibold shadow-sm"
                onClick={hanldleRealizarPago}
                disabled={items.length === 0}
                variant="default"
              >
                <CheckCheckIcon className="size-4" />
                Cobrar / enviar F2
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="order-1 min-h-136 lg:order-1 lg:col-span-8 lg:min-h-0 xl:col-span-9">
          <Card className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border-border/70 py-0 shadow-none">
            <CardHeader className="m-0 flex flex-col items-stretch gap-3 border-b border-border/70  /90 px-3 py-3 sm:px-4">
              <div className="flex min-w-0 flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {claveVenta === "restaurante" ? (
                      <Hamburger className="size-4" />
                    ) : (
                      <StoreIcon className="size-4" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <h2 className="m-0 truncate text-sm font-semibold tracking-tight">
                      {claveVenta === "restaurante"
                        ? "Menú de platos"
                        : "Inventario / productos"}
                    </h2>
                    <p className="mb-0 text-xs text-muted-foreground">
                      Selecciona productos para la venta
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
                  claveVenta={claveVenta}
                  clearSearch={setSearchTerm}
                />
              </div>
            </CardHeader>

            <CondicionCarga
              isLoading={isLoadingConfig || isLoadingProductos}
              isError={isErrorConfig || isErrorProductos}
              mode="cards"
            >
              <CardContent className="grid min-h-0 flex-1 grid-cols-2 content-start gap-2.5 overflow-y-auto bg-muted/20 p-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[1800px]:grid-cols-6 sm:gap-3">
                {productos
                  .filter((producto) => {
                    const matchCategoria =
                      categoriaFiltroPlatos === "todo" ||
                      producto.categoria?.nombre === categoriaFiltroPlatos;
                    const matchSearch = producto.nombre
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase());
                    return matchCategoria && matchSearch;
                  })
                  .map((producto) => {
                    // 1. Buscamos si el producto ya está en el carrito (Redux)
                    const itemEnCarrito = items.find(
                      (i) => i.id === producto.id,
                    );

                    // 2. Extraemos la cantidad (si no está, es 0)
                    const cantidadEnCarrito = itemEnCarrito
                      ? itemEnCarrito.cantidad
                      : 0;

                    // 3. Está seleccionado si hay más de 0 en el carrito
                    const isSelected = cantidadEnCarrito > 0;
                    // ==========================================

                    return (
                      <CardPlatos
                        key={producto.id}
                        item={producto}
                        isSelected={isSelected}
                        cantidadEnCarrito={cantidadEnCarrito}
                        handleAdd={handleAddPlatoPreventa}
                        handleRemove={handleRemovePlatoPreventa}
                        capitalizeFirstLetter={capitalizeFirstLetter}
                        esComida={esComida}
                      />
                    );
                  })}
              </CardContent>
            </CondicionCarga>
          </Card>
        </div>
      </div>
      <OffcanvasColaLlevar
        pedidosCola={pedidosLlevar}
        open={colaAbierta}
        onOpenChange={setColaAbierta}
      />
    </div>
  );
}
