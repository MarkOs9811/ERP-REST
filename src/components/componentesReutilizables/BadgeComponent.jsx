import { cloneElement, isValidElement } from "react";
import { Badge } from "../ui/badge";
import { cn } from "cn";

const variantes = {
  success: {
    variant: "outline",
    className:
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    dotClass: "bg-emerald-500",
  },
  warning: {
    variant: "outline",
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300",
    dotClass: "bg-amber-500",
  },
  danger: {
    variant: "destructive",
    className: "border border-rose-500/25",
    dotClass: "bg-rose-500",
  },
  info: {
    variant: "outline",
    className:
      "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300",
    dotClass: "bg-sky-500",
  },
  primary: {
    variant: "outline",
    className: "border-primary/20 bg-primary/10 text-primary",
    dotClass: "bg-primary",
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
  const isStatusBadge = variantName !== "secondary";

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
      className={cn(
        "!h-auto min-h-5 gap-1.5 rounded-full px-2.5 py-1 font-medium",
        selectedVariant.className,
        isClickable && "cursor-pointer",
        className,
      )}
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
        {isStatusBadge && (
          <span
            aria-hidden="true"
            className={`size-1.5 shrink-0 rounded-full ${selectedVariant.dotClass} ${
              variantName === "warning" ? "animate-pulse" : ""
            }`}
          />
        )}
        {isValidElement(icon)
        ? cloneElement(icon, { size: 14, strokeWidth: 2.5 })
        : icon}
      <span>{textoFormateado}</span>
    </Badge>
  );
};
