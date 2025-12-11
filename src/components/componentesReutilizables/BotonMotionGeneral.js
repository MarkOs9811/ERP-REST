import { motion } from "framer-motion";
import "../../css/EstiloBotonMotion.css";

export function BotonMotionGeneral({
  text = "Botón",
  icon = null,
  onClick = () => {},
  loading = false,
  loadingText = "Cargando...",
  // Volvemos a un default que funcione bien en general, pero permitimos override
  classDefault = "btn shadow-sm rounded-3 py-2 px-3",
  fullWidth = false, // Prop para controlar si ocupa el 100%
}) {
  const whileHover = loading
    ? {}
    : { y: -2, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)" };

  const whileTap = loading ? {} : { scale: 0.97 };

  return (
    <div>
      <motion.button
        whileHover={whileHover}
        whileTap={whileTap}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        onClick={onClick}
        disabled={loading}
        // Combinamos clases:
        // 1. classDefault (estilos bootstrap básicos)
        // 2. btn-motion-theme (nuestros colores y lógica de texto)
        // 3. w-100 (si fullWidth es true)
        className={`${classDefault} btn-motion-theme ${
          fullWidth ? "w-100" : ""
        } ${loading ? "opacity-75" : ""}`}
      >
        {loading ? (
          <>
            <span
              className="spinner-border spinner-border-sm flex-shrink-0"
              role="status"
              aria-hidden="true"
            ></span>
            {/* Ocultamos texto de carga en espacios muy pequeños */}
            <span className="ms-2 d-none d-sm-inline text-truncate">
              {loadingText}
            </span>
          </>
        ) : (
          <>
            {/* Icono: flex-shrink-0 evita que se aplaste */}
            {icon && (
              <span className="d-flex align-items-center flex-shrink-0">
                {icon}
              </span>
            )}

            {/* Texto: text-truncate asegura que ponga "..." si no cabe */}
            <span className="text-truncate">{text}</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
