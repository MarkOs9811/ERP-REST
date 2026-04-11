import { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../api/AxiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIdCard,
  faUser,
  faEnvelope,
  faMapMarkedAlt,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import ToastAlert from "../componenteToast/ToastAlert"; // Componente para notificaciones
import {
  handleInputChange,
  handleSelectChange,
  limitTelefonoInput,
  validateTelefono,
} from "../../hooks/InputHandlers";

export function ProveedorAdd({ handleCloseModal }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [tipoDocumento, setTipoDocumento] = useState("DNI");
  const [numeroDocumento, setNumeroDocumento] = useState("");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        "/proveedores/addProveedores",
        data,
      );

      if (response.data.success) {
        ToastAlert("success", response.data.message);
        reset();
        handleCloseModal();
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      if (error.response) {
        const backendError =
          error.response.data.message ||
          (error.response.data.errors &&
            Object.values(error.response.data.errors).flat().join(" - "));

        ToastAlert("error", backendError || "Ocurrió un error en el servidor");
      } else {
        ToastAlert("error", "No hay conexión con el servidor");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <div className="proveedor-field">
            <label htmlFor="tipo_documento" className="proveedor-label">
              <FontAwesomeIcon icon={faIdCard} /> Tipo de Documento
            </label>
            <select
              id="tipo_documento"
              className={`form-select ${errors.tipo_documento ? "is-invalid" : ""}`}
              {...register("tipo_documento", {
                required: "Este campo es obligatorio",
              })}
              value={tipoDocumento}
              onChange={handleSelectChange(
                setTipoDocumento,
                setValue,
                "tipo_documento",
                [{ name: "numero_documento", setter: setNumeroDocumento }],
              )}
            >
              <option value="DNI">DNI</option>
              <option value="RUC">RUC</option>
            </select>
            {errors.tipo_documento && (
              <div className="invalid-feedback">
                {errors.tipo_documento.message}
              </div>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="proveedor-field">
            <label htmlFor="numero_documento" className="proveedor-label">
              <FontAwesomeIcon icon={faIdCard} /> Número de Documento
            </label>
            <input
              id="numero_documento"
              type="text"
              className={`form-control ${errors.numero_documento ? "is-invalid" : ""}`}
              placeholder="00000000"
              value={numeroDocumento}
              {...register("numero_documento", {
                required: "Este campo es obligatorio",
                minLength: {
                  value: tipoDocumento === "DNI" ? 8 : 11,
                  message: `Debe tener ${tipoDocumento === "DNI" ? "8" : "11"} caracteres`,
                },
                maxLength: {
                  value: tipoDocumento === "DNI" ? 8 : 11,
                  message: `Debe tener ${tipoDocumento === "DNI" ? "8" : "11"} caracteres`,
                },
              })}
              onChange={handleInputChange(
                setNumeroDocumento,
                setValue,
                "numero_documento",
                /^\d*$/,
                tipoDocumento === "DNI" ? 8 : 11,
              )}
            />
            {errors.numero_documento && (
              <div className="invalid-feedback">
                {errors.numero_documento.message}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <div className="proveedor-field">
            <label htmlFor="telefono" className="proveedor-label">
              <FontAwesomeIcon icon={faPhone} /> Teléfono
            </label>
            <input
              id="telefono"
              type="text"
              className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
              placeholder="9XXXXXXXX"
              {...register("telefono", {
                required: "Este campo es obligatorio",
                validate: validateTelefono,
              })}
              onInput={limitTelefonoInput}
            />
            {errors.telefono && (
              <div className="invalid-feedback">{errors.telefono.message}</div>
            )}
          </div>
        </div>
      </div>

      <div className="proveedor-field mb-3">
        <label htmlFor="nombre" className="proveedor-label">
          <FontAwesomeIcon icon={faUser} /> Nombre
        </label>
        <input
          id="nombre"
          type="text"
          className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
          placeholder="Nombre del proveedor"
          {...register("nombre", {
            required: "Este campo es obligatorio",
          })}
        />
        {errors.nombre && (
          <div className="invalid-feedback">{errors.nombre.message}</div>
        )}
      </div>

      <div className="proveedor-field mb-3">
        <label htmlFor="correo" className="proveedor-label">
          <FontAwesomeIcon icon={faEnvelope} /> Correo Electrónico
        </label>
        <input
          id="correo"
          type="email"
          className={`form-control ${errors.correo ? "is-invalid" : ""}`}
          placeholder="correo@ejemplo.com"
          {...register("correo", {
            required: "Este campo es obligatorio",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Formato de correo inválido",
            },
          })}
        />
        {errors.correo && (
          <div className="invalid-feedback">{errors.correo.message}</div>
        )}
      </div>

      <div className="proveedor-field mb-3">
        <label htmlFor="contacto" className="proveedor-label">
          <FontAwesomeIcon icon={faUser} /> Encargado/Contacto
        </label>
        <input
          id="contacto"
          type="text"
          className={`form-control ${errors.contacto ? "is-invalid" : ""}`}
          placeholder="Nombre de contacto"
          {...register("contacto", {
            required: "Este campo es obligatorio",
          })}
        />
        {errors.contacto && (
          <div className="invalid-feedback">{errors.contacto.message}</div>
        )}
      </div>

      <div className="proveedor-field mb-3">
        <label htmlFor="direccion" className="proveedor-label">
          <FontAwesomeIcon icon={faMapMarkedAlt} /> Dirección
        </label>
        <input
          id="direccion"
          type="text"
          className={`form-control ${errors.direccion ? "is-invalid" : ""}`}
          placeholder="Dirección del proveedor"
          {...register("direccion", {
            required: "Este campo es obligatorio",
          })}
        />
        {errors.direccion && (
          <div className="invalid-feedback">{errors.direccion.message}</div>
        )}
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <button
          type="button"
          className="btn-cerrar-modal"
          onClick={handleCloseModal}
        >
          Cancelar
        </button>
        <button type="submit" className="btn-guardar" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}
