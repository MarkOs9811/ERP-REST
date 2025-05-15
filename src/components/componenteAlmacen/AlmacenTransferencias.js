import { TrailSignOutline } from "react-ionicons";

export function AlmacenTransferenias() {
  return (
    <div className="me-auto">
      <button className="btn btn-outline-dark  mx-2">
        <TrailSignOutline color={"auto"} />
        <span className="ms-2">Transferencias de Area a Areas</span>
      </button>
      <button className="btn btn-outline-secondary ">
        <TrailSignOutline color={"auto"} />
        <span className="ms-2">Transferencias de Almacen a Area</span>
      </button>
    </div>
  );
}
