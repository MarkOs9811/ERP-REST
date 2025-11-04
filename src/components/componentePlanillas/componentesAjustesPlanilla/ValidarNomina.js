import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Spinner,
  Alert,
  Button,
  Tabs,
  Tab,
  // Table, // Ya no la usamos, usamos TablasGenerales
  Form,
} from "react-bootstrap";
import {
  PlayCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Briefcase,
  CalendarCheck,
  XCircle,
  Check, // Icono para "Aprobar"
  MinusCircle, // Icono para "Rechazar" o "Excluir"
} from "lucide-react";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";
import { TablasGenerales } from "../../componentesReutilizables/TablasGenerales";

// --- IMPORTAMOS TU COMPONENTE DE TABLA ---
// (Ajusta la ruta si es diferente)

// --- API Helpers ---
const fetchDatosParaResolver = async () => {
  const response = await axiosInstance.get("/validaNomina");
  return response.data.data;
};

const generarPagosApi = async (idPeriodo) => {
  const { data } = await axiosInstance.post(
    `/periodoNomina/generarPagos/${idPeriodo}`
  );
  return data;
};
// --- Fin API Helpers ---

export function ValidarNomina({ onClose }) {
  const queryClient = useQueryClient();
  const [confirmadoResuelto, setConfirmadoResuelto] = useState(false);
  const [iniciando, setIniciando] = useState(false);
  // --- Data Fetching ---
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

  // --- Mutaciones ---
  const iniciarValidacion = async (idPeriodo) => {
    try {
      const response = await axiosInstance.put(
        `/periodoNomina/iniciarValidacion/${idPeriodo}`
      );
    } catch (Error) {}
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

  // --- Renderizado del Contenido ---
  const renderContenido = () => {
    if (isLoading) {
      return (
        <div className="text-center p-5">
          <Spinner animation="border" />
          <p className="mt-2">Cargando datos del periodo...</p>
        </div>
      );
    }

    if (isError) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "No se pudieron cargar los datos.";
      return (
        <Alert variant="danger" className="m-3">
          <strong>Error:</strong> {errorMessage}
          <p className="mb-0 small">
            {error.response?.status == 404
              ? "Asegúrese de que exista un periodo en estado 'Abierto' para validar."
              : "Verifique su conexión o contacte a soporte."}
          </p>
        </Alert>
      );
    }

    if (datosNomina && datosNomina.periodo) {
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

      // --- 💡 DEFINICIÓN DE COLUMNAS PARA LAS TABLAS 💡 ---

      // Columnas para ASISTENCIAS
      const columnasAsistencias = [
        {
          name: "Empleado",
          // Usamos la relación 'empleado' (que es una Persona)
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
        {
          name: "Acciones",
          cell: (row) => (
            <Button
              variant="outline-primary"
              size="sm"
              disabled={estaSoloEnVistaPrevia}
              title="Resolver Incidencia"
            >
              Resolver
            </Button>
          ),
          ignoreRowClick: true,
          allowOverflow: true,
          button: true,
        },
      ];

      // Estilos para ASISTENCIAS (resalta las que no son puntuales)
      const asistenciaCondicional = [
        {
          when: (row) => row.estadoAsistencia !== "Puntual", // Cambia 'Puntual' por tu estado "bueno"
          style: {
            backgroundColor: "var(--bs-warning-bg-subtle)", // Amarillo suave de Bootstrap
          },
        },
      ];

      // Columnas para ADELANTOS
      const columnasAdelantos = [
        {
          name: "Empleado",
          // Usamos la relación anidada 'usuario.empleado.persona'
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
          selector: (row) => parseFloat(row.monto), // Asegurarse que sea número para ordenar
          cell: (row) => `S/ ${parseFloat(row.monto).toFixed(2)}`,
          sortable: true,
        },
        { name: "Descripción", selector: (row) => row.descripcion, grow: 2 },
        {
          name: "Acciones",
          cell: (row) => (
            <Button
              variant="outline-danger"
              size="sm"
              disabled={estaSoloEnVistaPrevia}
              title="Excluir Adelanto"
            >
              <MinusCircle size={16} />
            </Button>
          ),
          ignoreRowClick: true,
          allowOverflow: true,
          button: true,
        },
      ];

      // Columnas para HORAS EXTRA
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
        { name: "Fecha", selector: (row) => row.fecha, sortable: true },
        {
          name: "Horas",
          selector: (row) => row.horas_trabajadas,
          sortable: true,
        },
        { name: "Estado", selector: (row) => row.estado, sortable: true },
        {
          name: "Acciones",
          cell: (row) => (
            <div className="d-flex gap-1">
              <Button
                variant="outline-success"
                size="sm"
                disabled={estaSoloEnVistaPrevia}
                title="Aprobar"
              >
                <Check size={16} />
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                disabled={estaSoloEnVistaPrevia}
                title="Rechazar"
              >
                <XCircle size={16} />
              </Button>
            </div>
          ),
          ignoreRowClick: true,
          allowOverflow: true,
          button: true,
        },
      ];

      // Columnas para VACACIONES
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

      // --- FIN DEFINICIÓN DE COLUMNAS ---

      return (
        <>
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
                <Button
                  variant="dark"
                  onClick={handleIniciarValidacion}
                  disabled={iniciando}
                >
                  <PlayCircle size={18} className="me-1" />
                  {iniciando ? "Iniciando..." : "Comenzar Validación"}
                </Button>
              )}
              {estaEnValidacion && (
                <Button
                  variant="success"
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
                </Button>
              )}
            </div>
          </div>

          {/* 2. VISTA DE DATOS (Pestañas) */}
          <div className="p-3">
            <Tabs
              defaultActiveKey="asistencias"
              id="resolver-nomina-tabs"
              className="mb-3"
            >
              {/* PESTAÑA 1: ASISTENCIAS */}
              <Tab
                eventKey="asistencias"
                title={
                  <>
                    <Clock size={16} className="me-1" /> Asistencias (
                    {asistencias.length})
                  </>
                }
              >
                <div className="py-2">
                  <p className="text-muted small">
                    {estaSoloEnVistaPrevia
                      ? "Revise las incidencias de asistencia. Para editarlas, debe 'Comenzar Validación'."
                      : "Use los controles para marcar faltas, aprobar manualmente, etc."}
                  </p>

                  {/* --- Nota Importante sobre tu petición de "Grid de Checks" --- */}
                  <Alert variant="light" className="small">
                    <strong>Nota:</strong> Esta tabla muestra los{" "}
                    {asistencias.length} registros de asistencia (fichajes)
                    encontrados. El próximo paso será implementar una vista de
                    "Incidencias" que muestre solo los días con Faltas o
                    Tardanzas para resolver.
                  </Alert>

                  {estaEnValidacion && (
                    <Form.Check
                      type="switch"
                      id="confirmar-resolucion-asistencias"
                      label="Confirmo que todas las incidencias de asistencia han sido resueltas."
                      checked={confirmadoResuelto}
                      onChange={(e) => setConfirmadoResuelto(e.target.checked)}
                      className="mb-3 fw-bold p-3 border rounded"
                      style={{ backgroundColor: "#e8f3ff" }}
                    />
                  )}

                  {asistencias.length > 0 ? (
                    <TablasGenerales
                      columnas={columnasAsistencias}
                      datos={asistencias}
                      conditionalRowStyles={asistenciaCondicional}
                    />
                  ) : (
                    <Alert variant="secondary" size="sm">
                      No se encontraron registros de asistencia para este
                      periodo.
                    </Alert>
                  )}
                </div>
              </Tab>

              {/* PESTAÑA 2: ADELANTOS */}
              <Tab
                eventKey="adelantos"
                title={
                  <>
                    <DollarSign size={16} className="me-1" /> Adelantos (
                    {adelantos.length})
                  </>
                }
              >
                <div className="py-2">
                  {adelantos.length > 0 ? (
                    <TablasGenerales
                      columnas={columnasAdelantos}
                      datos={adelantos}
                    />
                  ) : (
                    <Alert variant="secondary" size="sm">
                      No hay adelantos registrados para este periodo.
                    </Alert>
                  )}
                </div>
              </Tab>

              {/* PESTAÑA 3: HORAS EXTRA */}
              <Tab
                eventKey="horasExtra"
                title={
                  <>
                    <Briefcase size={16} className="me-1" /> Horas Extra (
                    {horasExtra.length})
                  </>
                }
              >
                <div className="py-2">
                  {horasExtra.length > 0 ? (
                    <TablasGenerales
                      columnas={columnasHorasExtra}
                      datos={horasExtra}
                    />
                  ) : (
                    <Alert variant="secondary" size="sm">
                      No hay horas extra registradas para este periodo.
                    </Alert>
                  )}
                </div>
              </Tab>

              {/* PESTAÑA 4: VACACIONES */}
              <Tab
                eventKey="vacaciones"
                title={
                  <>
                    <CalendarCheck size={16} className="me-1" /> Vacaciones (
                    {vacaciones.length})
                  </>
                }
              >
                <div className="py-2">
                  {vacaciones.length > 0 ? (
                    <TablasGenerales
                      columnas={columnasVacaciones}
                      datos={vacaciones}
                    />
                  ) : (
                    <Alert variant="secondary" size="sm">
                      No hay vacaciones registradas para este periodo.
                    </Alert>
                  )}
                </div>
              </Tab>
            </Tabs>
          </div>
        </>
      );
    }

    // Fallback si no hay datos o periodo
    return (
      <Alert variant="warning" className="m-3">
        No se encontró ningún periodo de nómina activo para validar.
      </Alert>
    );
  };

  return (
    <>
      <div
        className="modal-body p-0"
        style={{ minHeight: "400px", maxHeight: "80vh", overflowY: "auto" }}
      >
        {renderContenido()}
      </div>

      {/* Footer del Modal */}
      <div className="modal-footer">
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
