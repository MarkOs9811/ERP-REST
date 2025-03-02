// CajaProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useCaja } from "../../src/CajaContext";

export const CajaProtectedRoute = ({ children }) => {
  const { caja } = useCaja();

  if (!caja || caja.estado != "abierto") {
    return <Navigate to="/abrirCaja" replace />;
  }

  return children;
};
