import { useQuery } from "@tanstack/react-query";
import { GetAlmacen } from "../../service/serviceAlmacen/GetAlmacen";
import { Cargando } from "../componentesReutilizables/Cargando";
import { useEffect, useMemo, useState } from "react";

import { DestinoTransferir } from "./componenteTransferir/DestinoTransferir";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  clearProductoSelececcionado,
  removeItem,
  removeProductoSeleccionado,
} from "../../redux/productoTransferirSlice";
import {
  Check,
  CheckCheck,
  Minus,
  PlusIcon,
  Search,
  Trash2,
} from "lucide-react";
import ToastAlert from "../componenteToast/ToastAlert";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TransferirAlmacen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const dispatch = useDispatch();
  const seleccionados = useSelector((state) => state.productoTransferir.items);
  const seleccionadosById = useMemo(
    () => new Map(seleccionados.map((item) => [item.id, item])),
    [seleccionados],
  );

  // Animación del ripple
  const [ripple, setRipple] = useState({
    x: 0,
    y: 0,
    size: 0,
    show: false,
    id: null,
  });

  const handleClick = (e, item) => {
    const stockDisponible = Number(item?.cantidad) || 0;
    const seleccionado = seleccionadosById.get(item?.id);

    if (stockDisponible <= 0) {
      ToastAlert("warning", "Este producto no tiene stock disponible.");
      return;
    }

    if (seleccionado && seleccionado.cantidad >= stockDisponible) {
      ToastAlert("warning", "No puedes transferir más de su stock disponible.");
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();

    // Activa el ripple solo para este ítem
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      size: Math.max(rect.width, rect.height),
      show: true,
      id: item?.id,
    });

    // Agregar al store Redux
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

    // Desactiva el efecto ripple después de 600 ms
    setTimeout(() => setRipple((prev) => ({ ...prev, show: false })), 600);
  };
  // ===================

  const {
    data: dataAlmacen = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["almacen"],
    queryFn: GetAlmacen, // sin paréntesis ❗ (React Query la ejecuta)
    retry: 1,
  });

  // ===================
  // FILTRAR LOS DATOS
  // ===================
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

  return (
    <div className="grid grid-cols-12 gap-3">
      <div className="lg:col-span-4 md:col-span-4 col-span-full">
        <Card className="border h-full">
          <CardHeader className="flex items-center">
            <CardTitle asChild>
              <p className="">Almacen</p>
            </CardTitle>
            <div className="ms-auto relative flex">
              <Search className="absolute my-2 text-muted-foreground ms-2" />
              <input
                className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ps-5"
                type="search"
                inputmode="search"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  paddingLeft: "2.5rem", // Asegura espacio para el icono
                }}
              />
            </div>
          </CardHeader>

          <CardContent
            className="p-2 overflow-auto m-0 bg-muted"
            style={{ maxHeight: "calc(100vh - 340px)" }}
          >
            {isLoading ? (
              <Cargando className="py-4" />
            ) : isError ? (
              <p className="text-muted-foreground py-4 text-center">
                Error al cargar datos
              </p>
            ) : (
              <ul className="flex flex-col divide-y">
                {filteredData?.map((item, index) => (
                  <li
                    key={item?.id}
                    className={`bg-background px-4 py-3 text-foreground flex justify-between items-center border-0 border-b relative overflow-hidden ${
                      seleccionados.some((sel) => sel.id === item?.id)
                        ? "bg-success-subtle"
                        : ""
                    }${Number(item?.cantidad) <= 0 ? "opacity-50 pointer-events-none" : ""}`}
                    onClick={(e) => handleClick(e, item)}
                  >
                    {/* Efecto Ripple (solo para este ítem) */}
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

                    <div className="flex items-center gap-2">
                      {seleccionados.some((sel) => sel.id === item?.id) ? (
                        <CheckCheck
                          className="text-emerald-600 dark:text-emerald-400"
                          width="22px"
                          height="22px"
                          style={{ flexShrink: 0 }}
                        />
                      ) : (
                        <Check
                          className="text-muted-foreground"
                          width="22px"
                          height="22px"
                          style={{ flexShrink: 0 }}
                        />
                      )}
                      <div className="flex flex-col">
                        <span>{item?.nombre}</span>

                        <small className="text-muted-foreground">
                          {item?.marca} / {item?.descripcion} /{" "}
                          {item?.presentacion}
                        </small>
                      </div>
                    </div>
                    <div>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors bg-muted text-muted-foreground me-1">
                        Stock {item?.cantidad}
                      </span>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors bg-secondary">
                        S/. {item?.precioUnit}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-4 md:col-span-4 col-span-full">
        <Card className="h-full border">
          <CardHeader className="flex">
            <CardTitle asChild>
              <p className="">Seleccionados ({seleccionados?.length})</p>
            </CardTitle>
            <div className="ms-auto">
              <Button
                className="shadow h-8 px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-destructive bg-background text-destructive hover:bg-destructive/10"
                onClick={() => dispatch(clearProductoSelececcionado())}
                variant="destructive"
              >
                Borrar todo
              </Button>
            </div>
          </CardHeader>
          <CardContent
            className="overflow-auto bg-muted"
            style={{ maxHeight: "calc(100vh - 340px)" }}
          >
            {seleccionados?.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No hay items seleccionados
              </p>
            ) : (
              <ul className="flex flex-col divide-y">
                {seleccionados.map((item) => (
                  <li
                    key={item?.id}
                    className="border-b bg-background px-4 py-3 text-foreground flex justify-between items-center relative"
                  >
                    <div className="flex items-center gap-2">
                      {/* Botón eliminar, oculto hasta hover */}
                      <Button
                        className="shadow h-8 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-destructive bg-background text-destructive hover:bg-destructive/10 p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            removeProductoSeleccionado({ id: item?.id }),
                          );
                        }}
                        variant="destructive"
                      >
                        <Trash2 />
                      </Button>

                      <div className="flex flex-col">
                        <span className="font-bold text-muted-foreground">
                          {item?.nombre}
                        </span>
                        <small className="text-muted-foreground">
                          {item?.marca} / {item?.descripcion} /{" "}
                          {item?.presentacion}
                        </small>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <div className="flex items-center" role="group">
                        <Button
                          className="shadow border-input bg-background text-foreground hover:bg-accent inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 text-xs p-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(removeItem({ id: item?.id }));
                          }}
                          disabled={item?.cantidad <= 1}
                          variant="default"
                        >
                          <Minus size={18} />
                        </Button>

                        <span className="inline-flex items-center rounded-full text-xs font-semibold transition-colors bg-muted text-muted-foreground px-3 py-2">
                          {item?.cantidad}
                        </span>

                        <Button
                          className="border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 text-xs p-2"
                          onClick={(e) => {
                            e.stopPropagation();
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
                            );
                          }}
                          disabled={item?.cantidad >= item?.stock}
                          title={
                            item?.cantidad >= item?.stock
                              ? "Cantidad máxima alcanzada"
                              : "Aumentar cantidad"
                          }
                          variant="default"
                        >
                          <PlusIcon size={18} />
                        </Button>
                      </div>

                      <div className="flex flex-col text-right">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors bg-muted text-muted-foreground border">
                          Stock: {item?.stock ?? "--"}
                        </span>
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors bg-secondary mt-1">
                          S/. {(item?.precioUnit * item?.cantidad).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-4 md:col-span-4 col-span-full">
        <Card className="border h-full">
          <CardHeader className="border-b">
            <CardTitle asChild>
              <p className="">Destino</p>
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-muted">
            <DestinoTransferir />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
