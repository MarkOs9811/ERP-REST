import { useNavigate, useParams } from "react-router-dom";
import "../../css/EstilosPreventa.css";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import { CardPlatos } from "./CardPlatos";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  clearPedidoLlevar,
  removeItem,
  setDescripcion, // Importamos la nueva acción
} from "../../redux/pedidoLlevarSlice";

import { setEstado } from "../../redux/tipoVentaSlice";
import { CategoriaPlatos } from "./tareasVender/CategoriaPlatos";
import { useQuery } from "@tanstack/react-query";
import { GetPlatosVender } from "../../service/accionesVender/GetPlatosVender";
import {
  CheckCheckIcon,
  Minus,
  Plus,
  Trash2,
  FileText, // Icono para la nota
  User,
  Utensils,
  Notebook,
  Hamburger, // Icono para cliente/nota
} from "lucide-react";
import { BuscadorPlatos } from "./tareasVender/BuscadorPlatos";
import { useState } from "react";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";

export function ToLlevar() {
  const { id } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Obtenemos items y la descripción del estado
  const { items, descripcion } = useSelector((state) => state.pedidoLlevar);

  const categoriaFiltroPlatos = useSelector(
    (state) => state.categoriaFiltroPlatos.estado,
  );

  const {
    data: productos = [],
    isLoading: loadinPlatos,
    isError: errorPlatos,
  } = useQuery({
    queryKey: ["platos"],
    queryFn: GetPlatosVender,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const handleAddPlatoPreventa = (producto) => {
    dispatch(addItem({ ...producto }));
  };
  const handleRemovePlatoPreventa = (productoId) => {
    dispatch(removeItem({ id: productoId }));
  };
  const handleEliminarTodo = () => {
    // Podrías agregar un confirm("¿Seguro?") aquí si deseas
    dispatch(clearPedidoLlevar());
  };

  // Manejador para el cambio de texto
  const handleDescripcionChange = (e) => {
    dispatch(setDescripcion(e.target.value));
  };

  const hanldleRealizarPago = () => {
    dispatch(setEstado("llevar"));
    navigate("/vender/mesas/detallesPago");
  };

  return (
    <div className="h-100 bg-transparent">
      <div className="row  h-100">
        {/* COLUMNA IZQUIERDA: CUENTA Y DETALLES */}
        <div className="col-md-4 col-lg-3 h-100">
          <div className="card  flex-grow-1 h-100 d-flex flex-column border-0 overflow-hidden">
            {/* Header: Título y Botón Eliminar (Reubicado) */}
            <div className="card-header m-0 bg-white border-bottom d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0 fw-bold text-dark">Para Llevar</h5>
              {items.length > 0 && (
                <button
                  className="btn btn-outline-danger d-flex align-items-center gap-1"
                  onClick={handleEliminarTodo}
                  title="Limpiar cuenta"
                >
                  <Trash2 size={16} />
                  <span className="small">Limpiar</span>
                </button>
              )}
            </div>

            <div className="card-body overflow-auto p-0 d-flex flex-column ">
              {/* Lista de Platos */}

              {items.length > 0 ? (
                <div className="overflow-auto rounded-none  ">
                  <table className="table table-borderless align-middle mb-0">
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
                      {items.map((item) => (
                        <tr key={item.id} className="border-bottom">
                          <td className="ps-3 py-2">
                            <div className="d-flex flex-column">
                              <span
                                className="fw-bold text-dark small"
                                style={{ fontSize: "0.9rem" }}
                              >
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
                              className="d-flex align-items-center justify-content-center border rounded-pill mx-auto px-1"
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
                                className="fw-bold mx-1"
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
                            className="text-end py-2 pe-3 fw-bold text-dark"
                            style={{ fontSize: "0.9rem" }}
                          >
                            S/. {(item.cantidad * item.precio).toFixed(2)}
                          </td>
                          <td className="text-center py-2">
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
                  <p className="small mb-0">La cuenta está vacía</p>
                </div>
              )}
            </div>

            {/* Footer: Totales y Botón Pagar */}
            <div
              className="card-footer bg-white border-top p-3 shadow-lg"
              style={{ zIndex: 10 }}
            >
              {/* SECCIÓN NUEVA: Input de Descripción General */}
              <div className="p-3 bg-white mb-2 ">
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
                    placeholder="Ej: Juan Perez - Sin cremas, cubiertos extra..."
                    style={{ resize: "none", fontSize: "0.9rem" }}
                    value={descripcion}
                    onChange={handleDescripcionChange}
                  ></textarea>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-end mb-3">
                <div className="text-muted small">
                  <div>Items: {items.length}</div>
                  <div>
                    Cant: {items.reduce((acc, i) => acc + i.cantidad, 0)}
                  </div>
                </div>
                <div className="text-end">
                  <small
                    className="text-muted d-block"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Total a Pagar
                  </small>
                  <span className="h4 fw-bold text-dark mb-0">
                    S/.{" "}
                    {items
                      .reduce(
                        (acc, item) => acc + item.cantidad * item.precio,
                        0,
                      )
                      .toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                className="btn-realizarPedido w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                onClick={hanldleRealizarPago}
                disabled={items.length === 0}
              >
                <CheckCheckIcon size={20} />
                COBRAR / ENVIAR
              </button>
            </div>
          </div>
        </div>
        {/* COLUMNA DERECHA: CATÁLOGO (Sin cambios mayores, solo ancho) */}
        <div className="col-md-8 col-lg-9 h-100">
          <div className="card  flex-grow-1 h-100 p-0 m-0 overflow-auto">
            <div className="card-header bg-white border-bottom py-3 px-3 m-0">
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
              <div className="card-body overflow-auto p-2">
                <div className="contenedor-platos">
                  {/* Asegúrate que tu CSS defina .contenedor-platos como grid */}
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
                      const isSelected = items.some(
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
