import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getLibroDiario } from "../../service/serviceFinanzas/GetLibroDiario";
import {
  ArchiveX,
  BookOpenCheck,
  BookText,
  CalendarDays,
  ClipboardType,
  EllipsisVertical,
} from "lucide-react";
import { PostData } from "../../service/CRUD/PostData";
import { useState } from "react";
import ModalAlertQuestion from "../../components/componenteToast/ModalAlertQuestion";
// Importa tu componente de modal personalizado

export function LibroDiario() {
  const queryClient = useQueryClient();

  // Estados de carga para los botones
  const [loadingCarga, setLoadingCarga] = useState(false);
  const [loadingVentas, setLoadingVentas] = useState(false);

  // Estados para controlar la visibilidad de los modales
  const [modalCierreVentas, setModalCierreVentas] = useState(false);
  const [modalCargaMayor, setModalCargaMayor] = useState(false);

  const {
    data = {},
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["libroDiario"],
    queryFn: getLibroDiario,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // --- LÓGICA 1: CARGA AL LIBRO MAYOR ---

  // Función A: Ejecuta la acción (se pasa al Modal)
  const ejecutarCargaMayor = async () => {
    setLoadingCarga(true);
    const payload = {
      anio: new Date().getFullYear(),
      idEmpresa: 2,
    };

    // Llamada al backend
    // Corregí el typo "finazas" -> "finanzas" si aplica, revisa tu ruta
    const exito = await PostData("finanzas/cargarLibroMayor", payload);

    if (exito) {
      queryClient.invalidateQueries(["libroMayor"]);
    }
    setLoadingCarga(false);
    return exito; // Retornamos para que el modal sepa si cerrar
  };

  // --- LÓGICA 2: CIERRE DE VENTAS ANUAL ---

  // Función B: Ejecuta la acción (se pasa al Modal)
  const ejecutarCierreVentas = async () => {
    setLoadingVentas(true);
    const payload = {
      anio: new Date().getFullYear(),
    };

    const exito = await PostData("finanzas/cierreVentasAnual", payload);

    if (exito) {
      queryClient.invalidateQueries(["libroDiario"]);
    }
    setLoadingVentas(false);
    return exito;
  };

  const asientos = data.asientos || [];

  return (
    <div>
      <div className="row g-3">
        <div className="col-md-12">
          <div className="card shadow-sm py-2">
            <div className="card-header p-3 d-flex align-items-center">
              <BookText color={"#ea4f4f"} height="45px" width="45px" />
              <p className="h4 card-title ms-2 mb-0">Libro Diario</p>
              <div className="d-flex ms-auto">
                {/* BOTÓN 1: CIERRE VENTAS */}
                <button
                  className="btn btn-outline-primary ms-auto mx-2 d-flex align-items-center p-2"
                  onClick={() => setModalCierreVentas(true)} // Abre el modal
                  disabled={loadingVentas}
                >
                  {loadingVentas ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <ArchiveX className={"mx-2 text-auto"} />
                  )}
                  Cierre Ventas
                </button>

                {/* BOTÓN 2: CARGA LIBRO MAYOR */}
                <button
                  className="btn btn-outline-dark ms-auto mx-2 d-flex align-items-center p-2"
                  onClick={() => setModalCargaMayor(true)} // Abre el modal
                  disabled={loadingCarga}
                >
                  {loadingCarga ? (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    <BookOpenCheck className={"mx-2 text-auto"} />
                  )}
                  {loadingCarga ? " Procesando..." : " Carga Libro Mayor"}
                </button>

                <button className="btn btn-outline-secondary ms-auto mx-2 d-flex align-items-center p-2">
                  <ClipboardType className={"mx-2 text-auto"} />
                  Generar Reporte
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ... Resto del renderizado de la tabla de asientos (sin cambios) ... */}
        <div className="col-md-12">
          {/* ... Código de la card de asientos ... */}
          <div className="card shadow-sm py-2">
            <div className="card-header p-3">
              <p className="h4 card-title mb-0">Asientos contables</p>
            </div>
            <div className="card-body">
              {isLoading && <p>Cargando asientos...</p>}
              {isError && <p>Error: {error.message}</p>}
              <div className="row g-3">
                {asientos.map((asiento) => {
                  // Filtrar detalles por tipo
                  const debeDetalles = (asiento.detalles || []).filter(
                    (d) => d.tipo === "debe"
                  );
                  const haberDetalles = (asiento.detalles || []).filter(
                    (d) => d.tipo === "haber"
                  );
                  const maxRows = Math.max(
                    debeDetalles.length,
                    haberDetalles.length
                  );

                  return (
                    <div className="col-md-6" key={asiento.id}>
                      <div className="card mb-2 shadow-card border  card-asientosContables position-relative">
                        {/* Dropdown de acciones */}
                        <div className="dropdown position-absolute top-0 end-0 mt-2 me-2 z-index-10">
                          <button
                            className="btn"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <EllipsisVertical className="text-auto" />
                          </button>
                          <ul className="dropdown-menu">
                            {asiento.estado == 0 ? (
                              <li>
                                <button className="dropdown-item">
                                  Eliminar asiento
                                </button>
                              </li>
                            ) : (
                              <li>
                                <span className="dropdown-item">
                                  No disponible
                                </span>
                              </li>
                            )}
                          </ul>
                        </div>
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <p
                              className={`badge p-2 rounded-circle ${
                                asiento.estado === 0
                                  ? "bg-warning"
                                  : "bg-success"
                              }`}
                            ></p>
                            <h6 className="fw-bold text-center flex-grow-1">
                              Transacción Nº{asiento.id}
                            </h6>
                          </div>
                          <div className="text-center mb-2">
                            <span className="badge p-2 fecha-registro bg-light text-dark">
                              <CalendarDays className="text-auto" />{" "}
                              {asiento.fecha}
                            </span>
                          </div>
                          <div className="row">
                            {/* DEBE */}
                            <div className="col-md-6 pe-md-3">
                              <h6 className="fw-bold text-center">DEBE</h6>
                              <hr />
                              {Array.from({ length: maxRows }).map((_, i) =>
                                debeDetalles[i] ? (
                                  <div
                                    className="d-flex justify-content-between"
                                    key={i}
                                  >
                                    <span className="text-success fw-bold">
                                      S/.{" "}
                                      {Number(debeDetalles[i].monto).toFixed(2)}
                                    </span>
                                    <span
                                      title={debeDetalles[i].cuenta?.nombre}
                                    >
                                      <small>
                                        {debeDetalles[i].cuenta?.nombre
                                          ?.length > 20
                                          ? debeDetalles[i].cuenta.nombre.slice(
                                              0,
                                              20
                                            ) + "..."
                                          : debeDetalles[i].cuenta?.nombre}
                                      </small>
                                    </span>
                                  </div>
                                ) : (
                                  <div key={i} style={{ height: "28px" }}></div>
                                )
                              )}
                            </div>
                            {/* HABER */}
                            <div className="col-md-6 ps-md-3 border-start border-secondary">
                              <h6 className="fw-bold text-center">HABER</h6>
                              <hr />
                              {Array.from({ length: maxRows }).map((_, i) =>
                                haberDetalles[i] ? (
                                  <div
                                    className="d-flex justify-content-between"
                                    key={i}
                                  >
                                    <span
                                      title={haberDetalles[i].cuenta?.nombre}
                                    >
                                      <small>
                                        {haberDetalles[i].cuenta?.nombre
                                          ?.length > 20
                                          ? haberDetalles[
                                              i
                                            ].cuenta.nombre.slice(0, 20) + "..."
                                          : haberDetalles[i].cuenta?.nombre}
                                      </small>
                                    </span>
                                    <span className="text-success fw-bold">
                                      S/.{" "}
                                      {Number(haberDetalles[i].monto).toFixed(
                                        2
                                      )}
                                    </span>
                                  </div>
                                ) : (
                                  <div key={i} style={{ height: "28px" }}></div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {asientos.length === 0 && !isLoading && (
                  <div className="col-12">
                    <div className="alert alert-info text-center">
                      No hay asientos contables registrados.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALES REUTILIZABLES --- */}

      {/* 1. Modal para Cierre de Ventas */}
      <ModalAlertQuestion
        show={modalCierreVentas}
        handleCloseModal={() => setModalCierreVentas(false)}
        handleEliminar={ejecutarCierreVentas} // Pasamos la función de ejecución
        idEliminar={null} // No necesitamos ID específico aquí
        pregunta="¿Deseas procesar el"
        tipo="Cierre de Ventas Anual"
        nombre="Se generarán asientos contables automáticos"
      />

      {/* 2. Modal para Carga Libro Mayor */}
      <ModalAlertQuestion
        show={modalCargaMayor}
        handleCloseModal={() => setModalCargaMayor(false)}
        handleEliminar={ejecutarCargaMayor} // Pasamos la función de ejecución
        idEliminar={null}
        pregunta="¿Estás seguro de cargar el"
        tipo="Libro Mayor"
        nombre="Se actualizarán los registros contables del año"
      />
    </div>
  );
}
