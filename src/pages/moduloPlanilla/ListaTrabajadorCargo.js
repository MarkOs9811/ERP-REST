import { useQuery } from "@tanstack/react-query";
import { GetCargos } from "../../service/GetCargos";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";

import { useNavigate } from "react-router-dom";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import {
  BriefcaseBusiness,
  ChevronRight,
  User,
  UsersRound,
} from "lucide-react";

export function ListaTrabajadorCargo() {
  const navigate = useNavigate();
  const {
    data: listaCargos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cargos"],
    queryFn: GetCargos,
  });

  const handleClickCargo = (cargo) => {
    navigate(`/rr-hh/planilla/listaTrabajador/${cargo.id}`);
  };

  // Función para obtener un icono según el cargo
  const getIconForCargo = (nombreCargo) => {
    const lowerName = nombreCargo.toLowerCase();
    if (lowerName.includes("gerente") || lowerName.includes("jefe")) {
      return <BriefcaseBusiness color={"auto"} height="30px" width="30px" />;
    }
    return <User color={"auto"} height="30px" width="30px" />;
  };

  return (
    <ContenedorPrincipal>
      <div className="row g-3 ">
        {isLoading && <p>Cargando cargos...</p>}
        {isError && <p>Error al cargar los cargos.</p>}

        {listaCargos &&
          listaCargos.map((cargo) => (
            <div
              key={cargo.id}
              className=" col-lg-4 col-md-6 col-sm-12 p-2 d-flex justify-content-center"
            >
              <div
                className="card p-0 w-100 btn text-center card-cargo shadow-sm overflow-hidden"
                style={{
                  cursor: "pointer",
                  transition: "0.3s",
                  border: "none",
                  borderRadius: "12px",
                }}
                onClick={() => handleClickCargo(cargo)}
              >
                {/* Nuevo diseño interno de la tarjeta */}
                <div className="card-body p-0">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 ">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-muted bg-opacity- p-2 rounded-circle">
                          {getIconForCargo(cargo.nombre)}
                        </div>
                        <div className="text-start">
                          <h3 className="mb-0 text-dark fw-bold">
                            {capitalizeFirstLetter(cargo.nombre)}
                          </h3>
                          <small className="d-flex align-items-center gap-1">
                            <UsersRound
                              color={"auto"}
                              height="16px"
                              width="16px"
                            />
                            {cargo.empleados?.length ?? 0} trabajador(es)
                          </small>
                        </div>
                      </div>
                      <ChevronRight color="auto" height="20px" width="20px" />
                    </div>
                  </div>
                  <div className="p-3 bg-light">
                    <small className="text-muted">
                      Haz clic para ver detalles
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </ContenedorPrincipal>
  );
}
