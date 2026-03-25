import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/AxiosInstance";

export function IAMoodle() {
  // Estado para capturar el mensaje natural del usuario
  const [mensaje, setMensaje] = useState("");

  const {
    data: respuesta,
    isFetching: cargando,
    isError,
    error,
    refetch: consultarCursos,
    isSuccess,
  } = useQuery({
    // La queryKey ahora depende del mensaje
    queryKey: ["consultarCursosMoodle", mensaje],
    queryFn: async () => {
      // Pasamos el mensaje como Query Parameter
      const res = await axiosInstance.get("/moodle/consultar-curso", {
        params: { mensaje: mensaje }, // Aquí está el cambio clave
      });

      const json = res.data;

      if (!json.success) {
        throw new Error(
          json.message || "Error al procesar la solicitud en el servidor.",
        );
      }

      return json.data;
    },
    enabled: false,
  });

  // Permitir enviar con la tecla Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && mensaje.trim() !== "" && !cargando) {
      consultarCursos();
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h5 className="card-title text-primary fw-bold mb-3">
          Asistente IA para Moodle
        </h5>
        <p className="card-text text-muted mb-4">
          Pregúntale a la IA sobre los estudiantes, cursos o calificaciones en
          lenguaje natural.
        </p>

        {/* Input para el mensaje natural */}
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Ej: Averigua en qué cursos está matriculado junior.pari@uarm.pe"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="btn btn-primary px-4"
            onClick={() => consultarCursos()}
            disabled={cargando || !mensaje.trim()} // Desactiva si está cargando o el input está vacío
          >
            {cargando ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Pensando...
              </>
            ) : (
              "Preguntar"
            )}
          </button>
        </div>

        {isError && (
          <div className="alert alert-danger mt-3 d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>
              <strong>Ocurrió un error:</strong> {error.message}
            </div>
          </div>
        )}

        {isSuccess && respuesta && (
          <div className="alert alert-success mt-4">
            <h6 className="alert-heading fw-bold mb-2">Respuesta de la IA:</h6>
            <div className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
              {respuesta}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
