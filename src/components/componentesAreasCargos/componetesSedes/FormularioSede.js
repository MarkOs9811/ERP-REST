import { useState, useEffect } from "react";
import { BotonMotionGeneral } from "../../componentesReutilizables/BotonMotionGeneral";

/**
 * Formulario para Crear o Editar una Sede.
 * @param {object} props
 * @param {function} props.onClose - Función para cerrar el modal (viene del ModalRight).
 * @param {object | null} props.sede - Objeto de la sede si es para editar, o null si es para crear.
 */
export function FormularioSede({ onClose, sede }) {
  // 1. Detectar el modo (usamos '!=' para ser seguros con null/undefined)
  const isEditMode = sede != null;

  // 2. Estados para CADA campo del formulario
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  // ... (agrega aquí más estados si tienes más campos)

  // 3. useEffect para RELLENAR el formulario si es modo "Editar"
  useEffect(() => {
    if (isEditMode) {
      // Si 'sede' existe, llenamos los campos
      setNombre(sede.nombre || "");
      setDireccion(sede.direccion || "");
      setTelefono(sede.telefono || "");
    } else {
      // Si no (modo "Crear"), reseteamos los campos a vacío
      setNombre("");
      setDireccion("");
      setTelefono("");
    }
    // Este efecto se ejecuta cada vez que 'sede' cambie
  }, [sede, isEditMode]);

  // 4. Lógica para las mutaciones (useMutation)
  // (Aquí irían tus 'useMutation' de React Query)
  // const createSedeMutation = useCreateSede();
  // const updateSedeMutation = useUpdateSede();

  // 5. Handler para el submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Creamos el objeto con los datos del formulario
    const formData = {
      nombre,
      direccion,
      telefono,
      // ... (más campos)
    };

    if (isEditMode) {
      // --- Lógica de Edición ---
      console.log("Editando sede:", sede.codigo, formData);
      // Aquí llamarías a tu mutación de EDITAR
      // updateSedeMutation.mutate({ id: sede.codigo, ...formData });
    } else {
      // --- Lógica de Creación ---
      console.log("Creando nueva sede:", formData);
      // Aquí llamarías a tu mutación de CREAR
      // createSedeMutation.mutate(formData);
    }

    // Al terminar, cerramos el modal
    onClose();
  };

  return (
    // Usamos 'onSubmit' en el <form>
    <form onSubmit={handleSubmit} className="d-flex flex-column h-100 p-4">
      {/* Cuerpo del formulario (crece para empujar los botones abajo) */}
      <div className="flex-grow-1">
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label fw-bold">
            Nombre de la Sede
          </label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="direccion" className="form-label fw-bold">
            Dirección
          </label>
          <input
            type="text"
            className="form-control"
            id="direccion"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="telefono" className="form-label fw-bold">
            Teléfono
          </label>
          <input
            type="tel"
            className="form-control"
            id="telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>

        {/* ... (Agrega más inputs aquí) ... */}
      </div>

      {/* Footer con botones (se alinea abajo) */}
      <div className="d-flex justify-content-end gap-2 mt-auto">
        <button
          type="button"
          className="btn-cerrar-modal"
          onClick={onClose} // Botón para cancelar usa el 'onClose'
        >
          Cancelar
        </button>
        <button type="submit" className="btn-guardar">
          {isEditMode ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </form>
  );
}
