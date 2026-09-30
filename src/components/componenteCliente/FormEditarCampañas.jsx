import { useForm } from "react-hook-form";
import { useEffect } from "react";

export function FormEditarCampañas({ formId, dataCampaña, onSubmitHandler }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: dataCampaña || {
      tipo: "cupon",
      estado: true,
    },
  });

  const tipoCampana = watch("tipo");

  // Reset del formulario cuando los datos de la campaña cambien
  useEffect(() => {
    if (dataCampaña) {
      // 🔥 MAGIA FIRE WOK: Formatear las fechas estrictamente a YYYY-MM-DD
      const formattedData = {
        ...dataCampaña,
        // Cortamos los primeros 10 caracteres (ej: "2026-05-16 14:30:00" -> "2026-05-16")
        fecha_inicio: dataCampaña.fecha_inicio
          ? dataCampaña.fecha_inicio.substring(0, 10)
          : "",
        fecha_fin: dataCampaña.fecha_fin
          ? dataCampaña.fecha_fin.substring(0, 10)
          : "",
      };

      reset(formattedData);
    }
  }, [dataCampaña, reset]);

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="row g-3">
        {/* Fila 1: Nombre y Tipo */}
        <div className="col-md-8">
          <label className="small fw-bold">Nombre de Campaña</label>
          <input
            type="text"
            className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
            {...register("nombre", { required: "El nombre es obligatorio" })}
            placeholder="Ej. Promo Verano"
          />
          {errors.nombre && (
            <span className="text-danger small">{errors.nombre.message}</span>
          )}
        </div>
        <div className="col-md-4">
          <label className="small fw-bold">Tipo</label>
          <select className="form-select" {...register("tipo")}>
            <option value="cupon">Cupón</option>
            {/* Opciones futuras */}
            <option value="puntos" disabled>
              Puntos (Próximamente)
            </option>
          </select>
        </div>

        {/* Fila 2: Configuración del Cupón */}
        {tipoCampana === "cupon" && (
          <>
            <div className="col-md-4">
              <label className="small fw-bold">Código</label>
              <input
                type="text"
                className={`form-control text-uppercase ${errors.codigo_cupon ? "is-invalid" : ""}`}
                {...register("codigo_cupon", { required: "Código requerido" })}
                placeholder="VERANO20"
              />
            </div>
            <div className="col-md-4">
              <label className="small fw-bold">Tipo Descuento</label>
              <select className="form-select" {...register("tipo_descuento")}>
                <option value="porcentaje">Porcentaje (%)</option>
                <option value="monto_fijo">Monto Fijo (S/)</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="small fw-bold">Valor</label>
              <input
                type="number"
                step="0.01"
                className={`form-control ${errors.valor_descuento ? "is-invalid" : ""}`}
                {...register("valor_descuento", { required: true, min: 0.1 })}
                placeholder="0.00"
              />
            </div>
          </>
        )}

        {/* Fila 3: Límites de la Campaña */}
        <div className="col-md-6">
          <label className="small fw-bold">Monto Mínimo Compra (S/)</label>
          <input
            type="number"
            step="0.01"
            className={`form-control ${errors.monto_minimo_compra ? "is-invalid" : ""}`}
            {...register("monto_minimo_compra", {
              min: { value: 0, message: "No puede ser negativo" },
            })}
            placeholder="Opcional. Ej: 50.00"
          />
          {errors.monto_minimo_compra && (
            <span className="text-danger small">
              {errors.monto_minimo_compra.message}
            </span>
          )}
        </div>
        <div className="col-md-6">
          <label className="small fw-bold">Límite de Usos Totales</label>
          <input
            type="number"
            className={`form-control ${errors.limite_uso ? "is-invalid" : ""}`}
            {...register("limite_uso", {
              min: { value: 1, message: "Mínimo 1 uso" },
            })}
            placeholder="Opcional. Ej: 100"
          />
          {errors.limite_uso && (
            <span className="text-danger small">
              {errors.limite_uso.message}
            </span>
          )}
        </div>

        {/* Fila 4: Vigencia */}
        <div className="col-md-6">
          <label className="small fw-bold">Fecha Inicio</label>
          <input
            type="date"
            className={`form-control ${errors.fecha_inicio ? "is-invalid" : ""}`}
            {...register("fecha_inicio", { required: true })}
          />
        </div>
        <div className="col-md-6">
          <label className="small fw-bold">Fecha Fin</label>
          <input
            type="date"
            className={`form-control ${errors.fecha_fin ? "is-invalid" : ""}`}
            {...register("fecha_fin", { required: true })}
          />
        </div>

        {/* Fila 5: Estado */}
        <div className="col-md-12">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="estadoCampana"
              {...register("estado")}
            />
            <label className="form-check-label" htmlFor="estadoCampana">
              Campaña Activa
            </label>
          </div>
        </div>

        {/* 🔥 EL TRUCO: Botón submit oculto para que la tecla Enter funcione */}
        <button type="submit" className="d-none">
          Guardar Oculto
        </button>
      </div>
    </form>
  );
}
