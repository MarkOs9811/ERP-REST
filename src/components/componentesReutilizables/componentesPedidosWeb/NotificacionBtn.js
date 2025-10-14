import { useState } from "react";
import { motion } from "framer-motion";
import { NotificarPedido } from "../../../service/accionesReutilizables/NotificarPedido";
import ToastAlert from "../../componenteToast/ToastAlert";
import { Megaphone } from "lucide-react";

const NotificacionBtn = ({ pedido }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleNotificar = async () => {
    if (loading) return;

    setLoading(true);
    setProgress(100);

    try {
      await NotificarPedido(pedido);

      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - 100 / 30;
          if (newProgress <= 0) {
            clearInterval(interval);
            setLoading(false);
          }
          return newProgress;
        });
      }, 1000);
    } catch (e) {
      ToastAlert("error", "Error al enviar la notificación", e);
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <motion.button
      className="btn btn-sm btn-light p-1 ms-auto"
      title="Notificar al cliente"
      onClick={handleNotificar}
      disabled={loading}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95, rotate: -1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {loading ? (
        <div
          style={{
            position: "relative",
            width: "24px",
            height: "24px",
            display: "inline-block",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            style={{
              transform: "rotate(-90deg)",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="#e9ecef"
              strokeWidth="2"
            />
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="#6c757d"
              strokeWidth="2"
              strokeDasharray="62.8"
              strokeDashoffset={62.8 * (1 - progress / 100)}
              strokeLinecap="round"
            />
          </svg>
          {/* Icono visible solo cuando no está cargando */}
          {!loading && (
            <Megaphone
              size="14"
              color="#6c757d"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          )}
        </div>
      ) : (
        <Megaphone size={14} />
      )}
    </motion.button>
  );
};

export default NotificacionBtn;
