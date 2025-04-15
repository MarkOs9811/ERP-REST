import { useQuery } from "@tanstack/react-query";
import { GetCargos } from "../../service/GetCargos";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import {
  PersonOutline,
  PeopleOutline,
  BriefcaseOutline,
  ChevronForwardOutline,
} from "react-ionicons";
import { useNavigate } from "react-router-dom";

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
    navigate(`/rr.hh/planilla/listaTrabajador/${cargo.id}`);
  };

  // Función para obtener un icono según el cargo
  const getIconForCargo = (nombreCargo) => {
    const lowerName = nombreCargo.toLowerCase();
    if (lowerName.includes("gerente") || lowerName.includes("jefe")) {
      return <BriefcaseOutline color={"auto"} height="30px" width="30px" />;
    }
    return <PersonOutline color={"auto"} height="30px" width="30px" />;
  };

  return (
    <div className="container-fluid w-100 h-100 p-0">
      <div className="card bg-transparent my-0 flex-grow-1 h-100 d-flex flex-column p-0 m-0">
        <div
          className="card-body overflow-y-auto overflow-x-hidden p-0 pe-2 d-flex justify-content-center align-items-center flex-wrap"
          style={{ height: "calc(100vh - 280px)" }}
        >
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
                            <div className="bg-white bg-opacity-20 p-2 rounded-circle">
                              {getIconForCargo(cargo.nombre)}
                            </div>
                            <div className="text-start">
                              <h3 className="mb-0 text-dark fw-bold">
                                {capitalizeFirstLetter(cargo.nombre)}
                              </h3>
                              <small className="d-flex align-items-center gap-1">
                                <PeopleOutline
                                  color={"auto"}
                                  height="16px"
                                  width="16px"
                                />
                                {cargo.empleados?.length ?? 0} trabajador(es)
                              </small>
                            </div>
                          </div>
                          <ChevronForwardOutline
                            color="auto"
                            height="20px"
                            width="20px"
                          />
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
        </div>
      </div>
    </div>
  );
}
