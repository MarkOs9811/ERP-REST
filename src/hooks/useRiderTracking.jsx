import { useState, useEffect } from "react";
import axiosInstance from "../api/AxiosInstance";
// Importa tu instancia de axios

export const useRiderTracking = (esRider, intervaloMs = 30000) => {
  const [ubicacionRider, setUbicacionRider] = useState(null);

  useEffect(() => {
    // Si no es rider (es admin), cancelamos todo y no hacemos nada
    if (!esRider) return;

    const actualizarUbicacion = () => {
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            latitud: position.coords.latitude,
            longitud: position.coords.longitude,
          };

          setUbicacionRider(coords); // Guardamos para mostrar en el mapa

          try {
            // Mandamos silenciosamente la ubicación al backend
            await axiosInstance.put("/delivery/updateUbicacionRider", coords);
          } catch (error) {
            console.error("Error actualizando ubicación en background", error);
          }
        },
        (error) => console.error("Error obteniendo GPS", error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 },
      );
    };

    // Ejecutamos la primera vez inmediatamente
    actualizarUbicacion();

    // Configuramos el intervalo cada 30 segundos
    const intervalId = setInterval(actualizarUbicacion, intervaloMs);

    // Limpieza: cuando el modal se cierra, detenemos el rastreo
    return () => clearInterval(intervalId);
  }, [esRider, intervaloMs]);

  return ubicacionRider;
};
