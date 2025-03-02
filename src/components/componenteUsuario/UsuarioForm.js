import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIdCard,
  faUser,
  faEnvelope,
  faCoins,
  faClock,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import ToastAlert from "../componenteToast/ToastAlert";
import axiosInstance from "../../api/AxiosInstance";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import {
  handleInputChange,
  handleSelectChange,
  limitTelefonoInput,
  validateTelefono,
} from "../../hooks/InputHandlers";

export function UsuarioForm({ handleCloseModal }) {
  const [tipoDocumento, setTipoDocumento] = useState("DNI");
  const [numeroDocumento, setNumeroDocumento] = useState("");

  const [formData, setFormData] = useState({
    cargo: "",
    salario: "",
  });

  const [areas, setAreas] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [fotoPreview, setFotoPreview] = useState(null); // Previsualización de la imagen cargada

  // TRAYENDO DATOS DE LA DB (CARGO, AREA, HORARIO)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [areasRes, cargosRes, horariosRes] = await Promise.all([
          axiosInstance.get("/areas"),
          axiosInstance.get("/cargos"),
          axiosInstance.get("/horarios"),
        ]);
        setAreas(areasRes.data);
        setCargos(cargosRes.data);
        setHorarios(horariosRes.data);
      } catch (error) {
        ToastAlert("error", "error" + error);
      }
    };

    fetchData();
  }, []);

  // Manejar el cambio del cargo y consultar el salario
  const handleCargoChange = async (selectedCargoId) => {
    setFormData({ ...formData, cargo: selectedCargoId });

    if (selectedCargoId) {
      try {
        const response = await axiosInstance.get(
          `/getSalarioCargo/${selectedCargoId}`
        );
        const salario = response.data.salario;

        // Actualizar el estado local y el valor en react-hook-form
        setFormData({ ...formData, cargo: selectedCargoId, salario });
        setValue("salario", salario); // Actualiza el valor del campo 'salario' en el formulario
      } catch (error) {
        console.error("Error al obtener el salario:", error);
      }
    } else {
      setFormData({ ...formData, salario: "" });
      setValue("salario", ""); // Limpiar el valor de 'salario' en el formulario
    }
  };

  // GUARDAR USUARIOS API
  const onSubmit = async (data) => {
    const formDataToSend = new FormData();

    // Agregar todos los campos automáticamente
    Object.keys(data).forEach((key) => {
      formDataToSend.append(key, data[key]);
    });

    // Añadir la foto si existe
    if (fotoPreview) {
      formDataToSend.append("fotoPerfil", formData.fotoPerfil);
    }

    // Depuración en consola
    console.log("Datos enviados:");
    formDataToSend.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    try {
      // Llamada a la API con axios
      const response = await axiosInstance.post(
        "/storeUsuario",
        formDataToSend
      );

      // Verificar respuesta del servidor
      if (response.data.success) {
        ToastAlert("success", "Usuario registrado correctamente");
        setTimeout(() => handleCloseModal(), 500);
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);

      // Manejo de errores del servidor
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors;
        let errorMessages = "";
        for (let field in errors) {
          errorMessages += `${errors[field].join(", ")}\n`;
        }
        ToastAlert("error", errorMessages.trim());
      } else {
        ToastAlert("error", "Error al registrar el usuario");
      }
    }
  };

  // PARA MSOTRAR LA PREVISUALIZACION DE LA IMAGEN
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        ToastAlert("error", "Solo se permiten archivos de imagen.");
        return;
      }

      const file = acceptedFiles[0];
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        setFotoPreview(objectUrl);
        setFormData({ ...formData, fotoPerfil: file }); // Guardar el archivo
      }
    },
  });

  // Usando HOOKS FORM PARA VALIDAR
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Foto de perfil */}

      <div className="mb-3">
        <label htmlFor="fotoPerfil" className="form-label">
          Foto de Perfil
        </label>
        <div
          {...getRootProps()}
          className={`dropzone border rounded p-4 text-center justify-center ${
            errors.fotoPerfil ? "is-invalid" : ""
          }`} // Aplicando is-invalid si hay errores
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
            id="fotoPerfil"
            name="fotoPerfil"
            className="d-none"
          />
          <button type="button" className="btn btn-outline-primary mt-2">
            Seleccionar archivo
          </button>
          {!fotoPreview && (
            <p className="text-muted mt-3">
              Haz clic o arrastra para cargar la foto de perfil
            </p>
          )}
          {errors.fotoPerfil && (
            <div className="invalid-feedback">{errors.fotoPerfil.message}</div> // Mensaje de error
          )}
        </div>
      </div>

      {/* Tipo de documento */}
      <div className="mb-3">
        <div className="form-floating">
          <select
            id="tipo_documento"
            className="form-select"
            {...register("tipo_documento", {
              required: "Seleeciona un tipo de documento",
            })}
            onChange={handleSelectChange(
              setTipoDocumento,
              setValue,
              "tipo_documento",
              [{ name: "numero_documento", setter: setNumeroDocumento }]
            )}
          >
            <option value="DNI">DNI</option>
            <option value="extranjeria">Carnet de Extranjería</option>
          </select>
          <label htmlFor="tipo_documento">Tipo de Documento</label>
          {errors.tipo_documento && (
            <div className="invalid-feedback">
              {errors.tipo_documento.message}
            </div>
          )}
        </div>
      </div>

      {/* Número de documento */}
      <div className="mb-3">
        <div className="form-floating">
          <input
            type="text"
            className={`form-control ${
              errors.numeroDocumento ? "is-invalid" : ""
            }`}
            id="numero_documento"
            value={numeroDocumento}
            {...register("numero_documento", {
              required: "Este campo es obligatorio",
              minLength: {
                value: tipoDocumento === "DNI" ? 8 : 10,
                message: `Debe tener ${
                  tipoDocumento === "DNI" ? "8" : "10"
                } caracteres`,
              },
              maxLength: {
                value: tipoDocumento === "DNI" ? 8 : 10,
                message: `Debe tener ${
                  tipoDocumento === "DNI" ? "8" : "10"
                } caracteres`,
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
          <label htmlFor="numero_documento">
            <FontAwesomeIcon icon={faIdCard} className="me-2" />
            Número de Documento
          </label>
          {errors.numeroDocumento && (
            <div className="invalided-feedback">
              {errors.numeroDocumento.message}
            </div>
          )}
        </div>
      </div>

      {/* Nombres y Apellidos */}
      <div className="mb-3 row">
        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="text"
              className={`form-control ${errors.nombres ? "is-invalid" : ""}`}
              {...register("nombres", {
                required: "Ingrese el nombre",
              })}
            />
            <label htmlFor="nombres">
              <FontAwesomeIcon icon={faUser} className="me-2" />
              Nombres
            </label>
            {errors.nombres && (
              <div className="invalid-feedback">{errors.nombres.message}</div>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="text"
              className={`form-control ${errors.apellidos ? "is-invalid" : ""}`}
              id="apellidos"
              {...register("apellidos", {
                required: "Ingrese sus apellidos",
              })}
            />
            <label htmlFor="apellidos">
              <FontAwesomeIcon icon={faUser} className="me-2" />
              Apellidos
            </label>
            {errors.apellidos && (
              <div className="invalid-feedback">{errors.apellidos.message}</div>
            )}
          </div>
        </div>
      </div>

      {/* Correo electrónico */}
      <div className="mb-3">
        <div className="form-floating">
          <input
            type="email"
            className={`form-control ${errors.correo ? "is-invalid" : ""}`}
            id="correo_electronico"
            {...register("correo", {
              required: "El correo es obligatorio",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Formato de correo inválido",
              },
            })}
          />
          <label htmlFor="correo_electronico">
            <FontAwesomeIcon icon={faEnvelope} className="me-2" />
            Correo Electrónico
          </label>
          {errors.correo && (
            <div className="invalid-feedback">{errors.correo.message}</div>
          )}
        </div>
      </div>

      {/* Área */}
      <div className="mb-3">
        <div className="form-floating">
          <select
            id="area"
            className={`form-control ${errors.area ? "is-invalid" : ""}`}
            {...register("area", {
              required: "Area requerido",
            })}
          >
            <option value="">Seleccione Área</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.nombre}
              </option>
            ))}
          </select>
          <label htmlFor="area">
            <FontAwesomeIcon icon={faBuilding} className="me-2" />
            Área
          </label>
          {errors.area && (
            <div className="invalid-feedback">{errors.area.message}</div>
          )}
        </div>
      </div>

      {/* Cargo */}
      <div className="mb-3">
        <div className="form-floating">
          <select
            id="cargo"
            className={`form-control ${errors.cargo ? "is-invalid" : ""}`}
            {...register("cargo", {
              required: "Seleccione un cargo",
            })}
            onChange={(e) => {
              const selectedCargoId = e.target.value;
              setValue("cargo", selectedCargoId); // Actualizar el estado del formulario con el cargo seleccionado
              if (selectedCargoId) {
                handleCargoChange(selectedCargoId); // Pasar el valor seleccionado directamente
              } else {
                setValue("salario", ""); // Limpiar el salario si no hay selección
              }
            }}
          >
            <option value="">Seleccione Cargo</option>
            {cargos.map((cargo) => (
              <option key={cargo.id} value={cargo.id}>
                {cargo.nombre}
              </option>
            ))}
          </select>
          <label htmlFor="cargo">
            <FontAwesomeIcon icon={faCoins} className="me-2" />
            Cargo
          </label>
          {errors.cargo && (
            <div className="invalid-feedback">{errors.cargo.message}</div>
          )}
        </div>
      </div>

      {/* Salario */}
      <div className="mb-3">
        <div className="form-floating">
          <input
            type="number"
            className={`form-control ${errors.salario ? "is-invalid" : ""}`} // Aplica is-invalid si hay errores
            id="salario"
            {...register("salario", {
              required: "El salario es obligatorio",
              min: { value: 1, message: "El salario debe ser mayor a 0" },
              max: {
                value: 100000,
                message: "El salario no puede superar los 100,000",
              },
            })}
            readOnly // Cambia a readOnly si necesitas que el valor sea enviado
          />
          <label htmlFor="salario">
            <FontAwesomeIcon icon={faCoins} className="me-2" />
            Salario
          </label>
          {errors.salario && (
            <div className="invalid-feedback">{errors.salario.message}</div> // Mensaje de error
          )}
        </div>
      </div>

      {/* Horario */}
      <div className="mb-3">
        <div className="form-floating">
          <select
            id="horario"
            className={`form-select ${errors.horario ? "is-invalid" : ""}`} // Aplica is-invalid si hay errores
            {...register("horario", {
              required: "El horario es obligatorio",
            })}
          >
            <option value="">Seleccione Horario</option>
            {horarios.map((horario) => (
              <option key={horario.id} value={horario.id}>
                {horario.horaEntrada} - {horario.horaSalida}
              </option>
            ))}
          </select>
          <label htmlFor="horario">
            <FontAwesomeIcon icon={faClock} className="me-2" />
            Horario
          </label>
          {errors.horario && (
            <div className="invalid-feedback">{errors.horario.message}</div> // Mensaje de error
          )}
        </div>
      </div>

      {/* Botón de Guardar */}
      <div className="d-flex justify-content-center mt-4">
        <button type="submit" className="btn btn-primary">
          Registrar Usuario
        </button>
      </div>
    </form>
  );
}
