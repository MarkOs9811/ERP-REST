import { useState } from "react"; // 💡 IMPORTAMOS useState para manejar las pestañas
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// ❌ Ya no importamos NADA de react-bootstrap
import {
  PlayCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Briefcase,
  CalendarCheck,
  XCircle,
  Check,
  MinusCircle,
} from "lucide-react";
import ToastAlert from "../../componenteToast/ToastAlert";
import { TablasGenerales } from "../../componentesReutilizables/TablasGenerales";
import axiosInstance from "../../../api/AxiosInstance";
import { Button } from "../../ui/button";

// --- API Helpers (Sin cambios) ---
const fetchDatosParaResolver = async () => {
  const response = await axiosInstance.get("/validaNomina");
  return response.data.data;
};

const generarPagosApi = async (idPeriodo) => {
  const resp = await axiosInstance.post(
    `/periodoNomina/realizarPago/${idPeriodo}`,
  );

  return resp.data;
};

export function ValidarNomina({ onClose }) {
  const queryClient = useQueryClient();

  const [confirmadoResuelto, setConfirmadoResuelto] = useState(false);
  const [iniciando, setIniciando] = useState(false);
  const [activeTab, setActiveTab] = useState("asistencias"); // 💡 Estado para las pestañas

  const {
    data: datosNomina,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["datosParaResolverNomina"],
    queryFn: fetchDatosParaResolver,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    enabled: !!onClose,
  });

  const iniciarValidacion = async (idPeriodo) => {
    try {
      setIniciando(true);
      await axiosInstance.put(`/periodoNomina/iniciarValidacion/${idPeriodo}`);

      queryClient.invalidateQueries({ queryKey: ["datosParaResolverNomina"] });
      ToastAlert(
        "success",
        "Validación iniciada. Ahora puede resolver incidencias.",
      );
    } catch (error) {
      // AQUÍ ESTÁ EL CAMBIO CLAVE:
      // Intentamos leer el mensaje del backend. Si no existe, usamos uno genérico.
      const mensajeBackend =
        error.response?.data?.message || "Error al iniciar la validación.";

      ToastAlert("warning", mensajeBackend);
    } finally {
      setIniciando(false);
    }
  };

  const { mutate: generarPagos, isPending: pagando } = useMutation({
    mutationFn: generarPagosApi,
    onSuccess: (data) => {
      ToastAlert(
        "success",
        data.message || "Nómina generada y periodo cerrado.",
      );
      queryClient.invalidateQueries({ queryKey: ["listaPeriodosNomina"] });
      queryClient.invalidateQueries({ queryKey: ["nomina"] });
      onClose();
    },
    onError: (error) => {
      ToastAlert(
        "error",
        error.response?.data?.message || "Error al generar el pago",
      );
    },
  });

  // --- Handlers ---
  const handleIniciarValidacion = () => {
    if (datosNomina?.periodo?.id) {
      iniciarValidacion(datosNomina.periodo.id);
    }
  };

  const handleGenerarPagos = () => {
    if (datosNomina?.periodo?.id) {
      generarPagos(datosNomina.periodo.id);
    }
  };

  // --- 1. Renderizado de Carga (Loading) ---
  if (isLoading) {
    return (
      <>
        <div
          className="p-0"
          style={{ minHeight: "400px", maxHeight: "80vh", overflowY: "auto" }}
        >
          <div className="text-center p-5">
            {/* HTML para Spinner */}
            <div
              className="inline-block size-5 animate-spin rounded-full border-2 border-current border-r-transparent"
              role="status"
            >
              <span className="sr-only">Cargando...</span>
            </div>
            <p className="mt-2">Cargando datos del periodo...</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t p-4">
          <Button
            className="btn-cerrar-modal"
            onClick={onClose}
            disabled
            variant="default"
          >
            Cancelar
          </Button>
        </div>
      </>
    );
  }

  // --- 2. Renderizado de Error ---
  if (isError) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "No se pudieron cargar los datos.";

    return (
      <>
        <div
          className="p-0"
          style={{ minHeight: "400px", maxHeight: "80vh", overflowY: "auto" }}
        >
          {/* HTML para Alert */}
          <div
            className="relative w-full rounded-lg px-4 py-3 text-sm border-destructive/30 bg-destructive/10 text-destructive m-3"
            role="alert"
          >
            <strong>Error:</strong> {errorMessage}
            <p className="mb-0 text-sm">
              {error.response?.status == 404
                ? "Asegúrese de que exista un periodo en estado 'Abierto' para validar."
                : "Verifique su conexión o contacte a soporte."}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t p-4">
          <Button
            className="btn-cerrar-modal"
            onClick={onClose}
            variant="default"
          >
            Cancelar
          </Button>
        </div>
      </>
    );
  }

  // --- 3. Renderizado de Fallback (Sin datos) ---
  if (!datosNomina || !datosNomina.periodo) {
    return (
      <>
        <div
          className="p-0"
          style={{ minHeight: "400px", maxHeight: "80vh", overflowY: "auto" }}
        >
          {/* HTML para Alert */}
          <div
            className="relative w-full rounded-lg px-4 py-3 text-sm border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 m-3"
            role="alert"
          >
            No se encontró ningún periodo de nómina activo para validar.
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t p-4">
          <Button
            className="btn-cerrar-modal"
            onClick={onClose}
            variant="default"
          >
            Cancelar
          </Button>
        </div>
      </>
    );
  }

  // --- Lógica de Datos (Solo si hay datos) ---
  // (La ponemos aquí para no ejecutarla si hay error o loading)

  const {
    periodo,
    asistencias = [],
    adelantos = [],
    horasExtra = [],
    vacaciones = [],
  } = datosNomina;

  const estaAbierto = periodo.estado == 1;
  const estaEnValidacion = periodo.estado == 2;
  const estaSoloEnVistaPrevia = estaAbierto;

  const columnasAsistencias = [
    {
      name: "Empleado",
      selector: (row) =>
        row.empleado
          ? `${row.empleado.nombre} ${row.empleado.apellidos}`
          : "N/A",
      sortable: true,
      grow: 2,
    },
    { name: "Fecha", selector: (row) => row.fechaEntrada, sortable: true },
    { name: "Entrada", selector: (row) => row.horaEntrada },
    { name: "Salida", selector: (row) => row.horaSalida },
    { name: "Horas", selector: (row) => row.horasTrabajadas },
    {
      name: "Estado",
      selector: (row) => row.estadoAsistencia,
      sortable: true,
    },
  ];

  const asistenciaCondicional = [
    {
      when: (row) => row.estadoAsistencia !== "Puntual",
      style: {
        backgroundColor: "var(--bs-warning-bg-subtle)",
      },
    },
  ];

  const columnasAdelantos = [
    {
      name: "Empleado",
      selector: (row) =>
        row.usuario?.empleado?.persona
          ? `${row.usuario.empleado.persona.nombre} ${row.usuario.empleado.persona.apellidos}`
          : "N/A",
      sortable: true,
      grow: 2,
    },
    { name: "Fecha", selector: (row) => row.fecha, sortable: true },
    {
      name: "Monto",
      selector: (row) => parseFloat(row.monto),
      cell: (row) => `S/ ${parseFloat(row.monto).toFixed(2)}`,
      sortable: true,
    },
    { name: "Descripción", selector: (row) => row.descripcion, grow: 2 },
    {
      name: "Acciones",
      cell: (row) => (
        // HTML <button>
        <Button
          type="button"
          className="shadow border-destructive bg-background text-destructive hover:bg-destructive/10 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 text-xs"
          disabled={estaSoloEnVistaPrevia}
          title="Excluir Adelanto"
          variant="destructive"
        >
          <MinusCircle size={16} />
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const columnasHorasExtra = [
    {
      name: "Empleado",
      selector: (row) =>
        row.usuario?.empleado?.persona
          ? `${row.usuario.empleado.persona.nombre} ${row.usuario.empleado.persona.apellidos}`
          : "N/A",
      sortable: true,
      grow: 2,
    },
    {
      name: "Documento",
      selector: (row) =>
        row.usuario?.empleado?.persona
          ? `${row.usuario.empleado.persona.documento_identidad}`
          : "N/A",
      sortable: true,
      grow: 2,
    },
    { name: "Fecha", selector: (row) => row.fecha, sortable: true },
    {
      name: "Horas",
      selector: (row) => row.horas_trabajadas,
      sortable: true,
    },
    {
      name: "Estado",
      sortable: true,
      cell: (row) =>
        row.estado == 1 ? (
          <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors bg-emerald-600">
            Realizado
          </div>
        ) : (
          <>
            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors bg-amber-500">
              Pendiente
            </div>
          </>
        ),
    },
  ];

  const columnasVacaciones = [
    {
      name: "Empleado",
      selector: (row) =>
        row.usuario?.empleado?.persona
          ? `${row.usuario.empleado.persona.nombre} ${row.usuario.empleado.persona.apellidos}`
          : "N/A",
      sortable: true,
      grow: 2,
    },
    {
      name: "Fecha Inicio",
      selector: (row) => row.fecha_inicio,
      sortable: true,
    },
    { name: "Fecha Fin", selector: (row) => row.fecha_fin, sortable: true },
    { name: "Días", selector: (row) => row.dias_totales, sortable: true },
    { name: "Estado", selector: (row) => row.estado, sortable: true },
  ];

  // --- 4. Renderizado Principal (Éxito) ---
  return (
    <>
      <div
        className="p-0 bg-transparent"
        style={{ minHeight: "400px", maxHeight: "80vh", overflowY: "auto" }}
      >
        {/* 1. SECCIÓN SUPERIOR DE BOTONES */}
        <div
          className="p-3 border-b flex justify-between items-center flex-wrap gap-2"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <div>
            <h5 className="mb-0">
              Periodo a Resolver: <strong>{periodo.nombrePeriodo}</strong>
            </h5>
            <span className="text-muted-foreground text-sm">
              {periodo.fecha_inicio} al {periodo.fecha_fin}
            </span>
          </div>
          <div className="flex gap-2">
            {estaAbierto && (
              // HTML <button>
              <Button
                type="button"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-foreground text-background shadow-sm hover:bg-foreground/90"
                onClick={handleIniciarValidacion}
                disabled={iniciando}
                variant="default"
              >
                <PlayCircle size={18} className="me-1" />
                {iniciando ? "Iniciando..." : "Comenzar Validación"}
              </Button>
            )}
            {estaEnValidacion && (
              // HTML <button>
              <Button
                type="button"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                onClick={handleGenerarPagos}
                disabled={!confirmadoResuelto || pagando}
                title={
                  !confirmadoResuelto
                    ? "Debe confirmar que todas las incidencias están resueltas"
                    : "Generar pago final y cerrar periodo"
                }
                variant="default"
              >
                <CheckCircle size={18} className="me-1" />
                {pagando ? "Procesando..." : "Generar Pagos"}
              </Button>
            )}
          </div>
        </div>

        {/* 2. VISTA DE DATOS (Pestañas con HTML + useState) */}
        <div className="p-3">
          {/* Navegación de Pestañas */}
          <div
            className="mb-3 flex flex-wrap gap-2 overflow-x-auto border-b"
            id="resolver-nomina-tabs"
            role="tablist"
            aria-label="Secciones de validación de nómina"
          >
            <Button
              variant="ghost"
              className={`rounded-b-none border-b-2 border-transparent text-foreground ${
                activeTab === "asistencias" ? "border-primary text-primary" : ""
              }`}
              onClick={() => setActiveTab("asistencias")}
              type="button"
              role="tab"
              aria-selected={activeTab === "asistencias"}
            >
              <Clock size={16} className="me-1" /> Asistencias (
              {asistencias.length})
            </Button>
            <Button
              variant="ghost"
              className={`rounded-b-none border-b-2 border-transparent text-foreground ${
                activeTab === "adelantos" ? "border-primary text-primary" : ""
              }`}
              onClick={() => setActiveTab("adelantos")}
              type="button"
              role="tab"
              aria-selected={activeTab === "adelantos"}
            >
              S/. Adelantos ({adelantos.length})
            </Button>
            <Button
              variant="ghost"
              className={`rounded-b-none border-b-2 border-transparent text-foreground ${
                activeTab === "horasExtra" ? "border-primary text-primary" : ""
              }`}
              onClick={() => setActiveTab("horasExtra")}
              type="button"
              role="tab"
              aria-selected={activeTab === "horasExtra"}
            >
              <Briefcase size={16} className="me-1" /> Horas Extra (
              {horasExtra.length})
            </Button>
            <Button
              variant="ghost"
              className={`rounded-b-none border-b-2 border-transparent text-foreground ${
                activeTab === "vacaciones" ? "border-primary text-primary" : ""
              }`}
              onClick={() => setActiveTab("vacaciones")}
              type="button"
              role="tab"
              aria-selected={activeTab === "vacaciones"}
            >
              <CalendarCheck size={16} className="me-1" /> Vacaciones (
              {vacaciones.length})
            </Button>
          </div>

          {/* Contenido de las Pestañas (Renderizado Condicional) */}
          <div className="tab-content" id="resolver-nomina-tabs-content">
            {/* PESTAÑA 1: ASISTENCIAS */}
            {activeTab === "asistencias" && (
              <div className="py-2">
                <p className="text-muted-foreground text-sm">
                  {estaSoloEnVistaPrevia
                    ? "Revise las incidencias de asistencia. Para editarlas, debe 'Comenzar Validación'."
                    : "Use los controles para marcar faltas, aprobar manualmente, etc."}
                </p>

                {/* HTML para Alert */}
                <div
                  className="relative w-full rounded-md border-border bg-muted p-4 text-foreground text-sm"
                  role="alert"
                >
                  <strong>Nota:</strong> Esta tabla muestra los{" "}
                  {asistencias.length} registros de asistencia (fichajes)
                  encontrados. El próximo paso será implementar una vista de
                  "Incidencias" que muestre solo los días con Faltas o Tardanzas
                  para resolver.
                </div>

                {estaEnValidacion && (
                  // HTML para Form Switch
                  <>
                    {/* 1. Contenedor EXTERIOR para el estilo (borde, fondo, padding) */}
                    <div
                      className="border rounded p-3 mb-3"
                      style={{ backgroundColor: "#e8f3ff" }}
                    >
                      {/* 2. El form-switch "limpio" (sin 'border', 'p-3', etc.) */}
                      <div className="flex items-center gap-2 font-bold">
                        <input
                          className="size-4 shrink-0 rounded border-input accent-primary" // Sin márgenes
                          type="checkbox"
                          role="switch"
                          id="confirmar-resolucion-asistencias"
                          checked={confirmadoResuelto}
                          onChange={(e) => {
                            setConfirmadoResuelto(e.target.checked);
                          }}
                        />
                        <label
                          className="text-sm font-medium"
                          htmlFor="confirmar-resolucion-asistencias"
                        >
                          Confirmo que se realizaron las validaciones de todas
                          las incidencias
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {asistencias.length > 0 ? (
                  <div
                    className="border rounded py-2"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >
                    <TablasGenerales
                      columnas={columnasAsistencias}
                      datos={asistencias}
                      conditionalRowStyles={asistenciaCondicional}
                    />
                  </div>
                ) : (
                  // HTML para Alert
                  <div
                    className="relative w-full rounded-lg px-4 py-3 border-border bg-muted text-foreground text-sm"
                    role="alert"
                  >
                    No se encontraron registros de asistencia para este periodo.
                  </div>
                )}
              </div>
            )}

            {/* PESTAÑA 2: ADELANTOS */}
            {activeTab === "adelantos" && (
              <div className="py-2">
                {adelantos.length > 0 ? (
                  <div
                    className="border rounded py-2"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >
                    <TablasGenerales
                      columnas={columnasAdelantos}
                      datos={adelantos}
                    />
                  </div>
                ) : (
                  // HTML para Alert
                  <div
                    className="relative w-full rounded-lg px-4 py-3 border-border bg-muted text-foreground text-sm"
                    role="alert"
                  >
                    No hay adelantos registrados para este periodo.
                  </div>
                )}
              </div>
            )}

            {/* PESTAÑA 3: HORAS EXTRA */}
            {activeTab === "horasExtra" && (
              <div className="py-2">
                {horasExtra.length > 0 ? (
                  <div
                    className="border rounded py-2"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >
                    <TablasGenerales
                      columnas={columnasHorasExtra}
                      datos={horasExtra}
                    />
                  </div>
                ) : (
                  // HTML para Alert
                  <div
                    className="relative w-full rounded-lg px-4 py-3 border-border bg-muted text-foreground text-sm"
                    role="alert"
                  >
                    No hay horas extra registradas para este periodo.
                  </div>
                )}
              </div>
            )}

            {/* PESTAÑA 4: VACACIONES */}
            {activeTab === "vacaciones" && (
              <div className="py-2">
                {vacaciones.length > 0 ? (
                  <div
                    className="border rounded py-2"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >
                    <TablasGenerales
                      columnas={columnasVacaciones}
                      datos={vacaciones}
                    />
                  </div>
                ) : (
                  // HTML para Alert
                  <div
                    className="relative w-full rounded-lg px-4 py-3 border-border bg-muted text-foreground text-sm"
                    role="alert"
                  >
                    No hay vacaciones registradas para este periodo.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer del Modal (Sin cambios) */}
      <div className="flex items-center justify-end gap-2 border-t p-3">
        <Button
          className="btn-cerrar-modal"
          onClick={onClose}
          disabled={iniciando || pagando}
          variant="default"
        >
          Cancelar
        </Button>
      </div>
    </>
  );
}
