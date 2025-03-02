import { useEffect, useState } from "react";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import {
  validatePrecio,
  handlePrecioInput,
  validateTelefono,
} from "../../hooks/InputHandlers";
import axiosInstanceJava from "../../api/AxiosInstanceJava";

export function PlatoAdd({ handleCloseModal }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    foto: null,
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const [categorias, setCategorias] = useState([]);
  const [fotoPreview, setFotoPreview] = useState(null);

  // GET CATEGORIAS
  useEffect(() => {
    const getCategoria = async () => {
      try {
        const response = await axiosInstance.get(
          "/gestionPlatos/getCategoriaTrue"
        );
        if (response.data.success) {
          setCategorias(response.data.data);
        } else {
          console.log(response.data.message);
        }
      } catch (errors) {
        console.log("error de conexion");
      }
    };
    getCategoria();
  }, []);

  // GUARDAR PLATO API
  const onSubmit = async (data) => {
    // Crea un objeto FormData
    const formDataToSend = new FormData();
    formDataToSend.append("nombre", data.nombre);
    formDataToSend.append("descripcion", data.descripcion);
    formDataToSend.append("precio", data.precio);
    formDataToSend.append("categoria", data.categoria);

    // Agrega la foto (si existe)
    if (fotoPreview) {
      formDataToSend.append("foto", formData.foto); // Asegúrate de que "foto" es el campo correcto
    }
    try {
      // Envía la solicitud con axios
      const response = await axiosInstanceJava.post("/platos", formDataToSend);

      if (response.data.success) {
        ToastAlert("success", "Registro exitoso!");
        handleCloseModal();
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);

      if (error.response && error.response.data && error.response.data.errors) {
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

  // PARA MSOTRAR LA PREVISUALIZACION DE LA IMAGEN
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        setFotoPreview(objectUrl);
        setFormData({ ...formData, foto: file }); // Guardar el archivo para enviarlo al servidor
      }
    },
  });
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Foto de perfil */}
        <div className="mb-3">
          <label htmlFor="foto" className="form-label">
            Imagen Plato
          </label>
          <div
            {...getRootProps()}
            className="dropzone border rounded p-4 text-center justify-center"
            style={{ cursor: "pointer" }}
          >
            <div className="text-center d-flex w-50 mx-auto p-0">
              {fotoPreview && (
                <img
                  src={fotoPreview}
                  alt="Foto Previsualizado"
                  className="img-fluid mb-3 mx-auto"
                  style={{
                    maxWidth: "150px",
                    borderRadius: "8px",
                    border: "2px solid #ddd",
                  }}
                />
              )}
            </div>
            <input
              {...getInputProps()}
              id="foto"
              name="foto"
              className="d-none"
            />
            <button type="button" className="btn btn-outline-primary mt-2">
              Seleccionar archivo
            </button>
            {!fotoPreview && (
              <p className="text-muted mt-3">
                Haz clic o arrastra para cargar el foto
              </p>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <div className="form-floating mb-3">
              <select
                className="form-select"
                id="categoria"
                {...register("categoria", {
                  required: "Seleccione una categoria",
                })}
              >
                <option value="">Seleccione...</option>
                {categorias.map((categoria) => (
                  <option value={categoria.id}>{categoria.nombre}</option>
                ))}
                {errors.categoria && (
                  <div className="invalid-feedback">
                    {errors.categoria.message}
                  </div>
                )}
              </select>
              <label htmlFor="categoria">Categoria</label>
            </div>
          </div>
          <div className="col-6">
            <div className="form-floating mb-3">
              <input
                type="text"
                id="nombrePlato"
                className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                placeholder=" "
                {...register("nombre", {
                  required: "Campo obligatorio",
                })}
              />
              <label to="nombrePlato">Nombre del plato</label>
              {errors.nombre && (
                <div className="invalid-feedback">{errors.nombre.message}</div>
              )}
            </div>
          </div>
        </div>

        <div className="form-floating mb-3">
          <input
            type="text"
            id="precio"
            className={`form-control ${errors.precio ? "is-invalid" : ""}`}
            placeholder=" "
            {...register("precio", {
              required: "Este campo es requerido",
              validate: validatePrecio,
            })}
            onInput={handlePrecioInput}
          />
          <label to="precio">Precio S/.</label>
          {errors.precio && (
            <div className="invalid-feedback">{errors.precio.message}</div>
          )}
        </div>
        <div className="form-floating mb-3">
          <input
            type="text"
            id="descripcion"
            className={`form-control ${errors.descripcion ? "is-invalid" : ""}`}
            placeholder=" "
            {...register("descripcion", {
              required: "Este campo es requerido",
            })}
          />
          <label to="descripcion">Descripcion</label>
          {errors.descripcion && (
            <div className="invalid-feedback">{errors.descripcion.message}</div>
          )}
        </div>

        <div className="d-flex justify-content-center mt-4">
          <button className="btn-cerrar-modal mx-3" onClick={handleCloseModal}>
            Cerrar
          </button>
          <button className="btn-guardar">Guardar Plato</button>
        </div>
      </form>
    </div>
  );
}
