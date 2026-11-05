import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GetConfi } from "../service/accionesConfiguracion/GetConfi";
import {
  hasModuleAccess,
  isRestaurantBusiness,
} from "../utils/modulePermissions";

export const PrivateRoute = ({
  children,
  allowedRoles,
  requiredModule,
  restaurantOnly = false,
}) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const userString =
    localStorage.getItem("user") || sessionStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const {
    data: configurations = [],
    isLoading: isLoadingConfigurations,
    isError: configurationError,
  } = useQuery({
    queryKey: ["confiEmpresa"],
    queryFn: GetConfi,
    enabled: restaurantOnly,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const rolesUsuario = Array.isArray(user?.roles)
    ? user.roles.map((role) =>
        String(typeof role === "string" ? role : role?.nombre ?? role?.name ?? "")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase(),
      )
    : [];
  if (user?.empleado?.cargo?.nombre) {
    rolesUsuario.push(
      user.empleado.cargo.nombre
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase(),
    );
  }

  const tieneAcceso =
    !allowedRoles ||
    allowedRoles.some((role) =>
      rolesUsuario.includes(
        role
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase(),
      ),
    );

  if (!token) return <Navigate to="/login" />;
  if (requiredModule && !hasModuleAccess(user, requiredModule)) {
    return <Navigate to="/errorVista" replace />;
  }
  if (restaurantOnly && isLoadingConfigurations) {
    return (
      <div className="p-6 text-sm text-muted-foreground" role="status">
        Verificando la configuración del negocio...
      </div>
    );
  }
  if (restaurantOnly && configurationError) {
    return <Navigate to="/errorVista" replace />;
  }
  if (restaurantOnly && !isRestaurantBusiness(configurations)) {
    return <Navigate to="/errorVista" replace />;
  }
  if (!tieneAcceso) return <Navigate to="/errorVista" />;

  return children ?? <Outlet />;
};
