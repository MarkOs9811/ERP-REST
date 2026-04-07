import { useState } from "react";
import { UsuariosList } from "../../components/componenteUsuario/UsuarioList";
import { UsuarioForm } from "../../components/componenteUsuario/UsuarioForm";

import { FileText, FileUserIcon, Plus, Search } from "lucide-react";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { useNavigate } from "react-router-dom";

export function Usuarios() {
  const [showModal, setShowModal] = useState(false);
  const [updateList, setUpdateList] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  return (
    <div>
      <div className="card shadow-sm">
        <div className="card-header border-bottom-0 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 p-3">
          <div className="d-flex align-items-center">
            <h4 className="card-title mb-0 titulo-card-especial">
              Panel de Usuarios
              <span className="badge-header">Activos</span>
            </h4>
          </div>

          <div className="d-flex flex-wrap gap-2 mt-3 mt-md-0 align-items-center ms-auto">
            <div className="header-search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Buscar usuario..."
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              className="btn btn-outline-dark px-3"
              onClick={() => navigate("/rrhh/ingreso-a-planilla")}
            >
              Ingreso a Planilla
            </button>

            <button
              type="button"
              className="btn btn-outline-dark px-3"
              onClick={() => GetReporteExcel("/reporteUsuarios")}
            >
              <FileText size={18} className="me-1" />
              Reporte
            </button>

            <button
              className="btn btn-dark px-3"
              onClick={() => setShowModal(true)}
            >
              <Plus size={18} />
              Agregar
            </button>
          </div>
        </div>
        <div className="card-body cuerpo-tabla p-0">
          <UsuariosList search={search} updateList={updateList} />
        </div>
      </div>

      <ModalRight
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        hideFooter={true}
        title={"Agregar nuevo usuario"}
      >
        {({ handleClose }) => <UsuarioForm handleCloseModal={handleClose} />}
      </ModalRight>
    </div>
  );
}
