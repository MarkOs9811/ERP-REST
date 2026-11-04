import { useState } from "react";
import { KardexList } from "../../components/componentesKardex/KardexList";
import { GetKardex } from "../../service/GetKardex";
import { ArrowDown, ArrowUp, FileText, Search } from "lucide-react";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";
import { useQuery } from "@tanstack/react-query";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function Kardex() {
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["kardex"],
    queryFn: GetKardex,
    staleTime: 1000 * 60 * 2, // 2 minutos antes de volver a refetch automático
  });

  // Calcular totales de entradas y salidas
  const totalEntradas =
    data?.data?.filter((item) => item.tipo_movimiento === "entrada").length ||
    0;

  const totalSalidas =
    data?.data?.filter((item) => item.tipo_movimiento === "salida").length || 0;
  const totalMovimientos = totalEntradas + totalSalidas;

  const handleReporteSalida = async () => {
    GetReporteExcel("/reporteKardexExcelSalida");
  };

  const handleReporteEntrada = async () => {
    GetReporteExcel("/reporteKardexExcelEntrada");
  };

  return (
    <div className="kardex-page">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-full md:col-span-6">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <Card className="kardex-kpi-card kardex-kpi-card-entrada h-full">
              <div className="kardex-kpi-icon-wrap">
                <ArrowUp
                  className="kardex-kpi-icon"
                  style={{ transform: "rotate(45deg)" }}
                />
              </div>
              <div className="kardex-kpi-content">
                <p className="kardex-kpi-label mb-0">Entradas</p>
                <p className="kardex-kpi-value mb-0">{totalEntradas}</p>
              </div>
              <div className="kardex-kpi-action">
                <Button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 btn-ver kardex-export-btn"
                  onClick={() => handleReporteEntrada()}
                  title="Exportar entradas a Excel"
                  variant="outline"
                >
                  <FileText size={18} />
                </Button>
              </div>
            </Card>
          </CondicionCarga>
        </div>

        <div className="col-span-full md:col-span-6">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <Card className="kardex-kpi-card kardex-kpi-card-salida h-full">
              <div className="kardex-kpi-icon-wrap">
                <ArrowDown
                  className="kardex-kpi-icon"
                  style={{ transform: "rotate(45deg)" }}
                />
              </div>
              <div className="kardex-kpi-content">
                <p className="kardex-kpi-label mb-0">Salidas</p>
                <p className="kardex-kpi-value mb-0">{totalSalidas}</p>
              </div>
              <div className="kardex-kpi-action">
                <Button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 btn-ver kardex-export-btn"
                  onClick={() => handleReporteSalida()}
                  title="Exportar salidas a Excel"
                  variant="outline"
                >
                  <FileText size={18} />
                </Button>
              </div>
            </Card>
          </CondicionCarga>
        </div>

        <div className="col-span-full md:col-span-12">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <Card className="rounded-2xl border border-border/70 bg-card shadow-sm ring-0 kardex-panel-card py-2">
              <CardHeader className="flex flex-col items-stretch gap-4 border-b border-border/70 px-5 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle asChild>
                    <h4 className="mb-0 text-base font-semibold tracking-tight text-foreground kardex-panel-title">
                      Kardex de Movimientos
                    </h4>
                  </CardTitle>
                  <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    Total: {totalMovimientos}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="relative w-full min-w-0 sm:w-64">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Buscar producto..."
                      className="h-9 pl-9"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 kardex-table-zone">
                <KardexList search={search} />
              </CardContent>
            </Card>
          </CondicionCarga>
        </div>
      </div>
    </div>
  );
}
