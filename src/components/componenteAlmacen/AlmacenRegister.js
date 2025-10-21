import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";
import { Save } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { GetProveedores } from "../../service/GetProveedores";

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
  const [proveedores, setProveedores] = useState([]);

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

  const {
    data: dataProveedores = [],
    isLoading: loadingProveedor,
    isError: errorPorveedor,
  } = useQuery({
    queryKey: ["proveedores"],
    queryFn: GetProveedores,
    retry: 1,
    refetchOnWindowFocus: false,
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
          error.response.data.message || "Error en el servidor"
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
      <div className="card p-3">
        {/* Nombre del Producto */}
        <div className="row g-3">
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <input
                type="text"
                className={`form-control ${
                  errors.nombreProducto ? "is-invalid" : ""
                }`}
                id="nombreProducto"
                placeholder="Ingrese nombre del producto"
                {...register("nombreProducto", {
                  required: "Este campo es obligatorio",
                })}
              />
              <label htmlFor="nombreProducto">Nombre Producto/Activo</label>
              {errors.nombreProducto && (
                <div className="invalid-feedback">
                  {errors.nombreProducto.message}
                </div>
              )}
            </div>
          </div>

          {/* Cantidad */}
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <input
                type="number"
                className={`form-control ${
                  errors.cantidad ? "is-invalid" : ""
                }`}
                id="cantidad"
                placeholder="Ingrese cantidad del producto"
                {...register("cantidad", {
                  required: "Este campo es obligatorio",
                  min: {
                    value: 1,
                    message: "La cantidad debe ser mayor a 0",
                  },
                })}
              />
              <label htmlFor="cantidad">Cantidad</label>
              {errors.cantidad && (
                <div className="invalid-feedback">
                  {errors.cantidad.message}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Precio Unitario y Descripción */}
        <div className="row g-3">
          <div className="col-md-4">
            <div className="form-floating mb-3">
              <input
                type="text"
                className={`form-control ${
                  errors.precioUnit ? "is-invalid" : ""
                }`}
                id="precioUnit"
                placeholder="Ingrese precio unitario del producto"
                {...register("precioUnit", {
                  required: "Este campo es obligatorio",
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: "Ingrese un precio válido",
                  },
                })}
              />
              <label htmlFor="precioUnit">Precio Unitario S/.</label>
              {errors.precioUnit && (
                <div className="invalid-feedback">
                  {errors.precioUnit.message}
                </div>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div className="col-md-4">
            <div className="form-floating mb-3">
              <textarea
                className={`form-control ${
                  errors.descripcion ? "is-invalid" : ""
                }`}
                id="descripcion"
                placeholder="Descripción"
                {...register("descripcion", {
                  required: "Este campo es obligatorio",
                })}
              />
              <label htmlFor="descripcion">Descripción</label>
              {errors.descripcion && (
                <div className="invalid-feedback">
                  {errors.descripcion.message}
                </div>
              )}
            </div>
          </div>

          {/* Marca */}
          <div className="col-md-4">
            <div className="form-floating mb-3">
              <input
                type="text"
                className={`form-control ${errors.marca ? "is-invalid" : ""}`}
                id="marca"
                placeholder="Ingrese marca del producto"
                {...register("marca", {
                  required: "Este campo es obligatorio",
                })}
              />
              <label htmlFor="marca">Marca</label>
              {errors.marca && (
                <div className="invalid-feedback">{errors.marca.message}</div>
              )}
            </div>
          </div>
        </div>

        {/* Categoría, Unidad de Medida y Proveedor */}
        <div className="row g-3">
          <div className="col-md-4">
            <div className="form-floating mb-3">
              <select
                className={`form-select ${
                  errors.categoria ? "is-invalid" : ""
                }`}
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
              <label htmlFor="categoria">Categoría</label>
              {errors.categoria && (
                <div className="invalid-feedback">
                  {errors.categoria.message}
                </div>
              )}
            </div>
          </div>

          {/* Unidad de Medida */}
          <div className="col-md-4">
            <div className="form-floating mb-3">
              <select
                className={`form-select ${errors.unidad ? "is-invalid" : ""}`}
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
              <label htmlFor="unidad">Unidad de Medida</label>
              {errors.unidad && (
                <div className="invalid-feedback">{errors.unidad.message}</div>
              )}
            </div>
          </div>

          {/* Proveedor */}
          <div className="col-md-4">
            <div className="form-floating mb-3">
              <select
                className={`form-select ${
                  errors.proveedor ? "is-invalid" : ""
                }`}
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
              <label htmlFor="proveedor">Proveedor</label>
              {errors.proveedor && (
                <div className="invalid-feedback">
                  {errors.proveedor.message}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Archivo PDF */}
        <div className="form-floating mb-3">
          <input
            type="file"
            className={`form-control ${errors.pdf_file ? "is-invalid" : ""}`}
            id="pdf_file"
            accept="application/pdf"
            {...register("pdf_file", {
              required: "Este campo es obligatorio",
            })}
          />
          <label htmlFor="pdf_file">Seleccionar PDF</label>
          {errors.pdf_file && (
            <div className="invalid-feedback">{errors.pdf_file.message}</div>
          )}
          <small className="alert" style={{ color: "#179e5b" }}>
            <i className="fas fa-exclamation-circle"></i> Cargar archivo firmado
            por Administrador/Finanzas
          </small>
        </div>

        {/* Archivo de Imagen (Firma) */}
        <div className="form-floating mb-3">
          <input
            type="file"
            className={`form-control ${errors.image_file ? "is-invalid" : ""}`}
            id="image_file"
            accept="image/*"
            {...register("image_file", {
              required: "Este campo es obligatorio",
            })}
          />
          <label htmlFor="image_file">Cargar Firma</label>
          {errors.image_file && (
            <div className="invalid-feedback">{errors.image_file.message}</div>
          )}
          <small className="alert" style={{ color: "#e0b12e" }}>
            <i className="fas fa-exclamation-circle"></i> El archivo cargado no
            debe ser pesado
          </small>
        </div>

        <button type="submit" className="   btn-guardar">
          <Save color={"auto"} />
          Guardar Registro
        </button>
      </div>
    </form>
  );
}
