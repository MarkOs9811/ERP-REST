import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersectionObserver } from "@uidotdev/usehooks";
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
  CircleMinus,
  Minus,
  Plus,
  PlusIcon,
  Search,
  Trash2,
} from "lucide-react";

export function TransferirAlmacen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const dispatch = useDispatch();
  const seleccionados = useSelector((state) => state.productoTransferir.items);

  //   PARA ANIMAR EL SELECCIONADO

  const [ripple, setRipple] = useState({
    x: 0,
    y: 0,
    size: 0,
    show: false,
    id: null,
  });

  const handleClick = (e, item) => {
    const rect = e.currentTarget.getBoundingClientRect();

    // Activa el ripple solo para este ítem
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      size: Math.max(rect.width, rect.height),
      show: true,
      id: item.id,
    });

    dispatch(
      addItem({
        id: item.id,
        nombre: item.nombre,
        marca: item.marca,
        descripcion: item.descripcion,
        presentacion: item.presentacion,
        precioUnit: item.precioUnit,
        stock: item.cantidad,
      })
    );

    // Resetea el ripple después de la animación
    setTimeout(() => setRipple((prev) => ({ ...prev, show: false })), 600);
  };
  // ===================

  // OBTENER ALMACEN
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["almacen"],
    queryFn: GetAlmacen,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.current_page < lastPage.meta.last_page
        ? lastPage.meta.current_page + 1
        : undefined;
    },
    initialPageParam: 1,
  });

  // Observador para el infinite scroll
  const [loadMoreRef, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "50px",
  });

  // 3. Carga automática al intersectar
  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry, hasNextPage]);

  // 4. Aplanar datos
  // Obtiene todos los items de todas las páginas
  const dataAlmacen = useMemo(
    () => data?.pages.flatMap((page) => page.data) || [],
    [data]
  );
  // 5. Filtra los datos cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(dataAlmacen);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredData(
        dataAlmacen.filter((item) =>
          ["nombre", "descripcion", "marca"].some((key) =>
            item[key]?.toLowerCase().includes(term)
          )
        )
      );
    }
  }, [searchTerm, dataAlmacen?.length]);
  return (
    <div className="row g-3 ">
      <div className="col-lg-4 col-md-4 col-sm-12">
        <div className="card border h-100  bg-light">
          <div className="card-header  bg-light d-flex align-content-between align-align-items-center border-bottom ">
            <p className="card-title">Almacen</p>
            <div
              className="ms-auto position-relative"
              style={{ width: "300px" }}
            >
              <Search cssClasses="position-absolute  top-50 translate-middle-y text-muted ms-2" />
              <input
                className="form-control rounded-pill ps-5 "
                type="search"
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
            className="card-body p-2 overflow-auto m-0 bg-light"
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
                    key={item.id}
                    className={`list-item-transfer list-group-item d-flex justify-content-between align-items-center  border-0 border-bottom ${
                      seleccionados.some((sel) => sel.id === item.id)
                        ? "item-selected"
                        : ""
                    }`}
                    onClick={(e) => handleClick(e, item)}
                  >
                    {/* Efecto Ripple (solo para este ítem) */}
                    {ripple.show && ripple.id === item.id && (
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
                      {seleccionados.some((sel) => sel.id === item.id) ? (
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
                        <span>{item.nombre}</span>

                        <small className=" badge-info text-auto">
                          {item.marca} / {item.descripcion} /{" "}
                          {item.presentacion}
                        </small>
                      </div>
                    </div>
                    <div>
                      <span className="badge bg-light text-muted">
                        Stock {item.cantidad}
                      </span>
                      <span className="badge badge-ok">
                        S/. {item.precioUnit}
                      </span>
                    </div>
                  </li>
                ))}
                {/* Código existente del observer */}
                <div ref={loadMoreRef} className="p-2 text-center">
                  {isFetchingNextPage && <Cargando size="sm" />}
                  {!hasNextPage && (
                    <div className="alert py-1 my-1">
                      Total registros: {data?.pages[0]?.meta?.total || 0}
                    </div>
                  )}
                </div>
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-md-4 col-sm-12">
        <div className="card h-100 border">
          <div className="card-header d-flex">
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
            className="card-body overflow-auto bg-light"
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
                    key={item.id}
                    className="list-group-item d-flex justify-content-between align-items-center bg-success bg-opacity-10 position-relative group-hoverable"
                  >
                    <div className="d-flex align-items-center gap-2">
                      {/* Botón eliminar, oculto hasta hover */}
                      <button
                        className="btn btn-sm btn-delete opacity-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(removeProductoSeleccionado({ id: item.id }));
                        }}
                      >
                        <Trash2 className="text-auto" />
                      </button>
                      <CheckCheck color="#28a745" width="20px" height="20px" />

                      <div className="d-flex flex-column">
                        <span className="fw-bold text-secondary">
                          {item.nombre}
                        </span>
                        <small className="text-muted">
                          {item.marca} / {item.descripcion} /{" "}
                          {item.presentacion}
                        </small>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-outline-dark btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(removeItem({ id: item.id }));
                          }}
                          disabled={item.cantidad <= 1}
                        >
                          <Minus className="text-auto" />
                        </button>

                        <span className="px-2 fw-bold text-secondary">
                          {item.cantidad}
                        </span>

                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(
                              addItem({ id: item.id, nombre: item.nombre })
                            );
                          }}
                        >
                          <PlusIcon className="text-auto" />
                        </button>
                      </div>

                      <div className="d-flex flex-column text-end">
                        <span className="badge badge-info text-dark">
                          Stock: {item.stock ?? "--"}
                        </span>
                        <span className="badge badge-ok mt-1">
                          S/. {(item.precioUnit * item.cantidad).toFixed(2)}
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
        <div className="card border h-100">
          <div className="card-header border-bottom">
            <p className="card-title">Destino</p>
          </div>
          <div className="card-body bg-light">
            <DestinoTransferir />
          </div>
        </div>
      </div>
    </div>
  );
}
