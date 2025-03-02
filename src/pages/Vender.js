import { MesasList } from "../components/componenteVender/MesasList";

export function Vender() {
  return (
    <div className="row ">
      <div className="col-md-12">
        <div className="card p-3 shadow-sm">
          <MesasList />
        </div>
      </div>
    </div>
  );
}
