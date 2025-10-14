import { motion } from "framer-motion";

/**
 * Botón animado reutilizable con Framer Motion.
 *
 * Props:
 * - text: texto del botón
 * - icon: componente de ícono (por ejemplo, <FileText size={18} />)
 * - color1 y color2: colores del gradiente de fondo
 * - onClick: función al hacer clic
 */
export function BotonMotionGeneral({
  text = "Botón",
  icon = null,
  color1 = "#4f9aff",
  color2 = "#6fc3ff",
  onClick = () => {},
  classDefault = "btn d-flex align-items-center gap-1 px-3 py-2 rounded-3 border shadow-sm ms-auto text-dark",
}) {
  return (
    <motion.button
      whileHover={{
        scale: 1.05,
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={classDefault}
      style={{
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
        fontWeight: "500",
      }}
    >
      {icon && <span className="me-2">{icon}</span>}
      {text}
    </motion.button>
  );
}
