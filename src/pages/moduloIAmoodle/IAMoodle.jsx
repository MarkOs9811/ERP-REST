import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/AxiosInstance";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

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
    <Card className="shadow-sm border-0">
      <CardContent className="">
        <CardTitle asChild>
          <h5 className="text-primary font-bold mb-3">
            Asistente IA para Moodle
          </h5>
        </CardTitle>
        <p className="text-muted-foreground mb-4">
          Pregúntale a la IA sobre los estudiantes, cursos o calificaciones en
          lenguaje natural.
        </p>

        {/* Input para el mensaje natural */}
        <div className="flex w-full items-stretch mb-3">
          <input
            type="text"
            className="w-full rounded-md border-input bg-background py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-10 px-4 text-base"
            placeholder="Ej: Averigua en qué cursos está matriculado junior.pari@uarm.pe"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 px-4"
            onClick={() => consultarCursos()}
            disabled={cargando || !mensaje.trim()} // Desactiva si está cargando o el input está vacío
            variant="default"
          >
            {cargando ? (
              <>
                <span
                  className="inline-block animate-spin rounded-full border-current border-r-transparent size-4 me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Pensando...
              </>
            ) : (
              "Preguntar"
            )}
          </Button>
        </div>

        {isError && (
          <div className="relative w-full rounded-lg px-4 py-3 text-sm border-destructive/30 bg-destructive/10 text-destructive mt-3 flex items-center">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>
              <strong>Ocurrió un error:</strong> {error.message}
            </div>
          </div>
        )}

        {isSuccess && respuesta && (
          <div className="relative w-full rounded-lg px-4 py-3 text-sm border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 mt-4">
            <h6 className="alert-heading font-bold mb-2">
              Respuesta de la IA:
            </h6>
            <div className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
              {respuesta}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
