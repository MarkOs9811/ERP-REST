export const formatearFecha = (fechaCruda) => {
  if (!fechaCruda) return "";

  const fechaLimpia = fechaCruda.includes("T")
    ? fechaCruda
    : `${fechaCruda}T00:00:00`;
  const fecha = new Date(fechaLimpia);

  return fecha.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
