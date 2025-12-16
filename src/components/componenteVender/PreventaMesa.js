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
} from "lucide-react";
import { getPreventaMesa } from "../../service/preventaService";
import { BuscadorPlatos } from "./tareasVender/BuscadorPlatos";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";
export function PreventaMesa() {
  const idMesa = useSelector((state) => state.mesa.idPreventaMesa);
  const categoriaFiltroPlatos = useSelector(
    (state) => state.categoriaFiltroPlatos.estado
  );
  const navigate = useNavigate();

  const caja = useSelector((state) => state.caja.caja);

  // PARA LE BUSCADOR
  const [searchTerm, setSearchTerm] = useState("");

  // const [mesa, setMesa] = useState(null);
  // extrayendo datos desde store de redux
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const pedido = useSelector((state) => state.pedido);
  const mesas = useSelector((state) => state.pedido.mesas);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // llamando a la preventa
  const {
    data: preventas = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["preventaMesa", idMesa, caja?.id],
    queryFn: () => getPreventaMesa(idMesa, caja.id), // ✅ aquí ejecutas con params
    enabled: !!idMesa && !!caja?.id, // ✅ se ejecuta solo si existen params
  });
  const mesa = preventas?.[0]?.mesa?.numero;
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
  // Añadir el plato para la mesa actual
  const handleAddPlatoPreventa = (producto) => {
    dispatch(addItem({ ...producto, mesaId: idMesa }));
  };

  // Buscar la mesa correspondiente en el pedido
  const handleRemovePlatoPreventa = (productoId) => {
    // const mesa = pedido.mesas[idMesa]; // Acceder a la mesa directamente

    // if (mesa) {
    //   // Buscar el plato dentro de los items de la mesa
    //   const platoExistente = mesa.items.find(
    //     (plato) => plato.id === productoId
    //   );

    //   if (platoExistente) {
    //     // Si el plato existe en la mesa, eliminarlo de Redux
    //     dispatch(removeItem({ id: productoId, mesaId: idMesa }));
    //   } else {
    //     // Si el plato no existe en el estado de Redux, llamar a la API para eliminarlo
    //     handleRemoveFromPreventaByPlato(productoId, idMesa);
    //   }
    // } else {
    //   console.log("Mesa no encontrada");
    // }
    handleRemoveFromPreventaByPlato(productoId, idMesa);
  };

  // ELIMINAR UN SOLO PLATO DE LA PREVENTA
  const handleRemoveFromPreventaByPlato = async (idProducto) => {
    try {
      const response = await axiosInstance.delete(
        `/vender/preventa/deletePlatoPreventa/${idProducto}/${idMesa}`
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

  // AGREGAR LOS PLATOS A LA PREVENTA DE LA MESA O BIEN ACTUALIZAMOS LOS NUEVOS PLATOS AGREGADOS
  const handleAddPlatoPreventaMesas = async () => {
    try {
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
        navigate(`/vender/mesas`);
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
    navigate(`/vender/mesas`);
  };

  const handleEliminarPreventeMesa = async (idMesa) => {
    try {
      const response = await axiosInstance.delete(
        `/vender/eliminarPreventaMesa/${idMesa}`
      );

      if (response.data.success) {
        ToastAlert("success", response.data.message);
        queryClient.invalidateQueries(["mesas"]);
        setModalQuestion(false); // Cerrar el modal
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

  // REALIZAR PAGOS
  const handleRealizarPago = () => {
    dispatch(setIdPreventaMesa(idMesa));
    dispatch(setEstado("mesa"));
    navigate("/vender/mesas/detallesPago");
  };

  if (isLoading) return <p>Cargando preventas...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  return (
    <div className=" h-100 bg-transparent">
      <div className="row g-3 h-100">
        <div className="col-md-3 h-100 p-0">
          <div className="card shadow-sm flex-grow-1 h-100 d-flex flex-column p-2">
            <div className="card-header d-flex align-items-center justify-content-center">
              <button
                className="btn btn-outline-dark me-auto"
                onClick={() => handleVolverMesas()}
              >
                <ChevronLeft className="text-auto" />
                Volver
              </button>

              <h6 className="text-center fw-bold align-middle h2 text-success">
                Mesa {mesa}
              </h6>
            </div>
            <div className="card-body p-0">
              {preventas?.length > 0 ||
              (pedido.mesas[idMesa] &&
                pedido.mesas[idMesa].items.length > 0) ? (
                <>
                  <div className="table-responsive">
                    <table className="table table-borderless align-middle mb-0">
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
                        {datosCombinados.map((item, index) => {
                          // Lógica para extraer datos (Mantenemos tu lógica original de '||')
                          const nombrePlato = item.plato?.nombre || item.nombre;
                          const precioUnitario =
                            item.plato?.precio || item.precio;
                          const precioTotal = item.cantidad * precioUnitario;

                          return (
                            <tr
                              key={`${item.id}-${index}`}
                              className="border-bottom hover-bg-light"
                            >
                              {/* 1. Descripción y Precio Unitario */}
                              <td className="ps-3 py-3">
                                <div className="d-flex flex-column">
                                  <span className="fw-bold text-dark fs-6">
                                    {nombrePlato}
                                  </span>
                                  <span className="text-muted small">
                                    S/. {Number(precioUnitario).toFixed(2)} c/u
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

                                  {/* Asumo que existe una función para añadir, si no, puedes borrar este botón */}
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-link text-decoration-none text-dark p-0 d-flex align-items-center justify-content-center"
                                    style={{ width: "24px", height: "24px" }}
                                    onClick={() =>
                                      handleAddPlatoPreventa &&
                                      handleAddPlatoPreventa(item)
                                    }
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
                                S/. {Number(precioTotal).toFixed(2)}
                              </td>

                              {/* 4. Botón Eliminar Fila (Trash) */}
                              <td className="text-end py-3 pe-3">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger border-0 bg-transparent p-1"
                                  title="Eliminar ítem"
                                  onClick={() =>
                                    handleRemovePlatoPreventa(item.id)
                                  }
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {/* Estado Vacío */}
                    {datosCombinados.length === 0 && (
                      <div className="text-center py-4 text-muted small">
                        No hay datos combinados
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
            <div className="card-footer card-footer-column">
              {/* Total */}

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
                      acc + item.cantidad * (item.plato?.precio || item.precio),
                    0
                  ) * 0.18
                ).toFixed(2)}
              </small>
            </div>

            {/* Botón de Realizar Pedido */}
            <div className="p-2">
              <div className="row g-2">
                {/* Realizar Pago */}
                <div className="col-12 col-lg-12">
                  <button
                    className="btn-realizarPedido w-100 h-100 p-3"
                    onClick={() => handleRealizarPago()}
                  >
                    <BanknoteArrowDown
                      className="text-auto"
                      height="24px"
                      width="24px"
                    />{" "}
                    Realizar Pago
                  </button>
                </div>

                {/* Botones restantes */}
                <div className="col-12 col-lg-12">
                  <div className="row g-2">
                    {/* Actualizar Pedido */}
                    <div className="col-12">
                      <button
                        className="btn btn-warning w-100 p-3"
                        onClick={handleAddPlatoPreventaMesas}
                      >
                        <CheckCheck
                          className="text-auto"
                          height="20px"
                          width="20px"
                        />{" "}
                        Actualizar Pedido
                      </button>
                    </div>

                    {/* Más Opciones */}
                    <div className="col-12">
                      <div className="row g-2">
                        <div className="col-12">
                          <button
                            className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center p-3"
                            onClick={() => handleTranferirToMesa()}
                          >
                            <Repeat
                              className="text-auto"
                              height="20px"
                              width="20px"
                            />
                            <span className="ms-2 align-middle">
                              Mover a Otra Mesa
                            </span>
                          </button>
                        </div>
                        <div className="col-lg-6 col-sm-4 col-lg-4">
                          <button className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center p-3">
                            <FileText
                              className="text-auto"
                              height="15px"
                              width="15px"
                            />
                            <small className="ms-0 align-middle">Nota</small>
                          </button>
                        </div>
                        <div className="col-lg-6 col-sm-4 col-lg-4">
                          <button
                            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center p-3"
                            onClick={() => handleCancelarPedidosQuestion()}
                          >
                            <BanIcon
                              className="text-auto"
                              height="15px"
                              width="15px"
                            />
                            <small className="ms-0 align-middle">
                              Cancelar
                            </small>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-9 h-100 ">
          <div className="card shadow-sm flex-grow-1 h-100 d-flex flex-column">
            <div className="card-header d-flex flex-wrap bg-white border-bottom">
              <div className="d-flex align-items-center gap-2 w-100">
                <h4 className="mb-0 text-dark">Platos</h4>

                {/* Opciones rápidas */}
                <div className="d-flex flex-wrap gap-2 ms-auto">
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
            </CondicionCarga>
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
    </div>
  );
}
