import { useState } from "react";
import { UsuariosList } from "../../components/componenteUsuario/UsuarioList";
import { UsuarioForm } from "../../components/componenteUsuario/UsuarioForm";

import { FileText, FileUserIcon, Plus, Search } from "lucide-react";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export function Usuarios() {
  const [showModal, setShowModal] = useState(false);
  const [updateList, setUpdateList] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  return (
    <div>
      <Card className="">
        <CardHeader className="flex flex-col flex-md-row justify-between items-center gap-2 p-3">
          <div className="d-flex align-items-center">
            <CardTitle asChild><h4 className="mb-0 titulo-card-especial">
              Panel de Usuarios
              <span className="badge-header ms-2">Lista</span>
            </h4></CardTitle>
          </div>

          <div className="d-flex  gap-2 mt-3 mt-md-0 align-items-center ms-auto">
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

            <Button
              className="btn btn-outline-dark px-3"
              onClick={() => navigate("/rrhh/ingreso-a-planilla")}
             variant="default">
              Planilla
            </Button>

            <Button
              type="button"
              className="btn btn-outline-dark px-3"
              onClick={() => GetReporteExcel("/reporteUsuarios")}
             variant="default">
              <FileText size={18} className="me-1" />
              Reporte
            </Button>

            <Button
              className="btn btn-dark px-3"
              onClick={() => setShowModal(true)}
             variant="default">
              <Plus size={18} />
              Agregar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="cuerpo-tabla p-0">
          <UsuariosList search={search} updateList={updateList} />
        </CardContent>
      </Card>

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
