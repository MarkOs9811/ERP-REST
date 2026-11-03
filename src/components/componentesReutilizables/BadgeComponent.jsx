import { cloneElement, isValidElement } from "react";
import { Badge } from "../ui/badge";

const variantes = {
  success: {
    variant: "outline",
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  warning: {
    variant: "outline",
    className:
      "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  danger: {
    variant: "destructive",
    className: "",
  },
  info: {
    variant: "outline",
    className:
      "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400",
  },
  primary: {
    variant: "outline",
    className: "border-primary/20 bg-primary/10 text-primary",
  },
  secondary: {
    variant: "secondary",
    className: "",
  },
};

const estadoColorMap = {
  PAGADO: "success",
  LISTO: "success",
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
  clickable = false,
  onClick,
  ...props
}) => {
  if (!label) return null;

  const estadoBusqueda = String(label).toUpperCase().trim();
  const variantName =
    (variant && variantes[variant] && variant) ||
    estadoColorMap[estadoBusqueda] ||
    "secondary";
  const selectedVariant = variantes[variantName];

  const textoOriginal = String(label);
  const textoFormateado =
    textoOriginal === textoOriginal.toUpperCase()
      ? textoOriginal
      : textoOriginal.charAt(0).toUpperCase() +
        textoOriginal.slice(1).toLowerCase();

  const isClickable = clickable && typeof onClick === "function";

  return (
    <Badge
      {...props}
      variant={selectedVariant.variant}
      className={`!h-auto min-h-5 gap-1 ${selectedVariant.className} ${
        isClickable ? "cursor-pointer" : ""
      } ${className}`}
      onClick={isClickable ? onClick : undefined}
      onKeyDown={
        isClickable
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick(event);
              }
            }
          : undefined
      }
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {isValidElement(icon)
        ? cloneElement(icon, { size: 14, strokeWidth: 2.5 })
        : icon}
      <span>{textoFormateado}</span>
    </Badge>
  );
};
