// CajaProtectedRoute.js
import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useQuery } from "@tanstack/react-query";
import { GetVerificacionCaja } from "../service/accionesVender/GetVerificacionCaja";
import { useDispatch } from "react-redux";
import { abrirCaja } from "../redux/cajaSlice";
import { ArrowLeft, LockKeyhole } from "lucide-react";

export const CajaProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // ⚠️ Asegúrate de que esto realmente contenga los datos del usuario
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    data: dataCaja,
    isLoading: isLoadingCaja,
    isFetching: isFetchingCaja,
  } = useQuery({
    queryKey: ["caja"],
    queryFn: GetVerificacionCaja,
    refetchOnMount: "always", // Obliga a consultar BD al montar
  });

  // 1. SINCRONIZACIÓN ESTRICTA CON REDUX
  useEffect(() => {
    if (dataCaja) {
      if (dataCaja.success && dataCaja.data && dataCaja.data.estadoCaja === 1) {
        dispatch(
          abrirCaja({
            id: dataCaja.data.id,
            nombre: dataCaja.data.nombreCaja,
            estado: "abierto",
          }),
        );
      } else {
        dispatch(
          abrirCaja({
            id: null,
            nombre: "",
            estado: "cerrado",
          }),
        );
      }
    }
  }, [dataCaja, dispatch]);

  // ==========================================
  // 🔥 ESCUDO DE CARGA UNIFICADO
  // ==========================================
  // Esperamos a que la API responda Y a que el contexto de Auth entregue al 'user'
  if (isLoadingCaja || isFetchingCaja || !user) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div
          className="spinner-border"
          style={{ color: "var(--fw-saffron)" }}
          role="status"
        >
          <span className="visually-hidden">Cargando validaciones...</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. VALIDACIÓN DE ROLES (Aquí 'user' ya existe, superó el escudo)
  // ==========================================
  const nombreCargo = user?.empleado?.cargo?.nombre?.toLowerCase() || "";
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

  // ==========================================
  // 3. LA API ES LA ÚNICA VERDAD (Validación estricta)
  // ==========================================
  const cajaActivaConfirmada =
    dataCaja?.success === true && dataCaja?.data?.estadoCaja === 1;

  if (!cajaActivaConfirmada) {
    // Si es Mozo, pantalla de bloqueo. NO SE REDIRIGE.
    if (esRolSinPermisoDeCaja) {
      return (
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: "80vh" }}
        >
          <div
            className="text-center p-4 bg-white rounded shadow-sm border"
            style={{ maxWidth: "450px" }}
          >
            <span
              className="fs-1 mb-3 d-block"
              style={{ color: "var(--fw-strawberry)" }}
            >
              <LockKeyhole size={48} />
            </span>
            <h4 className="fw-bold text-dark mb-3">
              Sistema de Ventas Cerrado
            </h4>
            <p className="text-muted mb-0">
              No hay ninguna caja abierta en la sucursal en este momento. Por
              favor, espera a que Administración aperture el turno.
            </p>
            <button className="my-4 btn-generico" onClick={() => navigate("/")}>
              <ArrowLeft /> Volver al Inicio
            </button>
          </div>
        </div>
      );
    }

    // Solo si tiene permisos (Admin/Cajero) se redirige a abrir caja
    return <Navigate to="/abrirCaja" replace />;
  }

  // 4. Si la caja ESTÁ abierta, renderizamos el POS
  return children;
};
