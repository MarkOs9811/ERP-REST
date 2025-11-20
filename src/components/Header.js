import React, { useState } from "react";

import "../App.css";
import "../css/EstilosPanelHeader.css";
import RippleWrapper from "./componentesReutilizables/RippleWrapper";
import { PerfilPanel } from "./componentesHeader/PerfilPanel";
import { NotificacionesPanel } from "./componentesHeader/NotificacionesPanel";
import { capitalizeFirstLetter } from "../hooks/FirstLetterUp";
import { Bell, Moon, SunMediumIcon } from "lucide-react";
import ModalRight from "./componentesReutilizables/ModalRight";
export function Header() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const empresa = JSON.parse(localStorage.getItem("empresa")) || {};
  const fotoEmpresa = empresa.logo
    ? `${BASE_URL}/storage/${empresa.logo}`
    : null;
  const fotoPerfilLocal = JSON.parse(localStorage.getItem("user"));
  const user = JSON.parse(localStorage.getItem("user"));
  const cajaDetalles = JSON.parse(localStorage.getItem("caja"));
  const cargo = JSON.parse(localStorage.getItem("user")) || {};
  const fotoPerfil = `${BASE_URL}/storage/${fotoPerfilLocal.fotoPerfil}`;

  // PARA MOSTRAR LOS PANELES
  const [showPerfilPanel, setShowPerfilPanel] = useState(false);
  const [showNotificaciones, setShowNotificaciones] = useState(false);
  const notificacionesCount = 3;
  // aqui declaro variables de mi localstorage para mostrarlo en mi vista
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Cambia el tema y guarda en localStorage
  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-theme", !darkMode);
    localStorage.setItem("theme", newTheme);
  };

  // Aplica el tema al cargar
  React.useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [darkMode]);

  return (
    <header className="navbar  header-contenido p-0 m-0 border-bottom">
      <nav className="container-fluid d-flex align-items-center justify-content-center p-0 m-0">
        <div className="d-flex align-items-center justify-content-center gap-2 mx-3 ">
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

            <span className="small text-muted mb-0">
              {capitalizeFirstLetter(cargo?.empleado?.cargo?.nombre)}
            </span>
          </div>
        </div>

        {/* Icono de usuario */}
        {/* Contenedor del usuario en la barra de navegación */}
        <div className="navbar-right d-flex align-items-center ms-auto gap-2 p-0 px-4">
          {fotoPerfilLocal && (
            <RippleWrapper>
              <span type="button" className="badge bg-secondary">
                {capitalizeFirstLetter(fotoPerfilLocal?.sede?.nombre)}
              </span>
            </RippleWrapper>
          )}
          {["administrador", "atencion al cliente", "cocinero"].includes(
            cargo?.empleado?.cargo?.nombre
          ) &&
            cajaDetalles && (
              <RippleWrapper>
                <span type="button" className="badge bg-success">
                  {cajaDetalles.nombre}
                </span>
              </RippleWrapper>
            )}

          <button
            className="ico-header border-0 rounded-pill d-flex align-items-center justify-content-center"
            title="Cambiar tema"
            style={{ width: 44, height: 44, padding: 0 }}
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
          {/* Botón de Notificaciones */}
          <button
            className="ico-header border-0 rounded-pill d-flex align-items-center justify-content-center position-relative"
            style={{ width: 44, height: 44, padding: 0 }}
            onClick={() => setShowNotificaciones(true)}
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
                {notificacionesCount}
              </span>
            )}
          </button>
          <button
            className="ico-header border-0 rounded-pill d-flex align-items-center justify-content-center"
            style={{ width: 44, height: 44, padding: 0 }}
            onClick={() => setShowPerfilPanel(true)}
          >
            {fotoPerfil && (
              <img
                src={fotoPerfil}
                alt="Mi foto"
                className="img-fluid"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            )}
          </button>

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
    </header>
  );
}
