import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../../service/ObtenerVentasDetalle";
import {
  CalendarRange,
  FileText,
  LoaderCircle,
  Search,
  ShoppingBag,
  WalletCards,
} from "lucide-react";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import { ListVentas } from "../../components/componentesVentas/ListaVentas";

import { formatMoneda } from "../../utils/currency";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function DetallesVentas() {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [period, setPeriod] = useState("all");
  const {
    data: ventasData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
  });
  const ventasFiltradas = useMemo(() => {
    const ventas = Array.isArray(ventasData) ? ventasData : [];
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfWeek = new Date(startOfToday);
    const dayOfWeek = startOfWeek.getDay() || 7;
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek + 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return ventas.filter((venta) => {
      const fecha = new Date(venta.created_at);
      if (Number.isNaN(fecha.getTime())) return false;
      if (selectedDate) {
        const fechaLocal = [
          fecha.getFullYear(),
          String(fecha.getMonth() + 1).padStart(2, "0"),
          String(fecha.getDate()).padStart(2, "0"),
        ].join("-");
        return fechaLocal === selectedDate;
      }
      if (period === "today") return fecha >= startOfToday;
      if (period === "week") return fecha >= startOfWeek;
      if (period === "month") return fecha >= startOfMonth;
      return true;
    });
  }, [period, selectedDate, ventasData]);

  const metricas = useMemo(() => {
    const total = ventasFiltradas.reduce(
      (sum, venta) => sum + Number.parseFloat(venta.total || 0),
      0,
    );
    const cantidad = ventasFiltradas.length;
    return {
      total,
      cantidad,
      promedio: cantidad ? total / cantidad : 0,
    };
  }, [ventasFiltradas]);

  if (isLoading) {
    return (
      <div
        role="status"
        className="flex min-h-48 w-full flex-col items-center justify-center gap-3 text-sm text-muted-foreground"
      >
        <LoaderCircle className="size-6 animate-spin" />
        Cargando ventas...
      </div>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="w-full rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
      >
        No se pudieron cargar las ventas.
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-4">
      {/* Lista de ventas */}
      <div className="w-full min-w-0">
        <Card className="w-full min-w-0 overflow-hidden rounded-2xl border border-border/70 bg-card py-0 shadow-sm">
            <CardHeader className="flex flex-col items-stretch gap-4 border-b border-border/70 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-5">
              <div className="flex min-w-0 items-center">
                <CardTitle asChild>
                  <h1 className="mb-0 text-base font-semibold tracking-tight text-foreground">
                    Panel de Ventas
                  </h1>
                </CardTitle>
                <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  Registros
                </span>
              </div>

              <div className="grid w-full min-w-0 grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
                <select
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 sm:w-44"
                  value={period}
                  onChange={(e) => {
                    setPeriod(e.target.value);
                    setSelectedDate("");
                  }}
                  aria-label="Filtrar ventas por período"
                >
                  <option value="all">Todas las ventas</option>
                  <option value="today">Hoy</option>
                  <option value="week">Esta semana</option>
                  <option value="month">Este mes</option>
                </select>

                <div className="relative w-full min-w-0 sm:w-64">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar venta..."
                    className="h-9 pl-9"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setSelectedDate("");
                    }}
                  />
                </div>

                {/* Filtro por fecha */}
                <input
                  type="date"
                  aria-label="Filtrar ventas por fecha"
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 sm:w-40"
                  value={selectedDate}
                  onChange={(e) => {
                    const rawDate = e.target.value;
                    setSelectedDate(rawDate);
                    setPeriod("all");
                    setSearch("");
                  }}
                />
                <Button
                  size="lg"
                  type="button"
                  className="w-full gap-2 px-3 sm:w-auto"
                  onClick={() => {
                    const urlReporte = selectedDate
                      ? `/reporteVentasTodo?fecha=${selectedDate}`
                      : "/reporteVentasTodo";

                    // Pasamos null a las fechas y "Ventas" al parámetro 'tipo'
                    GetReporteExcel(urlReporte, null, null, "Ventas");
                  }}
                  variant="ghostOutline"
                >
                  <FileText size={18} />
                  Reporte
                </Button>
              </div>
            </CardHeader>
            <div className="grid grid-cols-1 gap-3 border-b border-border/60 bg-muted/20 p-4 sm:grid-cols-3">
              <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-card p-4 shadow-sm shadow-emerald-500/5">
                <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <WalletCards className="size-4 text-emerald-600 dark:text-emerald-400" />
                  Recaudación
                </span>
                <strong className="truncate text-base font-semibold text-foreground">
                  {formatMoneda(metricas.total)}
                </strong>
              </div>
              <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-indigo-500/15 bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-card p-4 shadow-sm shadow-indigo-500/5">
                <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <ShoppingBag className="size-4 text-indigo-600 dark:text-indigo-400" />
                  Ventas
                </span>
                <strong className="text-base font-semibold text-foreground">
                  {metricas.cantidad}
                </strong>
              </div>
              <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-amber-500/15 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-card p-4 shadow-sm shadow-amber-500/5">
                <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <CalendarRange className="size-4 text-amber-600 dark:text-amber-400" />
                  Ticket promedio
                </span>
                <strong className="truncate text-base font-semibold text-foreground">
                  {formatMoneda(metricas.promedio)}
                </strong>
              </div>
            </div>
            <CardContent className="p-0">
              <ListVentas search={search} ventas={ventasFiltradas} />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
