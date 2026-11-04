import { ListaPedidosAsignados } from "../../components/componenteDelivery/ListaPedidosAsignados";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export function PedidosAsignados() {
  return (
    <div className="w-full p-0">
      <Card className="">
        <CardHeader className="flex flex-col items-start">
          <CardTitle asChild><h4 className="">Pedidos en ruta</h4></CardTitle>
          <CardDescription asChild><h6 className="mb-2 text-muted-foreground">
            Aquí puedes gestionar los pedidos asignados a los repartidores.
          </h6></CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ListaPedidosAsignados />
        </CardContent>
      </Card>
    </div>
  );
}
