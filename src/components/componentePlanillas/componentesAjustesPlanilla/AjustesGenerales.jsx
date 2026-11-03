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
        <h5 className=" mb-0">
          <FileCog className="text-auto" /> Ajustes Generales Planilla
        </h5>
        <div className="d-flex ms-auto mx-2">
          <input type="text" placeholder="Buscar..." className="form-control" />
        </div>
        <Button className="btn btn-sm btn-outline-dark" title="Reporte" variant="default">
          <FileText className="me-1 text-auto" />
          Reporte
        </Button>
        <Button className="btn btn-sm btn-outline-dark mx-2" title="Agregar" variant="default">
          <Plus className=" text-auto" />
        </Button>
      </CardHeader>

      {/* El CondicionCarga maneja el estado de carga y error.
        Dentro, mostramos los ajustes si existen.
      */}
      <CondicionCarga isLoading={isLoading} isError={isError}>
        <CardContent className="p-4">
          {settings ? (
            <div className="row">
              {/* Sección: Día de Pago */}
              <div className="md:col-span-3">
                <div className="p-3 border rounded shadow-sm bg-light h-100">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0 fw-bold d-flex align-items-center">
                      <CalendarDays className="me-2 text-muted" size={20} />
                      Día de Pago
                    </h6>
                    <Button
                      className="btn btn-sm btn-outline-secondary"
                      title="Editar Día de Pago"
                     variant="default">
                      <Edit size={16} />
                    </Button>
                  </div>
                  <hr />
                  <div className="text-center">
                    <p className="fs-1 fw-bolder text-dark mb-0">
                      {/* Usamos optional chaining (?) por seguridad */}
                      {settings?.diaPago}
                    </p>
                    <small className="text-muted d-block">
                      Día del mes para procesar los pagos.
                    </small>
                  </div>
                </div>
              </div>

              {/* Sección: Plantilla de Contrato */}
              <div className="md:col-span-9">
                <div className="p-3 border rounded shadow-sm h-100">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0 fw-bold d-flex align-items-center">
                      <FileText className="me-2 text-muted" size={20} />
                      Plantilla de Contrato
                    </h6>
                    <Button
                      className="btn btn-sm btn-outline-secondary"
                      title="Editar Plantilla"
                     variant="default">
                      <Edit size={16} />
                    </Button>
                  </div>
                  <hr />
                  {/* Usamos un textarea para mostrar texto largo (plantilla)
                    y lo ponemos en readOnly.
                  */}
                  <textarea
                    className="form-control mt-2"
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
              <p className="text-muted">
                No se encontraron datos de configuración.
              </p>
            </div>
          )}
        </CardContent>
      </CondicionCarga>
    </Card>
  );
}
