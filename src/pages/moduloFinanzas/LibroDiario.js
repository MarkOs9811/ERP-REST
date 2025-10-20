import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { useQuery } from "@tanstack/react-query";
import { getLibroDiario } from "../../service/serviceFinanzas/GetLibroDiario";
import {
  ArchiveX,
  BookOpenCheck,
  BookText,
  CalendarDays,
  ClipboardType,
  EllipsisVertical,
} from "lucide-react";

export function LibroDiario() {
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
                <button className="btn btn-outline-primary ms-auto mx-2  d-flex align-items-center p-2">
                  <ArchiveX color={"auto"} className={"mx-2"} />
                  Cierre Ventas
                </button>
                <button className="btn btn-outline-dark ms-auto mx-2 d-flex align-items-center p-2">
                  <BookOpenCheck color={"auto"} className={"mx-2"} />
                  Carga Libro Mayor
                </button>
                <button className="btn btn-outline-secondary ms-auto mx-2 d-flex align-items-center p-2">
                  <ClipboardType color={"auto"} className={"mx-2"} />
                  Generar Reporte
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12">
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
                            <EllipsisVertical color={"auto"} />
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
                              <CalendarDays color={"auto"} /> {asiento.fecha}
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
    </div>
  );
}
