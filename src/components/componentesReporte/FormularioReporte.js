import { useForm } from "react-hook-form";
import BotonAnimado from "../componentesReutilizables/BotonAnimado";
import RippleWrapper from "../componentesReutilizables/RippleWrapper";
import { FileTextIcon } from "lucide-react";

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
    <div className="col-lg-4 col-sm-12">
      <div className="card border shadow-sm h-100 p-0 py-2">
        <div className="card-header py-2 px-3 border-bottom ">
          <p className="h6 mb-0">{titulo}</p>
        </div>

        {/* Ya no usamos onSubmit en la etiqueta <form> */}
        <form>
          <div className="card-body py-3 px-3">
            <input type="hidden" {...register("tipo")} />

            <div className="row g-2">
              <div className="col-6">
                <label htmlFor="fechaInicio" className="form-label small mb-1">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  id="fechaInicio"
                  className={`form-control form-control-sm ${
                    errors.fechaInicio ? "is-invalid" : ""
                  }`}
                  {...register("fechaInicio", {
                    required: "La fecha de inicio es obligatoria",
                    validate: (value) =>
                      value <= getTodayDate() || "La fecha no puede ser futura",
                  })}
                />
                {errors.fechaInicio && (
                  <div className="invalid-feedback">
                    {errors.fechaInicio.message}
                  </div>
                )}
              </div>

              <div className="col-6">
                <label htmlFor="fechaFin" className="form-label small mb-1">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  id="fechaFin"
                  className={`form-control form-control-sm ${
                    errors.fechaFin ? "is-invalid" : ""
                  }`}
                  {...register("fechaFin", {
                    required: "La fecha de fin es obligatoria",
                    validate: (value) =>
                      value <= getTodayDate() || "La fecha no puede ser futura",
                  })}
                />
                {errors.fechaFin && (
                  <div className="invalid-feedback">
                    {errors.fechaFin.message}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer con los botones */}
          <div className="card-footer px-3 bg-white border-top d-flex justify-content-end gap-2">
            {estadoIntegracionGoogle?.estado === 1 ? (
              // VISUALIZACIÓN CUANDO GOOGLE ESTÁ INTEGRADO (Muestra ambas opciones)
              <>
                <RippleWrapper className="p-0">
                  <BotonAnimado
                    type="button" // <--- IMPORTANTE: type="button" para que no recargue la página
                    loading={isLoadingClasico}
                    disabled={isAnyLoading}
                    className="btn btn-outline-dark"
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
                    className="btn-realizarPedido rounded-none btn-sm px-3 h6 py-2"
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
          </div>
        </form>
      </div>
    </div>
  );
}
