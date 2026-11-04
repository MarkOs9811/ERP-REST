import { LoaderCircleIcon } from "lucide-react";

export function Cargando({ textColor = null }) {
  return (
    <LoaderCircleIcon
      className="cargandoIco girar"
      style={{ color: textColor }}
    />
  );
}
