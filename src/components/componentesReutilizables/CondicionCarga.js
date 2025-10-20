import { Cargando } from "./Cargando";
import "../../css/EstilosIconoCargando.css";
export function CondicionCarga({ isLoading, isError, children }) {
  if (isLoading) {
    return (
      <div className="fondo-brillando w-100  d-flex align-items-center justify-content-center p-5 ">
        <Cargando />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-danger text-center m-2" role="alert">
        ⚠️ Error: {"Ha ocurrido un problema inesperado."}
      </div>
    );
  }

  // Si no hay error ni carga, muestra los hijos
  return <>{children}</>;
}
