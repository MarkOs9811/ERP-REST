import { DashboardGrafic } from "../../components/componenteCliente/DashboardGrafic";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


export function DashboardCliente() {
  return (
    <Card className="">
      <CardHeader className="">
        <div>
          <h4 className="fw-bold text-fw-main mb-1">Modulo de clientes</h4>
          <p className="text-fw-muted mb-0">
            Aquí está lo que está pasando hoy.
          </p>
        </div>

        <div className="d-flex gap-3">
          <Button className="btn btn-outline-dark" variant="default">Exportar Reporte</Button>
        </div>
      </CardHeader>
      <CardContent className="px-3">
        <DashboardGrafic />
      </CardContent>
    </Card>
  );
}
