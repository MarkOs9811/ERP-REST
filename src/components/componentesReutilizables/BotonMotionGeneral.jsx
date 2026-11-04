import { motion } from "framer-motion";


export function BotonMotionGeneral({
  text = "Botón",
  icon = null,
  onClick = () => {},
  loading = false,
  loadingText = "Cargando...",
  classDefault = "btn-principal  py-2 px-3",
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
        className={`${classDefault} inline-flex items-center justify-center ${
          fullWidth ? "w-full" : ""
        }${loading ? "opacity-75" : ""}`}
      >
        {loading ? (
          <>
            <span
              className="inline-block animate-spin rounded-full border-current border-r-transparent size-4 shrink-0"
              role="status"
              aria-hidden="true"
            ></span>
            {/* Ocultamos texto de carga en espacios muy pequeños */}
            <span className="ms-2 hidden sm:inline truncate">
              {loadingText}
            </span>
          </>
        ) : (
          <>
            {/* Icono: flex-shrink-0 evita que se aplaste */}
            {icon && <span className="flex items-center shrink-0">{icon}</span>}

            {/* Texto: text-truncate asegura que ponga "..." si no cabe */}
            <span className="truncate">{text}</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
