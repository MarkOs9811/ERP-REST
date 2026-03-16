import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { InventarioList } from "../../components/componenteInventario/InventarioList";
import { GetInventario } from "../../service/GetInventario";
import { Cargando } from "../../components/componentesReutilizables/Cargando";

import {
  FileText,
  Plus,
  Search,
  StickyNote,
  Store,
  TriangleAlert,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";

export function Inventario() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
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
    <div className="row g-3 ">
      <div className="col-lg-12">
        <div className="row g-3">
          <MetricCard
            loading={isLoading}
            error={isError}
            icon={<Store color={"#000000ff"} width={"80px"} height={"80px"} />}
            title="Productos"
            value={metrics.productosConteo}
            errorMessage="Error al cargar datos"
          />
          <MetricCard
            loading={isLoading}
            error={isError}
            icon={
              <StickyNote color={"#000000ff"} height="80px" width={"80px"} />
            }
            title="Stock Total"
            value={metrics.stockTotal}
            errorMessage="Error al cargar el stock"
          />

          <MetricCard
            loading={isLoading}
            error={isError}
            icon={
              <StickyNote color={"#000000ff"} width={"80px"} height={"80px"} />
            }
            title="Valor Total"
            value={`S/.${metrics.valorTotal}`}
            errorMessage="Error al cargar datos"
          />

          <MetricCard
            loading={isLoading}
            error={isError}
            icon={
              <TriangleAlert color={"#ca1e1e"} width={"80px"} height={"80px"} />
            }
            title="Por Vencer"
            value={metrics.porVencer}
            errorMessage="Error al cargar datos"
            isDanger
          />
        </div>
      </div>

      <div className="col-lg-12">
        <div className="card shadow-sm py-2">
          <div className="card-header border-bottom-0 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
            <div className="d-flex align-items-center">
              <h4 className="card-title mb-0 titulo-card-especial">
                Panel de Inventario
              </h4>
              <span className="badge-header">Productos</span>
            </div>
            
            <div className="d-flex align-items-center flex-wrap gap-2 mt-3 mt-md-0">
              <div className="header-search-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Buscar en inventario..."
                  className="form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <button
                type="button"
                className="btn btn-outline-dark px-3"
                onClick={() => GetReporteExcel("/reporteInventarioTodo")}
              >
                <FileText size={18} />
                Reporte
              </button>

              <button
                className="btn btn-dark px-3"
                onClick={() => navigate("/ventas/solicitud/realizarSolicitud")}
              >
                <Plus size={18} />
                Solicitar
              </button>
            </div>
          </div>
          <div className="card-body p-0">
            <InventarioList search={search} />
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
      <CondicionCarga isLoading={loading} isError={error} mode="single-card">
        <div className="card shadow-sm p-3">
          <div>
            <span className="position-absolute opacity-90">{icon}</span>
          </div>
          <div className="text-end">
            <h4 className={`mb-1 ${isDanger ? "text-danger" : "text-dark"}`}>
              {title}
            </h4>
            <p className="h1 mb-0">{value}</p>
          </div>
        </div>
      </CondicionCarga>
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
