// components/BotonCancelar.jsx
import { motion } from "framer-motion";
import { CircleX } from "lucide-react";

const BotonCancelar = ({ onClick, children = "Cancelar" }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, backgroundColor: "#e53935" }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="btn w-100 p-3 text-white"
      style={{
        backgroundColor: "#d32f2f",
        border: "none",
        borderRadius: "8px",
      }}
      type="button"
      onClick={onClick}
    >
      <CircleX className="text-auto" />
      <span className="ms-2">{children}</span>
    </motion.button>
  );
};

export default BotonCancelar;
