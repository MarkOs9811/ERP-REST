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
    <div className="card h-100 shadow-sm">
      <div className="card-header">
        <h5>Resumen</h5>
      </div>

      {/* Resumen de totales */}
      <div className="card p-3 border-pill shadow-none">
        <div className="d-flex justify-content-between">
          <span>Sub Total</span>
          <span className="fw-bold text-success">S/. {subTotal}</span>
        </div>
        <div className="d-flex justify-content-between">
          <span>IGV</span>
          <span className="fw-normal text-secondary">S/. {igv}</span>
        </div>
        <div className="border-top mt-3 pt-2">
          <div className="d-flex justify-content-between align-items-center">
            <span className="h2">Total</span>
            <span className="h2 fw-bold text-success">S/. {totalPreventa}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
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
            <label>Cliente </label>
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

          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              readOnly
              value={vuelto}
            />
            <label>Cambio S/.</label>
          </div>
        </div>

        <div className="card-footer mt-4 p-3 border-0">
          <BotonAnimado
            type="submit" // Importante: que sea tipo submit
            loading={loading}
            error={error}
            className="btn-realizarPedido w-100 p-3 h-100"
          >
            Realizar Pago
          </BotonAnimado>
        </div>
      </form>
    </div>
  );
}
