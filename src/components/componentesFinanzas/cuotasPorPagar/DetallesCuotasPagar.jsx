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
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
        {},
      );

      if (response.data.success) {
        ToastAlert("success", "Pago registrado con éxito");
        setAlertConfirmarPago(false);
        if (refetch) refetch();
        queryClient.invalidateQueries({ queryKey: ["cuentasPorPagar"] });
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

  const descargarDetalles = async (dataId) => {
    try {
      const response = await axiosInstance.get(
        `/cuentasPorPagar/descargarDetalles/${dataId}`,
        {
          responseType: "blob", // Indica que la respuesta será un archivo binario
        },
      );
      // Crear un enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `detalles_cuenta_pagar_${dataId}.pdf`);
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
    <div className="p-3">
      {/* Cabecera principal */}
      <Card className="shadow-sm mb-4 border-0">
        <CardContent className="pb-2">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h4 className="font-bold mb-1">Proveedor</h4>
              <span className="text-muted-foreground">{proveedor}</span>
            </div>
            <span
              className={`inline-flex items-center rounded-full font-semibold transition-colors px-3 py-2 text-base ${
                data.estado === "pendiente"
                  ? "bg-amber-500 text-foreground"
                  : "bg-emerald-600 text-white"
              }`}
              style={{ borderRadius: "20px" }}
            >
              {data.estado.charAt(0).toUpperCase() + data.estado.slice(1)}
            </span>
          </div>
          <div className="grid grid-cols-12 gap-3 mb-2">
            <div className="col-span-full md:col-span-3">
              <div className="bg-muted rounded p-3 h-full flex flex-col items-start">
                <span className="mb-1">
                  <FileText size={20} className="me-1 text-destructive" />
                  Monto Total
                </span>
                <span className="text-xl font-bold">S/. {data.monto}</span>
              </div>
            </div>
            <div className="col-span-full md:col-span-3">
              <div className="border rounded p-3 h-full flex flex-col items-start">
                <span className="mb-1">
                  <CheckCircle2 size={20} className="me-1 text-destructive" />{" "}
                  Monto Pagado
                </span>
                <span className="text-xl font-bold">
                  S/. {data.monto_pagado}
                </span>
              </div>
            </div>
            <div className="col-span-full md:col-span-3">
              <div className="border rounded p-3 h-full flex flex-col items-start">
                <span className="mb-1">
                  <CalendarDays size={20} className="me-1 text-destructive" />{" "}
                  Fecha de Inicio
                </span>
                <span className="text-lg font-bold">
                  {data.fecha_inicio || "No disponible"}
                </span>
              </div>
            </div>
            <div className="col-span-full md:col-span-3">
              <div className="bg-destructive/10 rounded p-3 h-full flex flex-col items-start">
                <span className="mb-1 text-destructive font-bold">
                  <CalendarCheck size={20} className="me-1" /> Fecha de Fin
                </span>
                <span className="text-lg font-bold text-destructive">
                  {data.fecha_fin || "No disponible"}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-3 mb-2">
            <div className="col-span-full md:col-span-4">
              <div className="border rounded p-3 h-full flex flex-col items-start">
                <div className="flex gap-2">
                  <ListOrdered size={22} className="mb-1 t" />
                  <span>Cuotas Totales</span>
                </div>
                <span className="text-xl font-bold">{data.cuotas}</span>
              </div>
            </div>
            <div className="col-span-full md:col-span-4">
              <div className="border rounded p-3 h-full flex flex-col items-start">
                <div className="flex gap-2">
                  <CheckCircle2 size={22} className="mb-1" />
                  <span>Cuotas Pagadas</span>
                </div>

                <span className="text-xl font-bold">{data.cuotas_pagadas}</span>
              </div>
            </div>
            <div className="col-span-full md:col-span-4">
              <div className="border rounded p-3 h-full flex flex-col items-start">
                <div className="flex gap-2">
                  <CalendarDays size={22} className="mb-1" />
                  <span>Cuotas Restantes</span>
                </div>

                <span className="text-xl font-bold">
                  {data.cuotas - data.cuotas_pagadas}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de cuotas programadas */}
      <Card className="shadow-sm p-3">
        <CardHeader className="rounded-t">
          <CalendarDays size={20} className="mb-1 me-2" />
          <span className="font-bold text-lg">Cuotas Programadas</span>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <table className="w-full caption-bottom text-sm align-middle mb-0">
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
                      <td className="text-center">
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 font-semibold transition-colors rounded-full bg-destructive text-white text-base"
                          style={{ width: 32, height: 32, lineHeight: "20px" }}
                        >
                          {cuota.cuotas}
                        </span>
                      </td>
                      <td>
                        <CalendarDays
                          size={16}
                          className="mb-1 me-1 text-muted-foreground"
                        />
                        {cuota.fecha_pago}
                      </td>
                      <td>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          S/. {cuota.monto}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`inline-flex items-center rounded-full font-semibold transition-colors px-3 py-2 text-sm ${
                            cuota.estado === "pagado"
                              ? "bg-emerald-600 text-white"
                              : "bg-amber-500 text-foreground"
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
                          <Button
                            className="shadow border-emerald-600 bg-background text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 text-xs font-bold"
                            variant="default"
                          >
                            Ver Declarado
                          </Button>
                        ) : (
                          <Button
                            className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 text-xs font-bold"
                            onClick={() => {
                              setAlertConfirmarPago(true);
                              setDataPago(cuota);
                            }}
                            variant="destructive"
                          >
                            Registrar Pago
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center text-muted-foreground"
                    >
                      No hay cuotas registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="my-3 p-3">
        <Button
          type="button"
          className="btn-guardar"
          style={{ width: "250px" }}
          onClick={() => descargarDetalles(data.id)}
          variant="default"
        >
          <FileDown className="text-auto" /> Descargar Detalles
        </Button>
      </Card>

      <ModalGeneral
        show={alertConfirmarPago}
        handleCloseModal={() => setAlertConfirmarPago(false)}
        mensaje={"¿Está seguro de que desea registrar el pago de esta cuota?"}
        handleAccion={() => hanldleRealizarPago(dataPago.id)}
        idProceso={dataPago.id}
      >
        <Card className="border m-3 text-left">
          {dataPago ? (
            <div className="p-3 text-left">
              <h5 className="font-bold mb-3">Detalles del Pago</h5>
              <p>
                <strong>Cuota N°:</strong> {dataPago.numero_cuota}
              </p>
              <p>
                <strong>Monto:</strong> S/. {dataPago.monto}
              </p>
              <p>
                <strong>Fecha de Pago Programada:</strong> {dataPago.fecha_pago}
              </p>
              <p className="text-destructive">
                <strong>Estado:</strong>{" "}
                {dataPago.estado
                  ? dataPago.estado.charAt(0).toUpperCase() +
                    dataPago.estado.slice(1)
                  : "Sin estado"}
              </p>
            </div>
          ) : null}
        </Card>
      </ModalGeneral>
    </div>
  );
}
