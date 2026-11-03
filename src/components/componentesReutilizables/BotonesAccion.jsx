import { Eye, Pencil, Trash2, X } from "lucide-react";
import { Button } from "../ui/button";

export const BtnVer = ({ onClick, disabled = false, title = "Ver" }) => (
  <Button
    type="button"
    variant="outline"
    size="icon-sm"
    className="mx-1 my-2"
    onClick={onClick}
    disabled={disabled}
    title={title}
    aria-label={title}
  >
    <Eye className="size-[18px]" />
  </Button>
);

export const BtnEditar = ({ onClick, disabled = false, title = "Editar" }) => (
  <Button
    type="button"
    variant="secondary"
    size="icon-sm"
    className="mx-1 my-2"
    onClick={onClick}
    disabled={disabled}
    title={title}
    aria-label={title}
  >
    <Pencil className="size-[18px]" />
  </Button>
);

export const BtnEliminar = ({
  onClick,
  disabled = false,
  title = "Eliminar",
}) => (
  <Button
    type="button"
    variant="destructive"
    size="icon-sm"
    className="mx-1 my-2"
    onClick={onClick}
    disabled={disabled}
    title={title}
    aria-label={title}
  >
    <Trash2 className="size-[18px]" />
  </Button>
);

export const BtnCerrar = ({
  onClick,
  disabled = false,
  title = "Cerrar Modal",
}) => (
  <Button
    type="button"
    variant="default"
    size="icon-sm"
    onClick={onClick}
    disabled={disabled}
    aria-label={title}
    title={title}
  >
    <X className="size-[18px]" />
  </Button>
);

export const BotonesAccionGrupo = ({
  onVer = null,
  onEditar = null,
  onEliminar = null,
  disabledVer = false,
  disabledEditar = false,
  disabledEliminar = false,
}) => (
  <div className="flex gap-2">
    {onVer && <BtnVer onClick={onVer} disabled={disabledVer} />}
    {onEditar && <BtnEditar onClick={onEditar} disabled={disabledEditar} />}
    {onEliminar && (
      <BtnEliminar onClick={onEliminar} disabled={disabledEliminar} />
    )}
  </div>
);
