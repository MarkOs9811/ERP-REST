// components/BotonConfirmar.jsx
import { motion } from "framer-motion";
import { CheckCheck } from "lucide-react";
import "../../css/EstiloBotonMotion.css";

const BotonConfirmar = ({ onClick, loading, children = "Confirmar" }) => {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="btn btn-motion-theme btn-motion-success fw-btn-base w-100 p-3"
      type="button"
      onClick={onClick}
      disabled={loading}
    >
      <CheckCheck className="text-auto" />
      <span className="ms-2">{loading ? "Cargando..." : children}</span>
    </motion.button>
  );
};

export default BotonConfirmar;
