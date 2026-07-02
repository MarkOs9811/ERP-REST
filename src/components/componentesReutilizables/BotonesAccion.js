import { Eye, Pencil, Trash2 } from "lucide-react";

export const BtnVer = ({ onClick, disabled = false, title = "Ver" }) => (
  <button
    className="btn btn-ver btn-icon-circle mx-1 my-2 d-inline-flex align-items-center justify-content-center"
    onClick={onClick}
    disabled={disabled}
    data-bs-toggle="tooltip"
    title={title}
  >
    <Eye size={18} />
  </button>
);

export const BtnEditar = ({ onClick, disabled = false, title = "Editar" }) => (
  <button
    className="btn btn-editar btn-icon-circle mx-1 my-2 d-inline-flex align-items-center justify-content-center"
    onClick={onClick}
    disabled={disabled}
    data-bs-toggle="tooltip"
    title={title}
  >
    <Pencil size={18} />
  </button>
);

export const BtnEliminar = ({
  onClick,
  disabled = false,
  title = "Eliminar",
}) => (
  <button
    className="btn btn-eliminar btn-icon-circle mx-1 my-2 d-inline-flex align-items-center justify-content-center"
    onClick={onClick}
    disabled={disabled}
    data-bs-toggle="tooltip"
    title={title}
  >
    <Trash2 size={18} />
  </button>
);

/**
 * Componente para mostrar un grupo de botones de acción
 */
export const BotonesAccionGrupo = ({
  onVer = null,
  onEditar = null,
  onEliminar = null,
  disabledVer = false,
  disabledEditar = false,
  disabledEliminar = false,
}) => (
  <div className="d-flex gap-2">
    {onVer && <BtnVer onClick={onVer} disabled={disabledVer} />}
    {onEditar && <BtnEditar onClick={onEditar} disabled={disabledEditar} />}
    {onEliminar && (
      <BtnEliminar onClick={onEliminar} disabled={disabledEliminar} />
    )}
  </div>
);
