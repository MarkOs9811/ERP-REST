import { AlmacenRegister } from "../../components/componenteAlmacen/AlmacenRegister";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export function Registro() {
  return (
    <div>
      <Card className="my-0 flex-grow-1 h-full flex flex-col py-2 m-0 shadow-sm">
        <CardHeader className="border-bottom-0 flex flex-col flex-md-row justify-between items-center gap-2 p-3">
          <div className="d-flex align-items-center">
            <CardTitle asChild><h4 className="mb-0 titulo-card-especial">
              Registro de activos/productos
            </h4></CardTitle>
          </div>
        </CardHeader>
        <CardContent className="">
          <AlmacenRegister />
        </CardContent>
      </Card>
    </div>
  );
}
