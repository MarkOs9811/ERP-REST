import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { handlePrecioInput, validatePrecio } from "../../hooks/InputHandlers";
import axiosInstance from "../../api/AxiosInstance";
import axiosInstanceJava from "../../api/AxiosInstanceJava";
import ToastAlert from "../componenteToast/ToastAlert";

export function PlatoEditar({ dataPlato, handleCloseModal }) {
  const [fotoPreview, setFotoPreview] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [fotoFile, seetFotoFile] = useState(null);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
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
          "/gestionPlatos/getCategoriaTrue"
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
  }, [dataPlato]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("nombre", data.nombre);
      formData.append("descripcion", data.descripcion);
      formData.append("precio", data.precio);
      formData.append("categoriaId", data.categoria);

      if (fotoFile) {
        formData.append("foto", fotoFile);
      }

      // Realiza la solicitud PUT directamente
      const response = await axiosInstanceJava.put(
        `/platos/${dataPlato.id}`,
        formData
      );

      if (response.data.success) {
        ToastAlert("success", "Actualizacion Existosa!");
        reset();
        handleCloseModal();
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        ToastAlert(
          "error",
          error.response.data.message || "Error de validación"
        );
      } else {
        ToastAlert("error", "Error de conexión");
      }
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
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="px-2">
        <div className="card d-flex">
          <label htmlFor="foto" className="form-label">
            Foto Plato
          </label>
          <div className="mb-4">
            <div
              {...getRootProps()}
              className="dropzone border rounded p-4 text-center"
              style={{ cursor: "pointer" }}
            >
              <img
                src={fotoPreview || `${BASE_URL}/storage/${dataPlato.foto}`}
                width={150}
                className="rounded m-auto"
              />
              <input
                {...getInputProps()}
                id="foto"
                name="foto"
                className="d-none"
              />
              {!fotoPreview && (
                <p className="text-muted">
                  Haz clic o arrastra para cargar el logo
                </p>
              )}
              <button type="button" className="btn btn-outline-primary mt-2">
                Seleccionar archivo
              </button>
            </div>
            <p className="text-danger">{errors.foto?.message}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <div className="form-floating mb-3">
              <select
                className="form-select"
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
              <label htmlFor="categoria">Categoría</label>
              {errors.categoria && (
                <div className="invalid-feedback">
                  {errors.categoria.message}
                </div>
              )}
            </div>
          </div>
          <div className="col-6">
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="nombre"
                {...register("nombre", {
                  required: "Campo obligatorio",
                })}
                defaultValue={dataPlato.nombre || ""}
              />
              <label htmlFor="nombre">Nombre Plato</label>
              {errors.nombre && (
                <div className="invalid-feedback">{errors.nombre.message}</div>
              )}
            </div>
          </div>
        </div>

        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="precio"
            {...register("precio", {
              required: "Campo obligatorio",
              validate: validatePrecio,
            })}
            onInput={handlePrecioInput}
            defaultValue={dataPlato.precio || ""}
          />
          <label htmlFor="precio">Precio S/.</label>
          {errors.precio && (
            <div className="invalid-feedback">{errors.precio.message}</div>
          )}
        </div>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="descripcion"
            {...register("descripcion", {
              required: "Campo obligatorio",
            })}
            defaultValue={dataPlato.descripcion || ""}
          />
          <label htmlFor="descripcion">Descripcion</label>
          {errors.descripcion && (
            <div className="invalid-feedback">{errors.descripcion.message}</div>
          )}
        </div>
        <div className="d-flex justify-content-center mt-4">
          <button className="btn-cerrar-modal mx-3" onClick={handleCloseModal}>
            Cerrar
          </button>
          <button className="btn-guardar">Guardar Cambios</button>
        </div>
      </form>
    </div>
  );
}
