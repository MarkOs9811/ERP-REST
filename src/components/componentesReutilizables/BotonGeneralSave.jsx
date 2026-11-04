import { useState } from "react";

import { Button } from "../ui/button";

export function BotonGeneralSave({
  onClick,
  children,
  loadingText = "Procesando...",
  className = "btn btn-motion-theme",
  icon = null,
  disabled = false,
}) {
  const [bloqueado, setBloqueado] = useState(false);

  const handleClick = async () => {
    if (bloqueado || disabled) return;

    try {
      setBloqueado(true);
      await onClick(); // Puede ser async o retornar una promesa
    } catch (error) {
      console.error("Error en acción async:", error);
    } finally {
      setBloqueado(false);
    }
  };

  return (
    <Button
      type="button"
      className={`fw-btn-base inline-flex items-center justify-center fw-btn-min ${
        bloqueado
          ? "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 btn-motion-theme disabled opacity-75"
          : className
      }`}
      onClick={handleClick}
      disabled={bloqueado || disabled}
      variant="default"
    >
      {bloqueado ? (
        <>
          <div
            className="inline-block animate-spin rounded-full border-current border-r-transparent size-4 me-2"
            role="status"
            aria-hidden="true"
          ></div>
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          {icon && <span className="me-2">{icon}</span>}
          {children}
        </>
      )}
    </Button>
  );
}
