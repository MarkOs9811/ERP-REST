import {
  Calendar,
  Salad,
  ShoppingCart,
  UserRound,
  WalletMinimal,
  Warehouse,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";


export function AccesosRapidos() {
  return (
    <div className="container">
      <Card className="h-full flex">
        <CardContent className="flex">
          <h5 className="text-dark mb-3">Accesos Rápidos</h5>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 text-dark ">
            {[
              {
                icon: (
                  <ShoppingCart color={"auto"} height="30px" width="30px" />
                ),
                title: "Nueva Venta",
                className: "access-sales",
              },
              {
                icon: <Salad color={"auto"} height="30px" width="30px" />,
                title: "Gestión Platos",
                className: "access-menu",
              },
              {
                icon: <Warehouse color={"auto"} height="30px" width="30px" />,
                title: "Almacén",
                className: "access-inventory",
              },
              {
                icon: (
                  <WalletMinimal color={"auto"} height="30px" width="30px" />
                ),
                title: "Finanzas",
                className: "access-finance",
              },
              {
                icon: <UserRound color={"auto"} height="30px" width="30px" />,
                title: "Recursos Humanos",
                className: "access-hr",
              },
              {
                icon: <Calendar color={"auto"} height="30px" width="30px" />,
                title: "Incidencias",
                className: "access-issues",
              },
            ].map((item, index) => (
              <div key={index} className="col-6">
                <div
                  className={`dashboard-card quick-access ${item.className} text-dark text-center p-2`}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex flex-column align-items-center ">
                    <div className="mb-2 bg-transparent">{item.icon}</div>
                    <small>{item.title}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
