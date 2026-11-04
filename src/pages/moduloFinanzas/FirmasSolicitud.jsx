import { File, Mail } from "lucide-react";
import { FormularioFirmarDoc } from "../../components/componentesFinanzas/FormularioFirmarDoc";
import { ListaDocumentosFirmados } from "../../components/componentesFinanzas/ListaDocumentosFirmados";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export function FirmasSolicitud() {
  return (
    <div>
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-full md:col-span-12">
          <Card className="py-2">
            <CardHeader className="p-3 flex items-center border-0">
              <Mail color={"var(--fw-strawberry)"} height="45px" width="45px" />
              <div>
                <CardTitle asChild>
                  <p className="h4 ms-2 mb-0">Firmar solicitud</p>
                </CardTitle>
                <small
                  className="ms-2 text-muted-foreground"
                  style={{ fontWeight: "none" }}
                >
                  Firma solicitudes de compras y pedidos.
                </small>
              </div>

              <div className="flex ms-auto">
                <Button
                  className="shadow justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-input bg-background text-foreground hover:bg-accent mx-2 flex items-center p-2"
                  variant="default"
                >
                  <File className={"mx-2 text-auto"} />
                  Reportes
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>
        <div className="col-span-full md:col-span-6">
          <Card className="py-2">
            <FormularioFirmarDoc />
          </Card>
        </div>
        <div className="col-span-full md:col-span-6">
          <Card className="py-2">
            <ListaDocumentosFirmados />
          </Card>
        </div>
      </div>
    </div>
  );
}
