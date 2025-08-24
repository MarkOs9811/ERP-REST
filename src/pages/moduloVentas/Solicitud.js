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
    <ContenedorPrincipal>
      <div className="row g-2">
        <div className="col-lg-12">
          <div className="card shadow-sm">
            <div className="card-header border-bottom d-flex justify-content-between align-content-center">
              <div className="m-2">
                <h3>Mis Solicitudes</h3>
                <small>Solicitudes para el almacen</small>
              </div>
              <div className="d-flex align-items-center">
                <div className="d-flex">
                  <input
                    className="form-control"
                    placeholder="Buscar..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button
                  className="btn ms-2 btn-outline-dark"
                  onClick={() => handleGoAddSolicitud()}
                >
                  <Plus className="text-auto" />
                </button>
              </div>
            </div>
            <div className="card-body p-0">
              <SolicitudesList search={search} />
            </div>
          </div>
        </div>
      </div>
    </ContenedorPrincipal>
  );
}
