import "../../css/EstilosFinanzas.css";
import { FlujoCaja } from "../../components/componentesFinanzas/FlujoCaja";
import { ResumenActivosPasivos } from "../../components/componentesFinanzas/ResumenActivosPasivos";
import { Calculator, ChartColumnBig, PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";

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
      <div className="row g-3">
        <div className="col-md-12">
          <div className="card  py-2">
            <div className="card-header border-bottom-0 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 p-3">
              <div className="d-flex align-items-center">
                <Calculator
                  color={"var(--fw-strawberry)"}
                  height="45px"
                  width="45px"
                  className="me-2"
                />
                <div>
                  <h4 className="card-title mb-0 titulo-card-especial">
                    Presupuestos
                  </h4>
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
                <button
                  className="btn px-3"
                  style={{
                    border: "1px solid var(--fw-border)",
                    backgroundColor: "var(--bg-card)",
                    color: "var(--text-main)",
                  }}
                >
                  <PlusIcon size={18} />
                  Registrar Saldo
                </button>

                <button
                  className="btn px-3"
                  style={{
                    border: "1px solid var(--fw-border)",
                    backgroundColor: "var(--bg-emerald-soft)",
                    color: "var(--fw-emerald)",
                  }}
                >
                  <PlusIcon size={18} />
                  Crear Presupuesto
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12 d-flex  w-100 gap-3">
          <div className="card p-3 w-100 ">
            <div className="card-header border-0 d-flex align-items-center justify-content-between p-3 ">
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
                <button
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
                >
                  <i className="fas fa-calculator"></i> Total
                </button>
                <button
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
                >
                  <i className="fas fa-calendar-alt"></i> Por Mes
                </button>
              </div>
            </div>

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

            <div className="card-body p-0">
              <FlujoCaja modoVista={modoVista} selectedMonth={selectedMonth} />
            </div>
          </div>
          <div className="card  py-2 w-50">
            <div className="card-header border-0 p-3 d-flex align-items-center ">
              <div className="d-flex align-items-center">
                <p className="h4 card-title ms-2 mb-0">Activos y Pasivos</p>
              </div>
            </div>
            <div className="card-body">
              <ResumenActivosPasivos />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
