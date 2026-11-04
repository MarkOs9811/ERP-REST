import React from "react";
import { useForm } from "react-hook-form";
import BotonAnimado from "../componentesReutilizables/BotonAnimado";
import RippleWrapper from "../componentesReutilizables/RippleWrapper";
import { FileText, FileTextIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


export default function FormularioReporte({
  titulo,
  onSubmit,
  isLoading,
  tipo,
  estadoIntegracionGoogle,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div className="lg:col-span-4 col-span-full">
      <Card className="border shadow-sm h-full">
        <CardHeader className="text-center p-3">
          <p className="h5">{titulo}</p>
        </CardHeader>
        <CardContent className="">
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="hidden"
              defaultValue={tipo}
              {...register("tipo", {
                required: "El tipo de reporte es obligatorio",
              })}
            />

            <div className="grid w-full p-3 mx-auto">
              <>
                {estadoIntegracionGoogle?.estado === 1 ? (
                  <RippleWrapper className="p-0">
                    <BotonAnimado
                      type="submit"
                      loading={isLoading}
                      className="btn-realizarPedido inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 text-xs px-3 h6 py-2"
                      icon={
                        !isLoading ? (
                          <FileTextIcon className="me-1 text-auto" />
                        ) : undefined
                      }
                    >
                      {isLoading ? "Generando..." : "Generar Reporte"}
                    </BotonAnimado>
                  </RippleWrapper>
                ) : (
                  <small className="text-muted-foreground">
                    No disponible, inicie sesión con su cuenta de Google
                  </small>
                )}
              </>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
