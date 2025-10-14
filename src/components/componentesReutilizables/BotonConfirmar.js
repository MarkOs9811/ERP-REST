// components/BotonConfirmar.jsx
import { motion } from "framer-motion";
import { CheckCheck } from "lucide-react";

const BotonConfirmar = ({ onClick, loading, children = "Confirmar" }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, backgroundColor: "#4caf50" }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="btn w-100 p-3 text-white"
      style={{
        backgroundColor: "#43a047",
        border: "none",
        borderRadius: "8px",
      }}
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
