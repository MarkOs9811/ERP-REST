import { useEffect, useState } from "react";
import { redirect, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/AxiosInstance";
import "../../css/EstilosPlatos.css";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import { CardPlatos } from "./CardPlatos";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  clearPedidoLlevar,
  removeItem,
} from "../../redux/pedidoLlevarSlice";
import {
  CheckmarkDoneOutline,
  RemoveOutline,
  TrashBinOutline,
} from "react-ionicons";
import { setEstado } from "../../redux/tipoVentaSlice";
import { CategoriaPlatos } from "./tareasVender/CategoriaPlatos";

export function ToLlevar() {
  const { id } = useParams();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pedido = useSelector((state) => state.pedidoLlevar);
  const categoriaFiltroPlatos = useSelector(
    (state) => state.categoriaFiltroPlatos.estado
  );

  // Obtener productos desde la API
  const fetchProductos = async () => {
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
  if (loading) return <p>Cargando Platos...</p>;
  if (error) return <p>{error}</p>;

  const handleAddPlatoPreventa = (producto) => {
    // Añadir el plato para la mesa actual
    dispatch(addItem({ ...producto }));
  };
  const handleRemovePlatoPreventa = (productoId) => {
    // Eliminar el plato de la mesa actual
    dispatch(removeItem({ id: productoId }));
  };
  const handleEliminarTodo = () => {
    dispatch(clearPedidoLlevar());
  };

  const hanldleRealizarPago = () => {
    dispatch(setEstado("llevar"));
    navigate("/vender/ventasMesas/detallesPago");
  };

  return (
    <div className="row g-3">
      {/* Columna de la cuenta */}
      <div className="col-md-3 d-flex flex-column ">
        <div className="card  shadow-sm flex-grow-1">
          <div className="card-header p-3 text-center border-bottom">
            <h4>Cuenta Para llevar</h4>
          </div>
          <div className="card-body p-3 d-flex flex-column">
            {/* Verificar si hay productos en la mesa actual */}
            {pedido.items.length > 0 ? (
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
                      {pedido.items.map((item) => (
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
                      {pedido.items
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
                      pedido.items.reduce(
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
                        {pedido.items.length}
                      </h6>
                    </div>
                    {/* Cantidad Total de Productos */}
                    <div className="bg-light rounded p-2 text-center flex-fill ml-2">
                      <small>Cantidad x Plato</small>
                      <h6 className="text-dark mb-0">
                        {pedido.items.reduce(
                          (acc, item) => acc + item.cantidad,
                          0
                        )}
                      </h6>
                    </div>
                  </div>
                </div>

                {/* Botón de Realizar Pedido */}

                <button
                  className="btn-realizarPedido btn-block w-100 p-3 mt-3"
                  onClick={() => hanldleRealizarPago()}
                >
                  <CheckmarkDoneOutline
                    color={"auto"}
                    height="30px"
                    width="30px"
                  />{" "}
                  Pagar
                </button>
                <button
                  className="btn-danger btn rounded btn-block w-100 p-3 mt-3"
                  onClick={() => handleEliminarTodo()}
                >
                  <TrashBinOutline color={"auto"} height="30px" width="30px" />{" "}
                  Eliminar Todo
                </button>
              </>
            ) : (
              <p className="text-center text-muted">Seleccione Platos.</p>
            )}
          </div>
        </div>
      </div>

      {/* Columna de los productos */}
      <div className="col-md-9 d-flex flex-column ">
        <div className="card shadow-sm  flex-grow-1">
          <div className="card-header d-flex flex-wrap bg-white border-bottom py-3">
            <div className="d-flex align-items-center gap-2 w-100">
              <h4 className="mb-0 text-dark ">Platos</h4>

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
                  const isSelected = pedido.items.some(
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
