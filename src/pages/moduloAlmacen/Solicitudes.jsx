import { useState } from "react";
import { SolicitudesLista } from "../../components/componenteAlmacen/SolicitudesLista";

import { Plus, Search } from "lucide-react";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { FormAddSolicitudExterna } from "../../components/componenteAlmacen/componenteSolicitud/FormAddSolicitudExterna";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


export function Solicitudes() {
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [updateList, setUpdateList] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div>
      <Card className="shadow-sm py-2">
        <CardHeader className="flex flex-col border-bottom-0 flex flex-col flex-md-row justify-between items-center gap-2">
          <div className="d-flex flex-column">
            <h4 className="m-0">Panel de Solicitudes</h4>
            <div>
              <span className="text-muted small">
                Lista de solicitudes por parte del usuario en ventas
              </span>
            </div>
          </div>
          <div className="d-flex align-items-center  gap-2 mt-3 mt-md-0">
            <div className="header-search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Buscar solicitud..."
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              className="btn btn-dark px-4"
              onClick={setShowModalAdd}
              title="Realiza una solicitud"
             variant="default">
              <Plus size={18} />
              Agregar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <SolicitudesLista search={search} updateList={updateList} />
        </CardContent>
      </Card>

      <ModalRight
        isOpen={showModalAdd}
        onClose={() => setShowModalAdd(false)}
        hideFooter={true}
        title={"Agrega una nueva solicitud"}
        subtitulo={"Genera una nueva solicitud a un proveedor"}
        width="40%"
      >
        {({ handleClose }) => <FormAddSolicitudExterna onClose={handleClose} />}
      </ModalRight>
    </div>
  );
}
