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

export function PlatoAdd({ handleCloseModal }) {
  // Estado para la lógica de la imagen (separado de useForm)
  const [formData, setFormData] = useState({
    foto: null,
  });

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
          "/gestionPlatos/getCategoriaTrue"
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
        formDataToSend
      );

      if (response.data.success) {
        ToastAlert("success", "Registro exitoso!");
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
          <label className="form-label text-muted small fw-bold mb-2">
            <ImageIcon size={14} className="me-1" /> Imagen del Plato
          </label>

          <div
            {...getRootProps()}
            className={`border rounded-3 d-flex align-items-center justify-content-center p-3 position-relative ${
              isDragActive
                ? "border-primary bg-light"
                : "border-secondary border-opacity-25"
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
              <div className="text-center w-100">
                <img
                  src={fotoPreview}
                  alt="Preview"
                  className="rounded shadow-sm"
                  style={{ maxHeight: "120px", objectFit: "cover" }}
                />
                <div className="mt-2 text-primary small">
                  Click para cambiar
                </div>
              </div>
            ) : (
              <div className="text-center text-muted">
                <UploadCloud
                  size={32}
                  className="mb-2 text-secondary opacity-50"
                />
                <p className="small mb-0">Arrastra o haz click para subir</p>
              </div>
            )}
          </div>
        </div>

        {/* --- Grid de Campos --- */}
        <div className="row g-3">
          {/* Categoría */}
          <div className="col-md-6">
            <label className="form-label text-muted small fw-bold">
              Categoría
            </label>
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <Tags size={16} />
              </span>
              <select
                className={`form-select border-start-0 shadow-none ${
                  errors.categoria ? "is-invalid" : ""
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
              <div className="text-danger small mt-1">
                {errors.categoria.message}
              </div>
            )}
          </div>

          {/* Nombre */}
          <div className="col-md-6">
            <label className="form-label text-muted small fw-bold">
              Nombre del Plato
            </label>
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <Utensils size={16} />
              </span>
              <input
                type="text"
                className={`form-control border-start-0 shadow-none ${
                  errors.nombre ? "is-invalid" : ""
                }`}
                placeholder="Ej. Lomo Saltado"
                {...register("nombre", { required: "Campo obligatorio" })}
              />
            </div>
            {errors.nombre && (
              <div className="text-danger small mt-1">
                {errors.nombre.message}
              </div>
            )}
          </div>

          {/* Precio */}
          <div className="col-md-12">
            <label className="form-label text-muted small fw-bold">
              Precio Unitario
            </label>
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0 text-muted">
                S/
              </span>
              <input
                type="text"
                className={`form-control border-start-0 shadow-none ${
                  errors.precio ? "is-invalid" : ""
                }`}
                placeholder="0.00"
                {...register("precio", {
                  required: "Requerido",
                  validate: validatePrecio,
                })}
                onInput={handlePrecioInput}
              />
            </div>
            {errors.precio && (
              <div className="text-danger small mt-1">
                {errors.precio.message}
              </div>
            )}
          </div>

          {/* Descripción */}
          <div className="col-12">
            <label className="form-label text-muted small fw-bold">
              Descripción
            </label>
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <AlignLeft size={16} />
              </span>
              <input
                type="text"
                className={`form-control border-start-0 shadow-none ${
                  errors.descripcion ? "is-invalid" : ""
                }`}
                placeholder="Breve descripción del plato..."
                {...register("descripcion", { required: "Requerido" })}
              />
            </div>
            {errors.descripcion && (
              <div className="text-danger small mt-1">
                {errors.descripcion.message}
              </div>
            )}
          </div>
        </div>

        {/* --- Footer de Botones --- */}
        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
          <button
            type="button"
            className="btn-cerrar-modal px-4 rounded-pill"
            onClick={handleCloseModal}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-guardar btn-dark px-4 rounded-pill"
          >
            Guardar Plato
          </button>
        </div>
      </form>
    </div>
  );
}
