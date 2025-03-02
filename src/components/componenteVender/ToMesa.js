import { useEffect, useState } from "react";
import { redirect, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/AxiosInstance";
import "../../css/EstilosPlatos.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBackward,
  faBasketShopping,
  faBowlFood,
  faDrumstickBite,
  faFilter,
  faGlassCheers,
  faHamburger,
  faPlus,
  faSearch,
  faUtensils,
  faUtensilSpoon,
} from "@fortawesome/free-solid-svg-icons";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import ToastAlert from "../componenteToast/ToastAlert";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  clearPedido,
  removeItem,
  setMesaId,
} from "../../redux/pedidoSlice";
import {
  CheckmarkDoneOutline,
  FastFoodOutline,
  RemoveOutline,
} from "react-ionicons";
import { CardPlatos } from "./CardPlatos";
import { CategoriaPlatos } from "./tareasVender/CategoriaPlatos";

export function ToMesa() {
  const id = useSelector((state) => state.mesa.idPreventaMesa);
  const categoriaFiltroPlatos = useSelector(
    (state) => state.categoriaFiltroPlatos.estado
  );
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // extrayendo datos desde store de redux
  const dispatch = useDispatch();
  const pedido = useSelector((state) => state.pedido);
  const mesas = useSelector((state) => state.pedido.mesas);
  const caja = useSelector((state) => state.caja.caja);

  // ===========================================
  const navigate = useNavigate();

  // Obtener productos desde la API
  const fetchProductos = async () => {
    dispatch(setMesaId(id));
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
  }, [id]);

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const habldeVolverMesas = () => {
    // Navegar a Platos.js con el id de la mesa como parámetro
    navigate(`/vender/ventasMesas`);
  };

  const handleAddPlatoPreventa = (producto) => {
    // Añadir el plato para la mesa actual
    dispatch(addItem({ ...producto, mesaId: id }));
  };

  const handleRemovePlatoPreventa = (productoId) => {
    // Eliminar el plato de la mesa actual
    dispatch(removeItem({ id: productoId, mesaId: id }));
  };

  if (loading) return <p>Cargando Platos...</p>;
  if (error) return <p>{error}</p>;

  // FUNCION PARA REALIZAR EL PEDIDO Y VOLVER A MESAS
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
        ToastAlert("success", response.data.message + mesas.nom);
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

  return (
    <div className="row g-3 ">
      {/* Columna de la cuenta */}

      <div className="col-md-3 h-100">
        <div
          className="card shadow-sm d-flex flex-column"
          style={{ height: "100%" }}
        >
          {/* Título */}
          <div className="card-header p-3 d-flex justify-content-between align-items-center border-bottom">
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
            <div className="d-flex align-items-center text-center">
              <h5 className="m-0">
                <span className="h4">Platos mesa {id}</span>
                <FastFoodOutline
                  color={"auto"}
                  width={"35px"}
                  height={"35px"}
                  className="ms-2"
                />
              </h5>
            </div>
          </div>

          <div
            className="card-body p-3 d-flex flex-column"
            style={{ height: "100%" }}
          >
            {/* Verificar si hay productos en la mesa actual */}
            {pedido.mesas[id] && pedido.mesas[id].items.length > 0 ? (
              <>
                {/* Tabla de productos */}
                <div
                  className="tabla-scroll"
                  style={{
                    overflowY: "auto",
                    maxHeight: "calc(100% - 200px)", // Ajusta según el espacio que deba ocupar la tabla
                    flex: 1,
                  }}
                >
                  <table className="table table-borderless table-sm">
                    <tbody>
                      {pedido.mesas[id].items.map((item) => (
                        <tr key={item.id} className="plato-row">
                          <td className="d-flex justify-content-between align-items-center">
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
                      {pedido.mesas[id].items
                        .reduce(
                          (acc, item) => acc + item.cantidad * item.precio,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                  <small className="text-muted d-block text-end">
                    IGV: S/.{" "}
                    {(
                      pedido.mesas[id].items.reduce(
                        (acc, item) => acc + item.cantidad * item.precio,
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
                        {pedido.mesas[id].items.length}
                      </h6>
                    </div>
                    {/* Cantidad Total de Productos */}
                    <div className="bg-light rounded p-2 text-center flex-fill ml-2">
                      <small>Cantidad x Plato</small>
                      <h6 className="text-dark mb-0">
                        {pedido.mesas[id].items.reduce(
                          (acc, item) => acc + item.cantidad,
                          0
                        )}
                      </h6>
                    </div>
                  </div>
                </div>

                {/* Botón de Realizar Pedido */}

                <button
                  className="btn-realizarPedido btn-block w-100 p-3"
                  onClick={() => handleAddPlatoPreventaMesas()}
                >
                  <CheckmarkDoneOutline
                    color={"auto"}
                    height="30px"
                    width="30px"
                  />{" "}
                  Realizar Pedido
                </button>
              </>
            ) : (
              <p className="text-center text-muted">
                No hay productos en esta mesa.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Columna de los productos */}
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
