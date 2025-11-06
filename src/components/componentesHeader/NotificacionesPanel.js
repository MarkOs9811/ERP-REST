import { Bell, AlertTriangle, Inbox } from "lucide-react";
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import "../../css/EstilosPanelHeader.css";
// Asegúrate de que esta ruta sea correcta
import { GetNotificaciones } from "../../service/accionesGenerales/GetNotificaciones";

const getIcon = (tipo, prioridad) => {
  if (tipo === "alerta" || prioridad === "alta") {
    return <AlertTriangle size={24} className="text-danger" />;
  }
  return <Bell size={24} className="text-primary" />;
};

const getPriorityBadge = (prioridad) => {
  switch (prioridad) {
    case "alta":
      return <span className="badge bg-danger text-white">Alta</span>;
    case "media":
      return <span className="badge bg-warning text-dark">Media</span>;
    default:
      return <span className="badge bg-secondary text-white">Baja</span>;
  }
};

const getTypeBadge = (tipo) => {
  if (tipo === "alerta") {
    return <span className="badge bg-warning text-dark">{tipo}</span>;
  }
  return <span className="badge bg-info text-white">{tipo}</span>;
};

/**
 * Componente de un solo ítem de notificación (Diseño Corregido)
 */
const NotificacionItem = ({ n }) => {
  return (
    <div
      key={n.id}
      className={`notificacion-item d-flex align-items-center p-3 gap-3 ${
        n.estado == 0 ? "bg-notify-unread" : ""
      }`}
    >
      <div className="m-3">{getIcon(n.tipo, n.prioridad)}</div>

      <div className="flex-grow-1">
        <div className="fw-bold notif-titulo">{n.titulo}</div>
        <div className="small notif-mensaje mt-1">{n.mensaje}</div>
        <div className="small mt-2 d-flex gap-2">
          {getPriorityBadge(n.prioridad)}
          {getTypeBadge(n.tipo)}
        </div>
      </div>

      {n.estado == 0 && (
        <span className="ms-auto">
          <span className="text-danger" style={{ fontSize: 18 }}>
            ●
          </span>
        </span>
      )}
    </div>
  );
};

/**
 * Panel principal de Notificaciones
 */
export function NotificacionesPanel({ show, onClose }) {
  const [tab, setTab] = useState("all");

  const {
    data: todasNotificaciones = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["notificaciones"],
    queryFn: GetNotificaciones,
    staleTime: 1000 * 60 * 5,
  });

  const unreadCount = useMemo(
    () => todasNotificaciones.filter((n) => n.estado == 0).length,
    [todasNotificaciones]
  );
  const allCount = todasNotificaciones.length;

  const tabs = [
    { key: "all", label: "Todas", count: allCount },
    { key: "unread", label: "No Leídas", count: unreadCount },
  ];

  const notificacionesFiltradas = useMemo(() => {
    if (tab === "unread") {
      return todasNotificaciones.filter((n) => n.estado == 0);
    }
    return todasNotificaciones;
  }, [tab, todasNotificaciones]);

  const renderContenido = () => {
    if (isLoading) {
      return (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: 200 }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="text-center p-4 text-danger">
          <AlertTriangle className="mb-2" />
          <p>No se pudieron cargar las notificaciones.</p>
          <small className="text-muted">{error?.message}</small>
        </div>
      );
    }

    if (notificacionesFiltradas.length === 0) {
      return (
        <div className="text-center p-4 text-muted">
          <Inbox className="mb-2" />
          <p>
            {tab === "unread"
              ? "No tienes notificaciones no leídas."
              : "No hay notificaciones."}
          </p>
        </div>
      );
    }

    return notificacionesFiltradas.map((n) => (
      <NotificacionItem key={n.id} n={n} />
    ));
  };

  return (
    <div>
      <div className="d-flex gap-2 px-3 py-2 border-bottom">
        {tabs.map((t) => (
          <button
            type="button"
            key={t.key}
            className={`btn btn-sm rounded-pill fw-bold ${
              tab === t.key ? "btn-light border" : "text-body-secondary"
            }`}
            style={{ minWidth: 70 }}
            onClick={() => setTab(t.key)}
          >
            {t.label} <span className="badge bg-secondary ms-1">{t.count}</span>
          </button>
        ))}
      </div>

      <div className="notificaciones-panel-list">{renderContenido()}</div>

      <div className="text-center py-2 border-top">
        <button className="btn btn-link fw-bold text-primary">
          Marcar todas como leídas
        </button>
      </div>
    </div>
  );
}
