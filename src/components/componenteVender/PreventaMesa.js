import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/AxiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import ModalAlertQuestion from "../componenteToast/ModalAlertQuestion";
import {
  ArrowBackOutline,
  ArrowRedoOutline,
  CashOutline,
  CheckmarkDoneOutline,
  DocumentTextOutline,
  PersonAddOutline,
  RemoveOutline,
  TrashBinOutline,
} from "react-ionicons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBasketShopping,
  faFilter,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import {
  addItem,
  clearPedido,
  removeItem,
  setMesaId,
} from "../../redux/pedidoSlice";
import "../../css/EstilosPlatos.css";
import { CardPlatos } from "./CardPlatos";
import ToastAlert from "../componenteToast/ToastAlert";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import { TransferirToMesa } from "./tareasVender/TransferirToMesa";
import { setIdPreventaMesa } from "../../redux/mesaSlice";
import { getPreventaMesa } from "../../service/preventaService";
import { setEstado } from "../../redux/tipoVentaSlice";
import { CategoriaPlatos } from "./tareasVender/CategoriaPlatos";
export function PreventaMesa() {
  const idMesa = useSelector((state) => state.mesa.idPreventaMesa);
  const categoriaFiltroPlatos = useSelector(
    (state) => state.categoriaFiltroPlatos.estado
  );
  const caja = useSelector((state) => state.caja.caja);
  const [preventas, setPreventas] = useState([]);

  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mesa, setMesa] = useState(null);
  // extrayendo datos desde store de redux
  const dispatch = useDispatch();
  const pedido = useSelector((state) => state.pedido);
  const mesas = useSelector((state) => state.pedido.mesas);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const getPreventeMesa = async () => {
    const result = await getPreventaMesa(idMesa, caja.id);
    if (result.success) {
      setPreventas(result.preventas);
      const numeroMesa = result.preventas[0]?.mesa?.numero;
      if (numeroMesa) {
        setMesa(numeroMesa);
      }
    } else {
      console.error(result.message);
    }
  };

  useEffect(() => {
    getPreventeMesa();
  }, [idMesa, caja]);

  // Obtener productos desde la API
  const fetchProductos = async () => {
    dispatch(setMesaId(idMesa));
    setLoading(true);
    try {
      const response = await axiosInstance.get("/vender/getPlatos");
      if (response.data.success) {
        setProductos(response.data.productos);
      } else {
        setError("No se pudieron obtener los productos.");
      }
    } catch (err) {
      setError("Hubo un error al cargar los productos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [idMesa]);

  // Añadir el plato para la mesa actual
  const handleAddPlatoPreventa = (producto) => {
    dispatch(addItem({ ...producto, mesaId: idMesa }));
  };

  // Buscar la mesa correspondiente en el pedido
  const handleRemovePlatoPreventa = (productoId) => {
    const mesa = pedido.mesas[idMesa]; // Acceder a la mesa directamente

    if (mesa) {
      // Buscar el plato dentro de los items de la mesa
      const platoExistente = mesa.items.find(
        (plato) => plato.id === productoId
      );

      if (platoExistente) {
        // Si el plato existe en la mesa, eliminarlo de Redux
        dispatch(removeItem({ id: productoId, mesaId: idMesa }));
      } else {
        // Si el plato no existe en el estado de Redux, llamar a la API para eliminarlo
        handleRemoveFromPreventaByPlato(productoId, idMesa);
      }
    } else {
      console.log("Mesa no encontrada");
    }
  };

  // ELIMINAR UN SOLO PLATO DE LA PREVENTA
  const handleRemoveFromPreventaByPlato = async (idProducto) => {
    try {
      const response = await axiosInstance.delete(
        `/vender/preventa/deletePlatoPreventa/${idProducto}/${idMesa}`
      );
      if (response.data.success) {
        getPreventeMesa();
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // AGREGAR LOS PLATOS A LA PREVENTA DE LA MESA O BIEN ACTUALIZAMOS LOS NUEVOS PLATOS AGREGADOS
  const handleAddPlatoPreventaMesas = async () => {
    try {
      // Formatear los datos para enviar al backend
      console.log(caja.id);
      const datosPreventa = Object.keys(mesas).flatMap((mesaId) => {
        return mesas[mesaId].items.map((item) => ({
          idCaja: caja.id, // ID de la caja
          idPlato: item.id, // ID del plato
          idMesa: mesaId, // ID de la mesa
          cantidad: item.cantidad, // Cantidad del plato
          precio: item.precio, // Precio del plato
        }));
      });
      // Hacer la solicitud POST
      const response = await axiosInstance.post(
        "/vender/addPlatosPreVentaMesa",
        {
          pedidos: datosPreventa, // Enviar todos los pedidos
        }
      );

      // Manejo de la respuesta
      if (response.data.success) {
        ToastAlert("success", response.data.message);
        Object.keys(mesas).forEach((mesaId) => {
          dispatch(clearPedido(mesaId));
        });
        navigate(`/vender/ventasMesas`);
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      ToastAlert("error", "Error de conexión: " + error.message);
    }
  };

  // COMBINANDO LOS DATOS DE REDUX COMO LA DB
  const datosCombinados = [
    ...preventas,
    ...(pedido.mesas[idMesa]?.items || []),
  ];

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
    navigate(`/vender/ventasMesas`);
  };
  const handleEliminarPreventeMesa = async (idMesa) => {
    try {
      const response = await axiosInstance.delete(
        `/vender/eliminarPreventaMesa/${idMesa}`
      );

      if (response.data.success) {
        ToastAlert("success", response.data.message);
        setModalQuestion(false); // Cerrar el modal
        navigate(`/vender/ventasMesas`);
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

  // REALIZAR PAGOS
  const handleRealizarPago = () => {
    dispatch(setIdPreventaMesa(idMesa));
    dispatch(setEstado("mesa"));
    navigate("/vender/ventasMesas/detallesPago");
  };
  return (
    <div className="row g-3">
      <div className="col-md-3">
        <div className="card p-3 shadow-sm">
          <div className="card-header d-flex align-items-center justify-content-center">
            <button
              className="btn btn-outline-dark me-auto"
              onClick={() => handleVolverMesas()}
            >
              <ArrowBackOutline color={"auto"} />
              Volver
            </button>
            <h3 className="text-center text-auto align-middle mx-3">Cuenta</h3>
            <h6 className="text-center fw-bold align-middle h2 text-success">
              Mesa {mesa}
            </h6>
          </div>
          <div className="card-body p-0 d-flex flex-column">
            {preventas.length > 0 ||
            (pedido.mesas[idMesa] && pedido.mesas[idMesa].items.length > 0) ? (
              <>
                <div className="tabla-scroll">
                  <table className="table table-borderless table-sm">
                    <tbody>
                      {datosCombinados.map((item, index) => (
                        <tr key={`${item.id}-${index}`} className="plato-row">
                          <td className="d-flex justify-content-between align-items-center">
                            <div>
                              <span className="d-block fw-bold">
                                {item.plato?.nombre || item.nombre}
                              </span>
                              <small>
                                {item.cantidad} x S/.{" "}
                                {Number(
                                  item.plato?.precio || item.precio
                                ).toFixed(2)}
                              </small>
                            </div>
                          </td>
                          <td className="text-right align-middle">
                            <span>
                              S/.{" "}
                              {Number(
                                item.cantidad *
                                  (item.plato?.precio || item.precio)
                              ).toFixed(2)}
                            </span>
                          </td>
                          <td className="align-middle">
                            <button
                              className="btn-sm eliminar-btn"
                              onClick={() => handleRemovePlatoPreventa(item.id)}
                            >
                              <RemoveOutline color={"auto"} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Total */}
                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="h5">Total</span>
                    <span className="h5 fw-bold text-success">
                      S/.{" "}
                      {datosCombinados
                        .reduce(
                          (acc, item) =>
                            acc +
                            item.cantidad * (item.plato?.precio || item.precio),
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                  <small className="text-muted d-block text-end">
                    IGV: S/.{" "}
                    {(
                      datosCombinados.reduce(
                        (acc, item) =>
                          acc +
                          item.cantidad * (item.plato?.precio || item.precio),
                        0
                      ) * 0.18
                    ).toFixed(2)}
                  </small>
                </div>
                {/* Puntos de lealtad */}
                <div className="mt-3">
                  <div className="d-flex justify-content-between">
                    {/* Total de Pedidos */}
                    <div className="bg-light rounded p-2 text-center flex-fill mr-2">
                      <small>Total de Platos</small>
                      <h6 className="text-success mb-0">
                        {datosCombinados.length}
                      </h6>
                    </div>
                    {/* Cantidad Total de Productos */}
                    <div className="bg-light rounded p-2 text-center flex-fill ml-2">
                      <small>Cantidad x Plato</small>
                      <h6 className="text-dark mb-0">
                        {datosCombinados.reduce(
                          (acc, item) => acc + item.cantidad,
                          0
                        )}
                      </h6>
                    </div>
                  </div>
                </div>
                {/* Botón de Realizar Pedido */}
                <div className="mt-4">
                  <div className="row g-2">
                    {/* Realizar Pago */}
                    <div className="col-12 col-lg-4">
                      <button
                        className="btn-realizarPedido w-100 h-100 p-3"
                        onClick={() => handleRealizarPago()}
                      >
                        <CashOutline
                          color={"auto"}
                          height="24px"
                          width="24px"
                        />{" "}
                        Realizar Pago
                      </button>
                    </div>

                    {/* Botones restantes */}
                    <div className="col-12 col-lg-8">
                      <div className="row g-2">
                        {/* Actualizar Pedido */}
                        <div className="col-12">
                          <button
                            className="btn btn-warning w-100 p-3"
                            onClick={handleAddPlatoPreventaMesas}
                          >
                            <CheckmarkDoneOutline
                              color={"auto"}
                              height="20px"
                              width="20px"
                            />{" "}
                            Actualizar Pedido
                          </button>
                        </div>

                        {/* Más Opciones */}
                        <div className="col-12">
                          <div className="row g-2">
                            <div className="col-12 col-sm-4 col-lg-4">
                              <button className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center p-3">
                                <PersonAddOutline
                                  color="auto"
                                  height="15px"
                                  width="15px"
                                />
                                <small className="ms-0 align-middle">
                                  Clientes
                                </small>
                              </button>
                            </div>
                            <div className="col-12 col-sm-4 col-lg-4">
                              <button className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center p-3">
                                <DocumentTextOutline
                                  color="auto"
                                  height="15px"
                                  width="15px"
                                />
                                <small className="ms-0 align-middle">
                                  Nota
                                </small>
                              </button>
                            </div>
                            <div className="col-12 col-sm-4 col-lg-4">
                              <button
                                className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center p-3"
                                onClick={() => handleCancelarPedidosQuestion()}
                              >
                                <TrashBinOutline
                                  color="auto"
                                  height="15px"
                                  width="15px"
                                />
                                <small className="ms-0 align-middle">
                                  Cancelar
                                </small>
                              </button>
                            </div>
                            <div className="col-12">
                              <button
                                className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center p-3"
                                onClick={() => handleTranferirToMesa()}
                              >
                                <ArrowRedoOutline
                                  color="auto"
                                  height="20px"
                                  width="20px"
                                />
                                <span className="ms-2 align-middle">
                                  Mover a Otra Mesa
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center text-muted">
                No hay productos en esta mesa.
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="col-md-9 d-flex flex-column ">
        <div className="card shadow-sm flex-grow-1">
          <div className="card-header d-flex flex-wrap bg-white border-bottom py-3">
            <div className="d-flex align-items-center gap-2 w-100">
              <h4 className="mb-0 text-dark">Platos</h4>

              {/* Opciones rápidas */}
              <div className="d-flex flex-wrap gap-2 ms-auto">
                <CategoriaPlatos />
              </div>
            </div>
          </div>
          <div className="card-body ">
            <div className="justify-content-start contenedor-platos pb-5">
              {productos
                .filter(
                  (producto) =>
                    categoriaFiltroPlatos === "todo" ||
                    producto.categoria.nombre === categoriaFiltroPlatos
                )
                .map((producto) => {
                  const mesaId = idMesa; // Mesa actual desde useParams
                  const isSelected = pedido.mesas[mesaId]?.items.some(
                    (item) => item.id === producto.id
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
          </div>
        </div>
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
