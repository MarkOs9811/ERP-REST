import { useState, useCallback } from "react";

export const useGeolocalizacion = () => {
  const [coordenadas, setCoordenadas] = useState(null);
  const [errorGeo, setErrorGeo] = useState(null);
  const [isLoadingGeo, setIsLoadingGeo] = useState(false);

  // Usamos useCallback para que la función no se recree en cada render
  const obtenerUbicacion = useCallback(() => {
    return new Promise((resolve, reject) => {
      setIsLoadingGeo(true);
      setErrorGeo(null);

      if (!navigator.geolocation) {
        const errorMsg = "Tu navegador no soporta geolocalización";
        setErrorGeo(errorMsg);
        setIsLoadingGeo(false);
        reject(new Error(errorMsg));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitud: position.coords.latitude,
            longitud: position.coords.longitude,
          };
          setCoordenadas(coords);
          setIsLoadingGeo(false);
          resolve(coords);
        },
        (error) => {
          setErrorGeo(error.message);
          setIsLoadingGeo(false);
          reject(error);
        },
        // Aumentamos el timeout a 15000 (15 segundos)
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
      );
    });
  }, []);

  return { coordenadas, errorGeo, isLoadingGeo, obtenerUbicacion };
};
