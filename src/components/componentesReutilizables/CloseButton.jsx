import React from "react";
import PropTypes from "prop-types";
import { CircleX } from "lucide-react";
import "../../css/EstiloBotonMotion.css";
import { Button } from "../ui/button";

const CloseButton = ({ onClose, className, iconColor, iconSize }) => {
  return (
    <Button
      type="button"
      className={`fw-close-btn ${className}`}
      onClick={onClose}
      aria-label="Cerrar formulario"
     variant="default">
      <CircleX color={iconColor} size={iconSize} />
    </Button>
  );
};

CloseButton.propTypes = {
  onClose: PropTypes.func.isRequired, // Función para manejar el evento de cerrar
  className: PropTypes.string, // Clases adicionales para el estilo
  iconColor: PropTypes.string, // Color del ícono
  iconSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // Tamaño del ícono
};

CloseButton.defaultProps = {
  className: "",
  iconColor: "currentColor",
  iconSize: 20,
};

export default CloseButton;
