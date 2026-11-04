import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../../service/ObtenerVentasDetalle";
import { GetMesas } from "../../service/GetMesas";
import { GetAlmacen } from "../../service/serviceAlmacen/GetAlmacen";
import { getPedidosPendientes } from "../../service/GetPedidosPendientes";
import { AlertCircle, Clock3, PackageSearch, Store, Table2 } from "lucide-react";
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

  const ahora = new Date();
  const hoy = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, "0")}-${String(ahora.getDate()).padStart(2, "0")}`;
  const ventasArray = Array.isArray(ventas) ? ventas : [];

  const ventasHoy = ventasArray
    .filter((venta) => String(venta.fechaVenta || "").slice(0, 10) === hoy)
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
      iconClass:
        "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-600/10 dark:text-emerald-300",
      loading: isLoadingVentas,
      error: isErrorVentas,
    },
    {
      title: "Mesas ocupadas",
      value: `${mesasOcupadas}/${totalMesas}`,
      description: "Ocupación del salón",
      icon: Table2,
      iconClass:
        "bg-sky-500/10 text-sky-700 ring-1 ring-sky-600/10 dark:text-sky-300",
      progress: porcentajeMesas,
      loading: isLoadingMesas,
      error: isErrorMesas,
    },
    {
      title: "Pedidos pendientes",
      value: pedidosPendientes,
      description: "En estado pendiente",
      icon: Clock3,
      iconClass:
        "bg-amber-500/10 text-amber-700 ring-1 ring-amber-600/10 dark:text-amber-300",
      loading: isLoadingPedidosWeb,
      error: isErrorPedidos,
    },
    {
      title: "Alertas de almacén",
      value: productosBajoStock,
      description: "Productos con bajo stock",
      icon: PackageSearch,
      iconClass:
        "bg-rose-500/10 text-rose-700 ring-1 ring-rose-600/10 dark:text-rose-300",
      loading: isLoadingAlmacen,
      error: isErrorAlmacen,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metricas.map((metrica) => {
        const Icon = metrica.icon;

        return (
          <Card
            key={metrica.title}
            asChild
            className="min-w-0 rounded-xl border-border/70 bg-card p-0 text-card-foreground shadow-none"
          >
            <article
              className="flex min-h-[148px] flex-col justify-between gap-4 p-4 sm:p-5"
              aria-busy={metrica.loading}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="mb-1 truncate text-sm font-medium text-muted-foreground">
                    {metrica.title}
                  </p>
                  {metrica.loading ? (
                    <div
                      className="mt-2 h-8 w-28 animate-pulse rounded-md bg-muted"
                      aria-label={`Cargando ${metrica.title.toLowerCase()}`}
                    />
                  ) : metrica.error ? (
                    <p className="mb-0 mt-2 flex items-center gap-1.5 text-sm font-medium text-destructive">
                      <AlertCircle className="size-4" aria-hidden="true" />
                      No disponible
                    </p>
                  ) : (
                    <p className="mb-0 mt-1 truncate text-2xl font-semibold tracking-tight text-foreground sm:text-[1.7rem]">
                      {metrica.value}
                    </p>
                  )}
                </div>
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${metrica.iconClass}`}
                >
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
              </div>
              <div>
                <p className="mb-0 text-xs leading-5 text-muted-foreground">
                  {metrica.error
                    ? "No se pudo cargar este indicador."
                    : metrica.description}
                </p>
                {metrica.progress !== undefined &&
                  !metrica.loading &&
                  !metrica.error && (
                    <div
                      className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-sky-500/10"
                      role="progressbar"
                      aria-label="Ocupación de mesas"
                      aria-valuenow={Math.round(metrica.progress)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="h-full rounded-full bg-sky-600 transition-[width] duration-500 dark:bg-sky-400"
                        style={{ width: `${metrica.progress}%` }}
                      />
                    </div>
                  )}
              </div>
            </article>
          </Card>
        );
      })}
    </div>
  );
}
