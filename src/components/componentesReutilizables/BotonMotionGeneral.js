import { motion } from "framer-motion";
import "../../css/EstiloBotonMotion.css";

export function BotonMotionGeneral({
  text = "Botón",
  icon = null,
  onClick = () => {},
  loading = false,
  loadingText = "Cargando...", // Prop opcional para el texto de carga
  classDefault = "d-flex align-items-center gap-1 px-3 py-2 w-auto rounded-3 border shadow-sm ms-auto",
}) {
  // Deshabilitamos las animaciones interactivas si está cargando
  const whileHover = loading
    ? {}
    : {
        y: -3, // Mueve el botón 5px hacia arriba
        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)", // Sombra más pronunciada para el efecto
      };

  const whileTap = loading ? {} : { scale: 0.95 };

  return (
    <motion.button
      whileHover={whileHover}
      whileTap={whileTap}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      // Añadimos una clase de opacidad si está cargando
      className={`${classDefault} btn-motion-theme ${
        loading ? "opacity-75" : ""
      }`}
      // Deshabilitamos el botón
      disabled={loading}
    >
      {loading ? (
        // --- ESTADO DE CARGA ---
        <>
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span className="ms-2">{loadingText}</span>
        </>
      ) : (
        // --- ESTADO NORMAL ---
        <>
          {icon && <span className="me-2">{icon}</span>}
          {text}
        </>
      )}
    </motion.button>
  );
}
