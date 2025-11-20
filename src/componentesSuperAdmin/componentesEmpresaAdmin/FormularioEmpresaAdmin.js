import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";

export function FormularioEmpresaAdmin({ dataEmpresa = null, onClose }) {
  const isEditMode = Boolean(dataEmpresa);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      nombre: "",
      direccion: "",
      ruc: "",
      telefono: "",
      email: "",
      pagina: "",
      logo: "",
    },
  });

  useEffect(() => {
    if (dataEmpresa) {
      reset({
        nombre: dataEmpresa.nombre ?? "",
        direccion: dataEmpresa.direccion ?? "",
        ruc: dataEmpresa.ruc ?? "",
        telefono: dataEmpresa.numero ?? dataEmpresa.telefono ?? "",
        email: dataEmpresa.correo ?? dataEmpresa.email ?? "",
        pagina: dataEmpresa.pagina ?? "",
      });

      const existingLogo = dataEmpresa.logo ?? dataEmpresa.logo ?? "";
      setPreviewUrl(existingLogo ? `${BASE_URL}/storage/${existingLogo}` : "");
    } else {
      reset({
        nombre: "",
        direccion: "",
        ruc: "",
        telefono: "",
        email: "",
        pagina: "",
        logo: "",
      });
      setPreviewUrl("");
      setSelectedFile(null);
    }
  }, [dataEmpresa, reset, BASE_URL]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setSelectedFile(file);
    } else {
      // Si el usuario cancela, volvemos a la imagen original o vacío
      setSelectedFile(null);
      setPreviewUrl(
        dataEmpresa?.logo ? `${BASE_URL}/storage/${dataEmpresa.logo}` : ""
      );
    }
  };

  const onSubmit = async (values) => {
    try {
      const url = isEditMode
        ? `/superadmin/empresas/${dataEmpresa.id}`
        : "/superadmin/empresas";

      const formData = new FormData();

      // 1. Agregar archivo solo si existe uno NUEVO seleccionado
      if (selectedFile) {
        formData.append("logo", selectedFile);
      }

      // 2. Agregar campos de texto
      formData.append("nombre", values.nombre);
      formData.append("direccion", values.direccion || "");
      formData.append("ruc", values.ruc || "");
      formData.append("telefono", values.telefono || "");
      formData.append("email", values.email || "");

      // 3. Truco para Laravel PUT con archivos
      if (isEditMode) {
        formData.append("_method", "PUT");
      }

      // 4. Enviar siempre como POST (Laravel maneja el _method internamente)
      // IMPORTANTE: No agregamos cabeceras manuales aquí, dejamos que Axios detecte el FormData
      const resp = await axiosInstance.post(url, formData);

      queryClient.invalidateQueries({ queryKey: ["empresasAdmin"] });

      const successMsg =
        resp?.data?.message ??
        (isEditMode ? "Empresa actualizada" : "Empresa creada");

      ToastAlert("success", successMsg);

      if (onClose) onClose();
    } catch (err) {
      console.error("Error al guardar empresa:", err);

      if (err.response?.status === 422) {
        const errorsResponse = err.response.data.errors || {};
        const messages = Array.isArray(errorsResponse)
          ? errorsResponse
          : Object.values(errorsResponse).flat();

        if (messages.length) {
          messages.forEach((m) => ToastAlert("error", m));
        } else {
          ToastAlert(
            "error",
            err.response.data.message || "Error de validación"
          );
        }
        return;
      }

      ToastAlert(
        "error",
        err.response?.data?.message || "Error al guardar la empresa"
      );
    }
  };

  return (
    <div className="p-3">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-3 d-flex flex-column gap-3 align-items-start">
          {/* Preview de la imagen */}
          <div className="card m-auto bg-white p-2 border rounded-pill overflow-hidden">
            <div
              className="rounded-pill position-relative"
              style={{
                width: 92,
                height: 92,
                background: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  className="rounded-pill"
                />
              ) : (
                <span className="small text-muted">Sin img</span>
              )}
            </div>
          </div>

          <div className="flex-grow-1 w-100">
            <label className="form-label small d-block">Logo / Foto</label>
            <input
              type="file"
              accept="image/*"
              className={`form-control ${errors.logo ? "is-invalid" : ""}`}
              // --- CORRECCIÓN IMPORTANTE AQUÍ ---
              // Usamos el onChange dentro de la configuración de register para no perderlo
              {...register("logo", {
                onChange: (e) => handleFileChange(e), // Conectamos nuestro handler aquí
                validate: () => {
                  if (!selectedFile) return true;
                  const allowed = [
                    "image/jpeg",
                    "image/png",
                    "image/webp",
                    "image/svg+xml",
                  ];
                  if (!allowed.includes(selectedFile.type))
                    return "Formato no soportado (jpg, png, webp)";
                  const maxSize = 4 * 1024 * 1024; // 4MB (coincide con tu back)
                  if (selectedFile.size > maxSize)
                    return "Imagen demasiado grande (máx 4MB)";
                  return true;
                },
              })}
            />
            {errors.logo && (
              <div className="invalid-feedback">{errors.logo.message}</div>
            )}
            <small className="text-muted">
              Formatos: jpg, png, webp. Máx 4MB.
            </small>
          </div>
        </div>

        {/* Resto de campos (Sin cambios mayores) */}
        <div className="mb-3">
          <label className="form-label small">Nombre de la Empresa*</label>
          <input
            type="text"
            className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
            {...register("nombre", {
              required: "El nombre es obligatorio",
              minLength: { value: 3, message: "Mínimo 3 caracteres" },
              maxLength: { value: 100, message: "Máximo 100 caracteres" },
            })}
          />
          {errors.nombre && (
            <div className="invalid-feedback">{errors.nombre.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label small">Dirección*</label>
          <input
            type="text"
            className={`form-control ${errors.direccion ? "is-invalid" : ""}`}
            {...register("direccion", {
              required: "La dirección es obligatoria",
              minLength: { value: 5, message: "Mínimo 5 caracteres" },
            })}
          />
          {errors.direccion && (
            <div className="invalid-feedback">{errors.direccion.message}</div>
          )}
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label small">RUC*</label>
            <input
              type="text"
              inputMode="numeric"
              className={`form-control ${errors.ruc ? "is-invalid" : ""}`}
              {...register("ruc", {
                required: "El RUC es obligatorio",
                pattern: {
                  value: /^\d{11}$/,
                  message: "El RUC debe tener 11 dígitos",
                },
              })}
            />
            {errors.ruc && (
              <div className="invalid-feedback">{errors.ruc.message}</div>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label small">Teléfono*</label>
            <input
              type="tel"
              className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
              {...register("telefono", {
                required: "El teléfono es obligatorio",
                pattern: {
                  value: /^[0-9+\s\-]{7,15}$/,
                  message: "Teléfono inválido",
                },
              })}
            />
            {errors.telefono && (
              <div className="invalid-feedback">{errors.telefono.message}</div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label small">Email*</label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            {...register("email", {
              required: "El email es obligatorio",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email inválido",
              },
            })}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn-cerrar-modal"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-guardar" disabled={isSubmitting}>
            {isEditMode ? "Actualizar Empresa" : "Crear Empresa"}
          </button>
        </div>
      </form>
    </div>
  );
}
