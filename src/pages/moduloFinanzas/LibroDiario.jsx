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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

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
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-full md:col-span-12">
          <Card className="py-2">
            <CardHeader className="border-b-0 flex flex-col md:flex-row justify-between items-center gap-2 p-3">
              <div className="flex items-center">
                <BookText
                  color={"var(--fw-strawberry)"}
                  height="45px"
                  width="45px"
                  className="me-2"
                />
                <CardTitle asChild>
                  <h4 className="mb-0 titulo-card-especial">Libro Diario</h4>
                </CardTitle>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 md:mt-0 items-center ms-auto">
                {/* BOTÓN 1: CIERRE VENTAS */}
                <Button
                  className="gap-2 px-3"
                  onClick={() => setModalCierreVentas(true)} // Abre el modal
                  disabled={loadingVentas}
                  variant="ghostOutline"
                >
                  {loadingVentas ? (
                    <span className="inline-block animate-spin rounded-full border-current border-r-transparent size-4 me-2"></span>
                  ) : (
                    <ArchiveX size={18} className="me-1" />
                  )}
                  Cierre Ventas
                </Button>

                {/* BOTÓN 2: CARGA LIBRO MAYOR */}
                <Button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-foreground text-background shadow-sm hover:bg-foreground/90 px-3"
                  onClick={() => setModalCargaMayor(true)} // Abre el modal
                  disabled={loadingCarga}
                  variant="default"
                >
                  {loadingCarga ? (
                    <span
                      className="inline-block animate-spin rounded-full border-current border-r-transparent size-4 me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    <BookOpenCheck size={18} className="me-1" />
                  )}
                  {loadingCarga ? " Procesando..." : " Cargar Libro Mayor"}
                </Button>

                <Button
                  className="shadow inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-input bg-background text-foreground hover:bg-accent px-3"
                  variant="default"
                >
                  <ClipboardType size={18} className="me-1" />
                  Reporte
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* ... Resto del renderizado de la tabla de asientos (sin cambios) ... */}
        <div className="col-span-full md:col-span-12">
          {/* ... Código de la card de asientos ... */}
          <Card className="py-2">
            <CardHeader className="p-3">
              <CardTitle asChild>
                <p className="h4 mb-0">Asientos contables</p>
              </CardTitle>
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
                    <div
                      className="col-span-full md:col-span-6"
                      key={asiento.id}
                    >
                      <Card className="mb-2 shadow-card card-asientosContables relative">
                        {/* Dropdown de acciones */}
                        <div className="absolute top-2 right-2 z-10">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Acciones del asiento"
                              >
                                <EllipsisVertical />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {asiento.estado == 0 ? (
                                <DropdownMenuItem>
                                  Eliminar asiento
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem disabled>
                                  No disponible
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardContent className="">
                          <div className="flex justify-between items-center mb-3">
                            <p
                              className={`inline-flex items-center text-xs font-semibold transition-colors p-2 rounded-full ${
                                asiento.estado === 0
                                  ? "bg-amber-500"
                                  : "bg-emerald-600"
                              }`}
                            ></p>
                            <h6 className="font-bold text-center grow">
                              Transacción Nº{asiento.id}
                            </h6>
                          </div>
                          <div className="text-center mb-2">
                            <span className="inline-flex items-center rounded-full text-xs font-semibold transition-colors p-2 fecha-registro bg-muted text-foreground">
                              <CalendarDays className="text-auto" />{" "}
                              {asiento.fecha}
                            </span>
                          </div>
                          <div className="grid grid-cols-12 gap-3">
                            {/* DEBE */}
                            <div className="col-span-full md:col-span-6 md:pe-3">
                              <h6 className="font-bold text-center">DEBE</h6>
                              <hr />
                              {Array.from({ length: maxRows }).map((_, i) =>
                                debeDetalles[i] ? (
                                  <div className="flex justify-between" key={i}>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
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
                            <div className="col-span-full md:col-span-6 md:ps-3 border-l border-secondary">
                              <h6 className="font-bold text-center">HABER</h6>
                              <hr />
                              {Array.from({ length: maxRows }).map((_, i) =>
                                haberDetalles[i] ? (
                                  <div className="flex justify-between" key={i}>
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
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
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
                  <div className="col-span-full">
                    <div className="relative w-full rounded-lg px-4 py-3 text-sm border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400 text-center">
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
