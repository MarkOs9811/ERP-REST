import React from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  FileText,
  Upload,
  UserCircle,
} from "lucide-react";

export function Paso1Personales({
  register,
  errors,
  setValue,
  watch, // <-- Recibimos watch
  departamentoList,
  provinciaList,
  distritoList,
  selectedDepartamento,
  setSelectedDepartamento,
  selectedProvincia,
  setSelectedProvincia,
  preview,
  setPreview,
  fileInputRef,
}) {
  // Observamos el valor seleccionado en "tipo_documento"
  const tipoDocumentoSeleccionado = watch("tipo_documento");

  // Función para manejar la imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setValue("fotoPerfil", file, { shouldValidate: true });
    }
  };

  // Función para determinar el maxLength según el tipo de documento
  const getMaxLen = () => {
    if (tipoDocumentoSeleccionado === "DNI") return 8;
    if (tipoDocumentoSeleccionado === "Carnet De Extranjeria") return 12;
    return 15; // Un default por si acaso
  };

  return (
    <div className="row g-3">
      <div className="col-md-12">
        <div className="card border p-4">
          <h5 className="mb-4" style={{ color: "#15669c" }}>
            Paso 1: Datos Personales
          </h5>

          {/* FOTO DE PERFIL */}
          <div className="d-flex flex-column align-items-center text-center mb-4">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            {preview ? (
              <img
                src={preview}
                alt="Vista previa"
                className="mb-3 shadow-sm"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #eee",
                }}
              />
            ) : (
              <UserCircle
                size={150}
                className="mb-3 text-muted"
                strokeWidth={1}
              />
            )}
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => fileInputRef.current.click()}
            >
              <Upload size={16} className="me-2" /> Seleccionar Imagen
            </button>
            <input
              type="hidden"
              {...register("fotoPerfil", {
                required: "La imagen de perfil es obligatoria",
              })}
            />
            {errors.fotoPerfil && (
              <div className="text-danger mt-2 small">
                {errors.fotoPerfil.message}
              </div>
            )}
          </div>

          {/* DATOS PERSONALES */}
          <div className="row">
            <div className="col-md-5 mb-3">
              <label className="form-label small fw-semi-bold text-muted">
                <FileText size={16} className="me-1" /> Tipo Documento
              </label>
              <select
                className={`form-select ${errors.tipo_documento ? "is-invalid" : ""}`}
                {...register("tipo_documento", {
                  required: "Debe seleccionar un tipo de documento",
                  // Si cambian el tipo de documento, limpiamos el campo del número para evitar errores
                  onChange: () =>
                    setValue("num_documento", "", { shouldValidate: true }),
                })}
              >
                <option value="">Seleccione...</option>
                <option value="DNI">DNI</option>
                <option value="Carnet De Extranjeria">
                  CARNET DE EXTRANJERIA
                </option>
              </select>
              {errors.tipo_documento && (
                <div className="invalid-feedback">
                  {errors.tipo_documento.message}
                </div>
              )}
            </div>

            <div className="col-md-7 mb-3">
              <label className="form-label small fw-semi-bold text-muted">
                Número de Documento
              </label>
              <input
                className={`form-control ${errors.num_documento ? "is-invalid" : ""}`}
                type="text"
                maxLength={getMaxLen()} // Límite dinámico
                placeholder="Número de Documento"
                {...register("num_documento", {
                  required: "El número es obligatorio",
                  validate: {
                    // Validaciones dinámicas usando 'validate'
                    formatoCorrecto: (value) => {
                      if (!tipoDocumentoSeleccionado)
                        return "Seleccione primero el tipo de documento";

                      if (tipoDocumentoSeleccionado === "DNI") {
                        const esSoloNumeros = /^[0-9]+$/.test(value);
                        if (!esSoloNumeros)
                          return "El DNI solo debe contener números";
                        if (value.length !== 8)
                          return "El DNI debe tener exactamente 8 dígitos";
                      }

                      if (
                        tipoDocumentoSeleccionado === "Carnet De Extranjeria"
                      ) {
                        const esAlfanumerico = /^[a-zA-Z0-9]+$/.test(value);
                        if (!esAlfanumerico)
                          return "El CE solo debe contener letras y números";
                        if (value.length < 9)
                          return "El CE debe tener al menos 9 caracteres";
                      }

                      return true;
                    },
                  },
                })}
              />
              {errors.num_documento && (
                <div className="invalid-feedback">
                  {errors.num_documento.message}
                </div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semi-bold text-muted">
              <User size={16} className="me-1" /> Nombre
            </label>
            <input
              className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
              {...register("nombre", { required: "El nombre es requerido" })}
              placeholder="Nombre del empleado"
            />
            {errors.nombre && (
              <div className="invalid-feedback">{errors.nombre.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semi-bold text-muted">
              <User size={16} className="me-1" /> Apellidos
            </label>
            <input
              className={`form-control ${errors.apellidos ? "is-invalid" : ""}`}
              {...register("apellidos", {
                required: "Los apellidos son requeridos",
              })}
              placeholder="Apellidos del empleado"
            />
            {errors.apellidos && (
              <div className="invalid-feedback">{errors.apellidos.message}</div>
            )}
          </div>

          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label small fw-semi-bold text-muted">
                <Calendar size={16} className="me-1" /> F. Nacimiento
              </label>
              <input
                className={`form-control ${errors.fecha_nacimiento ? "is-invalid" : ""}`}
                type="date"
                {...register("fecha_nacimiento", { required: "Requerido" })}
              />
              {errors.fecha_nacimiento && (
                <div className="invalid-feedback">
                  {errors.fecha_nacimiento.message}
                </div>
              )}
            </div>
            <div className="col-6 mb-3">
              <label className="form-label small fw-semi-bold text-muted">
                <Phone size={16} className="me-1" /> Nº de contacto
              </label>
              <input
                className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
                type="tel" // Cambiado de "number" a "tel"
                maxLength={9} // Limita visualmente a 9 caracteres
                placeholder="Ej: 987654321"
                {...register("telefono", {
                  required: "El teléfono es requerido",
                  pattern: {
                    value: /^[0-9]{9}$/, // Expresión regular: exactamente 9 números del 0 al 9
                    message: "Debe contener exactamente 9 dígitos numéricos",
                  },
                })}
              />
              {errors.telefono && (
                <div className="invalid-feedback">
                  {errors.telefono.message}
                </div>
              )}
            </div>
          </div>

          {/* UBICACIÓN */}
          <div className="row">
            <div className="col-4 mb-3">
              <label className="form-label small fw-semi-bold text-muted">
                <MapPin size={16} className="me-1" /> Depto.
              </label>
              <select
                className={`form-select ${errors.departamento ? "is-invalid" : ""}`}
                {...register("departamento", {
                  required: "Requerido",
                  onChange: (e) => {
                    setSelectedDepartamento(e.target.value);
                    setSelectedProvincia("");
                    setValue("provincia", "");
                    setValue("distrito", "");
                  },
                })}
              >
                <option value="">Seleccione...</option>
                {departamentoList?.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.nombre.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-4 mb-3">
              <label className="form-label small fw-semi-bold text-muted">
                <MapPin size={16} className="me-1" /> Provincia
              </label>
              <select
                className={`form-select ${errors.provincia ? "is-invalid" : ""}`}
                {...register("provincia", {
                  required: "Requerido",
                  onChange: (e) => {
                    setSelectedProvincia(e.target.value);
                    setValue("distrito", "");
                  },
                })}
                disabled={!selectedDepartamento}
              >
                <option value="">Seleccione...</option>
                {provinciaList?.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-4 mb-3">
              <label className="form-label small fw-semi-bold text-muted">
                <MapPin size={16} className="me-1" /> Distrito
              </label>
              <select
                className={`form-select ${errors.distrito ? "is-invalid" : ""}`}
                {...register("distrito", { required: "Requerido" })}
                disabled={!selectedProvincia}
              >
                <option value="">Seleccione...</option>
                {distritoList?.map((dist) => (
                  <option key={dist.id} value={dist.id}>
                    {dist.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semi-bold text-muted">
              <MapPin size={16} className="me-1" /> Dirección
            </label>
            <input
              className={`form-control ${errors.direccion ? "is-invalid" : ""}`}
              {...register("direccion", { required: "Requerido" })}
              placeholder="Dirección"
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semi-bold text-muted">
              <Mail size={16} className="me-1" /> Correo Electrónico
            </label>
            <input
              type="email"
              className={`form-control ${errors.correo ? "is-invalid" : ""}`}
              {...register("correo", { required: "Requerido" })}
              placeholder="Correo Electrónico"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
