import { SolicitudesList } from "../../components/componentesModuloVentas/SolicitudesList";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";

export function Solicitud() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const handleGoAddSolicitud = () => {
    navigate("/ventas/solicitud/realizarSolicitud");
  };
  return (
    <div className="row g-3">
      <div className="col-lg-12">
        <div className="card  ">
          <div className="card-header border-bottom-0 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 ">
            <div className="d-flex align-items-center">
              <h4 className="card-title mb-0 ">
                Mis Solicitudes
                <span className="badge-header ms-2">Almacén</span>
              </h4>
            </div>

            <div className="d-flex  gap-2 mt-3 mt-md-0 align-items-center ms-auto">
              <div className="header-search-container">
                <Search className="search-icon" />
                <input
                  className="form-control"
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                className="btn-principal px-3 w-100"
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
