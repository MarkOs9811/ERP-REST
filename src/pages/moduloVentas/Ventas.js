import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ListVentas } from "../../components/componentesVentas/ListaVentas";
import GraficoBarVentas from "../../graficosChar/GraficoBarVentas";
import GraficoLineaEjemplo from "../../graficosChar/GraficoLineVentas";
import GraficoLineaDayVentas from "../../graficosChar/GraficoLineDayVentas";
import "../../css/EstilosVentas.css";
import { getVentas } from "../../service/ObtenerVentasDetalle";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import {
  CalendarFold,
  FileChartColumnIncreasing,
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
              <div className="card shadow-sm py-2 h-100">
                <div className="card-header d-flex p-4 bg-transparent">
                  <div>
                    <h1 className="text-primary">¡Buen día!</h1>
                    <p className="fw-normal text-secondary">
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
                    <p className="totalVentasTitulo mb-0">
                      S/.{totalVentasHoy}
                    </p>
                    <small className="text-secondary fw-normal">
                      Ventas Hoy.
                    </small>
                  </div>
                </div>
                <div className="card-footer bg-auto border-0 d-flex p-4">
                  <div className="d-flex ms-auto">
                    <button
                      type="button"
                      className="btn d-flex btn-outline-dark px-2 py-2 btn-sm rounded"
                      onClick={() => GetReporteExcel("/reporteVentasHOY")}
                    >
                      <FileChartColumnIncreasing className="text-auto" />{" "}
                      Reporte de ventas Hoy
                    </button>
                  </div>
                </div>
              </div>
            </CondicionCarga>
          </div>
          {/* Gráfico de ventas por hora */}
          <div className="col-md-4 ">
            <CondicionCarga isLoading={isLoading} isError={isError}>
              <div className="card p-3 shadow-sm h-100 w-100 m-0">
                <GraficoLineaDayVentas />
              </div>
            </CondicionCarga>
          </div>
          <div className="col-md-4 ">
            <CondicionCarga isLoading={isLoading} isError={isError}>
              <div className="card p-3 shadow-sm h-100 w-100 m-0">
                <GraficoMetodoPago />
              </div>
            </CondicionCarga>
          </div>
          <div className="col-md-4 ">
            <CondicionCarga isLoading={isLoading} isError={isError}>
              <div className="card p-3 shadow-sm h-100 w-100 m-0">
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
                    className="card shadow-sm border-0 p-3 d-flex flex-column justify-content-between"
                    style={{ background: "#f1faf6", minHeight: 120 }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="bg-success bg-opacity-10 rounded-circle p-2">
                        <DollarSign size={28} className="text-success" />
                      </span>
                      <span className="ms-auto text-success fw-bold">
                        <TrendingUp size={18} /> +
                        {(
                          (diferenciaVentas / totalVentasMesPasado) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div>
                      <span className="text-muted">Este Mes</span>
                      <h3 className="fw-bold text-dark mb-0">
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
                    className="card shadow-sm border-0 p-3 d-flex flex-column justify-content-between"
                    style={{ background: "#fff6f6", minHeight: 120 }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="bg-warning bg-opacity-10 rounded-circle p-2">
                        <CalendarFold size={28} className="text-warning" />
                      </span>
                      <span className="ms-auto text-warning fw-bold">
                        <TrendingUp size={18} /> +
                        {((totalVentasMesPasado / totalVentas) * 100).toFixed(
                          1
                        )}
                        %
                      </span>
                    </div>
                    <div>
                      <span className="text-muted">Mes Pasado</span>
                      <h3 className="fw-bold text-dark mb-0">
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
                    className="card shadow-sm border-0 p-3 d-flex flex-column justify-content-between"
                    style={{
                      background: diferenciaVentas > 0 ? "#e8f5e9" : "#ffebee",
                      minHeight: 120,
                    }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span
                        className={`rounded-circle p-2 ${
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
                        className={`ms-auto fw-bold ${
                          diferenciaVentas > 0 ? "text-success" : "text-danger"
                        }`}
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
                      <span className="text-muted">Diferencia</span>
                      <h3
                        className={`fw-bold mb-0 ${
                          diferenciaVentas > 0 ? "text-success" : "text-danger"
                        }`}
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
              <div className="card p-3 shadow-sm h-100">
                <GraficoBarVentas />
              </div>
            </CondicionCarga>
          </div>
          {/* Gráfico ventas solo del ultimo mes*/}
          <div className="col-12">
            <CondicionCarga isLoading={isLoading} isError={isError}>
              <div className="card p-3 shadow-sm h-100">
                <GraficoLineaEjemplo />
              </div>
            </CondicionCarga>
          </div>
        </div>
      </div>

      {/* Lista de ventas */}
      <div className="col-12">
        <CondicionCarga isLoading={isLoading} isError={isError}>
          <div className="card shadow-sm py-2">
            <div className="card-header d-flex flex-column flex-md-row justify-content-between gap-2">
              <h3>Ventas</h3>
              <div className="d-flex flex-column flex-md-row gap-2 ">
                {/* Filtro por texto */}
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="form-control"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedDate(""); // limpiar fecha si escribes texto
                  }}
                />

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
                />
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() => GetReporteExcel("/reporteVentasTodo")}
                >
                  <FileChartColumnIncreasing className="text-auto" />
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
