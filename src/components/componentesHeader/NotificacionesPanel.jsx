import { Bell, AlertTriangle, Inbox } from "lucide-react";
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
// Asegúrate de que esta ruta sea correcta
import { GetNotificaciones } from "../../service/accionesGenerales/GetNotificaciones";
import { Button } from "../ui/button";

const getIcon = (tipo, prioridad) => {
  if (tipo === "alerta" || prioridad === "alta") {
    return <AlertTriangle size={20} className="text-destructive" />;
  }
  return <Bell size={20} className="text-muted-foreground" />;
};

const getPriorityBadge = (prioridad) => {
  switch (prioridad) {
    case "alta":
      return (
        <span className="rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
          Alta
        </span>
      );
    case "media":
      return (
        <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          Media
        </span>
      );
    default:
      return (
        <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          Baja
        </span>
      );
  }
};

const getTypeBadge = (tipo) => {
  if (tipo === "alerta") {
    return (
      <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
        {tipo}
      </span>
    );
  }
  return (
    <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
      {tipo}
    </span>
  );
};

/**
 * Componente de un solo ítem de notificación (Diseño Corregido)
 */
const NotificacionItem = ({ n }) => {
  return (
    <div
      key={n.id}
      className={`flex items-start gap-3 border-b border-border px-4 py-4 last:border-b-0 ${
        n.estado == 0 ? "bg-accent/40" : ""
      }`}
    >
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        {getIcon(n.tipo, n.prioridad)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-foreground">{n.titulo}</div>
        <div className="mt-1 break-words text-sm text-muted-foreground">
          {n.mensaje}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {getPriorityBadge(n.prioridad)}
          {getTypeBadge(n.tipo)}
        </div>
      </div>

      {n.estado == 0 && (
        <span
          aria-label="No leída"
          className="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
        />
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
          className="flex min-h-[200px] items-center justify-center"
          role="status"
        >
          <span className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
          <span className="sr-only">Cargando notificaciones...</span>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="p-6 text-center text-sm text-destructive" role="alert">
          <AlertTriangle className="mx-auto mb-2" />
          <p className="font-medium">No se pudieron cargar las notificaciones.</p>
          <small className="text-muted-foreground">{error?.message}</small>
        </div>
      );
    }

    if (notificacionesFiltradas.length === 0) {
      return (
        <div className="p-8 text-center text-sm text-muted-foreground">
          <Inbox className="mx-auto mb-2" />
          <p className="mb-0">
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
    <div className="flex h-full flex-col">
      <div
        className="flex gap-2 border-b border-border px-3 py-2"
        role="tablist"
        aria-label="Filtrar notificaciones"
      >
        {tabs.map((t) => (
          <Button
            type="button"
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            className={`inline-flex min-w-[70px] items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              tab === t.key
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            }`}
            onClick={() => setTab(t.key)}
           variant="default">
            {t.label}
            <span className="rounded-md bg-background px-1.5 py-0.5 text-xs text-muted-foreground">
              {t.count}
            </span>
          </Button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">{renderContenido()}</div>

      <div className="border-t border-border px-3 py-2 text-center">
        <Button
          type="button"
          className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
         variant="default">
          Marcar todas como leídas
        </Button>
      </div>
    </div>
  );
}
