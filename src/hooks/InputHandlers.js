export const handleInputChange = (setter, setValue, fieldName, regex = /^\d*$/, maxLength = Infinity) => {
    return (event) => {
      const value = event.target.value;
  
      if (regex.test(value) && value.length <= maxLength) {
        setter(value);
        setValue(fieldName, value);
      }
    };
  };
  
  export const handleSelectChange = (setter, setValue, fieldName, resetFields = []) => {
    return (event) => {
      const selectedValue = event.target.value;
  
      setter(selectedValue);
      setValue(fieldName, selectedValue);
  
      // Restablecer los valores de otros campos si es necesario
      resetFields.forEach((field) => {
        setValue(field.name, field.defaultValue || "");
        field.setter(field.defaultValue || "");
      });
    };
  };

  // Limita la entrada a solo números y un máximo de 9 dígitos
  export const limitTelefonoInput = (event) => {
    const value = event.target.value.replace(/\D/g, ""); // Elimina caracteres no numéricos
    event.target.value = value.slice(0, 9); // Limita a 9 dígitos
  };
  // inputValidations.js
  export const validateTelefono = (value) => {
    const regex = /^\d{9}$/; // Exactamente 9 dígitos
    if (!value) {
      return "El teléfono es obligatorio";
    }
    if (!regex.test(value)) {
      return "El teléfono debe tener exactamente 9 dígitos";
    }
    if(value==9){
      
    }
    return true; // Validación exitosa
  };
  
  export const validatePrecio = (value) => {
      // Filtrar caracteres no numéricos, excepto el punto decimal
      const formattedValue = value.replace(/[^0-9.]/g, '');  // Solo números y punto
      const regex = /^[0-9]+(\.[0-9]{1,2})?$/; // Regex para validar hasta 2 decimales

      // Se actualiza el valor del input con el valor formateado (si es necesario)
      if (formattedValue !== value) {
          return "El precio debe ser un número válido con hasta 2 decimales";
      }

      // Validación
      if (!value) {
          return "El precio es obligatorio";
      }
      if (!regex.test(value)) {
          return "El precio debe ser un número válido con hasta 2 decimales";
      }

      return true; // Validación exitosa
  };
  export const handlePrecioInput = (e) => {
      const value = e.target.value;

      // Eliminar cualquier carácter no numérico, excepto el punto
      let formattedValue = value.replace(/[^0-9.]/g, '');

      // Limitar a 2 decimales
      formattedValue = formattedValue.replace(/^(\d+\.\d{2}).*/, '$1');

      // Asignar el valor formateado al input
      e.target.value = formattedValue;
  };


  
