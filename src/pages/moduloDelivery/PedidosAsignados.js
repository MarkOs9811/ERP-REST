import { ListaPedidosAsignados } from "../../components/componenteDelivery/ListaPedidosAsignados";

export function PedidosAsignados() {
  return (
    <div className="container-fluid p-0">
      <div className="card ">
        <div className="card-header">
          <h3 className="card-title">Pedidos en ruta</h3>
          <h5 className="card-subtitle mb-2 text-muted">
            Aquí puedes gestionar los pedidos asignados a los repartidores.
          </h5>
        </div>
        <div className="card-body p-0">
          <ListaPedidosAsignados />
        </div>
      </div>
    </div>
  );
}
