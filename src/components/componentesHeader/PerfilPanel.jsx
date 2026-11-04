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
import { Button } from "../ui/button";

export function PerfilPanel({ user, fotoPerfil }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [selectedSede, setSelectedSede] = useState("");
  const [nombreSedeActual, setNombreSedeActual] = useState("No seleccionada");

  // 🔹 Cargar usuario desde localStorage
  useEffect(() => {
    const usuario = JSON.parse(
      localStorage.getItem("user") || sessionStorage.getItem("user"),
    );
    if (usuario?.idSede) {
      setSelectedSede(usuario.idSede);
      setNombreSedeActual(usuario?.sede?.nombre || "No seleccionada");
    }
  }, []);
  const rol = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user"),
  );
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

  // Cerrar sesión
  const cerrarSession = async () => {
    try {
      // 1. Buscamos el token en cualquiera de las dos bóvedas
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      await axiosInstance.post(
        "/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Usamos la variable dinámica
          },
        },
      );

      logout(); // Esto ya limpia ambos storages gracias a la corrección anterior
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Incluso si el backend falla, forzamos la limpieza local para que no se quede pegado
      logout();
      navigate("/login");
    }
  };

  return (
    <div>
      {/* 🔸 Perfil */}
      <div className="flex flex-col items-center">
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
        <small className="text-muted-foreground">{user?.email}</small>
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors bg-foreground mt-2">
          {user?.empleado?.cargo?.nombre || "Sin cargo"}
        </span>
      </div>

      <hr />

      {/* 🔸 Menú */}
      <ul className="m-0 list-none p-0 px-4 mt-3">
        <li className="mb-3">
          <Button
            className="whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 w-full justify-start flex items-center gap-3 font-medium pb-2 border-b border-light"
            onClick={() => navigate("/")}
            variant="default"
          >
            <House
              style={{ color: "var(--brand-primary)" }}
              height="20px"
              width="20px"
            />
            Panel Principal
          </Button>
        </li>

        <li className="mb-3">
          <Button
            className="whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 w-full justify-start flex items-center gap-3 font-medium pb-2 border-b border-light"
            onClick={() => navigate("/configuracion/MiPerfil")}
            variant="default"
          >
            <User
              style={{ color: "var(--brand-primary)" }}
              height="20px"
              width="20px"
            />
            Mi Perfil
          </Button>
        </li>

        <li className="mb-3">
          <Button
            className="whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 w-full justify-start flex items-center gap-3 font-medium pb-2 border-b border-light"
            onClick={() => navigate("/rr.hh/asistencia")}
            variant="default"
          >
            <ShieldCheck
              style={{ color: "var(--brand-primary)" }}
              height="20px"
              width="20px"
            />
            Mis Asistencias
          </Button>
        </li>

        <li className="mb-3">
          <Button
            className="whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 w-full justify-start flex items-center gap-3 font-medium pb-2 border-b border-light"
            onClick={() => navigate("/configuracion")}
            variant="default"
          >
            <UserRoundCog
              style={{ color: "var(--brand-primary)" }}
              height="20px"
              width="20px"
            />
            Configuración Global
          </Button>
        </li>
      </ul>
      {/* 🔸 Selector de sede */}
      {rolUsuario == "administrador" ? (
        <div className="px-4 pb-2">
          <div className="rounded-md p-3 mb-3 shadow-sm bg-muted">
            <div className="flex items-center mb-2">
              <i
                className="fa-solid fa-building fa-lg me-2"
                style={{ color: "var(--brand-primary)" }}
              ></i>
              <h6 className="mb-0 font-semibold text-foreground">
                Cambiar de Sede
              </h6>
            </div>

            {isLoading ? (
              <div className="text-center py-3">
                <div
                  className="inline-block size-5 animate-spin rounded-full border-2 border-current border-r-transparent"
                  style={{ color: "var(--brand-primary)" }}
                  role="status"
                >
                  <span className="sr-only">Cargando...</span>
                </div>
              </div>
            ) : isError ? (
              <div className="relative w-full rounded-lg px-4 text-sm border-destructive/30 bg-destructive/10 text-destructive py-2 mb-0">
                Error al cargar las sedes
              </div>
            ) : (
              <div className="mt-2">
                <select
                  id="selectSede"
                  className="h-9 w-full appearance-auto rounded-md px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-light shadow-sm bg-body text-foreground"
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
              </div>
            )}

            <div className="text-right mt-2">
              <small className="text-muted-foreground opacity-75">
                Sede actual:{" "}
                <strong className="text-foreground">
                  {nombreSedeActual || "No seleccionada"}
                </strong>
              </small>
            </div>
          </div>
        </div>
      ) : null}

      <div className="px-4 pb-4 flex mt-auto">
        {/* 🔸 Botón de cerrar sesión */}
        <Button
          className="gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full flex items-center justify-center mb-0 shadow-sm"
          onClick={cerrarSession}
          style={{ borderRadius: "10px" }}
          variant="destructive"
        >
          <LogOut className="me-2" height="20px" width="20px" color="#fff" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
