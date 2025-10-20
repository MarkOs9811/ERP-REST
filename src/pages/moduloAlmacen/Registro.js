import { AlmacenRegister } from "../../components/componenteAlmacen/AlmacenRegister";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";

export function Registro() {
  return (
    <div>
      <div className="card  my-0 flex-grow-1 h-100 d-flex flex-column py-2 m-0 shadow-sm">
        <div className="card-header border-bottom d-flex justify-content-between align-items-center">
          <h4 className="card-title mb-0 titulo-card-especial m-3">
            Registro de activos/productos
          </h4>
        </div>
        <div className="card-body ">
          <AlmacenRegister />
        </div>
      </div>
    </div>
  );
}
