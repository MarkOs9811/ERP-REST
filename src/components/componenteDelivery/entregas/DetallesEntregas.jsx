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

export function DetallesEntregas({ dataVentas }) {
  // Validación de seguridad por si la data llega vacía
  if (!dataVentas) {
    return (
      <div className="p-4 text-center text-muted">
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
    <div className="card border-0 rounded-0 bg-transparent">
      {/* HEADER */}
      <div className="card-header border-bottom d-flex justify-content-between align-items-center py-3">
        <h5 className="mb-0 fw-bold d-flex align-items-center text-secondary">
          <Package size={20} className="me-2 text-dark" />
          Pedido #{dataVentas.codigo_pedido || dataVentas.id}
        </h5>
        {/* USANDO TU COMPONENTE BADGE REUTILIZABLE */}
        <BadgeComponent
          label={estadoTexto}
          variant={colorVariante}
          icon={IconoBadge}
        />
      </div>

      {/* BODY */}
      <div className="card-body">
        <div className="row g-4">
          {/* Columna Izquierda: Cliente */}
          <div className="col-12 col-md-6">
            <h6
              className="text-muted text-uppercase mb-3"
              style={{ fontSize: "0.80rem", letterSpacing: "1px" }}
            >
              Datos del Cliente
            </h6>
            <div className="d-flex align-items-center mb-2">
              <User size={18} className="me-2 text-secondary" />
              <span className="fw-semibold">{dataVentas.nombre_cliente}</span>
            </div>
            <div className="d-flex align-items-start text-muted">
              <MapPin size={18} className="me-2 mt-1 flex-shrink-0" />
              <span style={{ fontSize: "0.95rem" }}>
                {dataVentas.direccion
                  ? `${dataVentas.direccion.calle} #${dataVentas.direccion.numero} ${dataVentas.direccion.detalles || ""}`
                  : "Dirección no especificada por el cliente"}
              </span>
            </div>
          </div>

          {/* Columna Derecha: Repartidor y Pago */}
          <div className="col-12 col-md-6">
            <h6
              className="text-muted text-uppercase mb-3"
              style={{ fontSize: "0.80rem", letterSpacing: "1px" }}
            >
              Logística y Pago
            </h6>

            {/* Repartidor */}
            <div className="d-flex align-items-center mb-2">
              <Bike size={18} className="me-2 text-secondary" />
              <span className="text-capitalize" style={{ fontSize: "0.95rem" }}>
                {nombreRepartidor}
              </span>
            </div>

            {/* Prioridad de Entrega */}
            <div className="d-flex align-items-center mb-2">
              <Zap size={18} className="me-2" />
              <span style={{ fontSize: "0.95rem" }}>Prioridad: </span>
              <strong
                className={`ms-2 text-capitalize ${
                  dataVentas.prioridad?.toLowerCase() === "alta"
                    ? "text-danger"
                    : "text-dark"
                }`}
              >
                {dataVentas.prioridad ? "No" : "Si" || "Normal"}
              </strong>
            </div>

            {/* Estado de Pago */}
            <div className="d-flex align-items-center mb-2">
              <CreditCard size={18} className="me-2 text-secondary" />
              <span style={{ fontSize: "0.95rem" }}>Estado de pago: </span>
              <strong
                className={`ms-2 text-capitalize ${
                  dataVentas.estado_pago === "pagado"
                    ? "text-success"
                    : "text-danger"
                }`}
              >
                {dataVentas.estado_pago}
              </strong>
            </div>

            {/* Propina */}
            <div className="d-flex align-items-center mb-2">
              <Coins size={18} className="me-2 text-secondary" />
              <span style={{ fontSize: "0.95rem" }}>Propina: </span>
              <strong className="ms-2 text-success">
                S/ {Number(dataVentas.propina || 0).toFixed(2)}
              </strong>
            </div>
            {/* Costo de Envío */}
            <div className="d-flex align-items-center ">
              <Truck size={18} className="me-2 text-secondary" />
              <span style={{ fontSize: "0.95rem" }}>Costo de envío: </span>
              <strong className="ms-2">
                S/ {Number(dataVentas.costo_envio || 0).toFixed(2)}
              </strong>
            </div>
          </div>
        </div>

        <hr className="my-4 text-muted" />

        {/* SECCIÓN DE PRODUCTOS */}
        <h6
          className="text-muted text-uppercase mb-3"
          style={{ fontSize: "0.80rem", letterSpacing: "1px" }}
        >
          Resumen de Platos
        </h6>

        <div className="list-group list-group-flush border rounded mb-3">
          {detallesProductos.length > 0 ? (
            detallesProductos.map((item, index) => (
              <div
                key={item.id || index}
                className="list-group-item d-flex justify-content-between align-items-center p-3"
              >
                <div className="d-flex align-items-start gap-3">
                  {/* Badge para la cantidad */}
                  <span
                    className="badge bg-primary rounded-pill mt-1"
                    style={{ width: "35px" }}
                  >
                    {item.cantidad}x
                  </span>

                  <div>
                    {/* Nombre del plato (usamos 'producto' o validamos la relación 'plato') */}
                    <h6 className="mb-1 fw-bold text-dark">
                      {item.producto?.nombre ||
                        item.plato?.nombre ||
                        "Plato sin nombre"}
                    </h6>
                    {/* Si el cliente dejó una nota especial para el plato, la mostramos */}
                    {item.nota && (
                      <small className="text-muted fst-italic d-block">
                        Nota: {item.nota}
                      </small>
                    )}
                  </div>
                </div>

                <div className="text-end">
                  {/* Subtotal por ese producto */}
                  <span className="d-block fw-semibold text-dark">
                    S/{" "}
                    {(Number(item.cantidad) * Number(item.precio)).toFixed(2)}
                  </span>
                  {/* Precio Unitario */}
                  <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                    S/ {Number(item.precio).toFixed(2)} c/u
                  </small>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-muted">
              <Package size={32} className="mb-2 opacity-50" />
              <p className="mb-0">No hay platos registrados en este pedido.</p>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER: Total del pedido */}
      <div className="card-footer bg-light border-top d-flex justify-content-between align-items-center p-4">
        <span
          className="fw-bold text-muted text-uppercase"
          style={{ fontSize: "0.9rem", letterSpacing: "1px" }}
        >
          Total a Cobrar
        </span>
        <h3 className="mb-0 fw-bold text-success d-flex align-items-center">
          S/ {Number(dataVentas.total).toFixed(2)}
        </h3>
      </div>
    </div>
  );
}
