import { useAuth } from "../AuthContext";
import { MesasList } from "../components/componenteVender/MesasList";
// import TuComponenteDeMesas from "../components/componenteVender/ToMesa"; // <- Lo importarás aquí luego

export function LayOutMozo() {
  return (
    <div className="container-fluid p-0">
      {/* Puedes reemplazar este div gris por tu componente <ToMesa /> */}
      <MesasList />{" "}
    </div>
  );
}
