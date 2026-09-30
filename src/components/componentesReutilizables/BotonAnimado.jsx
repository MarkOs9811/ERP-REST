import { CheckCheck } from "lucide-react";
import "../../css/EstiloBotonMotion.css";

const BotonAnimado = ({
  children,
  type = "button",
  loading = false,
  disabled = false, // 1. Extraemos disabled explícitamente
  onClick,
  className = "w-auto ms-auto btn btn-motion-theme",
  icon = <CheckCheck className="text-auto" width="20px" height="20px" />,
  ...props
}) => {
  // 2. Unificamos la condición de inactividad (por carga o por lógica de negocio)
  const isBtnDisabled = loading || disabled;

  const clasesBase = `${className} fw-btn-base p-2 d-inline-flex align-items-center justify-content-center gap-2`;

  // 3. Aplicamos la opacidad y bloqueamos eventos del puntero a nivel CSS
  const clasesFinal = isBtnDisabled
    ? `${clasesBase} opacity-50 pe-none`
    : clasesBase;

  // 4. Bloqueo estricto de la función manejadora
  const handleClick = (e) => {
    if (isBtnDisabled) {
      e.preventDefault();
      return; // Corta la ejecución inmediatamente
    }
    if (onClick) onClick(e);
  };

  return (
    <button
      className={clasesFinal}
      type={type}
      onClick={type === "button" ? handleClick : undefined}
      disabled={isBtnDisabled} // 5. Bloqueo nativo HTML
      {...props}
    >
      {loading ? (
        <div className="d-flex align-items-center justify-content-center">
          <div
            className="spinner-border spinner-border-sm text-auto"
            role="status"
            style={{
              width: "1.2rem",
              height: "1.2rem",
              borderWidth: "0.15em",
            }}
          >
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        icon
      )}
      {children}
    </button>
  );
};

export default BotonAnimado;
