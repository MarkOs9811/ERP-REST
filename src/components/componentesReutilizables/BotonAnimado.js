import { CheckCheck } from "lucide-react";

const BotonAnimado = ({
  children,
  type = "button",
  loading = false,
  error = null,
  onClick,
  className = "btn-realizarPedido w-auto h-100 p-3 ms-auto",
  icon = <CheckCheck className="text-auto" width="20px" height="20px" />,
  ...props
}) => {
  const clasesBase = `${className} d-flex align-items-center justify-content-center gap-2 transition-all`;

  // 🔹 Agrega estilos visuales cuando está cargando o deshabilitado
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
      style={{
        cursor: loading ? "not-allowed" : "pointer",
        filter: loading ? "grayscale(60%) brightness(90%)" : "none",
        transition: "all 0.3s ease",
      }}
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
