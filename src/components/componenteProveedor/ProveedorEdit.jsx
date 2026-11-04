import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ToastAlert from "../componenteToast/ToastAlert";

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
import { Button } from "../ui/button";

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
          <div className="grid grid-cols-12 gap-3 proveedor-grid-top">
            <div className="col-span-full md:col-span-4">
              <div className="proveedor-field proveedor-card-field h-full">
                <label htmlFor="tipo_documento" className="proveedor-label">
                  <FontAwesomeIcon icon={faIdCard} /> Tipo de Documento
                </label>
                <select
                  id="tipo_documento"
                  className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.tipo_documento
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
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
                  <div className="text-sm text-destructive">
                    {errors.tipo_documento.message}
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-full md:col-span-4">
              <div className="proveedor-field proveedor-card-field h-full">
                <label htmlFor="numero_documento" className="proveedor-label">
                  <FontAwesomeIcon icon={faIdCard} /> Número de Documento
                </label>
                <input
                  type="text"
                  className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.numero_documento
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
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
                  <div className="text-sm text-destructive">
                    {errors.numero_documento.message}
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-full md:col-span-4">
              <div className="proveedor-field proveedor-card-field h-full">
                <label htmlFor="telefono" className="proveedor-label">
                  <FontAwesomeIcon icon={faPhone} /> Teléfono
                </label>
                <input
                  type="text"
                  className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.telefono
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
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
                  <div className="text-sm text-destructive">
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
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-full">
              <div className="proveedor-field proveedor-card-field">
                <label htmlFor="nombre" className="proveedor-label">
                  <FontAwesomeIcon icon={faUser} /> Nombre
                </label>
                <input
                  type="text"
                  className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.nombre ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  placeholder="Nombre del proveedor"
                  id="nombre"
                  {...register("nombre", {
                    required: "Este campo es obligatorio",
                  })}
                />

                {errors.nombre && (
                  <div className="text-sm text-destructive">
                    {errors.nombre.message}
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-full">
              <div className="proveedor-field proveedor-card-field">
                <label htmlFor="contacto" className="proveedor-label">
                  <FontAwesomeIcon icon={faUser} /> Encargado o contacto
                </label>
                <input
                  type="text"
                  className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.contacto ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  placeholder="Nombre de contacto"
                  id="contacto"
                  {...register("contacto", {
                    required: "Este campo es obligatorio",
                  })}
                />

                {errors.contacto && (
                  <div className="text-sm text-destructive">
                    {errors.contacto.message}
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-full">
              <div className="proveedor-field proveedor-card-field">
                <label htmlFor="direccion" className="proveedor-label">
                  <FontAwesomeIcon icon={faMapMarkedAlt} /> Dirección
                </label>
                <input
                  type="text"
                  id="direccion"
                  className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.direccion ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  placeholder="Dirección del proveedor"
                  {...register("direccion", {
                    required: "Este campo es obligatorio",
                  })}
                />

                {errors.direccion && (
                  <div className="text-sm text-destructive">
                    {errors.direccion.message}
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-full">
              <div className="proveedor-field proveedor-card-field">
                <label htmlFor="correo" className="proveedor-label">
                  <FontAwesomeIcon icon={faEnvelope} /> Correo Electrónico
                </label>
                <input
                  id="correo"
                  type="email"
                  className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.correo ? "border-destructive focus-visible:ring-destructive" : ""}`}
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
                  <div className="text-sm text-destructive">
                    {errors.correo.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4 proveedor-form-actions">
          <Button
            type="button"
            className="btn-cerrar-modal"
            onClick={handleCloseModal}
            variant="default"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="btn-guardar"
            disabled={loading}
            variant="default"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}
