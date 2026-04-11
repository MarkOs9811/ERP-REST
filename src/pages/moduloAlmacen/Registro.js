import { AlmacenRegister } from "../../components/componenteAlmacen/AlmacenRegister";

export function Registro() {
  return (
    <div>
      <div className="card my-0 flex-grow-1 h-100 d-flex flex-column py-2 m-0 shadow-sm">
        <div className="card-header border-bottom-0 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 p-3">
          <div className="d-flex align-items-center">
            <h4 className="card-title mb-0 titulo-card-especial">
              Registro de activos/productos
            </h4>
          </div>
        </div>
        <div className="card-body">
          <AlmacenRegister />
        </div>
      </div>
    </div>
  );
}
