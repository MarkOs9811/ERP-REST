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
    <div className="md:col-span-4">
      <Card className="h-full">
        <CardContent className="">
          <h5 className="text-dark mb-3 d-flex align-items-center">
            <ShoppingCart
              color={"var(--dark-red)"}
              height="20px"
              width="20px"
              className="me-2"
            />
            Pedidos Web Pendientes
          </h5>
          <div className="list-group list-group-flush">
            {metrics.pedidosWeb.map((pedido) => (
              <div
                key={pedido.id}
                className="list-group-item border-0 px-0 py-2"
              >
                <div className="d-flex justify-content-between">
                  <span className="fw-semibold">{pedido.cliente}</span>
                  <span
                    className={`badge ${
                      pedido.estado === "En preparación"
                        ? "bg-warning"
                        : "bg-secondary"
                    }`}
                  >
                    {pedido.estado}
                  </span>
                </div>
                <div className="d-flex justify-content-between mt-1">
                  <small className="text-muted">Tiempo: {pedido.tiempo}</small>
                  <Button className="btn btn-sm btn-outline-primary" variant="default">
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
