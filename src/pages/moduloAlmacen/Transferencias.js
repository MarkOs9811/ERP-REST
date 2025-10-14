import { TransferirAlmacen } from "../../components/componenteAlmacen/TransferirAlmacen";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";

export function Transferencias() {
  return (
    <ContenedorPrincipal>
      <div className="card   shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center border-bottom">
          <h4 className="text-center">Transferencias de activos y productos</h4>
        </div>
        <div className="card-body ">
          <TransferirAlmacen />
        </div>
      </div>
    </ContenedorPrincipal>
  );
}
