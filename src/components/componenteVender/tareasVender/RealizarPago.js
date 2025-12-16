import BotonAnimado from "../../componentesReutilizables/BotonAnimado";

export function RealizarPago({
  totalPreventa,
  igv,
  handleCrearJson,
  loading,
  error,
}) {
  const subTotal = (totalPreventa - igv).toFixed(2);
  return (
    <div className="card h-100  shadow-sm">
      <div className="card-header">
        <h5>Resumen</h5>
      </div>
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

      <div className="card-body">
        <div className="form-floating mb-3">
          <input type="text" className="form-control" placeholder=" " />
          <label>Pagar con: S/.</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder=" " />
          <label>Cambio S/.</label>
        </div>
      </div>
      <div className="card-footer mt-4 p-3 border-0">
        <BotonAnimado
          onClick={handleCrearJson}
          loading={loading}
          error={error}
          className="btn-realizarPedido w-100 p-3  h-100"
        >
          Realizar Pago
        </BotonAnimado>
      </div>
    </div>
  );
}
