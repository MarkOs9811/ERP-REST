import { StarHalfIcon } from "lucide-react";
import "../../css/estilosClientes/EstiloFidelizacion.css";
export function Fidelizacion() {
  return (
    <div className="card border-0">
      <div className="card-header">
        <div className="bannerFidelizacion w-100 rounded-4 p-4">
          <div className="bg-white rounded-pill opacity-75 d-inline-block px-2 me-2 mb-3 text-dark">
            <StarHalfIcon />
            Fidelización
          </div>
          <h2 className="fw-bold text-white mb-1">
            Programa de beneficios para clientes fieles
          </h2>
          <p className="text-white mb-0 ">
            Crea un programa de fidelización para premiar a tus clientes más
            leales.
          </p>
          <button className="btn btn-outline-dark mt-5 text-danger fw-bold fs-6">
            Crear Programa
          </button>
        </div>
      </div>
      <div className="card-body"></div>
    </div>
  );
}
