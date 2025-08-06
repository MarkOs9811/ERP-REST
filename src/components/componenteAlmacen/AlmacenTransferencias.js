import { ArrowLeftRight } from "lucide-react";

export function AlmacenTransferenias() {
  return (
    <div className="me-auto">
      <button className="btn btn-outline-dark  mx-2">
        <ArrowLeftRight className="text-auto" />
        <span className="ms-2">Transferencias de Area a Areas</span>
      </button>
      <button className="btn btn-outline-secondary ">
        <ArrowLeftRight className="text-auto" />
        <span className="ms-2">Transferencias de Almacen a Area</span>
      </button>
    </div>
  );
}
