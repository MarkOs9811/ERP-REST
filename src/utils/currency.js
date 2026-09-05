// Retorna solo el símbolo (Ideal para labels: "Precio Unitario (S/.)")
export const getMoneda = () => {
  return localStorage.getItem("simboloMoneda") || "S/.";
};

// Retorna el monto formateado (Ideal para tablas o totales: "S/. 15.00")
export const formatMoneda = (monto) => {
  const simbolo = getMoneda();
  const numero = parseFloat(monto) || 0;
  return `${simbolo} ${numero.toFixed(2)}`;
};
