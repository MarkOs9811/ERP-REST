import axios from "axios";
import ToastAlert from "../components/componenteToast/ToastAlert";

const axiosInstance = axios.create({
  // baseURL: "http://erp-api.test/api",
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
});

// =====================================================
// INTERCEPTOR DE REQUEST
// =====================================================
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// =====================================================
// INTERCEPTOR DE RESPONSE
// =====================================================
let toast429Visible = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // 429 - demasiadas solicitudes
    if (status === 429) {
      if (!toast429Visible) {
        toast429Visible = true;
        ToastAlert(
          "error",
          "Demasiadas solicitudes. Por favor, espera un momento.",
        );
        setTimeout(() => {
          toast429Visible = false;
        }, 3000);
      }
      return Promise.reject(error);
    }

    // 401 - sesión expirada
    if (status === 401) {
      // 🔥 EXCEPCIÓN VITAL: Ignoramos el 401 si viene de intentar logearse
      if (error.config.url && error.config.url.includes("/login")) {
        return Promise.reject(error);
      }

      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/"
      ) {
        // 🔥 BORRADO SEGURO: No uses .clear()
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        ToastAlert(
          "error",
          "Sesión expirada o inválida. Por favor, inicia sesión nuevamente.",
        );
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
