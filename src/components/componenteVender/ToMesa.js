import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/AxiosInstance";
import "../../css/EstilosPreventa.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTrashCan } from "@fortawesome/free-solid-svg-icons";
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
} from "lucide-react";
import { useState } from "react";
import BotonAnimado from "../componentesReutilizables/BotonAnimado";
import { BuscadorPlatos } from "./tareasVender/BuscadorPlatos";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";

export function ToMesa() {
  const id = useSelector((state) => state.mesa.idPreventaMesa);

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
  };

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
        // 1. Mostrar alerta de éxito
        ToastAlert("success", `${response.data.message} MESA ${id}`);

        // 2. Limpiar estados
        setNotaPedido("");
        dispatch(clearPedido(id));

        // 3. Refrescar datos y redirigir
        queryClient.invalidateQueries(["mesas"]);
        navigate(`/vender/mesas`);

        // Nota: Si aún necesitas componentRef para otra cosa, evalúalo de forma independiente,
        // no bloquees el flujo principal de navegación.
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      ToastAlert("error", "Error de conexión: " + error.message);
    } finally {
      // 🔥 BEST PRACTICE: Garantiza que el loading se apague en éxito O en error
      setLoadingPedido(false);
    }
  };

  return (
    <div className="h-100 bg-transparent">
      <div className="row h-100 g-3">
        <div className="col-md-4 col-lg-3 h-100">
          <div className="card  flex-grow-1 h-100 d-flex flex-column overflow-hidden">
            <div className="card-header bg-white border-bottom py-3">
              <div className="d-flex align-items-center w-100 gap-2">
                <select
                  className="form-select"
                  value={id || ""}
                  onChange={(e) => {
                    // Opcional pero recomendado: Permitir cambiar de mesa desde aquí
                    const nuevoId = parseInt(e.target.value);
                    dispatch(setIdPreventaMesa(nuevoId));
                  }}
                >
                  {mesasList
                    // Nota: Si la mesa ya está ocupada (estado 0) y estás agregando más platos,
                    // asegúrate de que el filtro permita ver la mesa actual.
                    // .filter((m) => m.estado === 1 || m.id === id)
                    .filter((m) => m.estado === 1)
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        Mesa {m.numero}
                      </option>
                    ))}
                </select>

                <div className="d-flex gap-2 ms-auto">
                  <button
                    className="btn-eliminar btn-icon flex-shrink-0"
                    title="Limpiar Pedido"
                    onClick={handleLimpiarMesa}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>

                  <button
                    className="btn-cerrar btn-icon flex-shrink-0"
                    onClick={habldeVolverMesas}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </button>
                </div>
              </div>
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
                                className="btn-informativo btn-icon border-0 text-dark p-0"
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
                                className="btn-informativo btn-icon border-0 text-dark p-0"
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
                              className="btn-eliminar btn-icon rounded-pill mx-2 p-0 border-0"
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
              className="card-footer  border-top p-3 shadow-lg bg-white"
              style={{ zIndex: 10 }}
            >
              <div className=" p-3 mb-3">
                <label className="form-label text-success small fw-bold d-flex align-items-center gap-1">
                  <Notebook /> Cliente / Notas del Pedido:
                </label>
                <div className="input-group">
                  <textarea
                    className="form-control  bg-light"
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
                className="btn-guardar py-3 fw-bold btn-block w-100 p-3 shadow-sm"
                onClick={() => handleAddPlatoPreventaMesas()}
                loading={isLoadignPedido}
                disabled={
                  !pedido.mesas[id] || pedido.mesas[id].items.length === 0
                }
              >
                REALIZAR PEDIDO
              </BotonAnimado>
            </div>
          </div>
        </div>

        <div className="col-md-8 col-lg-9 h-100">
          <div className="card d-flex flex-grow-1 flex-column h-100 p-0 m-0 overflow-auto">
            <div className="card-header bg-white border-bottom  py-3 px-3 m-0 d-flex align-items-center gap-3 flex-wrap">
              <div>
                <h6 className="d-flex align-items-center gap-2 flex-shrink-0">
                  <Hamburger size={28} /> Menú de Platos
                </h6>
              </div>

              <div className="flex-grow-1">
                <BuscadorPlatos
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              </div>
              {/* Categorías */}
              <div className="overflow-auto d-flex justify-content-lg-end">
                <CategoriaPlatos
                  claveVenta={"restaurante"}
                  clearSearch={setSearchTerm}
                />
              </div>
            </div>

            <CondicionCarga
              isLoading={loadinPlatos}
              isError={errorPlatos}
              mode="cards"
            >
              <div className="card-body p-2  contenedor-platos overflow-x-hidden m-auto ">
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
                        capitalizeFirstLetter={capitalizeFirstLetter}
                        esComida="resturante"
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
