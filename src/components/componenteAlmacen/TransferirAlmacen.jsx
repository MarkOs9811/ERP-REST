import { useQuery } from "@tanstack/react-query";
import { GetAlmacen } from "../../service/serviceAlmacen/GetAlmacen";
import { Cargando } from "../componentesReutilizables/Cargando";
import { useEffect, useMemo, useState, useRef } from "react"; // <-- Importamos useRef

import { DestinoTransferir } from "./componenteTransferir/DestinoTransferir";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  clearProductoSelececcionado,
  removeItem,
  removeProductoSeleccionado,
} from "../../redux/productoTransferirSlice";
import {
  ArrowLeftRight,
  Boxes,
  Check,
  CheckCheck,
  ClipboardList,
  Minus,
  Package,
  PlusIcon,
  Search,
  Trash2,
  WarehouseIcon,
  X,
} from "lucide-react";
import ToastAlert from "../componenteToast/ToastAlert";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Importamos el virtualizador moderno de Tanstack
import { useVirtualizer } from "@tanstack/react-virtual";

export function TransferirAlmacen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const dispatch = useDispatch();
  const seleccionados = useSelector((state) => state.productoTransferir.items);
  const seleccionadosById = useMemo(
    () => new Map(seleccionados.map((item) => [item.id, item])),
    [seleccionados],
  );
  const totalUnidades = useMemo(
    () =>
      seleccionados.reduce(
        (total, item) => total + (Number(item?.cantidad) || 0),
        0,
      ),
    [seleccionados],
  );

  const [ripple, setRipple] = useState({
    x: 0,
    y: 0,
    size: 0,
    show: false,
    id: null,
  });

  // ===================
  // SELECCIONAR TODO (Corregido para ignorar stock 0)
  // ===================
  const handleSelectAll = () => {
    if (filteredData.length === 0) return;

    filteredData.forEach((item) => {
      const stockDisponible = Number(item?.cantidad) || 0;
      const seleccionado = seleccionadosById.get(item?.id);

      // Si ya está seleccionado, no lo duplicamos en la lista
      if (seleccionado) {
        return;
      }

      dispatch(
        addItem({
          id: item?.id,
          nombre: item?.nombre,
          marca: item?.marca,
          descripcion: item?.descripcion,
          presentacion: item?.presentacion,
          precioUnit: Number(item?.precioUnit) || 0,
          stock: stockDisponible, // Guardará 0 pero permitirá agregarlo
        }),
      );
    });

    ToastAlert("success", "Todos los productos mostrados fueron agregados.");
  };

  const handleClick = (e, item) => {
    const stockDisponible = Number(item?.cantidad) || 0;
    const seleccionado = seleccionadosById.get(item?.id);

    if (
      stockDisponible > 0 &&
      seleccionado &&
      seleccionado.cantidad >= stockDisponible
    ) {
      ToastAlert("warning", "No puedes transferir más de su stock disponible.");
      return;
    }

    if (stockDisponible <= 0 && seleccionado) {
      ToastAlert(
        "warning",
        "Este producto está en cero y ya está en la lista.",
      );
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();

    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      size: Math.max(rect.width, rect.height),
      show: true,
      id: item?.id,
    });

    dispatch(
      addItem({
        id: item?.id,
        nombre: item?.nombre,
        marca: item?.marca,
        descripcion: item?.descripcion,
        presentacion: item?.presentacion,
        precioUnit: Number(item?.precioUnit) || 0,
        stock: stockDisponible,
      }),
    );

    setTimeout(() => setRipple((prev) => ({ ...prev, show: false })), 600);
  };

  const {
    data: dataAlmacen = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["almacen"],
    queryFn: GetAlmacen,
    retry: 1,
  });

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(Array.isArray(dataAlmacen) ? dataAlmacen : []);
    } else {
      const term = searchTerm.toLowerCase();
      const filtrados = (Array.isArray(dataAlmacen) ? dataAlmacen : []).filter(
        (item) =>
          ["nombre", "descripcion", "marca"].some((key) =>
            item[key]?.toLowerCase().includes(term),
          ),
      );
      setFilteredData(filtrados);
    }
  }, [searchTerm, dataAlmacen]);

  // ==========================================
  // CONFIGURACIÓN DE VIRTUALIZACIÓN
  // ==========================================
  const parentRef = useRef(null); // Referencia al contenedor que tiene el scroll

  const rowVirtualizer = useVirtualizer({
    count: filteredData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 92, // Altura aproximada en píxeles de cada botón/item
    overscan: 5, // Renderiza 5 elementos extra fuera de cámara para que el scroll sea ultra fluido
  });

  return (
    <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Card className="flex min-w-0 flex-col overflow-hidden border-border/70 shadow-sm">
        <CardHeader className="gap-4 border-b bg-card p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <WarehouseIcon className="size-5" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base">Almacén</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Elige los productos que deseas transferir.
              </p>
            </div>

            <div className="ms-auto flex flex-col items-end gap-2 shrink-0">
              <Badge variant="secondary">{filteredData.length} productos</Badge>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={handleSelectAll}
                disabled={filteredData.length === 0 || isLoading}
              >
                <CheckCheck className="me-1.5 size-3" />
                Sel. Todo
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              className="h-10 w-full rounded-md border border-input bg-background py-2 pl-9 pr-9 text-sm shadow-sm outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              type="search"
              inputMode="search"
              aria-label="Buscar productos en el almacén"
              placeholder="Buscar por nombre, marca o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                aria-label="Limpiar búsqueda"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setSearchTerm("")}
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </CardHeader>

        {/* Le agregamos el ref al contenedor que tiene el scroll */}
        <CardContent
          ref={parentRef}
          className="min-h-72 flex-1 overflow-auto bg-muted/40 p-3"
          style={{ maxHeight: "calc(100vh - 340px)" }}
        >
          {isLoading ? (
            <Cargando className="py-8" />
          ) : isError ? (
            <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-8 text-center text-sm text-destructive">
              No se pudieron cargar los productos. Intenta nuevamente.
            </p>
          ) : filteredData.length === 0 ? (
            <div className="flex min-h-56 flex-col items-center justify-center gap-2 text-center">
              <Package className="size-8 text-muted-foreground/60" />
              <p className="text-sm font-medium">
                {searchTerm
                  ? "No encontramos productos"
                  : "No hay productos disponibles"}
              </p>
              <p className="max-w-56 text-xs text-muted-foreground">
                {searchTerm
                  ? "Prueba con otro nombre, marca o descripción."
                  : "Los productos con stock aparecerán aquí."}
              </p>
            </div>
          ) : (
            /* Contenedor relativo que simula el tamaño total de los 8,000 elementos */
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const item = filteredData[virtualRow.index];
                const seleccionado = seleccionadosById.has(item?.id);
                const sinStock = Number(item?.cantidad) <= 0;

                return (
                  /* Elemento virtual que se posiciona de forma absoluta según su index */
                  <div
                    key={virtualRow.index}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                      paddingBottom: "8px", // Simula el gap-2 original
                    }}
                  >
                    <button
                      type="button"
                      aria-pressed={seleccionado}
                      aria-label={`${seleccionado ? "Agregar otra unidad de" : "Agregar"} ${item?.nombre}`}
                      className={`relative flex h-full w-full items-center gap-3 overflow-hidden rounded-lg border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                        seleccionado
                          ? "border-primary/40 bg-primary/5 shadow-sm"
                          : "border-border bg-card hover:border-primary/40 hover:bg-accent/50"
                      }`}
                      onClick={(e) => handleClick(e, item)}
                    >
                      {ripple.show && ripple.id === item?.id && (
                        <span
                          className="ripple-effect"
                          style={{
                            left: ripple.x - ripple.size / 2,
                            top: ripple.y - ripple.size / 2,
                            width: ripple.size,
                            height: ripple.size,
                          }}
                        />
                      )}
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                          seleccionado
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {seleccionado ? (
                          <CheckCheck className="size-4" />
                        ) : (
                          <Check className="size-4" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          {item?.nombre}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                          {[item?.marca, item?.descripcion, item?.presentacion]
                            .filter(Boolean)
                            .join(" · ") || "Sin detalles"}
                        </span>
                        <span className="mt-2 flex flex-wrap items-center gap-1.5">
                          <Badge
                            variant={sinStock ? "destructive" : "secondary"}
                            className="h-5"
                          >
                            Stock {item?.cantidad ?? 0}
                          </Badge>
                          <Badge variant="outline" className="h-5">
                            S/. {Number(item?.precioUnit || 0).toFixed(2)}
                          </Badge>
                        </span>
                      </span>
                      {seleccionado && (
                        <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                          {seleccionadosById.get(item?.id)?.cantidad} en lista
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="flex min-w-0 flex-col overflow-hidden border-border/70 shadow-sm">
        <CardHeader className="flex items-start gap-3 border-b p-4 sm:p-5">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <ClipboardList className="size-5" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-base">Productos seleccionados</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Ajusta las cantidades antes de confirmar.
            </p>
          </div>
          <div className="ms-auto flex flex-col items-end gap-2">
            <Badge variant="secondary">{seleccionados.length} productos</Badge>
            <Button
              className="h-8 px-2.5"
              onClick={() => dispatch(clearProductoSelececcionado())}
              disabled={seleccionados.length === 0}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="me-1.5 size-3.5" />
              Vaciar
            </Button>
          </div>
        </CardHeader>
        <CardContent
          className="min-h-72 flex-1 overflow-auto bg-muted/40 p-3"
          style={{ maxHeight: "calc(100vh - 340px)" }}
        >
          {seleccionados.length === 0 ? (
            <div className="flex min-h-56 flex-col items-center justify-center gap-2 text-center">
              <Boxes className="size-8 text-muted-foreground/60" />
              <p className="text-sm font-medium">Tu lista está vacía</p>
              <p className="max-w-56 text-xs text-muted-foreground">
                Selecciona un producto del almacén para comenzar.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {seleccionados.map((item) => (
                <li
                  key={item?.id}
                  className="rounded-lg border border-border bg-card p-3 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <Package className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {item?.nombre}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {[item?.marca, item?.descripcion, item?.presentacion]
                          .filter(Boolean)
                          .join(" · ") || "Sin detalles"}
                      </p>
                    </div>
                    <Button
                      className="size-8 shrink-0"
                      onClick={() =>
                        dispatch(removeProductoSeleccionado({ id: item?.id }))
                      }
                      variant="ghost"
                      size="icon"
                      aria-label={`Quitar ${item?.nombre}`}
                    >
                      <Trash2 className="size-4 text-muted-foreground" />
                    </Button>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
                    <div className="flex items-center rounded-md border bg-background">
                      <Button
                        className="size-8 rounded-r-none"
                        onClick={() => dispatch(removeItem({ id: item?.id }))}
                        disabled={item?.cantidad <= 1}
                        variant="ghost"
                        size="icon"
                        aria-label={`Disminuir cantidad de ${item?.nombre}`}
                      >
                        <Minus className="size-4" />
                      </Button>
                      <span className="min-w-9 text-center text-sm font-semibold tabular-nums">
                        {item?.cantidad}
                      </span>
                      <Button
                        className="size-8 rounded-l-none"
                        onClick={() =>
                          dispatch(
                            addItem({
                              id: item?.id,
                              nombre: item?.nombre,
                              marca: item?.marca,
                              descripcion: item?.descripcion,
                              presentacion: item?.presentacion,
                              precioUnit: item?.precioUnit,
                              stock: item?.stock,
                            }),
                          )
                        }
                        disabled={
                          item?.stock > 0 && item?.cantidad >= item?.stock
                        }
                        title={
                          item?.stock > 0 && item?.cantidad >= item?.stock
                            ? "Cantidad máxima alcanzada"
                            : "Aumentar cantidad"
                        }
                        variant="ghost"
                        size="icon"
                        aria-label={`Aumentar cantidad de ${item?.nombre}`}
                      >
                        <PlusIcon className="size-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="outline">
                        Stock {item?.stock ?? "--"}
                      </Badge>
                      <span className="font-semibold tabular-nums">
                        S/.{" "}
                        {(
                          (Number(item?.precioUnit) || 0) *
                          (Number(item?.cantidad) || 0)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        {seleccionados.length > 0 && (
          <div className="flex items-center justify-between border-t bg-card px-4 py-3 text-sm">
            <span className="text-muted-foreground">Unidades a transferir</span>
            <span className="font-semibold tabular-nums">{totalUnidades}</span>
          </div>
        )}
      </Card>

      <Card className="flex min-w-0 flex-col overflow-hidden border-border/70 shadow-sm md:col-span-2 xl:col-span-1">
        <CardHeader className="flex items-start gap-3 border-b p-4 sm:p-5">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <ArrowLeftRight className="size-5" />
          </div>
          <div>
            <CardTitle className="text-base">Destino</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Revisa el resumen y confirma la transferencia.
            </p>
          </div>
        </CardHeader>
        <CardContent className="flex-1 bg-muted/40 p-3 sm:p-4">
          <DestinoTransferir />
        </CardContent>
      </Card>
    </div>
  );
}
