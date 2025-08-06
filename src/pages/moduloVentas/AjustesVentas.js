import { useState } from "react";
import "../../css/EstilosVentas.css";
import MetodoPago from "../../components/componentesVentas/componentesAjustesVentas/MetodoPago";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
export default function AjustesVentas() {
  // Simulated list of payment methods
  const [metodos, setMetodos] = useState([
    { id: 1, nombre: "Visa", estado: 1 },
    { id: 2, nombre: "MasterCard", estado: 0 },
    { id: 3, nombre: "PayPal", estado: 1 },
    { id: 4, nombre: "Stripe", estado: 0 },
  ]);

  // Handle the switch toggle
  const handleToggle = (id) => {
    setMetodos((prev) =>
      prev.map((metodo) =>
        metodo.id === id
          ? { ...metodo, estado: metodo.estado === 1 ? 0 : 1 }
          : metodo
      )
    );
  };

  return (
    <ContenedorPrincipal>
      <div className="row g-3">
        <div className="col-lg-12">
          <h4>Configuracion Ventas</h4>
        </div>
        <div className="col-lg-12">
          <MetodoPago metodos={metodos} onToggle={handleToggle} />
        </div>
      </div>
    </ContenedorPrincipal>
  );
}
