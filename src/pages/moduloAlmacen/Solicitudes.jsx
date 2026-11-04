import { useState } from "react";
import { SolicitudesLista } from "../../components/componenteAlmacen/SolicitudesLista";

import { Plus, Search } from "lucide-react";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { FormAddSolicitudExterna } from "../../components/componenteAlmacen/componenteSolicitud/FormAddSolicitudExterna";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function Solicitudes() {
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [updateList, setUpdateList] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div>
      <Card className="rounded-2xl border border-border/70 bg-card shadow-sm ring-0 py-2">
        <CardHeader className="flex flex-col items-stretch gap-4 border-b border-border/70 px-5 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-col">
            <h4 className="m-0">Panel de Solicitudes</h4>
            <div>
              <span className="text-muted-foreground text-sm">
                Lista de solicitudes por parte del usuario en ventas
              </span>
            </div>
          </div>
          <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative w-full min-w-0 sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar solicitud..."
                className="h-9 pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button size="lg"
              className="gap-2 px-3 w-full sm:w-auto"
              onClick={setShowModalAdd}
              title="Realiza una solicitud"
              variant="default"
            >
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
