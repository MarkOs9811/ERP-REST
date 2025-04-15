import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SolicitudesList } from "../../components/componentesModuloVentas/SolicitudesList";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Solicitud() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const handleGoAddSolicitud = () => {
    navigate("/ventas/solicitud/realizarSolicitud");
  };
  return (
    <div className="container-fluid w-100 h-100 p-0">
      <div className="card bg-transparent  my-0 flex-grow-1 h-100 d-flex flex-column p-0">
        <div
          className="card-body overflow-y-auto overflow-x-hidden p-0 pe-2"
          style={{ height: "calc(100vh - 480px)" }}
        >
          <div className="row g-2">
            <div className="col-lg-12">
              <div className="card shadow-sm">
                <div className="card-header border-bottom d-flex justify-content-between align-content-center">
                  <div className="m-2">
                    <h3>Mis Solicitudes</h3>
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
                      className="btn ms-2"
                      onClick={() => handleGoAddSolicitud()}
                    >
                      <FontAwesomeIcon icon={faPlus} className="icon" />
                    </button>
                  </div>
                </div>
                <div className="card-body p-0">
                  <SolicitudesList search={search} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
