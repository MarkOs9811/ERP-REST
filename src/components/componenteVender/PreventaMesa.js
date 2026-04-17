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
  Printer,
  Utensils,
  ChefHat,
  Scissors,
  XCircle,
  Hamburger,
} from "lucide-react";
import { getPreventaMesa } from "../../service/preventaService";
import { BuscadorPlatos } from "./tareasVender/BuscadorPlatos";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";
import BotonAnimado from "../componentesReutilizables/BotonAnimado";
import { useReactToPrint } from "react-to-print";
import { TicketPreVenta } from "./TiketsType/TicketPreVenta";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";

export function PreventaMesa() {
  const idMesa = useSelector((state) => state.mesa.idPreventaMesa);
  const categoriaFiltroPlatos = useSelector(
    (state) => state.categoriaFiltroPlatos.estado,
  );
  const navigate = useNavigate();
  const caja = useSelector((state) => state.caja.caja);

  const [searchTerm, setSearchTerm] = useState("");
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [isSendingToKitchen, setIsSendingToKitchen] = useState(false); // Reemplazo de setLoadingPedido

  const { idMesa: idMesaSeparada, itemsSeleccionados } = useSelector(
    (state) => state.cuentaSeparada,
  );
  const isSplitMode = idMesaSeparada === idMesa;

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const pedido = useSelector((state) => state.pedido);
  const mesas = useSelector((state) => state.pedido.mesas);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const componentRef = useRef();
  const [datosPreventa, setDatosPreventa] = useState(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    onAfterPrint: () => setDatosPreventa(null),
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

  const mesaNumero = preventas?.[0]?.mesa?.numero;
  const notaPedido = preventas?.[0]?.estadoPedido?.detalles_extras;

  const handleImprimirTicket = async () => {
    const dataActual = preventas?.data || preventas;
    if (dataActual && dataActual.length > 0) {
      setDatosPreventa(dataActual);
      setTimeout(() => handlePrint(), 700);
    } else {
      ToastAlert("error", "No hay platos registrados en esta mesa");
    }
  };

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

  const platosSolicitados = preventas.filter(
    (p) => p.estadoPedido?.estado === 0,
  );
  const platosEntregados = preventas.filter(
    (p) => p.estadoPedido?.estado === 1,
  );
  const itemsCarrito = pedido.mesas[idMesa]?.items || [];

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
    handleRemoveFromPreventaByPlato(productoId);
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
      ToastAlert("error", "No se pudo eliminar el plato");
    } finally {
      setDeletingProductId(null);
    }
  };

  // FUNCIÓN CORREGIDA PARA ACTUALIZAR PREVENTA (ENVIAR A COCINA)
  const handleAddPlatoPreventaMesas = async () => {
    const platosParaEnviar = mesas[idMesa]?.items || [];

    if (platosParaEnviar.length === 0) {
      return ToastAlert("error", "Agrega platos nuevos para enviar a cocina.");
    }

    setIsSendingToKitchen(true);

    try {
      // Mapeamos solo los platos de la mesa actual asegurando el idMesa correcto
      const datosEnvio = platosParaEnviar.map((item) => ({
        idCaja: caja.id,
        idPlato: item.id,
        idMesa: idMesa, // Usamos la variable idMesa del selector
        cantidad: item.cantidad,
        precio: item.precio,
      }));

      const response = await axiosInstance.post(
        "/vender/addPlatosPreVentaMesa",
        {
          pedidos: datosEnvio,
          nota: notaPedido, // Mantener la nota existente si la hubiera
        },
      );

      if (response.data.success) {
        ToastAlert("success", response.data.message);
        dispatch(clearPedido(idMesa)); // Limpiar solo esta mesa
        queryClient.invalidateQueries(["preventaMesa", idMesa, caja?.id]);
        queryClient.invalidateQueries(["mesas"]);
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      ToastAlert("error", "Error: " + msg);
    } finally {
      setIsSendingToKitchen(false);
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
    if (isSplitMode) dispatch(clearCuentaSeparada());
    navigate(-1);
  };

  const handleEliminarPreventeMesa = async (idEliminar) => {
    try {
      const response = await axiosInstance.delete(
        `/vender/eliminarPreventaMesa/${idEliminar}`,
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
      ToastAlert("error", "Error al anular pedido");
    }
  };

  const [modalTransferir, setModalTransferir] = useState(false);
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

  const aumentarMutation = useMutation({
    mutationFn: async (idPlato) =>
      (
        await axiosInstance.get(
          `/vender/preventa/preventeMesaAumentar/${idPlato}/${idMesa}`,
        )
      ).data,
    onSuccess: () =>
      queryClient.invalidateQueries(["preventaMesa", idMesa, caja?.id]),
    onError: (err) => ToastAlert("error", "Error al aumentar: " + err.message),
  });

  const disminuirMutation = useMutation({
    mutationFn: async (idPlato) =>
      (
        await axiosInstance.get(
          `/vender/preventa/preventeMesaDiminuir/${idPlato}/${idMesa}`,
        )
      ).data,
    onSuccess: () =>
      queryClient.invalidateQueries(["preventaMesa", idMesa, caja?.id]),
    onError: (err) => ToastAlert("error", "Error al disminuir: " + err.message),
  });

  const FilaPlatoUnificado = ({
    item,
    tipo,
    onAdd,
    onRemove,
    onDelete,
    loadingDelete,
    isSplitMode,
    reduxItem,
    onToggleSelect,
    onChangeSplitQty,
  }) => {
    const nombrePlato = item.plato?.nombre || item.nombre;
    const precioUnitario = item.plato?.precio || item.precio;
    const precioTotal = item.cantidad * precioUnitario;
    const isSelected = !!reduxItem;
    const cantidadSeleccionada = reduxItem ? reduxItem.cantidad : 0;
    const precioSeleccionado = reduxItem ? reduxItem.subtotal : 0;

    const opacityClass =
      isSplitMode && !isSelected ? "opacity-50" : "opacity-100";
    const bgClass = tipo === "nuevo" ? "bg-warning bg-opacity-10" : "bg-white";
    const borderClass =
      tipo === "entregado" ? "border-success" : "border-light";
    const canSelect = tipo !== "nuevo";

    return (
      <div
        className={`d-flex align-items-center justify-content-between p-2 mb-1 rounded border ${bgClass} ${borderClass} ${opacityClass} transition-all`}
      >
        {isSplitMode && canSelect && (
          <div className="me-2">
            <input
              type="checkbox"
              className="form-check-input"
              checked={isSelected}
              onChange={() => onToggleSelect(item)}
            />
          </div>
        )}
        <div
          className="d-flex align-items-center gap-2"
          style={{ width: isSplitMode ? "35%" : "40%" }}
        >
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
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ width: "30%" }}
        >
          {!isSplitMode && (
            <>
              {tipo !== "entregado" ? (
                <div className="d-flex align-items-center bg-white border rounded-pill px-1 shadow-sm">
                  <button
                    className="btn btn-sm btn-link text-dark p-0"
                    onClick={() =>
                      onRemove(tipo === "nuevo" ? item.id : item.idPlato)
                    }
                    disabled={
                      aumentarMutation.isLoading || disminuirMutation.isLoading
                    }
                  >
                    <Minus size={14} />
                  </button>
                  <span className="mx-2 fw-bold small">{item.cantidad}</span>
                  <button
                    className="btn btn-sm btn-link text-dark p-0"
                    onClick={() =>
                      onAdd(tipo === "nuevo" ? item : item.idPlato)
                    }
                    disabled={
                      aumentarMutation.isLoading || disminuirMutation.isLoading
                    }
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
          {isSplitMode && canSelect && isSelected && (
            <div className="d-flex align-items-center bg-primary bg-opacity-10 border border-primary rounded-pill px-1">
              <button
                className="btn btn-sm btn-link text-primary border-none p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeSplitQty(item.id, -1, item.cantidad);
                }}
              >
                <Minus size={14} />
              </button>
              <span className="mx-2 fw-bold small text-primary border-none">
                {cantidadSeleccionada} / {item.cantidad}
              </span>
              <button
                className="btn btn-sm btn-link text-primary border-none p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeSplitQty(item.id, 1, item.cantidad);
                }}
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
        <div
          className="d-flex align-items-center justify-content-end gap-2"
          style={{ width: "30%" }}
        >
          <span
            className={`fw-bold small ${isSelected ? "text-primary" : "text-dark"}`}
          >
            S/.{" "}
            {Number(
              isSplitMode && isSelected ? precioSeleccionado : precioTotal,
            ).toFixed(2)}
          </span>
          {!isSplitMode && tipo !== "entregado" && (
            <button
              className="btn btn-sm btn-link text-danger p-0"
              onClick={() =>
                onDelete(tipo === "nuevo" ? item.id : item.idPlato)
              }
              disabled={
                loadingDelete === (tipo === "nuevo" ? item.id : item.idPlato)
              }
            >
              {loadingDelete === (tipo === "nuevo" ? item.id : item.idPlato) ? (
                <Repeat size={16} className="spinner-spin" />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  const totalCarrito = itemsCarrito.reduce(
    (acc, i) => acc + i.cantidad * i.precio,
    0,
  );
  const totalSolicitados = platosSolicitados.reduce(
    (acc, i) => acc + i.cantidad * i.plato.precio,
    0,
  );
  const totalEntregados = platosEntregados.reduce(
    (acc, i) => acc + i.cantidad * i.plato.precio,
    0,
  );
  const granTotal = totalCarrito + totalSolicitados + totalEntregados;
  const totalSeleccionado = itemsSeleccionados.reduce(
    (acc, i) => acc + i.subtotal,
    0,
  );

  return (
    <div className="h-100 bg-transparent">
      <div className="row g-3 h-100">
        <div
          className={`col-lg-8 h-100 ${isSplitMode ? "opacity-50 pe-none" : ""}`}
        >
          <div className="card shadow-sm h-100 d-flex flex-column overflow-auto">
            <div className="card-header bg-white border-bottom px-4 m-0 ">
              <h6 className="m-0 text-dark fw-bold d-flex align-items-center gap-2 ">
                <Hamburger size={28} /> Menú de Platos
              </h6>
              <div className="d-flex  gap-2 ">
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
              <div className="card-body overflow-auto contenedor-platos p-2 ">
                {productos
                  .filter(
                    (p) =>
                      (categoriaFiltroPlatos === "todo" ||
                        p.categoria.nombre === categoriaFiltroPlatos) &&
                      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .map((p) => (
                    <CardPlatos
                      key={p.id}
                      item={p}
                      isSelected={itemsCarrito.some((i) => i.id === p.id)}
                      handleAdd={handleAddPlatoPreventa}
                      handleRemove={handleDecrementNewItem}
                      BASE_URL={BASE_URL}
                      capitalizeFirstLetter={capitalizeFirstLetter}
                    />
                  ))}
              </div>
            </CondicionCarga>
          </div>
        </div>

        <div className="col-lg-4 h-100">
          <div
            className={`card shadow border-0 h-100 d-flex flex-column overflow-hidden ${isSplitMode ? "border-primary border-2" : ""}`}
          >
            <div
              className={`card-header d-flex justify-content-between align-items-center p-3 ${isSplitMode ? "bg-warning" : ""}`}
            >
              <div>
                <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                  {isSplitMode && <Scissors size={20} />}{" "}
                  {isSplitMode
                    ? "Separar Cuenta"
                    : `Mesa ${mesaNumero || idMesa}`}
                </h5>
                <small>
                  {isSplitMode
                    ? "Selecciona items a pagar"
                    : "Resumen de cuenta"}
                </small>
              </div>
              <button
                className={`btn btn-sm rounded-pill px-3 ${isSplitMode ? "btn-light text-dark" : "btn-outline-dark"}`}
                onClick={isSplitMode ? toggleSplitMode : handleVolverMesas}
              >
                {isSplitMode ? (
                  <>
                    <XCircle size={16} /> Cancelar
                  </>
                ) : (
                  <>
                    <ChevronLeft size={16} /> Volver
                  </>
                )}
              </button>
            </div>

            <div className="card-body overflow-auto p-2 bg-light d-flex flex-column gap-1">
              {itemsCarrito.length > 0 && (
                <div
                  className={`mb-3 animate__animated animate__fadeIn ${isSplitMode ? "opacity-50" : ""}`}
                >
                  <h6 className="text-warning fw-bold small ms-1 mb-2 d-flex align-items-center gap-1">
                    <Plus size={14} /> Por confirmar
                  </h6>
                  {itemsCarrito.map((i) => (
                    <FilaPlatoUnificado
                      key={`cart-${i.id}`}
                      item={i}
                      tipo="nuevo"
                      onAdd={handleAddPlatoPreventa}
                      onRemove={handleDecrementNewItem}
                      onDelete={handleDecrementNewItem}
                      loadingDelete={deletingProductId}
                      isSplitMode={isSplitMode}
                    />
                  ))}
                </div>
              )}

              {platosSolicitados.length > 0 && (
                <div className="mb-2">
                  <h6 className="text-secondary fw-bold small ms-1 mb-2 d-flex align-items-center gap-1">
                    <ChefHat size={14} /> En preparación
                  </h6>
                  {platosSolicitados.map((i) => (
                    <FilaPlatoUnificado
                      key={`sol-${i.id}`}
                      item={i}
                      tipo="enviado"
                      onAdd={aumentarMutation.mutate}
                      onRemove={disminuirMutation.mutate}
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

              {platosEntregados.length > 0 && (
                <div className="mb-2">
                  <h6 className="text-success fw-bold small ms-1 mb-2 d-flex align-items-center gap-1">
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
            </div>

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
                    {(isSplitMode ? totalSeleccionado : granTotal).toFixed(2)}
                  </h3>
                </div>
              </div>

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
                      loading={isSendingToKitchen}
                    >
                      ENVIAR A COCINA
                    </BotonAnimado>
                  ) : (
                    <BotonAnimado
                      className="btn-realizarPedido w-100 p-3 mb-2 fw-bold fs-5 shadow-sm"
                      onClick={handleRealizarPago}
                      disabled={granTotal === 0}
                    >
                      COBRAR MESA
                    </BotonAnimado>
                  )}
                </>
              )}

              {!isSplitMode && itemsCarrito.length === 0 && (
                <div className="col-12 mb-2">
                  <button
                    className="btn-principal w-100 fw-bold shadow-sm rounded-pill py-2"
                    onClick={toggleSplitMode}
                    disabled={granTotal === 0}
                  >
                    <Scissors size={18} className="me-2" /> SEPARAR CUENTA
                  </button>
                </div>
              )}

              {!isSplitMode && (
                <div className="row g-2">
                  <div className="col-4">
                    <button
                      className="btn btn-outline-dark w-100 btn-sm rounded-pill"
                      onClick={handleTranferirToMesa}
                    >
                      <Repeat size={16} /> Mover
                    </button>
                  </div>
                  <div className="col-4">
                    <button
                      className="btn btn-outline-dark w-100 btn-sm rounded-pill"
                      onClick={handleImprimirTicket}
                    >
                      <Printer size={16} /> Ticket
                    </button>
                  </div>
                  <div className="col-4">
                    <button
                      className="btn btn-outline-danger w-100 btn-sm rounded-pill"
                      onClick={handleCancelarPedidosQuestion}
                      disabled={platosEntregados.length > 0}
                    >
                      <BanIcon size={16} /> Anular
                    </button>
                  </div>
                  <div className="col-12 mt-2">
                    <div
                      className="d-flex align-items-start bg-warning bg-opacity-10 p-3"
                      style={{
                        border: "2px dashed #ffc107", // Borde discontinuo color advertencia
                        borderRadius: "8px", // Esquinas ligeramente redondeadas para parecer papel
                        minHeight: "60px",
                      }}
                    >
                      <div
                        className="bg-warning rounded-circle d-flex align-items-center justify-content-center me-2 mt-1"
                        style={{ width: "24px", height: "24px", flexShrink: 0 }}
                      >
                        <FontAwesomeIcon
                          icon={faClipboardList}
                          className="text-white"
                          style={{ fontSize: "0.75rem" }}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <small
                          className="text-muted fw-bold d-block mb-1"
                          style={{
                            fontSize: "0.65rem",
                            textTransform: "uppercase",
                          }}
                        >
                          Observaciones:
                        </small>
                        <p
                          className="m-0 text-dark fw-medium"
                          style={{
                            fontSize: "0.85rem",
                            lineHeight: "1.3",
                            fontStyle: notaPedido ? "normal" : "italic",
                          }}
                        >
                          {notaPedido || (
                            <span className="text-muted">
                              Sin notas adicionales...
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "none" }}>
        <TicketPreVenta ref={componentRef} dataActual={datosPreventa} />
      </div>
      <ModalAlertQuestion
        show={modalQuestion}
        idEliminar={idMesaEliminar}
        nombre={`Mesa ${idMesa}`}
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
