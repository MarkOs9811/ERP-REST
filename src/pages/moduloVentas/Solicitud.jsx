import { SolicitudesList } from "../../components/componentesModuloVentas/SolicitudesList";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function Solicitud() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const handleGoAddSolicitud = () => {
    navigate("/ventas/solicitud/realizarSolicitud");
  };
  return (
    <div className="grid grid-cols-12 gap-3">
      <div className="col-span-full">
        <Card className="rounded-2xl border border-border/70 bg-card shadow-sm ring-0">
          <CardHeader className="flex flex-col items-stretch gap-4 border-b border-border/70 px-5 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex items-center">
              <CardTitle asChild>
                <h4 className="mb-0">
                  Mis Solicitudes
                  <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">Almacén</span>
                </h4>
              </CardTitle>
            </div>

            <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <div className="relative w-full min-w-0 sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="h-9 pl-9"
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button size="lg"
                className="gap-2 px-3 w-full sm:w-auto"
                onClick={() => handleGoAddSolicitud()}
                variant="default"
              >
                <Plus size={18} className="me-1" />
                Nueva Solicitud
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <SolicitudesList search={search} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
