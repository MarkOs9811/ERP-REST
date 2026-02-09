import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/AxiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect, useMemo } from "react";
import ModalAlertQuestion from "../componenteToast/ModalAlertQuestion";

// Redux existente
import { addItem, removeItem, clearPedido } from "../../redux/pedidoSlice";

// NUEVO: Redux para separar cuenta (Tus acciones exactas)
import {
  setMesaSeparada,
  setItemSeleccionado,
  removeitemSeparado,
  clearCuentaSeparada,
} from "../../redux/cuentaSeparadaSlice";

import "../../css/EstilosPreventa.css";
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
  Minus,
  Plus,
  Repeat,
  Trash2,
  ShoppingCart,
  CheckCircle,
  Printer,
  Clock,
  Utensils,
  ChefHat,
  Scissors, // Icono para separar
  XCircle, // Icono cancelar
  CheckSquare, // Icono confirmar selección
} from "lucide-react";
import { getPreventaMesa } from "../../service/preventaService";
import { BuscadorPlatos } from "./tareasVender/BuscadorPlatos";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";
import BotonAnimado from "../componentesReutilizables/BotonAnimado";
import { useReactToPrint } from "react-to-print";
import { TicketPreVenta } from "./TiketsType/TicketPreVenta";

export function PreventaMesa() {
  const idMesa = useSelector((state) => state.mesa.idPreventaMesa);
  const categoriaFiltroPlatos = useSelector(
    (state) => state.categoriaFiltroPlatos.estado,
  );
  const navigate = useNavigate();

  const caja = useSelector((state) => state.caja.caja);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingProductId, setDeletingProductId] = useState(null);

  // === LÓGICA SEPARAR CUENTA ===
  const { idMesa: idMesaSeparada, itemsSeleccionados } = useSelector(
    (state) => state.cuentaSeparada,
  );
  // Si el ID en redux coincide con esta mesa, activamos el modo split
  const isSplitMode = idMesaSeparada === idMesa;

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const pedido = useSelector((state) => state.pedido);
  const mesas = useSelector((state) => state.pedido.mesas);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // Debug para ver selección en consola
  useEffect(() => {
    if (isSplitMode) {
      console.log("🔄 Items Seleccionados (Redux):", itemsSeleccionados);
    }
  }, [itemsSeleccionados, isSplitMode]);

  // DATOS PARA LA IMPRESION
  const componentRef = useRef();
  const [datosPreventa, setDatosPreventa] = useState(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    onAfterPrint: () => {
      setDatosPreventa(null);
    },
  });

  // Preventas desde BD
  const {
    data: preventas = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["preventaMesa", idMesa, caja?.id],
    queryFn: () => getPreventaMesa(idMesa, caja.id),
    enabled: !!idMesa && !!caja?.id,
  });

  const mesa = preventas?.[0]?.mesa?.numero;

  const handleImprimirTicket = async () => {
    const dataActual = preventas?.data || preventas;

    if (dataActual && dataActual.length > 0) {
      setDatosPreventa(dataActual);
      if (componentRef.current) {
        setTimeout(() => {
          handlePrint();
        }, 700);
      }
    } else {
      ToastAlert("error", "No hay platos registrados en esta mesa");
    }
  };

  // Platos disponibles
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

  // Separar preventas en dos: solicitados y enviados
  const platosSolicitados = preventas.filter(
    (p) => p.estadoPedido?.estado === 0,
  );
  const platosEntregados = preventas.filter(
    (p) => p.estadoPedido?.estado === 1,
  );

  // Items en el carrito (Redux - Nuevos por enviar)
  const itemsCarrito = pedido.mesas[idMesa]?.items || [];

  const handleAddPlatoPreventa = (producto) => {
    if (isSplitMode) return; // Bloquear si estamos separando cuenta
    dispatch(addItem({ ...producto, mesaId: idMesa }));
  };

  const handleDecrementNewItem = (idProducto) => {
    if (isSplitMode) return;
    dispatch(removeItem({ id: idProducto, mesaId: idMesa }));
  };

  const handleRemovePlatoPreventa = (productoId) => {
    if (isSplitMode) return;
    handleRemoveFromPreventaByPlato(productoId, idMesa);
  };

  const handleRemoveFromPreventaByPlato = async (idProducto) => {
    setDeletingProductId(idProducto);
    try {
      const response = await axiosInstance.delete(
        `/vender/preventa/deletePlatoPreventa/${idProducto}/${idMesa}`,
      );
      if (response.data.success) {
        ToastAlert("success", "Pedido eliminado de la mesa");
        queryClient.invalidateQueries(["preventaMesa", idMesa, caja?.id]);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleAddPlatoPreventaMesas = async () => {
    try {
      const datosPreventa = Object.keys(mesas).flatMap((mesaId) => {
        return mesas[mesaId].items.map((item) => ({
          idCaja: caja.id,
          idPlato: item.id,
          idMesa: mesaId,
          cantidad: item.cantidad,
          precio: item.precio,
        }));
      });

      const response = await axiosInstance.post(
        "/vender/addPlatosPreVentaMesa",
        { pedidos: datosPreventa },
      );

      if (response.data.success) {
        ToastAlert("success", response.data.message);
        Object.keys(mesas).forEach((mesaId) => {
          dispatch(clearPedido(mesaId));
        });
        navigate(`/vender/mesas`);
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      ToastAlert("error", "Error de conexión: " + error.message);
    }
  };

  const [modalQuestion, setModalQuestion] = useState(false);
  const [idMesaEliminar, setIdMesaEliminar] = useState(null);

  const handleCancelarPedidosQuestion = () => {
    setModalQuestion(true);
    setIdMesaEliminar(idMesa);
  };

  const handleCloseModalQuestionEliminar = () => {
    setModalQuestion(false);
    setIdMesaEliminar(null);
  };

  const handleVolverMesas = () => {
    // Limpiamos modo separar si salimos
    if (isSplitMode) dispatch(clearCuentaSeparada());
    navigate(`/vender/mesas`);
  };

  const handleEliminarPreventeMesa = async (idMesa) => {
    try {
      const response = await axiosInstance.delete(
        `/vender/eliminarPreventaMesa/${idMesa}`,
      );

      if (response.data.success) {
        ToastAlert("success", response.data.message);
        queryClient.invalidateQueries(["mesas"]);
        setModalQuestion(false);
        navigate(`/vender/mesas`);
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      ToastAlert("error", "error" + error);
    }
  };

  const [modalTransferir, setModalTransferir] = useState(false);

  const handleTranferirToMesa = () => {
    setModalTransferir(true);
  };

  const handleCloseTransferir = () => {
    setModalTransferir(false);
  };

  const handleRealizarPago = () => {
    dispatch(clearCuentaSeparada()); // Limpiamos por si acaso
    dispatch(setIdPreventaMesa(idMesa));
    dispatch(setEstado("mesa"));
    navigate("/vender/mesas/detallesPago");
  };

  // === FUNCIONES REDUX SEPARAR CUENTA ===

  const toggleSplitMode = () => {
    if (isSplitMode) {
      dispatch(clearCuentaSeparada());
    } else {
      dispatch(setMesaSeparada(idMesa));
    }
  };

  const handleCheckItem = (item) => {
    // Usamos el ID de la tabla pedidos (item.id) para ser únicos
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
          cantidad: item.cantidad, // Selecciona todo por defecto
        }),
      );
    }
  };

  const handleChangeSplitQuantity = (itemId, change, maxQuantity) => {
    const itemEnRedux = itemsSeleccionados.find((i) => i.id === itemId);
    if (!itemEnRedux) return;

    const newQty = itemEnRedux.cantidad + change;
    if (newQty > 0 && newQty <= maxQuantity) {
      dispatch(
        setItemSeleccionado({
          ...itemEnRedux,
          cantidad: newQty,
        }),
      );
    }
  };

  const handleCobrarSeleccion = () => {
    if (itemsSeleccionados.length === 0) {
      ToastAlert("error", "Selecciona al menos un plato para cobrar.");
      return;
    }
    //Navegar hasta mi ruta de pagar con los items seleccionados en redux
    navigate("/vender/mesas/detallesPago");
  };

  // === MUTACIONES BACKEND ===
  const aumentarMutation = useMutation({
    mutationFn: async (idPlato) => {
      const resp = await axiosInstance.get(
        `/vender/preventa/preventeMesaAumentar/${idPlato}/${idMesa}`,
      );
      return resp.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["preventaMesa", idMesa, caja?.id]);
    },
    onError: (err) => {
      ToastAlert("error", "Error al aumentar: " + err.message);
    },
  });

  const disminuirMutation = useMutation({
    mutationFn: async (idPlato) => {
      const resp = await axiosInstance.get(
        `/vender/preventa/preventeMesaDiminuir/${idPlato}/${idMesa}`,
      );
      return resp.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["preventaMesa", idMesa, caja?.id]);
    },
    onError: (err) => {
      ToastAlert("error", "Error al disminuir: " + err.message);
    },
  });

  // --- RENDERIZADO DE FILA UNIFICADA (CON SOPORTE SPLIT) ---
  const FilaPlatoUnificado = ({
    item,
    tipo,
    // Props originales para lógica normal
    onAdd, // Aumentar (BD o Local)
    onRemove, // Disminuir (BD o Local)
    onDelete, // Eliminar fila (BD o Local)
    loadingDelete,

    // Props nuevas para Split
    isSplitMode,
    reduxItem, // Item si está seleccionado en Redux
    onToggleSelect,
    onChangeSplitQty,
  }) => {
    const nombrePlato = item.plato?.nombre || item.nombre;
    const precioUnitario = item.plato?.precio || item.precio;
    const precioTotal = item.cantidad * precioUnitario;

    // Datos selección
    const isSelected = !!reduxItem;
    const cantidadSeleccionada = reduxItem ? reduxItem.cantidad : 0;
    const precioSeleccionado = reduxItem ? reduxItem.subtotal : 0;

    const opacityClass =
      isSplitMode && !isSelected ? "opacity-50" : "opacity-100";
    const bgClass = tipo === "nuevo" ? "bg-warning bg-opacity-10" : "bg-white";
    const borderClass =
      tipo === "entregado" ? "border-success" : "border-light";

    // Solo permitimos seleccionar items ya pedidos (no nuevos del carrito)
    const canSelect = tipo !== "nuevo";

    // IDs: Para backend usamos item.plato.id, para local item.id, para Redux usamos item.id (fila pedido)
    const idParaRedux = item.id;

    return (
      <div
        className={`d-flex align-items-center justify-content-between p-2 mb-1 rounded border ${bgClass} ${borderClass} ${opacityClass} transition-all`}
      >
        {/* CHECKBOX (Solo aparece en modo Split) */}
        {isSplitMode && canSelect && (
          <div className="me-2">
            <input
              type="checkbox"
              className="form-check-input"
              style={{ transform: "scale(1.2)", cursor: "pointer" }}
              checked={isSelected}
              onChange={() => onToggleSelect(item)}
            />
          </div>
        )}

        {/* Columna Nombre y Estado */}
        <div
          className="d-flex align-items-center gap-2"
          style={{ width: isSplitMode ? "35%" : "40%" }}
        >
          {tipo === "nuevo" && (
            <span className="badge bg-warning text-dark px-1">Nuevo</span>
          )}
          {tipo === "enviado" && <Clock size={16} className="text-secondary" />}
          {tipo === "entregado" && (
            <CheckCheck size={16} className="text-success" />
          )}

          <div className="d-flex flex-column lh-1">
            <span
              className="fw-bold text-dark text-truncate"
              style={{ fontSize: "0.9rem", maxWidth: "140px" }}
            >
              {nombrePlato}
            </span>
            <span className="text-muted small">
              S/. {Number(precioUnitario).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Columna Controles de Cantidad */}
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ width: "30%" }}
        >
          {/* MODO NORMAL: Usamos tus controles originales */}
          {!isSplitMode && (
            <>
              {tipo !== "entregado" ? (
                <div className="d-flex align-items-center bg-white border rounded-pill px-1 shadow-sm">
                  <button
                    className="btn btn-sm btn-link text-dark p-0"
                    style={{ width: "24px", height: "24px" }}
                    onClick={() =>
                      onRemove(tipo === "nuevo" ? item.id : item.idPlato)
                    }
                    disabled={tipo !== "nuevo" && disminuirMutation.isLoading}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="mx-2 fw-bold small">{item.cantidad}</span>
                  <button
                    className="btn btn-sm btn-link text-dark p-0"
                    style={{ width: "24px", height: "24px" }}
                    onClick={() =>
                      onAdd(tipo === "nuevo" ? item : item.idPlato)
                    }
                    disabled={tipo !== "nuevo" && aumentarMutation.isLoading}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              ) : (
                <span className="fw-bold fs-6 text-success">
                  x{item.cantidad}
                </span>
              )}
            </>
          )}

          {/* MODO SPLIT: Controles azules para seleccionar cuanto pagas */}
          {isSplitMode && canSelect && isSelected && (
            <div className="d-flex align-items-center bg-primary bg-opacity-10 border border-primary rounded-pill px-1">
              {item.cantidad > 1 ? (
                <>
                  <button
                    className="btn btn-sm btn-link text-primary p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChangeSplitQty(idParaRedux, -1, item.cantidad);
                    }}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="mx-2 fw-bold small text-primary">
                    {cantidadSeleccionada} / {item.cantidad}
                  </span>
                  <button
                    className="btn btn-sm btn-link text-primary p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChangeSplitQty(idParaRedux, 1, item.cantidad);
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </>
              ) : (
                <span className="mx-2 fw-bold small text-primary">1 / 1</span>
              )}
            </div>
          )}
        </div>

        {/* Columna Total y Eliminar */}
        <div
          className="d-flex align-items-center justify-content-end gap-2"
          style={{ width: "30%" }}
        >
          <span
            className={`fw-bold small ${isSelected ? "text-primary" : "text-dark"}`}
          >
            S/.{" "}
            {isSplitMode && isSelected
              ? Number(precioSeleccionado).toFixed(2)
              : Number(precioTotal).toFixed(2)}
          </span>

          {/* Botón eliminar (solo en modo normal) */}
          {!isSplitMode && tipo !== "entregado" && (
            <button
              className="btn btn-sm btn-link text-danger p-0"
              onClick={() => onDelete(item.id)}
              disabled={loadingDelete === item.id}
            >
              {loadingDelete === item.id ? (
                <Repeat
                  size={16}
                  className="spinner"
                  style={{ animation: "spin 1s linear infinite" }}
                />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) return <p>Cargando mesa...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  // Cálculo de totales unificados
  const totalCarrito = itemsCarrito.reduce(
    (acc, item) => acc + item.cantidad * item.precio,
    0,
  );
  const totalSolicitados = platosSolicitados.reduce(
    (acc, item) => acc + item.cantidad * item.plato.precio,
    0,
  );
  const totalEntregados = platosEntregados.reduce(
    (acc, item) => acc + item.cantidad * item.plato.precio,
    0,
  );
  const granTotal = totalCarrito + totalSolicitados + totalEntregados;

  // Total Seleccionado (Redux)
  const totalSeleccionado = itemsSeleccionados.reduce(
    (acc, item) => acc + item.subtotal,
    0,
  );

  return (
    <div className="h-100 bg-transparent">
      <div className="row g-3 h-100">
        {/* ============ COLUMNA 1: CATÁLOGO DE PLATOS ============ */}
        <div
          className={`col-lg-8 h-100 ${isSplitMode ? "opacity-50 pe-none" : ""}`}
        >
          <div className="card shadow-sm flex-grow-1 h-100 d-flex flex-column">
            <div className="card-header bg-white border-bottom py-2">
              {/* ... (Header catálogo igual al original) ... */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="m-0 text-dark fw-bold d-flex align-items-center gap-2">
                  <Utensils size={18} /> Catálogo
                </h6>
              </div>
              <div className="d-flex flex-column gap-2">
                <BuscadorPlatos
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
                <CategoriaPlatos />
              </div>
            </div>

            <CondicionCarga
              isLoading={loadinPlatos}
              isError={errorPlatos}
              mode="cards"
            >
              <div className="card-body overflow-auto contenedor-platos p-2 bg-light">
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
                    const isSelected = itemsCarrito.some(
                      (item) => item.id === producto.id,
                    );
                    return (
                      <CardPlatos
                        key={producto.id}
                        item={producto}
                        isSelected={isSelected}
                        handleAdd={handleAddPlatoPreventa}
                        handleRemove={(id) => handleDecrementNewItem(id)}
                        BASE_URL={BASE_URL}
                        capitalizeFirstLetter={capitalizeFirstLetter}
                      />
                    );
                  })}
              </div>
            </CondicionCarga>
          </div>
        </div>

        {/* ============ COLUMNA 2: COMANDA UNIFICADA ============ */}
        <div className="col-lg-4 h-100">
          <div
            className={`card shadow border-0 flex-grow-1 h-100 d-flex flex-column overflow-hidden ${isSplitMode ? "border-primary border-2" : ""}`}
          >
            {/* Header Comanda */}
            <div
              className={`card-header d-flex justify-content-between align-items-center p-3 ${isSplitMode ? "bg-warning" : ""}`}
            >
              <div>
                <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                  {isSplitMode ? <Scissors size={20} /> : null}
                  {isSplitMode ? "Separar Cuenta" : `Mesa ${mesa || idMesa}`}
                </h5>
                <small>
                  {isSplitMode
                    ? "Selecciona items a pagar"
                    : "Resumen de cuenta"}
                </small>
              </div>
              <button
                className={`btn btn-sm rounded-pill px-3 ${isSplitMode ? "btn-light text-dark" : "btn-outline-dark"}`}
                onClick={() =>
                  isSplitMode ? toggleSplitMode() : handleVolverMesas()
                }
              >
                {isSplitMode ? (
                  <XCircle size={16} />
                ) : (
                  <ChevronLeft size={16} />
                )}
                {isSplitMode ? " Cancelar" : " Volver"}
              </button>
            </div>

            {/* Cuerpo: Lista Unificada */}
            <div className="card-body overflow-auto p-2 bg-light d-flex flex-column gap-1">
              {/* 1. Nuevos en Carrito */}
              {itemsCarrito.length > 0 && (
                <div
                  className={`mb-3 animate__animated animate__fadeIn ${isSplitMode ? "opacity-50" : ""}`}
                >
                  <h6 className="text-warning fw-bold small ms-1 mb-2 d-flex align-items-center gap-1">
                    <Plus size={14} /> Por confirmar{" "}
                    {isSplitMode && "(No divisible)"}
                  </h6>
                  {itemsCarrito.map((item) => (
                    <FilaPlatoUnificado
                      key={`cart-${item.id}`}
                      item={item}
                      tipo="nuevo"
                      // Pasamos tus funciones originales
                      onAdd={handleAddPlatoPreventa}
                      onRemove={(id) => handleDecrementNewItem(id)}
                      onDelete={(id) => handleDecrementNewItem(id)}
                      loadingDelete={deletingProductId}
                      isSplitMode={isSplitMode}
                    />
                  ))}
                  {!isSplitMode && (
                    <div className="text-end border-top pt-1 mt-1">
                      <small className="text-muted me-2">
                        Subtotal nuevos:
                      </small>
                      <span className="fw-bold text-dark">
                        S/. {totalCarrito.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* 2. Solicitados (En cocina) */}
              {platosSolicitados.length > 0 && (
                <div className="mb-2">
                  <h6 className="text-secondary fw-bold small ms-1 mb-2 d-flex align-items-center gap-1">
                    <ChefHat size={14} /> En preparación
                  </h6>
                  {platosSolicitados.map((item) => (
                    <FilaPlatoUnificado
                      key={`sol-${item.id}`}
                      item={item}
                      tipo="enviado"
                      onAdd={aumentarMutation.mutate}
                      onRemove={disminuirMutation.mutate}
                      onDelete={handleRemovePlatoPreventa}
                      loadingDelete={deletingProductId}
                      // Props Split
                      isSplitMode={isSplitMode}
                      reduxItem={itemsSeleccionados.find(
                        (i) => i.id === item.id,
                      )}
                      onToggleSelect={handleCheckItem}
                      onChangeSplitQty={handleChangeSplitQuantity}
                    />
                  ))}
                </div>
              )}

              {/* 3. Entregados */}
              {platosEntregados.length > 0 && (
                <div className="mb-2">
                  <h6 className="text-success fw-bold small ms-1 mb-2 d-flex align-items-center gap-1">
                    <CheckCheck size={14} /> Entregados
                  </h6>
                  {platosEntregados.map((item) => (
                    <FilaPlatoUnificado
                      key={`ent-${item.id}`}
                      item={item}
                      tipo="entregado"
                      isSplitMode={isSplitMode}
                      reduxItem={itemsSeleccionados.find(
                        (i) => i.id === item.id,
                      )}
                      onToggleSelect={handleCheckItem}
                      onChangeSplitQty={handleChangeSplitQuantity}
                    />
                  ))}
                </div>
              )}

              {itemsCarrito.length === 0 &&
                platosSolicitados.length === 0 &&
                platosEntregados.length === 0 && (
                  <div className="text-center text-muted py-5">
                    <ShoppingCart size={40} className="mb-2 opacity-25" />
                    <p>Mesa libre. Agregue platos.</p>
                  </div>
                )}
            </div>

            {/* Footer de Acciones y Totales */}
            <div className="card-footer bg-white border-top shadow-lg pt-3 pb-2 px-3">
              <div className="d-flex justify-content-between align-items-end mb-3">
                <div className="text-muted small lh-sm">
                  {isSplitMode ? (
                    <div className="text-dark fw-bold">
                      Seleccionados: {itemsSeleccionados.length}
                    </div>
                  ) : (
                    <div>
                      Items:{" "}
                      {itemsCarrito.length +
                        platosSolicitados.length +
                        platosEntregados.length}
                    </div>
                  )}
                  {!isSplitMode && (
                    <div>IGV (18%): S/. {(granTotal * 0.18).toFixed(2)}</div>
                  )}
                </div>
                <div className="text-end">
                  <small className="text-muted d-block">
                    {isSplitMode ? "Total Seleccionado" : "Total a Pagar"}
                  </small>
                  <h3
                    className={`fw-bold m-0 ${isSplitMode ? "text-success" : "text-dark"}`}
                  >
                    S/.{" "}
                    {isSplitMode
                      ? totalSeleccionado.toFixed(2)
                      : granTotal.toFixed(2)}
                  </h3>
                </div>
              </div>

              {/* Botones Principales */}
              {isSplitMode ? (
                <BotonAnimado
                  className="btn-realizarPedido w-100 p-3 mb-2 fw-bold fs-5 shadow-sm btn-primary"
                  onClick={handleCobrarSeleccion}
                  disabled={totalSeleccionado === 0}
                >
                  COBRAR SELECCIÓN
                </BotonAnimado>
              ) : (
                <>
                  {itemsCarrito.length > 0 ? (
                    <BotonAnimado
                      className="btn-realizarPedido w-100 p-3 mb-2 fw-bold fs-5 shadow-sm"
                      onClick={handleAddPlatoPreventaMesas}
                    >
                      <Utensils size={24} className="me-2" /> ENVIAR A COCINA
                    </BotonAnimado>
                  ) : (
                    <BotonAnimado
                      className="btn-realizarPedido w-100 p-3 mb-2 fw-bold fs-5 shadow-sm"
                      onClick={handleRealizarPago}
                      disabled={granTotal === 0}
                    >
                      <CheckCircle size={24} className="me-2" /> COBRAR MESA
                    </BotonAnimado>
                  )}
                </>
              )}

              {/* Botón Separar Cuenta (Solo si no hay carrito nuevo pendiente) */}
              {!isSplitMode && itemsCarrito.length === 0 && (
                <div className="col-12 mb-2">
                  <button
                    className="btn btn-outline-primary w-100 fw-bold shadow-sm"
                    onClick={toggleSplitMode}
                    disabled={granTotal === 0}
                  >
                    <Scissors size={18} className="me-2" /> SEPARAR CUENTA
                  </button>
                </div>
              )}

              {/* Botones Secundarios */}
              {!isSplitMode && (
                <div className="row g-2 mt-1">
                  <div className="col-4">
                    <button
                      className="btn btn-outline-secondary w-100 btn-sm"
                      onClick={handleTranferirToMesa}
                      title="Mover Mesa"
                    >
                      <Repeat size={16} />{" "}
                      <span className="d-none d-lg-inline">Mover</span>
                    </button>
                  </div>
                  <div className="col-4">
                    <button
                      className="btn btn-outline-secondary w-100 btn-sm"
                      onClick={handleImprimirTicket}
                      title="Pre-cuenta"
                    >
                      <Printer size={16} />{" "}
                      <span className="d-none d-lg-inline">Imprimir</span>
                    </button>
                    <div style={{ display: "none" }}>
                      <TicketPreVenta
                        ref={componentRef}
                        dataActual={datosPreventa}
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <button
                      className="btn btn-outline-danger w-100 btn-sm"
                      onClick={handleCancelarPedidosQuestion}
                      disabled={platosEntregados.length > 0}
                      title="Anular Todo"
                    >
                      <BanIcon size={16} />{" "}
                      <span className="d-none d-lg-inline">Anular</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <ModalAlertQuestion
        show={modalQuestion}
        idEliminar={idMesaEliminar}
        nombre={"Mesa " + idMesa}
        tipo={"Pedidos"}
        handleEliminar={handleEliminarPreventeMesa}
        handleCloseModal={handleCloseModalQuestionEliminar}
      />
      <TransferirToMesa
        show={modalTransferir}
        idMesa={idMesa}
        mesa={mesa}
        handleCloseModal={handleCloseTransferir}
      />
    </div>
  );
}
