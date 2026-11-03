import React, { useMemo } from "react";
import { Users, MapPin, Settings, CheckCircle } from "lucide-react";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import { BotonMotionGeneral } from "../../components/componentesReutilizables/BotonMotionGeneral";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


export function DashboardEmpresa({ onClose, dataEmpresa }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const empresa = dataEmpresa ?? {};
  const logoPath = empresa.logo || empresa.logo || empresa.log || "";
  const logoUrl = logoPath ? `${BASE_URL}/storage/${logoPath}` : null;

  const {
    usuarios = [],
    sedes = [],
    configuraciones = [],
    nombre = "—",
    ruc = "—",
    direccion = "—",
  } = empresa;

  const counts = useMemo(() => {
    const usuariosCount = Array.isArray(usuarios) ? usuarios.length : 0;
    const sedesCount = Array.isArray(sedes) ? sedes.length : 0;
    const configTotal = Array.isArray(configuraciones)
      ? configuraciones.length
      : 0;
    const configActivas = Array.isArray(configuraciones)
      ? configuraciones.filter((c) => Number(c.estado) === 1).length
      : 0;
    return { usuariosCount, sedesCount, configTotal, configActivas };
  }, [usuarios, sedes, configuraciones]);

  const usuariosPreview = Array.isArray(usuarios) ? usuarios.slice(0, 6) : [];
  const configuracionesList = Array.isArray(configuraciones)
    ? configuraciones
    : [];

  return (
    <Card className="bg-transparent border-0">
      <CardHeader className="flex items-center justify-between rounded-2xl border">
        <div className="d-flex align-items-center gap-3">
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 8,
              overflow: "hidden",
              background: "#f5f7fa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={nombre}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div style={{ fontWeight: 700, color: "#234" }}>
                {(nombre || "X").charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <h5 className="mb-0">{nombre}</h5>
            <small className="text-muted d-block">RUC: {ruc}</small>
            <small
              className="text-muted d-block text-truncate"
              style={{ maxWidth: 420 }}
            >
              {direccion}
            </small>
          </div>
        </div>

        <div>
          <BotonMotionGeneral
            text="Cerrar"
            onClick={() => onClose && onClose()}
          />
        </div>
      </CardHeader>

      <CardContent className="">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
          <div className="col-6 col-md-3">
            <div className="p-3 bg-light border rounded-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <small className="text-muted">Usuarios</small>
                  <div className="h5 mb-0">{counts.usuariosCount}</div>
                </div>
                <div className="text-muted">
                  <Users size={22} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="p-3 bg-light border rounded-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <small className="text-muted">Sedes</small>
                  <div className="h5 mb-0">{counts.sedesCount}</div>
                </div>
                <div className="text-muted">
                  <MapPin size={22} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="p-3 bg-light border rounded-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <small className="text-muted">Configuraciones</small>
                  <div className="h5 mb-0">{counts.configTotal}</div>
                </div>
                <div className="text-muted">
                  <Settings size={22} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="p-3 bg-light border rounded-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <small className="text-muted">Activas</small>
                  <div className="h5 mb-0">{counts.configActivas}</div>
                </div>
                <div className="text-muted">
                  <CheckCircle size={22} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5">
            <Card className="border">
              <CardHeader className="flex items-center justify-between">
                <strong className="small mb-0">
                  Usuarios ({counts.usuariosCount})
                </strong>
                <small className="text-muted">Últimos</small>
              </CardHeader>
              <ul className="list-group list-group-flush p-2">
                {usuariosPreview.length === 0 ? (
                  <li className="list-group-item">No hay usuarios</li>
                ) : (
                  usuariosPreview.map((u) => (
                    <li
                      key={u.id || u.email || Math.random()}
                      className="list-group-item d-flex align-items-center gap-3"
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: "#e9eef5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 600,
                        }}
                      >
                        {(u.name || u.nombre || u.email || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-semibold">
                          {capitalizeFirstLetter(u.empleado?.persona?.nombre) +
                            " " +
                            capitalizeFirstLetter(
                              u.empleado?.persona?.apellidos,
                            ) || "Sin nombre"}
                        </div>
                        <div className="small text-muted">
                          {u.email || u.correo || "—"}
                        </div>
                      </div>
                      <div>
                        <small className="text-muted">
                          {u.role || u.rol || ""}
                        </small>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </Card>
          </div>

          <div className="md:col-span-7">
            <Card className="border">
              <CardHeader className="flex items-center justify-between">
                <strong className="small mb-0">
                  Configuraciones ({counts.configTotal})
                </strong>
                <small className="text-muted">Estado</small>
              </CardHeader>

              <div className="table-responsive p-2">
                <table className="table mb-0">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {configuracionesList.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="small text-muted">
                          Sin configuraciones
                        </td>
                      </tr>
                    ) : (
                      configuracionesList.map((cfg) => (
                        <tr key={cfg.id || cfg.nombre}>
                          <td className="align-middle">{cfg.nombre}</td>
                          <td
                            className="align-middle text-truncate"
                            style={{ maxWidth: 320 }}
                          >
                            {cfg.descripcion || "—"}
                          </td>
                          <td className="align-middle">
                            {Number(cfg.estado) === 1 ? (
                              <span className="badge bg-success">Activo</span>
                            ) : (
                              <span className="badge bg-secondary">
                                Inactivo
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>

        {/* NUEVA SECCIÓN: SEDES */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-3">
          <div className="col-12">
            <Card className="border">
              <CardHeader className="flex items-center justify-between">
                <strong className="small mb-0">
                  Sedes ({Array.isArray(sedes) ? sedes.length : 0})
                </strong>
                <small className="text-muted">Detalles</small>
              </CardHeader>

              <CardContent className="p-2">
                {!Array.isArray(sedes) || sedes.length === 0 ? (
                  <div className="small text-muted p-3">
                    No hay sedes registradas
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                    {sedes.map((sede) => (
                      <div
                        key={sede.id || sede.nombre || Math.random()}
                        className="col-12 col-md-6"
                      >
                        <div
                          className="p-2 rounded"
                          style={{
                            background: "#fbfcfd",
                            border: "1px solid #eef3f7",
                          }}
                        >
                          <div className="d-flex align-items-start gap-3">
                            <div
                              style={{
                                width: 44,
                                height: 44,
                                borderRadius: 8,
                                background: "#eef6fb",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                color: "#1f4760",
                              }}
                            >
                              {(sede.nombre || "S").charAt(0).toUpperCase()}
                            </div>

                            <div className="flex-grow-1">
                              <div className="fw-semibold">
                                {capitalizeFirstLetter(
                                  sede.nombre || sede.razon || "Sin nombre",
                                )}
                              </div>
                              <div
                                className="small text-muted text-truncate"
                                style={{ maxWidth: 420 }}
                              >
                                {sede.direccion ||
                                  sede.domicilio ||
                                  "Dirección no disponible"}
                              </div>
                              <div className="small text-muted mt-1">
                                {sede.telefono || sede.numero || "—"} &nbsp; •
                                &nbsp;
                                {sede.ciudad || sede.departamento || "—"}
                              </div>
                            </div>

                            <div className="text-end">
                              {Number(sede.estado) === 1 ? (
                                <span className="badge bg-success">Activa</span>
                              ) : (
                                <span className="badge bg-secondary">
                                  Inactiva
                                </span>
                              )}
                              <div className="text-muted mt-2">
                                <MapPin size={16} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
