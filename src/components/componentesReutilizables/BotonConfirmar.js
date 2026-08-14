import { motion } from "framer-motion";
import { CheckCheck } from "lucide-react";
import "../../css/EstiloBotonMotion.css";

const BotonConfirmar = ({ onClick, loading, children = "Confirmar" }) => {
  return (
    <motion.button
      // Anulamos las animaciones de hover si está cargando
      whileHover={!loading ? { y: -1 } : {}}
      whileTap={!loading ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.05 }}
      className={`btn-guardar w-100 p-3 ${loading ? "disabled" : ""}`}
      type="button"
      // Bloqueo 1: Atributo HTML
      disabled={loading}
      // Bloqueo 2: CSS (Para asegurar que no se pueda clickear visualmente)
      style={{
        opacity: loading ? 0.7 : 1,
        cursor: loading ? "not-allowed" : "pointer",
        pointerEvents: loading ? "none" : "auto",
      }}
      // Bloqueo 3: JavaScript intercepta el clic
      onClick={(e) => {
        if (loading) {
          e.preventDefault();
          return;
        }
        if (onClick) onClick(e);
      }}
    >
      <CheckCheck className="text-auto" />
      <span className="ms-2">{loading ? "Cargando..." : children}</span>
    </motion.button>
  );
};

export default BotonConfirmar;
