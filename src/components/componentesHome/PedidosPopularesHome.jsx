import { Soup } from "lucide-react";
import { CardContent } from "@/components/ui/card";

export function PedidosPopularesHome() {
  const metrics = {
    platosPopulares: ["Lomo Saltado", "Ceviche", "Arroz con Pollo"],
  };
  return (
    <div className="col-span-full md:col-span-2">
      <div className="dashboard-card h-full">
        <CardContent className="">
          <h5 className="text-foreground mb-3 flex items-center">
            <Soup
              color={"var(--primary-red)"}
              height="20px"
              width="20px"
              className="me-2"
            />
            Platos Más Vendidos
          </h5>
          <ul className="flex flex-col divide-y-0">
            {metrics.platosPopulares.map((plato, index) => (
              <li
                key={index}
                className="relative bg-background text-foreground flex justify-between items-center border-0 px-0 py-2"
              >
                <span className="text-foreground">{plato}</span>
                <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold transition-colors bg-primary rounded-full">
                  {15 - index * 3}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </div>
    </div>
  );
}
