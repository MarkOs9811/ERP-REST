import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Spinner,
  Alert,
  Button,
  Tabs,
  Tab,
  Table,
  Form,
} from "react-bootstrap"; // Asumo que usas react-bootstrap
import {
  PlayCircle,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Briefcase,
  CalendarCheck,
  XCircle,
} from "lucide-react";

// --- Helpers de API (Asegúrate de que estas rutas sean correctas) ---
import axiosInstance from "../../../api/AxiosInstance"; // Tu instancia de Axios
import ToastAlert from "../../componenteToast/ToastAlert"; // Tu componente de alertas

// 1. Llama al controlador para obtener los datos del periodo a resolver
const fetchDatosParaResolver = async () => {
  const response = await axiosInstance.get("/validaNomina"); // Tu endpoint
  // Retorna el objeto { periodo, asistencias, adelantos, horasExtra, vacaciones }
  return response.data.data;
};

// 2. Llama a la API para cambiar el estado de 1 (Abierto) a 2 (En Validación)
const iniciarValidacionApi = async (idPeriodo) => {
  // Debes crear esta ruta en tu backend (POST o PUT)
  const { data } = await axiosInstance.post(
    `/periodoNomina/iniciarValidacion/${idPeriodo}`
  );
  return data;
};

// 3. Llama a la API final para pagar y cambiar el estado de 2 a 3 (Cerrado)
const generarPagosApi = async (idPeriodo) => {
  // Debes crear esta ruta en tu backend (POST)
  const { data } = await axiosInstance.post(
    `/periodoNomina/generarPagos/${idPeriodo}`
  );
  return data;
};
// --- Fin Helpers de API ---

