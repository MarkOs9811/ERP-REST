import React from "react";
import { Tag, AlertCircle, Circle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { GetCampañaPromos } from "../../service/accionesClientes/GetCampañaPromos";
import { Button } from "../ui/button";

export function CuponActivoHome() {
  const navigate = useNavigate();

  const {
    data: listaCampañas = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["campanasPromos"],
    queryFn: GetCampañaPromos,
    refetchOnWindowFocus: false,
  });

  const formatearFecha = (fechaString) => {
    if (!fechaString) return "Sin fecha";
    return new Date(fechaString).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (isLoading || isError) {
    return (
      <div className="fw-promo-card card-cupon items-center justify-center text-center">
        {isLoading ? (
          <div
            className="mb-2 size-8 animate-spin rounded-full border-4 border-muted border-t-primary"
            role="status"
          ></div>
        ) : (
          <AlertCircle size={32} className="mb-2 text-destructive" />
        )}
        <span className="fw-promo-text">
          {isLoading ? "Cargando..." : "Error de conexión"}
        </span>
      </div>
    );
  }

  const campanaActiva = listaCampañas.length > 0 ? listaCampañas[0] : null;

  if (!campanaActiva) {
    return (
      // Nota la clase extra "card-cupon"
      <div className="fw-promo-card card-cupon items-center justify-center text-center">
        <Tag size={40} className="mb-3 text-muted-foreground opacity-50" />
        <h2 className="fw-promo-title mb-2">Sin Campañas</h2>
        <p className="fw-promo-text mb-4">
          Crea una promoción para premiar a tus clientes.
        </p>
        <Button
          onClick={() => navigate("/clientes/fidelizacion")}
          className="fw-btn-action fw-btn-emerald mt-auto w-full"
         variant="default">
          + Nueva Campaña
        </Button>
      </div>
    );
  }

  return (
    // Nota la clase extra "card-cupon"
    <div className="fw-promo-card card-cupon">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="fw-badge fw-badge-emerald">
          <Tag size={14} /> Campaña Activa
        </span>
        <span className="text-xs text-muted-foreground">
          {listaCampañas.length} disponibles
        </span>
      </div>

      <h2 className="fw-promo-title">
        {campanaActiva.nombre || "Promoción Especial"}
      </h2>
      <p className="fw-promo-text mb-3">
        {campanaActiva.descuento
          ? `${campanaActiva.descuento}% de descuento aplicado`
          : "Beneficio especial activo"}
      </p>

      <div className="mb-3 flex items-center justify-between gap-2 rounded-lg bg-muted p-2">
        <span className="text-xs font-bold text-muted-foreground">Cupón:</span>
        <span className="fw-promo-code">
          {campanaActiva.codigo_cupon || "CUPON"}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3">
        <div>
          <span className="block text-xs text-muted-foreground">Vence el:</span>
          <span className="font-bold text-foreground">
            {formatearFecha(campanaActiva.fecha_fin)}
          </span>
        </div>
        <div className="text-right">
          <span
            className="flex items-center gap-1 font-bold"
            style={{ color: "var(--fw-emerald, #10b981)", fontSize: "0.9rem" }}
          >
            <Circle size={10} fill="currentColor" /> Activo
          </span>
        </div>
      </div>
    </div>
  );
}
