import { useState, useEffect } from "react";
// Importamos los iconos de Lucide
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  FileText,
  CreditCard,
  LayoutGrid,
  Save,
  X,
  Building2, // Para Sede
} from "lucide-react";

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
    sede: "",
    area: "",
    cargo: "",
    salario: "",
    horario: "",
  });

  const queryClient = useQueryClient();

  // Estados para selectores
  const [cargos, setCargos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [horarios, setHorarios] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Carga de datos auxiliares
  const cargasCargosAreasHorarios = async () => {
    try {
      const [cargosRes, areasRes, horariosRes, sedesRes] = await Promise.all([
        axiosInstance.get("/cargos"),
        axiosInstance.get("/areas"),
        axiosInstance.get("/horarios"),
        axiosInstance.get("/sedesAll"),
      ]);

      setCargos(cargosRes.data);
      setAreas(areasRes.data.data || []);
      setHorarios(horariosRes.data);
      setSedes(sedesRes.data.data || []);
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
        sede: data.sede?.id || "",
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
    setLoading(true);

    try {
      const response = await axiosInstance.put(
        `/updateUsuario/${data.id}`,
        formData
      );
      if (response.data.success) {
        ToastAlert("success", "Usuario actualizado con éxito");
        queryClient.invalidateQueries({ queryKey: ["usuarios"] });
        handleCloseModal();
        setTimeout(() => {
          onUsuarioUpdated();
        }, 3000);
      } else {
        ToastAlert("error", "Error al actualizar. Intente nuevamente.");
      }
    } catch (error) {
      // Manejo básico de errores
      const msg = error.response?.data?.message || "Error al guardar cambios";
      ToastAlert("error", msg);
    } finally {
      setLoading(false);
    }
  };

  // Estilos comunes para etiquetas y contenedores
  const labelStyle = "form-label fw-bold small text-secondary mb-1";
  const sectionTitleStyle =
    "text-danger fw-bold small text-uppercase mb-3 mt-2 border-bottom pb-1";

  return (
    <form onSubmit={handleSubmit} className="p-3">
      {loading && !formData.nombres ? (
        <div className="text-center p-4">Cargando...</div>
      ) : (
        <>
          {/* SECCIÓN 1: INFORMACIÓN PERSONAL */}
          <h6 className={sectionTitleStyle}>Información Personal</h6>

          <div className="row g-3 mb-3">
            {/* Tipo Doc */}
            <div className="col-md-5">
              <label className={labelStyle}>Tipo Doc.</label>
              <div className="input-group">
                <span className="input-group-text bg-white text-muted">
                  <FileText size={16} />
                </span>
                <select
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
                  <option value="extranjeria">C. Extranjería</option>
                </select>
              </div>
            </div>

            {/* Num Documento */}
            <div className="col-md-7">
              <label className={labelStyle}>Número Documento</label>
              <div className="input-group">
                <span className="input-group-text bg-white text-muted">
                  <CreditCard size={16} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={formData.numero_documento}
                  onChange={validacionesInput}
                  placeholder="Ingrese número"
                />
              </div>
            </div>

            {/* Nombres */}
            <div className="col-md-6">
              <label className={labelStyle}>Nombres</label>
              <div className="input-group">
                <span className="input-group-text bg-white text-muted">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={formData.nombres}
                  onChange={(e) =>
                    setFormData({ ...formData, nombres: e.target.value })
                  }
                  placeholder="Ej. Juan Carlos"
                />
              </div>
            </div>

            {/* Apellidos */}
            <div className="col-md-6">
              <label className={labelStyle}>Apellidos</label>
              <div className="input-group">
                <span className="input-group-text bg-white text-muted">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={formData.apellidos}
                  onChange={(e) =>
                    setFormData({ ...formData, apellidos: e.target.value })
                  }
                  placeholder="Ej. Pérez López"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: CUENTA Y ACCESO */}
          <h6 className={sectionTitleStyle}>Cuenta y Acceso</h6>

          <div className="row g-3 mb-3">
            <div className="col-12">
              <label className={labelStyle}>Correo Electrónico</label>
              <div className="input-group">
                <span className="input-group-text bg-white text-muted">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  className="form-control"
                  value={formData.correo_electronico}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      correo_electronico: e.target.value,
                    })
                  }
                  placeholder="usuario@empresa.com"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: DATOS LABORALES */}
          <h6 className={sectionTitleStyle}>Datos Laborales</h6>

          <div className="row g-3">
            {/* Sede */}
            <div className="col-md-6">
              <label className={labelStyle}>Sede</label>
              <div className="input-group">
                <span className="input-group-text bg-white text-muted">
                  <Building2 size={16} />
                </span>
                <select
                  className="form-select"
                  value={formData.sede}
                  onChange={(e) =>
                    setFormData({ ...formData, sede: parseInt(e.target.value) })
                  }
                >
                  <option value="">Seleccione...</option>
                  {sedes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Área */}
            <div className="col-md-6">
              <label className={labelStyle}>Área</label>
              <div className="input-group">
                <span className="input-group-text bg-white text-muted">
                  <LayoutGrid size={16} />
                </span>
                <select
                  className="form-select"
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                >
                  <option value="">Seleccione...</option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cargo */}
            <div className="col-md-6">
              <label className={labelStyle}>Cargo</label>
              <div className="input-group">
                <span className="input-group-text bg-white text-muted">
                  <Briefcase size={16} />
                </span>
                <select
                  className="form-select"
                  value={formData.cargo}
                  onChange={handleCargoChange}
                >
                  <option value="">Seleccione...</option>
                  {cargos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Horario */}
            <div className="col-md-6">
              <label className={labelStyle}>Horario</label>
              <div className="input-group">
                <span className="input-group-text bg-white text-muted">
                  <Clock size={16} />
                </span>
                <select
                  className="form-select"
                  value={formData.horario}
                  onChange={(e) =>
                    setFormData({ ...formData, horario: e.target.value })
                  }
                >
                  <option value="">Seleccione...</option>
                  {horarios.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.horaEntrada} - {h.horaSalida}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Salario */}
            <div className="col-md-6">
              <label className={labelStyle}>Salario</label>
              <div className="input-group">
                <span className="input-group-text bg-white text-muted">
                  <DollarSign size={16} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={formData.salario}
                  readOnly
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <button
              type="button"
              className="btn-cerrar-modal d-flex align-items-center gap-2"
              onClick={handleCloseModal}
            >
              <X size={18} /> Cancelar
            </button>

            <button
              type="submit"
              className="btn-guardar d-flex align-items-center gap-2"
              disabled={loading}
            >
              <Save size={18} />
              {loading ? "Guardando..." : "Actualizar Usuario"}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
