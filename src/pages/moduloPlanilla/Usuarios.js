import { useState } from "react";
import { UsuariosList } from "../../components/componenteUsuario/UsuarioList";
import { UsuarioForm } from "../../components/componenteUsuario/UsuarioForm";

import {
  FileChartColumnIncreasing,
  FileUserIcon,
  PlusIcon,
} from "lucide-react";
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
      <div className="card border-0 shadow-sm py-2">
        <div className="card-header border-bottom d-flex justify-content-between align-items-center">
          <div className="m-2">
            <h4 className="card-title mb-0 titulo-card-especial">
              Lista de Usuarios
            </h4>
          </div>

          <div className="d-flex gap-2">
            <div className="d-flex">
              <input
                type="text"
                placeholder="Buscar..."
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              className="btn  btn-outline-dark w-auto"
              onClick={() => setShowModal(true)}
            >
              <PlusIcon className="text-auto" />
              Crear usuario rapido
            </button>

            <button
              className="btn  btn-outline-dark"
              onClick={() => navigate("/rrhh/ingreso-a-planilla")}
            >
              <FileUserIcon className="text-auto" /> Ingreso a planilla
            </button>

            <button
              type="button"
              className="btn btn-dark"
              onClick={() => GetReporteExcel("/reporteUsuarios")}
              title="Descargar Reporte de usuarios"
            >
              <FileChartColumnIncreasing className="text-auto" />
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
