import { AlmacenList } from "../../components/componenteAlmacen/AlmacenList";

import "../../css/EstilosAlmacen.css";
import { useNavigate } from "react-router-dom";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { FileText, Plus, Search } from "lucide-react";
import { useState } from "react";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
export function Almacen() {
  const [updateList, setUpdateList] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const handleCloseModal = () => {
    setUpdateList((prev) => !prev);
  };
  const handleAgregar = () => {
    navigate("/almacen/registro");
  };
  return (
    <div>
      <div className="card  h-100 d-flex  shadow-sm py-2  ">
        <div className="card-header border-bottom-0 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h4 className="card-title mb-0 titulo-card-especial">
              Panel de Almacen
            </h4>
            <span className="badge-header">ítems</span>
          </div>

          <div className="d-flex align-items-center flex-wrap gap-2 mt-3 mt-md-0">
            <div className="header-search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Buscar en almacen..."
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <button
              type="button"
              className="btn btn-outline-dark px-3"
              onClick={() => GetReporteExcel("/reporteAlmacenTodo")}
            >
              <FileText size={18} />
              Reporte
            </button>
            <button
              className="btn btn-dark px-3"
              onClick={() => handleAgregar()}
            >
              <Plus size={18} />
              Agregar
            </button>
          </div>
        </div>
        <div
          className="card-body overflow-y-auto overflow-x-hidden p-0 pe-2"
          style={{ height: "calc(100vh - 280px)" }}
        >
          <AlmacenList search={search} updateList={updateList} />
        </div>
      </div>
    </div>
  );
}
