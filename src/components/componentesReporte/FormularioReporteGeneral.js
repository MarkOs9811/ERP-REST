import React from "react";
import { useForm } from "react-hook-form";
import BotonAnimado from "../componentesReutilizables/BotonAnimado";
import RippleWrapper from "../componentesReutilizables/RippleWrapper";
import { FileText } from "lucide-react";

export default function FormularioReporte({
  titulo,
  onSubmit,
  isLoading,
  tipo,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div className="col-lg-4 col-sm-12">
      <div className="card border shadow-sm h-100">
        <div className="card-header text-center p-3">
          <p className="h5">{titulo}</p>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="hidden"
              defaultValue={tipo}
              {...register("tipo", {
                required: "El tipo de reporte es obligatorio",
              })}
            />

            <div className="d-grid w-50 p-3 mx-auto">
              <RippleWrapper className={"p-3"}>
                <BotonAnimado
                  type="submit"
                  loading={isLoading}
                  className="btn-realizarPedido w-100 h-100 p-2 h6"
                  icon={isLoading ? undefined : <FileText color="auto" />}
                >
                  {isLoading ? "Generando..." : "Generar Reporte"}
                </BotonAnimado>
              </RippleWrapper>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
