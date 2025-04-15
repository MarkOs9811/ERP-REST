import React, { useState } from "react";
import "../../css/EstilosVentas.css";
import MetodoPago from "../../components/componentesVentas/componentesAjustesVentas/MetodoPago";
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
    <div className="container-fluid w-100 h-100 p-0 m-0">
      <div className="card bg-transparent my-0 flex-grow-1 h-100 d-flex flex-column p-0">
        <div
          className="card-body overflow-x-hidden overflow-y-auto p-0 pe-2"
          style={{ height: "calc(100vh -480px)" }}
        >
          <div className="row g-3">
            <div className="col-lg-12">
              <h4>Configuracion Ventas</h4>
            </div>
            <div className="col-lg-12">
              <MetodoPago metodos={metodos} onToggle={handleToggle} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
