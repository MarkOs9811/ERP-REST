import { useState } from "react";
import { useForm } from "react-hook-form";
import ToastAlert from "../../componenteToast/ToastAlert";
import axiosInstance from "../../../api/AxiosInstance";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "../../ui/button";

export function TesseractFormIntegracion({ dataIntegracion }) {
  const tesseractConfig =
    dataIntegracion?.nombre === "tesseract" ? dataIntegracion : null;

  const defaultValues = tesseractConfig
    ? {
        rutaEjecutable: tesseractConfig?.valor1 || "",
        rutaCarpetaIdioma: tesseractConfig?.valor2 || "",
        codigoIdioma: tesseractConfig?.valor3 || "",
      }
    : {
        rutaEjecutable: "",
        rutaCarpetaIdioma: "",
        codigoIdioma: "",
      };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(
        `/configuraciones/${tesseractConfig.id}`,
        {
          rutaEjecutable: data.rutaEjecutable.trim(),
          rutaCarpetaIdioma: data.rutaCarpetaIdioma.trim(),
          codigoIdioma: data.codigoIdioma.trim(),
        },
      );
      if (response.data.success) {
        ToastAlert("success", "Configuración guardada con éxito");
        setIsEditing(false);
      } else {
        ToastAlert("error", "Error al guardar la configuración");
      }
    } catch (error) {
      console.error("Error al guardar la configuración:", error);
      ToastAlert("error", "Error al guardar la configuración");
    } finally {
      setLoading(false);
    }
  };

  if (!tesseractConfig) {
    return <p>No se encontró configuración para Google Service</p>;
  }

  const isConfigured =
    tesseractConfig?.valor1?.trim() !== "" &&
    tesseractConfig?.valor2?.trim() !== "";
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-3">
      <div className="mb-3 overflow-hidden rounded-xl bg-card text-card-foreground shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          <div className="col-span-full relative flex items-center justify-center bg-muted">
            <div className="animate-icon"></div>
          </div>

          <div className="col-span-full p-4">
            <h3 className="mb-3 font-bold text-primary">
              ¿Qué es Tesseract OCR?
            </h3>
            <p className="text-muted-foreground">
              <strong>Tesseract OCR</strong> es una herramienta de
              reconocimiento óptico de caracteres (OCR). Permite convertir
              imágenes o documentos escaneados en{" "}
              <span className="font-semibold">texto editable</span>. Descargar
              desde{" "}
              <a
                href="https://sourceforge.net/projects/tesseract-ocr.mirror/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Descargar Tesseract OCR
              </a>
            </p>
            <ul className="m-0 list-none p-0">
              <li>✔️ Extrae texto de imágenes y PDFs</li>
              <li>
                ✔️ Compatible con más de{" "}
                <span className="font-semibold">100 idiomas</span>
              </li>
              <li>✔️ Fácil de integrar en aplicaciones</li>
              <li>✔️ Gratuito y de código abierto</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Card de validación */}
      <div
        className={`relative w-full rounded-lg text-sm p-3 mb-3 border-0 shadow-sm ${
          isConfigured
            ? "rounded-md border-emerald-600/30 bg-emerald-600/10 p-4 text-emerald-800 dark:text-emerald-300 "
            : "rounded-md border-destructive/50 bg-destructive/10 p-4 text-destructive "
        }`}
      >
        {isConfigured ? (
          <span className="text-sm">
            <CheckCircle size={24} className="me-2" />
            Todo correcto, puedes continuar con la configuración.
          </span>
        ) : (
          <span className="text-sm">
            <XCircle size={24} className="me-2" />
            Faltan credenciales. Crea un servicio en{" "}
            <a
              href="https://console.cloud.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline"
            >
              Google Cloud Console
            </a>
            .
          </span>
        )}
      </div>

      {/* Campos del formulario */}
      <div className="mb-3">
        <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
          Ruta del ejecutable
        </label>
        <input
          type="text"
          disabled={!isEditing}
          className={`text-muted-foreground h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
            errors.rutaEjecutable
              ? "border-destructive focus-visible:ring-destructive"
              : ""
          }`}
          {...register("rutaEjecutable", {
            required: "Este campo es obligatorio.",
            validate: (v) =>
              /^\S+$/.test(v) ||
              "El valor no debe contener espacios ni saltos de línea",
          })}
          placeholder="Ingresa la ruta del ejecutable"
        />
        {errors.rutaEjecutable && (
          <div className="text-sm text-destructive">
            {errors.rutaEjecutable.message}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
          Ruta de carpeta de idiomas
        </label>
        <input
          type="text"
          disabled={!isEditing}
          className={`text-muted-foreground h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
            errors.rutaCarpetaIdioma
              ? "border-destructive focus-visible:ring-destructive"
              : ""
          }`}
          {...register("rutaCarpetaIdioma", {
            required: "Este campo es obligatorio.",
            validate: (v) =>
              /^\S+$/.test(v) ||
              "El valor no debe contener espacios ni saltos de línea",
          })}
          placeholder="Ingresa la ruta de carpeta de idiomas"
        />
        {errors.rutaCarpetaIdioma && (
          <div className="text-sm text-destructive">
            {errors.rutaCarpetaIdioma.message}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
          Codigo de idioma
        </label>
        <input
          type="text"
          disabled={!isEditing}
          className={`text-muted-foreground h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
            errors.codigoIdioma
              ? "border-destructive focus-visible:ring-destructive"
              : ""
          }`}
          {...register("codigoIdioma", {
            required: "Este campo es obligatorio.",
            validate: (v) =>
              /^\S+$/.test(v) ||
              "El valor no debe contener espacios ni saltos de línea",
          })}
          placeholder="Ingresa el codigo de idioma"
        />
        <small className="text-muted-foreground">Por ejemplo: spa</small>
        {errors.codigoIdioma && (
          <div className="text-sm text-destructive">
            {errors.codigoIdioma.message}
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-2">
        {!isEditing ? (
          <Button
            type="button"
            className="btn-editar"
            onClick={() => setIsEditing(true)}
            variant="secondary"
          >
            Editar
          </Button>
        ) : (
          <>
            <Button
              type="button"
              className="btn-cancelar"
              onClick={() => setIsEditing(false)}
              disabled={loading}
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
          </>
        )}
      </div>
    </form>
  );
}
