import {
  User,
  Calendar,
  TreePalm,
  BriefcaseBusiness,
  Phone,
  Mail,
  MapPin,
  Clock,
  CreditCardIcon,
  TrendingUp,
  TrendingDown,
  Printer,
  Pen,
  Coins,
  Loader2,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { GetEmpleadoId } from "../../service/accionesPlanilla/GetEmpleadoId";
import { Cargando } from "../componentesReutilizables/Cargando";
import { BotonMotionGeneral } from "../componentesReutilizables/BotonMotionGeneral";
import { useRef, useState } from "react";
import { useGenerarReporte } from "../../hooks/GenerarPdfReporte";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function PerfilGeneralNomina({ idEmpleado }) {
  const reporteRef = useRef();
  const { data: perfil = [], isLoading } = useQuery({
    queryKey: ["perfilEmpleado", idEmpleado],
    queryFn: () => GetEmpleadoId(idEmpleado),
    enabled: !!idEmpleado, // Solo ejecuta si hay idEmpleado
    refetchOnWindowFocus: false,
    retry: 1,
  });
  console.log("Usuarios Nomina:", perfil);
  const generarReporte = useGenerarReporte("PerfilEmpleado.pdf");
  const [loading, setLoading] = useState(false);
  const handleGenerar = async () => {
    setLoading(true);
    await generarReporte(reporteRef); // espera a que termine el proceso
    setLoading(false);
  };

  return (
    <div className="perfil-nomina p-3" ref={reporteRef}>
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-full md:col-span-12">
          {isLoading ? (
            <div
              className="flex justify-center items-center w-full bg-muted"
              style={{ minHeight: "250px" }}
            >
              <Cargando />
            </div>
          ) : (
            <>
              <Card className="flex text-left overflow-hidden p-0 relative">
                <div
                  className="grid grid-cols-12 gap-3 relative"
                  style={{ zIndex: 2 }}
                >
                  <div className="col-span-full md:col-span-2 p-4 flex">
                    <img
                      src={
                        perfil?.usuario?.foto_url
                          ? `${perfil.usuario.foto_url}`
                          : "https://via.placeholder.com/120"
                      }
                      alt="Foto perfil"
                      className="rounded center-img m-auto"
                      width={120}
                      height={120}
                      style={{
                        objectFit: "cover",
                        border: "3px solid #ffffffff",
                      }}
                    />
                  </div>
                  <div className="col-span-full md:col-span-10 p-4">
                    <h5 className="font-bold mb-0">
                      {perfil?.usuario?.empleado?.persona?.nombre}
                      <span> </span>
                      {perfil?.usuario?.empleado?.persona?.apellidos}
                    </h5>
                    <small className="text-muted-foreground">
                      {perfil?.usuario?.empleado?.cargo?.nombre} -{" "}
                      {perfil?.usuario?.empleado?.area?.nombre}
                    </small>
                    <span className="flex items-center gap-2">
                      <small className="text-muted-foreground">
                        Fecha de ingreso:
                      </small>
                      <span className="font-bold text-foreground">
                        {perfil?.usuario?.empleado?.fecha_contrato
                          ? new Date(
                              perfil.usuario.empleado.fecha_contrato.includes(
                                "T",
                              )
                                ? perfil.usuario.empleado.fecha_contrato
                                : perfil.usuario.empleado.fecha_contrato +
                                    "T00:00:00",
                            ).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "Sin especificar"}
                      </span>
                    </span>
                  </div>
                  <div className="col-span-full md:col-span-12 flex w-full">
                    <div className="flex gap-3 mx-3">
                      <BotonMotionGeneral
                        text="Editar Perfil"
                        icon={<Pen size={18} />}
                      />
                      <BotonMotionGeneral
                        text={loading ? "Generando..." : "Imprimir"}
                        icon={
                          loading ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Printer size={18} />
                          )
                        }
                        disabled={loading}
                        onClick={handleGenerar}
                      />
                    </div>
                  </div>
                </div>
                {/* Fondo decorativo detrás */}
                <div
                  className="absolute w-full"
                  style={{
                    top: 0,
                    left: 0,
                    height: "50%",
                    backgroundImage: 'url("/images/fondo-perfil.svg")',
                    zIndex: 1,
                    backgroundPosition: "top",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100%",
                  }}
                ></div>
                <div className="col-span-full md:col-span-12 p-4">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-full md:col-span-3">
                      <Card className="border p-3 h-full">
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <small>Días trabajados</small>
                            <div className="">
                              <h4 className="mb-0 font-bold">
                                {perfil?.dias_trabajados}
                              </h4>
                              <small>
                                {parseFloat(
                                  perfil?.porcentaje_dias_trabajados ?? 0,
                                ).toFixed(0)}
                                % Asistencia
                              </small>
                            </div>
                          </div>
                          <Calendar size={60} />
                        </div>
                      </Card>
                    </div>
                    <div className="col-span-full md:col-span-3">
                      <Card className="border p-3 h-full">
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <small>Salario Base</small>
                            <div className="">
                              <h4 className="mb-0 font-bold">
                                {perfil?.usuario?.empleado?.salario
                                  ? `S/ ${parseFloat(
                                      perfil?.usuario?.empleado.salario,
                                    ).toFixed(2)}`
                                  : "S/ 0.00"}
                              </h4>
                              <small>Mensual</small>
                            </div>
                          </div>
                          <span className="h1">S/.</span>
                        </div>
                      </Card>
                    </div>
                    <div className="col-span-full md:col-span-3">
                      <Card className="border p-3 h-full">
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <small>Vacaciones</small>
                            <div className="">
                              <h4 className="mb-0 font-bold">
                                {parseFloat(perfil?.vacacionesContados) || 0
                                  ? perfil?.vacacionesContados
                                  : "0"}
                              </h4>
                              <small>Días</small>
                            </div>
                          </div>
                          <TreePalm size={60} />
                        </div>
                      </Card>
                    </div>
                    <div className="col-span-full md:col-span-3">
                      <Card className="border p-3 h-full">
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <small>Tipo Contrato</small>
                            <div className="">
                              <h6 className="mb-0 font-bold">
                                {perfil?.usuario?.empleado?.contrato?.nombre ||
                                  "N/A"}
                              </h6>
                              <small>Activo</small>
                            </div>
                          </div>
                          <BriefcaseBusiness size={60} />
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
        {/* Resumen y foto */}
      </div>

      {/* Bonificaciones y deducciones */}
      <div className="grid grid-cols-12 gap-3 mt-2">
        <div className="col-span-full md:col-span-8">
          <Card className="p-3">
            <CardHeader className="flex gap-2 align-middle justify-start">
              <span className="relative w-full rounded-lg text-sm border-destructive/30 bg-destructive/10 text-destructive p-2 mb-0">
                <User size={25} className="text-auto" />
              </span>
              <h6 className="mb-1 flex flex-col gap-1">
                <span className="font-bold">Información Personal</span>
                <p className="text-muted-foreground text-sm mb-0">Datos </p>
              </h6>
            </CardHeader>
            <CardContent className="">
              <div className="grid grid-cols-12 gap-4mb-2">
                <div className="col-span-full md:col-span-6 text-sm mb-2">
                  <span className="text-muted-foreground">Documento:</span>
                  <div>
                    {perfil.usuario?.empleado.persona.documento_identidad}
                  </div>
                </div>
                <div className="col-span-full md:col-span-6 text-sm mb-2">
                  <span className="text-muted-foreground">
                    {" "}
                    <Phone size={15} />
                    Teléfono:
                  </span>
                  <div>{perfil?.empleado?.persona?.telefono || "N/A"}</div>
                </div>
                <div className="col-span-full md:col-span-6 text-sm mb-2">
                  <span className="text-muted-foreground flex gap-1 items-center">
                    <Mail size={15} />
                    <span>Correo:</span>
                  </span>
                  <div>
                    {perfil.usuario?.correo ||
                      perfil.usuario?.usuario?.email ||
                      "N/A"}
                  </div>
                </div>
                <div className="col-span-full md:col-span-6 text-sm mb-2">
                  <span className="text-muted-foreground flex gap-1 items-center">
                    <MapPin size={15} />
                    <span>Dirección:</span>
                  </span>
                  <div>
                    {perfil.usuario?.empleado?.persona?.direccion || "N/A"}
                  </div>
                </div>
                <div className="col-span-full md:col-span-6 text-sm mb-2">
                  <span className="text-muted-foreground flex gap-1 items-center">
                    <Calendar size={15} />
                    <span>Fecha Nacimiento:</span>
                  </span>
                  <div>
                    {perfil?.usuario?.empleado?.persona?.fecha_nacimiento ||
                      "N/A"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-full md:col-span-4">
          <Card className="p-3 h-full">
            <CardHeader className="flex gap-2 align-middle justify-start">
              <span className="relative w-full rounded-lg text-sm border-emerald-500/30 bg-emerald-500/10 dark:text-emerald-400 text-destructive p-2 mb-0">
                <TrendingUp
                  className="me-1 text-emerald-600 dark:text-emerald-400"
                  size={25}
                />
              </span>
              <h6 className="mb-1 flex flex-col gap-1">
                <span className="font-bold">Bonificaciones</span>
                <p className="text-muted-foreground text-sm mb-0"> </p>
              </h6>
            </CardHeader>
            <CardContent className="">
              <ul className="flex flex-col divide-y-0">
                {perfil.bonificaciones && perfil.bonificaciones.length > 0 ? (
                  perfil.bonificaciones.map((d, idx) => (
                    <li
                      key={idx}
                      className="relative w-full rounded-lg px-4 py-3 text-sm flex justify-between items-center"
                      style={{
                        background: "#E6FAF0",
                        border: "1px solid #28a745",
                      }}
                    >
                      <span>{d.nombre}</span>
                    </li>
                  ))
                ) : (
                  <li
                    className="relative w-full rounded-lg px-4 py-3 text-sm text-muted-foreground"
                    style={{
                      background: "#E6FAF0",
                      border: "1px solid #28a745",
                    }}
                  >
                    Sin Bonificaciones
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-full md:col-span-8">
          <Card className="p-3">
            <CardHeader className="flex gap-2 align-middle justify-start">
              <span className="relative w-full rounded-lg text-sm border-destructive/30 bg-destructive/10 text-destructive p-2 mb-0">
                <BriefcaseBusiness size={25} className="text-auto" />
              </span>
              <h6 className="mb-1 flex flex-col gap-1">
                <span className="font-bold">Información Laboral</span>
                <p className="text-muted-foreground text-sm mb-0">Básico </p>
              </h6>
            </CardHeader>
            <CardContent className="">
              <div className="grid grid-cols-12 gap-4mb-2">
                <div className="col-span-full md:col-span-6 text-sm mb-2">
                  <span className="text-muted-foreground">Cargo</span>
                  <div>{perfil.usuario?.empleado.cargo.nombre}</div>
                </div>

                <div className="col-span-full md:col-span-6 text-sm mb-2">
                  <span className="text-muted-foreground flex gap-1 items-center">
                    <Clock size={15} />
                    <span>Horario</span>
                  </span>
                  <div>
                    {perfil.usuario?.correo ||
                      perfil.usuario?.usuario?.email ||
                      "N/A"}
                  </div>
                </div>
                <div className="col-span-full md:col-span-6 text-sm mb-2">
                  <span className="text-muted-foreground">Área:</span>
                  <div>{perfil?.usuario?.empleado?.area?.nombre || "N/A"}</div>
                </div>
                <div className="col-span-full md:col-span-6 text-sm mb-2">
                  <span className="text-muted-foreground flex gap-1 items-center">
                    <MapPin size={15} />
                    <span>Salario Base</span>
                  </span>
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                    S/. {perfil.usuario?.empleado?.salario || "N/A"}
                  </div>
                </div>
                <div className="col-span-full md:col-span-6 text-sm mb-2">
                  <span className="text-muted-foreground flex gap-1 items-center">
                    <span>Tipo de Contrato</span>
                  </span>
                  <div>
                    {perfil?.usuario?.empleado?.contrato?.nombre || "N/A"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-full md:col-span-4">
          <Card className="p-3 h-full">
            <CardHeader className="flex gap-2 align-middle justify-start">
              <span className="relative w-full rounded-lg text-sm border-destructive/30 bg-destructive/10 text-destructive p-2 mb-0">
                <TrendingDown className="me-1 text-destructive" size={25} />
              </span>
              <h6 className="mb-1 flex flex-col gap-1">
                <span className="font-bold">Deducciones</span>
                <p className="text-muted-foreground text-sm mb-0"> </p>
              </h6>
            </CardHeader>
            <CardContent className="">
              <ul className="flex flex-col divide-y-0">
                {perfil.deducciones && perfil.deducciones.length > 0 ? (
                  perfil.deducciones.map((d, idx) => (
                    <li
                      key={idx}
                      className="relative w-full rounded-lg px-4 py-3 text-sm border-destructive/30 bg-destructive/10 text-destructive flex justify-between items-center"
                    >
                      <span>{d.nombre}</span>
                    </li>
                  ))
                ) : (
                  <li className="relative w-full rounded-lg px-4 py-3 text-sm border-destructive/30 bg-destructive/10 text-muted-foreground">
                    Sin deducciones
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pagos */}
      <div className="grid grid-cols-12 gap-3 mt-2">
        <div className="col-span-full md:col-span-8">
          <Card className="p-3">
            <CardHeader className="flex gap-2 align-middle justify-start">
              <span className="relative w-full rounded-lg text-sm border-destructive/30 bg-destructive/10 text-destructive p-2 mb-0">
                <CreditCardIcon size={25} className="text-auto" />
              </span>
              <h6 className="mb-1 flex flex-col gap-1">
                <span className="font-bold">Pagos</span>
                <p className="text-muted-foreground text-sm mb-0">
                  Historial de pagos realizados{" "}
                </p>
              </h6>
            </CardHeader>
            <CardContent className="">
              <div className="w-full overflow-x-auto">
                <table className="w-full caption-bottom text-sm border-border [&_th]:border [&_td]:border [&_th]:border-border [&_td]:border-border [&_tbody_tr:hover]:bg-muted/50">
                  <thead className="bg-muted">
                    <tr>
                      <th>Fecha</th>
                      <th>Monto Neto</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perfil?.usuario?.empleado?.pagos &&
                    perfil?.usuario?.empleado?.pagos.length > 0 ? (
                      perfil?.usuario?.empleado?.pagos.map((pago, idx) => (
                        <tr key={idx}>
                          <td>{pago.fecha_pago || pago.created_at || "N/A"}</td>
                          <td>
                            S/ {parseFloat(pago.salario_neto ?? 0).toFixed(2)}
                          </td>
                          <td>
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors bg-emerald-600">
                              Pagado
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="text-center text-muted-foreground"
                        >
                          No hay pagos registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-full md:col-span-4">
          <Card
            className="p-3 h-full"
            style={{
              background:
                "linear-gradient(135deg, #494e52ff 0%, #252525ff 100%)",
              color: "#fff",
              borderRadius: "1rem",
              boxShadow: "0 4px 24px rgba(21,102,156,0.10)",
            }}
          >
            <CardHeader
              className="flex gap-2 align-middle justify-start bg-transparent"
              style={{ background: "transparent" }}
            >
              <span
                className="relative w-full rounded-lg text-sm p-2 mb-0"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                <Coins className="me-1 text-light" size={25} />
              </span>
              <h6 className="mb-1 flex flex-col gap-1">
                <span className="font-bold" style={{ color: "#fff" }}>
                  Resumen Salarial
                </span>
                <p className="text-light text-sm mb-0">Detalle mensual</p>
              </h6>
            </CardHeader>
            <CardContent className="">
              <ul className="flex flex-col divide-y-0 bg-transparent">
                <li
                  className="relative border-b px-4 py-3 text-foreground flex justify-between items-center bg-transparent"
                  style={{ color: "#fff" }}
                >
                  <span>Salario Base:</span>
                  <span className="font-bold">
                    S/ {parseFloat(perfil?.sueldoBase ?? 0).toFixed(2)}
                  </span>
                </li>
                <li
                  className="relative border-b px-4 py-3 text-foreground flex justify-between items-center bg-transparent"
                  style={{ color: "#fff" }}
                >
                  <span>Total Bonificaciones:</span>
                  <span className="font-bold" style={{ color: "#b6ffb6" }}>
                    S/ {parseFloat(perfil?.totalBonificaciones ?? 0).toFixed(2)}
                  </span>
                </li>
                <li
                  className="relative border-b px-4 py-3 text-foreground flex justify-between items-center bg-transparent"
                  style={{ color: "#fff" }}
                >
                  <span>Total Deducciones:</span>
                  <span className="font-bold" style={{ color: "#ffd6d6" }}>
                    S/ {parseFloat(perfil?.totalDeducciones ?? 0).toFixed(2)}
                  </span>
                </li>
                <li
                  className="relative border-b px-4 py-3 text-foreground flex justify-between items-center bg-transparent"
                  style={{ color: "#fff" }}
                >
                  <span>Salario Neto:</span>
                  <span className="font-bold" style={{ color: "#ffe066" }}>
                    S/ {parseFloat(perfil?.sueldoNeto ?? 0).toFixed(2)}
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
