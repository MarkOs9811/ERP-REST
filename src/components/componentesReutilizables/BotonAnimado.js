import { motion } from "framer-motion";
import {
  CheckmarkDoneOutline,
  ReloadCircleOutline,
  ReloadOutline,
} from "react-ionicons"; // Agregar el ícono de carga

const BotonAnimado = ({
  children,
  type = "button", // Valor por defecto
  loading = false,
  error = null,
  onClick,
  ...props // Captura todas las props adicionales (como form, className, etc.)
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="btn-realizarPedido w-auto h-100 p-3"
      type={type} // Tipo dinámico (button/submit/reset)
      onClick={type === "button" ? onClick : undefined} // Solo usa onClick si es type="button"
      disabled={loading}
      {...props} // Pasa todas las props adicionales al botón nativo
    >
      {/* Si está cargando, mostrar el ícono de carga */}
      {loading ? (
        <ReloadOutline color={"auto"} rotate />
      ) : (
        <CheckmarkDoneOutline color={"auto"} />
      )}
      {loading ? "Cargando..." : children}

      {error && <div className="alert alert-danger mt-2">{error}</div>}
    </motion.button>
  );
};

export default BotonAnimado;
