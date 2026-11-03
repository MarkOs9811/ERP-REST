import { TransferirAlmacen } from "../../components/componenteAlmacen/TransferirAlmacen";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


export function Transferencias() {
  return (
    <div>
      <Card className="py-2">
        {/* Usamos d-flex flex-column y align-items-start para pegar todo a la izquierda */}
        <CardHeader className="flex flex-col items-start border-b bg-transparent">
          <div>
            <h4 className="m-0">Transferencias de activos y productos</h4>
            <span className="text-muted small">
              Enfocado para mover productos al inventario de ventas
            </span>
          </div>
        </CardHeader>

        <CardContent className="">
          <TransferirAlmacen />
        </CardContent>
      </Card>
    </div>
  );
}
