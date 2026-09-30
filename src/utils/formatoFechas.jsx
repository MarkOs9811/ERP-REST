import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";

dayjs.extend(relativeTime);
dayjs.locale("es");

/**
 * Convierte una fecha a formato relativo.
 * @param {string|Date} fecha - Fecha a formatear.
 * @param {string} textoFaltante - Texto a mostrar si la fecha es nula/indefinida.
 * @returns {string}
 */
export const obtenerTiempoRelativo = (
  fecha,
  textoFaltante = "Sin registro",
) => {
  if (!fecha) return textoFaltante;

  const fechaParseada = dayjs(fecha);

  if (!fechaParseada.isValid()) return "Fecha inválida";

  const tiempoRelativo = fechaParseada.fromNow();
  return tiempoRelativo.charAt(0).toUpperCase() + tiempoRelativo.slice(1);
};
