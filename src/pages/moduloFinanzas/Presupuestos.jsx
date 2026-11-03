import "../../css/EstilosFinanzas.css";
import { FlujoCaja } from "../../components/componentesFinanzas/FlujoCaja";
import { ResumenActivosPasivos } from "../../components/componentesFinanzas/ResumenActivosPasivos";
import { Calculator, ChartColumnBig, PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export function Presupuestos() {
  const [modoVista, setModoVista] = useState("total");
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const labelMesSeleccionado = useMemo(() => {
    if (!selectedMonth) return "";
    const [year, month] = selectedMonth.split("-");
    const fecha = new Date(Number(year), Number(month) - 1, 1);

    return fecha.toLocaleDateString("es-PE", {
      month: "long",
      year: "numeric",
    });
  }, [selectedMonth]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-12">
          <Card className="py-2">
            <CardHeader className="border-bottom-0 flex flex-col flex-md-row justify-between items-center gap-2 p-3">
              <div className="d-flex align-items-center">
                <Calculator
                  color={"var(--fw-strawberry)"}
                  height="45px"
                  width="45px"
                  className="me-2"
                />
                <div>
                  <CardTitle asChild><h4 className="mb-0 titulo-card-especial">
                    Presupuestos
                  </h4></CardTitle>
                  <small
                    className="fw-flow-description"
                    style={{ fontWeight: "normal" }}
                  >
                    Administra y crea presupuestos, carga inicial de caja y
                    compara.
                  </small>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-3 mt-md-0 align-items-center ms-auto">
                <Button
                  className="btn px-3"
                  style={{
                    border: "1px solid var(--fw-border)",
                    backgroundColor: "var(--bg-card)",
                    color: "var(--text-main)",
                  }}
                 variant="default">
                  <PlusIcon size={18} />
                  Registrar Saldo
                </Button>

                <Button
                  className="btn px-3"
                  style={{
                    border: "1px solid var(--fw-border)",
                    backgroundColor: "var(--bg-emerald-soft)",
                    color: "var(--fw-emerald)",
                  }}
                 variant="default">
                  <PlusIcon size={18} />
                  Crear Presupuesto
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>
        <div className="md:col-span-12 d-flex  w-100 gap-3">
          <Card className="p-3 w-full">
            <CardHeader className="border-0 flex items-center justify-between p-3">
              <div className="d-flex align-items-center">
                <ChartColumnBig
                  color="var(--fw-emerald)"
                  height="32px"
                  width="32px"
                  className="me-3"
                />
                <div>
                  <h6 className=" mb-0">Flujo de Caja</h6>
                  <small className="text-muted">
                    Monitorea y gestiona el flujo de caja para asegurar la
                    liquidez.
                  </small>
                </div>
              </div>
              <div
                className="btn-group"
                role="group"
                aria-label="Botones de Flujo de Caja"
              >
                <Button
                  type="button"
                  className="btn"
                  style={{
                    border: "1px solid var(--fw-border)",
                    backgroundColor:
                      modoVista === "total"
                        ? "var(--bg-emerald-soft)"
                        : "var(--bg-card)",
                    color:
                      modoVista === "total"
                        ? "var(--fw-emerald)"
                        : "var(--text-main)",
                  }}
                  onClick={() => setModoVista("total")}
                 variant="default">
                  <i className="fas fa-calculator"></i> Total
                </Button>
                <Button
                  type="button"
                  className="btn"
                  title="Ultimo Mes"
                  style={{
                    border: "1px solid var(--fw-border)",
                    backgroundColor:
                      modoVista === "mes"
                        ? "var(--bg-saffron-soft)"
                        : "var(--bg-card)",
                    color:
                      modoVista === "mes"
                        ? "var(--fw-saffron)"
                        : "var(--text-main)",
                  }}
                  onClick={() => setModoVista("mes")}
                 variant="default">
                  <i className="fas fa-calendar-alt"></i> Por Mes
                </Button>
              </div>
            </CardHeader>

            <div className="px-3 pb-2 d-flex justify-content-end align-items-center gap-2">
              {modoVista === "mes" && (
                <>
                  <small className="text-muted text-capitalize">
                    {labelMesSeleccionado}
                  </small>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="form-control"
                    style={{ maxWidth: "210px" }}
                  />
                </>
              )}
            </div>

            <CardContent className="p-0">
              <FlujoCaja modoVista={modoVista} selectedMonth={selectedMonth} />
            </CardContent>
          </Card>
          <Card className="py-2 w-50">
            <CardHeader className="border-0 p-3 flex items-center">
              <div className="d-flex align-items-center">
                <CardTitle asChild><p className="h4 ms-2 mb-0">Activos y Pasivos</p></CardTitle>
              </div>
            </CardHeader>
            <CardContent className="">
              <ResumenActivosPasivos />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
