import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ToastAlert from "../componenteToast/ToastAlert";
import axiosInstance from "../../api/AxiosInstance";
import { GetCategoria } from "../../service/serviceAlmacen/GetCategoria";
import { GetUnidades } from "../../service/serviceAlmacen/GetUnidades";
import { Button } from "../ui/button";

export function FormEditarInventario({ data, onCancel }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    defaultValues: {
      fotoActual: "",
      nombre: "",
      descripcion: "",
      precio: "",
      marca: "",
      stock: "",
      idCategoria: "",
      idUnidad: "",
      estado: 1,
      foto: null,
    },
  });

  const [preview, setPreview] = useState(null);

  // Reset form cuando llega `data`
  useEffect(() => {
    if (data) {
      reset({
        fotoActual: data.foto || "",
        nombre: data.nombre || "",
        descripcion: data.descripcion || "",
        marca: data.marca || "",
        precio: data.precio != null ? String(data.precio) : "",
        stock: data.stock != null ? String(data.stock) : "",
        idCategoria: data.categoria?.id ? String(data.categoria.id) : "",
        idUnidad: data.unidad?.id ? String(data.unidad.id) : "",
        estado: data.estado != null ? Number(data.estado) : 1,
        foto: null,
      });

      if (data.foto) {
        setPreview(`${process.env.REACT_APP_BASE_URL}/storage/${data.foto}`);
      } else {
        setPreview(null);
      }
    }
  }, [data, reset]);

  // Preview al seleccionar archivo
  const file = watch("foto");
  useEffect(() => {
    if (file && file.length > 0) {
      const f = file[0];
      const url = URL.createObjectURL(f);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const {
    data: categorias = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categorias"],
    queryFn: GetCategoria,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const {
    data: unidades = [],
    isLoading: loadingUnidades,
    isError: errorUnidades,
  } = useQuery({
    queryKey: ["Unidadess"],
    queryFn: GetUnidades,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("nombre", values.nombre);
      formData.append("marca", values.marca);
      formData.append("descripcion", values.descripcion);
      formData.append("precio", values.precio);
      formData.append("stock", values.stock);
      formData.append("idCategoria", values.idCategoria);
      formData.append("idUnidad", values.idUnidad);
      formData.append("estado", values.estado);
      if (values.foto && values.foto.length > 0) {
        formData.append("foto", values.foto[0]);
      }

      const response = await axiosInstance.post(
        `/inventario/${data.id}`,
        formData,
      );

      if (response.data.success) {
        ToastAlert("success", "Producto actualizado correctamente");

        onCancel(false);
        queryClient.invalidateQueries(["inventario"]);
      } else {
        ToastAlert("error", response.data.message || "Error al actualizar");
      }
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.message || error.message || "Error de conexión";
      ToastAlert("error", message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors))}
      className="p-4"
    >
      <div className="grid grid-cols-12 gap-3">
        <div className="image flex">
          <div className="image-preview m-auto">
            {watch("fotoActual") ? (
              <img
                className="imagen"
                alt="img-inventario"
                src={`${BASE_URL}/storage/${watch("fotoActual")}`}
              />
            ) : (
              <p>No hay imagen actual</p>
            )}
          </div>
        </div>
        {/* Nombre */}
        <div className="col-span-full">
          <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-muted-foreground">
            Nombre
          </label>
          <input
            className={`w-full border-input bg-background py-1 transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs rounded-lg shadow-sm ${
              errors.nombre
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }`}
            {...register("nombre", { required: "El nombre es obligatorio" })}
            placeholder="Nombre del producto"
          />
          {errors.nombre && (
            <div className="text-sm text-destructive">
              {errors.nombre.message}
            </div>
          )}
        </div>
        <div className="col-span-full">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground">
            Marca
          </label>
          <input
            className={`w-full border-input bg-background py-1 transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs rounded-lg shadow-sm ${
              errors.marca
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }`}
            {...register("marca", {})}
          />

          {errors.marca && (
            <div className="text-sm text-destructive">
              {errors.marca.message}
            </div> // ✅ Esto muestra el mensaje real
          )}
        </div>

        {/* Descripción */}
        <div className="col-span-full">
          <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-muted-foreground">
            Descripción
          </label>
          <textarea
            className={`w-full border-input bg-background py-1 transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs rounded-lg shadow-sm ${
              errors.descripcion
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }`}
            {...register("descripcion")}
            rows={3}
            placeholder="Descripción corta"
          />
          {errors.descripcion && (
            <div className="text-sm text-destructive">
              {errors.descripcion.message}
            </div>
          )}
        </div>

        {/* Precio */}
        <div className="col-span-full md:col-span-6">
          <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-muted-foreground">
            Precio
          </label>
          <input
            type="number"
            step="0.01"
            className={`w-full border-input bg-background py-1 transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs rounded-lg shadow-sm ${
              errors.precio
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }`}
            {...register("precio", { required: "El precio es obligatorio" })}
            placeholder="0.00"
          />
          {errors.precio && (
            <div className="text-sm text-destructive">
              {errors.precio.message}
            </div>
          )}
        </div>

        {/* Stock */}
        <div className="col-span-full md:col-span-6">
          <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-muted-foreground">
            Stock
          </label>
          <input
            type="number"
            className={`w-full border-input bg-background py-1 transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs rounded-lg shadow-sm ${
              errors.stock
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }`}
            {...register("stock", { required: "El stock es obligatorio" })}
            placeholder="0"
          />
          {errors.stock && (
            <div className="text-sm text-destructive">
              {errors.stock.message}
            </div>
          )}
        </div>

        {/* Categoría */}
        <div className="col-span-full md:col-span-6">
          <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-muted-foreground">
            Categoría
          </label>
          <select
            className="w-full appearance-auto border-input bg-background py-1 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs rounded-lg shadow-sm"
            {...register("idCategoria", {
              required: "La categoría es obligatoria",
            })}
          >
            <option value="">Seleccione categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={String(cat.id)}>
                {cat.nombre}
              </option>
            ))}
          </select>
          {errors.idCategoria && (
            <div className="text-sm text-destructive">
              {errors.idCategoria.message}
            </div>
          )}
        </div>

        {/* Unidad */}
        <div className="col-span-full md:col-span-6">
          <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-muted-foreground">
            Unidad
          </label>
          <select
            className="w-full appearance-auto border-input bg-background py-1 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs rounded-lg shadow-sm"
            {...register("idUnidad", { required: "La unidad es obligatoria" })}
          >
            <option value="">Seleccione unidad</option>
            {unidades.map((u) => (
              <option key={u.id} value={String(u.id)}>
                {u.nombre}
              </option>
            ))}
          </select>
          {errors.idUnidad && (
            <div className="text-sm text-destructive">
              {errors.idUnidad.message}
            </div>
          )}
        </div>

        {/* Estado */}
        <div className="col-span-full md:col-span-6">
          <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-muted-foreground">
            Estado
          </label>
          <select
            className="w-full appearance-auto border-input bg-background py-1 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs rounded-lg shadow-sm"
            {...register("estado")}
          >
            <option value={1}>Activo</option>
            <option value={0}>Inactivo</option>
          </select>
        </div>

        {/* Foto */}
        <div className="col-span-full flex gap-3 items-center">
          <div
            className="w-24 h-24 rounded overflow-hidden p-1"
            style={{ width: 96, height: 96 }}
          >
            {preview ? (
              <img
                src={preview}
                alt="preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
                Sin imagen
              </div>
            )}
          </div>

          <div className="grow">
            <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-muted-foreground">
              Foto del producto
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full rounded-md border-input bg-background py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs"
              {...register("foto")}
            />
            <small className="text-muted-foreground">JPG, PNG. Máx 2MB.</small>
          </div>
        </div>
      </div>
      <div className="modal-right-footer gap-2">
        <Button
          type="button"
          className="btn-cerrar-modal"
          onClick={(e) => {
            e.preventDefault(); // evita submit por si acaso
            onCancel();
          }}
          variant="default"
        >
          Cancelar
        </Button>
        <Button type="submit" className="btn-guardar" variant="default">
          Actualizar
        </Button>
      </div>
    </form>
  );
}
