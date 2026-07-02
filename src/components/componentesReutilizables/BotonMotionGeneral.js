import { motion } from "framer-motion";
import "../../css/EstiloBotonMotion.css";

export function BotonMotionGeneral({
  text = "Botón",
  icon = null,
  onClick = () => {},
  loading = false,
  loadingText = "Cargando...",
  classDefault = "btn btn-motion-theme py-2 px-3",
  fullWidth = false, // Prop para controlar si ocupa el 100%
}) {
  const whileHover = loading ? {} : { y: -1 };

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
        className={`${classDefault} d-inline-flex align-items-center justify-content-center ${
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
              <span className="d-flex align-items-center flex-shrink-0 mx-2">
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
