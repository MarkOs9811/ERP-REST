// src/utils/formatoNumeros.js

/**
 * Formatea números grandes a notación compacta (ej. 1500 -> 1.5K, 1500000 -> 1.5M)
 * @param {number} numero - El número a formatear
 * @returns {string} - Número formateado
 */
export const formatearNumeroCompacto = (numero) => {
  if (!numero || isNaN(numero)) return "0";

  // Usamos 'en-US' para forzar que use la "K" (Kilo) y "M" (Millón),
  // ya que la configuración en español ('es-ES') devolvería "1,5 mil".
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1, // Muestra máximo un decimal (ej. 1.5K)
  }).format(numero);
};
