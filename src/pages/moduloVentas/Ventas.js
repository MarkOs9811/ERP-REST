import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ListVentas } from "../../components/componentesVentas/ListaVentas";
import GraficoBarVentas from "../../graficosChar/GraficoBarVentas";
import GraficoLineaEjemplo from "../../graficosChar/GraficoLineVentas";
import GraficoLineaDayVentas from "../../graficosChar/GraficoLineDayVentas";
import "../../css/EstilosVentas.css";
import { getVentas } from "../../service/ObtenerVentasDetalle";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";

export function Ventas() {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const {
    data: ventasData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
  });

  if (isLoading) return <p>Cargando ventas...</p>;
  if (error) return <p>Error al obtener ventas: {error.message}</p>;
  if (!ventasData || !Array.isArray(ventasData))
    return <p>Error: No se encontraron ventas.</p>;

  const ventas = ventasData;
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
  console.log("Total Ventas", totalVentas);

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

  const situacion =
    totalVentas > totalVentasMesPasado
      ? "Mejor que el mes pasado :)"
      : totalVentas < totalVentasMesPasado
      ? "Menos que el mes pasado :("
      : "Igual que el mes pasado :|";

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
    <ContenedorPrincipal>
      <div className="row g-3">
        <div className="col-lg-6">
          <div className="row g-3 h-100">
            <div className="col-md-12">
              <div className="card shadow-sm h-100">
                <div className="card-header d-flex p-4">
                  <div>
                    <h1 className="text-primary">¡Buen día!</h1>
                    <p className="fw-normal text-secondary">
                      Esto es lo que sucede con tus Ventas Hoy
                    </p>
                    <p className="totalVentasTitulo mb-0">
                      S/.{totalVentasHoy}
                    </p>
                    <small className="text-secondary fw-normal">
                      {situacion}
                    </small>
                  </div>
                  <div className="ms-auto">
                    <img
                      src="/images/store.png"
                      alt="tienda"
                      className="store-image img-fluid"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="card p-2 shadow-sm h-100">
                <GraficoLineaDayVentas />
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="card p-2 shadow-sm h-100">
                <GraficoBarVentas />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="row g-3">
            <div className="col-lg-12">
              <div className=" h-100">
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="card mb-0 m-0 text-center p-4 shadow-sm ">
                      <p className="h6 tituloCard">Este Mes</p>
                      <p className="h4 text-auto fw-normal">S/{totalVentas}</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card mb-0 m-0 text-center p-4 shadow-sm ">
                      <p className="h6 tituloCard">Mes Pasado</p>
                      <p className="h4 text-auto fw-normal">
                        S/ {totalVentasMesPasado}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card mb-0 m-0 text-center p-4 shadow-sm ">
                      <p className="h6 tituloCard">Diferencia</p>
                      <p className="h4 text-auto fw-normal">
                        S/ {diferenciaVentas}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="card p-3 shadow-sm h-100">
                <GraficoLineaEjemplo />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <div className="card shadow-sm">
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
                    const formatted = formatToDMY(rawDate); // sin errores de zona horaria
                    setSearch(formatted);
                  }}
                />
              </div>
            </div>

            <div className="card-body p-0">
              <ListVentas search={search} />
            </div>
          </div>
        </div>
      </div>
    </ContenedorPrincipal>
  );
}
