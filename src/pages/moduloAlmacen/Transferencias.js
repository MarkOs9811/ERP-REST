import { AlmacenTransferenias } from "../../components/componenteAlmacen/AlmacenTransferencias";
import { TransferirArea } from "../../components/componenteAlmacen/TranferirArea";
import { TransferirAlmacen } from "../../components/componenteAlmacen/TransferirAlmacen";

export function Transferencias() {
  return (
    <div className="container-fluid w-100 h-100 p-0">
      <div className="card bg-transparent  my-0 flex-grow-1 h-100 d-flex flex-column p-0 m-0">
        <div
          className="card-body overflow-y-auto overflow-x-hidden p-0 pe-2"
          style={{ height: "calc(100vh - 480px)" }}
        >
          <div className="card p-3 h-100 shadow-sm">
            <div className="card-header d-flex justify-content-center align-items-center flex-column">
              <h4 className="text-center">
                {" "}
                Transferencias de activos y productos
              </h4>
              <div className="m-auto">
                <AlmacenTransferenias className={"m-auto"} />
              </div>
            </div>
            <div className="card-body">
              <TransferirAlmacen />
              <TransferirArea />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
