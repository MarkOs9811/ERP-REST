import { LoaderCircleIcon } from "lucide-react";
import "../../css/EstilosIconoCargando.css";

export function Cargando({ textColor = null }) {
  return (
    <LoaderCircleIcon
      className="cargandoIco girar"
      style={{ color: textColor }}
    />
  );
}
