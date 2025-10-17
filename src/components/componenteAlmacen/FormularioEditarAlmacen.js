import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Calendar, Box, CardSimIcon } from "lucide-react";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";
import { GetCategoria } from "../../service/serviceAlmacen/GetCategoria";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetUnidades } from "../../service/serviceAlmacen/GetUnidades";
import { GetProveedores } from "../../service/GetProveedores";

export function FormularioEditarAlmacen({ data, onCancel }) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { data: categoriaData = [], isLoading: isLoadingCategorias } = useQuery(
    {
      queryKey: ["categorias"],
      queryFn: GetCategoria,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
  const { data: unidadData = [], isLoading: isLoadingUnidad } = useQuery({
    queryKey: ["unidad"],
    queryFn: GetUnidades,
    refetchOnWindowFocus: false,
    retry: 1,
  });
  const { data: proveedorData = [], isLoading: isLoadingProveedor } = useQuery({
    queryKey: ["proveedor"],
    queryFn: GetProveedores,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  useEffect(() => {
    if (data) {
      reset({
        id: data.id,
        nombre: data.nombre,
        marca: data.marca,
        cantidad: data.cantidad,
        precioUnit: data.precioUnit,
        unidad: data.unidad.id, // Cambiado a id
        categoria: data.categoria.id, // Cambiado a id
        proveedor: data.proveedor.id, // Cambiado a id
        presentacion: data.presentacion,
        fecha_vencimiento: data.fecha_vencimiento,
        registro_sanitario: data.registro_sanitario,
      });
    }
  }, [data, reset]);

  const onSubmitForm = async (formData) => {
    try {
      const response = await axiosInstance.put(
        `/almacen/${formData.id}`,
        formData
      );
      if (response.data.success) {
        ToastAlert("success", "Producto actualizado exitosamente");
        setIsLoading(false);
        queryClient.invalidateQueries({ queryKey: ["almacen"] });
        onCancel();
      } else {
        ToastAlert(
          "error",
          response.data.message || "Error al actualizar el producto"
        );
      }
    } catch (error) {
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const errorMessage = errors
          ? Object.values(errors)[0]
          : "Error de validación";
        ToastAlert("error", errorMessage);
      } else {
        ToastAlert("error", "Error al actualizar el producto");
      }
    }
  };

  return (
    <div className="bg-light p-3">
      <form
        onSubmit={handleSubmit(onSubmitForm)}
        className="card shadow-sm p-3"
      >
        <div className="row">
          {/* ID */}
          <div className="col-md-6 mb-3">
            <input
              type="hidden"
              className={`form-control ${errors.id ? "is-invalid" : ""}`}
              disabled
              {...register("id")}
            />
          </div>

          {/* Nombre del Producto */}
          <div className="col-md-12 mb-3">
            <label className="form-label small" for="nombreProducto">
              Nombre del Producto*
            </label>
            <input
              id="nombreProducto"
              type="text"
              className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
              {...register("nombre", {
                required: "El nombre del producto es requerido",
                minLength: {
                  value: 3,
                  message: "El nombre debe tener al menos 3 caracteres",
                },
              })}
            />
            {errors.nombre && (
              <div className="invalid-feedback">{errors.nombre.message}</div>
            )}
          </div>

          {/* Marca */}
          <div className="col-md-6 mb-3">
            <label className="form-label small">Marca*</label>
            <input
              type="text"
              className={`form-control ${errors.marca ? "is-invalid" : ""}`}
              {...register("marca", {
                required: "La marca es requerida",
              })}
            />
            {errors.marca && (
              <div className="invalid-feedback">{errors.marca.message}</div>
            )}
          </div>

          {/* Stock */}
          <div className="col-md-6 mb-3">
            <label className="form-label small">Stock*</label>
            <input
              type="number"
              disabled={true}
              className={`form-control ${errors.cantidad ? "is-invalid" : ""}`}
              {...register("cantidad", {
                required: "La cantidad es requerida",
                min: {
                  value: 0,
                  message: "La cantidad no puede ser negativa",
                },
              })}
            />
            {errors.cantidad && (
              <div className="invalid-feedback">{errors.cantidad.message}</div>
            )}
            <small className="text-muted">
              El stock no se puede editar directamente. Use la opción de Agregar
              Stock.
            </small>
          </div>

          {/* Precio Unitario */}
          <div className="col-md-6 mb-3">
            <label className="form-label small">Precio Unitario (S/.)*</label>
            <input
              type="number"
              step="0.01"
              className={`form-control ${
                errors.precioUnit ? "is-invalid" : ""
              }`}
              {...register("precioUnit", {
                required: "El precio unitario es requerido",
                min: {
                  value: 0,
                  message: "El precio no puede ser negativo",
                },
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: "Ingrese un precio válido con máximo 2 decimales",
                },
              })}
            />
            {errors.precioUnit && (
              <div className="invalid-feedback">
                {errors.precioUnit.message}
              </div>
            )}
          </div>

          {/* Unidad de Medida */}
          <div className="col-md-6 mb-3">
            <label className="form-label small">Unidad de Medida*</label>
            <select
              className={`form-select ${errors.unidad ? "is-invalid" : ""}`}
              {...register("unidad", {
                required: "La unidad de medida es requerida",
              })}
              defaultValue={data?.unidad?.id || ""} // Agregamos defaultValue
            >
              <option value="">Seleccione una unidad</option>
              {unidadData.map((unidad) => (
                <option key={unidad.id} value={unidad.id}>
                  {unidad.nombre}
                </option>
              ))}
            </select>
            {errors.unidad && (
              <div className="invalid-feedback">{errors.unidad.message}</div>
            )}
          </div>

          {/* Categoría */}
          <div className="col-md-6 mb-3">
            <label className="form-label small">Categoría*</label>
            <select
              className={`form-select ${errors.categoria ? "is-invalid" : ""}`}
              {...register("categoria", {
                required: "La categoría es requerida",
              })}
              defaultValue={data?.categoria?.id || ""} // Agregamos defaultValue
            >
              <option value="">Seleccione una categoría</option>
              {categoriaData.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
            {errors.categoria && (
              <div className="invalid-feedback">{errors.categoria.message}</div>
            )}
          </div>

          {/* Proveedor */}
          <div className="col-md-6 mb-3">
            <label className="form-label small">Proveedor*</label>
            <select
              className={`form-select ${errors.proveedor ? "is-invalid" : ""}`}
              {...register("proveedor", {
                required: "El proveedor es requerido",
              })}
              defaultValue={data?.proveedor?.id || ""} // Agregamos defaultValue
            >
              <option value="">Seleccione un proveedor</option>
              {proveedorData.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>
                  {proveedor.nombre}
                </option>
              ))}
            </select>
            {errors.proveedor && (
              <div className="invalid-feedback">{errors.proveedor.message}</div>
            )}
          </div>

          {/* Presentación */}
          <div className="col-md-6 mb-3">
            <label className="form-label small d-flex align-items-center gap-2">
              <Box size={16} className="text-primary" />
              Presentación*
            </label>
            <input
              type="text"
              className={`form-control ${
                errors.presentacion ? "is-invalid" : ""
              }`}
              placeholder="Ej: Caja x 12 unidades"
              {...register("presentacion", {
                required: "La presentación es requerida",
                minLength: {
                  value: 3,
                  message: "La presentación debe tener al menos 3 caracteres",
                },
              })}
            />
            {errors.presentacion && (
              <div className="invalid-feedback">
                {errors.presentacion.message}
              </div>
            )}
          </div>

          {/* Fecha de Vencimiento */}
          <div className="col-md-6 mb-3">
            <label className="form-label small d-flex align-items-center gap-2">
              <Calendar size={16} className="text-primary" />
              Fecha de Vencimiento*
            </label>
            <input
              type="date"
              className={`form-control ${
                errors.fecha_vencimiento ? "is-invalid" : ""
              }`}
              {...register("fecha_vencimiento", {
                required: "La fecha de vencimiento es requerida",
                validate: (value) => {
                  const fecha = new Date(value);
                  const hoy = new Date();
                  return fecha > hoy || "La fecha debe ser posterior a hoy";
                },
              })}
            />
            {errors.fecha_vencimiento && (
              <div className="invalid-feedback">
                {errors.fecha_vencimiento.message}
              </div>
            )}
          </div>

          {/* Registro Sanitario */}
          <div className="col-md-6 mb-3">
            <label className="form-label small d-flex align-items-center gap-2">
              <CardSimIcon size={16} className="text-primary" />
              Registro Sanitario*
            </label>
            <input
              type="text"
              className={`form-control ${
                errors.registro_sanitario ? "is-invalid" : ""
              }`}
              placeholder="Ej: RS-XXXX-XXXXX"
              {...register("registro_sanitario", {
                required: "El registro sanitario es requerido",
              })}
            />
            {errors.registro_sanitario && (
              <div className="invalid-feedback">
                {errors.registro_sanitario.message}
              </div>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-end mt-3 gap-3">
          <button type="button" className="btn-cerrar-modal" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn-guardar">
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
