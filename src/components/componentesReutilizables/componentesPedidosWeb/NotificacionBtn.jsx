import { useState } from "react";
import { NotificarPedido } from "../../../service/accionesReutilizables/NotificarPedido";
import ToastAlert from "../../componenteToast/ToastAlert";
import { MegaphoneIcon } from "lucide-react";
import { Button } from "../../ui/button";

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
    <Button
      type="button"
      className="btn-generico w-0 px-2 rounded"
      disabled={loading}
      title="Notificar al cliente"
      onClick={() => handleNotificar()}
     variant="default">
      <MegaphoneIcon size={18} />
    </Button>
  );
};

export default NotificacionBtn;
