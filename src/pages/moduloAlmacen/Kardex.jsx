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
      {/* 1. GRID PRINCIPAL: 1 columna en móvil, 2 en pantallas medianas/grandes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* TARJETA ENTRADAS */}
        <div className="w-full">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <Card className="flex flex-row items-center justify-between p-5 h-full shadow-sm">
              {/* Grupo Izquierdo: Icono + Textos */}
              <div className="flex items-center gap-4">
                <div className="bg-emerald-100/80 text-emerald-700 rounded-xl p-3 flex items-center justify-center">
                  <ArrowUp size={38} className="rotate-45" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-0">
                    Entradas
                  </p>
                  <h3 className="text-2xl font-bold text-foreground mb-0">
                    {totalEntradas}
                  </h3>
                </div>
              </div>

              {/* Grupo Derecho: Botón */}
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 w-10 p-0 text-muted-foreground hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200"
                  onClick={() => handleReporteEntrada()}
                  title="Exportar entradas a Excel"
                >
                  <FileText size={28} />
                </Button>
              </div>
            </Card>
          </CondicionCarga>
        </div>

        {/* TARJETA SALIDAS */}
        <div className="w-full">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <Card className="flex flex-row items-center justify-between p-5 h-full shadow-sm">
              {/* Grupo Izquierdo: Icono + Textos */}
              <div className="flex items-center gap-4">
                <div className="bg-destructive/10 text-destructive rounded-xl p-3 flex items-center justify-center">
                  <ArrowDown size={38} className="rotate-45" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-0">
                    Salidas
                  </p>
                  <h3 className="text-2xl font-bold text-foreground mb-0">
                    {totalSalidas}
                  </h3>
                </div>
              </div>

              {/* Grupo Derecho: Botón */}
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 w-10 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30"
                  onClick={() => handleReporteSalida()}
                  title="Exportar salidas a Excel"
                >
                  <FileText size={28} />
                </Button>
              </div>
            </Card>
          </CondicionCarga>
        </div>

        {/* TARJETA TABLA KARDEX (Ocupa ambas columnas) */}
        <div className="col-span-1 md:col-span-2">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <Card className="rounded-2xl border border-border/70 bg-card shadow-sm ring-0 py-2">
              <CardHeader className="flex flex-col items-start gap-4 border-b border-border/70 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle asChild>
                    <h4 className="mb-0 text-base font-semibold tracking-tight text-foreground">
                      Kardex de Movimientos
                    </h4>
                  </CardTitle>
                  <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    Total: {totalMovimientos}
                  </span>
                </div>

                <div className="flex w-full sm:w-auto items-center">
                  <div className="relative w-full sm:w-64">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Buscar producto..."
                      className="h-9 pl-9 w-full"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <KardexList search={search} />
              </CardContent>
            </Card>
          </CondicionCarga>
        </div>
      </div>
    </div>
  );
}
