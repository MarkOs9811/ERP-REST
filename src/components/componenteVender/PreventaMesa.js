import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/AxiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import ModalAlertQuestion from "../componenteToast/ModalAlertQuestion";

import { addItem, clearPedido } from "../../redux/pedidoSlice";

import "../../css/EstilosPreventa.css";
import { CardPlatos } from "./CardPlatos";
import ToastAlert from "../componenteToast/ToastAlert";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import { TransferirToMesa } from "./tareasVender/TransferirToMesa";
import { setIdPreventaMesa } from "../../redux/mesaSlice";
import { setEstado } from "../../redux/tipoVentaSlice";
import { CategoriaPlatos } from "./tareasVender/CategoriaPlatos";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetPlatosVender } from "../../service/accionesVender/GetPlatosVender";
import {
  BanIcon,
  BanknoteArrowDown,
  CheckCheck,
  ChevronLeft,
  FileText,
  Minus,
  Plus,
  Repeat,
  Trash2,
  ShoppingCart,
  CheckCircle,
} from "lucide-react";
import { getPreventaMesa } from "../../service/preventaService";
import { BuscadorPlatos } from "./tareasVender/BuscadorPlatos";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";
import BotonAnimado from "../componentesReutilizables/BotonAnimado";

export function PreventaMesa() {
  const idMesa = useSelector((state) => state.mesa.idPreventaMesa);
  const categoriaFiltroPlatos = useSelector(
    (state) => state.categoriaFiltroPlatos.estado,
  );
  const navigate = useNavigate();

  const caja = useSelector((state) => state.caja.caja);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const pedido = useSelector((state) => state.pedido);
  const mesas = useSelector((state) => state.pedido.mesas);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

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

  // Platos disponibles
  const {
    data: productos = [],
    isLoading: loadinPlatos,
    isError: errorPlatos,
    error: errorPlatosMessage,
  } = useQuery({
    queryKey: ["platos"],
    queryFn: GetPlatosVender,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Separar preventas en dos: solicitados y enviados
  const platosSolicitados = preventas.filter(
    (p) => p.estado !== "entregado" && p.estado !== "completado",
  );
  const platosEntregados = preventas.filter(
    (p) => p.estado === "entregado" || p.estado === "completado",
  );

  // Items en el carrito (Redux)
  const itemsCarrito = pedido.mesas[idMesa]?.items || [];

  const handleAddPlatoPreventa = (producto) => {
    dispatch(addItem({ ...producto, mesaId: idMesa }));
  };

  const handleRemovePlatoPreventa = (productoId) => {
    handleRemoveFromPreventaByPlato(productoId, idMesa);
  };

  const handleRemoveFromPreventaByPlato = async (idProducto) => {
    try {
      const response = await axiosInstance.delete(
        `/vender/preventa/deletePlatoPreventa/${idProducto}/${idMesa}`,
      );
      if (response.data.success) {
        ToastAlert("success", "Pedido eliminado de la mesa");
        queryClient.invalidateQueries(["preventaMesa", idMesa, caja?.id]);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log("error", error);
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
        {
          pedidos: datosPreventa,
        },
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
    dispatch(setIdPreventaMesa(idMesa));
    dispatch(setEstado("mesa"));
    navigate("/vender/mesas/detallesPago");
  };

  // Componente para mostrar tabla de platos
  const TablaPlatos = ({ items, titulo, tipo = "carrito" }) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-4 text-muted">
          <p className="mb-0">No hay {titulo.toLowerCase()}</p>
        </div>
      );
    }

    return (
      <div className="table-responsive">
        <table className="table table-borderless align-middle mb-0 table-sm">
          <thead className="text-muted small border-bottom">
            <tr>
              <th
                scope="col"
                className="ps-2 fw-normal"
                style={{ fontSize: "0.85rem" }}
              >
                Plato
              </th>
              <th
                scope="col"
                className="text-center fw-normal"
                style={{ fontSize: "0.85rem" }}
              >
                Cant.
              </th>
              <th
                scope="col"
                className="text-end fw-normal"
                style={{ fontSize: "0.85rem" }}
              >
                Total
              </th>
              {tipo !== "entregados" && <th scope="col"></th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const nombrePlato = item.plato?.nombre || item.nombre;
              const precioUnitario = item.plato?.precio || item.precio;
              const precioTotal = item.cantidad * precioUnitario;

              return (
                <tr key={`${item.id}-${index}`} className="border-bottom small">
                  <td className="ps-2 py-2">
                    <div>
                      <span
                        className="fw-bold text-dark"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {nombrePlato}
                      </span>
                      <br />
                      <span
                        className="text-muted"
                        style={{ fontSize: "0.75rem" }}
                      >
                        S/. {Number(precioUnitario).toFixed(2)}
                      </span>
                    </div>
                  </td>

                  <td className="text-center py-2">
                    {tipo === "carrito" ? (
                      <div
                        className="d-flex align-items-center justify-content-center bg-light rounded-pill px-1 py-0 mx-auto"
                        style={{
                          width: "60px",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-decoration-none text-dark p-0"
                          style={{ width: "20px", height: "20px" }}
                          onClick={() => handleRemovePlatoPreventa(item.id)}
                        >
                          <Minus size={12} />
                        </button>
                        <span
                          className="fw-bold mx-1"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {item.cantidad}
                        </span>
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-decoration-none text-dark p-0"
                          style={{ width: "20px", height: "20px" }}
                          onClick={() => handleAddPlatoPreventa(item)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    ) : (
                      <span className="fw-bold" style={{ fontSize: "0.9rem" }}>
                        {item.cantidad}
                      </span>
                    )}
                  </td>

                  <td
                    className="text-end py-2 fw-bold text-dark"
                    style={{ fontSize: "0.9rem" }}
                  >
                    S/. {Number(precioTotal).toFixed(2)}
                  </td>

                  {tipo !== "entregados" && (
                    <td className="text-end pe-2 py-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger border-0 bg-transparent p-0"
                        onClick={() => handleRemovePlatoPreventa(item.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  if (isLoading) return <p>Cargando preventas...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="h-100 bg-transparent">
      <div className="row g-3 h-100">
        {/* ============ COLUMNA 2: CARRITO/PLATOS A PEDIR ============ */}
        <div className="col-lg-3 h-100">
          <div className="card shadow-sm flex-grow-1 h-100 d-flex flex-column p-2">
            <div className="card-header d-flex align-items-center justify-content-between p-0 mb-2">
              <h6 className="mb-0 text-dark fw-bold d-flex align-items-center gap-2">
                <ShoppingCart size={18} className="text-warning" />A Pedir
              </h6>
              <span className="badge bg-warning text-dark">
                {itemsCarrito.length}
              </span>
            </div>

            <div className="card-body overflow-auto flex-grow-1 p-0 mb-2">
              <TablaPlatos
                items={itemsCarrito}
                titulo="Platos a Pedir"
                tipo="carrito"
              />
            </div>

            {/* Resumen en carrito */}
            {itemsCarrito.length > 0 && (
              <div className="card-footer p-2 bg-light border-top">
                <div className="d-flex justify-content-between align-items-center small mb-1">
                  <span>Subtotal:</span>
                  <span className="fw-bold">
                    S/.{" "}
                    {itemsCarrito
                      .reduce(
                        (acc, item) => acc + item.cantidad * item.precio,
                        0,
                      )
                      .toFixed(2)}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center small">
                  <span>IGV (18%):</span>
                  <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                    S/.{" "}
                    {(
                      itemsCarrito.reduce(
                        (acc, item) => acc + item.cantidad * item.precio,
                        0,
                      ) * 0.18
                    ).toFixed(2)}
                  </span>
                </div>
                <BotonAnimado
                  className="btn-danger  btn-block w-100 p-3"
                  onClick={() => handleAddPlatoPreventaMesas()}
                  disabled={itemsCarrito.length === 0}
                >
                  Actualizar Pedido
                </BotonAnimado>
              </div>
            )}
          </div>
        </div>
        {/* ============ COLUMNA 1: CATÁLOGO DE PLATOS ============ */}
        <div className="col-lg-6 h-100">
          <div className="card shadow-sm flex-grow-1 h-100 d-flex flex-column">
            <div className="card-header bg-white border-bottom">
              <h6 className="mb-2 text-dark fw-bold">Catálogo</h6>
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
              <div className="card-body overflow-auto contenedor-platos p-2">
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
                        handleRemove={handleRemovePlatoPreventa}
                        BASE_URL={BASE_URL}
                        capitalizeFirstLetter={capitalizeFirstLetter}
                      />
                    );
                  })}
              </div>
            </CondicionCarga>
          </div>
        </div>
        {/* ============ COLUMNA 3: PLATOS PEDIDOS/ENTREGADOS ============ */}
        <div className="col-lg-3 h-100 gap-3">
          <div className="card shadow-sm flex-grow-1 h-100 d-flex flex-column p-2">
            {/* SOLICITADOS */}

            <div className="card d-flex  mb-2 flex-row align-items-center p-2 border">
              <h5 className="mb-0 text-success fw-bold">
                Mesa {mesa || "---"}
              </h5>
              <button
                className="btn btn-outline-dark btn-sm ms-auto"
                onClick={() => handleVolverMesas()}
              >
                <ChevronLeft size={18} />
                Volver
              </button>
            </div>
            <div className="card p-2 border mb-2">
              <h6 className="mb-2 p-3 text-dark fw-bold d-flex align-items-center gap-2 small">
                <ShoppingCart size={16} />
                Solicitados
              </h6>
              <div className=" rounded p-2 bg-light">
                <TablaPlatos
                  items={platosSolicitados}
                  titulo="Platos Solicitados"
                  tipo="solicitados"
                />
              </div>
            </div>

            {/* ENTREGADOS */}
            <div className="card p-2 border  flex-grow-1 d-flex flex-column">
              <h6 className="mb-2 p-3 text-dark fw-bold d-flex align-items-center gap-2 small">
                <CheckCircle size={16} className="text-success" />
                Entregados
              </h6>
              <div
                className="border rounded p-2 bg-light overflow-auto"
                style={{ maxHeight: "calc(100vh - 450px)" }}
              >
                <TablaPlatos
                  items={platosEntregados}
                  titulo="Platos Entregados"
                  tipo="entregados"
                />
              </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="mt-3 pt-2 border-top">
              <div className="row g-2">
                <div className="col-12">
                  <BotonAnimado
                    className="btn-realizarPedido btn-block w-100 p-3"
                    onClick={() => handleRealizarPago()}
                    disabled={
                      itemsCarrito.length === 0 &&
                      platosSolicitados.length === 0
                    }
                  >
                    Pagar{" "}
                  </BotonAnimado>
                </div>
                <div className="col-6">
                  <button
                    className="btn btn-outline-dark w-100 btn-sm"
                    onClick={() => handleTranferirToMesa()}
                  >
                    <Repeat size={14} className="me-1" />
                    Mover
                  </button>
                </div>
                <div className="col-6">
                  <button
                    className="btn btn-outline-danger w-100 btn-sm"
                    onClick={() => handleCancelarPedidosQuestion()}
                  >
                    <BanIcon size={14} className="me-1" />
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============ ENCABEZADO MESA ============ */}
      </div>

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
