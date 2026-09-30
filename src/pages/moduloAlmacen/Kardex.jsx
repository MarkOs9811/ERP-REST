import { useState } from "react";
import { KardexList } from "../../components/componentesKardex/KardexList";
import { GetKardex } from "../../service/GetKardex";
import { ArrowDown, ArrowUp, FileText, Search } from "lucide-react";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";
import { useQuery } from "@tanstack/react-query";
import "../../css/estilosAlmacen/EstilosKardexModerno.css";
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
      <div className="row g-3">
        <div className="col-sm-12 col-md-6">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <div className="card kardex-kpi-card kardex-kpi-card-entrada  h-100">
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
                <button
                  type="button"
                  className="btn btn-ver kardex-export-btn"
                  onClick={() => handleReporteEntrada()}
                  title="Exportar entradas a Excel"
                >
                  <FileText size={18} />
                </button>
              </div>
            </div>
          </CondicionCarga>
        </div>

        <div className="col-sm-12 col-md-6">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <div className="card kardex-kpi-card kardex-kpi-card-salida  h-100">
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
                <button
                  type="button"
                  className="btn btn-ver kardex-export-btn"
                  onClick={() => handleReporteSalida()}
                  title="Exportar salidas a Excel"
                >
                  <FileText size={18} />
                </button>
              </div>
            </div>
          </CondicionCarga>
        </div>

        <div className="col-md-12">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <div className="card kardex-panel-card  py-2">
              <div className="card-header border-bottom-0 d-flex justify-content-between align-items-center gap-2 flex-wrap kardex-panel-header">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <h4 className="card-title mb-0 titulo-card-especial kardex-panel-title">
                    Kardex de Movimientos
                  </h4>
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
              </div>
              <div className="card-body p-0 kardex-table-zone">
                <KardexList search={search} />
              </div>
            </div>
          </CondicionCarga>
        </div>
      </div>
    </div>
  );
}
