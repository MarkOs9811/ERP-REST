import { useState } from "react";
import { UsuariosList } from "../../components/componenteUsuario/UsuarioList";
import { UsuarioForm } from "../../components/componenteUsuario/UsuarioForm";

import { FileText, FileUserIcon, Plus, Search } from "lucide-react";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function Usuarios() {
  const [showModal, setShowModal] = useState(false);
  const [updateList, setUpdateList] = useState(false);
  const [search, setSearch] = useState("");
  return (
    <div>
      <Card className="rounded-2xl border border-border/70 bg-card shadow-sm ring-0">
        <CardHeader className="flex flex-col items-stretch gap-4 border-b border-border/70 px-5 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex items-center">
            <CardTitle asChild>
              <h4 className="mb-0 text-base font-semibold tracking-tight text-foreground">
                Panel de Usuarios
                <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">Lista</span>
              </h4>
            </CardTitle>
          </div>

          <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative w-full min-w-0 sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar usuario..."
                className="h-9 pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Button asChild size="lg"
              className="gap-2 border-border bg-background px-3 text-foreground shadow-none hover:bg-muted w-full sm:w-auto"
              variant="outline"
            >
              <Link to="/rrhh/ingreso-a-planilla">Planilla</Link>
            </Button>

            <Button size="lg"
              type="button"
              className="w-full gap-2 px-3 sm:w-auto"
              onClick={() => GetReporteExcel("/reporteUsuarios")}
              variant="ghostOutline"
            >
              <FileText size={18} className="me-1" />
              Reporte
            </Button>

            <Button size="lg"
              className="gap-2 px-3 w-full sm:w-auto"
              onClick={() => setShowModal(true)}
              variant="default"
            >
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
