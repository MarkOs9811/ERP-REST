import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUserCircle } from "@fortawesome/free-solid-svg-icons"; // Importar los iconos que deseas usar
import { useDispatch } from "react-redux";

import "../App.css";
import { NotificationsOutline } from "react-ionicons";
export function Header() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const fotoPerfilLocal = JSON.parse(localStorage.getItem("fotoPerfil"));
  const fotoPerfil = `${BASE_URL}/storage/${fotoPerfilLocal}`;

  // aqui declaro variables de mi localstorage para mostrarlo en mi vista
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <header className="navbar border-bottom header-contenido p-0 m-0">
      <nav className="container-fluid d-flex align-items-center justify-content-between p-0 m-0">
        {/* Botón de compresión de sidebar */}
        <div className="p-0 m-0">
          <h5 className="mx-2 p-0 text-dark">Fire Wok</h5>
        </div>

        {/* Icono de usuario */}
        {/* Contenedor del usuario en la barra de navegación */}
        <div className="navbar-right d-flex align-items-center ms-auto gap-3 p-0 px-3">
          <button className="btn text-dark">
            {/* Icono de Notificaciones */}
            <NotificationsOutline
              color={"auto"}
              style={{ fontSize: "1.5rem", cursor: "pointer" }}
            />
          </button>

          {/* Muestra el correo del usuario */}
          {user && user.correo ? (
            <p className="mb-0 text-capitalize text-dark">
              {user.empleado.persona.nombre
                .toLowerCase() // Convierte todo a minúsculas
                .split(" ") // Divide el nombre en palabras
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza cada palabra
                .join(" ")}
            </p>
          ) : (
            <p className="mb-0">Correo no disponible</p>
          )}

          {/* Foto de Perfil */}
          {fotoPerfil && (
            <img
              src={fotoPerfil}
              alt="Mi foto"
              className="img-fluid"
              style={{
                maxWidth: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          )}
        </div>
      </nav>
    </header>
  );
}
