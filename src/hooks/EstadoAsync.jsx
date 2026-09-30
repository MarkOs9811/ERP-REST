import { useState } from "react";

export const useEstadoAsyn = (asyncFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFunction(...args);
      return result;
    } catch (err) {
      setError(err); // Aquí guardamos el error completo
      console.error("Error details:", err); // Puedes hacer más con el error aquí, como enviarlo a un servicio de logging
      throw err; // Lanzamos el error para manejarlo en el componente
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, execute };
};
