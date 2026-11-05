import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ToastAlert from "../componenteToast/ToastAlert";
import axiosInstance from "../../api/AxiosInstance";
import { GetCategoria } from "../../service/serviceAlmacen/GetCategoria";
import { GetUnidades } from "../../service/serviceAlmacen/GetUnidades";
import { Button } from "../ui/button";

export function FormEditarInventario({ data, onCancel }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      fotoActual: "",
      nombre: "",
      descripcion: "",
      presentacion: "",
      precio: "",
      marca: "",
      stock: "",
      idCategoria: "",
      idUnidad: "",
      laboratorio: "",
      lote: "",
      registro_sanitario: "",
      fecha_vencimiento: "", // <--- Agregado por defecto
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
        presentacion: data.presentacion || "",
        marca: data.marca || "",
        precio: data.precio != null ? String(data.precio) : "",
        stock: data.stock != null ? String(data.stock) : "",
        idCategoria: data.idCategoria
          ? String(data.idCategoria)
          : data.categoria?.id
            ? String(data.categoria.id)
            : "",
        idUnidad: data.idUnidad
          ? String(data.idUnidad)
          : data.unidad?.id
            ? String(data.unidad.id)
            : "",
        laboratorio: data.laboratorio || "",
        lote: data.lote || "",
        registro_sanitario: data.registro_sanitario || "",
        fecha_vencimiento: data.fecha_vencimiento
          ? data.fecha_vencimiento.split("T")[0]
          : "", // <--- Carga de fecha formateada
        estado: data.estado != null ? Number(data.estado) : 1,
        foto: null,
      });

      if (data.foto) {
        setPreview(`/storage/${data.foto}`);
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

  const { data: categorias = [] } = useQuery({
    queryKey: ["categorias"],
    queryFn: GetCategoria,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const { data: unidades = [] } = useQuery({
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
      formData.append("presentacion", values.presentacion);
      formData.append("precio", values.precio);
      formData.append("stock", values.stock);
      formData.append("idCategoria", values.idCategoria);
      formData.append("idUnidad", values.idUnidad);
      formData.append("laboratorio", values.laboratorio);
      formData.append("lote", values.lote);
      formData.append("registro_sanitario", values.registro_sanitario);
      formData.append("fecha_vencimiento", values.fecha_vencimiento); // <--- Añadido al envío
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
        {/* Imagen Preview */}
        <div className="col-span-full flex justify-center mb-2">
          <div
            className="w-24 h-24 rounded overflow-hidden p-1 border border-dashed flex items-center justify-center bg-muted/50"
            style={{ width: 96, height: 96 }}
          >
            {preview ? (
              <img
                className="imagen"
                alt="img-inventario"
                src={preview}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span className="text-muted-foreground text-xs text-center">
                Sin imagen
              </span>
            )}
          </div>
        </div>

        {/* Nombre */}
        <div className="col-span-full">
          <label className="font-medium text-sm text-muted-foreground">
            Nombre*
          </label>
          <input
            className={`w-full border-input bg-background py-1 h-8 px-2.5 text-xs rounded-lg shadow-sm border ${
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

        {/* Descripción */}
        <div className="col-span-full">
          <label className="font-medium text-sm text-muted-foreground">
            Descripción
          </label>
          <textarea
            className="w-full border-input bg-background py-1 h-16 px-2.5 text-xs rounded-lg shadow-sm border"
            {...register("descripcion")}
            rows={2}
            placeholder="Descripción corta"
          />
        </div>

        {/* Marca */}
        <div className="col-span-full md:col-span-6">
          <label className="text-sm font-medium text-muted-foreground">
            Marca*
          </label>
          <input
            className="w-full border-input bg-background py-1 h-8 px-2.5 text-xs rounded-lg shadow-sm border"
            {...register("marca", { required: "La marca es obligatoria" })}
            placeholder="Marca"
          />
          {errors.marca && (
            <div className="text-sm text-destructive">
              {errors.marca.message}
            </div>
          )}
        </div>

        {/* Presentación */}
        <div className="col-span-full md:col-span-6">
          <label className="text-sm font-medium text-muted-foreground">
            Presentación*
          </label>
          <input
            className="w-full border-input bg-background py-1 h-8 px-2.5 text-xs rounded-lg shadow-sm border"
            {...register("presentacion", {
              required: "La presentación es obligatoria",
            })}
            placeholder="Ej: Caja x 12 / Frasco"
          />
          {errors.presentacion && (
            <div className="text-sm text-destructive">
              {errors.presentacion.message}
            </div>
          )}
        </div>

        {/* Laboratorio */}
        <div className="col-span-full md:col-span-6">
          <label className="text-sm font-medium text-muted-foreground">
            Laboratorio*
          </label>
          <input
            className="w-full border-input bg-background py-1 h-8 px-2.5 text-xs rounded-lg shadow-sm border"
            {...register("laboratorio", {
              required: "El laboratorio es obligatorio",
            })}
            placeholder="Ej: Bayer / N/A"
          />
          {errors.laboratorio && (
            <div className="text-sm text-destructive">
              {errors.laboratorio.message}
            </div>
          )}
        </div>

        {/* Precio */}
        <div className="col-span-full md:col-span-6">
          <label className="font-medium text-sm text-muted-foreground">
            Precio*
          </label>
          <input
            type="number"
            step="0.01"
            className="w-full border-input bg-background py-1 h-8 px-2.5 text-xs rounded-lg shadow-sm border"
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
          <label className="font-medium text-sm text-muted-foreground">
            Stock*
          </label>
          <input
            type="number"
            className="w-full border-input bg-background py-1 h-8 px-2.5 text-xs rounded-lg shadow-sm border"
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
          <label className="font-medium text-sm text-muted-foreground">
            Categoría*
          </label>
          <select
            className="w-full appearance-auto border-input bg-background py-1 h-8 px-2.5 text-xs rounded-lg shadow-sm border"
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
          <label className="font-medium text-sm text-muted-foreground">
            Unidad*
          </label>
          <select
            className="w-full appearance-auto border-input bg-background py-1 h-8 px-2.5 text-xs rounded-lg shadow-sm border"
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

        {/* Lote */}
        <div className="col-span-full md:col-span-6">
          <label className="text-sm font-medium text-muted-foreground">
            Lote*
          </label>
          <input
            className="w-full border-input bg-background py-1 h-8 px-2.5 text-xs rounded-lg shadow-sm border"
            {...register("lote", { required: "El lote es obligatorio" })}
            placeholder="Ej: LT-123 / N/A"
          />
          {errors.lote && (
            <div className="text-sm text-destructive">
              {errors.lote.message}
            </div>
          )}
        </div>

        {/* Registro Sanitario */}
        <div className="col-span-full md:col-span-6">
          <label className="text-sm font-medium text-muted-foreground">
            Registro Sanitario*
          </label>
          <input
            className="w-full border-input bg-background py-1 h-8 px-2.5 text-xs rounded-lg shadow-sm border"
            {...register("registro_sanitario", {
              required: "El registro sanitario es obligatorio",
            })}
            placeholder="Ej: RS-XXXX / N/A"
          />
          {errors.registro_sanitario && (
            <div className="text-sm text-destructive">
              {errors.registro_sanitario.message}
            </div>
          )}
        </div>

        {/* Fecha de Vencimiento */}
        <div className="col-span-full md:col-span-6">
          <label className="text-sm font-medium text-muted-foreground">
            Fecha de Vencimiento*
          </label>
          <input
            type="date"
            className="w-full border-input bg-background py-1 h-8 px-2.5 text-xs rounded-lg shadow-sm border"
            {...register("fecha_vencimiento", {
              required: "La fecha de vencimiento es obligatoria",
            })}
          />
          {errors.fecha_vencimiento && (
            <div className="text-sm text-destructive">
              {errors.fecha_vencimiento.message}
            </div>
          )}
        </div>

        {/* Estado */}
        <div className="col-span-full md:col-span-6">
          <label className="font-medium text-sm text-muted-foreground">
            Estado
          </label>
          <select
            className="w-full appearance-auto border-input bg-background py-1 h-8 px-2.5 text-xs rounded-lg shadow-sm border"
            {...register("estado")}
          >
            <option value={1}>Activo</option>
            <option value={0}>Inactivo</option>
          </select>
        </div>

        {/* Foto */}
        <div className="col-span-full flex gap-3 items-center mt-2">
          <div className="grow">
            <label className="font-medium text-sm text-muted-foreground">
              Actualizar Foto del producto
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full rounded-md border-input bg-background py-1 shadow-sm text-xs border"
              {...register("foto")}
            />
            <small className="text-muted-foreground">JPG, PNG. Máx 2MB.</small>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button
          type="button"
          className="btn-cerrar-modal"
          onClick={(e) => {
            e.preventDefault();
            onCancel();
          }}
          variant="outline"
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
