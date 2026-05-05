import { ListaMisEntregas } from "../../components/componenteDelivery/ListaMisEntregas";

export function MisEntregas() {
  return (
    <div className="card">
      <div className="card-header">
        <h3>Mis entregas</h3>
      </div>
      <div className="card-body p-0">
        <ListaMisEntregas />
      </div>
    </div>
  );
}
