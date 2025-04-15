import { MesasList } from "../components/componenteVender/MesasList";

export function Vender() {
  return (
    <div className="container-fluid g-2 h-100 w-100 p-0">
      <div className="col-md-12  d-flex flex-column">
        <MesasList />
      </div>
    </div>
  );
}
