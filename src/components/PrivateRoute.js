import React from "react";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Extrae los nombres de los roles del usuario
  const rolesUsuario = Array.isArray(user?.roles)
    ? user.roles.map((rol) => rol.nombre)
    : [];

  // Si se pasan roles permitidos, verifica que el usuario tenga alguno
  const tieneAcceso =
    !allowedRoles || allowedRoles.some((rol) => rolesUsuario.includes(rol));

  if (!token) return <Navigate to="/login" />;
  if (!tieneAcceso) return <Navigate to="/errorVista" />;

  return children;
};
