export const handleInputChange = (
  setter,
  setValue,
  fieldName,
  regex = /^\d*$/,
  maxLength = Infinity,
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
  resetFields = [],
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

// Limita la entrada a solo números y un máximo de 9 dígitos (Teléfono)
export const limitTelefonoInput = (event) => {
  const value = event.target.value.replace(/\D/g, "");
  event.target.value = value.slice(0, 9);
};

// NUEVO: Limita la entrada a solo números y un máximo de 8 dígitos (DNI)
export const limitDNIInput = (event) => {
  const value = event.target.value.replace(/\D/g, ""); // Elimina caracteres no numéricos
  event.target.value = value.slice(0, 8); // Limita a 8 dígitos
};

export const validateTelefono = (value) => {
  const regex = /^\d{9}$/;
  if (!value) return "El teléfono es obligatorio";
  if (!regex.test(value)) return "El teléfono debe tener exactamente 9 dígitos";
  return true;
};

// NUEVO: Valida que el DNI tenga exactamente 8 dígitos
export const validateDNI = (value) => {
  const regex = /^\d{8}$/;
  if (!value) return "El DNI es obligatorio";
  if (!regex.test(value)) return "El DNI debe tener exactamente 8 dígitos";
  return true;
};

export const validatePrecio = (value) => {
  if (!value) return "El precio es obligatorio";

  const puntos = value.split(".").length - 1;
  if (puntos > 1) return "El precio solo puede tener un punto decimal";

  const regex = /^[0-9]+(\.[0-9]{1,2})?$/;
  if (!regex.test(value))
    return "El precio debe ser un número válido con hasta 2 decimales";

  return true;
};

export const handlePrecioInput = (e) => {
  let value = e.target.value;
  value = value.replace(/[^0-9.]/g, "");

  const parts = value.split(".");
  if (parts.length > 2) {
    value = parts.shift() + "." + parts.join("");
  }

  if (value.includes(".")) {
    const [entero, decimales] = value.split(".");
    value = entero + "." + decimales.slice(0, 2);
  }

  e.target.value = value;
};

// Intercepta el teclado y limpia caracteres no válidos dinámicamente
export const limitDocumentoInput = (tipoDocumento) => (event) => {
  // Nota: Si en el futuro el CE incluye letras, cambia /\D/g por /[^a-zA-Z0-9]/g
  const value = event.target.value.replace(/\D/g, "");
  const maxLength = tipoDocumento === "DNI" ? 8 : 10;

  event.target.value = value.slice(0, maxLength);
};

// Valida la lógica de negocio al momento del submit
// RHF inyecta 'formValues' como segundo argumento automáticamente
export const validateDocumento = (value, formValues) => {
  if (!value) return "El documento es obligatorio";

  const tipo = formValues.tipo_documento; // Lee el valor actual del select

  if (tipo === "DNI") {
    if (!/^\d{8}$/.test(value)) {
      return "El DNI debe tener exactamente 8 dígitos";
    }
  }

  if (tipo === "extranjeria") {
    // Valida entre 9 y 10 dígitos (Ajusta según tu regla estricta de negocio)
    if (!/^\d{9,10}$/.test(value)) {
      return "El Carnet de Extranjería debe tener entre 9 y 10 dígitos";
    }
  }

  return true;
};
