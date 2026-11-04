import { DashboardGrafic } from "../../components/componenteCliente/DashboardGrafic";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardCliente() {
  return (
    <Card className="">
      <CardHeader className="">
        <div>
          <h4 className="font-bold text-fw-main mb-1">Modulo de clientes</h4>
          <p className="text-fw-muted mb-0">
            Aquí está lo que está pasando hoy.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            className="shadow inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-input bg-background text-foreground hover:bg-accent"
            variant="default"
          >
            Exportar Reporte
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-3">
        <DashboardGrafic />
      </CardContent>
    </Card>
  );
}
