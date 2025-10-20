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

export function PerfilPanel({ user, fotoPerfil }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
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
      <div className="d-flex flex-column align-items-center">
        <img
          src={fotoPerfil}
          alt="Perfil"
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #2196f3",
          }}
        />
        <h5 className="mt-3 mb-0">{user?.name || "Usuario"}</h5>
        <small className="text-muted">{user?.email}</small>
        <span className="badge bg-dark mt-2">
          {user?.empleado?.cargo?.nombre}
        </span>
      </div>
      <hr />
      <ul className="list-unstyled px-4">
        <li className="mb-3">
          <button
            className="btn w-100 text-start d-flex align-items-center"
            onClick={() => navigate("/")}
          >
            <House className="text-auto me-1" height="20px" width="20px" />
            Inicio
          </button>
        </li>
        <li className="mb-3">
          <button
            className="btn w-100 text-start d-flex align-items-center"
            onClick={() => navigate("/configuracion/MiPerfil")}
          >
            <User className="text-auto me-1" height="20px" width="20px" />
            Mi Perfil
          </button>
        </li>
        <li className="mb-3">
          <button className="btn w-100 text-start d-flex align-items-center">
            <BriefcaseBusiness
              className="text-auto me-1"
              height="20px"
              width="20px"
            />
            Proyectos <span className="badge bg-danger ms-2">3</span>
          </button>
        </li>
        <li className="mb-3">
          <button className="btn w-100 text-start d-flex align-items-center">
            <CreditCard className="text-auto me-1" height="20px" width="20px" />
            Suscripción
          </button>
        </li>
        <li className="mb-3">
          <button className="btn w-100 text-start d-flex align-items-center">
            <ShieldCheck
              className="text-auto me-1"
              height="20px"
              width="20px"
            />
            Seguridad
          </button>
        </li>
        <li className="mb-3">
          <button
            className="btn w-100 text-start d-flex align-items-center"
            onClick={() => navigate("/configuracion")}
          >
            <UserRoundCog
              className="text-auto me-1"
              height="20px"
              width="20px"
            />
            Ajustes de cuenta
          </button>
        </li>
      </ul>
      <div className="p-4">
        <div
          className="rounded-3 p-3 mb-3"
          style={{ background: "linear-gradient(90deg,#f7b42c,#fc575e)" }}
        >
          <div className="text-white fw-bold mb-2">35% OFF</div>
          <div className="text-white small">¡Potencia tu productividad!</div>
        </div>
        <button
          className="btn btn-danger w-100 d-flex align-items-center justify-content-center"
          onClick={cerrarSession}
        >
          <LogOut
            className="text-auto me-1"
            height="20px"
            width="20px"
            color="#fff"
          />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
