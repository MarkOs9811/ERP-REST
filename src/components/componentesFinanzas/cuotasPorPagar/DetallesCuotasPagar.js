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

export function DetallesCuotasPagar({ data, refetch, modalClose }) {
  const [alertConfirmarPago, setAlertConfirmarPago] = useState(false);
  const [dataPago, setDataPago] = useState([]);

  const queryClient = useQueryClient();

  if (!data) return <div>No hay datos disponibles.</div>;

  const proveedor = data.proveedor?.nombre
    ? `${data.proveedor.nombre} ${data.proveedor.nombre}`
    : data.proveedor?.nombre || "Sin proveedor";

  const hanldleRealizarPago = async (dataId) => {
    try {
      const response = await axiosInstance.put(
        `/cuentasPorPagar/pagarCuota/${dataId}`,
        {}
      );

      if (response.data.success) {
        ToastAlert("success", "Pago registrado con éxito");
        setAlertConfirmarPago(false);
        if (refetch) refetch();
        queryClient.invalidateQueries({ queryKey: ["cuentasPorPagar"] });
      } else {
        ToastAlert(
          "error",
          "Error al registrar el pago" + response.data.message
        );
      }
    } catch (error) {
      console.error("Error al realizar el pago:", error);
      ToastAlert("error", "Error de conexion");
    }
  };
  return (
    <div className="mb-3">
      {/* Cabecera principal */}
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body pb-2">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <h4 className="fw-bold mb-1">Proveedor</h4>
              <span className="text-secondary">{proveedor}</span>
            </div>
            <span
              className={`badge px-3 py-2 fs-6 ${
                data.estado === "pendiente"
                  ? "bg-warning text-dark"
                  : "bg-success text-white"
              }`}
              style={{ borderRadius: "20px" }}
            >
              {data.estado.charAt(0).toUpperCase() + data.estado.slice(1)}
            </span>
          </div>
          <div className="row g-3 mb-2">
            <div className="col-md-3">
              <div className="bg-light border rounded p-3 h-100 d-flex flex-column align-items-start">
                <span className="mb-1">
                  <FileText size={20} className="me-1 text-danger" />
                  Monto Total
                </span>
                <span className="fs-4 fw-bold ">S/. {data.monto}</span>
              </div>
            </div>
            <div className="col-md-3">
              <div className=" border bg-opacity-10 rounded p-3 h-100 d-flex flex-column align-items-start">
                <span className="mb-1">
                  <CheckCircle2 size={20} className="me-1 text-danger" /> Monto
                  Pagado
                </span>
                <span className="fs-4 fw-bold ">S/. {data.monto_pagado}</span>
              </div>
            </div>
            <div className="col-md-3">
              <div className="border bg-opacity-10 rounded p-3 h-100 d-flex flex-column align-items-start">
                <span className="mb-1 ">
                  <CalendarDays size={20} className="me-1 text-danger" /> Fecha
                  de Inicio
                </span>
                <span className="fs-5 fw-bold ">
                  {data.fecha_inicio || "No disponible"}
                </span>
              </div>
            </div>
            <div className="col-md-3">
              <div className="bg-danger border bg-opacity-10 rounded p-3 h-100 d-flex flex-column align-items-start">
                <span className="mb-1 text-danger fw-bold">
                  <CalendarCheck size={20} className="me-1" /> Fecha de Fin
                </span>
                <span className="fs-5 fw-bold text-danger">
                  {data.fecha_fin || "No disponible"}
                </span>
              </div>
            </div>
          </div>
          <div className="row g-3 mb-2">
            <div className="col-md-4">
              <div className=" border rounded p-3 h-100 d-flex flex-column align-items-left">
                <div className="d-flex gap-2">
                  <ListOrdered size={22} className="mb-1 t" />
                  <span>Cuotas Totales</span>
                </div>
                <span className="fs-4 fw-bold">{data.cuotas}</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className=" border rounded p-3 h-100 d-flex flex-column align-items-left">
                <div className="d-flex gap-2">
                  <CheckCircle2 size={22} className="mb-1 " />
                  <span>Cuotas Pagadas</span>
                </div>

                <span className="fs-4 fw-bold">{data.cuotas_pagadas}</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className=" border rounded p-3 h-100 d-flex flex-column align-items-left">
                <div className="d-flex gap-2">
                  <CalendarDays size={22} className="mb-1 " />
                  <span>Cuotas Restantes</span>
                </div>

                <span className="fs-4 fw-bold">
                  {data.cuotas - data.cuotas_pagadas}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de cuotas programadas */}
      <div className="card shadow-sm border  p-3">
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
              <tbody className="">
                {Array.isArray(data.cuotas_pagar) &&
                data.cuotas_pagar.length > 0 ? (
                  data.cuotas_pagar.map((cuota, idx) => (
                    <tr key={cuota.id}>
                      <td className="text-center ">
                        <span
                          className="badge rounded-circle bg-danger text-white fs-6"
                          style={{ width: 32, height: 32, lineHeight: "20px" }}
                        >
                          {cuota.cuotas}
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
                        <span className="fw-bold text-success">
                          S/. {cuota.monto}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge px-3 py-2 small ${
                            cuota.estado === "pagado"
                              ? "bg-success text-white"
                              : "bg-warning text-dark"
                          }`}
                          style={{ borderRadius: "20px" }}
                        >
                          {cuota.estado.charAt(0).toUpperCase() +
                            cuota.estado.slice(1)}
                        </span>
                      </td>
                      <td>{cuota.fecha_pagada ? cuota.fecha_pagada : "-"}</td>
                      <td>
                        {cuota.estado === "pagado" ? (
                          <button className="btn btn-outline-success btn-sm fw-bold">
                            Ver Declarado
                          </button>
                        ) : (
                          <button
                            className="btn btn-danger btn-sm fw-bold"
                            onClick={() => {
                              setAlertConfirmarPago(true);
                              setDataPago(cuota);
                            }}
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

      <div className="card my-3">
        <button className="btn-guardar " style={{ width: "250px" }}>
          <FileDown className="text-auto" /> Descargar Detalles en PDF
        </button>
      </div>

      <ModalGeneral
        show={alertConfirmarPago}
        handleCloseModal={() => setAlertConfirmarPago(false)}
        mensaje={"¿Está seguro de que desea registrar el pago de esta cuota?"}
        handleAccion={() => hanldleRealizarPago(dataPago.id)}
        idProceso={dataPago.id}
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
