import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../api/AxiosInstance";

export function FormularioEmpresaAdmin({
  dataEmpresa = null,
  onClose,
  onSaved,
}) {
  const isEditMode = Boolean(dataEmpresa);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

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
        logo: dataEmpresa.logo ?? dataEmpresa.logo ?? "",
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
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(
        dataEmpresa
          ? dataEmpresa.logo
            ? `${BASE_URL}/storage/${dataEmpresa.logo}`
            : ""
          : ""
      );
      return;
    }
    // preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setSelectedFile(file);
  };

  const onSubmit = async (values) => {
    try {
      // If there is a selected file, send multipart/form-data
      if (selectedFile) {
        const formData = new FormData();
        formData.append("logo", selectedFile);
        formData.append("nombre", values.nombre);
        formData.append("direccion", values.direccion);
        formData.append("ruc", values.ruc);
        formData.append("telefono", values.telefono);
        formData.append("email", values.email);
        if (values.pagina) formData.append("pagina", values.pagina);

        if (isEditMode) {
          const resp = await axiosInstance.put(
            `/superadmin/empresas${dataEmpresa.id}`,
            formData
          );
          if (onSaved) onSaved(resp.data);
        } else {
          const resp = await axiosInstance.post(
            "/superadmin/empresas",
            formData
          );
          if (onSaved) onSaved(resp.data);
        }
      } else {
        // No file selected: send JSON
        const payload = {
          nombre: values.nombre,
          direccion: values.direccion,
          ruc: values.ruc,
          telefono: values.telefono,
          email: values.email,
          pagina: values.pagina,
        };

        if (isEditMode) {
          const resp = await axiosInstance.put(
            `/superadmin/empresas/${dataEmpresa.id}`,
            payload
          );
          if (onSaved) onSaved(resp.data);
        } else {
          const resp = await axiosInstance.post(
            "/superadmin/empresas",
            payload
          );
          if (onSaved) onSaved(resp.data);
        }
      }

      if (onClose) onClose();
    } catch (err) {
      console.error("Error al guardar empresa:", err);
      // aquí puedes mostrar mensajes de error concretos con tu ToastAlert
      throw err;
    }
  };

  return (
    <div className="p-3">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-3 d-flex flex-column gap-3 align-items-start">
          <div className="card m-auto bg-white p-2 border rounded-pill overflow-hidden">
            <div
              className="rounded-pill"
              style={{
                width: 92,
                height: 92,
                borderRadius: 8,
                overflow: "hidden",
                background: "#f3f4f6",
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
                <div className="d-flex align-items-center justify-content-center w-100 h-100 text-muted">
                  No imagen
                </div>
              )}
            </div>
          </div>

          <div className="flex-grow-1">
            <label className="form-label small d-block">Logo / Foto</label>
            <input
              type="file"
              accept="image/*"
              className={`form-control ${errors.logo ? "is-invalid" : ""}`}
              onChange={handleFileChange}
              {...register("logo", {
                validate: (fileList) => {
                  // fileList comes from input; but we use selectedFile state — keep validation minimal
                  if (!selectedFile) return true;
                  const allowed = ["image/jpeg", "image/png", "image/webp"];
                  if (!allowed.includes(selectedFile.type))
                    return "Formato no soportado (jpg, png, webp)";
                  const maxSize = 2 * 1024 * 1024; // 2MB
                  if (selectedFile.size > maxSize)
                    return "Imagen demasiado grande (máx 2MB)";
                  return true;
                },
              })}
            />
            {errors.logo && (
              <div className="invalid-feedback">{errors.logo.message}</div>
            )}
            <small className="text-muted">
              Formatos: jpg, png, webp. Máx 2MB.
            </small>
          </div>
        </div>

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
              maxLength: { value: 200, message: "Máximo 200 caracteres" },
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
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isEditMode ? "Actualizar Empresa" : "Crear Empresa"}
          </button>
        </div>
      </form>
    </div>
  );
}
