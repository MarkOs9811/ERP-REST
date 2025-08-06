import axios from "axios";

// Crear una instancia de Axios para tu API de Spring Boot
const axiosInstanceJava = axios.create({
  baseURL: "http://localhost:8081/api", // URL base para los endpoints de tu API
  timeout: 10000, // Tiempo de espera para solicitudes
  withCredentials: false, // Ajustar según si necesitas enviar cookies
});

// Interceptor de solicitudes (opcional)
axiosInstanceJava.interceptors.request.use(
  (config) => {
    // Si necesitas agregar headers, como tokens, puedes hacerlo aquí
    const token = localStorage.getItem("token"); // Cambia "token_java" según tus necesidades
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas (opcional)
axiosInstanceJava.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      alert("No autorizado. Por favor, inicia sesión.");
      // Redirigir al login si es necesario
      window.location.href = "/login";
    } else if (error.response && error.response.status === 404) {
      alert("Recurso no encontrado.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstanceJava;
