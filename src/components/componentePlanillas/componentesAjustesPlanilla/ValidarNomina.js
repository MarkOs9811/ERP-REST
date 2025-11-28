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

// --- API Helpers (Sin cambios) ---
const fetchDatosParaResolver = async () => {
  const response = await axiosInstance.get("/validaNomina");
  return response.data.data;
};

const generarPagosApi = async (idPeriodo) => {
  const resp = await axiosInstance.post(
    `/periodoNomina/realizarPago/${idPeriodo}`
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
        "Validación iniciada. Ahora puede resolver incidencias."
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
        data.message || "Nómina generada y periodo cerrado."
      );
      queryClient.invalidateQueries({ queryKey: ["listaPeriodosNomina"] });
      queryClient.invalidateQueries({ queryKey: ["nomina"] });
      onClose();
    },
    onError: (error) => {
      ToastAlert(
        "error",
        error.response?.data?.message || "Error al generar el pago"
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
          className="modal-body p-0"
          style={{ minHeight: "400px", maxHeight: "80vh", overflowY: "auto" }}
        >
          <div className="text-center p-5">
            {/* HTML para Spinner */}
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando datos del periodo...</p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cerrar-modal" onClick={onClose} disabled>
            Cancelar
          </button>
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
          className="modal-body p-0"
          style={{ minHeight: "400px", maxHeight: "80vh", overflowY: "auto" }}
        >
          {/* HTML para Alert */}
          <div className="alert alert-danger m-3" role="alert">
            <strong>Error:</strong> {errorMessage}
            <p className="mb-0 small">
              {error.response?.status == 404
                ? "Asegúrese de que exista un periodo en estado 'Abierto' para validar."
                : "Verifique su conexión o contacte a soporte."}
            </p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cerrar-modal" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </>
    );
  }

  // --- 3. Renderizado de Fallback (Sin datos) ---
  if (!datosNomina || !datosNomina.periodo) {
    return (
      <>
        <div
          className="modal-body p-0"
          style={{ minHeight: "400px", maxHeight: "80vh", overflowY: "auto" }}
        >
          {/* HTML para Alert */}
          <div className="alert alert-warning m-3" role="alert">
            No se encontró ningún periodo de nómina activo para validar.
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cerrar-modal" onClick={onClose}>
            Cancelar
          </button>
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
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          disabled={estaSoloEnVistaPrevia}
          title="Excluir Adelanto"
        >
          <MinusCircle size={16} />
        </button>
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
          <div className="badge bg-success">Realizado</div>
        ) : (
          <>
            <div className="badge bg-warning">Pendiente</div>
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
        className="modal-body p-0"
        style={{ minHeight: "400px", maxHeight: "80vh", overflowY: "auto" }}
      >
        {/* 1. SECCIÓN SUPERIOR DE BOTONES */}
        <div
          className="p-3 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <div>
            <h5 className="mb-0">
              Periodo a Resolver: <strong>{periodo.nombrePeriodo}</strong>
            </h5>
            <span className="text-muted small">
              {periodo.fecha_inicio} al {periodo.fecha_fin}
            </span>
          </div>
          <div className="d-flex gap-2">
            {estaAbierto && (
              // HTML <button>
              <button
                type="button"
                className="btn btn-dark"
                onClick={handleIniciarValidacion}
                disabled={iniciando}
              >
                <PlayCircle size={18} className="me-1" />
                {iniciando ? "Iniciando..." : "Comenzar Validación"}
              </button>
            )}
            {estaEnValidacion && (
              // HTML <button>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleGenerarPagos}
                disabled={!confirmadoResuelto || pagando}
                title={
                  !confirmadoResuelto
                    ? "Debe confirmar que todas las incidencias están resueltas"
                    : "Generar pago final y cerrar periodo"
                }
              >
                <CheckCircle size={18} className="me-1" />
                {pagando ? "Procesando..." : "Generar Pagos"}
              </button>
            )}
          </div>
        </div>

        {/* 2. VISTA DE DATOS (Pestañas con HTML + useState) */}
        <div className="p-3">
          {/* Navegación de Pestañas */}
          <ul
            className="nav nav-tabs mb-3"
            id="resolver-nomina-tabs"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "asistencias" ? "active" : ""
                }`}
                onClick={() => setActiveTab("asistencias")}
                type="button"
                role="tab"
              >
                <Clock size={16} className="me-1" /> Asistencias (
                {asistencias.length})
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "adelantos" ? "active" : ""
                }`}
                onClick={() => setActiveTab("adelantos")}
                type="button"
                role="tab"
              >
                <DollarSign size={16} className="me-1" /> Adelantos (
                {adelantos.length})
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "horasExtra" ? "active" : ""
                }`}
                onClick={() => setActiveTab("horasExtra")}
                type="button"
                role="tab"
              >
                <Briefcase size={16} className="me-1" /> Horas Extra (
                {horasExtra.length})
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "vacaciones" ? "active" : ""
                }`}
                onClick={() => setActiveTab("vacaciones")}
                type="button"
                role="tab"
              >
                <CalendarCheck size={16} className="me-1" /> Vacaciones (
                {vacaciones.length})
              </button>
            </li>
          </ul>

          {/* Contenido de las Pestañas (Renderizado Condicional) */}
          <div className="tab-content" id="resolver-nomina-tabs-content">
            {/* PESTAÑA 1: ASISTENCIAS */}
            {activeTab === "asistencias" && (
              <div className="py-2">
                <p className="text-muted small">
                  {estaSoloEnVistaPrevia
                    ? "Revise las incidencias de asistencia. Para editarlas, debe 'Comenzar Validación'."
                    : "Use los controles para marcar faltas, aprobar manualmente, etc."}
                </p>

                {/* HTML para Alert */}
                <div className="alert alert-light small" role="alert">
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
                      <div className="form-check form-switch fw-bold">
                        <input
                          className="form-check-input" // Sin márgenes
                          type="checkbox"
                          role="switch"
                          id="confirmar-resolucion-asistencias"
                          checked={confirmadoResuelto}
                          onChange={(e) => {
                            setConfirmadoResuelto(e.target.checked);
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="confirmar-resolucion-asistencias"
                        >
                          Confirmo que se realizarón las validación de todas las
                          incidencias
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {asistencias.length > 0 ? (
                  <TablasGenerales
                    columnas={columnasAsistencias}
                    datos={asistencias}
                    conditionalRowStyles={asistenciaCondicional}
                  />
                ) : (
                  // HTML para Alert
                  <div className="alert alert-secondary small" role="alert">
                    No se encontraron registros de asistencia para este periodo.
                  </div>
                )}
              </div>
            )}

            {/* PESTAÑA 2: ADELANTOS */}
            {activeTab === "adelantos" && (
              <div className="py-2">
                {adelantos.length > 0 ? (
                  <TablasGenerales
                    columnas={columnasAdelantos}
                    datos={adelantos}
                  />
                ) : (
                  // HTML para Alert
                  <div className="alert alert-secondary small" role="alert">
                    No hay adelantos registrados para este periodo.
                  </div>
                )}
              </div>
            )}

            {/* PESTAÑA 3: HORAS EXTRA */}
            {activeTab === "horasExtra" && (
              <div className="py-2">
                {horasExtra.length > 0 ? (
                  <TablasGenerales
                    columnas={columnasHorasExtra}
                    datos={horasExtra}
                  />
                ) : (
                  // HTML para Alert
                  <div className="alert alert-secondary small" role="alert">
                    No hay horas extra registradas para este periodo.
                  </div>
                )}
              </div>
            )}

            {/* PESTAÑA 4: VACACIONES */}
            {activeTab === "vacaciones" && (
              <div className="py-2">
                {vacaciones.length > 0 ? (
                  <TablasGenerales
                    columnas={columnasVacaciones}
                    datos={vacaciones}
                  />
                ) : (
                  // HTML para Alert
                  <div className="alert alert-secondary small" role="alert">
                    No hay vacaciones registradas para este periodo.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer del Modal (Sin cambios) */}
      <div className="modal-footer p-3">
        <button
          className="btn-cerrar-modal"
          onClick={onClose}
          disabled={iniciando || pagando}
        >
          Cancelar
        </button>
      </div>
    </>
  );
}
