import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  House,
  LogOut,
  MapPin,
  ShieldCheck,
  User,
  UserRoundCog,
} from "lucide-react";
import axiosInstance from "../../api/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { useQuery } from "@tanstack/react-query";
import { GetSedes } from "../../service/accionesAreasCargos/GetSedes";
import { useState } from "react";
import ToastAlert from "../componenteToast/ToastAlert";
import { Button } from "../ui/button";

export function PerfilPanel({ user, fotoPerfil }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [selectedSede, setSelectedSede] = useState(user?.idSede ?? "");
  const [nombreSedeActual, setNombreSedeActual] = useState(
    user?.sede?.nombre || "No seleccionada",
  );
  const rolUsuario = user?.empleado?.cargo?.nombre;

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

        const storage = localStorage.getItem("user")
          ? localStorage
          : sessionStorage;
        const usuario = JSON.parse(storage.getItem("user") || "{}");
        const updatedUser = {
          ...usuario,
          idSede,
          sede: { ...usuario.sede, nombre: data.nombreSede },
        };
        storage.setItem("user", JSON.stringify(updatedUser));

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
    <div className="flex min-h-full flex-col">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-14 size-36 rounded-full bg-primary/10 blur-2xl"
        />
        <div className="relative mx-auto flex size-20 items-center justify-center overflow-hidden rounded-full bg-muted ring-4 ring-background shadow-md">
          {fotoPerfil ? (
            <img
              src={fotoPerfil}
              alt={`Foto de ${user?.name || "usuario"}`}
              className="size-full object-cover"
            />
          ) : (
            <User className="size-9 text-muted-foreground" />
          )}
        </div>
        <h2 className="relative mt-3 truncate text-base font-semibold tracking-tight text-foreground">
          {user?.name || "Usuario"}
        </h2>
        <p className="relative mt-1 truncate text-xs text-muted-foreground">
          {user?.email}
        </p>
        <span className="relative mt-3 inline-flex max-w-full items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <BriefcaseBusiness className="size-3.5 shrink-0" />
          <span className="truncate">
            {rolUsuario || "Sin cargo"}
          </span>
        </span>
      </section>

      <nav className="mt-5 space-y-1.5" aria-label="Opciones de perfil">
        <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Accesos rapidos
        </p>
        {[
          { label: "Panel principal", icon: House, path: "/" },
          { label: "Mi perfil", icon: User, path: "/configuracion/MiPerfil" },
          {
            label: "Mis asistencias",
            icon: ShieldCheck,
            path: "/rrhh/asistencia",
          },
          {
            label: "Configuracion global",
            icon: UserRoundCog,
            path: "/configuracion",
          },
        ].map(({ label, icon: Icon, path }) => (
          <Button
            key={path}
            type="button"
            variant="ghost"
            onClick={() => navigate(path)}
            className="group h-11 w-full justify-start gap-3 rounded-xl px-3 text-sm font-medium text-foreground hover:bg-accent"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-background group-hover:text-primary">
              <Icon className="size-4" />
            </span>
            {label}
            <ArrowUpRight className="ml-auto size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </Button>
        ))}
      </nav>

      {rolUsuario === "administrador" && (
        <section className="mt-5 rounded-2xl border border-border bg-muted/40 p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-background text-primary shadow-sm">
              <Building2 className="size-4" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-foreground">
                Cambiar de sede
              </h3>
              <p className="text-xs text-muted-foreground">
                Selecciona una ubicacion
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
              <span
                className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
                role="status"
              />
              Cargando sedes...
            </div>
          ) : isError ? (
            <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              Error al cargar las sedes.
            </p>
          ) : (
            <>
              <select
                id="selectSede"
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                value={selectedSede}
                onChange={(event) => handleChangeSede(event.target.value)}
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
              <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3.5" />
                Actual:{" "}
                <span className="truncate font-medium text-foreground">
                  {nombreSedeActual || "No seleccionada"}
                </span>
              </p>
            </>
          )}
        </section>
      )}

      <div className="mt-auto pt-6">
        <Button
          type="button"
          className="h-11 w-full justify-center gap-2 rounded-xl shadow-sm"
          onClick={cerrarSession}
          variant="destructive"
        >
          <LogOut className="size-4" />
          Cerrar sesion
        </Button>
      </div>
    </div>
  );
}
