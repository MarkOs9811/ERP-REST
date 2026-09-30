/**
 * Helper para obtener los colores de las variables CSS del tema
 * Permite que los gráficos y componentes se adapten a cambios de tema dinámicamente
 */

export const getThemeColors = () => {
  const root = document.documentElement;
  const styles = getComputedStyle(root);

  return {
    // Colores de marca
    onyx: styles.getPropertyValue("--fw-onyx").trim(),
    emerald: styles.getPropertyValue("--fw-emerald").trim(),
    saffron: styles.getPropertyValue("--fw-saffron").trim(),
    strawberry: styles.getPropertyValue("--fw-strawberry").trim(),
    white: styles.getPropertyValue("--fw-white").trim(),
    muetd: styles.getPropertyValue("--fw-muetd").trim(),

    // Fondos suaves
    bgEmeraldSoft: styles.getPropertyValue("--bg-emerald-soft").trim(),
    bgSaffronSoft: styles.getPropertyValue("--bg-saffron-soft").trim(),
    bgStrawberrySoft: styles.getPropertyValue("--bg-strawberry-soft").trim(),

    // Estructura del tema
    brandPrimary: styles.getPropertyValue("--brand-primary").trim(),
    brandSecondary: styles.getPropertyValue("--brand-secondary").trim(),
    bgCard: styles.getPropertyValue("--bg-card").trim(),
    textMain: styles.getPropertyValue("--text-main").trim(),
    textMuted: styles.getPropertyValue("--text-muted").trim(),

    // Sombras
    shadowSoft: styles.getPropertyValue("--shadow-soft").trim(),
    shadowHover: styles.getPropertyValue("--shadow-hover").trim(),
  };
};

/**
 * Convierte un color RGB a RGBA con opacidad personalizada
 * @param {string} rgbColor - Color en formato rgb(r, g, b)
 * @param {number} opacity - Opacidad de 0 a 1
 * @returns {string} Color en formato rgba
 */
export const toRgba = (rgbColor, opacity = 1) => {
  // Extraer valores RGB
  const rgbMatch = rgbColor.match(/\d+/g);
  if (!rgbMatch || rgbMatch.length < 3) return rgbColor;
  return `rgba(${rgbMatch[0]}, ${rgbMatch[1]}, ${rgbMatch[2]}, ${opacity})`;
};

/**
 * Convierte hex a RGB
 * @param {string} hex - Color en formato hex (#RRGGBB)
 * @returns {string} Color en formato rgb(r, g, b)
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16,
      )})`
    : hex;
};

/**
 * Oscurece un color (hex o rgb) en un porcentaje entre 0 y 1
 * @param {string} color - Color en formato hex o rgb
 * @param {number} amount - Intensidad de oscurecimiento (0.2 = 20%)
 * @returns {string} Color en formato rgb
 */
export const darkenColor = (color, amount = 0.2) => {
  const safeAmount = Math.min(Math.max(amount, 0), 1);
  const normalized = color.startsWith("#") ? hexToRgb(color) : color;
  const rgbMatch = normalized.match(/\d+/g);

  if (!rgbMatch || rgbMatch.length < 3) return color;

  const r = Math.max(0, Math.round(Number(rgbMatch[0]) * (1 - safeAmount)));
  const g = Math.max(0, Math.round(Number(rgbMatch[1]) * (1 - safeAmount)));
  const b = Math.max(0, Math.round(Number(rgbMatch[2]) * (1 - safeAmount)));

  return `rgb(${r}, ${g}, ${b})`;
};
