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
        <div className="flex items-center gap-3">
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
            <small className="text-muted-foreground block">RUC: {ruc}</small>
            <small
              className="text-muted-foreground block truncate"
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
        <div className="grid grid-cols-12 gap-3 mb-3">
          <div className="col-span-6 md:col-span-3">
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <small className="text-muted-foreground">Usuarios</small>
                  <div className="h5 mb-0">{counts.usuariosCount}</div>
                </div>
                <div className="text-muted-foreground">
                  <Users size={22} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-6 md:col-span-3">
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <small className="text-muted-foreground">Sedes</small>
                  <div className="h5 mb-0">{counts.sedesCount}</div>
                </div>
                <div className="text-muted-foreground">
                  <MapPin size={22} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-6 md:col-span-3">
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <small className="text-muted-foreground">
                    Configuraciones
                  </small>
                  <div className="h5 mb-0">{counts.configTotal}</div>
                </div>
                <div className="text-muted-foreground">
                  <Settings size={22} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-6 md:col-span-3">
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <small className="text-muted-foreground">Activas</small>
                  <div className="h5 mb-0">{counts.configActivas}</div>
                </div>
                <div className="text-muted-foreground">
                  <CheckCircle size={22} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-full md:col-span-5">
            <Card className="border">
              <CardHeader className="flex items-center justify-between">
                <strong className="text-sm mb-0">
                  Usuarios ({counts.usuariosCount})
                </strong>
                <small className="text-muted-foreground">Últimos</small>
              </CardHeader>
              <ul className="flex flex-col divide-y-0 p-2">
                {usuariosPreview.length === 0 ? (
                  <li className="relative block border-b bg-background px-4 py-3 text-foreground">
                    No hay usuarios
                  </li>
                ) : (
                  usuariosPreview.map((u) => (
                    <li
                      key={u.id || u.email || Math.random()}
                      className="relative border-b bg-background px-4 py-3 text-foreground flex items-center gap-3"
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
                      <div className="grow">
                        <div className="font-semibold">
                          {capitalizeFirstLetter(u.empleado?.persona?.nombre) +
                            " " +
                            capitalizeFirstLetter(
                              u.empleado?.persona?.apellidos,
                            ) || "Sin nombre"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {u.email || u.correo || "—"}
                        </div>
                      </div>
                      <div>
                        <small className="text-muted-foreground">
                          {u.role || u.rol || ""}
                        </small>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </Card>
          </div>

          <div className="col-span-full md:col-span-7">
            <Card className="border">
              <CardHeader className="flex items-center justify-between">
                <strong className="text-sm mb-0">
                  Configuraciones ({counts.configTotal})
                </strong>
                <small className="text-muted-foreground">Estado</small>
              </CardHeader>

              <div className="w-full overflow-x-auto p-2">
                <table className="w-full caption-bottom text-sm mb-0">
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
                        <td
                          colSpan="3"
                          className="text-sm text-muted-foreground"
                        >
                          Sin configuraciones
                        </td>
                      </tr>
                    ) : (
                      configuracionesList.map((cfg) => (
                        <tr key={cfg.id || cfg.nombre}>
                          <td className="align-middle">{cfg.nombre}</td>
                          <td
                            className="align-middle truncate"
                            style={{ maxWidth: 320 }}
                          >
                            {cfg.descripcion || "—"}
                          </td>
                          <td className="align-middle">
                            {Number(cfg.estado) === 1 ? (
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors bg-emerald-600">
                                Activo
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors bg-secondary">
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
        <div className="grid grid-cols-12 gap-3 mt-3">
          <div className="col-span-full">
            <Card className="border">
              <CardHeader className="flex items-center justify-between">
                <strong className="text-sm mb-0">
                  Sedes ({Array.isArray(sedes) ? sedes.length : 0})
                </strong>
                <small className="text-muted-foreground">Detalles</small>
              </CardHeader>

              <CardContent className="p-2">
                {!Array.isArray(sedes) || sedes.length === 0 ? (
                  <div className="text-sm text-muted-foreground p-3">
                    No hay sedes registradas
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                    {sedes.map((sede) => (
                      <div
                        key={sede.id || sede.nombre || Math.random()}
                        className="col-span-full md:col-span-6"
                      >
                        <div
                          className="p-2 rounded"
                          style={{
                            background: "#fbfcfd",
                            border: "1px solid #eef3f7",
                          }}
                        >
                          <div className="flex items-start gap-3">
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

                            <div className="grow">
                              <div className="font-semibold">
                                {capitalizeFirstLetter(
                                  sede.nombre || sede.razon || "Sin nombre",
                                )}
                              </div>
                              <div
                                className="text-sm text-muted-foreground truncate"
                                style={{ maxWidth: 420 }}
                              >
                                {sede.direccion ||
                                  sede.domicilio ||
                                  "Dirección no disponible"}
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {sede.telefono || sede.numero || "—"} &nbsp; •
                                &nbsp;
                                {sede.ciudad || sede.departamento || "—"}
                              </div>
                            </div>

                            <div className="text-right">
                              {Number(sede.estado) === 1 ? (
                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors bg-emerald-600">
                                  Activa
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors bg-secondary">
                                  Inactiva
                                </span>
                              )}
                              <div className="text-muted-foreground mt-2">
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
