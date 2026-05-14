import { DashboardGrafic } from "../../components/componenteCliente/DashboardGrafic";
import { ListaFeedBacks } from "../../components/componenteCliente/ListaFeedBacks";

export function DashboardCliente() {
  return (
    <div className="card border-0">
      <div className="card-header">
        <div>
          <h4 className="fw-bold text-fw-main mb-1">Modulo de clientes</h4>
          <p className="text-fw-muted mb-0">
            Aquí está lo que está pasando hoy.
          </p>
        </div>

        <div className="d-flex gap-3">
          <button className="btn btn-outline-dark">Exportar Reporte</button>
        </div>
      </div>
      <div className="card-body px-3">
        <DashboardGrafic />
      </div>
    </div>
  );
}
