import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CajasList } from "../../components/componentesModuloVentas/CajasList";
import { useState } from "react";
import { RegistroCajas } from "../../components/componentesModuloVentas/RegistrosCajasList";
import { AddOutline } from "react-ionicons";

export function Cajas() {
  const [search, setSearch] = useState("");
  return (
    <div className="container-fluid w-100 h-100 p-0">
      <div className="card bg-transparent  my-0 flex-grow-1 h-100 d-flex flex-column p-0">
        <div
          className="card-body overflow-y-auto overflow-x-hidden p-0 pe-2"
          style={{ height: "calc(100vh - 480px)" }}
        >
          <div className="row g-2">
            <div className="col-lg-12 col-sm-12">
              <div className="card shadow-sm overflow-hidden">
                <div className="card-header">
                  <div className="container-fluid">
                    <div className="row align-items-center">
                      {/* Título de la lista */}
                      <div className="col-12 col-md-6 mb-3 mb-md-0">
                        <h3 className="text-center text-md-start">
                          Lista Caja
                        </h3>
                      </div>

                      {/* Input de búsqueda y botón */}
                      <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-center justify-content-md-end">
                        <button className="btn  ms-0 ms-md-2">
                          <AddOutline color={"auto"} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body p-2">
                  <CajasList />
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-sm-12">
              <div className="card shadow-sm overflow-hidden">
                <div className="card-header">
                  <div className="container-fluid">
                    <div className="row align-items-center">
                      {/* Título de la lista */}
                      <div className="col-12 col-md-6 mb-3 mb-md-0">
                        <h3 className="text-center text-md-start">
                          Registros Caja
                        </h3>
                      </div>

                      {/* Input de búsqueda y botón */}
                      <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-center justify-content-md-end">
                        <input
                          type="search"
                          className="form-control mb-3 mb-md-0"
                          placeholder="Buscar..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body p-0">
                  <RegistroCajas search={search} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
