import axios from "axios";
import axiosRetry from "axios-retry";

const axiosInstance = axios.create({
  baseURL: "http://erp-api.test/api",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  withCredentials: true,
});

// Configuración de axios-retry para manejar reintentos automáticos
axiosRetry(axiosInstance, {
  retries: 3, // Número de intentos
  retryDelay: axiosRetry.exponentialDelay, // Retraso exponencial entre intentos
  shouldResetTimeout: true, // Resetear el timeout entre reintentos
});

// Interceptor de solicitudes para agregar el token de autorización
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Obtiene el token del almacenamiento local
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Añade el token al header
    }

    // Ajusta el Content-Type según sea necesario
    if (config.data && config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas para manejar errores globalmente
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo de error 429: demasiadas solicitudes
    if (error.response && error.response.status === 429) {
      alert("Demasiadas solicitudes, por favor intenta más tarde.");
      return Promise.reject(error);
    }

    // Manejo de error 401: sesión expirada
    if (error.response && error.response.status === 401) {
      alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
      window.location.href = "/"; // Redirigir al login si es necesario
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
