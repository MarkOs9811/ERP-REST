import { useNavigate } from "react-router-dom";
import "../../css/EstilosPreventa.css";
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
import { useMemo, useState } from "react";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";
import { GetConfi } from "../../service/accionesConfiguracion/GetConfi";
import { GetInventario } from "../../service/GetInventario";
import { OffcanvasColaLlevar } from "./tareasVender/OffCanvaColaLlevar";
import { GetPedidosCocina } from "../../service/accionesVender/GetPedidosCocina";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";


export function ToLlevar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Obtenemos items y la descripción del estado
  const { items, descripcion } = useSelector((state) => state.pedidoLlevar);

  const categoriaFiltroPlatos = useSelector(
    (state) => state.categoriaFiltroPlatos.estado,
  );
  // consulta de pedidos detalles pedidos PARA LLEVAR
  const {
    data: todosLosPedidos = [],
    isLoading: isLoadingPedidos,
    isError: isErrorPedidos,
  } = useQuery({
    queryKey: ["pedidosEstado"],
    queryFn: GetPedidosCocina,
    retry: 0, //  Apagamos el retry local porque Axios ya lo maneja
    refetchOnWindowFocus: false,
    staleTime: 2000, //  Espera 2 segundos antes de permitir otra recarga masiva por WebSockets
  });
  const pedidosLlevar = useMemo(() => {
    return todosLosPedidos.filter((pedido) => pedido.tipo_pedido === "llevar");
  }, [todosLosPedidos]);

  // 2. Solo los pendientes (exclusivo para el contador del botón)
  const pedidosLlevarPendientes = useMemo(() => {
    return pedidosLlevar.filter((pedido) => pedido.estado === 0);
  }, [pedidosLlevar]);

  // CONDICIONAR SI LA CONFIGURACIONDE LA EMRPESA ES PARA VENTAS RESTUARANTE O VENTAS STORE TIENDA NORMAL
  // 1. Primero obtenemos la configuración de la empresa
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

  // 2. Filtramos la configuración
  const configTipoVenta = configEmpresa.find(
    (item) => item.nombre === "Tipo Venta",
  );

  const claveVenta = configTipoVenta?.clave;
  const esComida = claveVenta === "restaurante";

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

  return (
    <div className="h-100 bg-transparent">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4h-100 g-3">
        {/* COLUMNA IZQUIERDA: CUENTA Y DETALLES */}
        <div className="md:col-span-4 col-lg-3 h-100">
          <Card className="flex-grow-1 h-full flex flex-col overflow-hidden">
            {/* Header: Título y Botón Eliminar (Reubicado) */}
            <CardHeader className="m-0 bg-background border-b flex py-3">
              <div className="d-flex justify-content-between align-items-center w-100">
                <h5 className="mb-0 fw-bold text-dark">Para Llevar</h5>
                <div className="d-flex align-items-center gap-2">
                  <Button
                    className="btn-editar d-flex align-items-center gap-2 position-relative rounded-pill px-3"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasColaLlevar"
                    aria-controls="offcanvasColaLlevar"
                   variant="secondary">
                    <ListOrderedIcon size={16} />
                    Cola
                    {pedidosLlevarPendientes?.length > 0 && (
                      <span
                        className="position-absolute top-0 start-0 translate-middle badge rounded-pill"
                        style={{
                          backgroundColor: "var(--fw-strawberry)",
                          color: "var(--fw-white)",
                        }}
                      >
                        {pedidosLlevarPendientes.length}
                      </span>
                    )}
                  </Button>
                  {items.length > 0 && (
                    <Button
                      className="btn-eliminar d-flex align-items-center gap-1"
                      onClick={handleEliminarTodo}
                      title="Limpiar cuenta"
                     variant="destructive">
                      <Trash2 size={16} />
                      <span className="small">Limpiar</span>
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="overflow-auto p-0 flex flex-col">
              {/* Lista de Platos */}

              {items.length > 0 ? (
                <div className="overflow-auto rounded-none  ">
                  <table className="table table-borderless align-middle mb-0">
                    <thead className="text-muted small border-bottom ">
                      <tr>
                        <th scope="col" className="ps-3 fw-normal py-2">
                          Desc.
                        </th>
                        <th scope="col" className="text-center fw-normal py-2">
                          Cant.
                        </th>
                        <th
                          scope="col"
                          className="text-end fw-normal py-2 pe-3"
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-bottom">
                          <td className="ps-3 py-2">
                            <div className="d-flex flex-column">
                              <span
                                className="fw-bold text-dark small"
                                style={{ fontSize: "0.9rem" }}
                              >
                                {item.nombre}
                              </span>
                              <span
                                className="text-muted"
                                style={{ fontSize: "0.75rem" }}
                              >
                                S/. {Number(item.precio).toFixed(2)}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 text-center bg-transparent">
                            <div
                              className="d-flex align-items-center justify-content-center border rounded-pill mx-auto px-1"
                              style={{
                                width: "fit-content",
                                margin: "0 auto",
                              }}
                            >
                              <Button
                                className="btn-informativo btn-icon btn-link border-0 text-dark p-0"
                                style={{ width: "22px" }}
                                onClick={() =>
                                  handleRemovePlatoPreventa(item.id)
                                }
                               variant="default">
                                <Minus size={14} />
                              </Button>
                              <span
                                className="fw-bold mx-1"
                                style={{ fontSize: "0.85rem" }}
                              >
                                {item.cantidad}
                              </span>
                              <Button
                                className="btn-informativo btn-icon btn-link border-0 text-dark p-0"
                                style={{ width: "22px" }}
                                onClick={() => handleAddPlatoPreventa(item)}
                               variant="default">
                                <Plus size={14} />
                              </Button>
                            </div>
                          </td>
                          <td
                            className="text-end py-2 pe-3 fw-bold text-dark"
                            style={{ fontSize: "0.9rem" }}
                          >
                            S/. {(item.cantidad * item.precio).toFixed(2)}
                          </td>
                          <td className="text-center py-2">
                            <Button
                              className="btn-eliminar btn-icon   mx-2 p-0 "
                              onClick={() =>
                                handleRemovePlatoPreventa(item.id, true)
                              }
                             variant="destructive">
                              <Trash2 size={14} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="h-100 d-flex align-items-center justify-content-center opacity-50">
                  <FileText size={40} className="mb-2" />
                  <p className="small mb-0">La cuenta está vacía</p>
                </div>
              )}
            </CardContent>

            {/* Footer: Totales y Botón Pagar */}
            <CardFooter
              className="bg-background border-t p-3 shadow-lg"
              style={{ zIndex: 10 }}
            >
              {/* SECCIÓN NUEVA: Input de Descripción General */}
              <div className="p-3 bg-white mb-2 ">
                <label className="form-label text-success small fw-bold d-flex align-items-center gap-1">
                  <Notebook /> Cliente / Notas del Pedido:
                </label>
                <div className="input-group">
                  <textarea
                    className="form-control  bg-light"
                    rows="2"
                    placeholder="Ej: Juan Perez - Sin cremas, cubiertos extra..."
                    style={{ resize: "none", fontSize: "0.9rem" }}
                    value={descripcion}
                    onChange={handleDescripcionChange}
                  ></textarea>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-end mb-3">
                <div className="text-muted small">
                  <div>Items: {items.length}</div>
                  <div>
                    Cant: {items.reduce((acc, i) => acc + i.cantidad, 0)}
                  </div>
                </div>
                <div className="text-end">
                  <small
                    className="text-muted d-block"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Total a Pagar
                  </small>
                  <span className="h4 fw-bold text-dark mb-0">
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
                className="btn-guardar w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                onClick={hanldleRealizarPago}
                disabled={items.length === 0}
               variant="default">
                <CheckCheckIcon size={20} />
                COBRAR / ENVIAR
              </Button>
            </CardFooter>
          </Card>
        </div>
        {/* COLUMNA DERECHA: CATÁLOGO (Sin cambios mayores, solo ancho) */}
        <div className="md:col-span-8 col-lg-9 h-100 ">
          <Card className="flex flex-grow-1 flex-col h-full p-0 m-0 overflow-auto">
            <CardHeader className="bg-background border-b py-3 px-3 flex items-center gap-3 flex-wrap">
              <div className="d-flex align-items-center gap-2 flex-shrink-0">
                {claveVenta === "restaurante" ? (
                  <Hamburger size={28} />
                ) : (
                  <StoreIcon size={28} />
                )}

                <h6 className="m-0 fw-bold">
                  {claveVenta === "restaurante"
                    ? "Menú de Platos"
                    : "Inventario / Productos"}
                </h6>
              </div>

              {/* Buscador */}
              <div className="flex-grow-1">
                <BuscadorPlatos
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              </div>

              {/* Categorías */}
              <div className="overflow-auto ">
                <CategoriaPlatos
                  claveVenta={claveVenta}
                  clearSearch={setSearchTerm}
                />
              </div>
            </CardHeader>

            <CondicionCarga
              isLoading={isLoadingProductos}
              isError={isErrorProductos}
              mode="cards"
            >
              <CardContent className="p-2 contenedor-platos overflow-x-hidden m-auto">
                {productos
                  .filter((producto) => {
                    const matchCategoria =
                      categoriaFiltroPlatos === "todo" ||
                      producto.categoria.nombre === categoriaFiltroPlatos;
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
                        cantidadEnCarrito={cantidadEnCarrito} // 👉 LE PASAMOS LA CANTIDAD AL CARD
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
      <OffcanvasColaLlevar pedidosCola={pedidosLlevar} />
    </div>
  );
}
