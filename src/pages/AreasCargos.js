import { ContenedorPrincipal } from "../components/componentesReutilizables/ContenedorPrincipal";

export function AreasCargo() {
  return (
    <ContenedorPrincipal>
      <div className="row g-3 ">
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h3>Areas</h3>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h3>Cargos</h3>
          </div>
        </div>
      </div>
    </ContenedorPrincipal>
  );
}
