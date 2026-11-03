import React from "react";
import { capitalizeFirstLetter } from "../../../hooks/FirstLetterUp";
import {
  Box,
  FileAxis3D,
  Info,
  CalendarDays,
  CircleAlert,
  UserRoundIcon,
} from "lucide-react";
import { BadgeComponent } from "../../componentesReutilizables/BadgeComponent";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


export function ModalDetallesSolicitud({ data }) {
  if (!data) return null;

  const estadoResuelto = data?.estado === 1;

  return (
    <div className="solicitud-detalle-wrap container-fluid p-3 p-md-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-6">
          <Card className="border h-full solicitud-detalle-card">
            <CardHeader className="solicitud-detalle-card-header">
              <p className="h6 mt-1 mb-0 d-flex align-items-center gap-2">
                <FileAxis3D className="text-auto me-2" />
                Información General
              </p>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center gap-1">
              <span className="solicitud-avatar-icon">
                <UserRoundIcon
                  className="text-auto"
                  height="36px"
                  width="36px"
                />
              </span>
              <span id="detalleSolicitante" className="mt-2">
                {capitalizeFirstLetter(data?.nombre_solicitante)}
              </span>
              <small id="detalleCorreo" className="text-muted mt-1">
                {data?.usuario?.empleado?.persona?.correo}
              </small>
              <BadgeComponent
                id="detalleArea"
                className="mt-2"
                label={capitalizeFirstLetter(data?.area?.nombre || "Sin área")}
                variant="primary"
              />
              <small id="detalleCelular" className="text-muted mt-2">
                {data?.celular}
              </small>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-6">
          <Card className="border h-full solicitud-detalle-card">
            <CardHeader className="solicitud-detalle-card-header">
              <p className="h6 mt-1 mb-0 d-flex align-items-center gap-2">
                <Box className="text-auto me-2" /> Detalles del Producto
              </p>
            </CardHeader>
            <CardContent className="solicitud-info-list">
              <p>
                <strong>Producto:</strong>{" "}
                <span id="detalleProducto">{data?.nombre_producto}</span>
              </p>
              <p>
                <strong>Marca:</strong>{" "}
                <span id="detalleMarca">{data?.marcaProd}</span>
              </p>
              <p>
                <strong>Descripción:</strong>{" "}
                <span id="detalleDescripcion">{data?.descripcion}</span>
              </p>
              <p>
                <strong>Cantidad:</strong>{" "}
                <span id="detalleCantidad">{data?.cantidad}</span>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-12">
          <Card className="border h-full solicitud-detalle-card">
            <CardHeader className="solicitud-detalle-card-header">
              <p className="h6 mt-1 mb-0 d-flex align-items-center gap-2">
                <Info className="text-auto me-2" /> Información Adicional
              </p>
            </CardHeader>
            <CardContent className="solicitud-info-list">
              <p>
                <strong>Motivo:</strong>{" "}
                <span id="detalleMotivo">{data?.motivo || "-"}</span>
              </p>
              <p>
                <strong>Uso previsto:</strong>{" "}
                <span id="detalleUsoPrevisto">{data?.uso_previsto || "-"}</span>
              </p>
              <p>
                <strong>Prioridad:</strong>{" "}
                <span id="detallePrioridad">
                  {capitalizeFirstLetter(data?.prioridad || "media")}
                </span>
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                <span id="detalleEstado">
                  {estadoResuelto ? (
                    <BadgeComponent label="Atendido" variant="success" />
                  ) : (
                    <BadgeComponent
                      label="Pendiente"
                      variant="warning"
                      icon={<CircleAlert size={14} />}
                    />
                  )}
                </span>
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                <span
                  id="fechaSolicitud"
                  className="d-inline-flex align-items-center gap-2"
                >
                  <CalendarDays size={14} />
                  {data?.fecha_solicitud || data?.created_at || "-"}
                </span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
