import { useState } from "react";
import { useForm } from "react-hook-form";
import ToastAlert from "../../componenteToast/ToastAlert";
import axiosInstance from "../../../api/AxiosInstance";
import { CheckCircle, XCircle } from "lucide-react";

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
        }
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
      <div class="card  border mb-3 rounded-4 overflow-hidden">
        <div class="row g-0">
          <div class="col-md-12 d-flex align-items-center justify-content-center bg-light position-relative">
            <div class="animate-icon"></div>
          </div>

          <div class="col-md-12 p-4">
            <h3 class="fw-bold text-primary mb-3">¿Qué es Tesseract OCR?</h3>
            <p class="text-muted">
              <strong>Tesseract OCR</strong> es una herramienta de
              reconocimiento óptico de caracteres (OCR). Permite convertir
              imágenes o documentos escaneados en{" "}
              <span class="fw-semibold">texto editable</span>. Descargar desde{" "}
              <a
                href="https://sourceforge.net/projects/tesseract-ocr.mirror/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Descargar Tesseract OCR
              </a>
            </p>
            <ul class="list-unstyled">
              <li>✔️ Extrae texto de imágenes y PDFs</li>
              <li>
                ✔️ Compatible con más de{" "}
                <span class="fw-semibold">100 idiomas</span>
              </li>
              <li>✔️ Fácil de integrar en aplicaciones</li>
              <li>✔️ Gratuito y de código abierto</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Card de validación */}
      <div
        className={`alert  p-3 mb-3 border-0 shadow-sm ${
          isConfigured ? "alert-success " : "alert-danger "
        }`}
      >
        {isConfigured ? (
          <span className="small">
            <CheckCircle size={24} className="me-2" />
            Todo correcto, puedes continuar con la configuración.
          </span>
        ) : (
          <span className="small">
            <XCircle size={24} className="me-2" />
            Faltan credenciales. Crea un servicio en{" "}
            <a
              href="https://console.cloud.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className=" fw-bold text-decoration-underline"
            >
              Google Cloud Console
            </a>
            .
          </span>
        )}
      </div>

      {/* Campos del formulario */}
      <div className="mb-3">
        <label className="form-label small">Ruta del ejecutable</label>
        <input
          type="text"
          disabled={!isEditing}
          className={`text-muted form-control ${
            errors.rutaEjecutable ? "is-invalid" : ""
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
          <div className="invalid-feedback">
            {errors.rutaEjecutable.message}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label small">Ruta de carpeta de idiomas</label>
        <input
          type="text"
          disabled={!isEditing}
          className={`text-muted form-control ${
            errors.rutaCarpetaIdioma ? "is-invalid" : ""
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
          <div className="invalid-feedback">
            {errors.rutaCarpetaIdioma.message}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label small">Codigo de idioma</label>
        <input
          type="text"
          disabled={!isEditing}
          className={`text-muted form-control ${
            errors.codigoIdioma ? "is-invalid" : ""
          }`}
          {...register("codigoIdioma", {
            required: "Este campo es obligatorio.",
            validate: (v) =>
              /^\S+$/.test(v) ||
              "El valor no debe contener espacios ni saltos de línea",
          })}
          placeholder="Ingresa el codigo de idioma"
        />
        <small className="text-muted">Por ejemplo: spa</small>
        {errors.codigoIdioma && (
          <div className="invalid-feedback">{errors.codigoIdioma.message}</div>
        )}
      </div>

      {/* Botones */}
      <div className="d-flex justify-content-end gap-2">
        {!isEditing ? (
          <button
            type="button"
            className="btn-editar"
            onClick={() => setIsEditing(true)}
          >
            Editar
          </button>
        ) : (
          <>
            <button
              type="button"
              className="btn-cancelar"
              onClick={() => setIsEditing(false)}
              disabled={loading}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-guardar" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </>
        )}
      </div>
    </form>
  );
}
