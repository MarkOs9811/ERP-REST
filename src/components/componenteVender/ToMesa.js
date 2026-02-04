import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/AxiosInstance";
import "../../css/EstilosPreventa.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
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
// AGREGADO: Importamos el icono Search
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
  const categoriaFiltroPlatos = useSelector(
    (state) => state.categoriaFiltroPlatos.estado,
  );

  const [isLoadignPedido, setLoadingPedido] = useState(false);

  // AGREGADO: Estado para el buscador
  const [searchTerm, setSearchTerm] = useState("");

  // extrayendo datos desde store de redux
  const dispatch = useDispatch();
  const pedido = useSelector((state) => state.pedido);
  const mesas = useSelector((state) => state.pedido.mesas);
  const caja = useSelector((state) => state.caja.caja);

  // ===========================================
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // OBTENIENDO MESAS PARA CAMBIAR
  const {
    data: mesasList = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["mesas"],
    queryFn: GetMesasVender,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Obtener productos desde la API
  const {
    data: productos = [],
    isLoading: loadinPlatos,
    isError: errorPlatos,
    error: errorPlatosMessage,
  } = useQuery({
    queryKey: ["platos"],
    queryFn: GetPlatosVender,
  });

  // useEffect(() => {
  //   fetchProductos();
  // }, [id]);

  const habldeVolverMesas = () => {
    // Navegar a Platos.js con el id de la mesa como parámetro
    navigate(`/vender/mesas`);
  };

  const handleAddPlatoPreventa = (producto) => {
    dispatch(addItem({ ...producto, mesaId: id }));
  };

  const handleRemovePlatoPreventa = (productoId) => {
    dispatch(removeItem({ id: productoId, mesaId: id }));
  };
  // DATOS PARA LA IMPRESION
  const componentRef = useRef();
  const [datosVenta, setDatosVenta] = useState(null);
  // Configuración de la impresión
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    onAfterPrint: () => {
      setDatosVenta(null);
    },
  });

  // FUNCION PARA REALIZAR EL PEDIDO Y VOLVER A MESAS
  const handleAddPlatoPreventaMesas = async () => {
    setLoadingPedido(true); // 1. Iniciamos carga

    try {
      const datosPreventa =
        mesas[id]?.items.map((item) => ({
          idCaja: caja.id,
          idPlato: item.id,
          idMesa: id,
          cantidad: item.cantidad,
          precio: item.precio,
        })) || [];

      const response = await axiosInstance.post(
        "/vender/addPlatosPreVentaMesa",
        { pedidos: datosPreventa },
      );

      if (response.data.success) {
        setDatosVenta(response.data.data);

        setTimeout(() => {
          if (componentRef.current) {
            handlePrint(); // Aquí se abre la ventana que ya lograste ver
            ToastAlert("success", response.data.message + " MESA " + id);
            Object.keys(mesas).forEach((mesaId) => {
              dispatch(clearPedido(mesaId));
            });
            queryClient.invalidateQueries(["mesas"]);
            navigate(`/vender/mesas`);
          }
        }, 1000);
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      ToastAlert("error", "Error de conexión: " + error.message);
    } finally {
      setLoadingPedido(false);
    }
  };

  return (
    <div className="  h-100 bg-transparent">
      <div className="row h-100">
        <div className="col-md-3 h-100">
          <div className="card shadow-sm d-flex flex-column h-100 p-2">
            {/* Título */}
            <div className="card-header d-flex justify-content-between align-items-center">
              {/* Botón de volver */}
              <button
                className="btn btn-outline-dark d-flex align-items-center"
                onClick={() => habldeVolverMesas()}
                style={{ marginLeft: 0 }} // Mantener el botón alineado al margen izquierdo
              >
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                Volver
              </button>

              {/* Título de la card */}
              <div className="d-flex align-items-center text-center flex-column">
                <h5 className="m-0">
                  <span className="h6">Platos mesa {id}</span>
                </h5>
                <select
                  className="form-select"
                  onChange={(e) => {
                    dispatch(setIdPreventaMesa(Number(e.target.value)));
                  }}
                >
                  <option value="">Cambiar mesa</option>
                  {mesasList
                    .filter((mesa) => mesa.estado === 1)
                    .map((mesa) => (
                      <option key={mesa.id} value={mesa.id}>
                        Mesa {mesa.numero} - Disponible
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="card-body p-0">
              {/* Verificar si hay productos en la mesa actual */}
              {pedido.mesas[id] && pedido.mesas[id].items.length > 0 ? (
                <>
                  <div className="table-responsive">
                    <table className="table table-borderless align-middle mb-0">
                      {/* Encabezados sutiles para ordenar visualmente */}
                      <thead className="text-muted small border-bottom">
                        <tr>
                          <th scope="col" className="ps-3 fw-normal">
                            Descripción
                          </th>
                          <th scope="col" className="text-center fw-normal">
                            Cant.
                          </th>
                          <th scope="col" className="text-end fw-normal">
                            Total
                          </th>
                          <th scope="col"></th>
                        </tr>
                      </thead>

                      <tbody>
                        {pedido.mesas[id].items.map((item) => (
                          <tr
                            key={item.id}
                            className="border-bottom hover-bg-light"
                          >
                            {/* 1. Descripción y Precio Unitario */}
                            <td className="ps-3 py-3">
                              <div className="d-flex flex-column">
                                <span className="fw-bold text-dark fs-6">
                                  {item.nombre}
                                </span>
                                <span className="text-muted small">
                                  S/. {Number(item.precio).toFixed(2)} c/u
                                </span>
                              </div>
                            </td>

                            {/* 2. Control de Cantidad (Stepper) */}
                            <td className="py-3">
                              <div
                                className="d-flex align-items-center justify-content-center bg-light rounded-pill px-2 py-1 mx-auto"
                                style={{
                                  width: "fit-content",
                                  border: "1px solid #e0e0e0",
                                }}
                              >
                                <button
                                  type="button"
                                  className="btn btn-sm btn-link text-decoration-none text-dark p-0 d-flex align-items-center justify-content-center"
                                  style={{ width: "24px", height: "24px" }}
                                  onClick={() =>
                                    handleRemovePlatoPreventa(item.id)
                                  }
                                >
                                  <Minus size={14} />
                                </button>

                                <span
                                  className="fw-bold mx-2 text-center"
                                  style={{
                                    minWidth: "20px",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  {item.cantidad}
                                </span>

                                {/* He agregado el botón de sumar para consistencia con el diseño anterior.
                  Si en esta vista no se puede sumar, puedes borrar este botón button */}
                                <button
                                  type="button"
                                  className="btn btn-sm btn-link text-decoration-none text-dark p-0 d-flex align-items-center justify-content-center"
                                  style={{ width: "24px", height: "24px" }}
                                  onClick={() => handleAddPlatoPreventa(item)}
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            </td>

                            {/* 3. Precio Total */}
                            <td
                              className="text-end py-3 fw-bold text-dark"
                              style={{ minWidth: "80px" }}
                            >
                              S/.{" "}
                              {Number(item.cantidad * item.precio).toFixed(2)}
                            </td>

                            {/* 4. Botón Eliminar Fila */}
                            <td className="text-end py-3 pe-3">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger border-0 bg-transparent p-1"
                                title="Eliminar del pedido"
                                onClick={() =>
                                  handleRemovePlatoPreventa(item.id, true)
                                }
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Mensaje opcional si la mesa no tiene items */}
                    {pedido.mesas[id].items.length === 0 && (
                      <div className="text-center py-4 text-muted small">
                        Mesa sin pedidos
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-center text-muted">
                  No hay productos en esta mesa.
                </p>
              )}
            </div>
            <div className="card-footer">
              {/* Total */}
              <div className="d-flex justify-content-between align-items-center">
                <span className="h5">Total</span>
                <span className="h5 fw-bold text-success">
                  S/.{" "}
                  {(
                    pedido.mesas?.[id]?.items?.reduce(
                      (acc, item) => acc + item.cantidad * item.precio,
                      0,
                    ) || 0
                  ).toFixed(2)}
                </span>
              </div>

              <small className="text-muted d-block text-end">
                IGV: S/.{" "}
                {(
                  (pedido.mesas?.[id]?.items?.reduce(
                    (acc, item) => acc + item.cantidad * item.precio,
                    0,
                  ) || 0) * 0.18
                ).toFixed(2)}
              </small>

              {/* Indicador*/}
              <div className="my-5">
                <div className="d-flex justify-content-between">
                  {/* Total de Platos */}
                  <div className="bg-light rounded p-2 text-center flex-fill mr-2">
                    <small>Total de Platos</small>
                    <h6 className="text-success mb-0">
                      {pedido.mesas?.[id]?.items?.length || 0}
                    </h6>
                  </div>

                  {/* Cantidad Total de Productos */}
                  <div className="bg-light rounded p-2 text-center flex-fill ml-2">
                    <small>Cantidad x Plato</small>
                    <h6 className="text-dark mb-0">
                      {pedido.mesas?.[id]?.items?.reduce(
                        (acc, item) => acc + item.cantidad,
                        0,
                      ) || 0}
                    </h6>
                  </div>
                </div>
              </div>

              {/* Botón de Realizar Pedido */}
              <BotonAnimado
                className="btn-realizarPedido btn-block w-100 p-3"
                onClick={() => handleAddPlatoPreventaMesas()}
                loading={isLoadignPedido}
              >
                Realizar Pedido
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

        {/* Columna de los productos */}
        <div className="col-md-9 h-100">
          <div className="card shadow-sm flex-grow-1 h-100 overflow-auto">
            <div className="card-header d-flex justify-content-between align-items-center bg-light text-dark m-0 p-3">
              <div className="d-flex align-items-center gap-2 w-100">
                <h4 className="mb-0 text-dark">Platos</h4>

                {/* Opciones rápidas */}
                <div className="d-flex flex-wrap gap-2 ms-auto align-items-center">
                  {/* AGREGADO: Input Buscador */}
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
              <div className="card-body overflow-auto justify-content-start contenedor-platos">
                {productos
                  .filter((producto) => {
                    // MODIFICADO: Filtro combinado (Categoria AND Buscador)
                    const matchCategoria =
                      categoriaFiltroPlatos === "todo" ||
                      producto.categoria.nombre === categoriaFiltroPlatos;

                    const matchSearch = producto.nombre
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase());

                    return matchCategoria && matchSearch;
                  })
                  .map((producto) => {
                    const mesaId = id; // Mesa actual desde useParams
                    const isSelected = pedido.mesas[mesaId]?.items.some(
                      (item) => item.id === producto.id,
                    );
                    return (
                      <CardPlatos
                        key={producto.id}
                        item={producto}
                        isSelected={isSelected} // Determina si el plato está seleccionado
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
