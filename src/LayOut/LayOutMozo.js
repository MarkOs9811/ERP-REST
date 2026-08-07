import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { MesasList } from "../components/componenteVender/MesasList";
// import TuComponenteDeMesas from "../components/componenteVender/ToMesa"; // <- Lo importarás aquí luego

export function LayOutMozo() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const cargoUsuario = user?.empleado?.cargo?.nombre?.toLowerCase();
  // Sacamos el nombre del usuario para darle un toque más personalizado
  const nombreMozo = user?.empleado?.nombres || "Mozo";

  return (
    <div className="container-fluid p-3 p-md-4">
      {/* 1. ENCABEZADO: Saludo y atajo rápido */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 ">
        <div>
          <h1 className="h3 mb-1 fw-bold text-dark">
            Bienvenido, <span className="text-capitalize">{nombreMozo}</span> 👋
          </h1>
          <p className="text-muted mb-0">
            Panel de salón - Rol:{" "}
            <span className="text-capitalize fw-semibold text-primary">
              {cargoUsuario}
            </span>
          </p>
        </div>
      </div>

      {/* 2. ESPACIO PARA LAS MESAS (El mapa del salón) */}
      <div className="row">
        <div className="col-12">
          {/* Puedes reemplazar este div gris por tu componente <ToMesa /> */}
          <MesasList />{" "}
        </div>
      </div>
    </div>
  );
}
