import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUserCircle } from "@fortawesome/free-solid-svg-icons"; // Importar los iconos que deseas usar
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../redux/sideBarSlice";

export function Header() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const fotoPerfilLocal = JSON.parse(localStorage.getItem("fotoPerfil"));
  const fotoPerfil = `${BASE_URL}/storage/${fotoPerfilLocal}`;

  // aqui declaro variables de mi localstorage para mostrarlo en mi vista
  const user = JSON.parse(localStorage.getItem("user"));
  const  dispatch=useDispatch();

 const handleSideBar = () =>{
    dispatch(toggleSidebar(false));
 }
  return (
    <header className="navbar text-dark bg-white border-bottom">
      <nav className="container-fluid d-flex align-items-center justify-content-between">
        {/* Botón de compresión de sidebar */}
        <button className="btn  me-3" onClick={()=>handleSideBar()}>
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>

        {/* Icono de usuario */}
        <div className="navbar-right d-flex align-items-center">
          <div className="">
            {/* Muestra el correo del usuario */}
            {user && user.correo ? (
              <p className="mb-0 mx-3">
                {user.empleado.persona.nombre
                  .toLowerCase() // Convierte todo a minúsculas
                  .split(" ") // Divide el nombre en palabras
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Convierte la primera letra de cada palabra a mayúscula
                  .join(" ")}{" "}
                {/* Vuelve a unir las palabras con un espacio */}
              </p>
            ) : (
              <p className="mb-0 mx-3">Correo no disponible</p>
            )}
          </div>

          <div className="d-flex align-items-center">
            {fotoPerfil && (
              <img
                src={fotoPerfil}
                alt="Mi foto"
                className="img-fluid "
                style={{
                  maxWidth: "40px",
                  borderRadius: "50%",
                  marginLeft: "10px",
                }}
              />
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
