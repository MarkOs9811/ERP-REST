import { SolicitudesList } from "../../components/componentesModuloVentas/SolicitudesList";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { Plus } from "lucide-react";

export function Solicitud() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const handleGoAddSolicitud = () => {
    navigate("/ventas/solicitud/realizarSolicitud");
  };
  return (
    <div className="row g-3">
      <div className="col-lg-12">
        <div className="card shadow-sm py-2">
          <div className="card-header border-bottom-0 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 p-3">
            <div className="d-flex align-items-center">
              <h4 className="card-title mb-0 titulo-card-especial">
                Mis Solicitudes
                <span className="badge-header">Almacén</span>
              </h4>
            </div>
            
            <div className="d-flex flex-wrap gap-2 mt-3 mt-md-0 align-items-center ms-auto">
              <div className="header-search-container">
                 <input
                   className="form-control"
                   placeholder="Buscar..."
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                 />
              </div>
              <button
                className="btn btn-dark px-3"
                onClick={() => handleGoAddSolicitud()}
              >
                <Plus size={18} className="me-1" />
                Nueva Solicitud
              </button>
            </div>
          </div>
          <div className="card-body p-0">
            <SolicitudesList search={search} />
          </div>
        </div>
      </div>
    </div>
  );
}
