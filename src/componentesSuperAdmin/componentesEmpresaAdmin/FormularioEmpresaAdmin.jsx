import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance, { STORAGE_BASE_URL } from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import { Button } from "../../components/ui/button";
import { Card } from "@/components/ui/card";

export function FormularioEmpresaAdmin({ dataEmpresa = null, onClose }) {
  const isEditMode = Boolean(dataEmpresa);
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
      setPreviewUrl(
        existingLogo
          ? /^https?:\/\//i.test(existingLogo)
            ? existingLogo
            : `${STORAGE_BASE_URL}/storage/${existingLogo.replace(/^\/+/, "")}`
          : "",
      );
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
  }, [dataEmpresa, reset]);

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
        dataEmpresa?.logo
          ? /^https?:\/\//i.test(dataEmpresa.logo)
            ? dataEmpresa.logo
            : `${STORAGE_BASE_URL}/storage/${dataEmpresa.logo.replace(/^\/+/, "")}`
          : "",
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
            err.response.data.message || "Error de validación",
          );
        }
        return;
      }

      ToastAlert(
        "error",
        err.response?.data?.message || "Error al guardar la empresa",
      );
    }
  };

  return (
    <div className="p-3">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-3 flex flex-col gap-3 items-start">
          {/* Preview de la imagen */}
          <Card className="m-auto bg-background p-2 rounded-full overflow-hidden">
            <div
              className="rounded-full relative"
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
                  className="rounded-full"
                />
              ) : (
                <span className="text-sm text-muted-foreground">Sin img</span>
              )}
            </div>
          </Card>

          <div className="grow w-full">
            <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm block">
              Logo / Foto
            </label>
            <input
              type="file"
              accept="image/*"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.logo ? "border-destructive focus-visible:ring-destructive" : ""}`}
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
              <div className="text-sm text-destructive">
                {errors.logo.message}
              </div>
            )}
            <small className="text-muted-foreground">
              Formatos: jpg, png, webp. Máx 4MB.
            </small>
          </div>
        </div>

        {/* Resto de campos (Sin cambios mayores) */}
        <div className="mb-3">
          <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
            Nombre de la Empresa*
          </label>
          <input
            type="text"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.nombre ? "border-destructive focus-visible:ring-destructive" : ""}`}
            {...register("nombre", {
              required: "El nombre es obligatorio",
              minLength: { value: 3, message: "Mínimo 3 caracteres" },
              maxLength: { value: 100, message: "Máximo 100 caracteres" },
            })}
          />
          {errors.nombre && (
            <div className="text-sm text-destructive">
              {errors.nombre.message}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
            Dirección*
          </label>
          <input
            type="text"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.direccion ? "border-destructive focus-visible:ring-destructive" : ""}`}
            {...register("direccion", {
              required: "La dirección es obligatoria",
              minLength: { value: 5, message: "Mínimo 5 caracteres" },
            })}
          />
          {errors.direccion && (
            <div className="text-sm text-destructive">
              {errors.direccion.message}
            </div>
          )}
        </div>

        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-full md:col-span-6 mb-3">
            <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
              RUC*
            </label>
            <input
              type="text"
              inputMode="numeric"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.ruc ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("ruc", {
                required: "El RUC es obligatorio",
                pattern: {
                  value: /^\d{11}$/,
                  message: "El RUC debe tener 11 dígitos",
                },
              })}
            />
            {errors.ruc && (
              <div className="text-sm text-destructive">
                {errors.ruc.message}
              </div>
            )}
          </div>

          <div className="col-span-full md:col-span-6 mb-3">
            <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
              Teléfono*
            </label>
            <input
              type="tel"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.telefono ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("telefono", {
                required: "El teléfono es obligatorio",
                pattern: {
                  value: /^[0-9+\s\-]{7,15}$/,
                  message: "Teléfono inválido",
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

        <div className="mb-3">
          <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
            Email*
          </label>
          <input
            type="email"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
            {...register("email", {
              required: "El email es obligatorio",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email inválido",
              },
            })}
          />
          {errors.email && (
            <div className="text-sm text-destructive">
              {errors.email.message}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            className="btn-cerrar-modal"
            onClick={onClose}
            disabled={isSubmitting}
            variant="default"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="btn-guardar"
            disabled={isSubmitting}
            variant="default"
          >
            {isEditMode ? "Actualizar Empresa" : "Crear Empresa"}
          </Button>
        </div>
      </form>
    </div>
  );
}
