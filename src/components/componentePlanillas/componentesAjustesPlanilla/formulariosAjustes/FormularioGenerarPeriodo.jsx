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

    if (diaCorte < 1 || diaCorte > 31) {
      return setError("El día de corte debe estar entre 1 y 31.");
    }
    if (!fechaInicio) {
      return setError("Debe especificar la 'Fecha de Inicio del Primer Periodo'.");
    }

    let actualInicio;
    try {
      actualInicio = new Date(fechaInicio + "T12:00:00Z");
    } catch (err) {
      return setError("La fecha de inicio no es válida.");
    }

    const anioLimite = anio; // Año seleccionado en el input
    const periodosGenerados = [];
    let safeguard = 0; // Evita bucles infinitos por seguridad

    // Iteramos HASTA que el año de inicio supere el año límite seleccionado
    while (actualInicio.getFullYear() <= anioLimite && safeguard < 24) {
      safeguard++;
      
      let mesCorte = actualInicio.getMonth();
      let anioCorte = actualInicio.getFullYear();

      // REGLA CLAVE: Si el día de inicio ya es mayor o igual al día de corte, 
      // el fin de periodo pasa obligatoriamente al siguiente mes.
      if (actualInicio.getDate() >= diaCorte) {
        mesCorte += 1;
        if (mesCorte > 11) {
          mesCorte = 0;
          anioCorte += 1;
        }
      }

      const actualFin = new Date(anioCorte, mesCorte, diaCorte);

      // Ajuste para meses cortos (Ej: si el corte es 31 y estamos en Febrero, se ajusta al 28/29)
      const ultimoDiaMes = new Date(anioCorte, mesCorte + 1, 0).getDate();
      if (diaCorte > ultimoDiaMes) {
        actualFin.setDate(ultimoDiaMes);
      }

      // Solo guardamos el periodo si toca el año que el usuario quiere generar
      if (actualInicio.getFullYear() === anioLimite || actualFin.getFullYear() === anioLimite) {
        periodosGenerados.push({
          nombrePeriodo: `${getMesNombre(actualFin.getMonth())} ${actualFin.getFullYear()}`,
          fecha_inicio: formatearFecha(actualInicio),
          fecha_fin: formatearFecha(actualFin),
          estado: 0, // Pendiente
        });
      }

      // El inicio del siguiente periodo es exactamente 1 día después del fin actual
      actualInicio = new Date(actualFin);
      actualInicio.setDate(actualFin.getDate() + 1);
    }

    if (periodosGenerados.length === 0) {
      setError("No se generaron periodos. La fecha seleccionada ya supera el año a generar.");
      return;
    }

    setPeriodosPreview(periodosGenerados);
  };

  const handleGuardarPeriodos = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.post("/periodoNomina", { periodosPreview });

      if (response.data.success) {
        ToastAlert("success", response.data.message || "Se registró correctamente");
        queryClient.invalidateQueries(["listaPeriodosNomina"]);
        onClose(); // Cierra el modal
      }
    } catch (error) {
      if (error.response) {
        const data = error.response.data;

        // Si Laravel devuelve el 422 nativo
        if (error.response.status === 422 && data.errors) {
          try {
            const primerErrorKey = Object.keys(data.errors)[0];
            const mensajeError = data.errors[primerErrorKey][0];
            return ToastAlert("error", `Validación: ${mensajeError}`);
          } catch (e) {
            return ToastAlert("error", "Error de validación. Revise los datos.");
          }
        } 
        
        // Excepción de tu Catch genérico
        if (data.error && typeof data.error === 'string') {
          return ToastAlert("error", data.error);
        } 
        
        if (data.message) {
          return ToastAlert("error", data.message);
        }

        ToastAlert("error", "Ocurrió un error inesperado en el servidor.");
      } else if (error.request) {
        ToastAlert("error", "No se pudo conectar con el servidor.");
      } else {
        ToastAlert("error", "Error al preparar la solicitud.");
      }
    } finally {
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
