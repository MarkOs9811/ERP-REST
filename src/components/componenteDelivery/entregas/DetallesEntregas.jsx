import React from "react";
import {
  User,
  Bike,
  MapPin,
  CreditCard,
  Package,
  UserCheck,
  CheckCircle,
  Zap,
  Truck,
  Coins,
} from "lucide-react";
import { BadgeComponent } from "../../componentesReutilizables/BadgeComponent";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function DetallesEntregas({ dataVentas }) {
  // Validación de seguridad por si la data llega vacía
  if (!dataVentas) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No se encontró información del pedido.
      </div>
    );
  }

  // --- CONFIGURACIÓN DE BADGE REUTILIZABLE PARA EL ESTADO ---
  let estadoTexto = "Desconocido";
  let colorVariante = "secondary";
  let IconoBadge = <Package size={16} />;

  if (dataVentas.estado_pedido === 54) {
    estadoTexto = "Asignado";
    colorVariante = "warning";
    IconoBadge = <UserCheck size={16} />;
  } else if (dataVentas.estado_pedido === 55) {
    estadoTexto = "En ruta";
    colorVariante = "primary";
    IconoBadge = <Bike size={16} />;
  } else if (dataVentas.estado_pedido === 6) {
    estadoTexto = "Entregado";
    colorVariante = "success";
    IconoBadge = <CheckCircle size={16} />;
  }

  // Validar si hay repartidor
  const nombreRepartidor = dataVentas.conductor?.empleado?.persona
    ? `${dataVentas.conductor.empleado.persona.nombre} ${dataVentas.conductor.empleado.persona.apellidos}`
    : "Sin Repartidor Asignado";

  // Extraer los productos de forma segura (soporta camelCase o snake_case según como lo serialice Laravel)
  const detallesProductos =
    dataVentas.detallesPedido || dataVentas.detalles_pedido || [];

  return (
    <Card className="border-0 rounded-none bg-transparent">
      {/* HEADER */}
      <CardHeader className="border-b flex justify-between items-center py-3">
        <h5 className="mb-0 font-bold flex items-center text-muted-foreground">
          <Package size={20} className="me-2 text-foreground" />
          Pedido #{dataVentas.codigo_pedido || dataVentas.id}
        </h5>
        {/* USANDO TU COMPONENTE BADGE REUTILIZABLE */}
        <BadgeComponent
          label={estadoTexto}
          variant={colorVariante}
          icon={IconoBadge}
        />
      </CardHeader>

      {/* BODY */}
      <CardContent className="">
        <div className="grid grid-cols-12 gap-4">
          {/* Columna Izquierda: Cliente */}
          <div className="col-span-full md:col-span-6">
            <h6
              className="uppercase mb-3"
              style={{ fontSize: "0.80rem", letterSpacing: "1px" }}
            >
              Datos del Cliente
            </h6>
            <div className="flex items-center mb-2">
              <User size={18} className="me-2 text-muted-foreground" />
              <span className="font-semibold">{dataVentas.nombre_cliente}</span>
            </div>
            <div className="flex items-start text-muted-foreground">
              <MapPin size={18} className="me-2 mt-1 shrink-0" />
              <span style={{ fontSize: "0.95rem" }}>
                {dataVentas.direccion
                  ? `${dataVentas.direccion.calle} #${dataVentas.direccion.numero} ${dataVentas.direccion.detalles || ""}`
                  : "Dirección no especificada por el cliente"}
              </span>
            </div>
          </div>

          {/* Columna Derecha: Repartidor y Pago */}
          <div className="col-span-full md:col-span-6">
            <h6
              className="uppercase mb-3"
              style={{ fontSize: "0.80rem", letterSpacing: "1px" }}
            >
              Logística y Pago
            </h6>

            {/* Repartidor */}
            <div className="flex items-center mb-2">
              <Bike size={18} className="me-2 text-muted-foreground" />
              <span className="capitalize" style={{ fontSize: "0.95rem" }}>
                {nombreRepartidor}
              </span>
            </div>

            {/* Prioridad de Entrega */}
            <div className="flex items-center mb-2">
              <Zap size={18} className="me-2" />
              <span style={{ fontSize: "0.95rem" }}>Prioridad: </span>
              <strong
                className={`ms-2 capitalize ${
                  dataVentas.prioridad?.toLowerCase() === "alta"
                    ? "text-destructive"
                    : "text-foreground"
                }`}
              >
                {dataVentas.prioridad ? "No" : "Si" || "Normal"}
              </strong>
            </div>

            {/* Estado de Pago */}
            <div className="flex items-center mb-2">
              <CreditCard size={18} className="me-2 text-muted-foreground" />
              <span style={{ fontSize: "0.95rem" }}>Estado de pago: </span>
              <strong
                className={`ms-2 capitalize ${
                  dataVentas.estado_pago === "pagado"
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-destructive"
                }`}
              >
                {dataVentas.estado_pago}
              </strong>
            </div>

            {/* Propina */}
            <div className="flex items-center mb-2">
              <Coins size={18} className="me-2 text-muted-foreground" />
              <span style={{ fontSize: "0.95rem" }}>Propina: </span>
              <strong className="ms-2 text-emerald-600 dark:text-emerald-400">
                S/ {Number(dataVentas.propina || 0).toFixed(2)}
              </strong>
            </div>
            {/* Costo de Envío */}
            <div className="flex items-center">
              <Truck size={18} className="me-2 text-muted-foreground" />
              <span style={{ fontSize: "0.95rem" }}>Costo de envío: </span>
              <strong className="ms-2">
                S/ {Number(dataVentas.costo_envio || 0).toFixed(2)}
              </strong>
            </div>
          </div>
        </div>

        <hr className="my-4 text-muted-foreground" />

        {/* SECCIÓN DE PRODUCTOS */}
        <h6
          className="uppercase mb-3"
          style={{ fontSize: "0.80rem", letterSpacing: "1px" }}
        >
          Resumen de Platos
        </h6>

        <div className="flex flex-col divide-y-0 rounded mb-3">
          {detallesProductos.length > 0 ? (
            detallesProductos.map((item, index) => (
              <div
                key={item.id || index}
                className="relative border-b bg-background text-foreground flex justify-between items-center p-3"
              >
                <div className="flex items-start gap-3">
                  {/* Badge para la cantidad */}
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold transition-colors bg-primary rounded-full mt-1"
                    style={{ width: "35px" }}
                  >
                    {item.cantidad}x
                  </span>

                  <div>
                    {/* Nombre del plato (usamos 'producto' o validamos la relación 'plato') */}
                    <h6 className="mb-1 font-bold text-foreground">
                      {item.producto?.nombre ||
                        item.plato?.nombre ||
                        "Plato sin nombre"}
                    </h6>
                    {/* Si el cliente dejó una nota especial para el plato, la mostramos */}
                    {item.nota && (
                      <small className="text-muted-foreground italic block">
                        Nota: {item.nota}
                      </small>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  {/* Subtotal por ese producto */}
                  <span className="block font-semibold text-foreground">
                    S/{" "}
                    {(Number(item.cantidad) * Number(item.precio)).toFixed(2)}
                  </span>
                  {/* Precio Unitario */}
                  <small
                    className="text-muted-foreground"
                    style={{ fontSize: "0.75rem" }}
                  >
                    S/ {Number(item.precio).toFixed(2)} c/u
                  </small>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-muted-foreground">
              <Package size={32} className="mb-2 opacity-50" />
              <p className="mb-0">No hay platos registrados en este pedido.</p>
            </div>
          )}
        </div>
      </CardContent>

      {/* FOOTER: Total del pedido */}
      <CardFooter className="bg-muted border-t flex justify-between items-center p-4">
        <span
          className="font-bold uppercase"
          style={{ fontSize: "0.9rem", letterSpacing: "1px" }}
        >
          Total a Cobrar
        </span>
        <h3 className="mb-0 font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
          S/ {Number(dataVentas.total).toFixed(2)}
        </h3>
      </CardFooter>
    </Card>
  );
}
