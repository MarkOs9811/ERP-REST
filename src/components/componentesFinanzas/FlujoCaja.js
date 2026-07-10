import { useQuery } from "@tanstack/react-query";
import { GetPresupuestos } from "../../service/serviceFinanzas/GetPresupuestos";

const normalizarNumero = (valor) => Number(valor ?? 0);

const CAMPOS_FLUJO = [
  "ventasContado",
  "ventasCreditoCobradas",
  "comprasContado",
  "comprasCreditoPagadas",
  "pagosPersonal",
  "inversionesActivos",
  "prestamosRecibidos",
  "pagoDeudas",
];

const crearFlujoVacio = () =>
  CAMPOS_FLUJO.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});

export function FlujoCaja({ modoVista = "total", selectedMonth = "" }) {
  // Disparamos la petición a Laravel pasando el mes si estamos en vista "Por Mes"
  const mesFiltro = modoVista === "mes" ? selectedMonth : null;

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["presupuestos", mesFiltro],
    queryFn: GetPresupuestos,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // 1. Extraemos directamente el objeto flujoCaja que ya calculó Laravel
  const flujoCajaBackend = data?.flujoCaja || {};
  let flujoCaja = crearFlujoVacio();

  // 2. Llenamos nuestra estructura segura
  CAMPOS_FLUJO.forEach((campo) => {
    flujoCaja[campo] = normalizarNumero(flujoCajaBackend[campo]);
  });

  // 3. Calculamos el Total General
  const totalGeneral =
    flujoCaja.ventasContado +
    flujoCaja.ventasCreditoCobradas -
    flujoCaja.comprasContado -
    flujoCaja.comprasCreditoPagadas -
    flujoCaja.pagosPersonal +
    flujoCaja.inversionesActivos +
    flujoCaja.prestamosRecibidos -
    flujoCaja.pagoDeudas;

  // Si la suma de todos los movimientos es 0, no hay datos
  const totalMovimientos = Object.values(flujoCaja).reduce(
    (acc, val) => acc + Math.abs(val),
    0,
  );
  const sinDatosMensuales =
    modoVista === "mes" && totalMovimientos === 0 && !isLoading;

  const labelPeriodo = modoVista === "mes" ? "Total del Mes" : "Total General";

  if (isLoading) {
    return (
      <div className="p-3 text-center text-muted">
        Cargando flujo de caja...
      </div>
    );
  }

  return (
    <div className="card-body p-3">
      <table className="w-100 table-borderless table-hover table-sm">
        <thead>
          <tr>
            <th className="p-2">Tipo</th>
            <th style={{ color: "var(--fw-emerald)" }}>Entrada (S/)</th>
            <th style={{ color: "var(--fw-strawberry)" }}>Salida (S/)</th>
            <th className="text-center">Total (S/)</th>
          </tr>
        </thead>
        <tbody>
          {isError && (
            <tr>
              <td colSpan={4} className="p-3">
                <div className="fw-flow-error-box text-danger">
                  Error al cargar los datos:
                  <pre className="mb-0">{JSON.stringify(error, null, 2)}</pre>
                </div>
              </td>
            </tr>
          )}

          {sinDatosMensuales && !isError && (
            <tr>
              <td colSpan={4} className="p-2">
                <div className="fw-flow-empty-month text-muted fst-italic">
                  No hay datos registrados para el mes seleccionado.
                </div>
              </td>
            </tr>
          )}

          {/* Operativo */}
          <tr className="fw-flow-subtitle-row">
            <td className="fw-bold p-2 fw-flow-subtitle-text" colSpan={4}>
              Flujo de Caja Operativo
            </td>
          </tr>
          <tr>
            <td className="p-2">Ventas Contado</td>
            <td>{flujoCaja.ventasContado.toFixed(2)}</td>
            <td>0.00</td>
            <td className="fw-flow-positive text-success text-center">
              {flujoCaja.ventasContado.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="p-2">Ventas Crédito Cobradas</td>
            <td>{flujoCaja.ventasCreditoCobradas.toFixed(2)}</td>
            <td>0.00</td>
            <td className="fw-flow-positive text-success text-center">
              {flujoCaja.ventasCreditoCobradas.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="p-2">Compras Contado</td>
            <td>0.00</td>
            <td>{flujoCaja.comprasContado.toFixed(2)}</td>
            <td className="fw-flow-negative text-danger text-center">
              -{flujoCaja.comprasContado.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="p-2">Compras Crédito Pagadas</td>
            <td>0.00</td>
            <td>{flujoCaja.comprasCreditoPagadas.toFixed(2)}</td>
            <td className="fw-flow-negative text-danger text-center">
              -{flujoCaja.comprasCreditoPagadas.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="p-2">Pagos al Personal</td>
            <td>0.00</td>
            <td>{flujoCaja.pagosPersonal.toFixed(2)}</td>
            <td className="fw-flow-negative text-danger text-center">
              -{flujoCaja.pagosPersonal.toFixed(2)}
            </td>
          </tr>

          {/* Inversión y Financiamiento */}
          <tr className="fw-flow-subtitle-row p-2">
            <td className="fw-bold p-2 fw-flow-subtitle-text" colSpan={4}>
              Flujo de Caja de Inversión y Financiamiento
            </td>
          </tr>
          <tr>
            <td className="p-2">Inversiones en Activos</td>
            <td>{flujoCaja.inversionesActivos.toFixed(2)}</td>
            <td>0.00</td>
            <td className="fw-flow-positive text-success text-center">
              {flujoCaja.inversionesActivos.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="p-2">Préstamos Recibidos</td>
            <td>{flujoCaja.prestamosRecibidos.toFixed(2)}</td>
            <td>0.00</td>
            <td className="fw-flow-positive text-success text-center">
              {flujoCaja.prestamosRecibidos.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="p-2">Pago de Deudas</td>
            <td>0.00</td>
            <td>{flujoCaja.pagoDeudas.toFixed(2)}</td>
            <td className="fw-flow-negative text-danger text-center">
              -{flujoCaja.pagoDeudas.toFixed(2)}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr className="fw-flow-total-row border-top">
            <th className="p-2 fw-flow-subtitle-text">{labelPeriodo}</th>
            <td></td>
            <td></td>
            <td className="fw-bold fw-flow-total-value text-center fs-5">
              S/. {totalGeneral.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
