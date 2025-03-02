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
import { handleInputChange, handleSelectChange,limitTelefonoInput, validateTelefono  } from "../../hooks/InputHandlers";


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
        data
      );
      if (response.data.success) {
        ToastAlert("success", response.data.message);
        reset();
        handleCloseModal();
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      ToastAlert("error", "Error al agregar proveedor");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          {/* Tipo de Documento */}
          <div className="col-4">
            <div className="form-floating mb-3">
              <select
                className={`form-select ${
                  errors.tipo_documento ? "is-invalid" : ""
                }`}
                {...register("tipo_documento", {
                  required: "Este campo es obligatorio",
                })}
                value={tipoDocumento}
                onChange={handleSelectChange(setTipoDocumento, setValue, "tipo_documento", [
                  { name: "numero_documento", setter: setNumeroDocumento },
                ])}
              >
                <option value="DNI">DNI</option>
                <option value="RUC">RUC</option>
              </select>
              <label>
                <FontAwesomeIcon icon={faIdCard} /> Tipo de Documento
              </label>
              {errors.tipo_documento && (
                <div className="invalid-feedback">
                  {errors.tipo_documento.message}
                </div>
              )}
            </div>
          </div>

          {/* Número de Documento */}
          <div className="col-4">
            <div className="form-floating mb-3">
              <input
                type="text"
                className={`form-control ${
                  errors.numero_documento ? "is-invalid" : ""
                }`}
                placeholder="Número de Documento"
                value={numeroDocumento}
                {...register("numero_documento", {
                  required: "Este campo es obligatorio",
                  minLength: {
                    value: tipoDocumento === "DNI" ? 8 : 11,
                    message: `Debe tener ${
                      tipoDocumento === "DNI" ? "8" : "11"
                    } caracteres`,
                  },
                  maxLength: {
                    value: tipoDocumento === "DNI" ? 8 : 11,
                    message: `Debe tener ${
                      tipoDocumento === "DNI" ? "8" : "11"
                    } caracteres`,
                  },
                })}
                onChange={handleInputChange(setNumeroDocumento, setValue, "numero_documento", /^\d*$/, tipoDocumento === "DNI" ? 8 : 11)}
              />
              <label>
                <FontAwesomeIcon icon={faIdCard} /> Número de Documento
              </label>
              {errors.numero_documento && (
                <div className="invalid-feedback">
                  {errors.numero_documento.message}
                </div>
              )}
            </div>
          </div>

          {/* Teléfono */}
          <div className="col-4">
            <div className="form-floating mb-3">
              <input
                type="text"
                className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
                id="telefono"
                placeholder="Teléfono"
                {...register("telefono", {
                  required: "Este campo es obligatorio",
                  validate: validateTelefono, 
                })}
                onInput={limitTelefonoInput}
              />
              <label>
                <FontAwesomeIcon icon={faPhone} /> Teléfono
              </label>
              {errors.telefono && (
                <div className="invalid-feedback">{errors.telefono.message}</div>
              )}
            </div>
          </div>
        </div>

        {/* Nombre */}
        <div className="form-floating mb-3">
          <input
            type="text"
            className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
            placeholder="Nombre"
            {...register("nombre", {
              required: "Este campo es obligatorio",
            })}
          />
          <label>
            <FontAwesomeIcon icon={faUser} /> Nombre
          </label>
          {errors.nombre && (
            <div className="invalid-feedback">{errors.nombre.message}</div>
          )}
        </div>

        {/* Correo Electrónico */}
        <div className="form-floating mb-3">
          <input
            type="email"
            className={`form-control ${errors.correo ? "is-invalid" : ""}`}
            placeholder="Correo Electrónico"
            {...register("correo", {
              required: "Este campo es obligatorio",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Formato de correo inválido",
              },
            })}
          />
          <label>
            <FontAwesomeIcon icon={faEnvelope} /> Correo Electrónico
          </label>
          {errors.correo && (
            <div className="invalid-feedback">{errors.correo.message}</div>
          )}
        </div>
        {/* Contacto */}
        <div className="form-floating mb-3">
          <input
            type="text"
            className={`form-control ${errors.contacto ? "is-invalid" : ""}`}
            placeholder="Contacto"
            {...register("contacto", {
              required: "Este campo es obligatorio",
            })}
          />
          <label>
            <FontAwesomeIcon icon={faPhone} /> Contacto
          </label>
          {errors.contacto && (
            <div className="invalid-feedback">{errors.contacto.message}</div>
          )}
        </div>
        {/* Dirección */}
        <div className="form-floating mb-3">
          <input
            type="text"
            className={`form-control ${errors.direccion ? "is-invalid" : ""}`}
            placeholder="Dirección"
            {...register("direccion", {
              required: "Este campo es obligatorio",
            })}
          />
          <label>
            <FontAwesomeIcon icon={faMapMarkedAlt} /> Dirección
          </label>
          {errors.direccion && (
            <div className="invalid-feedback">{errors.direccion.message}</div>
          )}
        </div>

        {/* Botones */}
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn-cerrar-modal me-2"
            onClick={handleCloseModal}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-guardar" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
