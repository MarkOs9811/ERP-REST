import React, { isValidElement, cloneElement } from "react";
import "../../css/EstilosBadge.css";

const variantes = {
  success: "badge-soft-success",
  warning: "badge-soft-warning",
  danger: "badge-soft-danger",
  info: "badge-soft-info",
  primary: "badge-soft-primary",
  secondary: "badge-soft-secondary",
};

const estadoColorMap = {
  // CLAVES EN MAYÚSCULAS (Para buscar el color internamente)
  PAGADO: "success",
  ACTIVO: "success",
  COMPLETADO: "success",
  APROBADO: "success",
  VALIDADO: "success",
  TRABAJADO: "success",

  PENDIENTE: "warning",
  "EN PROCESO": "warning",
  REVISIÓN: "warning",
  ESPERA: "warning",

  INACTIVO: "danger",
  ELIMINADO: "danger",
  RECHAZADO: "danger",
  CANCELADO: "danger",
  ERROR: "danger",

  BORRADOR: "secondary",
  ANULADO: "secondary",
  "N/A": "secondary",
};

export const BadgeComponent = ({
  label,
  variant = null,
  icon,
  className = "",
}) => {
  let claseColor = variantes.secondary;

  // 1. Lógica para determinar el COLOR
  if (variant && variantes[variant]) {
    claseColor = variantes[variant];
  } else if (label) {
    const estadoBusqueda = String(label).toUpperCase().trim();
    const varianteEncontrada = estadoColorMap[estadoBusqueda];
    if (varianteEncontrada) {
      claseColor = variantes[varianteEncontrada];
    }
  }

  if (!label) return null;

  // 2. Lógica para el TEXTO VISIBLE (Primera Mayúscula)
  const textoOriginal = String(label);
  const textoFormateado =
    textoOriginal.charAt(0).toUpperCase() +
    textoOriginal.slice(1).toLowerCase();

  return (
    <span
      className={`badge-custom ${claseColor} ${className} d-inline-flex align-items-center gap-1 small`}
    >
      {/* Ícono dinámico */}
      {isValidElement(icon)
        ? cloneElement(icon, { size: 14, strokeWidth: 2.5 })
        : icon}

      {/* Texto centrado */}
      <span style={{ position: "relative", top: "0.5px" }}>
        {textoFormateado}
      </span>
    </span>
  );
};
