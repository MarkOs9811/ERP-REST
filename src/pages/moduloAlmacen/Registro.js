import { AlmacenRegister } from "../../components/componenteAlmacen/AlmacenRegister";

export function Registro() {
  return (
    <div className="card shadow-sm p-3">
      <div className="card-header">
        <h4>Registro de activos/productos</h4>
      </div>
      <div className="card-body">
        <AlmacenRegister />
      </div>
    </div>
  );
}
