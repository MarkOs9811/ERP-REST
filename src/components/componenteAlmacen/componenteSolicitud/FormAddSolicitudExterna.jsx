import { useForm } from "react-hook-form";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetProveedores } from "../../../service/GetProveedores";
import { Tag, TruckIcon, PenLine, Store, StoreIcon } from "lucide-react";
import { GetUnidades } from "../../../service/serviceAlmacen/GetUnidades";
import axiosInstance from "../../../api/AxiosInstance";
import { GetAreas } from "../../../service/GetAreas";
import ToastAlert from "../../componenteToast/ToastAlert";
import { Button } from "../../ui/button";

export function FormAddSolicitudExterna({ onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [isLoadingSave, setIsLoadingSave] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoadingSave(true);

      // ✅ Construimos el FormData
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key !== "firmaSolicitante" && key !== "firmaAprobador") {
          formData.append(key, data[key]);
        }
      });

      if (data.firmaSolicitante?.[0]) {
        formData.append("firmaSolicitante", data.firmaSolicitante[0]);
      }

      if (data.firmaAprobador?.[0]) {
        formData.append("firmaAprobador", data.firmaAprobador[0]);
      }

      // ✅ Enviar al backend
      const response = await axiosInstance.post(
        "/misSolicitudes/solicitudAddExterna",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      // ✅ Si devuelve PDF, abrirlo
      const pdfUrl = response?.data?.pdf_url;
      if (pdfUrl) window.open(pdfUrl, "_blank");

      ToastAlert("success", "Solicitud creada correctamente");
      reset();
      onClose();
    } catch (error) {
      console.error(" Error al guardar solicitud:", error);

      // 🔍 Si hay respuesta del backend
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 422) {
          console.warn("🧾 Errores de validación:", data);

          const validationErrors = data?.details || data?.errors;
          if (validationErrors) {
            const messages = Object.values(validationErrors).flat().join("\n");
            ToastAlert("error", `Errores de validación:\n${messages}`);
          } else {
            ToastAlert("error", "Error de validación desconocido (422).");
          }
        } else {
          ToastAlert(
            "error",
            `Error ${status}: ${data?.message || "Error del servidor"}`,
          );
        }
      }
      // 🌐 Sin respuesta del servidor
      else if (error.request) {
        ToastAlert(
          "error",
          "No se recibió respuesta del servidor. Verifica tu conexión.",
        );
      }
      // ❗ Error de configuración
      else {
        ToastAlert("error", `Error: ${error.message}`);
      }
    } finally {
      setIsLoadingSave(false);
    }
  };

  const {
    data: dataProveedor = [],
    isLoading: isLoadingProve,
    isError: isErrorProve,
  } = useQuery({
    queryKey: ["proveedorList"],
    queryFn: GetProveedores,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const {
    data: dataUnidad = [],
    isLoading: isLoadingUnidad,
    isError: isErrorUnidad,
  } = useQuery({
    queryKey: ["unidadList"],
    queryFn: GetUnidades,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const {
    data: dataArea = [],
    isLoading: isLoadingArea,
    isError: isErrorArea,
  } = useQuery({
    queryKey: ["areaList"],
    queryFn: GetAreas,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  console.log("areas", dataArea);
  return (
    <div className="p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ===================== 🧍 DATOS DEL SOLICITANTE ===================== */}
        <h6 className="font-bold text-foreground mb-3">
          Datos del solicitante
        </h6>

        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-full md:col-span-6 mb-3 relative">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
              <StoreIcon size={18} />
              Area <span className="text-destructive">*</span>
            </label>
            <select
              className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.proveedor ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("area_origen", { required: "Campo obligatorio" })}
            >
              <option value="">Seleccione un area_origen</option>
              {Array.isArray(dataArea) &&
                dataArea
                  .filter((area_origen) => area_origen.estado == 1)
                  .map((area_origen) => (
                    <option key={area_origen.id} value={area_origen.id}>
                      {area_origen.nombre}
                    </option>
                  ))}
            </select>
            {errors.area_origen && (
              <div className="text-sm text-destructive block">
                {errors.area_origen.message}
              </div>
            )}
          </div>

          {/* Nombre del solicitante */}
          <div className="col-span-full md:col-span-6 mb-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Nombre del solicitante <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.nombre_solicitante
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
              {...register("nombre_solicitante", {
                required: "Campo obligatorio",
                minLength: {
                  value: 3,
                  message: "Debe tener al menos 3 caracteres",
                },
              })}
            />
            {errors.nombre_solicitante && (
              <div className="text-sm text-destructive">
                {errors.nombre_solicitante.message}
              </div>
            )}
          </div>

          {/* Correo electrónico */}
          <div className="col-span-full md:col-span-6 mb-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Correo electrónico <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.correo_electronico
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
              {...register("correo_electronico", {
                required: "Campo obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Correo inválido",
                },
              })}
            />
            {errors.correo_electronico && (
              <div className="text-sm text-destructive">
                {errors.correo_electronico.message}
              </div>
            )}
          </div>

          {/* Teléfono */}
          <div className="col-span-full md:col-span-6 mb-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Teléfono <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.telefono ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("telefono", {
                required: "Campo obligatorio",
                pattern: {
                  value: /^[0-9]{6,15}$/,
                  message: "Teléfono inválido (solo números)",
                },
              })}
            />
            {errors.telefono && (
              <div className="text-sm text-destructive">
                {errors.telefono.message}
              </div>
            )}
          </div>
        </div>

        {/* ===================== 📦 DATOS DEL PRODUCTO ===================== */}
        <h6 className="font-bold text-foreground mt-4 mb-3">
          Datos del producto
        </h6>

        <div className="grid grid-cols-12 gap-3">
          {/* Proveedor */}
          <div className="col-span-full md:col-span-6 mb-3 relative">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
              <TruckIcon size={18} />
              Proveedor <span className="text-destructive">*</span>
            </label>
            <select
              className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.proveedor ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("proveedor", { required: "Campo obligatorio" })}
            >
              <option value="">Seleccione un proveedor</option>
              {dataProveedor
                .filter((proveedor) => proveedor.estado == 1)
                .map((proveedor) => (
                  <option key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre}
                  </option>
                ))}
            </select>
            {errors.proveedor && (
              <div className="text-sm text-destructive block">
                {errors.proveedor.message}
              </div>
            )}
          </div>

          {/* Unidad de medida */}
          <div className="col-span-full md:col-span-6 mb-3 relative">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
              <Tag size={18} />
              Unidad de medida <span className="text-destructive">*</span>
            </label>
            <select
              className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.unidad_medida
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
              {...register("unidad_medida", {
                required: "Campo obligatorio",
              })}
            >
              <option value="">Seleccione una unidad</option>
              {dataUnidad
                .filter((unidad_medida) => unidad_medida.estado == 1)
                .map((unidad_medida) => (
                  <option key={unidad_medida.id} value={unidad_medida.id}>
                    {unidad_medida.nombre}
                  </option>
                ))}
            </select>
            {errors.unidad_medida && (
              <div className="text-sm text-destructive block">
                {errors.unidad_medida.message}
              </div>
            )}
          </div>

          {/* Marca */}
          <div className="col-span-full md:col-span-6 mb-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Marca del producto <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.marcaProducto
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
              {...register("marcaProducto", { required: "Campo obligatorio" })}
            />
            {errors.marcaProducto && (
              <div className="text-sm text-destructive">
                {errors.marcaProducto.message}
              </div>
            )}
          </div>

          {/* Cantidad */}
          <div className="col-span-full md:col-span-3 mb-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Cantidad <span className="text-destructive">*</span>
            </label>
            <input
              type="number"
              min="1"
              step="1"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.cantidad ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("cantidad", {
                required: "Campo obligatorio",
                min: { value: 1, message: "Debe ser mayor a 0" },
              })}
            />
            {errors.cantidad && (
              <div className="text-sm text-destructive">
                {errors.cantidad.message}
              </div>
            )}
          </div>

          {/* Precio estimado */}
          <div className="col-span-full md:col-span-3 mb-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Precio estimado (S/.) <span className="text-destructive">*</span>
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.precio_estimado
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
              {...register("precio_estimado", {
                required: "Campo obligatorio",
                min: { value: 0.01, message: "Debe ser mayor a 0" },
              })}
            />
            {errors.precio_estimado && (
              <div className="text-sm text-destructive">
                {errors.precio_estimado.message}
              </div>
            )}
          </div>

          {/* Descripción */}
          <div className="col-span-full mb-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Descripción <span className="text-destructive">*</span>
            </label>
            <textarea
              rows="2"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.descripcion
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
              {...register("descripcion", {
                required: "Campo obligatorio",
                minLength: {
                  value: 5,
                  message: "Debe tener al menos 5 caracteres",
                },
              })}
            ></textarea>
            {errors.descripcion && (
              <div className="text-sm text-destructive">
                {errors.descripcion.message}
              </div>
            )}
          </div>
        </div>

        {/* ===================== 📋 DETALLES DE LA SOLICITUD ===================== */}
        <h6 className="font-bold text-foreground mt-4 mb-3">
          Detalles de la solicitud
        </h6>

        <div className="grid grid-cols-12 gap-3">
          {/* Motivo */}
          <div className="col-span-full mb-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Motivo <span className="text-destructive">*</span>
            </label>
            <textarea
              rows="2"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.motivo ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("motivo", {
                required: "Campo obligatorio",
                minLength: {
                  value: 5,
                  message: "Debe tener al menos 5 caracteres",
                },
              })}
            ></textarea>
            {errors.motivo && (
              <div className="text-sm text-destructive">
                {errors.motivo.message}
              </div>
            )}
          </div>

          {/* Uso previsto */}
          <div className="col-span-full mb-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Uso previsto <span className="text-destructive">*</span>
            </label>
            <textarea
              rows="2"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.uso_previsto
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
              {...register("uso_previsto", {
                required: "Campo obligatorio",
                minLength: {
                  value: 5,
                  message: "Debe tener al menos 5 caracteres",
                },
              })}
            ></textarea>
            {errors.uso_previsto && (
              <div className="text-sm text-destructive">
                {errors.uso_previsto.message}
              </div>
            )}
          </div>
        </div>

        {/* ===================== 🚦 PRIORIDAD ===================== */}
        <h6 className="font-bold text-foreground mt-4 mb-3">Prioridad</h6>

        <div className="col-span-full md:col-span-4 mb-4">
          <select
            className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.prioridad ? "border-destructive focus-visible:ring-destructive" : ""}`}
            {...register("prioridad", { required: "Campo obligatorio" })}
          >
            <option value="">Seleccione prioridad</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
          {errors.prioridad && (
            <div className="text-sm text-destructive">
              {errors.prioridad.message}
            </div>
          )}
        </div>

        {/* ===================== ✍️ FIRMAS ===================== */}
        <h6 className="font-bold text-foreground mt-4 mb-3">Firmas</h6>

        <div className="grid grid-cols-12 gap-3">
          {/* Firma del solicitante */}
          <div className="col-span-full md:col-span-6 mb-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
              <PenLine size={18} />
              Firma del solicitante <span className="text-destructive">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.firmaSolicitante
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
              {...register("firmaSolicitante", {
                required: "Campo obligatorio",
              })}
            />
            {errors.firmaSolicitante && (
              <div className="text-sm text-destructive block">
                {errors.firmaSolicitante.message}
              </div>
            )}
          </div>

          {/* Firma del administrador */}
          <div className="col-span-full md:col-span-6 mb-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
              <PenLine size={18} />
              Firma del administrador{" "}
              <span className="text-destructive">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.firma_admin
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
              {...register("firma_admin", {
                required: "Campo obligatorio",
              })}
            />
            {errors.firma_admin && (
              <div className="text-sm text-destructive block">
                {errors.firma_admin.message}
              </div>
            )}
          </div>
        </div>

        {/* ===================== 🔘 BOTONES ===================== */}
        <div className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            className="btn-cerrar"
            disabled={isLoadingSave}
            onClick={onClose}
            variant="default"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="btn-guardar"
            disabled={isLoadingSave}
            variant="default"
          >
            {isLoadingSave ? "Guardando..." : "Guardar Solicitud"}
          </Button>
        </div>
      </form>
    </div>
  );
}
