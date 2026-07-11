import {
  CalendarDays,
  CalendarCheck,
  ListOrdered,
  CheckCircle2,
  FileText,
  FileDown,
} from "lucide-react";
import { useState } from "react";
import ModalGeneral from "../../componenteToast/ModalGeneral";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";
import { useQueryClient } from "@tanstack/react-query";

export function DetallesCuotasCliente({ data, refetch, modalClose }) {
  const [alertConfirmarPago, setAlertConfirmarPago] = useState(false);
  const [dataPago, setDataPago] = useState(null);

  const queryClient = useQueryClient();

  if (!data) return <div>No hay datos disponibles.</div>;

  const cliente = data.cliente?.persona
    ? `${data.cliente.persona.nombre} ${data.cliente.persona.apellidos}`
    : data.cliente?.empresa?.nombre || "Sin cliente";

  const formatMoney = (value) => `S/. ${Number(value || 0).toFixed(2)}`;
  const estadoCuenta = String(data.estado || "pendiente").toLowerCase();
  const estadoCuentaTexto =
    estadoCuenta.charAt(0).toUpperCase() + estadoCuenta.slice(1);
  const cuotasRestantes =
    Number(data.cuotas || 0) - Number(data.cuotas_pagadas || 0);

  const estiloEstadoCuenta =
    estadoCuenta === "pendiente"
      ? {
          backgroundColor: "var(--bg-saffron-soft)",
          color: "var(--fw-saffron)",
        }
      : {
          backgroundColor: "var(--bg-emerald-soft)",
          color: "var(--fw-emerald)",
        };

  const handleRealizarPago = async (dataId) => {
    try {
      const response = await axiosInstance.put(
        `/cuentasPorCobrar/pagarCuota/${dataId}`,
        {},
      );

      if (response.data.success) {
        ToastAlert("success", "Pago registrado con éxito");
        setAlertConfirmarPago(false);
        setDataPago(null);
        if (refetch) refetch();
        queryClient.invalidateQueries({ queryKey: ["cuentasPorCobrar"] });
        if (modalClose) modalClose();
      } else {
        ToastAlert(
          "error",
          "Error al registrar el pago" + response.data.message,
        );
      }
    } catch (error) {
      console.error("Error al realizar el pago:", error);
      ToastAlert("error", "Error de conexion");
    }
  };

  const abrirConfirmacionPago = (cuota) => {
    setDataPago(cuota);
    setAlertConfirmarPago(true);
  };

  const cerrarConfirmacionPago = () => {
    setAlertConfirmarPago(false);
    setDataPago(null);
  };

  const descargarDetalles = async (dataId) => {
    try {
      const response = await axiosInstance.get(
        `/cuentasPorCobrar/descargarDetalles/${dataId}`,
        {
          responseType: "blob", // Indica que la respuesta será un archivo binario
        },
      );
      // Crear un enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `detalles_cuenta_${dataId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      let errorMessage = "Error al descargar los detalles";

      // Si la respuesta es un Blob (lo que Axios hace por el responseType)
      if (error.response && error.response.data instanceof Blob) {
        // Leemos el texto dentro del Blob de forma asíncrona
        const errorText = await error.response.data.text();
        try {
          // Intentamos convertir ese texto de vuelta a JSON
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
          console.error("Detalle del error en Laravel:", errorJson.error); // Aquí verás el error real de PHP
        } catch (e) {
          console.error("No se pudo parsear el error:", e);
        }
      } else {
        // Por si acaso el error no llegó como Blob
        errorMessage = error.response?.data?.message || errorMessage;
      }

      console.error("Error al descargar los detalles:", errorMessage);
      ToastAlert("error", errorMessage);
    }
  };

  return (
    <div className="mb-3 p-4">
      <div className="card  border-0">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-1">Detalle de Cuenta por Cobrar</h4>
              <span className="text-muted">Cliente: {cliente}</span>
            </div>
            <span
              className="badge px-3 py-2 fs-6"
              style={{ borderRadius: "20px", ...estiloEstadoCuenta }}
            >
              {estadoCuentaTexto}
            </span>
          </div>

          <div className="row g-3 mb-2">
            <div className="col-md-3">
              <div className="border rounded p-3 h-100 d-flex flex-column align-items-start">
                <span className="mb-1">
                  <FileText
                    size={20}
                    className="me-1"
                    style={{ color: "var(--fw-saffron)" }}
                  />
                  Monto Total
                </span>
                <span className="fs-4 fw-bold">{formatMoney(data.monto)}</span>
              </div>
            </div>
            <div className="col-md-3">
              <div className="border rounded p-3 h-100 d-flex flex-column align-items-start">
                <span className="mb-1">
                  <CheckCircle2
                    size={20}
                    className="me-1"
                    style={{ color: "var(--fw-emerald)" }}
                  />
                  Monto Pagado
                </span>
                <span className="fs-4 fw-bold">
                  {formatMoney(data.monto_pagado)}
                </span>
              </div>
            </div>
            <div className="col-md-3">
              <div className="border rounded p-3 h-100 d-flex flex-column align-items-start">
                <span className="mb-1">
                  <CalendarDays
                    size={20}
                    className="me-1"
                    style={{ color: "var(--fw-saffron)" }}
                  />
                  Fecha de Inicio
                </span>
                <span className="fs-5 fw-bold">{data.fecha_inicio}</span>
              </div>
            </div>
            <div className="col-md-3">
              <div className="border rounded p-3 h-100 d-flex flex-column align-items-start">
                <span
                  className="mb-1 fw-bold"
                  style={{ color: "var(--fw-strawberry)" }}
                >
                  <CalendarCheck size={20} className="me-1" />
                  Fecha de Fin
                </span>
                <span
                  className="fs-5 fw-bold"
                  style={{ color: "var(--fw-strawberry)" }}
                >
                  {data.fecha_fin}
                </span>
              </div>
            </div>
          </div>

          <div className="row g-3 mb-2">
            <div className="col-md-4">
              <div className="border rounded p-3 h-100 d-flex flex-column align-items-start">
                <div className="d-flex gap-2">
                  <ListOrdered size={22} className="mb-1" />
                  <span>Cuotas Totales</span>
                </div>
                <span className="fs-4 fw-bold">{data.cuotas}</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="border rounded p-3 h-100 d-flex flex-column align-items-start">
                <div className="d-flex gap-2">
                  <CheckCircle2 size={22} className="mb-1" />
                  <span>Cuotas Pagadas</span>
                </div>
                <span className="fs-4 fw-bold">{data.cuotas_pagadas}</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="border rounded p-3 h-100 d-flex flex-column align-items-start">
                <div className="d-flex gap-2">
                  <CalendarDays size={22} className="mb-1" />
                  <span>Cuotas Restantes</span>
                </div>
                <span className="fs-4 fw-bold">{cuotasRestantes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card  border mt-3">
        <div className="card-header rounded-top">
          <CalendarDays size={20} className="mb-1 me-2" />
          <span className="fw-bold fs-5">Cuotas Programadas</span>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th className="text-center">Cuota</th>
                  <th>Fecha de Pago</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Fecha del Pago Realizado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data.cuotas_programadas) &&
                data.cuotas_programadas.length > 0 ? (
                  data.cuotas_programadas.map((cuota) => (
                    <tr key={cuota.id}>
                      <td className="text-center">
                        <span
                          className="badge rounded-circle fs-6"
                          style={{
                            backgroundColor: "var(--bg-strawberry-soft)",
                            color: "var(--fw-strawberry)",
                            width: 32,
                            height: 32,
                            lineHeight: "20px",
                          }}
                        >
                          {cuota.numero_cuota}
                        </span>
                      </td>
                      <td>
                        <CalendarDays
                          size={16}
                          className="mb-1 me-1 text-secondary"
                        />
                        {cuota.fecha_pago}
                      </td>
                      <td>
                        <span
                          className="fw-bold"
                          style={{ color: "var(--fw-emerald)" }}
                        >
                          {formatMoney(cuota.monto)}
                        </span>
                      </td>
                      <td>
                        {(() => {
                          const estadoCuota = String(
                            cuota.estado || "pendiente",
                          ).toLowerCase();
                          const badgeStyle =
                            estadoCuota === "pagado"
                              ? {
                                  backgroundColor: "var(--bg-emerald-soft)",
                                  color: "var(--fw-emerald)",
                                }
                              : {
                                  backgroundColor: "var(--bg-saffron-soft)",
                                  color: "var(--fw-saffron)",
                                };

                          return (
                            <span
                              className="badge px-3 py-2 small"
                              style={{ borderRadius: "20px", ...badgeStyle }}
                            >
                              {cuota.estado.charAt(0).toUpperCase() +
                                cuota.estado.slice(1)}
                            </span>
                          );
                        })()}
                      </td>
                      <td>{cuota.fecha_pagada ? cuota.fecha_pagada : "-"}</td>
                      <td>
                        {cuota.estado === "pagado" ? (
                          <button
                            className="btn btn-sm fw-bold"
                            style={{
                              border: "1px solid var(--fw-border)",
                              backgroundColor: "var(--bg-card)",
                              color: "var(--fw-emerald)",
                            }}
                          >
                            Ver Declarado
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm fw-bold"
                            style={{
                              border: "1px solid var(--fw-border)",
                              backgroundColor: "var(--bg-strawberry-soft)",
                              color: "var(--fw-strawberry)",
                            }}
                            onClick={() => abrirConfirmacionPago(cuota)}
                          >
                            Registrar Pago
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-muted">
                      No hay cuotas registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card mt-3 p-3">
        <button
          type="button"
          className="btn-guardar"
          style={{ width: "250px" }}
          onClick={() => descargarDetalles(data.id)}
        >
          <FileDown className="text-auto" /> Descargar Detalles
        </button>
      </div>

      <ModalGeneral
        show={alertConfirmarPago}
        handleCloseModal={cerrarConfirmacionPago}
        mensaje={"¿Está seguro de que desea registrar el pago de esta cuota?"}
        handleAccion={() => handleRealizarPago(dataPago?.id)}
        idProceso={dataPago?.id}
      >
        <div className="card border m-3 text-left">
          {dataPago ? (
            <div className="p-3 text-left">
              <h5 className="fw-bold mb-3">Detalles del Pago</h5>
              <p>
                <strong>Cuota N°:</strong> {dataPago.numero_cuota}
              </p>
              <p>
                <strong>Monto:</strong> S/. {dataPago.monto}
              </p>
              <p>
                <strong>Fecha de Pago Programada:</strong> {dataPago.fecha_pago}
              </p>
              <p className="text-danger">
                <strong>Estado:</strong>{" "}
                {dataPago.estado
                  ? dataPago.estado.charAt(0).toUpperCase() +
                    dataPago.estado.slice(1)
                  : "Sin estado"}
              </p>
            </div>
          ) : null}
        </div>
      </ModalGeneral>
    </div>
  );
}
