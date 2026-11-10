import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { InventarioList } from "../../components/componenteInventario/InventarioList";
import { GetInventario } from "../../service/GetInventario";
import { Cargando } from "../../components/componentesReutilizables/Cargando";

import {
  FileText,
  Plus,
  Search,
  StickyNote,
  Store,
  TriangleAlert,
} from "lucide-react";
import { Link } from "react-router-dom";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";
import { formatMoneda } from "../../utils/currency";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import BotonReportePdf from "@/components/componentesReutilizables/BotonReportePdf";

export function Inventario() {
  const [search, setSearch] = useState("");
  // Usamos React Query para manejar el estado y caching de los datos
  const { data, isLoading, isError } = useQuery({
    queryKey: ["inventario"],
    queryFn: GetInventario,
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
    refetchOnWindowFocus: false, // Evita recargar al cambiar de pestaña
  });

  // Calculamos los valores basados en los datos
  const metrics = data
    ? calculateMetrics(data)
    : {
        productosConteo: 0,
        porVencer: 0,
        stockTotal: 0,
        valorTotal: "0.00",
      };

  return (
    <div className="grid grid-cols-12 gap-3">
      <div className="col-span-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <MetricCard
            loading={isLoading}
            error={isError}
            icon={<Store />}
            title="Productos"
            value={metrics.productosConteo}
            errorMessage="Error al cargar datos"
          />
          <MetricCard
            loading={isLoading}
            error={isError}
            icon={<StickyNote />}
            title="Stock Total"
            value={metrics.stockTotal}
            errorMessage="Error al cargar el stock"
          />

          <MetricCard
            loading={isLoading}
            error={isError}
            icon={<StickyNote />}
            title="Valor Total"
            value={formatMoneda(metrics.valorTotal)}
            errorMessage="Error al cargar datos"
          />

          <MetricCard
            loading={isLoading}
            error={isError}
            icon={<TriangleAlert />}
            title="Por Vencer"
            value={metrics.porVencer}
            errorMessage="Error al cargar datos"
            isDanger
          />
        </div>
      </div>

      <div className="col-span-full">
        <Card className="rounded-2xl border border-border/70 bg-card shadow-sm ring-0">
          <CardHeader className="flex flex-col items-stretch gap-4 border-b border-border/70 px-5 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex items-center">
              <CardTitle asChild>
                <h4 className="mb-0 text-base font-semibold tracking-tight text-foreground">
                  Panel de Inventario
                </h4>
              </CardTitle>
              <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                Productos
              </span>
            </div>

            <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <div className="relative w-full min-w-0 sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar en inventario..."
                  className="h-9 pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <Button
                type="button"
                className="w-full gap-2 px-3 sm:w-auto"
                onClick={() => GetReporteExcel("/reporteInventarioTodo")}
                variant="ghostOutline"
              >
                <FileText size={18} />
                Reporte Excel
              </Button>

              <BotonReportePdf reporteEspecifico="inventario" />

              <Button
                asChild
                size="lg"
                className="gap-2 px-3 w-full sm:w-auto"
                variant="default"
              >
                <Link to="/ventas/solicitud/realizarSolicitud">
                  <Plus size={18} />
                  Solicitar
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <InventarioList search={search} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Componente auxiliar para las tarjetas de métricas
function MetricCard({
  loading,
  error,
  icon,
  title,
  value,
  errorMessage,
  isDanger = false,
}) {
  return (
    <div className="col-span-full md:col-span-3 lg:col-span-3">
      <CondicionCarga isLoading={loading} isError={error} mode="single-card">
        <Card className="p-4 flex-row sm:h-full items-center gap-3 rounded-2xl border border-border/70 bg-card shadow-sm ring-0">
          {/* Ícono a la izquierda (Ocupa la columna 1) */}
          <div className=" flex items-center justify-center">
            <div
              className={`relative flex h-12 w-12 items-center justify-center rounded-xl ${
                isDanger
                  ? "bg-destructive/10 text-destructive"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <span
                className={
                  "absolute opacity-70 " +
                  (isDanger ? "bg-destructive/10" : "bg-green-300") +
                  " rounded-2xl p-4 flex items-center justify-center"
                }
              >
                {icon}
              </span>
            </div>
          </div>

          {/* Detalles a la derecha (Ocupan las 3 columnas restantes y se apilan en vertical) */}
          <div className="ms-auto flex flex-col justify-center">
            <h4
              className={`text-xs sm:text-sm font-medium mb-0.5 ${
                isDanger ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              {title}
            </h4>
            <p
              className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDanger ? "text-destructive" : "text-foreground"}`}
            >
              {value}
            </p>
          </div>
        </Card>
      </CondicionCarga>
    </div>
  );
}

export default MetricCard;
// Función auxiliar para calcular las métricas
function calculateMetrics(inventario) {
  let sumaTotal = 0;
  let valorTotal = 0;
  let productPorVencer = 0;
  const today = new Date();
  const oneMonthAhead = new Date(today);
  oneMonthAhead.setMonth(today.getMonth() + 1);

  inventario.forEach((items) => {
    sumaTotal += items.stock;
    valorTotal += parseFloat(items.precio) * parseFloat(items.stock);
    const fechaVencimiento = new Date(items.fecha_vencimiento);

    if (fechaVencimiento < today || fechaVencimiento <= oneMonthAhead) {
      productPorVencer += 1;
    }
  });

  return {
    productosConteo: inventario.length,
    porVencer: productPorVencer,
    stockTotal: sumaTotal,
    valorTotal: valorTotal.toFixed(2),
  };
}
