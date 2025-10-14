import { CheckCheck } from "lucide-react";

const BotonAnimado = ({
  children,
  type = "button",
  loading = false,
  error = null,
  onClick,
  className = "btn-realizarPedido w-auto h-100 p-3 ms-auto",
  icon = (
    <CheckCheck className="text-auto text-white" width="20px" height="20px" />
  ),
  ...props
}) => {
  return (
    <button
      className={`${className} d-flex align-items-center justify-content-center gap-2`}
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
              borderWidth: "0.15em", // Hace el spinner más delgado
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
