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
import {
  FileText,
  Hamburger,
  Minus,
  Notebook,
  Plus,
  Trash2,
  Utensils,
} from "lucide-react";
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
        <div className="col-md-4 col-lg-3 h-100">
          <div className="card  flex-grow-1 h-100 d-flex flex-column border-0 overflow-hidden">
            <div className="card-header m-0 bg-white border-bottom d-flex justify-content-between align-items-center py-3">
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
                  className="form-select form-select-sm "
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

            <div className="card-body overflow-auto p-0 d-flex flex-column ">
              {pedido.mesas[id] && pedido.mesas[id].items.length > 0 ? (
                <div className="overflow-auto  rounded-none">
                  <table className="table table-borderless align-middle mb-0 bg-transparent">
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
                          <td className="py-2 text-center bg-transparent">
                            <div
                              className="d-flex align-items-center justify-content-center border rounded-pill  mx-auto px-1"
                              style={{
                                width: "fit-content",
                                margin: "0 auto",
                              }}
                            >
                              <button
                                className="btn btn-sm btn-link border-0 text-dark p-0"
                                style={{ width: "22px" }}
                                onClick={() =>
                                  handleRemovePlatoPreventa(item.id)
                                }
                              >
                                <Minus size={14} />
                              </button>
                              <span
                                className="mx-1  fw-bold"
                                style={{ fontSize: "0.85rem" }}
                              >
                                {item.cantidad}
                              </span>
                              <button
                                className="btn btn-sm btn-link border-0 text-dark p-0"
                                style={{ width: "22px" }}
                                onClick={() => handleAddPlatoPreventa(item)}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </td>
                          <td
                            className="text-end  py-2 pe-3 fw-bold text-dark  bg-transparent"
                            style={{ fontSize: "0.9rem" }}
                          >
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
                <div className="h-100 d-flex align-items-center justify-content-center opacity-50">
                  <FileText size={40} className="mb-2" />
                  <p className="text-muted small">Mesa vacía</p>
                </div>
              )}
            </div>

            <div
              className="card-footer  border-top p-3 shadow-lg"
              style={{ zIndex: 10 }}
            >
              <div className=" p-3 mb-3">
                <label className="form-label text-success small fw-bold d-flex align-items-center gap-1">
                  <Notebook /> Cliente / Notas del Pedido:
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <FileText size={16} className="text-secondary" />
                  </span>

                  <textarea
                    className="form-control border-start-0 bg-light"
                    rows="2"
                    placeholder="Ej: Sin sal, término medio, etc."
                    value={notaPedido}
                    onChange={(e) => setNotaPedido(e.target.value)}
                    style={{ resize: "none", fontSize: "0.9rem" }}
                  />
                </div>
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
                className="btn-realizarPedido py-2 fw-bold btn-block w-100 p-3 shadow-sm"
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

        <div className="col-md-8 col-lg-9 h-100">
          <div className="card d-flex flex-grow-1 flex-column h-100 p-0 m-0 overflow-auto">
            <div className="card-header bg-white border-bottom  py-3 px-3 m-0">
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
              {/* Categorías en móvil si es necesario */}
              <div className="d-md-none mt-2">
                <CategoriaPlatos />
              </div>
            </div>

            <CondicionCarga
              isLoading={loadinPlatos}
              isError={errorPlatos}
              mode="cards"
            >
              <div className="card-body overflow-auto  p-2">
                <div className="contenedor-platos">
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
              </div>
            </CondicionCarga>
          </div>
        </div>
      </div>
    </div>
  );
}
