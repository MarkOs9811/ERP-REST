import { useState } from "react";
import { KardexList } from "../../components/componentesKardex/KardexList";
import { GetKardex } from "../../service/GetKardex";
import { ArrowDown, ArrowUp, FileText, Search } from "lucide-react";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";
import { useQuery } from "@tanstack/react-query";
import "../../css/estilosAlmacen/EstilosKardexModerno.css";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="col-sm-12 col-md-6">
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
                  className="btn btn-ver kardex-export-btn"
                  onClick={() => handleReporteEntrada()}
                  title="Exportar entradas a Excel"
                 variant="outline">
                  <FileText size={18} />
                </Button>
              </div>
            </Card>
          </CondicionCarga>
        </div>

        <div className="col-sm-12 col-md-6">
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
                  className="btn btn-ver kardex-export-btn"
                  onClick={() => handleReporteSalida()}
                  title="Exportar salidas a Excel"
                 variant="outline">
                  <FileText size={18} />
                </Button>
              </div>
            </Card>
          </CondicionCarga>
        </div>

        <div className="md:col-span-12">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <Card className="kardex-panel-card py-2">
              <CardHeader className="border-bottom-0 flex justify-between items-center gap-2 flex-wrap kardex-panel-header">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <CardTitle asChild><h4 className="mb-0 titulo-card-especial kardex-panel-title">
                    Kardex de Movimientos
                  </h4></CardTitle>
                  <span className="badge-header kardex-panel-badge">
                    Total: {totalMovimientos}
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <div className="header-search-container kardex-search-box">
                    <Search className="search-icon" />
                    <input
                      type="text"
                      placeholder="Buscar producto..."
                      className="form-control kardex-search-input"
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
