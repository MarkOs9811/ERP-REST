import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { handlePrecioInput, validatePrecio } from "../../hooks/InputHandlers";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";
import { Button } from "../ui/button";
import { Card } from "@/components/ui/card";

export function PlatoEditar({ dataPlato, handleCloseModal }) {
  const [fotoPreview, setFotoPreview] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [fotoFile, seetFotoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  //   Obteniendo las categroias disponibles
  useEffect(() => {
    const getCategoria = async () => {
      try {
        const response = await axiosInstance.get(
          "/gestionPlatos/getCategoriaTrue",
        );
        if (response.data.success) {
          setCategorias(response.data.data);
          if (dataPlato && dataPlato.categoria) {
            setValue("categoria", dataPlato.categoria.id);
          }
        } else {
          console.log(response.data.message);
        }
      } catch (errors) {
        console.log("error de conexion");
      }
    };
    getCategoria();
  }, [dataPlato, setValue]);

  // const onSubmit = async (data) => {
  //   if (isSubmitting) return; // Evitar múltiples envíos
  //   setIsSubmitting(true);

  //   try {
  //     if (!dataPlato?.id) {
  //       ToastAlert("error", "ID del plato no está definido");
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append("nombre", data.nombre);
  //     formData.append("descripcion", data.descripcion);
  //     formData.append("precio", data.precio);
  //     formData.append("categoriaId", data.categoria);

  //     if (fotoFile) {
  //       formData.append("foto", fotoFile);
  //     }

  //     const platoId = Number(dataPlato.id);
  //     if (isNaN(platoId)) {
  //       ToastAlert("error", "ID del plato no es válido");
  //       return;
  //     }

  //     const response = await axiosInstanceJava.put(
  //       `/platos/${platoId}`,
  //       formData
  //     );

  //     if (response.data.success) {
  //       ToastAlert("success", "Actualización Exitosa!");
  //       reset();
  //       handleCloseModal();
  //     }
  //   } catch (error) {
  //     // Manejo de errores...
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nombre", data.nombre);
      formDataToSend.append("descripcion", data.descripcion);
      formDataToSend.append("precio", String(data.precio));
      formDataToSend.append("categoria", String(data.categoria));

      if (fotoFile) {
        formDataToSend.append("foto", fotoFile);
      }

      formDataToSend.append("_method", "PUT");

      const response = await axiosInstance.post(
        `/gestionPlatos/updatePlato/${dataPlato.id}`,
        formDataToSend,
      );

      if (response.data.success) {
        ToastAlert("success", "¡Actualización exitosa!");
        reset();
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error completo:", error);
      ToastAlert(
        "error",
        error.response?.data?.message || "Error al actualizar",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // PARA VISUALIZAR LA IMAGE
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*", // Aceptar cualquier imagen
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const objectUrl = URL.createObjectURL(file); // Crear un objeto URL para la previsualización
        setFotoPreview(objectUrl); // Establecer el logo previsualizado
        seetFotoFile(file); // Guardar el archivo para enviarlo al servidor
      }
    },
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <Card className="flex bg-transparent p-3 mb-3">
        <label
          htmlFor="foto"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Foto Plato
        </label>
        <div className="mb-4">
          <div
            {...getRootProps()}
            className="dropzone rounded p-4 text-center"
            style={{ cursor: "pointer" }}
          >
            <img
              src={fotoPreview || `${dataPlato.foto_url}`}
              width={150}
              className="rounded m-auto"
              alt="Foto del plato"
            />
            <br></br>
            <input
              {...getInputProps()}
              id="foto"
              name="foto"
              className="hidden"
            />
            {!fotoPreview && (
              <p className="text-muted-foreground">
                Haz clic o arrastra para cargar el logo
              </p>
            )}
            <Button
              type="button"
              className="shadow inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-input bg-background text-foreground hover:bg-accent mt-2"
              variant="default"
            >
              Seleccionar archivo
            </Button>
          </div>
          <p className="text-destructive">{errors.foto?.message}</p>
        </div>
      </Card>

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-6">
          <div className="mb-3">
            <label
              htmlFor="categoria"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Categoria
            </label>
            <select
              className="h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              id="categoria"
              {...register("categoria", {
                required: "Seleccione una categoría",
              })}
            >
              <option value="">Seleccione...</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
            {errors.categoria && (
              <p className="text-destructive text-sm mb-0 mt-1">
                {errors.categoria.message}
              </p>
            )}
          </div>
        </div>
        <div className="col-span-6">
          <div className="mb-3">
            <label
              htmlFor="nombre"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Nombre Plato
            </label>
            <input
              type="text"
              className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              id="nombre"
              {...register("nombre", {
                required: "Campo obligatorio",
              })}
              defaultValue={dataPlato.nombre || ""}
            />
            {errors.nombre && (
              <p className="text-destructive text-sm mb-0 mt-1">
                {errors.nombre.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label
          htmlFor="precio"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Precio S/.
        </label>
        <input
          type="text"
          className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          id="precio"
          {...register("precio", {
            required: "Campo obligatorio",
            validate: validatePrecio,
          })}
          onInput={handlePrecioInput}
          defaultValue={dataPlato.precio || ""}
        />
        {errors.precio && (
          <p className="text-destructive text-sm mb-0 mt-1">
            {errors.precio.message}
          </p>
        )}
      </div>
      <div className="mb-3">
        <label
          htmlFor="descripcion"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Descripcion
        </label>
        <input
          type="text"
          className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          id="descripcion"
          {...register("descripcion", {
            required: "Campo obligatorio",
          })}
          defaultValue={dataPlato.descripcion || ""}
        />
        {errors.descripcion && (
          <p className="text-destructive text-sm mb-0 mt-1">
            {errors.descripcion.message}
          </p>
        )}
      </div>
      <div className="flex justify-center mt-4 gap-2">
        <Button
          type="button"
          className="btn-cerrar px-3"
          onClick={handleCloseModal}
          variant="default"
        >
          Cerrar
        </Button>
        <Button
          className="btn-guardar"
          type="input"
          disabled={isSubmitting}
          variant="default"
        >
          {isSubmitting ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  );
}
