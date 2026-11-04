import { AlmacenRegister } from "../../components/componenteAlmacen/AlmacenRegister";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export function Registro() {
  return (
    <div>
      <Card className="grow h-full flex flex-col py-2 m-0 shadow-sm">
        <CardHeader className="border-b-0 flex flex-col md:flex-row justify-between items-center gap-2 p-3">
          <div className="flex items-center">
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
