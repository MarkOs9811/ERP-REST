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
import "../../css/EstilosPerfilEmpleado.css";
import { useQuery } from "@tanstack/react-query";
import { GetEmpleadoId } from "../../service/accionesPlanilla/GetEmpleadoId";
import { Cargando } from "../componentesReutilizables/Cargando";
import { BotonMotionGeneral } from "../componentesReutilizables/BotonMotionGeneral";
import { useRef, useState } from "react";
import { useGenerarReporte } from "../../hooks/GenerarPdfReporte";
export function PerfilGeneralNomina({ idEmpleado }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const reporteRef = useRef();
  const {
    data: perfil = [],
    isLoading,
    isError,
  } = useQuery({
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
    <div className="perfil-nomina p-3 " ref={reporteRef}>
      <div className="row g-3">
        <div className="col-md-12">
          {isLoading ? (
            <div
              className="d-flex justify-content-center align-items-center w-100 bg-light"
              style={{ minHeight: "250px" }}
            >
              <Cargando />
            </div>
          ) : (
            <>
              <div className="card d-flex shadow-sm border-0 text-left overflow-hidden p-0 position-relative">
                <div
                  className="row g-3 position-relative"
                  style={{ zIndex: 2 }}
                >
                  <div className="col-md-2 p-4 d-flex">
                    <img
                      src={
                        perfil?.usuario?.fotoPerfil
                          ? `${BASE_URL}/storage/${perfil?.usuario?.fotoPerfil}`
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
                  <div className="col-md-10 p-4">
                    <h5 className="fw-bold mb-0">
                      {perfil?.usuario?.empleado?.persona?.nombre}
                      <span> </span>
                      {perfil?.usuario?.empleado?.persona?.apellidos}
                    </h5>
                    <small className="text-muted">
                      {perfil?.usuario?.empleado?.cargo?.nombre} -{" "}
                      {perfil?.usuario?.empleado?.area?.nombre}
                    </small>
                  </div>
                  <div className="col-md-12 d-flex">
                    <div className="ms-auto d-flex gap-3 mx-3">
                      <BotonMotionGeneral
                        text="Editar Perfil"
                        icon={<Pen />}
                        color1="#2b2b2bff"
                        color2="#000000ff"
                        classDefault="btn d-flex align-items-center gap-1 px-3 py-2 w-auto rounded-3 border-0 shadow-sm ms-auto text-white"
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
                  className="position-absolute w-100"
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
                <div className="col-md-12 p-4">
                  <div className="row g-3">
                    <div className="col-md-3">
                      <div className="card border p-3 h-100">
                        <div className="d-flex align-items-center justify-content-between w-100">
                          <div>
                            <small>Días trabajados</small>
                            <div className="">
                              <h4 className="mb-0 fw-bold">
                                {perfil?.dias_trabajados}
                              </h4>
                              <small>
                                {parseFloat(
                                  perfil?.porcentaje_dias_trabajados ?? 0
                                ).toFixed(0)}
                                % Asistencia
                              </small>
                            </div>
                          </div>
                          <Calendar size={60} />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card border p-3 h-100">
                        <div className="d-flex align-items-center justify-content-between w-100">
                          <div>
                            <small>Salario Base</small>
                            <div className="">
                              <h4 className="mb-0 fw-bold">
                                {perfil?.usuario?.empleado?.salario
                                  ? `S/ ${parseFloat(
                                      perfil?.usuario?.empleado.salario
                                    ).toFixed(2)}`
                                  : "S/ 0.00"}
                              </h4>
                              <small>Mensual</small>
                            </div>
                          </div>
                          <span className="h1">S/.</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card border p-3 h-100">
                        <div className="d-flex align-items-center justify-content-between w-100">
                          <div>
                            <small>Vacaciones</small>
                            <div className="">
                              <h4 className="mb-0 fw-bold">
                                {parseFloat(perfil?.vacacionesContados) || 0
                                  ? perfil?.vacacionesContados
                                  : "0"}
                              </h4>
                              <small>Días</small>
                            </div>
                          </div>
                          <TreePalm size={60} />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card border p-3 h-100">
                        <div className="d-flex align-items-center justify-content-between w-100">
                          <div>
                            <small>Tipo Contrato</small>
                            <div className="">
                              <h6 className="mb-0 fw-bold">
                                {perfil?.usuario?.empleado?.contrato?.nombre ||
                                  "N/A"}
                              </h6>
                              <small>Activo</small>
                            </div>
                          </div>
                          <BriefcaseBusiness size={60} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        {/* Resumen y foto */}
      </div>

      {/* Bonificaciones y deducciones */}
      <div className="row g-3 mt-2">
        <div className="col-md-8">
          <div className="card shadow-sm border-0 p-3">
            <div className="card-header d-flex gap-2 align-middle justify-content-left">
              <span className="alert border-0 alert-primary text-primary p-2 mb-0">
                <User size={25} className="text-auto" />
              </span>
              <h6 className="mb-1 d-flex flex-column gap-1">
                <span className="fw-bold">Información Personal</span>
                <p className="text-muted small mb-0">Datos </p>
              </h6>
            </div>
            <div className="card-body">
              <div className="row mb-2">
                <div className="col-md-6 small mb-2">
                  <span className="text-muted">Documento:</span>
                  <div>
                    {perfil.usuario?.empleado.persona.documento_identidad}
                  </div>
                </div>
                <div className="col-md-6 small mb-2">
                  <span className="text-muted">
                    {" "}
                    <Phone size={15} />
                    Teléfono:
                  </span>
                  <div>{perfil?.empleado?.persona?.telefono || "N/A"}</div>
                </div>
                <div className="col-md-6 small mb-2">
                  <span className="text-muted d-flex gap-1 align-items-center">
                    <Mail size={15} />
                    <span>Correo:</span>
                  </span>
                  <div>
                    {perfil.usuario?.correo ||
                      perfil.usuario?.usuario?.email ||
                      "N/A"}
                  </div>
                </div>
                <div className="col-md-6 small mb-2">
                  <span className="text-muted d-flex gap-1 align-items-center">
                    <MapPin size={15} />
                    <span>Dirección:</span>
                  </span>
                  <div>
                    {perfil.usuario?.empleado?.persona?.direccion || "N/A"}
                  </div>
                </div>
                <div className="col-md-6 small mb-2">
                  <span className="text-muted d-flex gap-1 align-items-center">
                    <Calendar size={15} />
                    <span>Fecha Nacimiento:</span>
                  </span>
                  <div>
                    {perfil?.usuario?.empleado?.persona?.fecha_nacimiento ||
                      "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3 h-100">
            <div className="card-header d-flex gap-2 align-middle justify-content-left">
              <span className="alert border-0 alert-success text-primary p-2 mb-0">
                <TrendingUp className="me-1 text-success" size={25} />
              </span>
              <h6 className="mb-1 d-flex flex-column gap-1">
                <span className="fw-bold">Bonificaciones</span>
                <p className="text-muted small mb-0"> </p>
              </h6>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {perfil.bonificaciones && perfil.bonificaciones.length > 0 ? (
                  perfil.bonificaciones.map((d, idx) => (
                    <li
                      key={idx}
                      className="alert  d-flex justify-content-between align-items-center"
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
                    className="alert  text-muted"
                    style={{
                      background: "#E6FAF0",
                      border: "1px solid #28a745",
                    }}
                  >
                    Sin Bonificaciones
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card shadow-sm border-0 p-3">
            <div className="card-header d-flex gap-2 align-middle justify-content-left">
              <span className="alert border-0 alert-primary text-primary p-2 mb-0">
                <BriefcaseBusiness size={25} className="text-auto" />
              </span>
              <h6 className="mb-1 d-flex flex-column gap-1">
                <span className="fw-bold">Información Laboral</span>
                <p className="text-muted small mb-0">Básico </p>
              </h6>
            </div>
            <div className="card-body">
              <div className="row mb-2">
                <div className="col-md-6 small mb-2">
                  <span className="text-muted">Cargo</span>
                  <div>{perfil.usuario?.empleado.cargo.nombre}</div>
                </div>

                <div className="col-md-6 small mb-2">
                  <span className="text-muted d-flex gap-1 align-items-center">
                    <Clock size={15} />
                    <span>Horario</span>
                  </span>
                  <div>
                    {perfil.usuario?.correo ||
                      perfil.usuario?.usuario?.email ||
                      "N/A"}
                  </div>
                </div>
                <div className="col-md-6 small mb-2">
                  <span className="text-muted">Área:</span>
                  <div>{perfil?.usuario?.empleado?.area?.nombre || "N/A"}</div>
                </div>
                <div className="col-md-6 small mb-2">
                  <span className="text-muted d-flex gap-1 align-items-center">
                    <MapPin size={15} />
                    <span>Salario Base</span>
                  </span>
                  <div className="text-success fw-bold">
                    S/. {perfil.usuario?.empleado?.salario || "N/A"}
                  </div>
                </div>
                <div className="col-md-6 small mb-2">
                  <span className="text-muted d-flex gap-1 align-items-center">
                    <span>Tipo de Contrato</span>
                  </span>
                  <div>
                    {perfil?.usuario?.empleado?.contrato?.nombre || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3 h-100">
            <div className="card-header d-flex gap-2 align-middle justify-content-left">
              <span className="alert border-0 alert-danger text-primary p-2 mb-0">
                <TrendingDown className="me-1 text-danger" size={25} />
              </span>
              <h6 className="mb-1 d-flex flex-column gap-1">
                <span className="fw-bold">Deducciones</span>
                <p className="text-muted small mb-0"> </p>
              </h6>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {perfil.deducciones && perfil.deducciones.length > 0 ? (
                  perfil.deducciones.map((d, idx) => (
                    <li
                      key={idx}
                      className="alert alert-danger d-flex justify-content-between align-items-center"
                    >
                      <span>{d.nombre}</span>
                    </li>
                  ))
                ) : (
                  <li className="alert alert-danger text-muted">
                    Sin deducciones
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Pagos */}
      <div className="row g-3 mt-2">
        <div className="col-md-8">
          <div className="card shadow-sm border-0 p-3">
            <div className="card-header d-flex gap-2 align-middle justify-content-left">
              <span className="alert border-0 alert-primary text-primary p-2 mb-0">
                <CreditCardIcon size={25} className="text-auto" />
              </span>
              <h6 className="mb-1 d-flex flex-column gap-1">
                <span className="fw-bold">Pagos</span>
                <p className="text-muted small mb-0">
                  Historial de pagos realizados{" "}
                </p>
              </h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
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
                            <span className=" badge bg-success ">Pagado</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center text-muted">
                          No hay pagos registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="card shadow-sm border-0 p-3 h-100"
            style={{
              background:
                "linear-gradient(135deg, #494e52ff 0%, #252525ff 100%)",
              color: "#fff",
              borderRadius: "1rem",
              boxShadow: "0 4px 24px rgba(21,102,156,0.10)",
            }}
          >
            <div
              className="card-header d-flex gap-2 align-middle justify-content-left bg-transparent border-0"
              style={{ background: "transparent" }}
            >
              <span
                className="alert border-0 p-2 mb-0"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                <Coins className="me-1 text-light" size={25} />
              </span>
              <h6 className="mb-1 d-flex flex-column gap-1">
                <span className="fw-bold" style={{ color: "#fff" }}>
                  Resumen Salarial
                </span>
                <p className="text-light small mb-0">Detalle mensual</p>
              </h6>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush bg-transparent">
                <li
                  className="list-group-item d-flex justify-content-between align-items-center bg-transparent border-0"
                  style={{ color: "#fff" }}
                >
                  <span>Salario Base:</span>
                  <span className="fw-bold">
                    S/ {parseFloat(perfil?.sueldoBase ?? 0).toFixed(2)}
                  </span>
                </li>
                <li
                  className="list-group-item d-flex justify-content-between align-items-center bg-transparent border-0"
                  style={{ color: "#fff" }}
                >
                  <span>Total Bonificaciones:</span>
                  <span className="fw-bold" style={{ color: "#b6ffb6" }}>
                    S/ {parseFloat(perfil?.totalBonificaciones ?? 0).toFixed(2)}
                  </span>
                </li>
                <li
                  className="list-group-item d-flex justify-content-between align-items-center bg-transparent border-0"
                  style={{ color: "#fff" }}
                >
                  <span>Total Deducciones:</span>
                  <span className="fw-bold" style={{ color: "#ffd6d6" }}>
                    S/ {parseFloat(perfil?.totalDeducciones ?? 0).toFixed(2)}
                  </span>
                </li>
                <li
                  className="list-group-item d-flex justify-content-between align-items-center bg-transparent border-0"
                  style={{ color: "#fff" }}
                >
                  <span>Salario Neto:</span>
                  <span className="fw-bold" style={{ color: "#ffe066" }}>
                    S/ {parseFloat(perfil?.sueldoNeto ?? 0).toFixed(2)}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
