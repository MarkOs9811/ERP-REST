import { useForm } from "react-hook-form";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetProveedores } from "../../../service/GetProveedores";
import { Tag, TruckIcon, PenLine, Store, StoreIcon } from "lucide-react";
import { GetUnidades } from "../../../service/serviceAlmacen/GetUnidades";
import axiosInstance from "../../../api/AxiosInstance";
import { GetAreas } from "../../../service/GetAreas";
import ToastAlert from "../../componenteToast/ToastAlert";

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
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // ✅ Si devuelve PDF, abrirlo
      const pdfUrl = response?.data?.pdf_url;
      if (pdfUrl) window.open(pdfUrl, "_blank");

      ToastAlert("success", "Solicitud creada correctamente 🎉");
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
            `Error ${status}: ${data?.message || "Error del servidor"}`
          );
        }
      }
      // 🌐 Sin respuesta del servidor
      else if (error.request) {
        ToastAlert(
          "error",
          "No se recibió respuesta del servidor. Verifica tu conexión."
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
        <h6 className="fw-bold text-dark mb-3">Datos del solicitante</h6>

        <div className="row">
          <div className="col-md-6 mb-3 position-relative">
            <label className="form-label">
              Area <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <StoreIcon />
              </span>
              <select
                className={`form-select ${
                  errors.proveedor ? "is-invalid" : ""
                }`}
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
                <div className="invalid-feedback d-block">
                  {errors.area_origen.message}
                </div>
              )}
            </div>
          </div>

          {/* Nombre del solicitante */}
          <div className="col-md-6 mb-3">
            <label className="form-label">
              Nombre del solicitante <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${
                errors.nombre_solicitante ? "is-invalid" : ""
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
              <div className="invalid-feedback">
                {errors.nombre_solicitante.message}
              </div>
            )}
          </div>

          {/* Correo electrónico */}
          <div className="col-md-6 mb-3">
            <label className="form-label">
              Correo electrónico <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              className={`form-control ${
                errors.correo_electronico ? "is-invalid" : ""
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
              <div className="invalid-feedback">
                {errors.correo_electronico.message}
              </div>
            )}
          </div>

          {/* Teléfono */}
          <div className="col-md-6 mb-3">
            <label className="form-label">
              Teléfono <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
              {...register("telefono", {
                required: "Campo obligatorio",
                pattern: {
                  value: /^[0-9]{6,15}$/,
                  message: "Teléfono inválido (solo números)",
                },
              })}
            />
            {errors.telefono && (
              <div className="invalid-feedback">{errors.telefono.message}</div>
            )}
          </div>
        </div>

        {/* ===================== 📦 DATOS DEL PRODUCTO ===================== */}
        <h6 className="fw-bold text-dark mt-4 mb-3">Datos del producto</h6>

        <div className="row">
          {/* Proveedor */}
          <div className="col-md-6 mb-3 position-relative">
            <label className="form-label">
              Proveedor <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <TruckIcon />
              </span>
              <select
                className={`form-select ${
                  errors.proveedor ? "is-invalid" : ""
                }`}
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
                <div className="invalid-feedback d-block">
                  {errors.proveedor.message}
                </div>
              )}
            </div>
          </div>

          {/* Unidad de medida */}
          <div className="col-md-6 mb-3 position-relative">
            <label className="form-label">
              Unidad de medida <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <Tag />
              </span>
              <select
                className={`form-select ${
                  errors.unidad_medida ? "is-invalid" : ""
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
                <div className="invalid-feedback d-block">
                  {errors.unidad_medida.message}
                </div>
              )}
            </div>
          </div>

          {/* Marca */}
          <div className="col-md-6 mb-3">
            <label className="form-label">
              Marca del producto <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${
                errors.marcaProducto ? "is-invalid" : ""
              }`}
              {...register("marcaProducto", { required: "Campo obligatorio" })}
            />
            {errors.marcaProducto && (
              <div className="invalid-feedback">
                {errors.marcaProducto.message}
              </div>
            )}
          </div>

          {/* Cantidad */}
          <div className="col-md-3 mb-3">
            <label className="form-label">
              Cantidad <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              min="1"
              step="1"
              className={`form-control ${errors.cantidad ? "is-invalid" : ""}`}
              {...register("cantidad", {
                required: "Campo obligatorio",
                min: { value: 1, message: "Debe ser mayor a 0" },
              })}
            />
            {errors.cantidad && (
              <div className="invalid-feedback">{errors.cantidad.message}</div>
            )}
          </div>

          {/* Precio estimado */}
          <div className="col-md-3 mb-3">
            <label className="form-label">
              Precio estimado (S/.) <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              className={`form-control ${
                errors.precio_estimado ? "is-invalid" : ""
              }`}
              {...register("precio_estimado", {
                required: "Campo obligatorio",
                min: { value: 0.01, message: "Debe ser mayor a 0" },
              })}
            />
            {errors.precio_estimado && (
              <div className="invalid-feedback">
                {errors.precio_estimado.message}
              </div>
            )}
          </div>

          {/* Descripción */}
          <div className="col-12 mb-3">
            <label className="form-label">
              Descripción <span className="text-danger">*</span>
            </label>
            <textarea
              rows="2"
              className={`form-control ${
                errors.descripcion ? "is-invalid" : ""
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
              <div className="invalid-feedback">
                {errors.descripcion.message}
              </div>
            )}
          </div>
        </div>

        {/* ===================== 📋 DETALLES DE LA SOLICITUD ===================== */}
        <h6 className="fw-bold text-dark mt-4 mb-3">
          Detalles de la solicitud
        </h6>

        <div className="row">
          {/* Motivo */}
          <div className="col-12 mb-3">
            <label className="form-label">
              Motivo <span className="text-danger">*</span>
            </label>
            <textarea
              rows="2"
              className={`form-control ${errors.motivo ? "is-invalid" : ""}`}
              {...register("motivo", {
                required: "Campo obligatorio",
                minLength: {
                  value: 5,
                  message: "Debe tener al menos 5 caracteres",
                },
              })}
            ></textarea>
            {errors.motivo && (
              <div className="invalid-feedback">{errors.motivo.message}</div>
            )}
          </div>

          {/* Uso previsto */}
          <div className="col-12 mb-3">
            <label className="form-label">
              Uso previsto <span className="text-danger">*</span>
            </label>
            <textarea
              rows="2"
              className={`form-control ${
                errors.uso_previsto ? "is-invalid" : ""
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
              <div className="invalid-feedback">
                {errors.uso_previsto.message}
              </div>
            )}
          </div>
        </div>

        {/* ===================== 🚦 PRIORIDAD ===================== */}
        <h6 className="fw-bold text-dark mt-4 mb-3">Prioridad</h6>

        <div className="col-md-4 mb-4">
          <select
            className={`form-select ${errors.prioridad ? "is-invalid" : ""}`}
            {...register("prioridad", { required: "Campo obligatorio" })}
          >
            <option value="">Seleccione prioridad</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
          {errors.prioridad && (
            <div className="invalid-feedback">{errors.prioridad.message}</div>
          )}
        </div>

        {/* ===================== ✍️ FIRMAS ===================== */}
        <h6 className="fw-bold text-dark mt-4 mb-3">Firmas</h6>

        <div className="row">
          {/* Firma del solicitante */}
          <div className="col-md-6 mb-3">
            <label className="form-label">
              Firma del solicitante <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <PenLine />
              </span>
              <input
                type="file"
                accept="image/*"
                className={`form-control ${
                  errors.firmaSolicitante ? "is-invalid" : ""
                }`}
                {...register("firmaSolicitante", {
                  required: "Campo obligatorio",
                })}
              />
              {errors.firmaSolicitante && (
                <div className="invalid-feedback d-block">
                  {errors.firmaSolicitante.message}
                </div>
              )}
            </div>
          </div>

          {/* Firma del administrador */}
          <div className="col-md-6 mb-3">
            <label className="form-label">
              Firma del administrador <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <PenLine />
              </span>
              <input
                type="file"
                accept="image/*"
                className={`form-control ${
                  errors.firma_admin ? "is-invalid" : ""
                }`}
                {...register("firma_admin", {
                  required: "Campo obligatorio",
                })}
              />
              {errors.firma_admin && (
                <div className="invalid-feedback d-block">
                  {errors.firma_admin.message}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===================== 🔘 BOTONES ===================== */}
        <div className="mt-4 d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn-cerrar-modal"
            disabled={isLoadingSave}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-guardar"
            disabled={isLoadingSave}
          >
            {isLoadingSave ? "Guardando..." : "Guardar Solicitud"}
          </button>
        </div>
      </form>
    </div>
  );
}
