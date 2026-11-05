import { useEffect, useState } from "react";

import RippleWrapper from "./componentesReutilizables/RippleWrapper";
import { PerfilPanel } from "./componentesHeader/PerfilPanel";
import { NotificacionesPanel } from "./componentesHeader/NotificacionesPanel";
import { capitalizeFirstLetter } from "../hooks/FirstLetterUp";
import {
  Bell,
  Expand,
  Menu,
  Minimize,
  Moon,
  SunMediumIcon,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../redux/sideBarSlice";
import ModalRight from "./componentesReutilizables/ModalRight";
import { BadgeComponent } from "./componentesReutilizables/BadgeComponent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toggleSidebarMobile } from "../redux/sideBarMobilSlice";
import { GetNotificacionesPrivadas } from "../service/accionesGenerales/GetNotificacionesPrivada";
import { PutData } from "../service/CRUD/PutData";
import { Button } from "./ui/button";
export function Header({ tipoHeader = null }) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const empresa =
    JSON.parse(
      localStorage.getItem("empresa") || sessionStorage.getItem("empresa"),
    ) || {};
  const fotoEmpresa = empresa.logo_url ? `${empresa.logo_url}` : null;
  const anchuraHeader = tipoHeader;
  const fotoPerfilLocal = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user"),
  );
  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user"),
  );
  const cajaDetalles = JSON.parse(
    localStorage.getItem("caja") || sessionStorage.getItem("caja"),
  );
  const cargo =
    JSON.parse(
      localStorage.getItem("user") || sessionStorage.getItem("user"),
    ) || {};
  const fotoPerfil = fotoPerfilLocal?.foto_url || null;

  // PARA MOSTRAR LOS PANELES
  const [showPerfilPanel, setShowPerfilPanel] = useState(false);
  const [showNotificaciones, setShowNotificaciones] = useState(false);

  // Obtener notificaciones globalmente (usando caché de react-query)
  const {
    data: todasNotificaciones = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notificacionesPrivadas"],
    queryFn: GetNotificacionesPrivadas,
  });
  // Preparamos la mutación (la petición PUT)
  const mutacionMarcarLeidas = useMutation({
    mutationFn: () =>
      PutData("notificaciones/cambiarEstado", null, { estado: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificacionesPrivadas"] });
    },
    onError: (error) => {
      console.error("Error al actualizar las notificaciones", error);
    },
  });
  const verNoticificaciones = () => {
    mutacionMarcarLeidas.mutate();
  };
  const notificacionesCount = todasNotificaciones.filter(
    (n) => n.estado == 0,
  ).length;

  // aqui declaro variables de mi localstorage para mostrarlo en mi vista
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  // Cambia el tema y guarda en localStorage
  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";
    setDarkMode(!darkMode);
    // Usa "dark" en lugar de "dark-theme" y aplícalo a <html>
    document.documentElement.classList.toggle("dark", !darkMode);
    localStorage.setItem("theme", newTheme);
  };

  // Expandir o compirmir pantalla
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreen = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreen);

    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreen);
  }, []);
  // ==========================

  // Aplica el tema al cargar
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [darkMode]);

  const obtenerTextoNotificacion = () => {
    if (isLoading) return "...";
    if (isError) return "!";
    if (notificacionesCount > 99) return "99+";

    return notificacionesCount;
  };

  return (
    <header className="w-full shrink-0 border-b border-border/70 bg-transparent text-foreground">
      <nav
        aria-label="Barra superior"
        className="flex min-h-16 w-full flex-wrap items-center justify-between gap-x-3 gap-y-2 px-3 py-2 sm:px-4"
      >
        <div className="flex min-w-0 items-center gap-2">
          {!anchuraHeader && (
            <Button
              type="button"
              aria-label="Contraer o expandir menú"
              title="Contraer o expandir menú"
              onClick={() => dispatch(toggleSidebar())}
              className="hidden size-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:inline-flex"
              variant="ghost"
            >
              <Menu size={21} />
            </Button>
          )}
          {!anchuraHeader && (
            <Button
              type="button"
              aria-label="Abrir menú"
              title="Abrir menú"
              onClick={() => dispatch(toggleSidebarMobile())}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
              variant="ghost"
            >
              <Menu size={20} />
            </Button>
          )}

          {cargo?.empleado?.cargo?.nombre === "atencion al cliente" &&
            fotoEmpresa && (
              <img
                src={fotoEmpresa}
                alt="Logo de la empresa"
                className="size-9 shrink-0 rounded-full border-border object-cover"
              />
            )}
          <div className="flex min-w-0 flex-col leading-tight">
            {cargo?.empleado?.cargo?.nombre === "atencion al cliente" && (
              <span className="truncate text-sm font-semibold">
                {capitalizeFirstLetter(empresa?.nombre)}
              </span>
            )}
            <span className="text-sm font-medium">Bienvenido</span>
            <span className="truncate text-xs text-muted-foreground">
              {capitalizeFirstLetter(cargo?.empleado?.cargo?.nombre)}
            </span>
          </div>
        </div>

        <div className="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-1 sm:gap-2">
          {fotoPerfilLocal &&
            cargo?.empleado?.cargo?.nombre === "administrador" && (
              <RippleWrapper>
                <BadgeComponent
                  clickable={true}
                  label="Ver Web"
                  variant="default"
                  className="cursor-pointer px-2"
                  onClick={() =>
                    window.open(
                      "https://lustrous-cupcake-b9cf4a.netlify.app/",
                      "_blank",
                    )
                  }
                />
              </RippleWrapper>
            )}
          {fotoPerfilLocal && (
            <RippleWrapper>
              <BadgeComponent
                label={capitalizeFirstLetter(fotoPerfilLocal?.sede?.nombre)}
                variant="danger"
                className="hidden cursor-pointer px-2 sm:inline-flex"
              />
            </RippleWrapper>
          )}
          {["administrador", "atencion al cliente", "cocinero"].includes(
            cargo?.empleado?.cargo?.nombre,
          ) && Boolean(cajaDetalles?.nombre) ? (
            <RippleWrapper>
              <BadgeComponent
                label={cajaDetalles.nombre}
                variant="success"
                className="hidden cursor-pointer px-2 sm:inline-flex"
              />
            </RippleWrapper>
          ) : null}

          <Button
            type="button"
            variant="ghost"
            aria-label={
              isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"
            }
            title={
              isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"
            }
            onClick={toggleFullscreen}
            className="cursor-pointer inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isFullscreen ? <Minimize size={19} /> : <Expand size={19} />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            aria-label="Cambiar tema"
            title="Cambiar tema"
            onClick={toggleTheme}
            className="cursor-pointer inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {darkMode ? <Moon size={19} /> : <SunMediumIcon size={20} />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            aria-label="Ver notificaciones"
            title="Notificaciones"
            onClick={() => {
              setShowNotificaciones(true);
              verNoticificaciones();
            }}
            className="cursor-pointer relative inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Bell size={19} />
            {notificacionesCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.25 min-w-4.25 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-white">
                {obtenerTextoNotificacion()}
              </span>
            )}
          </Button>

          <Button
            type="button"
            aria-label="Abrir perfil"
            title="Mi perfil"
            variant="ghost"
            onClick={() => setShowPerfilPanel(true)}
            className="cursor-pointer inline-flex size-9 items-center justify-center overflow-hidden rounded-full border-border bg-muted transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {fotoPerfil && (
              <img src={fotoPerfil} alt="" className="size-full object-cover" />
            )}
          </Button>

          <ModalRight
            isOpen={showNotificaciones}
            onClose={() => setShowNotificaciones(false)}
            width={"350px"}
            hideFooter={true}
            title={"Notificaciones"}
            icono={<Bell className="text-muted-foreground" />}
          >
            <NotificacionesPanel />
          </ModalRight>

          <ModalRight
            isOpen={showPerfilPanel}
            onClose={() => setShowPerfilPanel(false)}
            width={"390px"}
            hideFooter={true}
            title="Mi cuenta"
            subtitulo="Tu perfil y accesos personales"
          >
            <PerfilPanel user={user} fotoPerfil={fotoPerfil} />
          </ModalRight>
        </div>
      </nav>
    </header>
  );
}
