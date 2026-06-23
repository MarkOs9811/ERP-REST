import { useQuery } from "@tanstack/react-query";
import { GetAsistencia } from "../../service/GetAsistencia";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";
import { UserRound } from "lucide-react";

export function UsuariosActivosHome() {
  const navigate = useNavigate(); // Inicializa useNavigate

  const {
    data: usuariosActivos = [],
    isLoading: isLoadingUsuarios,
    isError: isErrorUsuarios,
  } = useQuery({
    queryKey: ["usuariosActivos"],
    queryFn: GetAsistencia,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const listaAsistenciaHoy = usuariosActivos?.listaAsistenciaHoy || [];

  return (
    <CondicionCarga isLoading={isLoadingUsuarios} isError={isErrorUsuarios}>
      <div className="card h-100 p-0 overflow-auto">
        <div className="card-header d-flex m-0 align-middle justify-content-left p-3 border-bottom">
          <span
            className="p-2 mb-0 rounded-circle bg-opacity-10 text-white"
            style={{ background: "var(--fw-strawberry)" }}
          >
            <UserRound />
          </span>
          <h6 className="mb-1 d-flex flex-column gap-1">
            <span className="fw-bold text-dark">Usuarios activos</span>
            <p className="text-muted small mb-0">{listaAsistenciaHoy.length}</p>
          </h6>
        </div>
        <div className="p-3">
          {isLoadingUsuarios ? (
            <p className="text-muted">Cargando usuarios...</p>
          ) : isErrorUsuarios ? (
            <p className="text-danger">Error al cargar los usuarios.</p>
          ) : listaAsistenciaHoy.length > 0 ? (
            <>
              <ul className="mt-3">
                {listaAsistenciaHoy.slice(0, 4).map((usuario) => (
                  <li
                    key={usuario.id}
                    className="list-group-item d-flex align-items-center"
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      border: "none",
                    }}
                  >
                    <img
                      src={`${usuario.empleado?.empleado?.usuario?.foto_url}`}
                      alt="Foto de perfil"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        border: "2px solid silver",
                        marginRight: "15px",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p className="fw-bold mb-0 text-dark">
                        {capitalizeFirstLetter(
                          usuario?.empleado?.nombre.toLowerCase(),
                        )}{" "}
                        {capitalizeFirstLetter(
                          usuario?.empleado?.apellidos.toLowerCase(),
                        )}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              {listaAsistenciaHoy.length > 4 && (
                <div className="d-flex align-items-center mt-2">
                  <p className="text-muted mb-0">
                    +{listaAsistenciaHoy.length - 4} más...
                  </p>
                  <button
                    className="btn btn-link text-primary ms-2 p-0"
                    onClick={() => navigate("/rr.hh/asistencia")}
                    style={{
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Ver todos
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-muted">No hay usuarios activos hoy.</p>
          )}
        </div>
      </div>
    </CondicionCarga>
  );
}
