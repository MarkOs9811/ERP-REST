import { AlmacenTransferenias } from "../../components/componenteAlmacen/AlmacenTransferencias";
import { TransferirArea } from "../../components/componenteAlmacen/TranferirArea";
import { TransferirAlmacen } from "../../components/componenteAlmacen/TransferirAlmacen";

export function Transferencias() {
  return (
    <div className="card shadow-sm p-3">
      <div className="card-header d-flex justify-content-center align-items-center flex-column">
        <h4 className="text-center"> Transferencias de activos y productos</h4>
        <div className="m-auto">
          <AlmacenTransferenias className={"m-auto"} />
        </div>
      </div>
      <div className="card-body d-flex justify-content-center align-items-center flex-column">
        <TransferirAlmacen />
        <TransferirArea />
      </div>
    </div>
  );
}
