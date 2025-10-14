import { useQuery } from "@tanstack/react-query";
import { GetSedes } from "../../../service/accionesAreasCargos/GetSedes";

import { Spinner } from "react-bootstrap";
import {
  Building2,
  CheckCheck,
  EllipsisVertical,
  MapPin,
  MinusCircle,
  Phone,
  Plus,
} from "lucide-react";

export function Sedes() {
  const {
    data: sedes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["sedes"],
    queryFn: GetSedes,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" />
        <p className="text-muted mt-2">Cargando sedes...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-danger text-center mt-4">Error al cargar las sedes.</p>
    );
  }

  return (
    <div className="row g-4">
      {sedes.map((sede, i) => (
        <div className="col-md-6 col-lg-4" key={i}>
          <div className="card shadow-sm border-0 h-100 position-relative p-3">
            <div className="card-body">
              <div className="position-absolute top-0 end-0 p-2 dropdown">
                <button
                  className="btn btn-sm btn-light border-0"
                  type="button"
                  id={`dropdownMenuButton-${i}`}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <EllipsisVertical
                    className="text-auto"
                    width="20px"
                    height="20px"
                  />
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby={`dropdownMenuButton-${i}`}
                >
                  {sede.estado == 0 && (
                    <li>
                      <a className="dropdown-item text-dark" href="#">
                        Activar
                      </a>
                    </li>
                  )}
                  <li>
                    <a className="dropdown-item text-dark" href="#">
                      Editar
                    </a>
                  </li>
                  {sede.estado == 1 && (
                    <li>
                      <a className="dropdown-item text-dark" href="#">
                        Desactivar
                      </a>
                    </li>
                  )}
                </ul>
              </div>

              <h5 className="card-title d-flex align-items-center gap-2">
                <Building2 className="text-auto" height="20px" width="20px" />
                {sede.nombre}
              </h5>
              <p className="card-text mb-1 d-flex align-items-center gap-2">
                <MapPin className="text-auto" height="18px" width="18px" />
                {sede.direccion}
              </p>
              <p className="card-text mb-1 d-flex align-items-center gap-2">
                <Phone className="text-auto" height="18px" width="18px" />
                {sede.telefono}
              </p>
              <p className="card-text mb-2 text-muted">
                Código: <strong>{sede.codigo}</strong>
              </p>
              <div className="d-flex justify-content-between align-items-center">
                <span
                  className={`badge ${
                    sede.estado == 1 ? "bg-success" : "bg-secondary"
                  }`}
                >
                  {sede.estado == 1 ? (
                    <>
                      <CheckCheck height="18px" width="18px" color="white" />{" "}
                      Activado
                    </>
                  ) : (
                    <>
                      <MinusCircle height="18px" width="18px" color="white" />{" "}
                      Desactivado
                    </>
                  )}
                </span>
                {sede.estado == 0 && (
                  <button className="btn btn-outline-success btn-sm">
                    Activar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Botón grande de "MÁS" */}
      <div className="col-md-6 col-lg-4">
        <div className="card h-100 border-0 shadow-sm d-flex align-items-center justify-content-center p-4">
          <button className="btn btn-add  btn-lg w-100 h-100">
            <Plus color={"auto"} /> Agregar Sede
          </button>
        </div>
      </div>
    </div>
  );
}
