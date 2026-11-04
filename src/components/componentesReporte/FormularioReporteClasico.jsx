import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

// Función auxiliar para obtener la fecha de hoy en formato YYYY-MM-DD (hora local)
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function FormularioReporteClasico({
  titulo,
  onSubmit,
  isLoading,
  tipo,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tipo: tipo,
    },
  });

  return (
    <div className="lg:col-span-4 col-span-full">
      <Card className="border shadow-sm h-full p-0 py-2">
        <CardHeader className="py-2 px-3 border-b">
          <p className="h6 mb-0">{titulo}</p>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="py-3 px-3">
            {/* Input oculto */}
            <input
              type="hidden"
              {...register("tipo", {
                required: "El tipo de reporte es obligatorio",
              })}
            />

            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-6">
                <label
                  htmlFor="fechaInicio"
                  className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm mb-1"
                >
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  id="fechaInicio"
                  className={`w-full rounded-md border-input bg-background py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs ${
                    errors.fechaInicio
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                  {...register("fechaInicio", {
                    required: "La fecha de inicio es obligatoria",
                    validate: (value) =>
                      value <= getTodayDate() || "La fecha no puede ser futura",
                  })}
                />
                {errors.fechaInicio && (
                  <div className="text-sm text-destructive">
                    {errors.fechaInicio.message}
                  </div>
                )}
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="fechaFin"
                  className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm mb-1"
                >
                  Fecha Fin
                </label>
                <input
                  type="date"
                  id="fechaFin"
                  className={`w-full rounded-md border-input bg-background py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs ${
                    errors.fechaFin
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                  {...register("fechaFin", {
                    required: "La fecha de fin es obligatoria",
                    validate: (value, formValues) => {
                      if (value < formValues.fechaInicio) {
                        return "La fecha fin no puede ser anterior a la inicio";
                      }
                      if (value > getTodayDate()) {
                        return "La fecha no puede ser futura";
                      }
                      return true;
                    },
                  })}
                />
                {errors.fechaFin && (
                  <div className="text-sm text-destructive">
                    {errors.fechaFin.message}
                  </div>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-transparent border-t flex justify-end">
            <Button
              type="submit"
              className="btn-generico px-3"
              disabled={isLoading}
              variant="default"
            >
              {isLoading ? (
                <>
                  <span
                    className="inline-block animate-spin rounded-full border-current border-r-transparent size-4 me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Generando...
                </>
              ) : (
                "Generar Reporte"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
