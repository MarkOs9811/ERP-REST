import { useForm } from "react-hook-form";
import BotonAnimado from "../../componentesReutilizables/BotonAnimado";

export function RealizarPago({
  totalPreventa,
  igv,
  handleCrearJson,
  loading,
  error,
}) {
  // 1. Inicializamos register y handleSubmit
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      nombreReferencia: "",
      pagoCon: 0,
    },
  });

  // Observamos el campo "pagoCon" para calcular el vuelto en tiempo real
  const pagoCon = watch("pagoCon");
  const vuelto =
    pagoCon - totalPreventa > 0 ? (pagoCon - totalPreventa).toFixed(2) : "0.00";

  // 2. Función intermedia para pasar los datos al padre
  const onSubmit = (data) => {
    // Pasamos el nombre del cliente (y lo que necesites) a tu función original
    handleCrearJson(data.nombreReferencia);
  };

  const subTotal = (totalPreventa - igv).toFixed(2);

  return (
    <div className="card h-100 shadow-sm border-0 overflow-auto">
      <div className="card-header bg-white py-3">
        <h5 className="mb-0 fw-bold">Resumen</h5>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="d-flex flex-column h-100"
      >
        <div className="card-body">
          {/* NUEVO CAMPO: Nombre del Cliente */}
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Nombre del cliente"
              {...register("nombreReferencia", {
                required: "El nombre es obligatorio",
              })}
            />
            <label>Cliente</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="number"
              step="0.1"
              className="form-control"
              placeholder=" "
              {...register("pagoCon")}
            />
            <label>Pagar con: S/.</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="text"
              className="form-control bg-light"
              readOnly
              value={vuelto}
            />
            <label>Cambio S/.</label>
          </div>

          {/* SECCIÓN DE DESGLOSE DE PRECIOS ESTRUCTURADA */}
          <div className="border-top pt-3">
            <div className="d-flex justify-content-between mb-1">
              <span className="text-muted">Sub Total</span>
              <span className="fw-medium text-dark">S/. {subTotal}</span>
            </div>

            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">IGV</span>
              <span className="text-secondary">S/. {igv}</span>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-2">
              <span className="h4 mb-0">Total</span>
              <div className="text-end">
                {/* Aquí quité el .toFixed(2) que rompía la vista y lo dejé como tu original */}
                <span className="h3 fw-bold text-success mb-0">
                  S/. {totalPreventa}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card-footer bg-white border-0 p-3 overflow-auto">
          <BotonAnimado
            type="submit" // Importante: que sea tipo submit
            loading={loading}
            error={error}
            className="btn-realizarPedido w-100 p-3 h-100 fs-5"
          >
            Realizar Pago
          </BotonAnimado>
        </div>
      </form>
    </div>
  );
}
