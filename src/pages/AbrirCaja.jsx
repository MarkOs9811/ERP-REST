import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCashRegister,
  faBoxOpen,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { abrirCaja } from "../redux/cajaSlice";
import axiosInstance from "../api/AxiosInstance";
import ToastAlert from "../components/componenteToast/ToastAlert";
import { Cargando } from "../components/componentesReutilizables/Cargando";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetConfi } from "../service/accionesConfiguracion/GetConfi";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

export function AbrirCaja() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const {
    data: cajas = [],
    isLoading: isLoadingCajas,
    isError: isErrorCajas,
  } = useQuery({
    queryKey: ["cajasSede"],
    queryFn: async () => {
      const response = await axiosInstance.get("/cajas");
      if (!response.data.success) {
        throw new Error(
          response.data.message || "No se pudieron cargar las cajas",
        );
      }
      return response.data.cajas || [];
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const { data: configEmpresa = [] } = useQuery({
    queryKey: ["confiEmpresa"],
    queryFn: GetConfi,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const listaConfig = Array.isArray(configEmpresa) ? configEmpresa : [];
  const configTipoVenta = listaConfig.find(
    (item) => item.nombre === "Tipo Venta",
  );
  const claveVenta = (configTipoVenta?.clave || "").toLowerCase();
  const esComida = claveVenta === "restaurante" || claveVenta === "comida";

  const cajasCerradas = (Array.isArray(cajas) ? cajas : []).filter(
    (item) => Number(item.estadoCaja) === 0,
  );

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post(
        "/cajas/storeCajaApertura",
        data,
      );

      if (!response.data.success) {
        ToastAlert(
          "error",
          response.data.message || "No se pudo abrir la caja",
        );
        return;
      }

      const cajaAbierta = response.data.caja;
      const cajaData = {
        nombre: cajaAbierta?.nombreCaja,
        id: cajaAbierta?.id,
        estado: "abierto",
      };

      dispatch(abrirCaja(cajaData));

      // Evita que CajaProtectedRoute use la caché de "caja cerrada" y te devuelva aquí.
      queryClient.setQueryData(["caja"], {
        success: true,
        data: {
          id: cajaAbierta?.id,
          nombreCaja: cajaAbierta?.nombreCaja,
          estadoCaja: 1,
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["cajasSede"] });

      ToastAlert("success", "Caja abierta correctamente");
      navigate(esComida ? "/vender/mesas" : "/vender/ventasLlevar");
    } catch (error) {
      ToastAlert(
        "error",
        error.response?.data?.message || "Error al abrir la caja",
      );
    }
  };

  return (
    <div>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div
          className="card abrir-caja-container shadow-sm p-4"
          style={{ maxWidth: 480, width: "100%" }}
        >
          <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center px-0 pt-0">
            <h4 className="mb-0">
              <FontAwesomeIcon icon={faBoxOpen} className="me-2" />
              Abrir Caja
            </h4>
            <button
              type="button"
              className="btn-principal mb-0"
              onClick={() => navigate("/ventas/cajas")}
            >
              <Plus size={16} /> Agregar Caja
            </button>
          </div>

          <div className="alert alert-secondary mt-3">
            <FontAwesomeIcon icon={faTriangleExclamation} className="mx-2" />
            Caja cerrada. Por favor, aperture una para continuar.
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="form-abrir-caja">
            <div className="mb-3">
              <label htmlFor="caja" className="mx-1 small">
                <FontAwesomeIcon icon={faCashRegister} /> Seleccionar Caja
              </label>

              <select
                id="caja"
                className={`form-select ${errors.caja ? "is-invalid" : ""}`}
                disabled={isLoadingCajas}
                {...register("caja", { required: "Seleccione una caja" })}
              >
                <option value="">
                  {isLoadingCajas ? "Cargando cajas..." : "Seleccione..."}
                </option>
                {cajasCerradas.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombreCaja}
                  </option>
                ))}
              </select>

              {errors.caja && (
                <div className="invalid-feedback">{errors.caja.message}</div>
              )}

              {isErrorCajas && (
                <div className="text-danger small mt-1">
                  No se pudieron cargar las cajas.
                </div>
              )}

              {!isLoadingCajas &&
                !isErrorCajas &&
                cajasCerradas.length === 0 && (
                  <div className="text-muted small mt-1">
                    No hay cajas cerradas disponibles. Cree una nueva o cierre
                    la que está abierta.
                  </div>
                )}
            </div>

            <div className="mb-3">
              <label htmlFor="monto" className="mx-1 small">
                Monto de Apertura S/.
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                id="monto"
                className={`form-control ${
                  errors.montoApertura ? "is-invalid" : ""
                }`}
                placeholder="Ingrese el monto inicial"
                {...register("montoApertura", {
                  required: "Ingrese el monto de apertura",
                  min: {
                    value: 0,
                    message: "El monto no puede ser negativo",
                  },
                })}
              />

              {errors.montoApertura && (
                <div className="invalid-feedback">
                  {errors.montoApertura.message}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn-guardar btn-block w-100"
              disabled={
                isSubmitting || isLoadingCajas || cajasCerradas.length === 0
              }
            >
              {isSubmitting ? (
                <Cargando />
              ) : (
                <>
                  <FontAwesomeIcon icon={faCashRegister} /> Abrir Caja
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
