import axios from "axios";
import axiosRetry from "axios-retry";
import ToastAlert from "../components/componenteToast/ToastAlert";

// const axiosInstance = axios.create({

//   baseURL: "http://127.0.0.1:8000/api",
//   Authorization: `Bearer ${localStorage.getItem("token")}`,
//   withCredentials: true,
// });
const axiosInstance = axios.create({
  // baseURL: "https://vv1g8thv-8000.brs.devtunnels.ms/api",
  baseURL: "http://erp-api.test/api",
  // baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
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
      ToastAlert(
        "error",
        "Demasiadas solicitudes. Por favor, inténtalo de nuevo más tarde."
      );
      return Promise.reject(error);
    }

    // Manejo de error 401: sesión expirada
    if (error.response && error.response.status === 401) {
      ToastAlert(
        "error",
        "Sesión expirada. Por favor, inicia sesión nuevamente."
      );
      window.location.href = "/"; // Redirigir al login si es necesario
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
