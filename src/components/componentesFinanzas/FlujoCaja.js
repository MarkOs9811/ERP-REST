import { useQuery } from "@tanstack/react-query";
import { GetPresupuestos } from "../../service/serviceFinanzas/GetPresupuestos";


export function FlujoCaja() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["presupuestos"],
    queryFn: GetPresupuestos,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const flujoCaja = data?.flujoCaja || {};

  // Calcula el total general
  const totalGeneral =
    (flujoCaja.ventasContado ?? 0) +
    (flujoCaja.ventasCreditoCobradas ?? 0) -
    (flujoCaja.comprasContado ?? 0) -
    (flujoCaja.comprasCreditoPagadas ?? 0) -
    (flujoCaja.pagosPersonal ?? 0) +
    (flujoCaja.inversionesActivos ?? 0) +
    (flujoCaja.prestamosRecibidos ?? 0) -
    (flujoCaja.pagoDeudas ?? 0);

  return (
    <div className="card-body p-3">
      <table className="w-100 table-borderless table-hover table-sm">
        <thead>
          <tr>
            <th className="p-2">Tipo</th>
            <th style={{ color: "#0971AC" }}>Entrada (S/)</th>
            <th style={{ color: "#ee5252" }}>Salida (S/)</th>
            <th className="text-center">Total (S/)</th>
          </tr>
        </thead>
        <tbody>
          {isError && (
            <div className="alert alert-danger mt-3">
              Error al cargar los datos:
              <pre>{JSON.stringify(error, null, 2)}</pre>
            </div>
          )}
          {/* Muestra error si ocurre */}
          {isError && (
            <div className="alert alert-danger mt-3">
              Error al cargar los datos:
              <pre>{JSON.stringify(error, null, 2)}</pre>
            </div>
          )}
          {/* Operativo */}
          <tr className="table-secondary subtitle-row">
            <td className="fw-bold p-2 text-primary" colSpan={4}>
              Flujo de Caja Operativo
            </td>
          </tr>
          <tr>
            <td className="p-2 ">Ventas Contado</td>
            <td>{Number(flujoCaja.ventasContado ?? 0).toFixed(2)}</td>
            <td>0.00</td>
            <td className="text-success">
              {Number(flujoCaja.ventasContado ?? 0).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="p-2">Ventas Crédito Cobradas</td>
            <td>{Number(flujoCaja.ventasCreditoCobradas ?? 0).toFixed(2)}</td>
            <td>0.00</td>
            <td className="text-success">
              {Number(flujoCaja.ventasCreditoCobradas ?? 0).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="p-2">Compras Contado</td>
            <td>0.00</td>
            <td>{Number(flujoCaja.comprasContado ?? 0).toFixed(2)}</td>
            <td className="text-danger">
              -{Number(flujoCaja.comprasContado ?? 0).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="p-2">Compras Crédito Pagadas</td>
            <td>0.00</td>
            <td>{Number(flujoCaja.comprasCreditoPagadas ?? 0).toFixed(2)}</td>
            <td className="text-danger">
              -{Number(flujoCaja.comprasCreditoPagadas ?? 0).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="p-2">Pagos al Personal</td>
            <td>0.00</td>
            <td>{Number(flujoCaja.pagosPersonal ?? 0).toFixed(2)}</td>
            <td className="text-danger">
              -{Number(flujoCaja.pagosPersonal ?? 0).toFixed(2)}
            </td>
          </tr>
          {/* Inversión */}
          <tr className="table-secondary subtitle-row p-2">
            <td className="fw-bold p-2  text-primary" colSpan={4}>
              Flujo de Caja de Inversión
            </td>
          </tr>
          <tr>
            <td className="p-2">Inversiones en Activos</td>
            <td>{Number(flujoCaja.inversionesActivos ?? 0).toFixed(2)}</td>
            <td>0.00</td>
            <td className="text-success">
              {Number(flujoCaja.inversionesActivos ?? 0).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="p-2">Financiamiento</td>
            <td>0.00</td>
            <td>{Number(flujoCaja.prestamosRecibidos ?? 0).toFixed(2)}</td>
            <td className="text-danger">
              -{Number(flujoCaja.prestamosRecibidos ?? 0).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="p-2">Préstamos Recibidos</td>
            <td>{Number(flujoCaja.prestamosRecibidos ?? 0).toFixed(2)}</td>
            <td>0.00</td>
            <td className="text-success">
              {Number(flujoCaja.prestamosRecibidos ?? 0).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="p-2">Pago de Deudas</td>
            <td>0.00</td>
            <td>{Number(flujoCaja.pagoDeudas ?? 0).toFixed(2)}</td>
            <td className="text-danger">
              -{Number(flujoCaja.pagoDeudas ?? 0).toFixed(2)}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr className="table-primary">
            <th className="p-2  text-primary">Total General</th>
            <td></td>
            <td></td>
            <td className="text-dark fw-bold">
              S/. {Number(totalGeneral).toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
