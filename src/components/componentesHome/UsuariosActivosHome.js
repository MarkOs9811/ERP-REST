import { useQuery } from "@tanstack/react-query";
import { PeopleOutline } from "react-ionicons";
import { GetAsistencia } from "../../service/GetAsistencia";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";

export function UsuariosActivosHome() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
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
    <div className="card shadow-sm h-100 p-0">
      <div className="card-header dashboard-header d-flex justify-content-between align-items-center p-3">
        <h5 className="text-dark mb-3 d-flex align-items-center">
          Usuarios Activos
        </h5>
        <h3 className="text-dark badge rounded-pill mx-2 p-2">
          {listaAsistenciaHoy.length}
        </h3>
        <PeopleOutline
          color={"var(--accent-blue)"}
          height="40px"
          width="40px"
          className="me-2"
        />
      </div>
      <div className="card-body p-4">
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
                    textAlign: "left", // Asegura que el contenido esté alineado a la izquierda
                    padding: "10px",
                    border: "none",
                  }}
                >
                  <img
                    src={`${BASE_URL}/storage/${usuario.empleado?.empleado?.usuario?.fotoPerfil}`}
                    alt="Foto de perfil"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      border: "2px solid silver",
                      marginRight: "15px", // Espacio entre la imagen y el texto
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      {capitalizeFirstLetter(
                        usuario?.empleado?.nombre.toLowerCase()
                      )}{" "}
                      {capitalizeFirstLetter(
                        usuario?.empleado?.apellidos.toLowerCase()
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
  );
}
