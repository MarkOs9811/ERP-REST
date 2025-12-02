import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form"; // <--- Importamos React Hook Form
import { GetMiPerfil } from "../../service/accionesConfiguracion/GetMiPerfil";
import { PostData } from "../../service/CRUD/PostData";

export const MiPerfil = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL; // O tu URL base
  const queryClient = useQueryClient();
  const [editable, setEditable] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // Estado para previsualizar foto nueva
  const fileInputRef = useRef(null); // Referencia al input de archivo oculto

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const { data: perfil = {}, isLoading } = useQuery({
    queryKey: ["perfil"],
    queryFn: GetMiPerfil,
    refetchOnWindowFocus: false,
    retry: 1,
    refetchOnMount: false,
  });

  const persona = perfil?.empleado?.persona || {};
  const empleado = perfil?.empleado || {};
  const distrito = persona?.distrito || {};
  const provincia = distrito?.provincia || {};
  const departamento = provincia?.departamento || {};

  // Cargar datos en el formulario cuando llegan del backend
  useEffect(() => {
    if (persona.id) {
      reset({
        nombre: persona.nombre,
        apellidos: persona.apellidos,
        fecha_nacimiento: persona.fecha_nacimiento,
        tipo_documento: persona.tipo_documento,
        documento_identidad: persona.documento_identidad,
        telefono: persona.telefono,
        direccion: persona.direccion,
      });
    }
  }, [persona, reset]);

  // Manejar clic en "Cambiar foto"
  const handleFotoClick = () => {
    if (editable) {
      fileInputRef.current.click();
    }
  };

  // Manejar cambio de archivo (Previsualización)
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file)); // Crea URL temporal para vista previa
      setValue("foto", file); // Registra el archivo en react-hook-form
    }
  };

  // Enviar formulario
  const onSubmit = async (data) => {
    // Usamos FormData para enviar archivos y textos
    const formData = new FormData();

    // Agregamos campos de texto
    formData.append("nombre", data.nombre);
    formData.append("apellidos", data.apellidos);
    formData.append("fecha_nacimiento", data.fecha_nacimiento || "");
    formData.append("tipo_documento", data.tipo_documento || "");
    formData.append("documento_identidad", data.documento_identidad || "");
    formData.append("telefono", data.telefono || "");
    formData.append("direccion", data.direccion || "");

    // Agregamos la foto solo si existe una nueva seleccionada
    if (data.foto) {
      formData.append("foto", data.foto);
    }

    const success = await PostData("miPerfilUpdate", formData);

    if (success) {
      setEditable(false);
      setPreviewImage(null); // Limpiar preview
      queryClient.invalidateQueries(["perfil"]); // Recargar datos del perfil
    }
  };

  // Determinar qué imagen mostrar (Nueva > Backend > Default)
  const currentImageSrc = previewImage
    ? previewImage
    : perfil.fotoPerfil
    ? `${BASE_URL}/storage/${perfil.fotoPerfil}`
    : "/images/avatar_default.png";

  return (
    <div className="w-100 p-3">
      <div className="row g-3">
        {/* Perfil lateral */}
        <div className="col-md-4 ">
          <div
            className="card border-0 shadow-sm p-4 h-100"
            style={{
              borderRadius: 20,
              background: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 450,
            }}
          >
            <div className="mb-3">
              <div
                style={{
                  width: 140,
                  height: 140,
                  margin: "0 auto",
                  borderRadius: "50%",
                  border: "2px dashed #e8c7c7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#faf0f0",
                  overflow: "hidden", // Importante para que la img no salga del borde
                }}
              >
                <img
                  src={currentImageSrc}
                  alt="Avatar"
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="mt-2 text-muted small text-center">
                Permitido <b>*.jpeg, *.jpg, *.png </b>
                <br />
                Tamaño máximo de 3 Mb
              </div>
            </div>

            {/* Input oculto para el archivo */}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={onFileChange}
            />

            <button
              className="btn w-50 mx-auto"
              type="button"
              onClick={handleFotoClick}
              disabled={!editable} // Solo habilitado si está en modo edición
              style={{
                background: editable ? "#ffeaea" : "#f0f0f0",
                color: editable ? "#ee5252" : "#999",
                fontWeight: 500,
                cursor: editable ? "pointer" : "not-allowed",
              }}
            >
              Cambiar foto
            </button>
          </div>
        </div>

        {/* Formulario de datos */}
        <div className="col-md-8">
          <form
            onSubmit={handleSubmit(onSubmit)} // Conectamos handleSubmit
            className="card border-0 shadow-sm p-4 h-100"
            style={{ borderRadius: 20, background: "#fff" }}
          >
            <div className="d-flex justify-content-between align-items-center border-bottom mb-3">
              <p className="">Mi Información</p>

              <div className="d-flex justify-content-end mb-2 align-items-center">
                <label
                  htmlFor="switch-editar"
                  className="text-muted me-2 mb-0"
                  style={{ cursor: "pointer" }}
                >
                  Editar
                </label>
                <div className="form-switch d-flex">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="switch-editar"
                    checked={editable}
                    onChange={() => {
                      setEditable((e) => !e);
                      if (editable) reset(); // Si cancela edición, resetear cambios
                    }}
                    style={{
                      accentColor: "#ee5252",
                      width: 45,
                      height: 22,
                      cursor: "pointer",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="row g-3">
              {/* Datos personales con Register */}
              <div className="col-md-6">
                <label className="form-label text-secondary small">
                  Nombre
                </label>
                <input
                  className={`form-control ${
                    errors.nombre ? "is-invalid" : ""
                  }`}
                  disabled={!editable}
                  {...register("nombre", {
                    required: "El nombre es obligatorio",
                  })}
                />
                {errors.nombre && (
                  <small className="text-danger">{errors.nombre.message}</small>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label text-secondary small">
                  Apellidos
                </label>
                <input
                  className={`form-control ${
                    errors.apellidos ? "is-invalid" : ""
                  }`}
                  disabled={!editable}
                  {...register("apellidos", {
                    required: "El apellido es obligatorio",
                  })}
                />
                {errors.apellidos && (
                  <small className="text-danger">
                    {errors.apellidos.message}
                  </small>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label text-secondary small">
                  Fecha de nacimiento
                </label>
                <input
                  type="date"
                  className="form-control"
                  disabled={!editable}
                  {...register("fecha_nacimiento")}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-secondary small">
                  Tipo de documento
                </label>
                <input
                  className="form-control"
                  disabled={!editable}
                  {...register("tipo_documento")}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-secondary small">
                  Documento de identidad
                </label>
                <input
                  className="form-control"
                  disabled={!editable}
                  {...register("documento_identidad")}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-secondary small">
                  Teléfono
                </label>
                <input
                  className="form-control"
                  disabled={!editable}
                  {...register("telefono")}
                />
              </div>

              <div className="col-12">
                <label className="form-label text-secondary small">
                  Dirección
                </label>
                <input
                  className="form-control"
                  disabled={!editable}
                  {...register("direccion")}
                />
              </div>

              {/* Ubicación (Solo lectura por ahora, o podrías hacer selects si quisieras editarlos) */}
              <div className="col-md-4">
                <label className="form-label text-secondary small">
                  Departamento
                </label>
                <input
                  className="form-control"
                  value={departamento?.nombre || ""}
                  disabled
                />
              </div>
              <div className="col-md-4">
                <label className="form-label text-secondary small">
                  Provincia
                </label>
                <input
                  className="form-control"
                  value={provincia?.nombre || ""}
                  disabled
                />
              </div>
              <div className="col-md-4">
                <label className="form-label text-secondary small">
                  Distrito
                </label>
                <input
                  className="form-control"
                  value={distrito?.nombre || ""}
                  disabled
                />
              </div>

              {/* Datos laborales (Visualización) */}
              <div className="card border p-3 mb-3">
                {/* ... (Todo tu bloque de datos laborales igual que antes) ... */}
                <div className="h6 text-muted mb-3">
                  Información del Empleado
                </div>
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="text-secondary small mb-1">Salario</div>
                    <div className="fw-semibold">{empleado.salario || "-"}</div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-secondary small mb-1">Cargo</div>
                    <div className="fw-semibold">
                      {empleado.cargo?.nombre || "-"}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-secondary small mb-1">Área</div>
                    <div className="fw-semibold">
                      {empleado.area?.nombre || "-"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button
                className="btn-guardar" // Asegúrate de tener una clase para esto
                type="submit"
                disabled={!editable}
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
