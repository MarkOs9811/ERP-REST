import { useState } from "react";

import { ProveedorAdd } from "../../components/componenteProveedor/ProveedorAdd";
import { FileText, Plus, Search } from "lucide-react";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";
import { ProveedorList } from "../../components/componenteProveedor/ProveedorList";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export function Proveedores() {
  const [search, setSearch] = useState("");
  const [updateList, setUpdateList] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddProveedor = () => setShowModal(true);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-12">
          <CondicionCarga isLoading={updateList} isError={null}>
            <Card className="mb-4 rounded-2xl">
              <CardHeader className="border-bottom-0 flex justify-between items-center">
                <div className="d-flex align-items-center">
                  <CardTitle asChild><h4 className="mb-0 titulo-card-especial">
                    Panel de Proveedores
                  </h4></CardTitle>
                  <span className="badge-header ms-2">Activos</span>
                </div>

                <div className="d-flex align-items-center  gap-2 mt-3 mt-md-0">
                  <div className="header-search-container">
                    <Search className="search-icon" />
                    <input
                      type="text"
                      placeholder="Buscar proveedor..."
                      className="form-control"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  <Button
                    type="button"
                    className="btn btn-outline-dark px-3"
                    onClick={() =>
                      GetReporteExcel(
                        "/reporteProveedores",
                        null,
                        null,
                        "Proveedores",
                      )
                    }
                   variant="default">
                    <FileText size={18} />
                    Reporte
                  </Button>

                  <Button
                    className="btn btn-dark px-4"
                    onClick={() => handleAddProveedor()}
                   variant="default">
                    <Plus size={18} />
                    Agregar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ProveedorList search={search} updateList={updateList} />
              </CardContent>
            </Card>
          </CondicionCarga>
        </div>
      </div>

      {/* Modal para agregar usuario*/}
      <ModalRight
        isOpen={showModal}
        onClose={handleCloseModal}
        hideFooter={true}
        title={"Agregar nuevo proveedor"}
      >
        {({ handleClose }) => <ProveedorAdd handleCloseModal={handleClose} />}
      </ModalRight>
    </div>
  );
}
