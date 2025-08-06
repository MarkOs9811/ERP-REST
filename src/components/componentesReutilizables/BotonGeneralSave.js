import { useState } from "react";

export function BotonGeneralSave({
  onClick,
  children,
  loadingText = "Procesando...",
  className = "btn-outline-dark text-auto",
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
      className={`btn d-flex align-items-center justify-content-center ${
        bloqueado ? "btn-secondary disabled" : className
      }`}
      onClick={handleClick}
      disabled={bloqueado || disabled}
      style={{ minHeight: "38px", minWidth: "180px" }} // asegúrate de que haya espacio para el spinner
    >
      {bloqueado ? (
        <>
          <div
            className="spinner-border spinner-border-sm me-2 text-light"
            role="status"
            aria-hidden="true"
            style={{ width: "1rem", height: "1rem" }}
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
