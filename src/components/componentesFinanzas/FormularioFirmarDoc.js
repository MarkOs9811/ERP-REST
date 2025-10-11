import { useForm } from "react-hook-form";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";
import { AlertCircle, FileSignature, ShieldCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export function FormularioFirmarDoc() {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const API_BASE_URL = process.env.REACT_APP_BASE_URL; // O usa process.env.REACT_APP_API_URL
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("pdf_file", data.pdf_file[0]);
      formData.append("image_file", data.image_file[0]);
      const response = await axiosInstance.post("/firmar-solicitud", formData);
      if (response.data.success) {
        ToastAlert("success", "Documento firmado con éxito");
        let pdfUrl = response.data.pdf_url;
        // Si la URL es relativa, concatena la base
        if (pdfUrl && pdfUrl.startsWith("/")) {
          pdfUrl = API_BASE_URL + pdfUrl;
        }
        if (pdfUrl) {
          window.open(pdfUrl, "_blank", "noopener,noreferrer");
        }
        queryClient.refetchQueries(["documentosFirmados"]);
        reset();
      } else {
        ToastAlert("error", "Error al firmar el documento");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        ToastAlert("error", error.response.data.message);
      } else {
        ToastAlert("error", "Error al firmar el documento");
      }
    }
  };
  return (
    <div>
      <div className="card-body p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          autoComplete="off"
        >
          <div className="mb-4">
            <label htmlFor="pdf_file" className="form-label fw-semibold">
              <FileSignature className="me-2 " />
              Seleccionar PDF <span className="text-danger">*</span>
            </label>
            <input
              type="file"
              id="pdf_file"
              accept="application/pdf"
              {...register("pdf_file", {
                required: "El PDF es obligatorio",
                validate: {
                  isPdf: (files) =>
                    (files &&
                      files[0] &&
                      files[0].type === "application/pdf") ||
                    "Solo se permite archivos PDF",
                  size: (files) =>
                    (files && files[0] && files[0].size < 2 * 1024 * 1024) ||
                    "El PDF no debe superar 2MB",
                },
              })}
              className={`form-control border-2 rounded-3 shadow-sm ${
                errors.pdf_file ? "border-danger" : "border-muted"
              }`}
            />
            {errors.pdf_file && (
              <div className="text-danger small mt-1 d-flex align-items-center">
                <AlertCircle size={16} className="me-1" />
                {errors.pdf_file.message}
              </div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="image_file" className="form-label fw-semibold">
              <ShieldCheck className="me-2" />
              Cargar firma (imagen) <span className="text-danger">*</span>
            </label>
            <input
              type="file"
              id="image_file"
              accept="image/*"
              {...register("image_file", {
                required: "La firma es obligatoria",
                validate: {
                  isImage: (files) =>
                    (files && files[0] && files[0].type.startsWith("image/")) ||
                    "Solo se permite archivos de imagen",
                  size: (files) =>
                    (files && files[0] && files[0].size < 1 * 1024 * 1024) ||
                    "La imagen no debe superar 1MB",
                },
              })}
              className={`form-control border-2 rounded-3 shadow-sm ${
                errors.image_file ? "border-danger" : "border-muted"
              }`}
            />
            <div className="form-text text-warning d-flex align-items-center mt-1">
              <AlertCircle size={16} className="me-1" />
              El archivo cargado no debe ser pesado
            </div>
            {errors.image_file && (
              <div className="text-danger small mt-1 d-flex align-items-center">
                <AlertCircle size={16} className="me-1" />
                {errors.image_file.message}
              </div>
            )}
          </div>
          <div className="d-flex justify-content-end mt-4">
            <button
              type="submit"
              className="btn-guardar btn-lg align-items-centershadow"
              disabled={isSubmitting}
            >
              <FileSignature size={20} />
              {isSubmitting ? (
                <span className="ms-2">Firmando...</span>
              ) : (
                <span className="ms-2">Firmar</span>
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="card-footer bg-light rounded-bottom-4 py-3 text-center">
        <span className="text-muted">
          <ShieldCheck className="me-1 text-success" />
          Solo se permite PDF y firma en imagen. Todos los campos son
          obligatorios.
        </span>
      </div>
    </div>
  );
}
