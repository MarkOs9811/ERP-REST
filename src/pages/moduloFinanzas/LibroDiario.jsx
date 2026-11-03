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
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-12">
          <Card className="py-2">
            <CardHeader className="border-bottom-0 flex flex-col flex-md-row justify-between items-center gap-2 p-3">
              <div className="d-flex align-items-center">
                <BookText
                  color={"var(--fw-strawberry)"}
                  height="45px"
                  width="45px"
                  className="me-2"
                />
                <CardTitle asChild><h4 className="mb-0 titulo-card-especial">
                  Libro Diario
                </h4></CardTitle>
              </div>
              <div className="d-flex flex-wrap gap-2 mt-3 mt-md-0 align-items-center ms-auto">
                {/* BOTÓN 1: CIERRE VENTAS */}
                <Button
                  className="btn btn-outline-dark px-3"
                  onClick={() => setModalCierreVentas(true)} // Abre el modal
                  disabled={loadingVentas}
                 variant="default">
                  {loadingVentas ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <ArchiveX size={18} className="me-1" />
                  )}
                  Cierre Ventas
                </Button>

                {/* BOTÓN 2: CARGA LIBRO MAYOR */}
                <Button
                  className="btn btn-dark px-3"
                  onClick={() => setModalCargaMayor(true)} // Abre el modal
                  disabled={loadingCarga}
                 variant="default">
                  {loadingCarga ? (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    <BookOpenCheck size={18} className="me-1" />
                  )}
                  {loadingCarga ? " Procesando..." : " Cargar Libro Mayor"}
                </Button>

                <Button className="btn btn-outline-dark px-3" variant="default">
                  <ClipboardType size={18} className="me-1" />
                  Reporte
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* ... Resto del renderizado de la tabla de asientos (sin cambios) ... */}
        <div className="md:col-span-12">
          {/* ... Código de la card de asientos ... */}
          <Card className="py-2">
            <CardHeader className="p-3">
              <CardTitle asChild><p className="h4 mb-0">Asientos contables</p></CardTitle>
            </CardHeader>
            <CardContent className="">
              {isLoading && <p>Cargando asientos...</p>}
              {isError && <p>Error: {error.message}</p>}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {asientos.map((asiento) => {
                  // Filtrar detalles por tipo
                  const debeDetalles = (asiento.detalles || []).filter(
                    (d) => d.tipo === "debe",
                  );
                  const haberDetalles = (asiento.detalles || []).filter(
                    (d) => d.tipo === "haber",
                  );
                  const maxRows = Math.max(
                    debeDetalles.length,
                    haberDetalles.length,
                  );

                  return (
                    <div className="md:col-span-6" key={asiento.id}>
                      <Card className="mb-2 shadow-card border card-asientosContables relative">
                        {/* Dropdown de acciones */}
                        <div className="dropdown position-absolute top-0 end-0 mt-2 me-2 z-index-10">
                          <Button
                            className="btn"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                           variant="default">
                            <EllipsisVertical className="text-auto" />
                          </Button>
                          <ul className="dropdown-menu">
                            {asiento.estado == 0 ? (
                              <li>
                                <Button className="dropdown-item" variant="default">
                                  Eliminar asiento
                                </Button>
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
                        <CardContent className="">
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
                            <div className="md:col-span-6 pe-md-3">
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
                                              20,
                                            ) + "..."
                                          : debeDetalles[i].cuenta?.nombre}
                                      </small>
                                    </span>
                                  </div>
                                ) : (
                                  <div key={i} style={{ height: "28px" }}></div>
                                ),
                              )}
                            </div>
                            {/* HABER */}
                            <div className="md:col-span-6 ps-md-3 border-start border-secondary">
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
                                        2,
                                      )}
                                    </span>
                                  </div>
                                ) : (
                                  <div key={i} style={{ height: "28px" }}></div>
                                ),
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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
            </CardContent>
          </Card>
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
