import { useQuery } from "@tanstack/react-query";
// Importamos los nuevos iconos: CalendarDays y Edit
import { FileCog, FileText, Plus, CalendarDays, Edit } from "lucide-react";
import { GetAjustePlanilla } from "../../../service/accionesPlanilla/GetAjustePlanilla";
import { CondicionCarga } from "../../componentesReutilizables/CondicionCarga";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function AjustesGenerales() {
  const {
    data: ajusteData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ajustesGenerales"],
    queryFn: GetAjustePlanilla,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Accedemos al primer (y probablemente único) objeto de configuración
  const settings = ajusteData && ajusteData.length > 0 ? ajusteData[0] : null;

  console.log("Ajustes:", settings);

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="flex justify-between items-center p-3 border-b">
        <h5 className="mb-0">
          <FileCog className="text-auto" /> Ajustes Generales Planilla
        </h5>
        <div className="flex mx-2">
          <input
            type="text"
            placeholder="Buscar..."
            className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <Button
          className="h-8 gap-2 px-3"
          title="Reporte"
          variant="ghostOutline"
        >
          <FileText className="me-1 text-auto" />
          Reporte
        </Button>
        <Button
          className="shadow h-8 px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-input bg-background text-foreground hover:bg-accent mx-2"
          title="Agregar"
          variant="default"
        >
          <Plus className="text-auto" />
        </Button>
      </CardHeader>

      {/* El CondicionCarga maneja el estado de carga y error.
        Dentro, mostramos los ajustes si existen.
      */}
      <CondicionCarga isLoading={isLoading} isError={isError}>
        <CardContent className="p-4">
          {settings ? (
            <div className="grid grid-cols-12 gap-3">
              {/* Sección: Día de Pago */}
              <div className="col-span-full md:col-span-3">
                <div className="p-3 rounded shadow-sm bg-muted h-full">
                  <div className="flex justify-between items-center mb-2">
                    <h6 className="mb-0 font-bold flex items-center">
                      <CalendarDays
                        className="me-2 text-muted-foreground"
                        size={20}
                      />
                      Día de Pago
                    </h6>
                    <Button
                      className="h-8 px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
                      title="Editar Día de Pago"
                      variant="default"
                    >
                      <Edit size={16} />
                    </Button>
                  </div>
                  <hr />
                  <div className="text-center">
                    <p className="text-4xl font-extrabold text-foreground mb-0">
                      {/* Usamos optional chaining (?) por seguridad */}
                      {settings?.diaPago}
                    </p>
                    <small className="text-muted-foreground block">
                      Día del mes para procesar los pagos.
                    </small>
                  </div>
                </div>
              </div>

              {/* Sección: Plantilla de Contrato */}
              <div className="col-span-full md:col-span-9">
                <div className="p-3 rounded shadow-sm h-full">
                  <div className="flex justify-between items-center mb-2">
                    <h6 className="mb-0 font-bold flex items-center">
                      <FileText
                        className="me-2 text-muted-foreground"
                        size={20}
                      />
                      Plantilla de Contrato
                    </h6>
                    <Button
                      className="h-8 px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
                      title="Editar Plantilla"
                      variant="default"
                    >
                      <Edit size={16} />
                    </Button>
                  </div>
                  <hr />
                  {/* Usamos un textarea para mostrar texto largo (plantilla)
                    y lo ponemos en readOnly.
                  */}
                  <textarea
                    className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                    rows="8"
                    value={settings?.contratoText || ""} // || "" para evitar warnings de componente no controlado
                    readOnly
                    style={{
                      backgroundColor: "#f8f9fa", // Un fondo gris claro
                      cursor: "default", // Cursor normal, no de texto
                      fontSize: "0.9rem",
                    }}
                  ></textarea>
                </div>
              </div>
            </div>
          ) : (
            // Mensaje si no se cargan los settings (incluso después de isLoading=false)
            <div className="text-center p-5">
              <p className="text-muted-foreground">
                No se encontraron datos de configuración.
              </p>
            </div>
          )}
        </CardContent>
      </CondicionCarga>
    </Card>
  );
}
