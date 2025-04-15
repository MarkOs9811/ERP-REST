import { AlmacenRegister } from "../../components/componenteAlmacen/AlmacenRegister";

export function Registro() {
  return (
    <div className="container-fluid w-100 h-100 p-0">
      <div className="card bg-transparent  my-0 flex-grow-1 h-100 d-flex flex-column p-0 m-0">
        <div className="card-header border-bottom d-flex justify-content-between align-items-center">
          <h4 className="card-title mb-0 titulo-card-especial m-3">
            Registro de activos/productos
          </h4>
        </div>
        <div
          className="card-body overflow-y-auto overflow-x-hidden p-0 pe-2"
          style={{ height: "calc(100vh - 480px)" }}
        >
          <div className="card shadow-sm h-100">
            <AlmacenRegister />
          </div>
        </div>
      </div>
    </div>
  );
}
