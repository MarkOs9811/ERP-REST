import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/AxiosInstance";
import "../../css/EstilosPlatos.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import ToastAlert from "../componenteToast/ToastAlert";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  clearPedido,
  removeItem,
  setMesaId,
} from "../../redux/pedidoSlice";

import { CardPlatos } from "./CardPlatos";
import { CategoriaPlatos } from "./tareasVender/CategoriaPlatos";
import { ContenedorPrincipal } from "../componentesReutilizables/ContenedorPrincipal";
import { GetMesasVender } from "../../service/accionesVender/GetMesasVender";
import { useQuery } from "@tanstack/react-query";
import { setIdPreventaMesa } from "../../redux/mesaSlice";
import { GetPlatosVender } from "../../service/accionesVender/GetPlatosVender";
import { Cargando } from "../componentesReutilizables/Cargando";
import { CheckCheck, CheckCheckIcon, Minus, MinusIcon } from "lucide-react";

export function ToMesa() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const id = useSelector((state) => state.mesa.idPreventaMesa);
  const categoriaFiltroPlatos = useSelector(
    (state) => state.categoriaFiltroPlatos.estado
  );

  // extrayendo datos desde store de redux
  const dispatch = useDispatch();
  const pedido = useSelector((state) => state.pedido);
  const mesas = useSelector((state) => state.pedido.mesas);
  const caja = useSelector((state) => state.caja.caja);

  // ===========================================
  const navigate = useNavigate();

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
    retry: 1,
    refetchOnWindowFocus: false,
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
    // Eliminar el plato de la mesa actual
    dispatch(removeItem({ id: productoId, mesaId: id }));
  };

  // FUNCION PARA REALIZAR EL PEDIDO Y VOLVER A MESAS
  const handleAddPlatoPreventaMesas = async () => {
    try {
      const datosPreventa =
        mesas[id]?.items.map((item) => ({
          idCaja: caja.id,
          idPlato: item.id,
          idMesa: id,
          cantidad: item.cantidad,
          precio: item.precio,
        })) || [];
      // Hacer la solicitud POST
      const response = await axiosInstance.post(
        "/vender/addPlatosPreVentaMesa",
        {
          pedidos: datosPreventa, // Enviar todos los pedidos
        }
      );

      // Manejo de la respuesta
      if (response.data.success) {
        ToastAlert("success", response.data.message + mesas.nom);
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

  return (
    <div className="card  h-100 bg-danger">
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

            <div className="card-body ">
              {/* Verificar si hay productos en la mesa actual */}
              {pedido.mesas[id] && pedido.mesas[id].items.length > 0 ? (
                <>
                  <table className=" table-borderless table-sm w-100">
                    <tbody>
                      {pedido.mesas[id].items.map((item) => (
                        <tr key={item.id} className="plato-row px-3">
                          <td className="d-flex justify-content-between align-items-center px-3">
                            <div>
                              <span className="d-block fw-bold">
                                {item.nombre}
                              </span>
                              <small>
                                {item.cantidad} x S/.{" "}
                                {Number(item.precio).toFixed(2)}
                              </small>
                            </div>
                          </td>
                          <td className="text-right align-middle">
                            <span>
                              S/.{" "}
                              {Number(item.cantidad * item.precio).toFixed(2)}
                            </span>
                          </td>
                          <td className="align-middle">
                            <button
                              className="btn-sm eliminar-btn"
                              onClick={() => handleRemovePlatoPreventa(item.id)}
                            >
                              <MinusIcon className="text-auto" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <p className="text-center text-muted">
                  No hay productos en esta mesa.
                </p>
              )}
            </div>
            <div className="card-footer">
              <div className="card">
                {/* Total */}
                <div className="d-flex justify-content-between align-items-center">
                  <span className="h5">Total</span>
                  <span className="h5 fw-bold text-success">
                    S/.{" "}
                    {(
                      pedido.mesas?.[id]?.items?.reduce(
                        (acc, item) => acc + item.cantidad * item.precio,
                        0
                      ) || 0
                    ).toFixed(2)}
                  </span>
                </div>

                <small className="text-muted d-block text-end">
                  IGV: S/.{" "}
                  {(
                    (pedido.mesas?.[id]?.items?.reduce(
                      (acc, item) => acc + item.cantidad * item.precio,
                      0
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
                          0
                        ) || 0}
                      </h6>
                    </div>
                  </div>
                </div>

                {/* Botón de Realizar Pedido */}
                <button
                  className="btn-realizarPedido btn-block w-100 p-3"
                  onClick={() => handleAddPlatoPreventaMesas()}
                >
                  <CheckCheckIcon
                    className="text-auto"
                    height="30px"
                    width="30px"
                  />{" "}
                  Realizar Pedido
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Columna de los productos */}
        <div className="col-md-9 ">
          <div className="card shadow-sm flex-grow-1 h-100">
            <div className="card-header d-flex flex-wrap bg-white border-bottom ">
              <div className="d-flex align-items-center gap-2 w-100">
                <h4 className="mb-0 text-dark">Platos</h4>

                {/* Opciones rápidas */}
                <div className="d-flex flex-wrap gap-2 ms-auto">
                  <CategoriaPlatos />
                </div>
              </div>
            </div>
            <div
              className="card-body overflow-auto p-0 justify-content-start  contenedor-platos"
              style={{ height: "calc(100vh - 260px)" }}
            >
              {loadinPlatos && (
                <div className="text-center p-5">
                  <p>
                    <Cargando />{" "}
                  </p>
                </div>
              )}
              {errorPlatos && (
                <div className="text-center p-5">
                  <p>Error al cargar los platos: {errorPlatosMessage}</p>
                </div>
              )}
              {productos
                .filter(
                  (producto) =>
                    categoriaFiltroPlatos === "todo" ||
                    producto.categoria.nombre === categoriaFiltroPlatos
                )
                .map((producto) => {
                  const mesaId = id; // Mesa actual desde useParams
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
    </div>
  );
}
