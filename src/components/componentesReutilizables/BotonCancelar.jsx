// components/BotonCancelar.jsx
import { motion } from "framer-motion";
import { CircleX } from "lucide-react";


const BotonCancelar = ({ onClick, children = "Cancelar" }) => {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 btn-motion-theme btn-motion-danger fw-btn-base w-full p-3"
      type="button"
      onClick={onClick}
    >
      <CircleX className="text-auto" />
      <span className="ms-2">{children}</span>
    </motion.button>
  );
};

export default BotonCancelar;
