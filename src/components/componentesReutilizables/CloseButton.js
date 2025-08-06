import React from "react";
import PropTypes from "prop-types";
import { CircleX } from "lucide-react";

const CloseButton = ({ onClose, className, iconColor, iconSize }) => {
  return (
    <button
      type="button"
      className={` btn ${className}`}
      onClick={onClose}
      aria-label="Cerrar formulario"
    >
      <CircleX color={iconColor} style={{ fontSize: iconSize }} />
    </button>
  );
};

CloseButton.propTypes = {
  onClose: PropTypes.func.isRequired, // Función para manejar el evento de cerrar
  className: PropTypes.string, // Clases adicionales para el estilo
  iconColor: PropTypes.string, // Color del ícono
  iconSize: PropTypes.string, // Tamaño del ícono
};

CloseButton.defaultProps = {
  className: "",
  iconColor: "#007bff",
  iconSize: "30px",
};

export default CloseButton;
