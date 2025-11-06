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
  DownloadIcon,
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
import BotonAnimado from "../../components/componentesReutilizables/BotonAnimado";
import { BotonMotionGeneral } from "../../components/componentesReutilizables/BotonMotionGeneral";
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

  const { data: areasList } = useQuery({
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

  const { data: deduccionesList } = useQuery({
    queryKey: ["deducciones"],
    queryFn: GetDeducciones,
  });

  const { data: bonificacionesList } = useQuery({
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
          <h4>Datos del empleado</h4>
          <div className="card-body">
            <form
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form-data"
            >
              <div className="row g-3">
                {/* === COLUMNA IZQUIERDA: DATOS PERSONALES === */}
                <div className="col-md-6 col-sm-12">
                  {/* === BLOQUE DE IMAGEN (Rediseñado) === */}
                  <div className="d-flex flex-column align-items-center text-center mb-3">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                      // No usamos 'register' aquí, usamos setValue
                    />

                    {/* Vista Previa Circular */}
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
                      // Placeholder si no hay imagen
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

                    {/* Campo oculto para RHF (solo para el 'name') */}
                    <input type="hidden" {...register("fotoPerfil")} />

                    {errors.fotoPerfil && (
                      <div className="text-danger mt-2 small">
                        {errors.fotoPerfil.message}
                      </div>
                    )}
                  </div>

                  {/* === DATOS PERSONALES (Minimalista) === */}
                  <div className="row">
                    <div className="col-md-5">
                      <div className="input-group mb-3">
                        <span className="input-group-text">
                          <FileText size={18} />
                        </span>
                        <select
                          className="form-select"
                          {...register("tipo_documento", { required: true })}
                        >
                          <option value="">Tipo Documento...</option>
                          <option value="DNI">DNI</option>
                          <option value="Carnet De Extranjeria">
                            CARNET DE EXTRANJERIA
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-7">
                      <div className="input-group mb-3">
                        <input
                          className="form-control"
                          type="text"
                          maxLength="8"
                          placeholder="Número de Documento"
                          {...register("num_documento", {
                            required: true,
                            pattern: /^[0-9]+$/,
                          })}
                        />
                      </div>
                      {errors.num_documento && (
                        <div className="text-danger small mt-0 mb-2">
                          {errors.num_documento.message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text">
                      <User size={18} />
                    </span>
                    <input
                      className="form-control"
                      {...register("nombre", { required: true })}
                      placeholder="Nombre"
                    />
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text">
                      <User size={18} />
                    </span>
                    <input
                      className="form-control"
                      {...register("apellidos", { required: true })}
                      placeholder="Apellidos"
                    />
                  </div>

                  <div className="row">
                    <div className="col-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text">
                          <Calendar size={18} />
                        </span>
                        <input
                          className="form-control"
                          type="date"
                          {...register("fecha_nacimiento", { required: true })}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text">
                          <Phone size={18} />
                        </span>
                        <input
                          className="form-control"
                          type="number"
                          placeholder="Nº de contacto"
                          {...register("telefono", { required: true })}
                        />
                      </div>
                      {errors.telefono && (
                        <div className="text-danger small mt-0 mb-2">
                          {errors.telefono.message}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* === UBICACIÓN (Minimalista) === */}
                  <div className="row">
                    <div className="col-4">
                      <div className="input-group mb-3">
                        <span className="input-group-text">
                          <MapPin size={18} />
                        </span>
                        <select
                          className="form-select"
                          {...register("departamento", {
                            required: true,
                            onChange: (e) => {
                              setSelectedDepartamento(e.target.value);
                              setSelectedProvincia("");
                              setValue("provincia", "");
                              setValue("distrito", "");
                            },
                          })}
                        >
                          <option value="">Depto...</option>
                          {departamentoList?.map((dep) => (
                            <option key={dep.id} value={dep.id}>
                              {dep.nombre.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="input-group mb-3">
                        <span className="input-group-text">
                          <MapPin size={18} />
                        </span>
                        <select
                          className="form-select"
                          {...register("provincia", {
                            required: true,
                            onChange: (e) => {
                              setSelectedProvincia(e.target.value);
                              setValue("distrito", "");
                            },
                          })}
                          disabled={!selectedDepartamento}
                        >
                          <option value="">Provincia...</option>
                          {provinciaList?.map((prov) => (
                            <option key={prov.id} value={prov.id}>
                              {prov.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="input-group mb-3">
                        <span className="input-group-text">
                          <MapPin size={18} />
                        </span>
                        <select
                          className="form-select"
                          {...register("distrito", {
                            required: true,
                            disabled: !selectedProvincia,
                          })}
                        >
                          <option value="">Distrito...</option>
                          {distritoList?.map((dist) => (
                            <option key={dist.id} value={dist.id}>
                              {dist.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text">
                      <MapPin size={18} />
                    </span>
                    <input
                      className="form-control"
                      {...register("direccion", { required: true })}
                      placeholder="Dirección"
                    />
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text">
                      <Mail size={18} />
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      {...register("correo", { required: true })}
                      placeholder="Correo Electrónico"
                    />
                  </div>
                  {errors.correo && (
                    <div className="text-danger small mt-0 mb-2">
                      {errors.correo.message}
                    </div>
                  )}
                </div>

                {/* === COLUMNA DERECHA: DATOS LABORALES === */}
                <div className="col-md-6 col-sm-12">
                  <div className="card p-3 mb-3 border">
                    <h5 className="mb-3" style={{ color: "#15669c" }}>
                      Detalles del contrato
                    </h5>

                    <div className="input-group mb-3">
                      <span className="input-group-text">
                        <Briefcase size={18} />
                      </span>
                      <select
                        className="form-select"
                        {...register("contrato", { required: true })}
                      >
                        <option value="">Tipo Contrato...</option>
                        {contratoList?.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="row">
                      <div className="col-6">
                        <div className="input-group mb-3">
                          <span className="input-group-text">
                            <Calendar size={18} />
                          </span>
                          <input
                            className="form-control"
                            type="date"
                            {...register("fecha_contrato", { required: true })}
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-group mb-3">
                          <span className="input-group-text">
                            <Calendar size={18} />
                          </span>
                          <input
                            className="form-control"
                            type="date"
                            {...register("fecha_fin_contrato", {
                              required: true,
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="input-group mb-3">
                      <span className="input-group-text">
                        <Briefcase size={18} />
                      </span>
                      <select
                        className="form-select"
                        {...register("area", { required: true })}
                      >
                        <option value="">Área...</option>
                        {/* * CORRECCIÓN DE BUG:
                         * Asumimos que 'areasList' es el array
                         * (basado en tu 'data: areasList = []')
                         */}
                        {areasList?.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="row">
                      <div className="col-6">
                        <div className="input-group mb-3">
                          <span className="input-group-text">
                            <Briefcase size={18} />
                          </span>
                          <select
                            className="form-select"
                            {...register("cargo", { required: true })}
                            onChange={handleCargoChange}
                          >
                            <option value="">Cargo...</option>
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
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-group mb-3">
                          <span className="input-group-text">
                            <Clock size={18} />
                          </span>
                          <select
                            className="form-select"
                            {...register("horario", { required: true })}
                          >
                            <option value="">Horario...</option>
                            {horariosList?.map((h) => (
                              <option key={h.id} value={h.id}>
                                {h.horaEntrada} - {h.horaSalida}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-6">
                        <div className="input-group mb-3">
                          <span className="input-group-text">
                            <DollarSign size={18} />
                          </span>
                          <input
                            className="form-control"
                            placeholder="Salario base"
                            {...register("salario")}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-group mb-3">
                          <span className="input-group-text">
                            <DollarSign size={18} />
                          </span>
                          <input
                            className="form-control"
                            placeholder="Pago por Hora"
                            {...register("pagoPorHora")}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

                    {/* CORRECCIÓN DE BOTÓN: 'type="button"' para no chocar con el submit final */}
                    <div>
                      <button
                        type="button"
                        className="btn btn-outline-dark mt-3 ms-auto"
                      >
                        <FileDown /> Generar Contrato
                      </button>
                    </div>
                  </div>

                  {/* === DEDUCCIONES Y BONIFICACIONES (Lógica intacta) === */}
                  <div className="card p-3 border">
                    <h5 style={{ color: "#15669c" }}>
                      Aportes, Deducciones y Bonificaciones
                    </h5>
                    <div className="row">
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
                                  // --- Tu lógica compleja de Essalud (sin cambios) ---
                                  const checkboxes = document.querySelectorAll(
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
                    </div>
                  </div>
                </div>

                {/* === BOTÓN DE ENVÍO FINAL === */}
                <div className="col-md-12 d-flex mt-4">
                  <BotonMotionGeneral
                    type="submit"
                    text="Registrar Empleado"
                    loading={loading}
                    icon={<Save className="text-auto" />}
                    error={error} // Asegúrate que 'error' sea booleano o se resetee a false
                  >
                    Registrar Empleado
                  </BotonMotionGeneral>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
