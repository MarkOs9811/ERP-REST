import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import echoEvents from "../api/echoEvents";

// UseEventosGlobales.js

export const UseEventosGlobales = (userId) => {
  // Cambiamos el nombre a userId para ser claros
  const queryClient = useQueryClient();
  console.log(
    "Se obtuvo el userId para suscribirse a eventos globales:",
    userId,
  );
  useEffect(() => {
    if (!userId) return;

    // 1. Nos suscribimos al nuevo canal de notificaciones del usuario
    const channel = echoEvents.private(`user.notifications.${userId}`);
    console.log(
      "Se obtuvo el userId para suscribirse a eventos globales:",
      userId,
    );

    // 2. Escuchamos el evento (recuerda el punto inicial si usas broadcastAs)
    channel.listen(".NotificacionActualizada", (data) => {
      queryClient.invalidateQueries({ queryKey: ["notificacionesPrivadas"] });
      queryClient.invalidateQueries({ queryKey: ["listaPedidosAsiganados"] });
      queryClient.invalidateQueries({ queryKey: ["listaPedidosEnCamino"] });
    });

    return () => {
      echoEvents.leave(`user.notifications.${userId}`);
    };
  }, [userId, queryClient]);
};
