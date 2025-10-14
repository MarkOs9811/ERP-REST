export const handleInputChange = (
  setter,
  setValue,
  fieldName,
  regex = /^\d*$/,
  maxLength = Infinity
) => {
  return (event) => {
    const value = event.target.value;

    if (regex.test(value) && value.length <= maxLength) {
      setter(value);
      setValue(fieldName, value);
    }
  };
};

export const handleSelectChange = (
  setter,
  setValue,
  fieldName,
  resetFields = []
) => {
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
  if (value == 9) {
  }
  return true; // Validación exitosa
};

export const validatePrecio = (value) => {
  if (!value) {
    return "El precio es obligatorio";
  }

  // Verifica que solo haya números y un solo punto decimal
  const puntos = value.split(".").length - 1;
  if (puntos > 1) {
    return "El precio solo puede tener un punto decimal";
  }

  // Regex para validar formato correcto: números enteros o con hasta 2 decimales
  const regex = /^[0-9]+(\.[0-9]{1,2})?$/;

  if (!regex.test(value)) {
    return "El precio debe ser un número válido con hasta 2 decimales";
  }

  return true; // Validación exitosa
};

export const handlePrecioInput = (e) => {
  let value = e.target.value;

  // Permitir solo números y un punto decimal
  // Eliminar todos los caracteres excepto dígitos y puntos
  value = value.replace(/[^0-9.]/g, "");

  // Permitir solo un punto decimal:
  // Aquí eliminamos todos los puntos menos el primero
  const parts = value.split(".");
  if (parts.length > 2) {
    value = parts.shift() + "." + parts.join("");
  }

  // Limitar a 2 decimales
  if (value.includes(".")) {
    const [entero, decimales] = value.split(".");
    value = entero + "." + decimales.slice(0, 2);
  }

  e.target.value = value;
};
