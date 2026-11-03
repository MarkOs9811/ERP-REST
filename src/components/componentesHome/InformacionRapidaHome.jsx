import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../../service/ObtenerVentasDetalle";
import { GetMesas } from "../../service/GetMesas";
import { GetAlmacen } from "../../service/serviceAlmacen/GetAlmacen";
import { getPedidosPendientes } from "../../service/GetPedidosPendientes";
import { CircleAlert, Clock9, Store, Table } from "lucide-react";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";
import { formatMoneda } from "../../utils/currency";
import { Card } from "@/components/ui/card";


export function InformacionRapidaHome() {
  const {
    data: ventas = [],
    isLoading: isLoadingVentas,
    isError: isErrorVentas,
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const {
    data: mesas = [],
    isLoading: isLoadingMesas,
    isError: isErrorMesas,
  } = useQuery({
    queryKey: ["mesas"],
    queryFn: GetMesas,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const {
    data: almacen = [],
    isLoading: isLoadingAlmacen,
    isError: isErrorAlmacen,
  } = useQuery({
    queryKey: ["almacen"],
    queryFn: GetAlmacen,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const {
    data: pedidosWeb = [],
    isLoading: isLoadingPedidosWeb,
    isError: isErrorPedidos,
  } = useQuery({
    queryKey: ["pedidosWeb"],
    queryFn: getPedidosPendientes,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const hoy = new Date().toISOString().split("T")[0];

  const ventasHoy = ventas
    .filter((venta) => venta.fechaVenta === hoy)
    .reduce((total, venta) => total + Number(venta.total || 0), 0);

  const mesasArray = Array.isArray(mesas.data) ? mesas.data : [];
  const mesasOcupadas = mesasArray.filter(
    (mesa) => Number(mesa.estado) === 0,
  ).length;
  const totalMesas = mesasArray.length;

  const productosBajoStock = Array.isArray(almacen)
    ? almacen.filter((producto) => producto.cantidad <= 5).length
    : 0;

  const pedidosPendientes = Array.isArray(pedidosWeb) ? pedidosWeb.length : 0;
  const porcentajeMesas =
    totalMesas > 0 ? Math.min((mesasOcupadas / totalMesas) * 100, 100) : 0;

  const metricas = [
    {
      title: "Ventas hoy",
      value: formatMoneda(ventasHoy),
      description: "Ingresos registrados",
      icon: Store,
      iconClass: "bg-emerald-500/10 text-emerald-600",
    },
    {
      title: "Mesas ocupadas",
      value: `${mesasOcupadas}/${totalMesas}`,
      description: "Ocupación del salón",
      icon: Table,
      iconClass: "bg-blue-500/10 text-blue-600",
      progress: porcentajeMesas,
    },
    {
      title: "Pedidos pendientes",
      value: pedidosPendientes,
      description: "En estado pendiente",
      icon: Clock9,
      iconClass: "bg-amber-500/10 text-amber-600",
    },
    {
      title: "Alertas de almacén",
      value: productosBajoStock,
      description: "Productos con bajo stock",
      icon: CircleAlert,
      iconClass: "bg-rose-500/10 text-rose-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
      {metricas.map((metrica, index) => {
        const loading = [
          isLoadingVentas,
          isLoadingMesas,
          isLoadingPedidosWeb,
          isLoadingAlmacen,
        ][index];
        const error = [
          isErrorVentas,
          isErrorMesas,
          isErrorPedidos,
          isErrorAlmacen,
        ][index];
        const Icon = metrica.icon;

        return (
          <CondicionCarga
            key={metrica.title}
            isLoading={loading}
            isError={error}
            mode="single-card"
          >
            <Card asChild><article className="flex h-full min-h-36 items-center justify-between gap-3 overflow-hidden rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm">
              <div className="min-w-0">
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  {metrica.title}
                </p>
                <p className="mb-1 break-words text-2xl font-bold tracking-tight text-foreground">
                  {metrica.value}
                </p>
                <p className="mb-0 text-xs text-muted-foreground">
                  {metrica.description}
                </p>
                {metrica.progress !== undefined && (
                  <div
                    className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted"
                    role="progressbar"
                    aria-label="Ocupación de mesas"
                    aria-valuenow={Math.round(metrica.progress)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full rounded-full bg-blue-500 transition-[width]"
                      style={{ width: `${metrica.progress}%` }}
                    />
                  </div>
                )}
              </div>
              <span
                className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${metrica.iconClass}`}
              >
                <Icon size={24} aria-hidden="true" />
              </span>
            </article></Card>
          </CondicionCarga>
        );
      })}
    </div>
  );
}
