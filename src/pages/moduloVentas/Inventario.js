import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { InventarioList } from "../../components/componenteInventario/InventarioList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { GetInventario } from "../../service/GetInventario";
import { Cargando } from "../../components/componentesReutilizables/Cargando";
import {
  AlertCircleOutline,
  CashOutline,
  CodeSlashOutline,
  FileTrayStackedOutline,
  StorefrontOutline,
  TodayOutline,
} from "react-ionicons";

export function Inventario() {
  const [search, setSearch] = useState("");

  // Usamos React Query para manejar el estado y caching de los datos
  const { data, isLoading, isError } = useQuery({
    queryKey: ["inventario"],
    queryFn: GetInventario,
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
    refetchOnWindowFocus: false, // Evita recargar al cambiar de pestaña
  });

  // Calculamos los valores basados en los datos
  const metrics = data?.success
    ? calculateMetrics(data.data)
    : {
        productosConteo: 0,
        porVencer: 0,
        stockTotal: 0,
        valorTotal: "0.00",
      };

  return (
    <div className="container-fluid w-100 h-100 p-0">
      <div className="card bg-transparent my-0 flex-grow-1 h-100 d-flex flex-column p-0">
        <div
          className="card-body overflow-y-auto overflow-x-hidden p-0 pe-2"
          style={{ height: "calc(100vh - 480px)" }}
        >
          <div className="row g-2">
            <div className="col-lg-12">
              <div className="row g-2">
                <MetricCard
                  loading={isLoading}
                  error={isError}
                  icon={
                    <StorefrontOutline
                      color={"#ea8d1c"}
                      width={"80px"}
                      height={"80px"}
                    />
                  }
                  title="Productos"
                  value={metrics.productosConteo}
                  errorMessage="Error al cargar datos"
                />

                <MetricCard
                  loading={isLoading}
                  error={isError}
                  icon={
                    <FileTrayStackedOutline
                      color={"#1c9fea"}
                      height="80px"
                      width={"80px"}
                    />
                  }
                  title="Stock Total"
                  value={metrics.stockTotal}
                  errorMessage="Error al cargar el stock"
                />

                <MetricCard
                  loading={isLoading}
                  error={isError}
                  icon={
                    <CashOutline
                      color={"#1eca74"}
                      width={"80px"}
                      height={"80px"}
                    />
                  }
                  title="Valor Total"
                  value={`S/.${metrics.valorTotal}`}
                  errorMessage="Error al cargar datos"
                />

                <MetricCard
                  loading={isLoading}
                  error={isError}
                  icon={
                    <AlertCircleOutline
                      color={"#ca1e1e"}
                      width={"80px"}
                      height={"80px"}
                    />
                  }
                  title="Por Vencer"
                  value={metrics.porVencer}
                  errorMessage="Error al cargar datos"
                  isDanger
                />
              </div>
            </div>

            <div className="col-lg-12">
              <div className="card shadow-sm">
                <div className="card-header p-0 border-bottom d-flex justify-content-between align-items-center">
                  <div className="m-3">
                    <h3 className="card-title mb-0 titulo-card-especial">
                      Mi Inventario
                    </h3>
                  </div>
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
                    <button className="btn ms-2">
                      <FontAwesomeIcon icon={faPlus} className="icon" />
                    </button>
                  </div>
                </div>
                <div className="card-body p-0">
                  <InventarioList search={search} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar para las tarjetas de métricas
function MetricCard({
  loading,
  error,
  icon,
  title,
  value,
  errorMessage,
  isDanger = false,
}) {
  return (
    <div className="col-sm-12 col-md-3 col-lg-3">
      <div className="card shadow-sm p-3">
        {loading ? (
          <Cargando />
        ) : error ? (
          <p>{errorMessage}</p>
        ) : (
          <>
            <div>
              <span className="position-absolute opacity-50">{icon}</span>
            </div>
            <div className="text-end">
              <h4 className={`mb-1 ${isDanger ? "text-danger" : "text-dark"}`}>
                {title}
              </h4>
              <p className="h1 mb-0">{value}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Función auxiliar para calcular las métricas
function calculateMetrics(inventario) {
  let sumaTotal = 0;
  let valorTotal = 0;
  let productPorVencer = 0;
  const today = new Date();
  const oneMonthAhead = new Date(today);
  oneMonthAhead.setMonth(today.getMonth() + 1);

  inventario.forEach((items) => {
    sumaTotal += items.stock;
    valorTotal += parseFloat(items.precio) * parseFloat(items.stock);
    const fechaVencimiento = new Date(items.fecha_vencimiento);

    if (fechaVencimiento < today || fechaVencimiento <= oneMonthAhead) {
      productPorVencer += 1;
    }
  });

  return {
    productosConteo: inventario.length,
    porVencer: productPorVencer,
    stockTotal: sumaTotal,
    valorTotal: valorTotal.toFixed(2),
  };
}
