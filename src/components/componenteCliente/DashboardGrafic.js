import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetClientesDashboard } from "../../service/accionesClientes/GetClientes";
import {
  Users,
  ShoppingCart,
  TrendingUp,
  MessageSquareHeartIcon,
  UsersRoundIcon,
} from "lucide-react"; // Se removió DollarSign
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";
import { TablasGenerales } from "../componentesReutilizables/TablasGenerales";
import "../../css/estilosClientes/DashboardCliente.css";
import { useNavigate } from "react-router-dom";
import { ListaFeedBacks } from "./ListaFeedBacks";

// 1. Utilidades
const formatSoles = (monto) => {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(monto || 0);
};

// 2. Micro-componente Avatar
const UserAvatar = ({ foto, nombre }) => {
  const [imgError, setImgError] = useState(false);
  const inicial = nombre ? nombre.charAt(0).toUpperCase() : "C";

  if (foto && !imgError) {
    return (
      <img
        src={foto}
        alt={`Avatar`}
        className="rounded-circle flex-shrink-0"
        style={{ width: "36px", height: "36px", objectFit: "cover" }}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <div
      className="bg-fw-saffron-soft text-fw-saffron rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
      style={{ width: "36px", height: "36px", fontSize: "14px" }}
    >
      {inicial}
    </div>
  );
};

// 3. Micro-componente KPI Card (Basado en tu diseño)
const KpiCard = ({ icon, trendType, trendValue, title, value, colorClass }) => {
  const isUp = trendType === "up";
  return (
    <div className="card  p-4 h-100 border rounded-4">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div
          className={`bg-fw-${colorClass}-soft text-fw-${colorClass} rounded-fw-md d-flex align-items-center justify-content-center`}
          style={{ width: "48px", height: "48px" }}
        >
          {icon}
        </div>
        <div
          className={`badge rounded-pill px-2 py-1 fw-bold ${
            isUp
              ? "bg-fw-emerald-soft text-fw-emerald"
              : "bg-fw-strawberry-soft text-fw-strawberry"
          }`}
          style={{ fontSize: "12px" }}
        >
          {isUp ? "↑" : "↓"} {trendValue}%
        </div>
      </div>
      <div>
        <p className="text-fw-muted small mb-1 fw-semibold">{title}</p>
        <h3 className="mb-0 fw-bold text-fw-main">{value}</h3>
      </div>
    </div>
  );
};

// 4. Componente Principal
export function DashboardGrafic() {
  const {
    data: metricas = null,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["clientesDashboard"],
    queryFn: GetClientesDashboard,
  });

  const navegacion = useNavigate();
  const kpis = metricas?.kpis || {
    total_clientes: 0,
    ticket_promedio: 0,
    ingresos_totales: 0,
    crecimiento: 0,
  };
  const top_clientes = metricas?.top_clientes || [];

  // Definición de columnas para TablasGenerales
  const columnas = useMemo(
    () => [
      {
        name: "Cliente",
        selector: (row) => row.nombre, // Para el sort alfabético
        sortable: true,
        cell: (row) => (
          <div className="d-flex align-items-center gap-3 py-2">
            <UserAvatar foto={row.foto} nombre={row.nombre} />
            <div>
              <span className="d-block fw-bold text-fw-main">
                {row.nombre} {row.apellidos}
              </span>
              <small className="text-fw-muted" style={{ fontSize: "12px" }}>
                {row.correo || "Sin correo"}
              </small>
            </div>
          </div>
        ),
      },
      {
        name: "Frecuencia (Pedidos)",
        selector: (row) => row.cantidad_pedidos,
        sortable: true,
        center: true,
        width: "150px",
        cell: (row) => (
          <span
            className="badge border px-2 py-1 text-fw-main"
            style={{ backgroundColor: "var(--fw-muetd)" }}
          >
            {row.cantidad_pedidos}
          </span>
        ),
      },
      {
        name: "Total (S/)",
        selector: (row) => row.total_comprado,
        sortable: true,
        right: true,
        width: "200px",
        cell: (row) => (
          <span className="fw-bold text-fw-emerald">
            {formatSoles(row.total_comprado)}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="p-0">
      {/* SECCIÓN 1: KPIs Grid */}
      <div className="row g-3 mb-4">
        <CondicionCarga isLoading={isLoading} isError={isError} mode="cards">
          <div className="col-md-3">
            <KpiCard
              icon={<span className="fw-bold h5 mb-0 text-center">S/</span>} // <- MODIFICACIÓN AQUÍ
              colorClass="emerald"
              trendType="up"
              trendValue="12.5"
              title="Ingresos Totales"
              value={formatSoles(kpis.ingresos_totales || 0)} // Dato mock por ahora
            />
          </div>

          <div className="col-md-3">
            <KpiCard
              icon={<Users size={24} />}
              colorClass="saffron"
              trendType="up"
              trendValue="5.2"
              title="Clientes Activos"
              value={kpis.total_clientes}
            />
          </div>

          <div className="col-md-3">
            <KpiCard
              icon={<ShoppingCart size={24} />}
              colorClass="strawberry"
              trendType="down"
              trendValue="2.1"
              title="Promedio por Pedido"
              value={formatSoles(kpis.ticket_promedio)}
            />
          </div>

          <div className="col-md-3">
            <KpiCard
              icon={<TrendingUp size={24} />}
              colorClass="emerald"
              trendType="up"
              trendValue="4.3"
              title="Tasa de Crecimiento"
              value={`${kpis.crecimiento || 0}%`} // Dato mock por ahora
            />
          </div>
        </CondicionCarga>

        {/* SECCIÓN 2: Tabla Top Clientes */}
        <CondicionCarga
          isLoading={isLoading}
          isError={isError}
          mode="single-card"
        >
          <div className="col-md-8">
            <div className="card">
              <div className="card-header align-baseline d-flex justify-content-center">
                <h6 className="fw-bold text-fw-main">
                  {" "}
                  <UsersRoundIcon className="me-2" />
                  Clientes frecuentes
                </h6>

                <div className="ms-auto">
                  <button
                    className="btn btn-outline-dark"
                    onClick={() => navegacion("/clientes/lista")}
                  >
                    Ver todos
                  </button>
                </div>
              </div>
              <div className="card-body p-0">
                <TablasGenerales columnas={columnas} datos={top_clientes} />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card rounded-3">
              <div className="card-header justify-content-left d-flex align-baseline">
                <h6 className="fw-bold  text-fw-main">
                  <MessageSquareHeartIcon /> Comentarios Recientes
                </h6>
              </div>
              <div className="card-body p-0 overflow-hidden py-2">
                <ListaFeedBacks />
              </div>
            </div>
          </div>
        </CondicionCarga>
      </div>
    </div>
  );
}
