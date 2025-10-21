import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ToastAlert from "../componenteToast/ToastAlert";
import axiosInstance from "../../api/AxiosInstance";
import { GetCategoria } from "../../service/serviceAlmacen/GetCategoria";
import { GetUnidades } from "../../service/serviceAlmacen/GetUnidades";

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
        idCategoria: data.categoria?.id || "",
        idUnidad: data.unidad?.id || "",
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
        formData
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
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <div className="row g-3">
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
        <div className="col-12">
          <label className="form-label small text-muted">Nombre</label>
          <input
            className={`form-control form-control-sm rounded-lg shadow-sm ${
              errors.nombre ? "is-invalid" : ""
            }`}
            {...register("nombre", { required: "El nombre es obligatorio" })}
            placeholder="Nombre del producto"
          />
          {errors.nombre && (
            <div className="invalid-feedback">{errors.nombre.message}</div>
          )}
        </div>
        <div className="col-12">
          <label className="form-label text-muted">Marca</label>
          <input
            className={`form-control form-control-sm rounded-lg shadow-sm ${
              errors.marca ? "is-invalid" : ""
            }`}
            {...register("marca", {})}
          />
          {errors.marca && (
            <div className="invalid-feedback">errors.marca.message</div>
          )}
        </div>

        {/* Descripción */}
        <div className="col-12">
          <label className="form-label small text-muted">Descripción</label>
          <textarea
            className={`form-control form-control-sm rounded-lg shadow-sm ${
              errors.descripcion ? "is-invalid" : ""
            }`}
            {...register("descripcion")}
            rows={3}
            placeholder="Descripción corta"
          />
          {errors.descripcion && (
            <div className="invalid-feedback">{errors.descripcion.message}</div>
          )}
        </div>

        {/* Precio */}
        <div className="col-md-6">
          <label className="form-label small text-muted">Precio</label>
          <input
            type="number"
            step="0.01"
            className={`form-control form-control-sm rounded-lg shadow-sm ${
              errors.precio ? "is-invalid" : ""
            }`}
            {...register("precio", { required: "El precio es obligatorio" })}
            placeholder="0.00"
          />
          {errors.precio && (
            <div className="invalid-feedback">{errors.precio.message}</div>
          )}
        </div>

        {/* Stock */}
        <div className="col-md-6">
          <label className="form-label small text-muted">Stock</label>
          <input
            type="number"
            className={`form-control form-control-sm rounded-lg shadow-sm ${
              errors.stock ? "is-invalid" : ""
            }`}
            {...register("stock", { required: "El stock es obligatorio" })}
            placeholder="0"
          />
          {errors.stock && (
            <div className="invalid-feedback">{errors.stock.message}</div>
          )}
        </div>

        {/* Categoría */}
        <div className="col-md-6">
          <label className="form-label small text-muted">Categoría</label>
          <select
            className="form-select form-select-sm rounded-lg shadow-sm"
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
            <div className="invalid-feedback">{errors.idCategoria.message}</div>
          )}
        </div>

        {/* Unidad */}
        <div className="col-md-6">
          <label className="form-label small text-muted">Unidad</label>
          <select
            className="form-select form-select-sm rounded-lg shadow-sm"
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
            <div className="invalid-feedback">{errors.idUnidad.message}</div>
          )}
        </div>

        {/* Estado */}
        <div className="col-md-6">
          <label className="form-label small text-muted">Estado</label>
          <select
            className="form-select form-select-sm rounded-lg shadow-sm"
            {...register("estado")}
          >
            <option value={1}>Activo</option>
            <option value={0}>Inactivo</option>
          </select>
        </div>

        {/* Foto */}
        <div className="col-12 d-flex gap-3 align-items-center">
          <div
            className="w-24 h-24 rounded overflow-hidden border p-1"
            style={{ width: 96, height: 96 }}
          >
            {preview ? (
              <img
                src={preview}
                alt="preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div className="d-flex h-100 w-100 align-items-center justify-content-center text-muted small">
                Sin imagen
              </div>
            )}
          </div>

          <div className="flex-grow-1">
            <label className="form-label small text-muted">
              Foto del producto
            </label>
            <input
              type="file"
              accept="image/*"
              className="form-control form-control-sm"
              {...register("foto")}
            />
            <small className="text-muted">JPG, PNG. Máx 2MB.</small>
          </div>
        </div>
      </div>
      <div className="modal-right-footer gap-2">
        <button
          type="button"
          className="btn-cerrar-modal"
          onClick={(e) => {
            e.preventDefault(); // evita submit por si acaso
            onCancel();
          }}
        >
          Cancelar
        </button>
        <button type="submit" className="btn-guardar">
          Guardar
        </button>
      </div>
    </form>
  );
}
