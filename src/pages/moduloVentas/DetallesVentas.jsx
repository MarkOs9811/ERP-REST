import { useMemo, useState } from "react";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";
import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../../service/ObtenerVentasDetalle";
import {
  CalendarRange,
  FileText,
  Search,
  ShoppingBag,
  WalletCards,
} from "lucide-react";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import { ListVentas } from "../../components/componentesVentas/ListaVentas";
import "../../css/estilosVentas/EstilosListaVentas.css";
import { formatMoneda } from "../../utils/currency";

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
  return (
    <div className="ventas-root">
      {/* Lista de ventas */}
      <div className="col-12">
        <CondicionCarga isLoading={isLoading} isError={isError}>
          <div className="card  py-2 shadow-none">
            <div className="card-header border-bottom-0 d-flex flex-column flex-md-row justify-content-between align-items-start align-md-items-center gap-3 p-4">
              <div className="d-flex align-items-center">
                <h4 className="card-title mb-0 titulo-card-especial">
                  Panel de Ventas
                </h4>
                <span className="badge-header ms-2">Registros</span>
              </div>

              <div className="ventas-toolbar">
                <select
                  className="form-select ventas-period-select"
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

                <div className="header-search-container">
                  <Search className="search-icon" size={18} />
                  <input
                    type="text"
                    placeholder="Buscar venta..."
                    className="form-control"
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
                  className="form-control ventas-date-input"
                  value={selectedDate}
                  onChange={(e) => {
                    const rawDate = e.target.value;
                    setSelectedDate(rawDate);
                    setPeriod("all");
                    setSearch("");
                  }}
                />
                <button
                  type="button"
                  className="btn-principal"
                  onClick={() => {
                    const urlReporte = selectedDate
                      ? `/reporteVentasTodo?fecha=${selectedDate}`
                      : "/reporteVentasTodo";

                    // Pasamos null a las fechas y "Ventas" al parámetro 'tipo'
                    GetReporteExcel(urlReporte, null, null, "Ventas");
                  }}
                >
                  <FileText size={18} />
                  Reporte
                </button>
              </div>
            </div>
            <div className="ventas-kpi-grid px-4 pb-3">
              <div className="ventas-kpi">
                <span>
                  <WalletCards size={17} /> Recaudación
                </span>
                <strong>{formatMoneda(metricas.total)}</strong>
              </div>
              <div className="ventas-kpi">
                <span>
                  <ShoppingBag size={17} /> Ventas
                </span>
                <strong>{metricas.cantidad}</strong>
              </div>
              <div className="ventas-kpi">
                <span>
                  <CalendarRange size={17} /> Ticket promedio
                </span>
                <strong>{formatMoneda(metricas.promedio)}</strong>
              </div>
            </div>
            <div className="card-body p-0">
              <ListVentas search={search} ventas={ventasFiltradas} />
            </div>
          </div>
        </CondicionCarga>
      </div>
    </div>
  );
}
