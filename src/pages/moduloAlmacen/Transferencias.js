import { AlmacenTransferenias } from "../../components/componenteAlmacen/AlmacenTransferencias";
import { TransferirArea } from "../../components/componenteAlmacen/TranferirArea";
import { TransferirAlmacen } from "../../components/componenteAlmacen/TransferirAlmacen";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";

export function Transferencias() {
  return (
    <ContenedorPrincipal>
      <div className="card  h-100 shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center border-bottom">
          <h4 className="text-center">
            {" "}
            Transferencias de activos y productos
          </h4>
          <div className="ms-auto">
            <AlmacenTransferenias />
          </div>
        </div>
        <div className="card-body h-100">
          <TransferirAlmacen />
          <TransferirArea />
        </div>
      </div>
    </ContenedorPrincipal>
  );
}
