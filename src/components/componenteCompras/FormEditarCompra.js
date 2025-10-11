import { CreditCard, File, FileDownIcon, ShoppingCart } from "lucide-react";
import { useEffect } from "react";

export function FormEditarCompra({
  onSubmit,
  register,
  errors,
  data,
  watch,
  setValue,
}) {
  useEffect(() => {
    if (data) {
      setValue("proveedor", data?.proveedor?.nombre || "");
      setValue("usuario", data?.usuario?.email || "");
      setValue("numeroCompra", data?.numero_compra || "");
      setValue("totalPagado", data?.totalPagado || "");
      setValue("observaciones", data?.observaciones || "");
      setValue("tipoCompra", data?.tipoCompra || "");
      setValue("fechaCompra", data?.fecha_compra || "");
      setValue("creacion", data?.created_at || "");
      setValue("actualizacion", data?.updated_at || "");
    }
  }, [data, setValue]);

  return (
    <form className="p-2" onSubmit={onSubmit}>
      <div className="row g-3">
        {/* Tipo de Compra */}
        <div className="col-md-12 col-sm-12">
          {watch("tipoCompra") === "credito" ? (
            <div className="d-flex align-items-center justify-content-between border border-warning rounded-3 p-3 alert-warning-subtle shadow-sm">
              <div className="d-flex align-items-center gap-3">
                <CreditCard size={28} className="text-warning" />
                <div>
                  <h6 className="mb-0 fw-bold text-warning">
                    Compra a Crédito
                  </h6>
                  <small className="text-muted">Pago pendiente</small>
                </div>
              </div>
            </div>
          ) : (
            <div className="d-flex align-items-center justify-content-between border border-success rounded-3 p-3 alert-success-subtle shadow-sm">
              <div className="d-flex align-items-center gap-3">
                <ShoppingCart size={28} className="text-success" />
                <div>
                  <h6 className="mb-0 fw-bold text-success">
                    Compra al Contado
                  </h6>
                  <small className="text-muted">Pago realizado</small>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Proveedor y Usuario */}
        <div className="col-md-6">
          <label className="form-label small fw-bold">Proveedor</label>
          <input
            type="text"
            className="form-control bg-light"
            {...register("proveedor")}
            readOnly
          />
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-bold">Usuario</label>
          <input
            type="text"
            className="form-control bg-light"
            {...register("usuario")}
            readOnly
          />
        </div>

        {/* N° Compra */}
        <div className="col-md-6">
          <label className="form-label small fw-bold">N° Compra</label>
          <input
            type="text"
            className="form-control bg-light"
            {...register("numeroCompra")}
            readOnly
          />
        </div>

        {/* Total Pagado */}
        <div className="col-md-6">
          <label className="form-label small fw-bold">Total Pagado</label>
          <input
            type="number"
            className="form-control fw-bold text-success"
            {...register("totalPagado")}
            readOnly
          />
        </div>

        {/* Observaciones */}
        <div className="col-12">
          <label htmlFor="observaciones" className="form-label small fw-bold">
            Observaciones
          </label>
          <textarea
            className="form-control"
            id="observaciones"
            rows="3"
            {...register("observaciones")}
          />
        </div>
        <div className="col-12">
          <div className="card border p-0 ">
            <button className=" border-0 bg-transparent p-3 m-0 d-flex align-items-center gap-2">
              <span className="text-muted small fst-italic">
                <FileDownIcon size={18} className="text-auto" /> Ver el
                documento de la compra para más detalles.
              </span>
            </button>
          </div>
        </div>
        <hr></hr>
        {/* Fechas */}
        <div className="col-md-4">
          <label className="form-label small fw-bold">Fecha de Compra</label>
          <input
            type="text"
            className="form-control bg-light"
            {...register("fechaCompra")}
            readOnly
          />
        </div>
        <div className="col-md-4">
          <label className="form-label small fw-bold">Creación</label>
          <input
            type="text"
            className="form-control bg-light"
            {...register("creacion")}
            readOnly
          />
        </div>
        <div className="col-md-4">
          <label className="form-label small fw-bold">
            Última actualización
          </label>
          <input
            type="text"
            className="form-control bg-light"
            {...register("actualizacion")}
            readOnly
          />
        </div>
      </div>
    </form>
  );
}
