import {
  AddOutline,
  DocumentTextOutline,
  SettingsOutline,
} from "react-ionicons";

export function AjustesGenerales() {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-header d-flex justify-content-between align-items-center p-3 border-bottom">
        <h4 className=" mb-0">
          <SettingsOutline color={"auto"} /> Ajustes Generales Planilla
        </h4>
        <div className="d-flex ms-auto mx-2">
          <input type="text" placeholder="Buscar..." className="form-control" />
        </div>
        <button className="btn btn-sm btn-outline-dark" title="Reporte">
          <DocumentTextOutline className="me-1" color={"auto"} />
          Reporte
        </button>
        <button className="btn btn-sm btn-outline-dark mx-2" title="Agregar">
          <AddOutline className="" color={"auto"} />
        </button>
      </div>
      <div className="card-body"></div>
    </div>
  );
}
