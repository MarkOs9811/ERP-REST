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
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: dataCaja,
    isLoading: isLoadingCaja,
    // 1. Eliminamos isFetchingCaja de la extracción porque no lo usaremos para bloquear la UI
  } = useQuery({
    queryKey: ["caja"],
    queryFn: GetVerificacionCaja,
    // 2. Quitamos refetchOnMount: "always". React query ya hace refetch por defecto al montar si la data es obsoleta.
    // 3. Añadimos un staleTime (ej: 1 minuto). Durante este tiempo, asume que la caja sigue abierta sin preguntar a la BD.
    staleTime: 1000 * 60 * 1,
  });

  // 1. SINCRONIZACIÓN ESTRICTA CON REDUX (Sin cambios)
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
  // 🔥 ESCUDO DE CARGA UNIFICADO OPTIMIZADO
  // ==========================================
  // 4. Solo bloqueamos la pantalla si es la PRIMERA VEZ que carga (isLoading) o falta el user.
  if (isLoadingCaja || !user) {
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
  // 2. VALIDACIÓN DE ROLES (Sin cambios)
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
  // 3. LA API ES LA ÚNICA VERDAD (Sin cambios)
  // ==========================================
  const cajaActivaConfirmada =
    dataCaja?.success === true && dataCaja?.data?.estadoCaja === 1;

  if (!cajaActivaConfirmada) {
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
    return <Navigate to="/abrirCaja" replace />;
  }

  // 4. Si la caja ESTÁ abierta, renderizamos el POS
  return children;
};
