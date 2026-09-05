import React, { useEffect, useState } from "react";

import "../App.css";
import "../css/EstilosPanelHeader.css";
import RippleWrapper from "./componentesReutilizables/RippleWrapper";
import { PerfilPanel } from "./componentesHeader/PerfilPanel";
import { NotificacionesPanel } from "./componentesHeader/NotificacionesPanel";
import { capitalizeFirstLetter } from "../hooks/FirstLetterUp";
import {
  Bell,
  Expand,
  Globe,
  Menu,
  Minimize,
  Moon,
  SunMediumIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../redux/sideBarSlice";
import ModalRight from "./componentesReutilizables/ModalRight";
import { BadgeComponent } from "./componentesReutilizables/BadgeComponent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toggleSidebarMobile } from "../redux/sideBarMobilSlice";
import { GetNotificacionesPrivadas } from "../service/accionesGenerales/GetNotificacionesPrivada";
import { PutData } from "../service/CRUD/PutData";
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
  const fotoPerfil = `${fotoPerfilLocal?.foto_url}`;

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
    document.body.classList.toggle("dark-theme", !darkMode);
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

  const isCompressed = useSelector((state) => state.sidebar.isCompressed);
  // Aplica el tema al cargar
  React.useEffect(() => {
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
    <div
      className={`header-menu ${anchuraHeader ? "m-0" : ""} ${isCompressed ? "compressedHeader" : ""}`}
    >
      {" "}
      <nav className=" d-flex flex-nowrap align-items-center justify-content-between p-2 m-0">
        <div className="d-flex align-items-center justify-content-center gap-2 mx-3 ">
          {/* Botón para comprimir/expandir Sidebar */}
          <button
            className={`ico-header border-0 ${anchuraHeader ? "d-none" : "d-none d-md-inline-flex"} rounded-pill align-items-center justify-content-center bg-transparent`}
            title="Contraer Menú"
            onClick={() => dispatch(toggleSidebar())}
            style={{
              width: 44,
              height: 44,
              padding: 0,
              transition: "transform var(--transition-bounce)",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Menu className={`text-muted `} height="24px" width="24px" />
          </button>
          <button
            className={`${anchuraHeader ? "d-none" : "d-inline-flex d-md-none"} menu-ico-header-celular border-0 align-items-center justify-content-center`}
            title="Contraer Menú"
            onClick={() => dispatch(toggleSidebarMobile())}
          >
            <Menu height="24px" width="24px" />
          </button>

          <div className="logo-empresa d-flex align-items-center ">
            {cargo?.empleado?.cargo?.nombre === "atencion al cliente" ? (
              <img
                src={fotoEmpresa}
                alt="logo empresa"
                className="img-fluid"
                style={{
                  maxWidth: "40px",
                  borderRadius: "50%",
                  height: "40px",
                  objectFit: "cover",
                }}
              />
            ) : (
              ""
            )}
          </div>
          <div className="d-flex flex-column">
            <h6 className="text-muted fw-bold mb-0">
              {cargo?.empleado?.cargo?.nombre === "atencion al cliente"
                ? capitalizeFirstLetter(empresa?.nombre)
                : ""}
            </h6>
            Bienvenido
            <span className="small text-muted mb-0">
              {capitalizeFirstLetter(cargo?.empleado?.cargo?.nombre)}
            </span>
          </div>
        </div>

        {/* Icono de usuario */}
        {/* Contenedor del usuario en la barra de navegación */}
        <div className="navbar-right d-flex align-items-center ms-auto gap-2 p-0 m-0">
          {/* BOTÓN VER WEB - SOLO PARA ADMINISTRADOR */}
          {fotoPerfilLocal &&
            cargo?.empleado?.cargo?.nombre === "administrador" && (
              <RippleWrapper>
                <BadgeComponent
                  clickable={true}
                  label="Ver Web"
                  variant="info"
                  className="cursor-pointer px-2 "
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
                className="cursor-pointer px-2"
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
                className="cursor-pointer px-2"
              />
            </RippleWrapper>
          ) : null}
          {/* BOTON PARA PANTALLA COMPLETA */}
          <button
            className="ico-header btn-icon border-0 rounded-pill d-flex align-items-center justify-content-center"
            title={
              isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"
            }
            style={{
              width: 44,
              height: 44,
              padding: 0,
              transition: "transform var(--transition-bounce)",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize size={22} className="text-auto" />
            ) : (
              <Expand size={22} className="text-auto" />
            )}
          </button>
          {/* BOTON PARA CAMBIAR DE TEMA - SIEMPRE VISIBLE */}
          <button
            className="ico-header btn-icon border-0 rounded-pill d-flex align-items-center justify-content-center"
            title="Cambiar tema"
            style={{
              width: 44,
              height: 44,
              padding: 0,
              transition: "transform var(--transition-bounce)",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={toggleTheme}
          >
            {darkMode ? (
              <Moon
                className="text-auto"
                height="22px"
                width="22px"
                style={{ verticalAlign: "middle" }}
              />
            ) : (
              <SunMediumIcon
                className="text-auto"
                height="22px"
                width="22px"
                style={{ verticalAlign: "middle" }}
              />
            )}
          </button>
          {/* Botón de Notificaciones - SIEMPRE VISIBLE */}
          <button
            className="ico-header btn-icon border-0 d-flex align-items-center justify-content-center position-relative"
            style={{
              width: 44,
              height: 44,
              padding: 0,
              transition: "transform var(--transition-bounce)",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={() => {
              setShowNotificaciones(true);
              verNoticificaciones();
            }}
          >
            <Bell
              className="text-auto"
              height="22px"
              width="22px"
              style={{ cursor: "pointer" }}
            />
            {notificacionesCount > 0 && (
              <span
                className="position-absolute badge rounded-pill bg-danger"
                style={{
                  fontSize: "0.72rem",
                  minWidth: 17,
                  height: 17,
                  padding: 0,
                  right: 4,
                  top: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  zIndex: 2,
                }}
              >
                {obtenerTextoNotificacion()}
              </span>
            )}
          </button>

          <div
            className="ico-header btn-icon border-0 rounded-pill d-flex align-items-center justify-content-center"
            style={{
              width: 44,
              height: 44,
              padding: 0,
              transition: "transform var(--transition-bounce)",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={() => setShowPerfilPanel(true)}
          >
            {fotoPerfil && (
              <img
                src={fotoPerfil}
                alt="Mi foto"
                className="img-fluid w-100"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            )}
          </div>
          <ModalRight
            isOpen={showNotificaciones}
            onClose={() => setShowNotificaciones(false)}
            width={"350px"}
            hideFooter={true}
            title={"Notificaciones"}
            icono={<Bell className="text-muted" />}
          >
            <NotificacionesPanel />
          </ModalRight>

          <ModalRight
            isOpen={showPerfilPanel}
            onClose={() => setShowPerfilPanel(false)}
            width={"350px"}
            hideFooter={true}
          >
            <PerfilPanel user={user} fotoPerfil={fotoPerfil} />
          </ModalRight>
        </div>
      </nav>
    </div>
  );
}
