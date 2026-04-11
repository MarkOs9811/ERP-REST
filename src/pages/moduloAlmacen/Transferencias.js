import { TransferirAlmacen } from "../../components/componenteAlmacen/TransferirAlmacen";

export function Transferencias() {
  return (
    <div>
      <div className="card py-2">
        {/* Usamos d-flex flex-column y align-items-start para pegar todo a la izquierda */}
        <div className="card-header d-flex flex-column align-items-start border-bottom bg-transparent">
          <div>
            <h4 className="m-0">Transferencias de activos y productos</h4>
            <span className="text-muted small">
              Enfocado para mover productos al inventario de ventas
            </span>
          </div>
        </div>

        <div className="card-body">
          <TransferirAlmacen />
        </div>
      </div>
    </div>
  );
}
