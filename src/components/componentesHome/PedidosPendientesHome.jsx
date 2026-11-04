import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function PedidosPendientesHome() {
  const metrics = {
    pedidosWeb: [
      {
        id: 1,
        cliente: "Cliente Web #1254",
        estado: "En preparación",
        tiempo: "15 min",
      },
      {
        id: 2,
        cliente: "Cliente Web #1255",
        estado: "Pendiente",
        tiempo: "5 min",
      },
    ],
  };

  return (
    <div className="col-span-full md:col-span-4">
      <Card className="h-full">
        <CardContent className="">
          <h5 className="text-foreground mb-3 flex items-center">
            <ShoppingCart
              color={"var(--dark-red)"}
              height="20px"
              width="20px"
              className="me-2"
            />
            Pedidos Web Pendientes
          </h5>
          <div className="flex flex-col divide-y-0">
            {metrics.pedidosWeb.map((pedido) => (
              <div
                key={pedido.id}
                className="relative block bg-background text-foreground border-0 px-0 py-2"
              >
                <div className="flex justify-between">
                  <span className="font-semibold">{pedido.cliente}</span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                      pedido.estado === "En preparación"
                        ? "bg-amber-500"
                        : "bg-secondary"
                    }`}
                  >
                    {pedido.estado}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <small className="text-muted-foreground">
                    Tiempo: {pedido.tiempo}
                  </small>
                  <Button
                    className="h-8 px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
                    variant="default"
                  >
                    Ver detalle
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
