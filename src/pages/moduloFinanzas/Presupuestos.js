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
            <div className="card-header p-3 d-flex align-items-center">
              <Calculator color={"#ea4f4f"} height="45px" width="45px" />
              <div>
                <p className="h4 card-title ms-2 mb-0">Presupuestos</p>
                <small
                  className=" ms-2 text-secondary"
                  style={{ fontWeight: "none" }}
                >
                  Administra y crea presupuestos, carga inicial de caja y
                  compara.
                </small>
              </div>

              <div className="d-flex ms-auto">
                <button className="btn btn-outline-primary ms-auto mx-2  d-flex align-items-center p-2">
                  <PlusIcon className={"text-auto mx-2"} />
                  Registrar saldo
                </button>

                <button className="btn btn-outline-dark ms-auto mx-2 d-flex align-items-center p-2">
                  <PlusIcon className={"text-auto mx-2"} />
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
