import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

// ICONOS LUCIDE
import {
  User,
  Mail,
  Lock,
  Building2,
  Briefcase,
  Banknote,
  Clock,
  IdCard,
  ImagePlus,
  Trash2,
  CreditCard,
} from "lucide-react";

import ToastAlert from "../componenteToast/ToastAlert";
import axiosInstance from "../../api/AxiosInstance";

// TUS CUSTOM HOOKS
import {
  handleInputChange,
  handleSelectChange,
} from "../../hooks/InputHandlers";

export function UsuarioForm({ handleCloseModal }) {
  const [tipoDocumento, setTipoDocumento] = useState("DNI");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const queryClient = useQueryClient();

  // Estado local para datos auxiliares
  const [formData, setFormData] = useState({
    cargo: "",
    salario: "",
  });

  const [areas, setAreas] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [fotoPreview, setFotoPreview] = useState(null);

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [areasRes, cargosRes, horariosRes] = await Promise.all([
          axiosInstance.get("/areas"),
          axiosInstance.get("/cargos"),
          axiosInstance.get("/horarios"),
        ]);
        setAreas(areasRes.data.data);
        setCargos(cargosRes.data);
        setHorarios(horariosRes.data);
      } catch (error) {
        ToastAlert("error", "Error cargando datos: " + error);
      }
    };
    fetchData();
  }, []);

  // --- 2. REACT HOOK FORM ---
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // --- 3. LÓGICA DE NEGOCIO ---

  // Cambio de cargo -> Fetch Salario
  const handleCargoChange = async (selectedCargoId) => {
    setFormData({ ...formData, cargo: selectedCargoId });

    if (selectedCargoId) {
      try {
        const response = await axiosInstance.get(
          `/getSalarioCargo/${selectedCargoId}`
        );
        const salario = response.data.salario;
        setFormData({ ...formData, cargo: selectedCargoId, salario });
        setValue("salario", salario);
      } catch (error) {
        console.error("Error al obtener salario:", error);
      }
    } else {
      setFormData({ ...formData, salario: "" });
      setValue("salario", "");
    }
  };

  // Submit
  const onSubmit = async (data) => {
    const formDataToSend = new FormData();
    Object.keys(data).forEach((key) => {
      formDataToSend.append(key, data[key]);
    });

    if (formData.fotoPerfil) {
      formDataToSend.append("fotoPerfil", formData.fotoPerfil);
    }

    try {
      const response = await axiosInstance.post(
        "/storeUsuario",
        formDataToSend
      );
      if (response.data.success) {
        ToastAlert("success", response.data.success);
        queryClient.invalidateQueries({ queryKey: ["usuarios"] });
        handleCloseModal(); // Cerrar modal al guardar
      } else {
        ToastAlert("error", response.data.message || "Error inesperado");
      }
    } catch (error) {
      // Manejo de errores simplificado para el ejemplo
      if (error.response?.data?.errors) {
        ToastAlert("error", "Verifique los campos ingresados");
      } else {
        ToastAlert(
          "error",
          error.response?.data?.error || "Error al registrar"
        );
      }
    }
  };

  // Dropzone
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] }, // Sintaxis moderna de dropzone
    maxFiles: 1,
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0)
        return ToastAlert("error", "Solo imágenes.");
      const file = acceptedFiles[0];
      if (file) {
        setFotoPreview(URL.createObjectURL(file));
        setFormData({ ...formData, fotoPerfil: file });
      }
    },
  });

  const removePhoto = (e) => {
    e.stopPropagation();
    setFotoPreview(null);
    setFormData({ ...formData, fotoPerfil: null });
  };

  // --- 4. RENDER ---
  return (
    <div className="card border-0 shadow-none bg-transparent p-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card-body p-2">
          {/* SECCIÓN 1: FOTO DE PERFIL (Diseño Horizontal Compacto) */}
          <div className="d-flex align-items-center gap-3 mb-4 p-3  rounded-3 border border-dashed">
            <div
              {...getRootProps()}
              className="position-relative d-flex align-items-center justify-content-center bg-white rounded-circle shadow-sm"
              style={{
                width: "80px",
                height: "80px",
                cursor: "pointer",
                overflow: "hidden",
                border: errors.fotoPerfil
                  ? "2px solid var(--bs-danger)"
                  : "2px solid #e2e8f0",
              }}
            >
              <input {...getInputProps()} id="fotoPerfil" />
              {fotoPreview ? (
                <img
                  src={fotoPreview}
                  alt="Preview"
                  className="w-100 h-100 object-fit-cover"
                />
              ) : (
                <ImagePlus size={28} className="text-muted opacity-50" />
              )}
            </div>

            <div className="flex-grow-1">
              <h6
                className="m-0 fw-bold text-secondary"
                style={{ fontSize: "0.9rem" }}
              >
                Foto de Perfil
              </h6>
              <p className="m-0 text-muted small lh-sm mb-2">
                Haz clic en el círculo para subir una imagen.
              </p>
              {fotoPreview && (
                <button
                  type="button"
                  onClick={removePhoto}
                  className="btn btn-sm btn-outline-danger py-0 px-2"
                  style={{ fontSize: "0.75rem" }}
                >
                  <Trash2 size={12} className="me-1" /> Quitar foto
                </button>
              )}
              {errors.fotoPerfil && (
                <div className="text-danger small mt-1">
                  {errors.fotoPerfil.message}
                </div>
              )}
            </div>
          </div>

          {/* SECCIÓN 2: DOCUMENTOS */}
          <h6 className="text-danger fw-bold text-uppercase small mb-3 border-bottom pb-2">
            Información Personal
          </h6>
          <div className="row g-3 mb-3">
            {/* Tipo Documento */}
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted mb-1">
                Tipo Doc.
              </label>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <IdCard size={16} />
                </span>
                <select
                  className={`form-select border-start-0 ${
                    errors.tipo_documento ? "is-invalid" : ""
                  }`}
                  {...register("tipo_documento", { required: "Requerido" })}
                  onChange={handleSelectChange(
                    setTipoDocumento,
                    setValue,
                    "tipo_documento",
                    [{ name: "numero_documento", setter: setNumeroDocumento }]
                  )}
                >
                  <option value="DNI">DNI</option>
                  <option value="extranjeria">Carnet Ext.</option>
                </select>
              </div>
            </div>

            {/* Número Documento */}
            <div className="col-md-8">
              <label className="form-label small fw-semibold text-muted mb-1">
                Número Documento
              </label>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <CreditCard size={16} />
                </span>
                <input
                  type="text"
                  className={`form-control border-start-0 ${
                    errors.numero_documento ? "is-invalid" : ""
                  }`}
                  placeholder="Ingrese número"
                  value={numeroDocumento}
                  {...register("numero_documento", {
                    required: "Requerido",
                    minLength: {
                      value: tipoDocumento === "DNI" ? 8 : 10,
                      message: "Longitud incorrecta",
                    },
                    maxLength: {
                      value: tipoDocumento === "DNI" ? 8 : 10,
                      message: "Longitud incorrecta",
                    },
                  })}
                  onChange={handleInputChange(
                    setNumeroDocumento,
                    setValue,
                    "numero_documento",
                    /^\d*$/,
                    tipoDocumento === "DNI" ? 8 : 10
                  )}
                />
              </div>
              {errors.numero_documento && (
                <span className="text-danger small">
                  {errors.numero_documento.message}
                </span>
              )}
            </div>
          </div>

          {/* Nombres y Apellidos */}
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted mb-1">
                Nombres
              </label>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  className={`form-control border-start-0 ${
                    errors.nombres ? "is-invalid" : ""
                  }`}
                  placeholder="Ej. Juan Carlos"
                  {...register("nombres", { required: "Nombre requerido" })}
                />
              </div>
              {errors.nombres && (
                <span className="text-danger small">
                  {errors.nombres.message}
                </span>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted mb-1">
                Apellidos
              </label>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  className={`form-control border-start-0 ${
                    errors.apellidos ? "is-invalid" : ""
                  }`}
                  placeholder="Ej. Pérez López"
                  {...register("apellidos", { required: "Apellido requerido" })}
                />
              </div>
              {errors.apellidos && (
                <span className="text-danger small">
                  {errors.apellidos.message}
                </span>
              )}
            </div>
          </div>

          {/* SECCIÓN 3: CUENTA Y ACCESO */}
          <h6 className="text-danger fw-bold text-uppercase small mt-4 mb-3 border-bottom pb-2">
            Cuenta y Acceso
          </h6>
          <div className="row g-3 mb-3">
            <div className="col-md-7">
              <label className="form-label small fw-semibold text-muted mb-1">
                Correo Electrónico
              </label>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  className={`form-control border-start-0 ${
                    errors.correo ? "is-invalid" : ""
                  }`}
                  placeholder="usuario@empresa.com"
                  {...register("correo", {
                    required: "Correo requerido",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Correo inválido",
                    },
                  })}
                />
              </div>
              {errors.correo && (
                <span className="text-danger small">
                  {errors.correo.message}
                </span>
              )}
            </div>
            <div className="col-md-5">
              <label className="form-label small fw-semibold text-muted mb-1">
                Método Auth
              </label>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Lock size={16} />
                </span>
                <select
                  className={`form-select border-start-0 ${
                    errors.tipoAuth ? "is-invalid" : ""
                  }`}
                  {...register("tipoAuth", { required: "Requerido" })}
                >
                  <option value="">Seleccione...</option>
                  <option value="manual">Manual</option>
                  <option value="google Oauth2">Google</option>
                </select>
              </div>
              {errors.tipoAuth && (
                <span className="text-danger small">
                  {errors.tipoAuth.message}
                </span>
              )}
            </div>
          </div>

          {/* SECCIÓN 4: DATOS LABORALES */}
          <h6 className="text-danger fw-bold text-uppercase small mt-4 mb-3 border-bottom pb-2">
            Datos Laborales
          </h6>
          <div className="row g-3 mb-3">
            {/* Área */}
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted mb-1">
                Área
              </label>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Building2 size={16} />
                </span>
                <select
                  className={`form-select border-start-0 ${
                    errors.area ? "is-invalid" : ""
                  }`}
                  {...register("area", { required: "Requerido" })}
                >
                  <option value="">Seleccione...</option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre}
                    </option>
                  ))}
                </select>
              </div>
              {errors.area && (
                <span className="text-danger small">{errors.area.message}</span>
              )}
            </div>

            {/* Cargo */}
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted mb-1">
                Cargo
              </label>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Briefcase size={16} />
                </span>
                <select
                  className={`form-select border-start-0 ${
                    errors.cargo ? "is-invalid" : ""
                  }`}
                  {...register("cargo", { required: "Requerido" })}
                  onChange={(e) => {
                    setValue("cargo", e.target.value);
                    handleCargoChange(e.target.value);
                  }}
                >
                  <option value="">Seleccione...</option>
                  {cargos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>
              {errors.cargo && (
                <span className="text-danger small">
                  {errors.cargo.message}
                </span>
              )}
            </div>

            {/* Salario */}
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted mb-1">
                Salario
              </label>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Banknote size={16} />
                </span>
                <input
                  type="number"
                  readOnly
                  className="form-control border-start-0 "
                  {...register("salario", { required: "Requerido" })}
                />
              </div>
            </div>

            {/* Horario */}
            <div className="col-md-8">
              <label className="form-label small fw-semibold text-muted mb-1">
                Horario
              </label>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Clock size={16} />
                </span>
                <select
                  className={`form-select border-start-0 ${
                    errors.horario ? "is-invalid" : ""
                  }`}
                  {...register("horario", { required: "Requerido" })}
                >
                  <option value="">Seleccione Horario...</option>
                  {horarios.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.horaEntrada} - {h.horaSalida}
                    </option>
                  ))}
                </select>
              </div>
              {errors.horario && (
                <span className="text-danger small">
                  {errors.horario.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER ACCIONES */}
        <div className="card-footer border-0 d-flex justify-content-end bg-transparent gap-2 pt-2 pb-0">
          <button
            type="button"
            className="btn-cerrar-modal btn-sm px-4 rounded-3"
            onClick={handleCloseModal}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-guardar btn-sm px-4 rounded-3 fw-bold"
          >
            Registrar Usuario
          </button>
        </div>
      </form>
    </div>
  );
}
