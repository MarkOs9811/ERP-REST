import FormularioReporte from "../../components/componentesReporte/FormularioReporte";

export function ReportesAlmacen() {
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
      <div className="card bg-transparent my-0 flex-grow-1 h-100 d-flex flex-column p-0 m-0">
        <div
          className="card-body overflow-y-auto overflow-x-hidden p-0 pe-2"
          style={{ height: "calc(100vh - 280px)" }}
        >
          <div className="card shadow-sm p-3">
            <h3 className="mb-4">Reportes</h3>
            <div className="row g-3 mb-4">
              <FormularioReporte
                titulo="Reporte de Almacen"
                onSubmit={handleReporte1}
              />
              <FormularioReporte
                titulo="Reporte de Movimientos"
                onSubmit={handleReporte2}
              />
              <FormularioReporte
                titulo="Reporte de Kardex"
                onSubmit={handleReporte3}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
