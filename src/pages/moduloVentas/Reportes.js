import React from "react";
import FormularioReporte from "../../components/componentesReporte/FormularioReporte";

export function Reportes() {
  const handleReporte1 = (data) => {
    console.log("Reporte 1:", data);
    alert("Formulario 1 enviado con éxito");
  };

  const handleReporte2 = (data) => {
    console.log("Reporte 2:", data);
    alert("Formulario 2 enviado con éxito");
  };

  const handleReporte3 = (data) => {
    console.log("Reporte 3:", data);
    alert("Formulario 3 enviado con éxito");
  };

  return (
    <div className="container-fluid w-100 h-100 p-0">
      <div className="card   bg-transparent my-0 flex-grow-1 h-100 d-flex flex-column p-0">
        <div
          className="card-body overflow-x-hidden overflow-y-auto p-0 pe-2"
          style={{ height: "calc(100vh -480px)" }}
        >
          <div className="row g-3 mb-4">
            <div className="col-md-12">
              <h3 className="mb-4">Reportes</h3>{" "}
            </div>
            <FormularioReporte
              titulo="Reporte de Ventas"
              onSubmit={handleReporte1}
            />
            <FormularioReporte
              titulo="Reporte de Compras"
              onSubmit={handleReporte2}
            />
            <FormularioReporte
              titulo="Reporte de Inventarios"
              onSubmit={handleReporte3}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
