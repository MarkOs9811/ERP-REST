import { useNavigate, useParams } from "react-router-dom";

import "../../css/EstilosPreventa.css";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import { CardPlatos } from "./CardPlatos";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  clearPedidoLlevar,
  removeItem,
} from "../../redux/pedidoLlevarSlice";

import { setEstado } from "../../redux/tipoVentaSlice";
import { CategoriaPlatos } from "./tareasVender/CategoriaPlatos";
import { useQuery } from "@tanstack/react-query";
import { GetPlatosVender } from "../../service/accionesVender/GetPlatosVender";
import { Cargando } from "../componentesReutilizables/Cargando";
import { CheckCheckIcon, MinusIcon, Trash2 } from "lucide-react";
import { BuscadorPlatos } from "./tareasVender/BuscadorPlatos";
import { useState } from "react";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";

export function ToLlevar() {
  const { id } = useParams();

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pedido = useSelector((state) => state.pedidoLlevar);
  const categoriaFiltroPlatos = useSelector(
    (state) => state.categoriaFiltroPlatos.estado
  );

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

  const handleAddPlatoPreventa = (producto) => {
    // Añadir el plato para la pedido llevar actual
    dispatch(addItem({ ...producto }));
  };
  const handleRemovePlatoPreventa = (productoId) => {
    // Eliminar el plato de la pedido llevar actual
    dispatch(removeItem({ id: productoId }));
  };
  const handleEliminarTodo = () => {
    dispatch(clearPedidoLlevar());
  };

  const hanldleRealizarPago = () => {
    dispatch(setEstado("llevar"));
    navigate("/vender/mesas/detallesPago");
  };

  return (
    <div className=" h-100  bg-transparent">
      <div className="row g-3 h-100 ">
        {/* Columna de la cuenta */}
        <div className="col-md-3 h-100 ">
          <div className="card shadow-sm flex-grow-1 h-100 d-flex flex-column p-2 ">
            <div className="card-header p-3 text-center border-bottom">
              <h4>Cuenta Para llevar</h4>
            </div>
            <div className="card-body p-0">
              {/* Verificar si hay productos en la mesa actual */}
              {pedido.items.length > 0 ? (
                <>
                  <table className="table-borderless table-sm w-100 ">
                    <tbody>
                      {pedido.items.map((item) => (
                        <tr key={item.id} className="p-2">
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
                <p className="text-center text-muted">Seleccione Platos.</p>
              )}
            </div>
            <div className="card-footer card-footer-column">
              {/* Total */}
              <div className=" pt-3">
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
                    <h6 className="text-success mb-0">{pedido.items.length}</h6>
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
                <CheckCheckIcon
                  className="text-auto"
                  height="30px"
                  width="30px"
                />{" "}
                Pagar
              </button>
              <button
                className="btn-danger btn rounded btn-block w-100 p-3 mt-3"
                onClick={() => handleEliminarTodo()}
              >
                <Trash2 className="text-auto" height="30px" width="30px" />{" "}
                Eliminar Todo
              </button>
            </div>
          </div>
        </div>

        {/* Columna de los productos */}
        <div className="col-md-9 h-100">
          <div className="card shadow-sm  flex-grow-1 h-100  p-0">
            <div className="card-header d-flex justify-content-between align-items-center bg-light text-dark p-3">
              <div className="d-flex align-items-center gap-3 w-100">
                <h4 className="mb-0 text-dark ">Platos</h4>

                {/* Opciones rápidas */}
                <div className="d-flex flex-wrap gap-3 ms-auto p-0">
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
            </CondicionCarga>
          </div>
        </div>
      </div>
    </div>
  );
}
