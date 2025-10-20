import { useRef, useState } from "react";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
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

export function IngresoPlanilla() {
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
    queryKey: ["cargos"], // clave única para el caché
    queryFn: GetCargos, // tu función que hace la petición
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

  // Consulta departamentos (siempre activa)
  const { data: departamentoList } = useQuery({
    queryKey: ["departamentos"],
    queryFn: GetDepartamento,
    staleTime: 1000 * 60 * 60,
  });

  // Consulta provincias (solo cuando hay departamento seleccionado)
  const { data: provinciaList } = useQuery({
    queryKey: ["provincias", selectedDepartamento],
    queryFn: () => GetProvincia(selectedDepartamento),
    enabled: !!selectedDepartamento,
    staleTime: 1000 * 60 * 60,
  });

  // Consulta distritos (solo cuando hay provincia seleccionada)
  const { data: distritoList } = useQuery({
    queryKey: ["distritos", selectedProvincia],
    queryFn: () => GetDistrito(selectedProvincia),
    enabled: !!selectedProvincia,
    staleTime: 1000 * 60 * 60,
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setErrors(null); // Limpiar errores previos
    try {
      // Verificar que la imagen existe
      if (!data.fotoPerfil || data.fotoPerfil.length === 0) {
        throw new Error("No se ha seleccionado ninguna imagen");
      }

      const formData = new FormData();

      // Agregar todos los campos
      Object.keys(data).forEach((key) => {
        if (key === "fotoPerfil") {
          // Manejar la imagen (FileList -> File)
          formData.append("fotoPerfil", data.fotoPerfil);
        } else if (key === "deducciones" || key === "bonificaciones") {
          // Manejar arrays
          data[key].forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          formData.append(key, data[key]);
        }
      });

      const response = await axiosInstance.post("/planilla", formData);

      if (response.data.success) {
        reset(); // Resetear el formulario
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

        // Aquí puedes gestionar los errores devueltos por Laravel, como el error de 'telefono' ya registrado
        Object.keys(errors).forEach((key) => {
          // Si el error es para el campo 'telefono', lo manejamos
          setError(key, {
            type: "manual",
            message: errors[key][0], // El mensaje de error que viene del backend
          });
        });
      } else {
        ToastAlert("error", error.message || "Error en el servidor");
      }
    }
  };

  const handleCargoChange = (event) => {
    const selected = event.target.selectedOptions[0];
    const salario = selected.dataset.salario;
    const pagoPorHora = (parseFloat(salario) / 30 / 8).toFixed(2);
    setValue("salario", salario);
    setValue("pagoPorHora", pagoPorHora);
  };

  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null); // Referencia al input oculto

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setValue("fotoPerfil", file); // ✅ lo registra en RHF
    }
  };
  return (
    <div>
      <div class="col-md-12">
        <div class="card shadow-sm border-0 p-3">
          <h4>Datos del empleado</h4>
          <div class="card-body">
            <form
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form-data"
            >
              <div className="row g-3">
                {/* === IMAGEN PERFIL === */}
                <div className="col-md-6 col-sm-12">
                  <div
                    className="card mb-3 text-center p-3 shadow-sm"
                    style={{
                      border: "1px solid #dfe8ec",
                      borderRadius: "12px",
                      maxWidth: "300px",
                      margin: "0 auto",
                    }}
                  >
                    {/* INPUT FILE oculto */}
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />

                    {/* Botón personalizado */}

                    {/* Vista previa */}
                    {preview && (
                      <img
                        src={preview}
                        alt="Vista previa"
                        className="image center mx-auto my-2"
                        style={{
                          maxWidth: "150px",
                          borderRadius: "8px",
                          border: "2px solid #ddd",
                        }}
                      />
                    )}
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.click();
                        } else {
                          console.error("fileInputRef aún no está listo");
                        }
                      }}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      Seleccionar Imagen
                    </button>

                    {/* Campo oculto registrado en RHF */}
                    <input type="hidden" {...register("fotoPerfil")} />
                    {errors.fotoPerfil && (
                      <div className="text-danger mt-2">
                        {errors.fotoPerfil.message}
                      </div>
                    )}
                  </div>

                  {/* === DATOS PERSONALES === */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <select
                          className="form-select"
                          {...register("tipo_documento", { required: true })}
                        >
                          <option value="">Seleccione una opción...</option>
                          <option value="DNI">DNI</option>
                          <option value="Carnet De Extranjeria">
                            CARNET DE EXTRANJERIA
                          </option>
                        </select>
                        <label>Tipo Documento</label>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-floating mb-3">
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
                        <label>Numero Doc.</label>
                        {errors.num_documento && (
                          <div className="text-danger mt-2">
                            {errors.num_documento.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      {...register("nombre", { required: true })}
                      placeholder=" "
                    />
                    <label>Nombre</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      {...register("apellidos", { required: true })}
                      placeholder=" "
                    />
                    <label>Apellidos</label>
                  </div>

                  <div className="row">
                    <div className="col-6">
                      <div className="form-floating mb-3">
                        <input
                          className="form-control"
                          type="date"
                          {...register("fecha_nacimiento", { required: true })}
                        />
                        <label>Fecha de Nacimiento</label>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-floating mb-3">
                        <input
                          className="form-control"
                          type="number"
                          {...register("telefono", { required: true })}
                        />
                        <label>Numero de contacto</label>
                        {errors.telefono && (
                          <div className="text-danger mt-2">
                            {errors.telefono.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* === UBICACIÓN === */}
                  <div className="row">
                    {/* Departamento */}
                    <div className="col-4">
                      <div className="form-floating mb-3">
                        <select
                          className="form-select"
                          {...register("departamento", {
                            required: true,
                            onChange: (e) => {
                              setSelectedDepartamento(e.target.value);
                              setSelectedProvincia(""); // Reset provincia al cambiar departamento
                              setValue("provincia", ""); // Reset form value
                              setValue("distrito", ""); // Reset form value
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
                        <label>Departamento</label>
                      </div>
                    </div>

                    {/* Provincia */}
                    <div className="col-4">
                      <div className="form-floating mb-3">
                        <select
                          className="form-select"
                          {...register("provincia", {
                            required: true,
                            onChange: (e) => {
                              setSelectedProvincia(e.target.value);
                              setValue("distrito", ""); // Reset form value
                            },
                            disabled: !selectedDepartamento,
                          })}
                        >
                          <option value="">Seleccione...</option>
                          {provinciaList?.map((prov) => (
                            <option key={prov.id} value={prov.id}>
                              {prov.nombre}
                            </option>
                          ))}
                        </select>
                        <label>Provincia</label>
                      </div>
                    </div>

                    {/* Distrito */}
                    <div className="col-4">
                      <div className="form-floating mb-3">
                        <select
                          className="form-select"
                          {...register("distrito", {
                            required: true,
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
                        <label>Distrito</label>
                      </div>
                    </div>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      {...register("direccion", { required: true })}
                      placeholder=" "
                    />
                    <label>Direccion</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className="form-control"
                      {...register("correo", { required: true })}
                      placeholder=" "
                    />
                    <label>Correo</label>
                    {errors.correo && (
                      <div className="text-danger mt-2">
                        {errors.correo.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* === CONTRATO Y TRABAJO === */}
                <div className="col-md-6 col-sm-12">
                  <div className="card p-3 mb-3 border">
                    <h5 className="mb-3" style={{ color: "#15669c" }}>
                      Detalles del contrato
                    </h5>

                    <div className="form-floating mb-3">
                      <select
                        className="form-select"
                        {...register("contrato", { required: true })}
                      >
                        <option value="">Seleccione...</option>
                        {contratoList?.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nombre}
                          </option>
                        ))}
                      </select>
                      <label>Tipo Contrato</label>
                    </div>

                    <div className="row">
                      <div className="col-6">
                        <div className="form-floating mb-3">
                          <input
                            className="form-control"
                            type="date"
                            {...register("fecha_contrato", { required: true })}
                          />
                          <label>Inicio Contrato</label>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-floating mb-3">
                          <input
                            className="form-control"
                            type="date"
                            {...register("fecha_fin_contrato", {
                              required: true,
                            })}
                          />
                          <label>Fin Contrato</label>
                        </div>
                      </div>
                    </div>

                    <div className="form-floating mb-3">
                      <select
                        className="form-select"
                        {...register("area", { required: true })}
                      >
                        <option value="">Seleccione...</option>
                        {areasList?.data.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.nombre}
                          </option>
                        ))}
                      </select>
                      <label>Area</label>
                    </div>

                    <div className="row">
                      <div className="col-6">
                        <div className="form-floating mb-3">
                          <select
                            className="form-select"
                            {...register("cargo", { required: true })}
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
                          <label>Cargo</label>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-floating mb-3">
                          <select
                            className="form-select"
                            {...register("horario", { required: true })}
                          >
                            <option value="">Seleccione...</option>
                            {horariosList?.map((h) => (
                              <option key={h.id} value={h.id}>
                                {h.horaEntrada} - {h.horaSalida}
                              </option>
                            ))}
                          </select>
                          <label>Horario</label>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-6">
                        <div className="form-floating mb-3">
                          <input
                            className="form-control"
                            {...register("salario")}
                            readOnly
                          />
                          <label>Salario base</label>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-floating mb-3">
                          <input
                            className="form-control"
                            {...register("pagoPorHora")}
                            readOnly
                          />
                          <label>Pago por Hora</label>
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary mt-3">
                      <i className="fa-solid fa-file-export"></i> Generar
                      Contrato
                    </button>
                  </div>

                  {/* === DEDUCCIONES Y BONIFICACIONES === */}
                  <div className="card p-3 border">
                    <h5 style={{ color: "#15669c" }}>
                      Aportes, Deducciones y Bonificaciones
                    </h5>
                    <div className="row">
                      <div className="col-md-6">
                        <label>Deducciones</label>
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
                      {/* Aquí puedes hacer otra columna para bonificaciones si las tienes */}
                      <div className="col-md-6">
                        <label>Bonificacion</label>
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
                <div className="col-md-12 d-flex">
                  <BotonAnimado
                    type="submit"
                    loading={loading}
                    error={error}
                    className="btn-realizarPedido ms-auto px-3 py-2 h6"
                  >
                    Registrar
                  </BotonAnimado>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
