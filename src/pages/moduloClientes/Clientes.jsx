import { FileText, Plus, Search, X } from "lucide-react";
import { ListaClientes } from "../../components/componenteCliente/ListaClientes";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function Clientes() {
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtros, setFiltros] = useState({
    fechaDesde: "",
    fechaHasta: "",
  });

  const limpiarBusqueda = () => {
    setBusqueda("");
  };

  const limpiarFiltros = () => {
    setFiltros({
      fechaDesde: "",
      fechaHasta: "",
    });
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const hayFiltrosActivos =
    busqueda || filtros.fechaDesde || filtros.fechaHasta;

  return (
    <Card className="rounded-2xl border border-border/70 bg-card shadow-sm ring-0">
      <CardHeader className="flex flex-col items-stretch gap-4 border-b border-border/70 px-5 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div>
          <h4 className="text-base font-semibold tracking-tight text-foreground">Lista de clientes</h4>
          <p className="text-muted-foreground mb-0">
            Aquí puedes ver y gestionar todos tus clientes.
          </p>
        </div>
        <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative w-full min-w-0 sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nombre, correo o teléfono..."
              className="h-9 pl-9"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <Button size="icon"
                className="absolute right-1 top-1/2 size-7 -translate-y-1/2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={limpiarBusqueda}
                title="Limpiar búsqueda"
                variant="ghost"
              >
                <X size={16} />
              </Button>
            )}
          </div>

          <Button size="lg"
            className="gap-2 border-violet-200 bg-violet-50 px-3 text-violet-700 shadow-none hover:bg-violet-100 hover:text-violet-800 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-300 dark:hover:bg-violet-900/60 w-full sm:w-auto"
            title="Filtros de fecha de compra"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            variant="outline"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M3 6h18M6 12h12M9 18h6"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="hidden sm:inline">Filtros</span>
          </Button>

          <Button size="lg"
            className="w-full gap-2 px-3 sm:w-auto"
            title="Generar Reporte Completo"
            onClick={() => GetReporteExcel("/reporteClientes")}
            variant="ghostOutline"
          >
            <FileText size={18} />
            <span className="hidden sm:inline">Reporte</span>
          </Button>
        </div>
      </CardHeader>

      {mostrarFiltros && (
        <CardHeader className="border-t" style={{ backgroundColor: "#f8f9fa" }}>
          <div className="grid grid-cols-12 gap-3 items-end">
            <div className="col-span-full sm:col-span-6">
              <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-bold mb-2">
                Última compra desde:
              </label>
              <input
                type="date"
                className="w-full rounded-md border-input bg-background py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs"
                value={filtros.fechaDesde}
                onChange={(e) =>
                  handleFiltroChange("fechaDesde", e.target.value)
                }
              />
            </div>

            <div className="col-span-full sm:col-span-6">
              <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-bold mb-2">
                Última compra hasta:
              </label>
              <input
                type="date"
                className="w-full rounded-md border-input bg-background py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs"
                value={filtros.fechaHasta}
                onChange={(e) =>
                  handleFiltroChange("fechaHasta", e.target.value)
                }
              />
            </div>

            {hayFiltrosActivos && (
              <div className="col-span-full">
                <Button
                  className="shadow h-8 px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-destructive bg-background text-destructive hover:bg-destructive/10"
                  onClick={limpiarFiltros}
                  variant="destructive"
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      )}

      <CardContent className="p-0">
        <ListaClientes busqueda={busqueda} filtros={filtros} />
      </CardContent>
    </Card>
  );
}
