import { Soup } from "lucide-react";

export function PedidosPopularesHome() {
  const metrics = {
    platosPopulares: ["Lomo Saltado", "Ceviche", "Arroz con Pollo"],
  };
  return (
    <div className="col-md-2">
      <div className="dashboard-card h-100">
        <div className="card-body">
          <h5 className="text-dark mb-3 d-flex align-items-center">
            <Soup
              color={"var(--primary-red)"}
              height="20px"
              width="20px"
              className="me-2"
            />
            Platos Más Vendidos
          </h5>
          <ul className="list-group list-group-flush">
            {metrics.platosPopulares.map((plato, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2"
              >
                <span className="text-dark">{plato}</span>
                <span className="badge bg-primary rounded-pill">
                  {15 - index * 3}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
