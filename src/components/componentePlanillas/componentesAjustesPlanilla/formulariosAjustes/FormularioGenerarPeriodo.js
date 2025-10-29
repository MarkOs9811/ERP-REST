import { useState, useEffect } from "react";
import { Eye, Save, AlertTriangle, CalendarCheck } from "lucide-react";
import axiosInstance from "../../../../api/AxiosInstance";
import ToastAlert from "../../../componenteToast/ToastAlert";
import { useQueryClient } from "@tanstack/react-query";

const formatearFecha = (fecha) => {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
};

const getMesNombre = (mesIndex) => {
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return meses[mesIndex];
};

export function FormularioGenerarPeriodo({ onClose, ultimoCorteReal = null }) {
  const anioActual = new Date().getFullYear();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const [anio, setAnio] = useState(anioActual);
  const [frecuencia, setFrecuencia] = useState("mensual");
  const [diaCorte, setDiaCorte] = useState(28);

  const [fechaInicio, setFechaInicio] = useState("");

  const [periodosPreview, setPeriodosPreview] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ultimoCorteReal) {
      const ultimoCorteDate = new Date(ultimoCorteReal + "T12:00:00Z");
      ultimoCorteDate.setDate(ultimoCorteDate.getDate() + 1);
      setFechaInicio(formatearFecha(ultimoCorteDate));
    } else {
      setFechaInicio("");
    }
  }, [ultimoCorteReal]);

  const handleGenerarPreview = (e) => {
    e.preventDefault();
    setError("");
    setPeriodosPreview([]);

    // 1. Validaciones
    if (diaCorte < 1 || diaCorte > 31) {
      setError("El día de corte debe estar entre 1 y 31.");
      return;
    }
    if (!fechaInicio) {
      setError("Debe especificar la 'Fecha de Inicio del Primer Periodo'.");
      return;
    }

    const periodosGenerados = [];
    let fechaInicioPeriodo;

    try {
      // Usamos T12:00:00Z (mediodía UTC) para la seguridad de la zona horaria
      fechaInicioPeriodo = new Date(fechaInicio + "T12:00:00Z");
    } catch (err) {
      setError("La fecha de inicio no es válida.");
      return;
    }

    const anioAGenerar = anio; // El año seleccionado en el dropdown
    let mesDeCorte = fechaInicioPeriodo.getMonth(); // 0-11
    let anioDeCorte = fechaInicioPeriodo.getFullYear();

    // 2. Ajustar el primer mes de corte (lógica de transición)
    // Si el día de inicio (ej. 28) es MAYOR que el nuevo día de corte (ej. 20)...
    // el primer corte debe ser en el mes SIGUIENTE.
    if (fechaInicioPeriodo.getDate() > diaCorte) {
      mesDeCorte += 1;
      if (mesDeCorte > 11) {
        mesDeCorte = 0;
        anioDeCorte += 1;
      }
    }

    // 3. Bucle de generación
    // Continuar mientras el año de corte sea menor o igual al año a generar
    while (anioDeCorte <= anioAGenerar) {
      const fechaFinPeriodo = new Date(anioDeCorte, mesDeCorte, diaCorte);

      // Ajustar para meses cortos (ej. 30 en Feb)
      const ultimoDiaDelMes = new Date(
        anioDeCorte,
        mesDeCorte + 1,
        0
      ).getDate();
      if (diaCorte > ultimoDiaDelMes) {
        fechaFinPeriodo.setDate(ultimoDiaDelMes);
      }

      // Solo agregamos si el periodo generado todavía está dentro del año objetivo
      if (
        anioDeCorte < anioAGenerar ||
        (anioDeCorte === anioAGenerar && mesDeCorte <= 11)
      ) {
        periodosGenerados.push({
          nombrePeriodo: `${getMesNombre(mesDeCorte)} ${anioDeCorte}`,
          fecha_inicio: formatearFecha(fechaInicioPeriodo),
          fecha_fin: formatearFecha(fechaFinPeriodo),
          estado: 0, // Pendiente
        });
      }

      // 4. Preparar el siguiente ciclo
      fechaInicioPeriodo = new Date(fechaFinPeriodo);
      fechaInicioPeriodo.setDate(fechaFinPeriodo.getDate() + 1);

      mesDeCorte += 1;
      if (mesDeCorte > 11) {
        mesDeCorte = 0;
        anioDeCorte += 1;
      }
    }

    if (periodosGenerados.length === 0) {
      setError(
        "No se generaron periodos. Verifique que la fecha de inicio no sea posterior al último corte del año seleccionado."
      );
    }

    setPeriodosPreview(periodosGenerados);
  };

  /**
   * Simula el guardado de los periodos generados.
   */
  // Tu función (ahora con manejo de errores robusto)

  const handleGuardarPeriodos = async () => {
    // Opcional: Poner un estado de 'cargando' aquí
    setLoading(true);

    try {
      const response = await axiosInstance.post("/periodoNomina", {
        periodosPreview, // Esto envía un objeto: { periodosPreview: [...] }
      });

      // Éxito (Código 200 o 201)
      if (response.data.success) {
        ToastAlert(
          "success",
          response.data.message || "Se registró correctamente"
        );
        queryClient.invalidateQueries(["listaPeriodosNomina"]);
        setLoading(false);
        onClose(); // Cierra el modal
      }
    } catch (error) {
      if (error.response) {
        const data = error.response.data;

        if (error.response.status === 422 && data.errors) {
          try {
            const errores = data.errors;
            const primerErrorKey = Object.keys(errores)[0];
            const mensajeError = errores[primerErrorKey][0];

            ToastAlert("error", `Error de validación: ${mensajeError}`);
          } catch (e) {
            ToastAlert("error", "Error de validación. Revise los datos.");
          }
        } else if (data.message) {
          ToastAlert("error", `Error: ${data.message}`);
        } else {
          // Error genérico si el formato no es el esperado
          ToastAlert("error", "Ocurrió un error inesperado en el servidor.");
        }
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta (ej. sin internet)
        ToastAlert("error", "No se pudo conectar con el servidor.");
      } else {
        // Error al configurar la petición
        ToastAlert("error", "Error al preparar la solicitud.");
      }
    } finally {
      // Opcional: Quitar el estado de 'cargando'
      setLoading(false);
    }
  };

  const opcionesAnio = [anioActual, anioActual + 1, anioActual + 2];

  return (
    <div className="p-3">
      <div className="card-body">
        <form onSubmit={handleGenerarPreview}>
          <div className="row g-3">
            {/* 1. Año a Generar */}
            <div className="col-md-12">
              <div className="mb-3">
                <label className="form-label">
                  <strong>Año a Generar</strong>
                </label>
                <select
                  className="form-select"
                  value={anio}
                  onChange={(e) => setAnio(Number(e.target.value))}
                >
                  {opcionesAnio.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. NUEVO CAMPO: Fecha de Inicio */}
            <div className="col-md-12">
              <div className="mb-3">
                <label className="form-label">
                  <strong>Fecha de Inicio del Primer Periodo</strong>
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  required // Obligatorio
                />
                <small className="form-text text-muted">
                  {ultimoCorteReal
                    ? `Autocompletado (día después del último corte: ${ultimoCorteReal})`
                    : "Requerido (no se encontraron periodos anteriores)"}
                </small>
              </div>
            </div>

            {/* 3. Frecuencia */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">
                  <strong>Frecuencia</strong>
                </label>
                <select
                  className="form-select"
                  value={frecuencia}
                  onChange={(e) => setFrecuencia(e.target.value)}
                >
                  <option value="mensual">Mensual (Día Fijo)</option>
                  <option value="quincenal" disabled>
                    Quincenal (no disponible)
                  </option>
                </select>
              </div>
            </div>

            {/* 4. Día de Corte */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">
                  <strong>Día de Corte (1-31)</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={diaCorte}
                  onChange={(e) => setDiaCorte(Number(e.target.value))}
                  min="1"
                  max="31"
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <div
              className="alert alert-danger d-flex align-items-center"
              role="alert"
            >
              <AlertTriangle size={18} className="me-2" />
              {error}
            </div>
          )}

          <div className="d-grid d-md-block">
            <button type="submit" className="btn-principal">
              <Eye size={18} className="me-2" />
              Previsualizar Periodos
            </button>
          </div>
        </form>

        {/* --- Área de Previsualización --- */}
        {periodosPreview.length > 0 && (
          <div className="mt-4">
            <hr />
            <h5>
              <CalendarCheck size={20} className="me-2 text-success" />
              Previsualización de Periodos
            </h5>
            <p>
              Se generarán los siguientes {periodosPreview.length} periodos:
            </p>

            <ul className="list-group list-group-flush bg-light rounded border">
              {periodosPreview.map((p, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center bg-transparent"
                >
                  <div>
                    <strong>{p.nombrePeriodo}</strong>
                    <br />
                    <small className="text-muted">
                      Del {p.fecha_inicio} al {p.fecha_fin}
                    </small>
                  </div>
                  <span className="badge bg-secondary">Pendiente</span>
                </li>
              ))}
            </ul>

            <div className="d-grid gap-2 d-md-flex justify-content-end mt-4">
              <button
                type="button"
                className="btn-guardar"
                onClick={handleGuardarPeriodos}
                disabled={loading}
              >
                {loading ? (
                  <div>
                    <span className="load">Cargando...</span>
                  </div>
                ) : (
                  <>
                    <Save size={18} className="me-2" />
                    Confirmar y Guardar
                  </>
                )}
              </button>
              <button
                type="button"
                className=" btn-cerrar-modal ms-md-2"
                onClick={onClose}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
