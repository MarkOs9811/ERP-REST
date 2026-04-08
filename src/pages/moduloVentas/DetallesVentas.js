import { useState } from "react";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";
import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../../service/ObtenerVentasDetalle";
import { FileText, Search } from "lucide-react";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import { ListVentas } from "../../components/componentesVentas/ListaVentas";

export function DetallesVentas() {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const {
    data: ventasData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
  });
  const formatToDMY = (isoDate) => {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    const shortYear = year.slice(2); // "2025" -> "25"
    return `${parseInt(day)}/${parseInt(month)}/${shortYear}`;
  };
  const ventas = Array.isArray(ventasData) ? ventasData : [];
  return (
    <div>
      {/* Lista de ventas */}
      <div className="col-12">
        <CondicionCarga isLoading={isLoading} isError={isError}>
          <div className="card  py-2 shadow-none">
            <div className="card-header border-bottom-0 d-flex flex-column flex-md-row justify-content-between align-items-start align-md-items-center gap-3 p-4">
              <div className="d-flex align-items-center">
                <h4 className="card-title mb-0 titulo-card-especial">
                  Panel de Ventas
                </h4>
                <span className="badge-header">Registros</span>
              </div>

              <div
                className="d-flex align-items-center flex-wrap gap-2 mt-0"
                style={{ width: "auto" }}
              >
                <div className="header-search-container">
                  <Search className="search-icon" size={18} />
                  <input
                    type="text"
                    placeholder="Buscar venta..."
                    className="form-control"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setSelectedDate(""); // limpiar fecha si escribes texto
                    }}
                  />
                </div>

                {/* Filtro por fecha */}
                <input
                  type="date"
                  className="form-control"
                  value={selectedDate}
                  onChange={(e) => {
                    const rawDate = e.target.value;
                    setSelectedDate(rawDate);
                    const formatted = formatToDMY(rawDate);
                    setSearch(formatted);
                  }}
                  style={{ maxWidth: "180px", minWidth: "150px" }}
                />
                <button
                  type="button"
                  className="btn btn-outline-dark px-3"
                  onClick={() => GetReporteExcel("/reporteVentasTodo")}
                >
                  <FileText size={18} />
                  Reporte General
                </button>
              </div>
            </div>
            <div className="card-body p-0">
              <ListVentas search={search} />
            </div>
          </div>
        </CondicionCarga>
      </div>
    </div>
  );
}
