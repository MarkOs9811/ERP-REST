import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ToastAlert from "../componenteToast/ToastAlert";
import "../../css/estilosProveedore.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
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
    if (dataProveedor) {
      setTipoDocumento(dataProveedor.tipo_documento || "DNI");
      setNumeroDocumento(dataProveedor.numero_documento || "");

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
    return <div>Cargando...</div>;
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(
        `/proveedores/updateProveedores/${dataProveedor.id}`,
        data,
      );
      if (response.data.success) {
        ToastAlert("success", response.data.message);
        handleCloseModal();
        handleProveedorUpdated();
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      if (error.response) {
        const errors = error.response.data.errors;

        for (const field in errors) {
          if (errors.hasOwnProperty(field)) {
            ToastAlert("error", errors[field].join(", "));
          }
        }
      } else {
        ToastAlert("error", "Error al actualizar el proveedor.");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 p-md-3">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="proveedor-form proveedor-form-modern"
      >
        <div className="proveedor-form-hero mb-4">
          <div>
            <p className="proveedor-eyebrow mb-1">Editar proveedor</p>
            <h3 className="proveedor-heading mb-1">Actualización comercial</h3>
            <p className="proveedor-subtext mb-0">
              Modifica los datos del proveedor con una estructura más clara,
              compacta y fácil de revisar.
            </p>
          </div>
          <div className="proveedor-helper-pill">
            <FontAwesomeIcon icon={faCircleInfo} />
            <span>Cambios en tiempo real</span>
          </div>
        </div>

        <div className="proveedor-section mb-4">
          <div className="proveedor-section-title">Documento y contacto</div>
          <div className="row g-3 proveedor-grid-top">
            <div className="col-md-4">
              <div className="proveedor-field proveedor-card-field h-100">
                <label htmlFor="tipo_documento" className="proveedor-label">
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

            <div className="col-md-4">
              <div className="proveedor-field proveedor-card-field h-100">
                <label htmlFor="numero_documento" className="proveedor-label">
                  <FontAwesomeIcon icon={faIdCard} /> Número de Documento
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.numero_documento ? "is-invalid" : ""
                  }`}
                  placeholder={
                    tipoDocumento === "DNI" ? "00000000" : "00000000000"
                  }
                  id="numero_documento"
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

            <div className="col-md-4">
              <div className="proveedor-field proveedor-card-field h-100">
                <label htmlFor="telefono" className="proveedor-label">
                  <FontAwesomeIcon icon={faPhone} /> Teléfono
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.telefono ? "is-invalid" : ""
                  }`}
                  placeholder="9XXXXXXXX"
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
        </div>

        <div className="proveedor-section mb-3">
          <div className="proveedor-section-title">
            Información del proveedor
          </div>
          <div className="row g-3">
            <div className="col-12">
              <div className="proveedor-field proveedor-card-field">
                <label htmlFor="nombre" className="proveedor-label">
                  <FontAwesomeIcon icon={faUser} /> Nombre
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                  placeholder="Nombre del proveedor"
                  id="nombre"
                  {...register("nombre", {
                    required: "Este campo es obligatorio",
                  })}
                />

                {errors.nombre && (
                  <div className="invalid-feedback">
                    {errors.nombre.message}
                  </div>
                )}
              </div>
            </div>

            <div className="col-12">
              <div className="proveedor-field proveedor-card-field">
                <label htmlFor="contacto" className="proveedor-label">
                  <FontAwesomeIcon icon={faUser} /> Encargado o contacto
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.contacto ? "is-invalid" : ""}`}
                  placeholder="Nombre de contacto"
                  id="contacto"
                  {...register("contacto", {
                    required: "Este campo es obligatorio",
                  })}
                />

                {errors.contacto && (
                  <div className="invalid-feedback">
                    {errors.contacto.message}
                  </div>
                )}
              </div>
            </div>

            <div className="col-12">
              <div className="proveedor-field proveedor-card-field">
                <label htmlFor="direccion" className="proveedor-label">
                  <FontAwesomeIcon icon={faMapMarkedAlt} /> Dirección
                </label>
                <input
                  type="text"
                  id="direccion"
                  className={`form-control ${errors.direccion ? "is-invalid" : ""}`}
                  placeholder="Dirección del proveedor"
                  {...register("direccion", {
                    required: "Este campo es obligatorio",
                  })}
                />

                {errors.direccion && (
                  <div className="invalid-feedback">
                    {errors.direccion.message}
                  </div>
                )}
              </div>
            </div>

            <div className="col-12">
              <div className="proveedor-field proveedor-card-field">
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
                      value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                      message: "Correo inválido",
                    },
                  })}
                />

                {errors.correo && (
                  <div className="invalid-feedback">
                    {errors.correo.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4 proveedor-form-actions">
          <button
            type="button"
            className="btn-cerrar-modal"
            onClick={handleCloseModal}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-guardar" disabled={loading}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
