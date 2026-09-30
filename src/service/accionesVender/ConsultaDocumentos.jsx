// src/service/accionesVender/ConsultaDocumentos.js

import axiosInstance from "../../api/AxiosInstance";

export const ConsultarDocumento = async (numero, tipoDoc = "DNI") => {
  try {
    const doc = numero.trim();

    // Validamos la longitud en el frontend para evitar peticiones innecesarias al backend
    if (tipoDoc === "DNI" && doc.length !== 8) {
      return { success: false, message: "El DNI debe tener 8 dígitos." };
    }
    if (tipoDoc === "RUC" && doc.length !== 11) {
      return { success: false, message: "El RUC debe tener 11 dígitos." };
    }

    // Hacemos la petición a TU propio backend en Laravel
    const response = await axiosInstance.get(
      `/consultar-documento/${tipoDoc}/${doc}`,
    );

    // Tu backend ya devuelve { success: true, nombre: "..." }
    return response.data;
  } catch (error) {
    let mensaje = "Error de conexión con el servidor interno.";

    // Capturamos el mensaje exacto que configuraste en Laravel (ej. "DNI no encontrado en RENIEC")
    if (error.response?.data?.message) {
      mensaje = error.response.data.message;
    }

    return { success: false, message: mensaje };
  }
};
