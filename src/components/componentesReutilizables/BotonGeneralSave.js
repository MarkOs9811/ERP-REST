import { useState } from "react";
import "../../css/EstiloBotonMotion.css";

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
    <button
      type="button"
      className={`fw-btn-base d-inline-flex align-items-center justify-content-center fw-btn-min ${
        bloqueado ? "btn btn-motion-theme disabled opacity-75" : className
      }`}
      onClick={handleClick}
      disabled={bloqueado || disabled}
    >
      {bloqueado ? (
        <>
          <div
            className="spinner-border spinner-border-sm me-2"
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
    </button>
  );
}
