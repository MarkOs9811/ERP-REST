import React, { useEffect, useState } from "react";
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

export function AbrirCaja() {
  const dispatch = useDispatch();
  const [caja, setCajas] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const getCajas = async () => {
    try {
      const response = await axiosInstance.get("/cajas");
      if (response.data.success) {
        setCajas(response.data.cajas);
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      ToastAlert("error", "Error de conexión");
    }
  };

  useEffect(() => {
    getCajas();
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post(
        "/cajas/storeCajaApertura",
        data
      );
      if (response.data.success) {
        ToastAlert("success", "Caja abierta correctamente");
        const { nombreCaja, id } = response.data.caja;
        const cajaData = { nombre: nombreCaja, id: id, estado: "abierto" };

        dispatch(abrirCaja(cajaData));

        setTimeout(() => {
          window.location.href = "/vender/ventasMesas";
        }, 100);
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      ToastAlert("error", "Error al abrir la caja");
    }
  };

  return (
    <div className="card abrir-caja-container p-3 w-50 m-auto shadow-sm justify-center">
      <h4 className="text-center">
        <FontAwesomeIcon icon={faBoxOpen} /> Abrir Caja
      </h4>
      <div className="alert alert-secondary">
        <FontAwesomeIcon icon={faTriangleExclamation} className="mx-2" />
        Caja Cerrada, Porfavor apertura una.
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="form-abrir-caja">
        <div className="form-floating mb-3">
          <select
            id="caja"
            className={`form-select ${errors.caja ? "is-invalid" : ""}`}
            {...register("caja", { required: "Seleccione una caja" })}
          >
            <option value="">Seleccione...</option>
            {caja.map((cajas) => (
              <option key={cajas.id} value={cajas.id}>
                {cajas.nombreCaja}
              </option>
            ))}
          </select>
          <label htmlFor="caja">
            <FontAwesomeIcon icon={faCashRegister} /> Seleccionar Caja
          </label>
          {errors.caja && (
            <div className="invalid-feedback">{errors.caja.message}</div>
          )}
        </div>

        <div className="form-floating mb-3">
          <input
            type="text"
            id="monto"
            className={`form-control ${
              errors.montoApertura ? "is-invalid" : ""
            }`}
            placeholder="Ingrese el monto inicial"
            {...register("montoApertura", {
              required: "Ingrese el monto de apertura",
            })}
          />
          <label htmlFor="monto">Monto de Apertura S/.</label>
          {errors.montoApertura && (
            <div className="invalid-feedback">
              {errors.montoApertura.message}
            </div>
          )}
        </div>

        <button type="submit" className="btn-guardar btn-block">
          <FontAwesomeIcon icon={faCashRegister} /> Abrir Caja
        </button>
      </form>
    </div>
  );
}
