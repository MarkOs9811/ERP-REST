import { RefreshCcw } from "lucide-react";
import { useEffect } from "react";
import "../../css/EstilosIconoCargando.css";

export function Cargando() {
  useEffect(() => {
    // Hacer girar icono
    const icono = document.querySelector(".cargandoIco");
    if (icono) {
      icono.classList.add("girar");
    }
  }, []);
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <RefreshCcw className="text-auto cargandoIco" />
    </div>
  );
}
