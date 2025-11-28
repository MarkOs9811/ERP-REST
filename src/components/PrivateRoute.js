import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  // 1. Extraer los roles (módulos) normales
  let rolesUsuario = Array.isArray(user?.roles)
    ? user.roles.map((rol) => rol.nombre.toLowerCase()) // Convertimos a minúsculas por seguridad
    : [];

  // 2. CORRECCIÓN PRINCIPAL: Agregar el Cargo como si fuera un rol más
  if (user?.empleado?.cargo?.nombre) {
    rolesUsuario.push(user.empleado.cargo.nombre.toLowerCase());
  }

  // Ahora rolesUsuario será: ['incidencias', 'vender', 'administrador']

  // 3. Validación (Normalizamos allowedRoles también)
  const tieneAcceso =
    !allowedRoles ||
    allowedRoles.some((rol) => rolesUsuario.includes(rol.toLowerCase()));

  // Debug (puedes borrarlo luego)
  // console.log("Roles Totales del Usuario:", rolesUsuario);
  // console.log("Roles Permitidos:", allowedRoles);

  if (!token) return <Navigate to="/login" />;
  if (!tieneAcceso) return <Navigate to="/errorVista" />;

  return children;
};
