import { useForm } from "react-hook-form";
import BotonAnimado from "../componentesReutilizables/BotonAnimado";
import RippleWrapper from "../componentesReutilizables/RippleWrapper";
import { FileTextIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function FormularioReporte({
  titulo,
  onSubmitGoogle,
  onSubmitClasico,
  isLoadingGoogle,
  isLoadingClasico,
  tipo,
  estadoIntegracionGoogle,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { tipo: tipo }, // Forzamos el valor por defecto aquí
  });

  // Determinamos si los botones deben bloquearse
  const isAnyLoading = isLoadingGoogle || isLoadingClasico;

  return (
    <div className="lg:col-span-4 col-span-full">
      <Card className="border h-full p-0 py-2">
        <CardHeader className="py-2 px-3 border-b">
          <p className="h6 mb-0">{titulo}</p>
        </CardHeader>

        {/* Ya no usamos onSubmit en la etiqueta <form> */}
        <form>
          <CardContent className="py-3 px-3">
            <input type="hidden" {...register("tipo")} />

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
                    validate: (value) =>
                      value <= getTodayDate() || "La fecha no puede ser futura",
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

          {/* Footer con los botones */}
          <CardFooter className="px-3 bg-background border-t flex justify-end gap-2">
            {estadoIntegracionGoogle?.estado === 1 ? (
              // VISUALIZACIÓN CUANDO GOOGLE ESTÁ INTEGRADO (Muestra ambas opciones)
              <>
                <RippleWrapper className="p-0">
                  <BotonAnimado
                    type="button" // <--- IMPORTANTE: type="button" para que no recargue la página
                    loading={isLoadingClasico}
                    disabled={isAnyLoading}
                    className="shadow inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-input bg-background text-foreground hover:bg-accent"
                    icon={
                      !isLoadingClasico ? (
                        <FileTextIcon className="me-1" />
                      ) : undefined
                    }
                    onClick={handleSubmit(onSubmitClasico)}
                  >
                    {isLoadingClasico ? "..." : "Excel"}
                  </BotonAnimado>
                </RippleWrapper>

                <RippleWrapper className="p-0">
                  <BotonAnimado
                    type="button"
                    loading={isLoadingGoogle}
                    disabled={isAnyLoading}
                    className="btn-guardar mx-3 px-3"
                    icon={
                      !isLoadingGoogle ? (
                        <FileTextIcon className="me-1" />
                      ) : undefined
                    }
                    onClick={handleSubmit(onSubmitGoogle)}
                  >
                    {isLoadingGoogle ? "Generando..." : "Google Sheets"}
                  </BotonAnimado>
                </RippleWrapper>
              </>
            ) : (
              // VISUALIZACIÓN CUANDO GOOGLE NO ESTÁ INTEGRADO (Solo Excel Clásico)
              <RippleWrapper className="p-0">
                <BotonAnimado
                  type="button"
                  loading={isLoadingClasico}
                  disabled={isAnyLoading}
                  className="px-3 h6 py-2" // Lo pintamos más llamativo (primary)
                  icon={
                    !isLoadingClasico ? (
                      <FileTextIcon className="me-1" />
                    ) : undefined
                  }
                  onClick={handleSubmit(onSubmitClasico)}
                >
                  {isLoadingClasico
                    ? "Generando..."
                    : "Descargar Reporte Excel"}
                </BotonAnimado>
              </RippleWrapper>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
