import React from "react";
import { CloseCircleOutline } from "react-ionicons";
import PropTypes from "prop-types";

const CloseButton = ({ onClose, className, iconColor, iconSize }) => {
  return (
    <button
      type="button"
      className={` btn ${className}`}
      onClick={onClose}
      aria-label="Cerrar formulario"
    >
      <CloseCircleOutline color={iconColor} style={{ fontSize: iconSize }} />
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
