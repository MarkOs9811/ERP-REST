import { CheckCheck } from "lucide-react";
import "../../css/EstiloBotonMotion.css";

const BotonAnimado = ({
  children,
  type = "button",
  loading = false,
  onClick,
  className = "w-auto ms-auto btn btn-motion-theme",
  icon = <CheckCheck className="text-auto" width="20px" height="20px" />,
  ...props
}) => {
  const clasesBase = `${className} fw-btn-base p-2 d-inline-flex align-items-center justify-content-center gap-2`;

  const clasesFinal = loading
    ? `${clasesBase} opacity-75 pointer-events-none`
    : clasesBase;

  return (
    <button
      className={clasesFinal}
      type={type}
      onClick={type === "button" ? onClick : undefined}
      disabled={loading}
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
