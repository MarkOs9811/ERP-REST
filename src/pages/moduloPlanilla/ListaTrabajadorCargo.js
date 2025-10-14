import { useQuery } from "@tanstack/react-query";
import { GetCargos } from "../../service/GetCargos";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";

import { useNavigate } from "react-router-dom";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { IdCard, UserCheck2, Users } from "lucide-react";
import { Usuarios } from "../Usuarios";

export function ListaTrabajadorCargo() {
  return (
    <ContenedorPrincipal>
      <div className="row gap-2 w-100 m-auto d-flex justify-content-center">
        <div className="col-md-12 row g-3 my-0">
          {/* Total de Usuarios */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 stats-card">
              <div className="card-body d-flex align-items-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "55px",
                    height: "55px",
                    background: "#e9f2ff",
                  }}
                >
                  <Users className="text-primary" size={26} />
                </div>
                <div>
                  <h6 className="fw-bold text-muted mb-1">Total de Usuarios</h6>
                  {/* <p className="h4 fw-bold text-dark mb-0">{totalUsuarios}</p> */}
                </div>
              </div>
            </div>
          </div>

          {/* Usuarios Activos */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 stats-card">
              <div className="card-body d-flex align-items-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "55px",
                    height: "55px",
                    background: "#e6f9f0",
                  }}
                >
                  <UserCheck2 className="text-success" size={26} />
                </div>
                <div>
                  <h6 className="fw-bold text-muted mb-1">Usuarios Activos</h6>
                  <p className="h4 fw-bold text-dark mb-0">
                    {/* {totalUsuariosActivos} */}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cuentas Manuales */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 stats-card">
              <div className="card-body d-flex align-items-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "55px",
                    height: "55px",
                    background: "#fff3e6",
                  }}
                >
                  <IdCard className="text-warning" size={26} />
                </div>
                <div>
                  <h6 className="fw-bold text-muted mb-1">Cuentas Manuales</h6>
                  <p className="h4 fw-bold text-dark mb-0">
                    {/* {usuariosCunetasManuales} */}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <Usuarios />
        </div>
      </div>
    </ContenedorPrincipal>
  );
}
