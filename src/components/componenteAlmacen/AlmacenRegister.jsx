import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";
import { Save, SaveAll } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { GetProveedores } from "../../service/GetProveedores";

import { Button } from "../ui/button";

export function AlmacenRegister() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Estados para almacenar las opciones de los combobox
  const [categorias, setCategorias] = useState([]);
  const [unidades, setUnidades] = useState([]);

  // Función para obtener las categorías
  const fetchCategorias = async () => {
    try {
      const response = await axiosInstance.get("/categorias"); // Endpoint para categorías
      if (response.data.success) {
        setCategorias(response.data.data);
      }
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  // Función para obtener las unidades
  const fetchUnidades = async () => {
    try {
      const response = await axiosInstance.get("/unidadMedida"); // Endpoint para unidades
      if (response.data.success) {
        setUnidades(response.data.data);
      }
    } catch (error) {
      console.error("Error al obtener unidades:", error);
    }
  };

  const { data: dataProveedores = [] } = useQuery({
    queryKey: ["proveedores"],
    queryFn: GetProveedores,
  });

  // Ejecutar las consultas al montar el componente
  useEffect(() => {
    fetchCategorias();
    fetchUnidades();
  }, []);

  // Función para manejar el envío del formulario
  const onSubmit = async (data) => {
    try {
      // Crear un objeto FormData
      const formData = new FormData();

      // Agregar campos al FormData
      for (const key in data) {
        if (key === "pdf_file" || key === "image_file") {
          // Si es un campo de archivo, agrega el primer archivo del FileList
          if (data[key] && data[key][0]) {
            formData.append(key, data[key][0]);
          }
        } else {
          // Agrega otros campos (texto, números, etc.)
          formData.append(key, data[key]);
        }
      }

      // Enviar la solicitud POST con FormData
      const response = await axiosInstance.post("/almacen/save", formData);

      // Manejar la respuesta del servidor
      if (response.data.success) {
        ToastAlert("success", "Registrado correctamente");
        reset(); // Resetea el formulario después del envío exitoso
      } else {
        ToastAlert("error", "Ocurrió un error");
      }
    } catch (error) {
      // Manejo de errores específicos
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        ToastAlert(
          "error",
          error.response.data.message || "Error en el servidor",
        );
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        ToastAlert("error", "No se recibió respuesta del servidor");
      } else {
        // Algo sucedió en la configuración de la solicitud
        ToastAlert("error", "Error de conexión");
      }
      console.error("Error al enviar el formulario:", error);
    }
  };

  return (
    <form id="productForm" onSubmit={handleSubmit(onSubmit)}>
      <div className="almacen-card">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-full md:col-span-6">
            <div className="almacen-field">
              <label
                htmlFor="nombreProducto"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Nombre Producto/Activo
              </label>
              <input
                type="text"
                className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.nombreProducto ? "border-destructive focus-visible:ring-destructive" : ""}`}
                id="nombreProducto"
                placeholder="Nombre del producto"
                {...register("nombreProducto", {
                  required: "Este campo es obligatorio",
                })}
              />
              {errors.nombreProducto && (
                <div className="text-sm text-destructive">
                  {errors.nombreProducto.message}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-full md:col-span-6">
            <div className="almacen-field">
              <label
                htmlFor="cantidad"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Cantidad
              </label>
              <input
                type="number"
                className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.cantidad ? "border-destructive focus-visible:ring-destructive" : ""}`}
                id="cantidad"
                placeholder="Cantidad"
                {...register("cantidad", {
                  required: "Este campo es obligatorio",
                  min: {
                    value: 1,
                    message: "La cantidad debe ser mayor a 0",
                  },
                })}
              />
              {errors.cantidad && (
                <div className="text-sm text-destructive">
                  {errors.cantidad.message}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3 my-2">
          <div className="col-span-full md:col-span-4">
            <div className="almacen-field">
              <label
                htmlFor="precioUnit"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Precio Unitario S/.
              </label>
              <input
                type="text"
                className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.precioUnit ? "border-destructive focus-visible:ring-destructive" : ""}`}
                id="precioUnit"
                placeholder="Precio unitario"
                {...register("precioUnit", {
                  required: "Este campo es obligatorio",
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: "Ingrese un precio válido",
                  },
                })}
              />
              {errors.precioUnit && (
                <div className="text-sm text-destructive">
                  {errors.precioUnit.message}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-full md:col-span-4">
            <div className="almacen-field">
              <label
                htmlFor="descripcion"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Descripción
              </label>
              <textarea
                className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.descripcion ? "border-destructive focus-visible:ring-destructive" : ""}`}
                id="descripcion"
                rows={3}
                placeholder="Descripción del producto"
                {...register("descripcion", {
                  required: "Este campo es obligatorio",
                })}
              />
              {errors.descripcion && (
                <div className="text-sm text-destructive">
                  {errors.descripcion.message}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-full md:col-span-4">
            <div className="almacen-field">
              <label
                htmlFor="marca"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Marca
              </label>
              <input
                type="text"
                className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.marca ? "border-destructive focus-visible:ring-destructive" : ""}`}
                id="marca"
                placeholder="Marca del producto"
                {...register("marca", {
                  required: "Este campo es obligatorio",
                })}
              />
              {errors.marca && (
                <div className="text-sm text-destructive">
                  {errors.marca.message}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3 my-2">
          <div className="col-span-full md:col-span-4">
            <div className="almacen-field">
              <label
                htmlFor="categoria"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Categoría
              </label>
              <select
                className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.categoria ? "border-destructive focus-visible:ring-destructive" : ""}`}
                id="categoria"
                {...register("categoria", {
                  required: "Este campo es obligatorio",
                })}
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              {errors.categoria && (
                <div className="text-sm text-destructive">
                  {errors.categoria.message}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-full md:col-span-4">
            <div className="almacen-field">
              <label
                htmlFor="unidad"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Unidad de Medida
              </label>
              <select
                className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.unidad ? "border-destructive focus-visible:ring-destructive" : ""}`}
                id="unidad"
                {...register("unidad", {
                  required: "Este campo es obligatorio",
                })}
              >
                <option value="">Seleccione una unidad</option>
                {unidades.map((unidad) => (
                  <option key={unidad.id} value={unidad.id}>
                    {unidad.nombre}
                  </option>
                ))}
              </select>
              {errors.unidad && (
                <div className="text-sm text-destructive">
                  {errors.unidad.message}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-full md:col-span-4">
            <div className="almacen-field">
              <label
                htmlFor="proveedor"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Proveedor
              </label>
              <select
                className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.proveedor ? "border-destructive focus-visible:ring-destructive" : ""}`}
                id="proveedor"
                {...register("proveedor", {
                  required: "Este campo es obligatorio",
                })}
              >
                <option value="">Seleccione un proveedor</option>
                {dataProveedores
                  .filter((proveedor) => proveedor.estado == 1)
                  .map((proveedor) => (
                    <option key={proveedor.id} value={proveedor.id}>
                      {proveedor.nombre}
                    </option>
                  ))}
              </select>
              {errors.proveedor && (
                <div className="text-sm text-destructive">
                  {errors.proveedor.message}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="almacen-file-group">
          <div className="almacen-field mb-3">
            <label
              htmlFor="pdf_file"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Seleccionar PDF
            </label>
            <input
              type="file"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.pdf_file ? "border-destructive focus-visible:ring-destructive" : ""}`}
              id="pdf_file"
              accept="application/pdf"
              {...register("pdf_file", {
                required: "Este campo es obligatorio",
              })}
            />
            {errors.pdf_file && (
              <div className="text-sm text-destructive">
                {errors.pdf_file.message}
              </div>
            )}
            <small className="almacen-helptext success">
              <i className="fas fa-exclamation-circle"></i> Cargar archivo
              firmado por Administrador/Finanzas
            </small>
          </div>

          <div className="almacen-field">
            <label
              htmlFor="image_file"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Cargar Firma
            </label>
            <input
              type="file"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.image_file ? "border-destructive focus-visible:ring-destructive" : ""}`}
              id="image_file"
              accept="image/*"
              {...register("image_file", {
                required: "Este campo es obligatorio",
              })}
            />
            {errors.image_file && (
              <div className="text-sm text-destructive">
                {errors.image_file.message}
              </div>
            )}
            <small className="almacen-helptext warning">
              <i className="fas fa-exclamation-circle"></i> El archivo cargado
              no debe ser pesado
            </small>
          </div>
        </div>

        <div className="almacen-footer">
          <Button
            type="submit"
            className="btn-guardar inline-flex items-center gap-2"
            variant="default"
          >
            <SaveAll />
            Guardar Registro
          </Button>
        </div>
      </div>
    </form>
  );
}
