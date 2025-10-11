import { FileCog, FileText, Plus } from "lucide-react";

export function AjustesGenerales() {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-header d-flex justify-content-between align-items-center p-3 border-bottom">
        <h5 className=" mb-0">
          <FileCog className="text-auto" /> Ajustes Generales Planilla
        </h5>
        <div className="d-flex ms-auto mx-2">
          <input type="text" placeholder="Buscar..." className="form-control" />
        </div>
        <button className="btn btn-sm btn-outline-dark" title="Reporte">
          <FileText className="me-1 text-auto" />
          Reporte
        </button>
        <button className="btn btn-sm btn-outline-dark mx-2" title="Agregar">
          <Plus className=" text-auto" />
        </button>
      </div>
      <div className="card-body"></div>
    </div>
  );
}
