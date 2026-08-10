export const formatearFecha = (fechaCruda) => {
  if (!fechaCruda) return "";

  // 1. Limpieza segura cross-browser (Safari/Chrome/Firefox)
  let fechaLimpia = fechaCruda;
  if (!fechaCruda.includes("T")) {
    // Si tiene espacio (ej: "2026-08-08 16:25:41") lo cambia a "T"
    // Si no tiene espacio (ej: "2026-08-08") le añade "T00:00:00"
    fechaLimpia = fechaCruda.includes(" ")
      ? fechaCruda.replace(" ", "T")
      : `${fechaCruda}T00:00:00`;
  }

  const fecha = new Date(fechaLimpia);

  // 2. Formateo incluyendo tiempo
  return fecha.toLocaleString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Ponlo en 'false' si prefieres formato 24 horas (ej: 16:25)
  });
};
