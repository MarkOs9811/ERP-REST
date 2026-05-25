import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ToastAlert from "../componenteToast/ToastAlert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faIdCard,
  faMapMarkedAlt,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../api/AxiosInstance";
import {
  handleInputChange,
  handleSelectChange,
  limitTelefonoInput,
  validateTelefono,
} from "../../hooks/InputHandlers";

export function ProveedorEdit({
  dataProveedor,
  handleProveedorUpdated,
  handleCloseModal,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const [tipoDocumento, setTipoDocumento] = useState("DNI");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Solo se ejecuta cuando dataProveedor cambia
    if (dataProveedor) {
      // Restaura el formulario con los datos del proveedor
      reset({
        tipo_documento: dataProveedor.tipo_documento || "DNI",
        numero_documento: dataProveedor.numero_documento || "",
        telefono: dataProveedor.telefono || "",
        nombre: dataProveedor.nombre || "",
        contacto: dataProveedor.contacto || "",
        direccion: dataProveedor.direccion || "",
        correo: dataProveedor.email || "",
      });
    }
  }, [dataProveedor, reset]);

  if (!dataProveedor) {
    return <div>Cargando...</div>; // Mensaje de carga
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // Incluimos el idProveedor en los datos que se envían en la solicitud PUT
      const response = await axiosInstance.put(
        `/proveedores/updateProveedores/${dataProveedor.id}`,
        data,
      );
      if (response.data.success) {
        ToastAlert("success", response.data.message);
        handleCloseModal(); // Cierra el modal si es necesario
        handleProveedorUpdated();
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      // Verifica si hay errores de validación
      if (error.response) {
        const errors = error.response.data.errors;

        // Muestra todos los errores
        for (const field in errors) {
          if (errors.hasOwnProperty(field)) {
            ToastAlert("error", errors[field].join(", ")); // Une los errores con comas y los muestra
          }
        }
      } else {
        // Si no hay respuesta del servidor
        ToastAlert("error", "Error al actualizar el proveedor.");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-4">
            <div className=" mb-3">
              <label for="tipo_documento">
                <FontAwesomeIcon icon={faIdCard} /> Tipo de Documento
              </label>
              <select
                id="tipo_documento"
                className={`form-select ${
                  errors.tipo_documento ? "is-invalid" : ""
                }`}
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
          <div className="col-4">
            <div className=" mb-3">
              <label for="numero_documento">
                <FontAwesomeIcon icon={faIdCard} /> Número de Documento
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.numero_documento ? "is-invalid" : ""
                }`}
                placeholder="Número de Documento"
                id="numero_documento"
                {...register("numero_documento", {
                  required: "Este campo es obligatorio",
                  minLength: {
                    value: 8,
                    message: "Debe tener al menos 8 caracteres",
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
          <div className="col-4">
            <div className=" mb-3">
              <label for="telefono">
                <FontAwesomeIcon icon={faPhone} /> Telefono
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.telefono ? "is-invalid" : ""
                }`}
                placeholder="Telefono"
                id="telefono"
                {...register("telefono", {
                  required: "Este campo es obligatorio",
                  validate: validateTelefono,
                })}
                onInput={limitTelefonoInput}
              />

              {errors.telefono && (
                <div className="invalid-feedback">
                  {errors.telefono.message}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className=" mb-3">
          <label for="nombre">
            <FontAwesomeIcon icon={faUser} /> Nombre
          </label>
          <input
            type="text"
            className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
            placeholder="Nombre"
            id="nombre"
            {...register("nombre", { required: "Este campo es obligatorio" })}
          />

          {errors.nombre && (
            <div className="invalid-feedback">{errors.nombre.message}</div>
          )}
        </div>

        <div className=" mb-3">
          <label for="contacto">
            <FontAwesomeIcon icon={faPhone} /> Contacto
          </label>
          <input
            type="text"
            className={`form-control ${errors.contacto ? "is-invalid" : ""}`}
            placeholder="Contacto"
            id="contacto"
            {...register("contacto", { required: "Este campo es obligatorio" })}
          />

          {errors.contacto && (
            <div className="invalid-feedback">{errors.contacto.message}</div>
          )}
        </div>

        <div className=" mb-3">
          <label for="direccion">
            <FontAwesomeIcon icon={faMapMarkedAlt} /> Dirección
          </label>
          <input
            type="text"
            id="direccion"
            className={`form-control ${errors.direccion ? "is-invalid" : ""}`}
            placeholder="Dirección"
            {...register("direccion", {
              required: "Este campo es obligatorio",
            })}
          />

          {errors.direccion && (
            <div className="invalid-feedback">{errors.direccion.message}</div>
          )}
        </div>

        <div className=" mb-3">
          <label for="correo">
            <FontAwesomeIcon icon={faEnvelope} /> Correo Electrónico
          </label>
          <input
            id="correo"
            type="email"
            className={`form-control ${errors.correo ? "is-invalid" : ""}`}
            placeholder="Correo Electrónico"
            {...register("correo", {
              required: "Este campo es obligatorio",
              pattern: {
                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                message: "Correo inválido",
              },
            })}
          />

          {errors.correo && (
            <div className="invalid-feedback">{errors.correo.message}</div>
          )}
        </div>

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
