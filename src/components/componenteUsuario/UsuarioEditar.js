import { useState, useEffect } from "react";

import { faSave } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ToastAlert from "../componenteToast/ToastAlert";
import axiosInstance from "../../api/AxiosInstance";
import { useQueryClient } from "@tanstack/react-query";

export function UsuarioEditar({ handleCloseModal, data, onUsuarioUpdated }) {
  const [formData, setFormData] = useState({
    tipo_documento: "",
    numero_documento: "",
    nombres: "",
    apellidos: "",
    correo_electronico: "",
    area: "",
    cargo: "",
    salario: "",
    horario: "",
  });
  const queryClient = useQueryClient();

  const [cargos, setCargos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Este useEffect llena el formulario cuando llega el prop data

  // Función para cargar los cargos, áreas y horarios
  const cargasCargosAreasHorarios = async () => {
    try {
      // Cargar los cargos
      const cargosResponse = await axiosInstance.get("/cargos");
      setCargos(cargosResponse.data);

      // Cargar las áreas

      const areasResponse = await axiosInstance.get("/areas");

      setAreas(areasResponse.data.data || []); // Extraer solo el array de "data"

      // Cargar los horarios
      const horariosResponse = await axiosInstance.get("/horarios");
      setHorarios(horariosResponse.data);
    } catch (err) {
      setError("Hubo un error al cargar los datos auxiliares.");
    }
  };

  useEffect(() => {
    if (data) {
      setFormData({
        tipo_documento: data.empleado?.persona.tipo_documento || "",
        numero_documento: data.empleado?.persona.documento_identidad || "",
        nombres: data.empleado?.persona.nombre || "",
        apellidos: data.empleado?.persona.apellidos || "",
        correo_electronico: data.empleado?.persona.correo || "",
        area: data.empleado?.area?.id || "",
        cargo: data.empleado?.cargo?.id || "",
        salario: data.empleado?.salario || "",
        horario: data.empleado?.horario?.id || "",
      });
      cargasCargosAreasHorarios();
    }
  }, [data]);

  const validacionesInput = (e) => {
    const { value } = e.target;
    if (formData.tipo_documento === "DNI" && value.length > 8) return;
    if (formData.tipo_documento === "extranjeria" && value.length > 10) return;
    setFormData({ ...formData, numero_documento: value });
  };

  const handleCargoChange = async (e) => {
    const selectedCargoId = e.target.value;
    if (selectedCargoId) {
      try {
        const response = await axiosInstance.get(
          `/getSalarioCargo/${selectedCargoId}`
        );
        setFormData({
          ...formData,
          cargo: selectedCargoId,
          salario: response.data.salario || "",
        });
      } catch (error) {
        console.error("Error al obtener el salario:", error);
      }
    } else {
      setFormData({ ...formData, cargo: "", salario: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axiosInstance.put(
        `/updateUsuario/${data.id}`,
        formData
      );
      if (response.data.success) {
        ToastAlert("success", "Usuario actualizado con éxito");
        queryClient.invalidateQueries({ queryKey: ["usuarios"] });
        // Retrasar el cierre del modal y la actualización para dar tiempo al toast
        handleCloseModal();
        setTimeout(() => {
          onUsuarioUpdated();
        }, 3000); // Coincide con el tiempo de duración del toast
      } else {
        ToastAlert(
          "error",
          "Error al actualizar el usuario. Por favor, intente nuevamente."
        );
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          const errors = error.response.data.errors;
          let errorMessage = "Hubo un error al guardar los cambios: ";
          for (const field in errors) {
            errorMessage += `${field}: ${errors[field].join(", ")}. `;
          }
          ToastAlert("error", errorMessage);
        } else {
          ToastAlert(
            "error",
            "Hubo un error al guardar los cambios. Por favor, intente nuevamente."
          );
        }
      } else if (error.request) {
        ToastAlert(
          "error",
          "No se pudo conectar con el servidor. Por favor, intente nuevamente más tarde."
        );
      } else {
        ToastAlert(
          "error",
          "Hubo un problema con la solicitud. Por favor, intente nuevamente."
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {loading ? (
        <p>Cargando datos...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          {/* Tipo de documento */}
          <div className="mb-3">
            <div className="form-floating">
              <select
                id="tipo_documento"
                className="form-select"
                value={formData.tipo_documento}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tipo_documento: e.target.value,
                    numero_documento: "",
                  })
                }
              >
                <option value="DNI">DNI</option>
                <option value="extranjeria">Carnet de Extranjería</option>
              </select>
              <label htmlFor="tipo_documento">Tipo de Documento</label>
            </div>
          </div>

          {/* Documento */}
          <div className="mb-3">
            <div className="form-floating">
              <input
                type="text"
                id="numero_documento"
                className="form-control"
                value={formData.numero_documento}
                onChange={validacionesInput}
                placeholder="Número de documento"
              />
              <label htmlFor="numero_documento">Número de Documento</label>
            </div>
          </div>

          {/* Nombre */}
          <div className="mb-3">
            <div className="form-floating">
              <input
                type="text"
                id="nombres"
                className="form-control"
                value={formData.nombres}
                onChange={(e) =>
                  setFormData({ ...formData, nombres: e.target.value })
                }
                placeholder="Nombres"
              />
              <label htmlFor="nombres">Nombres</label>
            </div>
          </div>

          {/* Apellidos */}
          <div className="mb-3">
            <div className="form-floating">
              <input
                type="text"
                id="apellidos"
                className="form-control"
                value={formData.apellidos}
                onChange={(e) =>
                  setFormData({ ...formData, apellidos: e.target.value })
                }
                placeholder="Apellidos"
              />
              <label htmlFor="apellidos">Apellidos</label>
            </div>
          </div>

          {/* Correo Electrónico */}
          <div className="mb-3">
            <div className="form-floating">
              <input
                type="email"
                id="correo_electronico"
                className="form-control"
                value={formData.correo_electronico}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    correo_electronico: e.target.value,
                  })
                }
                placeholder="Correo Electrónico"
              />
              <label htmlFor="correo_electronico">Correo Electrónico</label>
            </div>
          </div>

          {/* Área */}
          <div className="mb-3">
            <div className="form-floating">
              <select
                id="area"
                className="form-select"
                value={formData.area}
                onChange={(e) =>
                  setFormData({ ...formData, area: e.target.value })
                }
              >
                <option value="">Seleccione un área</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.nombre}
                  </option>
                ))}
              </select>
              <label htmlFor="area">Área</label>
            </div>
          </div>

          {/* Cargo */}
          <div className="mb-3">
            <div className="form-floating">
              <select
                id="cargo"
                className="form-select"
                value={formData.cargo}
                onChange={handleCargoChange}
              >
                <option value="">Seleccione un cargo</option>
                {cargos.map((cargo) => (
                  <option key={cargo.id} value={cargo.id}>
                    {cargo.nombre}
                  </option>
                ))}
              </select>
              <label htmlFor="cargo">Cargo</label>
            </div>
          </div>

          {/* Salario */}
          <div className="mb-3">
            <div className="form-floating">
              <input
                type="text"
                id="salario"
                className="form-control"
                value={formData.salario}
                readOnly
                placeholder="Salario"
              />
              <label htmlFor="salario">Salario</label>
            </div>
          </div>

          {/* Horario */}
          <div className="mb-3">
            <div className="form-floating">
              <select
                id="horario"
                className="form-select"
                value={formData.horario}
                onChange={(e) =>
                  setFormData({ ...formData, horario: e.target.value })
                }
              >
                <option value="">Seleccione un horario</option>
                {horarios.map((horario) => (
                  <option key={horario.id} value={horario.id}>
                    {horario.horaEntrada} - {horario.horaSalida}
                  </option>
                ))}
              </select>
              <label htmlFor="horario">Horario</label>
            </div>
          </div>

          {/* Botón para enviar el formulario */}
          <div className="mb-3 d-flex">
            <button
              type="submit"
              className="btn-guardar m-auto"
              disabled={loading}
            >
              <FontAwesomeIcon icon={faSave} className="me-2" />
              {loading ? "Actualizando..." : "Actualizar Usuario"}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
