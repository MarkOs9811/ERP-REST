import { AlmacenList } from "../../components/componenteAlmacen/AlmacenList";


import { useNavigate } from "react-router-dom";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { FileText, Plus, Search } from "lucide-react";
import { useState } from "react";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
      <Card className="rounded-2xl border border-border/70 bg-card shadow-sm ring-0 flex py-2">
        <CardHeader className="flex flex-col items-stretch gap-4 border-b border-border/70 px-5 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="module-table-toolbar">
            <div className="module-table-title-group">
              <CardTitle asChild>
                <h4 className="mb-0 text-base font-semibold tracking-tight text-foreground">Panel de Almacen</h4>
              </CardTitle>
              <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">ítems</span>
            </div>

            <div className="flex items-center gap-2 mt-3 md:mt-0">
              <div className="relative w-full min-w-0 sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar en almacen..."
                  className="h-9 pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="module-table-buttons">
                <Button size="lg"
                  type="button"
                  className="w-full gap-2 px-3 sm:w-auto"
                  onClick={() => GetReporteExcel("/reporteAlmacenTodo")}
                  variant="ghostOutline"
                >
                  <FileText size={18} />
                  Reporte
                </Button>
                <Button size="lg"
                  className="gap-2 px-3 w-full sm:w-auto"
                  onClick={() => handleAgregar()}
                  variant="default"
                >
                  <Plus size={18} />
                  Agregar
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent
          className="overflow-y-auto overflow-x-hidden p-0 pe-2"
          style={{ height: "calc(100vh - 280px)" }}
        >
          <AlmacenList search={search} updateList={updateList} />
        </CardContent>
      </Card>
    </div>
  );
}
