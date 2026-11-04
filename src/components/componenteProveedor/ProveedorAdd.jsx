import { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../api/AxiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
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
import { Button } from "../ui/button";

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
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-3 p-3 mb-4 rounded bg-muted">
        <div>
          <p className="text-sm font-semibold uppercase mb-1">
            Nuevo proveedor
          </p>
          <h3 className="h5 font-bold mb-1">Registro comercial</h3>
          <p className="text-sm text-muted-foreground mb-0">
            Completa los datos principales para crear el proveedor de forma
            clara y ordenada.
          </p>
        </div>
        <div className="rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors bg-secondary text-secondary-foreground inline-flex items-center gap-2 self-start">
          <FontAwesomeIcon icon={faCircleInfo} />
          <span>Campos obligatorios</span>
        </div>
      </div>

      <div className="mb-4">
        <h6 className="font-bold text-muted-foreground border-b pb-2 mb-3">
          Documento y contacto
        </h6>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-full md:col-span-4">
            <div className="border rounded p-3 h-full">
              <label
                htmlFor="tipo_documento"
                className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold text-muted-foreground flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faIdCard} /> Tipo de Documento
              </label>
              <select
                id="tipo_documento"
                className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.tipo_documento ? "border-destructive focus-visible:ring-destructive" : ""}`}
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
            <div className="border rounded p-3 h-full">
              <label
                htmlFor="numero_documento"
                className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold text-muted-foreground flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faIdCard} /> Número de Documento
              </label>
              <input
                id="numero_documento"
                type="text"
                className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.numero_documento ? "border-destructive focus-visible:ring-destructive" : ""}`}
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
                <div className="text-sm text-destructive">
                  {errors.numero_documento.message}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-full md:col-span-4">
            <div className="border rounded p-3 h-full">
              <label
                htmlFor="telefono"
                className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold text-muted-foreground flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPhone} /> Teléfono
              </label>
              <input
                id="telefono"
                type="text"
                className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.telefono ? "border-destructive focus-visible:ring-destructive" : ""}`}
                placeholder="9XXXXXXXX"
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

      <div className="mb-3">
        <h6 className="font-bold text-muted-foreground border-b pb-2 mb-3">
          Información del proveedor
        </h6>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-full">
            <div className="border rounded p-3">
              <label
                htmlFor="nombre"
                className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold text-muted-foreground flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faUser} /> Nombre
              </label>
              <input
                id="nombre"
                type="text"
                className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.nombre ? "border-destructive focus-visible:ring-destructive" : ""}`}
                placeholder="Nombre del proveedor"
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
            <div className="border rounded p-3">
              <label
                htmlFor="contacto"
                className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold text-muted-foreground flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faUser} /> Encargado o contacto
              </label>
              <input
                id="contacto"
                type="text"
                className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.contacto ? "border-destructive focus-visible:ring-destructive" : ""}`}
                placeholder="Nombre de contacto"
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
            <div className="border rounded p-3">
              <label
                htmlFor="direccion"
                className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold text-muted-foreground flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faMapMarkedAlt} /> Dirección
              </label>
              <input
                id="direccion"
                type="text"
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
            <div className="border rounded p-3">
              <label
                htmlFor="correo"
                className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold text-muted-foreground flex items-center gap-2"
              >
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
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Formato de correo inválido",
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

      <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
        <Button
          type="button"
          className="btn-cerrar"
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
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  );
}
