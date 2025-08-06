import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { GetMiPerfil } from "../../service/accionesConfiguracion/GetMiPerfil";

export const MiPerfil = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [editable, setEditable] = useState(false); // <--- Estado para edición

  const {
    data: perfil = {},
    isLoading,
    isError,
    error,
  } = useQuery({
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
                }}
              >
                <img
                  src={
                    perfil.fotoPerfil
                      ? `${BASE_URL}/storage/${perfil.fotoPerfil}`
                      : "/images/avatar_default.png"
                  }
                  alt="Avatar"
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="mt-2 text-muted small">
                Permitido <b>*.jpeg, *.jpg, *.png, </b>
                <br />
                Tamaño máximo de 3 Mb
              </div>
            </div>
            <button
              className="btn w-50 mx-auto"
              style={{
                background: "#ffeaea",
                color: "#ee5252",
                fontWeight: 500,
              }}
            >
              Cambiar foto
            </button>
          </div>
        </div>
        {/* Formulario de datos */}
        <div className="col-md-8">
          <form
            className="card border-0 shadow-sm p-4 h-100"
            style={{ borderRadius: 20, background: "#fff" }}
          >
            <div className="d-flex justify-content-between align-items-center border-bottom mb-3">
              <p className="">Mi Información</p>
              {/* Botón o interruptor para editar */}
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
                    onChange={() => setEditable((e) => !e)}
                    title="Editar"
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
              {/* Datos personales */}
              <div className="col-md-6">
                <label className="form-label text-secondary small">
                  Nombre
                </label>
                <input
                  className="form-control"
                  defaultValue={persona.nombre || ""}
                  disabled={!editable}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-secondary small">
                  Apellidos
                </label>
                <input
                  className="form-control"
                  defaultValue={persona.apellidos || ""}
                  disabled={!editable}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-secondary small">
                  Fecha de nacimiento
                </label>
                <input
                  type="date"
                  className="form-control"
                  defaultValue={persona.fecha_nacimiento || ""}
                  disabled={!editable}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-secondary small">
                  Tipo de documento
                </label>
                <input
                  className="form-control"
                  defaultValue={persona.tipo_documento || ""}
                  disabled={!editable}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-secondary small">
                  Documento de identidad
                </label>
                <input
                  className="form-control"
                  defaultValue={persona.documento_identidad || ""}
                  disabled={!editable}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-secondary small">
                  Teléfono
                </label>
                <input
                  className="form-control"
                  defaultValue={persona.telefono || ""}
                  disabled={!editable}
                />
              </div>
              <div className="col-12">
                <label className="form-label text-secondary small">
                  Dirección
                </label>
                <input
                  className="form-control"
                  defaultValue={persona.direccion || ""}
                  disabled={!editable}
                />
              </div>
              {/* Ubicación */}
              <div className="col-md-4">
                <label className="form-label text-secondary small">
                  Departamento
                </label>
                <input
                  className="form-control"
                  defaultValue={departamento?.nombre || ""}
                  disabled={!editable}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label text-secondary small">
                  Provincia
                </label>
                <input
                  className="form-control"
                  defaultValue={provincia?.nombre || ""}
                  disabled={!editable}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label text-secondary small">
                  Distrito
                </label>
                <input
                  className="form-control"
                  defaultValue={distrito?.nombre || ""}
                  disabled={!editable}
                />
              </div>
              {/* Datos laborales solo visualización */}
              <div className="card border p-3 mb-3">
                <div className="h6 text-muted mb-3">
                  Información del Empleado
                </div>
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="text-secondary small mb-1">Salario</div>
                    <div className="fw-semibold">
                      {empleado.salario || (
                        <span className="text-muted">-</span>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-secondary small mb-1">Contrato</div>
                    <div className="fw-semibold">
                      {empleado.contrato?.nombre || (
                        <span className="text-muted">-</span>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-secondary small mb-1">Cargo</div>
                    <div className="fw-semibold">
                      {empleado.cargo?.nombre || (
                        <span className="text-muted">-</span>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-secondary small mb-1">Área</div>
                    <div className="fw-semibold">
                      {empleado.area?.nombre || (
                        <span className="text-muted">-</span>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-secondary small mb-1">Horario</div>
                    <div className="fw-semibold">
                      {empleado.horario?.horaEntrada &&
                      empleado.horario?.horaSalida ? (
                        `${empleado.horario.horaEntrada} - ${empleado.horario.horaSalida}`
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end mt-4">
              <button
                className="btn-guardar"
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
