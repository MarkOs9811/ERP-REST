import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/AxiosInstance";
import "../../css/EstilosPreventa.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faClipboardList,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import ToastAlert from "../componenteToast/ToastAlert";
import { useDispatch, useSelector } from "react-redux";
import { addItem, clearPedido, removeItem } from "../../redux/pedidoSlice";

import { CardPlatos } from "./CardPlatos";
import { CategoriaPlatos } from "./tareasVender/CategoriaPlatos";
import { GetMesasVender } from "../../service/accionesVender/GetMesasVender";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { setIdPreventaMesa } from "../../redux/mesaSlice";
import { GetPlatosVender } from "../../service/accionesVender/GetPlatosVender";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import BotonAnimado from "../componentesReutilizables/BotonAnimado";
import { BuscadorPlatos } from "./tareasVender/BuscadorPlatos";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";
import { useReactToPrint } from "react-to-print";
import { TicketsPedido } from "./TiketsType/TicketsPedido";

export function ToMesa() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const id = useSelector((state) => state.mesa.idPreventaMesa);
  const numeroMesa = useSelector((state) => state.mesa.numero);

  const categoriaFiltroPlatos = useSelector(
    (state) => state.categoriaFiltroPlatos.estado,
  );

  const [isLoadignPedido, setLoadingPedido] = useState(false);
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

  const habldeVolverMesas = () => navigate(`/vender/mesas`);

  const handleAddPlatoPreventa = (producto) => {
    dispatch(addItem({ ...producto, mesaId: id }));
  };

  const handleRemovePlatoPreventa = (productoId, eliminarFila = false) => {
    dispatch(removeItem({ id: productoId, mesaId: id, total: eliminarFila }));
  };

  const handleLimpiarMesa = () => {
    dispatch(clearPedido(id));
    setNotaPedido("");
    ToastAlert("info", "Pedido de la mesa " + numeroMesa + " limpiado.");
  };

  const componentRef = useRef();
  const [datosVenta, setDatosVenta] = useState(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    onAfterPrint: () => setDatosVenta(null),
  });

  const handleAddPlatoPreventaMesas = async () => {
    if (!mesas[id] || mesas[id].items.length === 0) {
      return ToastAlert("error", "No hay platos en el pedido");
    }

    setLoadingPedido(true);
    try {
      const datosPreventa =
        mesas[id]?.items.map((item) => ({
          idCaja: caja.id,
          idPlato: item.id,
          idMesa: id,
          cantidad: item.cantidad,
          precio: item.precio,
          nota: notaPedido,
        })) || [];

      const response = await axiosInstance.post(
        "/vender/addPlatosPreVentaMesa",
        {
          pedidos: datosPreventa,
          nota: notaPedido,
        },
      );

      if (response.data.success) {
        setDatosVenta(response.data.data);
        setTimeout(() => {
          if (componentRef.current) {
            handlePrint();
            ToastAlert("success", response.data.message + " MESA " + id);
            setNotaPedido("");
            dispatch(clearPedido(id)); // Limpiamos solo la mesa actual
            queryClient.invalidateQueries(["mesas"]);
            navigate(`/vender/mesas`);
          }
        }, 1000);
      } else {
        ToastAlert("error", response.data.message);
        setLoadingPedido(false);
      }
    } catch (error) {
      ToastAlert("error", "Error de conexión: " + error.message);
      setLoadingPedido(false);
    }
  };

  return (
    <div className="h-100 bg-transparent">
      <div className="row h-100">
        <div className="col-md-3 h-100">
          <div className="card shadow-sm d-flex flex-column h-100 overflow-hidden p-2">
            <div className="card-header d-flex justify-content-between align-items-center bg-white border-bottom-0">
              <button
                className="btn btn-outline-dark btn-sm"
                onClick={habldeVolverMesas}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              <div className="text-center">
                <h6 className="m-0 fw-bold text-uppercase">
                  Mesa {numeroMesa}
                </h6>
                <select
                  className="form-select form-select-sm mt-1"
                  value={id}
                  onChange={(e) =>
                    dispatch(setIdPreventaMesa(Number(e.target.value)))
                  }
                >
                  <option value="">Mesa actual: {id}</option>
                  {mesasList
                    .filter((m) => m.estado === 1)
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        Mesa {m.numero}
                      </option>
                    ))}
                </select>
              </div>
              <button
                className="btn btn-outline-danger btn-sm"
                title="Limpiar Pedido"
                onClick={handleLimpiarMesa}
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </div>

            <div className="card-body p-0 overflow-auto ">
              {pedido.mesas[id] && pedido.mesas[id].items.length > 0 ? (
                <div className="table-responsive rounded-none">
                  <table className="table table-borderless align-middle mb-0 bg-transparent">
                    <thead className="text-muted small border-bottom text-center bg-transparent">
                      <tr className="bg-transparent">
                        <th className="ps-3 text-start fw-normal bg-transparent">
                          Plato
                        </th>
                        <th className="fw-normal bg-transparent">Cant.</th>
                        <th className="fw-normal bg-transparent">Total</th>
                        <th className="fw-normal bg-transparent"></th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {pedido.mesas[id].items.map((item) => (
                        <tr
                          key={item.id}
                          className="border-bottom bg-transparent"
                        >
                          <td className="ps-3 py-2 bg-transparent">
                            <div className="d-flex flex-column">
                              <span className="fw-bold text-dark small">
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
                          <td className="py-2 bg-transparent">
                            <div
                              className="d-flex align-items-center justify-content-center bg-light rounded-pill border mx-auto"
                              style={{
                                width: "fit-content",
                                padding: "2px 5px",
                              }}
                            >
                              <button
                                className="btn btn-sm p-0 border-0"
                                onClick={() =>
                                  handleRemovePlatoPreventa(item.id)
                                }
                              >
                                <Minus size={12} />
                              </button>
                              <span className="mx-2 small fw-bold">
                                {item.cantidad}
                              </span>
                              <button
                                className="btn btn-sm p-0 border-0"
                                onClick={() => handleAddPlatoPreventa(item)}
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </td>
                          <td className="text-end text-auto py-2 fw-bold small bg-transparent">
                            S/. {Number(item.cantidad * item.precio).toFixed(2)}
                          </td>
                          <td className="text-center py-2 bg-transparent">
                            <button
                              className="btn btn-sm text-danger rounded-pill mx-2 p-0 border-0"
                              onClick={() =>
                                handleRemovePlatoPreventa(item.id, true)
                              }
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="h-100 d-flex align-items-center justify-content-center">
                  <p className="text-muted small">Mesa vacía</p>
                </div>
              )}
            </div>

            <div className="card-footer bg-white border-top">
              <div className="mb-3">
                <label className="form-label small fw-bold text-success d-flex align-items-center">
                  <FontAwesomeIcon icon={faClipboardList} className="me-2" />
                  OBSERVACIONES COCINA
                </label>
                <textarea
                  className="form-control form-control-sm alert-warning bg-light border shadow-sm"
                  rows="2"
                  placeholder="Ej: Sin sal, término medio, etc."
                  value={notaPedido}
                  onChange={(e) => setNotaPedido(e.target.value)}
                  style={{ resize: "none" }}
                />
              </div>

              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold">TOTAL</span>
                <span className="h5 fw-bold text-success mb-0">
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
                className="btn-realizarPedido btn-block w-100 p-3 shadow-sm"
                onClick={() => handleAddPlatoPreventaMesas()}
                loading={isLoadignPedido}
                disabled={
                  !pedido.mesas[id] || pedido.mesas[id].items.length === 0
                }
              >
                REALIZAR PEDIDO
              </BotonAnimado>

              <div style={{ display: "none" }}>
                <TicketsPedido
                  ref={componentRef}
                  venta={datosVenta || { productos: [] }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-9 h-100">
          <div className="card shadow-sm d-flex flex-column h-100">
            <div className="card-header bg-light p-3">
              <div className="d-flex align-items-center gap-3">
                <h4 className="mb-0 fw-bold text-dark">Platos</h4>
                <div className="ms-auto d-flex gap-2">
                  <BuscadorPlatos
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                  <CategoriaPlatos />
                </div>
              </div>
            </div>

            <CondicionCarga
              isLoading={loadinPlatos}
              isError={errorPlatos}
              mode="cards"
            >
              <div className="card-body overflow-auto contenedor-platos">
                {productos
                  .filter((producto) => {
                    const matchCat =
                      categoriaFiltroPlatos === "todo" ||
                      producto.categoria.nombre === categoriaFiltroPlatos;
                    const matchBus = producto.nombre
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase());
                    return matchCat && matchBus;
                  })
                  .map((producto) => {
                    const isSelected = pedido.mesas[id]?.items.some(
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
      </div>
    </div>
  );
}
