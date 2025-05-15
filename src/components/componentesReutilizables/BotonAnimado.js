import { motion } from "framer-motion";
import {
  CheckmarkDoneOutline,
  ReloadCircleOutline,
  ReloadOutline,
} from "react-ionicons"; // Agregar el ícono de carga

const BotonAnimado = ({
  children,
  type = "button",
  loading = false,
  error = null,
  onClick,
  className = "btn-realizarPedido w-auto h-100 p-3",
  icon, // Nueva prop para icono personalizado
  loadingIcon = <ReloadOutline color="auto" rotate />, // Icono de carga por defecto
  successIcon = <CheckmarkDoneOutline color="auto" />, // Icono de éxito por defecto
  ...props
}) => {
  return (
    <motion.button
      className={className}
      type={type}
      onClick={type === "button" ? onClick : undefined}
      disabled={loading}
      {...props}
    >
      {
        loading ? loadingIcon : icon || successIcon // Usa el icono personalizado si está definido
      }
      {children}

      {error && <div className="alert alert-danger mt-2">{error}</div>}
    </motion.button>
  );
};

export default BotonAnimado;
