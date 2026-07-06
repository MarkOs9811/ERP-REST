import { useQuery } from "@tanstack/react-query";
import { GetAlmacen } from "../../service/serviceAlmacen/GetAlmacen";
import { Cargando } from "../componentesReutilizables/Cargando";
import { useEffect, useMemo, useState } from "react";

import { DestinoTransferir } from "./componenteTransferir/DestinoTransferir";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  clearProductoSelececcionado,
  removeItem,
  removeProductoSeleccionado,
} from "../../redux/productoTransferirSlice";
import {
  Check,
  CheckCheck,
  Minus,
  PlusIcon,
  Search,
  Trash2,
} from "lucide-react";
import ToastAlert from "../componenteToast/ToastAlert";

export function TransferirAlmacen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const dispatch = useDispatch();
  const seleccionados = useSelector((state) => state.productoTransferir.items);
  const seleccionadosById = useMemo(
    () => new Map(seleccionados.map((item) => [item.id, item])),
    [seleccionados],
  );

  // Animación del ripple
  const [ripple, setRipple] = useState({
    x: 0,
    y: 0,
    size: 0,
    show: false,
    id: null,
  });

  const handleClick = (e, item) => {
    const stockDisponible = Number(item?.cantidad) || 0;
    const seleccionado = seleccionadosById.get(item?.id);

    if (stockDisponible <= 0) {
      ToastAlert("warning", "Este producto no tiene stock disponible.");
      return;
    }

    if (seleccionado && seleccionado.cantidad >= stockDisponible) {
      ToastAlert("warning", "No puedes transferir más de su stock disponible.");
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();

    // Activa el ripple solo para este ítem
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      size: Math.max(rect.width, rect.height),
      show: true,
      id: item?.id,
    });

    // Agregar al store Redux
    dispatch(
      addItem({
        id: item?.id,
        nombre: item?.nombre,
        marca: item?.marca,
        descripcion: item?.descripcion,
        presentacion: item?.presentacion,
        precioUnit: Number(item?.precioUnit) || 0,
        stock: stockDisponible,
      }),
    );

    // Desactiva el efecto ripple después de 600 ms
    setTimeout(() => setRipple((prev) => ({ ...prev, show: false })), 600);
  };
  // ===================

  const {
    data: dataAlmacen = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["almacen"],
    queryFn: GetAlmacen, // sin paréntesis ❗ (React Query la ejecuta)
    retry: 1,
  });

  // ===================
  // FILTRAR LOS DATOS
  // ===================
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(Array.isArray(dataAlmacen) ? dataAlmacen : []);
    } else {
      const term = searchTerm.toLowerCase();
      const filtrados = (Array.isArray(dataAlmacen) ? dataAlmacen : []).filter(
        (item) =>
          ["nombre", "descripcion", "marca"].some((key) =>
            item[key]?.toLowerCase().includes(term),
          ),
      );
      setFilteredData(filtrados);
    }
  }, [searchTerm, dataAlmacen]);

  return (
    <div className="row g-3 transfer-layout">
      <div className="col-lg-4 col-md-4 col-sm-12">
        <div className="card border h-100 transfer-panel">
          <div className="card-header d-flex align-content-between align-align-items-center border-bottom transfer-panel-header">
            <p className="card-title">Almacen</p>
            <div className="ms-auto position-relative d-flex">
              <Search className="position-absolute   my-2 text-muted ms-2" />
              <input
                className="form-control rounded-pill ps-5 transfer-search"
                type="search"
                inputmode="search"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  paddingLeft: "2.5rem", // Asegura espacio para el icono
                }}
              />
            </div>
          </div>

          <div
            className="card-body p-2 overflow-auto m-0 bg-light transfer-list-scroller"
            style={{ maxHeight: "calc(100vh - 340px)" }}
          >
            {isLoading ? (
              <Cargando className="py-4" />
            ) : isError ? (
              <p className="text-auto py-4 text-center">
                Error al cargar datos
              </p>
            ) : (
              <ul className="list-group border-none">
                {filteredData?.map((item, index) => (
                  <li
                    key={item?.id}
                    className={`list-item-transfer list-group-item d-flex justify-content-between align-items-center  border-0 border-bottom ${
                      seleccionados.some((sel) => sel.id === item?.id)
                        ? "item-selected"
                        : ""
                    } ${Number(item?.cantidad) <= 0 ? "item-disabled" : ""}`}
                    onClick={(e) => handleClick(e, item)}
                  >
                    {/* Efecto Ripple (solo para este ítem) */}
                    {ripple.show && ripple.id === item?.id && (
                      <span
                        className="ripple-effect"
                        style={{
                          left: ripple.x - ripple.size / 2,
                          top: ripple.y - ripple.size / 2,
                          width: ripple.size,
                          height: ripple.size,
                        }}
                      />
                    )}

                    <div className="d-flex align-items-center gap-2 ">
                      {seleccionados.some((sel) => sel.id === item?.id) ? (
                        <CheckCheck
                          color="#28a745"
                          width="22px"
                          height="22px"
                          style={{ flexShrink: 0 }}
                        />
                      ) : (
                        <Check
                          color="#c6c6c6"
                          width="22px"
                          height="22px"
                          style={{ flexShrink: 0 }}
                        />
                      )}
                      <div className="d-flex flex-column">
                        <span>{item?.nombre}</span>

                        <small className=" badge-info text-auto">
                          {item?.marca} / {item?.descripcion} /{" "}
                          {item?.presentacion}
                        </small>
                      </div>
                    </div>
                    <div>
                      <span className="badge bg-light text-muted me-1">
                        Stock {item?.cantidad}
                      </span>
                      <span className="badge badge-ok">
                        S/. {item?.precioUnit}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-md-4 col-sm-12">
        <div className="card h-100 border transfer-panel">
          <div className="card-header d-flex transfer-panel-header">
            <p className="card-title">
              Seleccionados ({seleccionados?.length})
            </p>
            <div className="ms-auto">
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => dispatch(clearProductoSelececcionado())}
              >
                Borrar todo
              </button>
            </div>
          </div>
          <div
            className="card-body overflow-auto bg-light transfer-list-scroller"
            style={{ maxHeight: "calc(100vh - 340px)" }}
          >
            {seleccionados?.length === 0 ? (
              <p className="text-muted text-center py-4">
                No hay items seleccionados
              </p>
            ) : (
              <ul className="list-group">
                {seleccionados.map((item) => (
                  <li
                    key={item?.id}
                    className="list-group-item d-flex justify-content-between align-items-center  bg-opacity-10 position-relative group-hoverable"
                  >
                    <div className="d-flex align-items-center gap-2">
                      {/* Botón eliminar, oculto hasta hover */}
                      <button
                        className="btn btn-sm btn-delete opacity-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            removeProductoSeleccionado({ id: item?.id }),
                          );
                        }}
                      >
                        <Trash2 />
                      </button>

                      <div className="d-flex flex-column">
                        <span className="fw-bold text-secondary">
                          {item?.nombre}
                        </span>
                        <small className="text-muted">
                          {item?.marca} / {item?.descripcion} /{" "}
                          {item?.presentacion}
                        </small>
                      </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-center gap-3">
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-outline-dark btn-sm p-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(removeItem({ id: item?.id }));
                          }}
                          disabled={item?.cantidad <= 1}
                        >
                          <Minus size={18} />
                        </button>

                        <span className="px-2 fw-bold text-secondary transfer-qty-pill">
                          {item?.cantidad}
                        </span>

                        <button
                          className="btn btn-outline-primary btn-sm p-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(
                              addItem({
                                id: item?.id,
                                nombre: item?.nombre,
                                marca: item?.marca,
                                descripcion: item?.descripcion,
                                presentacion: item?.presentacion,
                                precioUnit: item?.precioUnit,
                                stock: item?.stock,
                              }),
                            );
                          }}
                          disabled={item?.cantidad >= item?.stock}
                          title={
                            item?.cantidad >= item?.stock
                              ? "Cantidad máxima alcanzada"
                              : "Aumentar cantidad"
                          }
                        >
                          <PlusIcon size={18} />
                        </button>
                      </div>

                      <div className="d-flex flex-column text-end">
                        <span className="badge badge-info text-dark">
                          Stock: {item?.stock ?? "--"}
                        </span>
                        <span className="badge badge-ok mt-1">
                          S/. {(item?.precioUnit * item?.cantidad).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-md-4 col-sm-12">
        <div className="card border h-100 transfer-panel">
          <div className="card-header border-bottom transfer-panel-header">
            <p className="card-title">Destino</p>
          </div>
          <div className="card-body bg-light transfer-list-scroller">
            <DestinoTransferir />
          </div>
        </div>
      </div>
    </div>
  );
}
