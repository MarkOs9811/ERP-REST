// CajaProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useCaja } from "../../src/CajaContext";
import { useAuth } from "../AuthContext"; // Asegúrate de que la ruta sea correcta
import { useQuery } from "@tanstack/react-query";
import { GetVerificacionCaja } from "../service/accionesVender/GetVerificacionCaja";

export const CajaProtectedRoute = ({ children }) => {
  const { caja } = useCaja();
  const { user } = useAuth();

  // 1. Identificamos el rol del usuario
  const nombreCargo = user?.empleado?.cargo?.nombre?.toLowerCase() || "";

  // Lista de roles que NO tienen permiso para abrir caja (reutilizamos la lógica anterior)
  const palabrasBloqueadas = [
    "mozo",
    "moso",
    "meser",
    "atencion",
    "delivery",
    "cocin",
  ];
  const esRolSinPermisoDeCaja = palabrasBloqueadas.some((palabra) =>
    nombreCargo.includes(palabra),
  );
  const {
    data: dataCaja = [],
    isLoading: isLoadingCaja,
    isError: isErrorCaja,
  } = useQuery({
    queryKey: ["caja"],
    queryFn: GetVerificacionCaja,
  });

  console.log("dataCaja:", dataCaja);

  // 2. Evaluamos si la caja NO está abierta en el sistema
  if (!caja || caja.estado !== "abierto") {
    // Si es Mozo (o similar), le bloqueamos el paso con un mensaje, pero NO lo redirigimos
    if (esRolSinPermisoDeCaja) {
      return (
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: "80vh" }}
        >
          <div
            className="text-center p-4 bg-light rounded shadow-sm border"
            style={{ maxWidth: "450px" }}
          >
            <span className="fs-1 mb-3 d-block">🔒</span>
            <h4 className="fw-bold text-dark mb-3">
              Sistema de Ventas Cerrado
            </h4>
            <p className="text-muted mb-0">
              No hay ninguna caja abierta en la sucursal en este momento. Por
              favor, espera a que el Administrador o Cajero aperture el turno
              para poder gestionar las mesas.
            </p>
          </div>
        </div>
      );
    }

    // Si es un rol con permisos (Admin/Cajero), sí lo mandamos al formulario de apertura
    return <Navigate to="/abrirCaja" replace />;
  }

  // 3. Si la caja ESTÁ abierta, renderizamos el POS (las mesas) normalmente para todos
  return children;
};
