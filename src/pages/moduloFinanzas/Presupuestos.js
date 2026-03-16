import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import "../../css/EstilosFinanzas.css";
import { FlujoCaja } from "../../components/componentesFinanzas/FlujoCaja";
import { ResumenActivosPasivos } from "../../components/componentesFinanzas/ResumenActivosPasivos";
import { Calculator, ChartColumnBig, Plus, PlusIcon } from "lucide-react";

export function Presupuestos() {
  return (
    <div>
      <div className="row g-3">
        <div className="col-md-12">
          <div className="card shadow-sm py-2">
            <div className="card-header border-bottom-0 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 p-3">
              <div className="d-flex align-items-center">
                <Calculator color={"#ea4f4f"} height="45px" width="45px" className="me-2" />
                <div>
                  <h4 className="card-title mb-0 titulo-card-especial">Presupuestos</h4>
                  <small className="text-secondary" style={{ fontWeight: "normal" }}>
                    Administra y crea presupuestos, carga inicial de caja y compara.
                  </small>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-3 mt-md-0 align-items-center ms-auto">
                <button className="btn btn-outline-dark px-3">
                  <PlusIcon size={18} />
                  Registrar Saldo
                </button>

                <button className="btn btn-dark px-3">
                  <PlusIcon size={18} />
                  Crear Presupuesto
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12 d-flex  w-100 gap-3">
          <div className="card shadow-card border-0 p-3 w-100 shadow-sm">
            <div className="card-header d-flex align-items-center justify-content-between p-3 text-primary">
              <div className="d-flex align-items-center">
                <ChartColumnBig
                  color="#0971AC"
                  height="32px"
                  width="32px"
                  className="me-3"
                />
                <div>
                  <h6 className="card-title mb-0">Flujo de Caja</h6>
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
                <button type="button" className="btn btn-outline-custom active">
                  <i className="fas fa-calculator"></i> Total
                </button>
                <button
                  type="button"
                  className="btn btn-outline-custom"
                  title="Ultimo Mes"
                >
                  <i className="fas fa-calendar-alt"></i> Por Mes
                </button>
              </div>
            </div>
            <div className="card-body p-0">
              <FlujoCaja />
            </div>
          </div>
          <div className="card shadow-sm py-2 w-50">
            <div className="card-header p-3 d-flex align-items-center ">
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
