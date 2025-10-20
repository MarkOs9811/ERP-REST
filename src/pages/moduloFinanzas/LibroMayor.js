import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { useQuery } from "@tanstack/react-query";
import { GetLibroMayor } from "../../service/serviceFinanzas/GetLibroMayor";
import { CardCuentaContable } from "../../components/componentesFinanzas/CardCuentasContables";
import { CardResultadoEjercicio } from "../../components/componentesFinanzas/CardResultadoEjercicio";
import {
  BookText,
  ClipboardType,
  ClipboardTypeIcon,
  ExternalLink,
  ExternalLinkIcon,
} from "lucide-react";

export function LibroMayor() {
  const {
    data = {},
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["libroMayor"],
    queryFn: GetLibroMayor,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const registroEjercicio = data.registroEjercicio;
  const movimientos = data.movimientos || {};
  const resultado = data.resultadoEjercicio;
  const totalDebitos = data.totalDebitos || 0;
  const totalCreditos = data.totalCreditos || 0;
  const balance = data.balance || 0;

  return (
    <div>
      <div className="row g-3">
        {/* Header */}
        <div className="col-md-12">
          <div className="card shadow-sm py-2">
            <div className="card-header p-3 d-flex align-items-center">
              <BookText color={"#ea4f4f"} height="45px" width="45px" />
              <p className="h4 card-title ms-2 mb-0">Libro Mayor</p>
              <div className="d-flex ms-auto">
                <button className="btn btn-outline-secondary ms-auto mx-2 d-flex align-items-center p-2">
                  <ClipboardType color={"auto"} className={"mx-2"} />
                  Generar Reporte
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Resultado del ejercicio */}
        <div className="col-md-12">
          <CardResultadoEjercicio
            registroEjercicio={registroEjercicio}
            resultado={resultado}
          />
        </div>

        {/* Cuentas contables */}
        <div className="col-md-12">
          <div className="card shadow-sm py-2 border-0 p-2">
            <div className="d-flex justify-content-between align-items-center p-3">
              <h5 className="mb-0">Cuentas Contables</h5>
              <div className="d-flex" role="group">
                <button
                  className="btn btn-outline-dark p-2 d-flex align-items-center mx-1"
                  style={{ fontSize: "1rem" }}
                >
                  <ClipboardTypeIcon color={"auto"} className={"mx-2"} />
                  Balance y Cierre
                </button>
                <button
                  className="btn btn-danger p-2 d-flex align-items-center mx-1"
                  style={{ fontSize: "1rem" }}
                >
                  <ExternalLink color={"auto"} className={"mx-2"} />
                  Aperturar Cuentas
                </button>
                <button
                  className="btn btn-warning p-2 d-flex align-items-center mx-1"
                  style={{ fontSize: "1.2rem" }}
                >
                  <ExternalLinkIcon color={"auto"} />
                </button>
              </div>
            </div>
            <div className="row">
              {Object.entries(movimientos).map(([nombreCuenta, items]) => (
                <CardCuentaContable
                  key={nombreCuenta}
                  nombreCuenta={nombreCuenta}
                  items={items}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
