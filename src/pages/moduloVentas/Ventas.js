import { useEffect, useState } from "react";
import { ListVentas } from "../../components/componentesVentas/ListaVentas";
import GraficoBarVentas from "../../graficosChar/GraficoBarVentas";
import GraficoLineaEjemplo from "../../graficosChar/GraficoLineVentas";
import "../../css/EstilosVentas.css";
import { getVentas } from "../../service/ObtenerVentasDetalle";
import GraficoLineaDayVentas from "../../graficosChar/GraficoLineDayVentas";

export function Ventas() {
  const [search, setSearch] = useState("");

  const [totalVentas, setTotalVentas] = useState("");
  const [totalVentasMesPasado, setTotalVentasMesPasado] = useState("");
  const [situacion, setSituacion] = useState("");
  const [diferenciaVentas, setDiferenciaVentas] = useState("");
  useEffect(() => {
    if (totalVentas && totalVentasMesPasado) {
      const diferencia = (
        parseFloat(totalVentas) - parseFloat(totalVentasMesPasado)
      ).toFixed(2);
      setDiferenciaVentas(diferencia);
    }
  }, [totalVentas, totalVentasMesPasado]); // Escucha cambios en totalVentas y totalVentasMesPasado

  const obtenerMesActual = () => new Date().getMonth() + 1; // Mes actual (1-12)

  // Función para obtener el mes pasado, teniendo en cuenta el cambio de año
  const obtenerMesPasado = () => {
    const mesActual = new Date().getMonth(); // Mes actual (0-11)
    if (mesActual === 0) {
      // Si estamos en enero, el mes pasado es diciembre (12)
      return 12;
    } else {
      return mesActual; // De lo contrario, el mes pasado es simplemente el mes anterior
    }
  };

  const sumaVentas = async () => {
    const result = await getVentas();
    if (result.success) {
      const mesActual = obtenerMesActual();
      const mesPasado = obtenerMesPasado();

      // Filtrar ventas por mes actual y mes pasado
      const ventasMesActual = result.data.filter((venta) => {
        const mesVenta = new Date(venta.fechaVenta).getMonth() + 1; // mes 0-11 convertido a 1-12
        return mesVenta === mesActual;
      });

      // Filtrar correctamente las ventas del mes pasado
      const ventasMesPasado = result.data.filter((venta) => {
        const mesVenta = new Date(venta.fechaVenta).getMonth() + 1; // mes 0-11 convertido a 1-12
        return mesVenta === mesPasado;
      });

      // Sumar totales por cada mes
      const totalMesActual = ventasMesActual.reduce(
        (sum, venta) => sum + parseFloat(venta.total),
        0
      );

      const totalMesPasado = ventasMesPasado.reduce(
        (sum, venta) => sum + parseFloat(venta.total),
        0
      );

      setTotalVentas(totalMesActual.toFixed(2));
      setTotalVentasMesPasado(totalMesPasado.toFixed(2));

      // Determinar situación
      if (totalMesActual > totalMesPasado) {
        setSituacion("Mejor que el mes pasado :)");
      } else if (totalMesActual < totalMesPasado) {
        setSituacion("Menos que el mes pasado :(");
      } else {
        setSituacion("Igual que el mes pasado :|");
      }
    } else {
      console.error("Error:", result.message);
    }
  };

  useEffect(() => {
    sumaVentas();
  }, []);

  return (
    <div className="row g-3">
      <div className="col-lg-6">
        <div className="row g-3">
          <div className="col-lg-12 col-md-12 col-sm-12">
            <div className="card shadow-sm">
              <div className="card-header d-flex p-4">
                <div>
                  <h1 className="text-primary">¡Buen día!</h1>
                  <p className="fw-normal text-secondary">
                    Esto es lo que sucede con tus Ventas Hoy
                  </p>
                  <div className="align-items-center align-middle">
                    <p className="totalVentasTitulo mb-0">S/.{totalVentas}</p>

                    <small className="text-secondary fw-normal">
                      {situacion}
                    </small>
                  </div>
                </div>
                <div className="d-flex justify-content-beetwen align-item-center ms-auto">
                  <img
                    src="/images/store.png"
                    alt="tienda"
                    className="store-image img-fluid"
                  />
                </div>
              </div>
              <div className="card-body card-body-ventasDahs"></div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="row g-3">
              <div className="col-lg-6 col-md-12 col-sm-12 d-flex">
                <div className="card p-3 shadow-sm flex-fill">
                  <GraficoLineaDayVentas />
                </div>
              </div>
              <div className="col-lg-6 col-md-12 col-sm-12 d-flex">
                <div className="card p-3 shadow-sm flex-fill">
                  <GraficoBarVentas />
                </div>
              </div>
              <div className="col-lg-6 col-md-12 col-sm-12 d-flex">
                <div className="card p-3 shadow-sm flex-fill">
                  <GraficoBarVentas />
                </div>
              </div>
              <div className="col-lg-6 col-md-12 col-sm-12 d-flex">
                <div className="card p-3 shadow-sm flex-fill">
                  <GraficoBarVentas />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="row g-3">
          <div className="col-lg-12 ">
            <div className="card shadow-sm h-100">
              <div className="row g-3 ">
                <div className="col-md-4">
                  <div className="card  mb-0 m-0 text-center p-4">
                    <p className="h6 tituloCard">Este Mes</p>
                    <p className="h4 text-dark fw-normal">S/{totalVentas}</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card  mb-0 m-0 text-center p-4">
                    <p className="h6 tituloCard">Mes Pasado</p>
                    <p className="h4 text-dark fw-normal">
                      S/ {totalVentasMesPasado}
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card  mb-0 m-0 text-center p-4">
                    <p className="h6 tituloCard">Diferencia</p>
                    <p className="h4 text-dark fw-normal">
                      S/ {diferenciaVentas}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12">
            <div className="card p-3 shadow-sm">
              <GraficoLineaEjemplo />
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-12">
        <div className="card  shadow-sm ">
          <div className="card-header p-3 border-bottom d-flex justify-content-between align-items-center">
            <h3>Ventas</h3>
            <div className="d-flex align-items-center">
              <div className="d-flex">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <ListVentas search={search} />
          </div>
        </div>
      </div>
    </div>
  );
}