export function ValidarNomina({ onClose }) {
  const queryClient = useQueryClient();

  // Flag para habilitar el botón final de pago
  const [incidenciasResueltas, setIncidenciasResueltas] = useState(false);

  // --- Data Fetching ---
  const {
    data: datosNomina,
    isLoading,
    isError,
    error, // Captura el objeto de error
  } = useQuery({
    queryKey: ["datosParaResolverNomina"],
    queryFn: fetchDatosParaResolver,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // Datos frescos por 5 mins
    enabled: !!onClose, // Solo se activa si el modal está "montado" (tiene onClose)
  });

  console.log("data-nomina", datosNomina);

  // --- Mutación para "Iniciar Validación" (cambiar estado 1 -> 2) ---
  const { mutate: iniciarValidacion, isLoading: iniciando } = useMutation({
    mutationFn: iniciarValidacionApi,
    onSuccess: (data) => {
      ToastAlert(
        "success",
        data.message || "Periodo bloqueado. Listo para validar."
      );
      // Invalida la query para que useQuery vuelva a fetchear y actualice el estado del periodo
      queryClient.invalidateQueries(["datosParaResolverNomina"]);
    },
    onError: (error) => {
      ToastAlert(
        "error",
        error.response?.data?.message || "Error al iniciar validación"
      );
    },
  });

  // --- Mutación para "Generar Pagos" (cambiar estado 2 -> 3) ---
  const { mutate: generarPagos, isLoading: pagando } = useMutation({
    mutationFn: generarPagosApi,
    onSuccess: (data) => {
      ToastAlert(
        "success",
        data.message || "Nómina generada y periodo cerrado."
      );
      queryClient.invalidateQueries(["listaPeriodosNomina"]); // Refresca la tabla principal (Configuración)
      queryClient.invalidateQueries(["nomina"]); // Refresca la tabla de nómina (si la tienes en otra query)
      onClose(); // Cierra este modal
    },
    onError: (error) => {
      ToastAlert(
        "error",
        error.response?.data?.message || "Error al generar el pago"
      );
    },
  });

  // --- Handlers de Botones ---
  const handleIniciarValidacion = () => {
    if (datosNomina?.periodo?.id) {
      iniciarValidacion(datosNomina.periodo.id);
    }
  };

  const handleGenerarPagos = () => {
    // Podrías añadir un modal de confirmación aquí
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
      // Muestra el mensaje de error específico si viene de la API, o uno genérico
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "No se pudieron cargar los datos.";
      return (
        <Alert variant="danger" className="m-3">
          <strong>Error:</strong> {errorMessage}
        </Alert>
      );
    }

    // Si la data está lista y es válida
    if (datosNomina && datosNomina.periodo) {
      // Usamos '|| []' para evitar errores si alguna lista viene nula
      const {
        periodo,
        asistencias = [],
        adelantos = [],
        horasExtra = [],
        vacaciones = [],
      } = datosNomina;

      const estaAbierto = periodo.estado === 1;
      const estaEnValidacion = periodo.estado === 2;

      return (
        <>
          {/* 1. SECCIÓN SUPERIOR DE BOTONES */}
          <div className="p-3 bg-light border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
            {" "}
            {/* flex-wrap para móviles */}
            <div>
              <h5 className="mb-0">
                Periodo a Resolver: <strong>{periodo.nombrePeriodo}</strong>
              </h5>
              <span className="text-muted small">
                {periodo.fecha_inicio} al {periodo.fecha_fin}
              </span>
            </div>
            <div className="d-flex gap-2">
              {/* Botón 1: Solo si está Abierto */}
              {estaAbierto && (
                <Button
                  variant="primary"
                  onClick={handleIniciarValidacion}
                  disabled={iniciando}
                >
                  <PlayCircle size={18} className="me-1" />
                  {iniciando ? "Iniciando..." : "Comenzar Validación"}
                </Button>
              )}
              {/* Botón 2: Solo si está En Validación */}
              {estaEnValidacion && (
                <Button
                  variant="success"
                  onClick={handleGenerarPagos}
                  disabled={!incidenciasResueltas || pagando}
                  title={
                    !incidenciasResueltas
                      ? "Confirme que las incidencias están resueltas"
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
                    Revise las asistencias. Use los controles (que añadirá aquí)
                    para marcar faltas, aprobar manualmente, etc.
                  </p>

                  {/* Switch de Confirmación */}
                  <Form.Check
                    type="switch"
                    id="confirmar-resolucion-asistencias"
                    label="Confirmo que todas las incidencias de asistencia han sido resueltas."
                    checked={incidenciasResueltas}
                    onChange={(e) => setIncidenciasResueltas(e.target.checked)}
                    disabled={!estaEnValidacion} // Solo se puede marcar si está en validación
                    className="mb-3 fw-bold"
                  />

                  {/* AQUÍ DEBES RENDERIZAR TU TABLA/LISTA DE ASISTENCIAS CON CHECKBOXES */}
                  <Alert variant="info" size="sm">
                    Pendiente: Implementar la tabla de asistencias con
                    checkboxes/botones para resolver. Debe mostrar los{" "}
                    {asistencias.length} registros.
                  </Alert>
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
                    <>
                      <p className="text-muted small">
                        Adelantos que se descontarán en este periodo:
                      </p>
                      <Table striped bordered hover size="sm" responsive>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>Monto</th>
                            <th>Fecha</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adelantos.map((a) => (
                            <tr key={a.id}>
                              <td>{a.id}</td>
                              <td>
                                {a.usuario?.nombres} {a.usuario?.apellidos}
                              </td>
                              <td>S/ {a.monto}</td>
                              <td>{a.fecha}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </>
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
                  {/* AQUÍ RENDERIZAS LA TABLA DE HORAS EXTRA */}
                  <Alert variant="info" size="sm">
                    Pendiente: Mostrar tabla de {horasExtra.length} horas extra.
                  </Alert>
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
                  {/* AQUÍ RENDERIZAS LA TABLA DE VACACIONES */}
                  <Alert variant="info" size="sm">
                    Pendiente: Mostrar tabla de {vacaciones.length} registros de
                    vacaciones.
                  </Alert>
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
        No hay datos de nómina para mostrar.
      </Alert>
    );
  };

  return (
    <>
      {/* Cuerpo del Modal */}
      <div
        className="modal-body p-0"
        style={{ minHeight: "400px", maxHeight: "80vh", overflowY: "auto" }}
      >
        {renderContenido()}
      </div>

      {/* Footer del Modal */}
      <div className="modal-footer">
        <Button
          variant="outline-secondary"
          onClick={onClose}
          disabled={iniciando || pagando}
        >
          <XCircle size={18} className="me-1" />
          Cancelar
        </Button>
        {/* El botón de Pagar ya está en la sección superior, no se repite aquí */}
      </div>
    </>
  );
}
