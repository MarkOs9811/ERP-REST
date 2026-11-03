import { ListaMisEntregas } from "../../components/componenteDelivery/ListaMisEntregas";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


export function MisEntregas() {
  return (
    <Card className="">
      <CardHeader className="">
        <h3>Mis entregas</h3>
      </CardHeader>
      <CardContent className="p-0">
        <ListaMisEntregas />
      </CardContent>
    </Card>
  );
}
