import { useForm } from "react-hook-form";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";
import { AlertCircle, FileSignature, ShieldCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";


export function FormularioFirmarDoc() {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("pdf_file", data.pdf_file[0]);
      formData.append("image_file", data.image_file[0]);

      const response = await axiosInstance.post("/firmar-solicitud", formData);

      if (response.data.success) {
        ToastAlert("success", "Documento firmado con éxito");

        // Ya recibimos la URL completa y absoluta desde S3/R2 gracias al modelo de Laravel
        const pdfUrl = response.data.pdf_url;

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
      <CardContent className="p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          autoComplete="off"
        >
          <div className="mb-4">
            <label htmlFor="pdf_file" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-semibold">
              <FileSignature className="me-2" />
              Seleccionar PDF <span className="text-destructive">*</span>
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
              className={`h-9 w-full border-input bg-background px-3 py-1 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-2 rounded-md shadow-sm ${
                errors.pdf_file ? "border-destructive" : "border-muted"
              }`}
            />
            {errors.pdf_file && (
              <div className="text-destructive text-sm mt-1 flex items-center">
                <AlertCircle size={16} className="me-1" />
                {errors.pdf_file.message}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="image_file" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-semibold">
              <ShieldCheck className="me-2" />
              Cargar firma (imagen) <span className="text-destructive">*</span>
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
              className={`h-9 w-full border-input bg-background px-3 py-1 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-2 rounded-md shadow-sm ${
                errors.image_file ? "border-destructive" : "border-muted"
              }`}
            />
            <div className="text-sm text-amber-600 dark:text-amber-400 flex items-center mt-1">
              <AlertCircle size={16} className="me-1" />
              El archivo cargado no debe ser pesado
            </div>
            {errors.image_file && (
              <div className="text-destructive text-sm mt-1 flex items-center">
                <AlertCircle size={16} className="me-1" />
                {errors.image_file.message}
              </div>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              className="btn-guardar inline-flex justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-10 px-8 items-center shadow"
              disabled={isSubmitting}
             variant="default">
              <FileSignature size={20} />
              {isSubmitting ? (
                <span className="ms-2">Firmando...</span>
              ) : (
                <span className="ms-2">Firmar</span>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="bg-muted rounded-b-lg py-3 text-center">
        <span className="text-muted-foreground">
          <ShieldCheck className="me-1 text-emerald-600 dark:text-emerald-400" />
          Solo se permite PDF y firma en imagen. Todos los campos son
          obligatorios.
        </span>
      </CardFooter>
    </div>
  );
}
