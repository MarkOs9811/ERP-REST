import { useEffect, useState } from "react";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { validatePrecio, handlePrecioInput } from "../../hooks/InputHandlers";
import {
  Utensils,
  AlignLeft,
  DollarSign,
  Tags,
  Image as ImageIcon,
  UploadCloud,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

// 🔥 IMPORTAMOS EL HELPER DE MONEDA
import { getMoneda } from "../../utils/currency";
import { Button } from "../ui/button";

export function PlatoAdd({ handleCloseModal }) {
  // Estado para la lógica de la imagen (separado de useForm)
  const [formData, setFormData] = useState({
    foto: null,
  });

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [categorias, setCategorias] = useState([]);
  const [fotoPreview, setFotoPreview] = useState(null);

  // GET CATEGORIAS
  useEffect(() => {
    const getCategoria = async () => {
      try {
        const response = await axiosInstance.get(
          "/gestionPlatos/getCategoriaTrue",
        );
        if (response.data.success) {
          setCategorias(response.data.data);
        }
      } catch (error) {
        console.log("error de conexion");
      }
    };
    getCategoria();
  }, []);

  // GUARDAR PLATO API
  const onSubmit = async (data) => {
    const formDataToSend = new FormData();
    formDataToSend.append("nombre", data.nombre);
    formDataToSend.append("descripcion", data.descripcion);
    formDataToSend.append("precio", data.precio);
    formDataToSend.append("categoria", data.categoria);

    if (fotoPreview && formData.foto) {
      formDataToSend.append("foto", formData.foto);
    }

    try {
      const response = await axiosInstance.post(
        "/gestionPlatos/addPlatos",
        formDataToSend,
      );

      if (response.data.success) {
        ToastAlert("success", "Registro exitoso!");
        queryClient.invalidateQueries({ queryKey: ["platos"] });
        handleCloseModal();
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      console.error("Error al enviar:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        let errorMessages = "";
        for (let field in errors) {
          errorMessages += `${errors[field].join(", ")}\n`;
        }
        ToastAlert("error", errorMessages.trim());
      } else {
        ToastAlert("error", "Error al registrar el plato");
      }
    }
  };

  // DROPZONE CONFIG
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        setFotoPreview(objectUrl);
        setFormData({ ...formData, foto: file });
      }
    },
  });

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* --- Sección de Imagen Minimalista --- */}
        <div className="mb-4">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground text-sm font-bold mb-2">
            <ImageIcon size={14} className="me-1" /> Imagen del Plato
          </label>

          <div
            {...getRootProps()}
            className={`border rounded-md flex items-center justify-center p-3 relative ${
              isDragActive ? "border-primary bg-muted" : "border-border/50"
            }`}
            style={{
              borderStyle: "dashed",
              minHeight: "140px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <input {...getInputProps()} />

            {fotoPreview ? (
              <div className="text-center w-full">
                <img
                  src={fotoPreview}
                  alt="Preview"
                  className="rounded shadow-sm"
                  style={{ maxHeight: "120px", objectFit: "cover" }}
                />
                <div className="mt-2 text-primary text-sm">
                  Click para cambiar
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <UploadCloud
                  size={32}
                  className="mb-2 text-muted-foreground opacity-50"
                />
                <p className="text-sm mb-0">Arrastra o haz click para subir</p>
              </div>
            )}
          </div>
        </div>

        {/* --- Grid de Campos --- */}
        <div className="grid grid-cols-12 gap-3">
          {/* Categoría */}
          <div className="col-span-full md:col-span-6">
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground text-sm font-bold">
              Categoría
            </label>
            <div className="flex w-full items-stretch">
              <select
                className={`h-9 w-full appearance-auto rounded-md bg-background px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-s-0 shadow-none ${
                  errors.categoria
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                {...register("categoria", {
                  required: "Seleccione una categoría",
                })}
              >
                <option value="">Seleccione...</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
            {errors.categoria && (
              <div className="text-destructive text-sm mt-1">
                {errors.categoria.message}
              </div>
            )}
          </div>

          {/* Nombre */}
          <div className="col-span-full md:col-span-6">
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground text-sm font-bold">
              Nombre del Plato
            </label>
            <div className="flex w-full items-stretch">
              <input
                type="text"
                className={`h-9 w-full rounded-md bg-background px-3 py-1 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-s-0 shadow-none ${
                  errors.nombre
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                placeholder="Ej. Lomo Saltado"
                {...register("nombre", { required: "Campo obligatorio" })}
              />
            </div>
            {errors.nombre && (
              <div className="text-destructive text-sm mt-1">
                {errors.nombre.message}
              </div>
            )}
          </div>

          {/* Precio */}
          <div className="col-span-full md:col-span-12">
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground text-sm font-bold">
              Precio Unitario
            </label>
            <div className="flex w-full items-stretch">
              <input
                type="text"
                className={`h-9 w-full rounded-md bg-background px-3 py-1 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-s-0 shadow-none ${
                  errors.precio
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                // 🔥 USO DEL HELPER AQUÍ PARA EL PLACEHOLDER
                placeholder={`${getMoneda()} 0.00`}
                {...register("precio", {
                  required: "Requerido",
                  validate: validatePrecio,
                })}
                onInput={handlePrecioInput}
              />
            </div>
            {errors.precio && (
              <div className="text-destructive text-sm mt-1">
                {errors.precio.message}
              </div>
            )}
          </div>

          {/* Descripción */}
          <div className="col-span-full">
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground text-sm font-bold">
              Descripción
            </label>
            <div className="flex w-full items-stretch">
              <input
                type="text"
                className={`h-9 w-full rounded-md bg-background px-3 py-1 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-s-0 shadow-none ${
                  errors.descripcion
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                placeholder="Breve descripción del plato..."
                {...register("descripcion", { required: "Requerido" })}
              />
            </div>
            {errors.descripcion && (
              <div className="text-destructive text-sm mt-1">
                {errors.descripcion.message}
              </div>
            )}
          </div>
        </div>

        {/* --- Footer de Botones --- */}
        <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
          <Button
            type="button"
            className="btn-cerrar px-4 rounded-full"
            onClick={handleCloseModal}
            variant="default"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="btn-guardar inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-foreground text-background shadow-sm hover:bg-foreground/90 px-4 rounded-full"
            variant="default"
          >
            Guardar Plato
          </Button>
        </div>
      </form>
    </div>
  );
}
