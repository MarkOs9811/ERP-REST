import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  FileText,
  Briefcase,
  Clock,
  DollarSign,
  Upload,
  UserCircle,
  FileDown,
  Save,
} from "lucide-react"; // 1. Importamos los iconos

// --- Tus Imports de Servicios (sin cambios) ---
import { GetCargos } from "../../service/GetCargos";
import { GetAreas } from "../../service/GetAreas";
import { GetTipoContrato } from "../../service/GetTipoContrato";
import { GetHorarios } from "../../service/GetHorarios";
import { GetDeducciones } from "../../service/GetDeducciones";
import { GetBonificacion } from "../../service/GetBonificacion";
import { GetDepartamento } from "../../service/GetDepartamento";
import { GetProvincia } from "../../service/GetProvincia";
import { GetDistrito } from "../../service/GetDistrito";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import axiosInstance from "../../api/AxiosInstance";
import { BotonMotionGeneral } from "../../components/componentesReutilizables/BotonMotionGeneral";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";
// (No incluiste 'ContenedorPrincipal' en tu JSX, así que lo omití)

export function IngresoPlanilla() {
  // --- Toda tu lógica de Hooks (useForm, useQuery, state) sin cambios ---
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setErrors] = useState(false);

  const { data: cargosList } = useQuery({
    queryKey: ["cargos"],
    queryFn: GetCargos,
  });

  const { data: areasList = [] } = useQuery({
    queryKey: ["areas"],
    queryFn: GetAreas,
  });

  const { data: contratoList } = useQuery({
    queryKey: ["contratos"],
    queryFn: GetTipoContrato,
  });
  const { data: horariosList } = useQuery({
    queryKey: ["horarios"],
    queryFn: GetHorarios,
  });

  const {
    data: deduccionesList,
    isLoading: loadingDeducciones,
    isError: errorDeducciones,
  } = useQuery({
    queryKey: ["deducciones"],
    queryFn: GetDeducciones,
  });

  const {
    data: bonificacionesList,
    isLoading: loadingDBonificaciones,
    isError: errorBonificaciones,
  } = useQuery({
    queryKey: ["bonificacion"],
    queryFn: GetBonificacion,
  });

  const [selectedDepartamento, setSelectedDepartamento] = useState("");
  const [selectedProvincia, setSelectedProvincia] = useState("");

  const { data: departamentoList } = useQuery({
    queryKey: ["departamentos"],
    queryFn: GetDepartamento,
    staleTime: 1000 * 60 * 60,
  });

  const { data: provinciaList } = useQuery({
    queryKey: ["provincias", selectedDepartamento],
    queryFn: () => GetProvincia(selectedDepartamento),
    enabled: !!selectedDepartamento,
    staleTime: 1000 * 60 * 60,
  });

  const { data: distritoList } = useQuery({
    queryKey: ["distritos", selectedProvincia],
    queryFn: () => GetDistrito(selectedProvincia),
    enabled: !!selectedProvincia,
    staleTime: 1000 * 60 * 60,
  });

  // --- Tu lógica de onSubmit (sin cambios) ---
  const onSubmit = async (data) => {
    setLoading(true);
    setErrors(null);
    try {
      if (!data.fotoPerfil || data.fotoPerfil.length === 0) {
        // Corrección: Asegúrate de que RHF reciba el error
        setError("fotoPerfil", {
          type: "manual",
          message: "No se ha seleccionado ninguna imagen",
        });
        throw new Error("No se ha seleccionado ninguna imagen");
      }

      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "fotoPerfil") {
          formData.append("fotoPerfil", data.fotoPerfil); // El archivo ya está guardado
        } else if (key === "deducciones" || key === "bonificaciones") {
          data[key].forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          formData.append(key, data[key]);
        }
      });

      const response = await axiosInstance.post("/planilla", formData);

      if (response.data.success) {
        reset();
        setPreview(null); // Limpiar la vista previa de la imagen
        setLoading(false);
        ToastAlert("success", "Registro de Trabajador correcto");
      } else {
        setLoading(false);
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      console.error("Error al enviar:", error);
      setLoading(false);

      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          setError(key, {
            type: "manual",
            message: errors[key][0],
          });
        });
      } else if (error.message !== "No se ha seleccionado ninguna imagen") {
        // No mostrar Toast si el error fue la imagen
        ToastAlert("error", error.message || "Error en el servidor");
      }
    }
  };

  // --- Tu lógica de handleCargoChange (sin cambios) ---
  const handleCargoChange = (event) => {
    const selected = event.target.selectedOptions[0];
    const salario = selected.dataset.salario;
    const pagoPorHora = (parseFloat(salario) / 30 / 8).toFixed(2);
    setValue("salario", salario);
    setValue("pagoPorHora", pagoPorHora);
  };

  // --- Tu lógica de Imagen (con un pequeño ajuste en 'handleImageChange') ---
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setValue("fotoPerfil", file, { shouldValidate: true }); // ✅ Registra el archivo en RHF
      setError("fotoPerfil", null); // Limpia el error si existía
    }
  };

  // --- TU JSX (REDISEÑADO) ---
  return (
    <div>
      <div className="col-md-12">
        <div className="card shadow-sm border-0 p-3">
          <div className="card-header p-3">
            <h4>Datos del empleado</h4>
          </div>
          <div className="card-body">
            <form
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form-data"
            >
              <div className="row g-3">
                {/* === COLUMNA IZQUIERDA: DATOS PERSONALES === */}
                <div className="col-md-6 col-sm-12">
                  <div className="card border p-3">
                    <div className="d-flex flex-column align-items-center text-center mb-3">
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
                          className="mb-3"
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
                        <Upload size={16} className="me-2" />
                        Seleccionar Imagen
                      </button>
                      <input type="hidden" {...register("fotoPerfil")} />
                      {errors.fotoPerfil && (
                        <div className="text-danger mt-2 small">
                          {errors.fotoPerfil.message}
                        </div>
                      )}
                    </div>
                    {/* === DATOS PERSONALES (Nuevo Diseño) === */}
                    <div className="row">
                      <div className="col-md-5 mb-3">
                        <label className="form-label small fw-semi-bold text-muted">
                          <FileText size={16} className="me-1" /> Tipo Documento
                        </label>
                        <select
                          className={`form-select ${
                            errors.tipo_documento ? "is-invalid" : ""
                          }`}
                          {...register("tipo_documento", {
                            required: "Este campo es obligatorio",
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
                          className={`form-control ${
                            errors.num_documento ? "is-invalid" : ""
                          }`}
                          type="text"
                          maxLength="8"
                          placeholder="Número de Documento"
                          {...register("num_documento", {
                            required: "El N° de documento es obligatorio",
                            pattern: {
                              value: /^[0-9]+$/,
                              message: "Solo se admiten números",
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
                        className={`form-control ${
                          errors.nombre ? "is-invalid" : ""
                        }`}
                        {...register("nombre", {
                          required: "El nombre es obligatorio",
                        })}
                        placeholder="Nombre del empleado"
                      />
                      {errors.nombre && (
                        <div className="invalid-feedback">
                          {errors.nombre.message}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semi-bold text-muted">
                        <User size={16} className="me-1" /> Apellidos
                      </label>
                      <input
                        className={`form-control ${
                          errors.apellidos ? "is-invalid" : ""
                        }`}
                        {...register("apellidos", {
                          required: "El apellido es obligatorio",
                        })}
                        placeholder="Apellidos del empleado"
                      />
                      {errors.apellidos && (
                        <div className="invalid-feedback">
                          {errors.apellidos.message}
                        </div>
                      )}
                    </div>

                    <div className="row">
                      <div className="col-6 mb-3">
                        <label className="form-label small fw-semi-bold text-muted">
                          <Calendar size={16} className="me-1" /> Fecha de
                          Nacimiento
                        </label>
                        <input
                          className={`form-control ${
                            errors.fecha_nacimiento ? "is-invalid" : ""
                          }`}
                          type="date"
                          {...register("fecha_nacimiento", {
                            required: "La fecha es obligatoria",
                          })}
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
                          className={`form-control ${
                            errors.telefono ? "is-invalid" : ""
                          }`}
                          type="number"
                          placeholder="Nº de contacto"
                          {...register("telefono", {
                            required: "El teléfono es obligatorio",
                          })}
                        />
                        {errors.telefono && (
                          <div className="invalid-feedback">
                            {errors.telefono.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* === UBICACIÓN (Nuevo Diseño) === */}
                    <div className="row">
                      <div className="col-4 mb-3">
                        <label className="form-label small fw-semi-bold text-muted">
                          <MapPin size={16} className="me-1" /> Depto.
                        </label>
                        <select
                          className={`form-select ${
                            errors.departamento ? "is-invalid" : ""
                          }`}
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
                        {errors.departamento && (
                          <div className="invalid-feedback">
                            {errors.departamento.message}
                          </div>
                        )}
                      </div>
                      <div className="col-4 mb-3">
                        <label className="form-label small fw-semi-bold text-muted">
                          <MapPin size={16} className="me-1" /> Provincia
                        </label>
                        <select
                          className={`form-select ${
                            errors.provincia ? "is-invalid" : ""
                          }`}
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
                        {errors.provincia && (
                          <div className="invalid-feedback">
                            {errors.provincia.message}
                          </div>
                        )}
                      </div>
                      <div className="col-4 mb-3">
                        <label className="form-label small fw-semi-bold text-muted">
                          <MapPin size={16} className="me-1" /> Distrito
                        </label>
                        <select
                          className={`form-select ${
                            errors.distrito ? "is-invalid" : ""
                          }`}
                          {...register("distrito", {
                            required: "Requerido",
                            disabled: !selectedProvincia,
                          })}
                        >
                          <option value="">Seleccione...</option>
                          {distritoList?.map((dist) => (
                            <option key={dist.id} value={dist.id}>
                              {dist.nombre}
                            </option>
                          ))}
                        </select>
                        {errors.distrito && (
                          <div className="invalid-feedback">
                            {errors.distrito.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semi-bold text-muted">
                        <MapPin size={16} className="me-1" /> Dirección
                      </label>
                      <input
                        className={`form-control ${
                          errors.direccion ? "is-invalid" : ""
                        }`}
                        {...register("direccion", {
                          required: "La dirección es obligatoria",
                        })}
                        placeholder="Dirección"
                      />
                      {errors.direccion && (
                        <div className="invalid-feedback">
                          {errors.direccion.message}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semi-bold text-muted">
                        <Mail size={16} className="me-1" /> Correo Electrónico
                      </label>
                      <input
                        type="email"
                        className={`form-control ${
                          errors.correo ? "is-invalid" : ""
                        }`}
                        {...register("correo", {
                          required: "El correo es obligatorio",
                        })}
                        placeholder="Correo Electrónico"
                      />
                      {errors.correo && (
                        <div className="invalid-feedback">
                          {errors.correo.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* === COLUMNA DERECHA: DATOS LABORALES === */}
                <div className="col-md-6 col-sm-12">
                  <div className="card p-3 mb-3 border">
                    <h5 className="mb-3" style={{ color: "#15669c" }}>
                      Detalles del contrato
                    </h5>

                    <div className="mb-3">
                      <label className="form-label small fw-semi-bold text-muted">
                        <Briefcase size={16} className="me-1" /> Tipo Contrato
                      </label>
                      <select
                        className={`form-select ${
                          errors.contrato ? "is-invalid" : ""
                        }`}
                        {...register("contrato", { required: "Requerido" })}
                      >
                        <option value="">Seleccione...</option>
                        {contratoList?.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nombre}
                          </option>
                        ))}
                      </select>
                      {errors.contrato && (
                        <div className="invalid-feedback">
                          {errors.contrato.message}
                        </div>
                      )}
                    </div>

                    <div className="row">
                      <div className="col-6 mb-3">
                        <label className="form-label small fw-semi-bold text-muted">
                          <Calendar size={16} className="me-1" /> Inicio
                          Contrato
                        </label>
                        <input
                          className={`form-control ${
                            errors.fecha_contrato ? "is-invalid" : ""
                          }`}
                          type="date"
                          {...register("fecha_contrato", {
                            required: "Requerido",
                          })}
                        />
                        {errors.fecha_contrato && (
                          <div className="invalid-feedback">
                            {errors.fecha_contrato.message}
                          </div>
                        )}
                      </div>
                      <div className="col-6 mb-3">
                        <label className="form-label small fw-semi-bold text-muted">
                          <Calendar size={16} className="me-1" /> Fin Contrato
                        </label>
                        <input
                          className={`form-control ${
                            errors.fecha_fin_contrato ? "is-invalid" : ""
                          }`}
                          type="date"
                          {...register("fecha_fin_contrato", {
                            required: "Requerido",
                          })}
                        />
                        {errors.fecha_fin_contrato && (
                          <div className="invalid-feedback">
                            {errors.fecha_fin_contrato.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semi-bold text-muted">
                        <Briefcase size={16} className="me-1" /> Área
                      </label>
                      <select
                        className={`form-select ${
                          errors.area ? "is-invalid" : ""
                        }`}
                        {...register("area", { required: "Requerido" })}
                      >
                        <option value="">Seleccione...</option>
                        {areasList?.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.nombre}
                          </option>
                        ))}
                      </select>
                      {errors.area && (
                        <div className="invalid-feedback">
                          {errors.area.message}
                        </div>
                      )}
                    </div>

                    <div className="row">
                      <div className="col-6 mb-3">
                        <label className="form-label small fw-semi-bold text-muted">
                          <Briefcase size={16} className="me-1" /> Cargo
                        </label>
                        <select
                          className={`form-select ${
                            errors.cargo ? "is-invalid" : ""
                          }`}
                          {...register("cargo", { required: "Requerido" })}
                          onChange={handleCargoChange}
                        >
                          <option value="">Seleccione...</option>
                          {cargosList?.map((c) => (
                            <option
                              key={c.id}
                              value={c.id}
                              data-salario={c.salario}
                            >
                              {c.nombre}
                            </option>
                          ))}
                        </select>
                        {errors.cargo && (
                          <div className="invalid-feedback">
                            {errors.cargo.message}
                          </div>
                        )}
                      </div>
                      <div className="col-6 mb-3">
                        <label className="form-label small fw-semi-bold text-muted">
                          <Clock size={16} className="me-1" /> Horario
                        </label>
                        <select
                          className={`form-select ${
                            errors.horario ? "is-invalid" : ""
                          }`}
                          {...register("horario", { required: "Requerido" })}
                        >
                          <option value="">Seleccione...</option>
                          {horariosList?.map((h) => (
                            <option key={h.id} value={h.id}>
                              {h.horaEntrada} - {h.horaSalida}
                            </option>
                          ))}
                        </select>
                        {errors.horario && (
                          <div className="invalid-feedback">
                            {errors.horario.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-6">
                        <label className="form-label small fw-semi-bold text-muted">
                          <DollarSign size={16} className="me-1" /> Salario base
                        </label>
                        <input
                          className="form-control"
                          placeholder="Salario base"
                          {...register("salario")}
                          readOnly
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semi-bold text-muted">
                          <DollarSign size={16} className="me-1" /> Pago por
                          Hora
                        </label>
                        <input
                          className="form-control"
                          placeholder="Pago por Hora"
                          {...register("pagoPorHora")}
                          readOnly
                        />
                      </div>
                    </div>

                    <div>
                      <button
                        type="button"
                        className="btn btn-outline-dark mt-3 ms-auto"
                      >
                        <FileDown size={18} className="me-2" /> Generar Contrato
                      </button>
                    </div>
                  </div>

                  {/* === DEDUCCIONES Y BONIFICACIONES (Sin cambios de diseño) === */}
                  <div className="card p-3 border">
                    <h5 style={{ color: "#15669c" }}>
                      Aportes, Deducciones y Bonificaciones
                    </h5>
                    <div className="row">
                      <CondicionCarga
                        isLoading={loadingDeducciones}
                        isError={errorDeducciones}
                      >
                        <div className="col-md-6">
                          <label className="fw-bold mb-2">Deducciones</label>
                          {deduccionesList?.map((d) => {
                            const isEssalud = d.nombre === "ESSALUD";
                            return (
                              <div className="form-check" key={d.id}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value={d.id}
                                  {...register("deducciones")}
                                  id={`deduccion_${d.id}`}
                                  onChange={(e) => {
                                    const checkboxes =
                                      document.querySelectorAll(
                                        'input.form-check-input[type="checkbox"][data-group="deducciones"]'
                                      );
                                    if (!isEssalud) {
                                      checkboxes.forEach((cb) => {
                                        if (
                                          cb !== e.target &&
                                          cb.dataset.nombre !== "ESSALUD"
                                        ) {
                                          cb.checked = false;
                                        }
                                      });
                                    }
                                  }}
                                  data-group="deducciones"
                                  data-nombre={d.nombre}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`deduccion_${d.id}`}
                                >
                                  {d.nombre}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </CondicionCarga>
                      <CondicionCarga
                        isLoading={loadingDBonificaciones}
                        isError={errorBonificaciones}
                      >
                        <div className="col-md-6">
                          <label className="fw-bold mb-2">Bonificación</label>
                          {bonificacionesList?.map((d) => (
                            <div className="form-check" key={d.id}>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value={d.id}
                                {...register("bonificaciones")}
                                id={`bonificaciones${d.id}`}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`bonificaciones${d.id}`}
                              >
                                {d.nombre}
                              </label>
                            </div>
                          ))}
                        </div>
                      </CondicionCarga>
                    </div>
                  </div>
                </div>

                {/* === BOTÓN DE ENVÍO FINAL === */}
                <div className="col-md-12 d-flex mt-4">
                  <BotonMotionGeneral
                    type="submit" // ¡Importante! Debe ser type="submit"
                    text="Registrar Empleado"
                    loading={loading}
                    icon={<Save size={18} />}
                    classDefault=" text-center align-items-center gap-1 p-2 w-auto rounded-3 border shadow-sm ms-auto"
                    // Tu componente BotonAnimado se llama ahora BotonMotionGeneral
                    // 'error' no es un prop estándar de BotonMotionGeneral
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
