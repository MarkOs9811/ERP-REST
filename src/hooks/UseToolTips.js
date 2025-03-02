import { useEffect } from 'react';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle';

export const useTooltips = (dynamicContent) => {
  useEffect(() => {
    // Obtener todos los elementos que tienen tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipInstances = [];

    // Inicializar tooltips
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      // Crear nueva instancia de tooltip
      const tooltipInstance = new bootstrap.Tooltip(tooltipTriggerEl);
      tooltipInstances.push(tooltipInstance);

      // Ocultar el tooltip al salir del botón
      tooltipTriggerEl.addEventListener('mouseleave', () => {
        tooltipInstance.hide();
      });
    });

    // Limpiar tooltips al desmontar el componente o al actualizar contenido dinámico
    return () => {
      tooltipInstances.forEach((tooltipInstance) => {
        if (tooltipInstance._element.closest('[data-bs-toggle="tooltip"]')) {
          tooltipInstance.dispose();
        }
      });
    };
  }, [dynamicContent]);
};
