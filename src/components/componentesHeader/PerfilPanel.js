import {
  BriefcaseBusiness,
  CreditCard,
  House,
  LogOut,
  ShieldCheck,
  User,
  UserRoundCog,
} from "lucide-react";
import axiosInstance from "../../api/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { useQuery } from "@tanstack/react-query";
import { GetSedes } from "../../service/accionesAreasCargos/GetSedes";
import { useEffect, useState } from "react";
import ToastAlert from "../componenteToast/ToastAlert";

export function PerfilPanel({ user, fotoPerfil }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [selectedSede, setSelectedSede] = useState("");
  const [nombreSedeActual, setNombreSedeActual] = useState("No seleccionada");

  // 🔹 Cargar usuario desde localStorage
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("user"));
    if (usuario?.idSede) {
      setSelectedSede(usuario.idSede);
      setNombreSedeActual(usuario?.sede?.nombre || "No seleccionada");
    }
  }, []);
  const rol = JSON.parse(localStorage.getItem("user"));
  const rolUsuario = rol?.empleado?.cargo?.nombre;

  // 🔹 Obtener lista de sedes
  const {
    data: sedeData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["sedes"],
    queryFn: GetSedes,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  // 🔹 Cambiar sede del usuario
  const handleChangeSede = async (idSede) => {
    setSelectedSede(idSede);
    try {
      const { data } = await axiosInstance.post("/usuario/cambiar-sede", {
        idSede,
      });

      if (data.success) {
        setNombreSedeActual(data.nombreSede);

        // 🔸 Actualizar también el localStorage con la nueva sede
        const usuario = JSON.parse(localStorage.getItem("user"));
        const updatedUser = {
          ...usuario,
          idSede,
          sede: { ...usuario.sede, nombre: data.nombreSede },
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        ToastAlert("success", "Sede cambiada correctamente");
      } else {
        ToastAlert("error", data.message);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Error inesperado al cambiar de sede";
      ToastAlert("error", message);
    }
  };

  // 🔹 Cerrar sesión
  const cerrarSession = async () => {
    try {
      await axiosInstance.post(
        "/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div>
      {/* 🔸 Perfil */}
      <div className="d-flex flex-column align-items-center">
        <img
          src={fotoPerfil}
          alt="Perfil"
          className="shadow-sm"
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid var(--brand-primary)",
          }}
        />
        <h5 className="mt-3 mb-0">{user?.name || "Usuario"}</h5>
        <small className="text-muted">{user?.email}</small>
        <span className="badge bg-dark mt-2">
          {user?.empleado?.cargo?.nombre || "Sin cargo"}
        </span>
      </div>

      <hr />

      {/* 🔸 Menú */}
      <ul className="list-unstyled px-4 mt-3">
        <li className="mb-3">
          <button
            className="btn w-100 text-start d-flex align-items-center fw-medium pb-2 border-bottom border-light"
            onClick={() => navigate("/")}
          >
            <House style={{ color: "var(--brand-primary)" }} className="me-3" height="20px" width="20px" />
            Panel Principal
          </button>
        </li>
        <li className="mb-3">
          <button
            className="btn w-100 text-start d-flex align-items-center fw-medium pb-2 border-bottom border-light"
            onClick={() => navigate("/configuracion/MiPerfil")}
          >
            <User style={{ color: "var(--brand-primary)" }} className="me-3" height="20px" width="20px" />
            Mi Perfil
          </button>
        </li>
        <li className="mb-3">
          <button 
            className="btn w-100 text-start d-flex align-items-center fw-medium pb-2 border-bottom border-light"
            onClick={() => navigate("/rr.hh/asistencia")}
          >
            <ShieldCheck style={{ color: "var(--brand-primary)" }} className="me-3" height="20px" width="20px" />
            Mis Asistencias
          </button>
        </li>
        <li className="mb-3">
          <button
            className="btn w-100 text-start d-flex align-items-center fw-medium pb-2 border-bottom border-light"
            onClick={() => navigate("/configuracion")}
          >
            <UserRoundCog style={{ color: "var(--brand-primary)" }} className="me-3" height="20px" width="20px" />
            Configuración Global
          </button>
        </li>
      </ul>

      {/* 🔸 Selector de sede */}
      {rolUsuario == "administrador" ? (
        <div className="px-4 pb-2">
          <div className="rounded-3 p-3 mb-3 shadow-sm border bg-light">
            <div className="d-flex align-items-center mb-2">
              <i className="fa-solid fa-building fa-lg me-2" style={{ color: "var(--brand-primary)" }}></i>
              <h6 className="mb-0 fw-semibold text-dark">Cambiar de Sede</h6>
            </div>

            {isLoading ? (
              <div className="text-center py-3">
                <div className="spinner-border" style={{ color: "var(--brand-primary)" }} role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : isError ? (
              <div className="alert alert-danger py-2 mb-0">
                Error al cargar las sedes
              </div>
            ) : (
              <div className="form-floating mt-2">
                <select
                  id="selectSede"
                  className="form-select border-light shadow-sm bg-body text-body"
                  style={{ borderRadius: "10px" }}
                  value={selectedSede}
                  onChange={(e) => handleChangeSede(e.target.value)}
                >
                  <option value="">Selecciona una sede</option>
                  {sedeData
                    .filter((sede) => sede.estado == 1)
                    .map((sede) => (
                      <option key={sede.id} value={sede.id}>
                        {sede.nombre}
                      </option>
                    ))}
                </select>
                <label htmlFor="selectSede">
                  <i className="fa-solid fa-map-marker-alt me-2" style={{ color: "var(--brand-primary)" }}></i>
                  Sede
                </label>
              </div>
            )}

            <div className="text-end mt-2">
              <small className="text-muted opacity-75">
                Sede actual:{" "}
                <strong className="text-dark">
                  {nombreSedeActual || "No seleccionada"}
                </strong>
              </small>
            </div>
          </div>
        </div>
      ) : null}

      <div className="px-4 pb-4 d-flex mt-auto">
        {/* 🔸 Botón de cerrar sesión */}
        <button
          className="btn btn-danger w-100 d-flex align-items-center justify-content-center mb-0 shadow-sm"
          onClick={cerrarSession}
          style={{ borderRadius: "10px" }}
        >
          <LogOut className="me-2" height="20px" width="20px" color="#fff" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
