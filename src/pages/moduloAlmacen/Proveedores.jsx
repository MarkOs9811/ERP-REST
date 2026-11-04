import { useState } from "react";

import { ProveedorAdd } from "../../components/componenteProveedor/ProveedorAdd";
import { FileText, Plus, Search } from "lucide-react";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";
import { ProveedorList } from "../../components/componenteProveedor/ProveedorList";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-full md:col-span-12">
          <CondicionCarga isLoading={updateList} isError={null}>
            <Card className="rounded-2xl border border-border/70 bg-card shadow-sm ring-0 mb-4">
              <CardHeader className="flex flex-col items-stretch gap-4 border-b border-border/70 px-5 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div className="flex items-center">
                  <CardTitle asChild>
                    <h4 className="mb-0 text-base font-semibold tracking-tight text-foreground">
                      Panel de Proveedores
                    </h4>
                  </CardTitle>
                  <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">Activos</span>
                </div>

                <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
                  <div className="relative w-full min-w-0 sm:w-64">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Buscar proveedor..."
                      className="h-9 pl-9"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  <Button size="lg"
                    type="button"
                    className="w-full gap-2 px-3 sm:w-auto"
                    onClick={() =>
                      GetReporteExcel(
                        "/reporteProveedores",
                        null,
                        null,
                        "Proveedores",
                      )
                    }
                    variant="ghostOutline"
                  >
                    <FileText size={18} />
                    Reporte
                  </Button>

                  <Button size="lg"
                    className="gap-2 px-3 w-full sm:w-auto"
                    onClick={() => handleAddProveedor()}
                    variant="default"
                  >
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
