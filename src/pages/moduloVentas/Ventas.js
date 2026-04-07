import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ListVentas } from "../../components/componentesVentas/ListaVentas";
import GraficoBarVentas from "../../graficosChar/GraficoBarVentas";
import GraficoLineaEjemplo from "../../graficosChar/GraficoLineVentas";
import GraficoLineaDayVentas from "../../graficosChar/GraficoLineDayVentas";
import "../../css/EstilosVentas.css";
import { getVentas } from "../../service/ObtenerVentasDetalle";
import {
  CalendarFold,
  FileText,
  Search,
  TrendingDown,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import GraficoMetodoPago from "../../graficosChar/GraficoMetodoPago";
import { PlatoMasVendido } from "../../components/componentesHome/PlatosMasVendidos";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";

export function Ventas() {
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

  const ventas = Array.isArray(ventasData) ? ventasData : [];
  const now = new Date();
  const mesActual = now.getMonth() + 1;
  const anioActual = now.getFullYear();
  const mesPasado = mesActual === 1 ? 12 : mesActual - 1;
  const anioMesPasado = mesActual === 1 ? anioActual - 1 : anioActual;

  const totalVentas = ventas
    .filter((venta) => {
      const fecha = new Date(venta.created_at);
      return (
        fecha.getMonth() + 1 === mesActual && fecha.getFullYear() === anioActual
      );
    })
    .reduce((sum, venta) => sum + parseFloat(venta.total || 0), 0)
    .toFixed(2);

  const totalVentasMesPasado = ventas
    .filter((venta) => {
      const fecha = new Date(venta.created_at);
      return (
        fecha.getMonth() + 1 === mesPasado &&
        fecha.getFullYear() === anioMesPasado
      );
    })
    .reduce((sum, venta) => sum + parseFloat(venta.total || 0), 0)
    .toFixed(2);

  const diferenciaVentas = (
    parseFloat(totalVentas) - parseFloat(totalVentasMesPasado)
  ).toFixed(2);

  const hoy = new Date();
  const totalVentasHoy = ventas
    .filter((venta) => {
      const fecha = new Date(venta.created_at);
      return (
        fecha.getDate() === hoy.getDate() &&
        fecha.getMonth() === hoy.getMonth() &&
        fecha.getFullYear() === hoy.getFullYear()
      );
    })
    .reduce((sum, venta) => sum + parseFloat(venta.total || 0), 0)
    .toFixed(2);

  const formatToDMY = (isoDate) => {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    const shortYear = year.slice(2); // "2025" -> "25"
    return `${parseInt(day)}/${parseInt(month)}/${shortYear}`;
  };

  return (
    <div className="row g-3 ">
      {/* Encabezado: Ventas de Hoy y Gráfico por Hora */}
      <div className="col-12 col-lg-7 h-100 ">
        <div className="row g-3 ">
          <div className="col-12">
            <CondicionCarga isLoading={isLoading} isError={isError}>
              <div className="card  py-2 h-100">
                <div className="card-header d-flex p-4 bg-transparent justify-content-between align-items-center">
                  <div>
                    <h1 className="m-0 mb-2">¡Buen día!</h1>
                    <p className="fw-normal text-secondary m-0">
                      Esto es lo que sucede con tus Ventas Hoy
                    </p>
                  </div>
                  <div className="ms-auto">
                    <img
                      src="/images/store.png"
                      alt="tienda"
                      className="store-image img-fluid"
                    />
                  </div>
                </div>
                <div className="card-body">
                  <div>
                    <p className="totalVentasTitulo mb-2">
                      S/.{totalVentasHoy}
                    </p>
                    <small className="text-secondary fw-normal">
                      Ventas Hoy
                    </small>
                  </div>
                </div>
                <div className="card-footer bg-auto border-0 d-flex p-4">
                  <div className="d-flex ms-auto">
                    <button
                      type="button"
                      className="btn d-flex btn-outline-dark px-3"
                      onClick={() => GetReporteExcel("/reporteVentasHOY")}
                    >
                      <FileText size={18} />
                      Reporte Hoy
                    </button>
                  </div>
                </div>
              </div>
            </CondicionCarga>
          </div>
          {/* Gráficos Row 1 */}
          <div className="col-md-4 ">
            <CondicionCarga isLoading={isLoading} isError={isError}>
              <div className="card p-3  h-100 w-100 m-0">
                <h6
                  className="fw-bold mb-3"
                  style={{ fontSize: "0.95rem", color: "#374151" }}
                >
                  Ventas por Hora
                </h6>
                <GraficoLineaDayVentas />
              </div>
            </CondicionCarga>
          </div>
          <div className="col-md-4 ">
            <CondicionCarga isLoading={isLoading} isError={isError}>
              <div className="card p-3  h-100 w-100 m-0">
                <h6
                  className="fw-bold mb-3"
                  style={{ fontSize: "0.95rem", color: "#374151" }}
                >
                  Métodos de Pago
                </h6>
                <GraficoMetodoPago />
              </div>
            </CondicionCarga>
          </div>
          <div className="col-md-4 ">
            <CondicionCarga isLoading={isLoading} isError={isError}>
              <div className="card p-3  h-100 w-100 m-0">
                <h6
                  className="fw-bold mb-3"
                  style={{ fontSize: "0.95rem", color: "#374151" }}
                >
                  Top Ventas
                </h6>
                <PlatoMasVendido />
              </div>
            </CondicionCarga>
          </div>
        </div>
      </div>

      {/* Resumen mensual y gráfico mensual */}
      <div className="col-12 col-lg-5 h-100">
        <div className="row g-3">
          {/* Tarjetas resumen tipo dashboard */}
          <div className="col-12">
            <div className="row g-3">
              <div className="col-4">
                <CondicionCarga
                  isLoading={isLoading}
                  isError={isError}
                  mode="single-card"
                >
                  <div
                    className="card  border-0 p-3 d-flex flex-column justify-content-between"
                    style={{ background: "white", minHeight: 140 }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="bg-success bg-opacity-10 rounded-circle p-3">
                        <DollarSign size={24} className="text-success" />
                      </span>
                      <span
                        className="ms-auto text-success fw-bold d-flex align-items-center gap-1"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <TrendingUp size={16} /> +
                        {(
                          (diferenciaVentas / totalVentasMesPasado) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div>
                      <span
                        className="text-muted fw-600"
                        style={{
                          fontSize: "0.85rem",
                          display: "block",
                          marginBottom: "4px",
                        }}
                      >
                        Este Mes
                      </span>
                      <h3
                        className="fw-bold text-dark mb-0"
                        style={{ fontSize: "1.3rem" }}
                      >
                        S/ {totalVentas}
                      </h3>
                    </div>
                  </div>
                </CondicionCarga>
              </div>
              <div className="col-4">
                <CondicionCarga
                  isLoading={isLoading}
                  isError={isError}
                  mode="single-card"
                >
                  <div
                    className="card  border-0 p-3 d-flex flex-column justify-content-between"
                    style={{ background: "white", minHeight: 140 }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="bg-warning bg-opacity-10 rounded-circle p-3">
                        <CalendarFold size={24} className="text-warning" />
                      </span>
                      <span
                        className="ms-auto text-warning fw-bold d-flex align-items-center gap-1"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <TrendingUp size={16} /> +
                        {((totalVentasMesPasado / totalVentas) * 100).toFixed(
                          1,
                        )}
                        %
                      </span>
                    </div>
                    <div>
                      <span
                        className="text-muted fw-600"
                        style={{
                          fontSize: "0.85rem",
                          display: "block",
                          marginBottom: "4px",
                        }}
                      >
                        Mes Pasado
                      </span>
                      <h3
                        className="fw-bold text-dark mb-0"
                        style={{ fontSize: "1.3rem" }}
                      >
                        S/ {totalVentasMesPasado}
                      </h3>
                    </div>
                  </div>
                </CondicionCarga>
              </div>
              <div className="col-4">
                <CondicionCarga
                  isLoading={isLoading}
                  isError={isError}
                  mode="single-card"
                >
                  <div
                    className="card  border-0 p-3 d-flex flex-column justify-content-between"
                    style={{
                      background: "white",
                      minHeight: 140,
                    }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span
                        className={`rounded-circle p-3 ${
                          diferenciaVentas > 0
                            ? "bg-success bg-opacity-10"
                            : "bg-danger bg-opacity-10"
                        }`}
                      >
                        {diferenciaVentas > 0 ? (
                          <TrendingUp size={28} className="text-success" />
                        ) : (
                          <TrendingDown size={28} className="text-danger" />
                        )}
                      </span>
                      <span
                        className={`ms-auto fw-bold text-sm ${
                          diferenciaVentas > 0 ? "text-success" : "text-danger"
                        }`}
                        style={{ fontSize: "0.9rem" }}
                      >
                        {diferenciaVentas > 0 ? "+" : ""}
                        {(
                          (diferenciaVentas / totalVentasMesPasado) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div>
                      <span
                        className="text-muted fw-600"
                        style={{
                          fontSize: "0.85rem",
                          display: "block",
                          marginBottom: "4px",
                        }}
                      >
                        Diferencia
                      </span>
                      <h3
                        className={`fw-bold mb-0 ${
                          diferenciaVentas > 0 ? "text-success" : "text-danger"
                        }`}
                        style={{ fontSize: "1.3rem" }}
                      >
                        S/ {diferenciaVentas}
                      </h3>
                    </div>
                  </div>
                </CondicionCarga>
              </div>
            </div>
          </div>
          {/* Gráfico mensual de todas las ventas */}
          <div className="col-12">
            <CondicionCarga isLoading={isLoading} isError={isError}>
              <div className="card p-4  h-100">
                <h6
                  className="fw-bold mb-3"
                  style={{ fontSize: "0.95rem", color: "#374151" }}
                >
                  Ventas Acumuladas
                </h6>
                <GraficoBarVentas />
              </div>
            </CondicionCarga>
          </div>
          {/* Gráfico ventas solo del ultimo mes*/}
          <div className="col-12">
            <CondicionCarga isLoading={isLoading} isError={isError}>
              <div className="card p-4 shadow-sm h-100">
                <h6
                  className="fw-bold mb-3"
                  style={{ fontSize: "0.95rem", color: "#374151" }}
                >
                  Tendencia Mensual
                </h6>
                <GraficoLineaEjemplo />
              </div>
            </CondicionCarga>
          </div>
        </div>
      </div>

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
