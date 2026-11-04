import {
  TrendingUp,
  Users,
  Ticket,
  CircleDollarSign,
  CalendarDays,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { formatearFecha } from "../../utils/formatearFechas";


export function EstadisticasCampana({ campana }) {
  if (!campana) return null;

  const usados = campana.usados || 0;
  const limite = campana.limite_uso;
  const disponibles = limite ? limite - usados : "∞";
  const porcentajeUso =
    limite && limite > 0 ? ((usados / limite) * 100).toFixed(0) : 0;
  const isAgotado = limite && disponibles <= 0;

  return (
    <div className="estadisticas-container p-4">
      {/* Header con nombre y estado */}
      <div className="mb-4 pb-3 border-b">
        <h4 className="font-bold text-foreground mb-1">{campana.nombre}</h4>
        <p className="text-muted-foreground text-sm mb-0">
          {campana.tipo === "cupon"
            ? "Campaña de Cupón"
            : "Programa de Beneficios"}
        </p>
      </div>

      {/* Sección 1: Detalles del Cupón */}
      <div className="mb-4">
        <h6 className="font-bold text-muted-foreground mb-3">
          Información del Cupón
        </h6>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-full md:col-span-6">
            <div className="info-card bg-muted rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <Ticket size={16} className="text-muted-foreground" />
                <span className="text-muted-foreground text-sm font-bold">
                  CÓDIGO
                </span>
              </div>
              <p className="font-bold mb-0 uppercase">{campana.codigo_cupon}</p>
            </div>
          </div>
          <div className="col-span-full md:col-span-6">
            <div className="info-card bg-muted rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <CircleDollarSign size={16} className="text-muted-foreground" />
                <span className="text-muted-foreground text-sm font-bold">
                  DESCUENTO
                </span>
              </div>
              <p className="font-bold text-foreground mb-0">
                {campana.tipo_descuento === "porcentaje"
                  ? `-${campana.valor_descuento}%`
                  : `- S/ ${campana.valor_descuento}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección 2: Condiciones */}
      <div className="mb-4">
        <h6 className="font-bold text-muted-foreground mb-3">Condiciones</h6>
        <div className="grid grid-cols-12 gap-3">
          {campana.monto_minimo_compra > 0 && (
            <div className="col-span-full md:col-span-6">
              <div className="info-card bg-muted rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <CircleDollarSign
                    size={16}
                    className="text-muted-foreground"
                  />
                  <span className="text-muted-foreground text-sm font-bold">
                    COMPRA MÍNIMA
                  </span>
                </div>
                <p className="font-bold text-foreground mb-0">
                  S/ {campana.monto_minimo_compra}
                </p>
              </div>
            </div>
          )}
          <div className="col-span-full md:col-span-6">
            <div className="info-card bg-muted rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <CalendarDays size={16} className="text-muted-foreground" />
                <span className="text-muted-foreground text-sm font-bold">
                  VIGENCIA
                </span>
              </div>
              <p className="text-foreground mb-0 text-sm">
                <strong>{formatearFecha(campana.fecha_inicio)}</strong> al{" "}
                <strong>{formatearFecha(campana.fecha_fin)}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección 3: Estadísticas de Uso */}
      <div className="mb-4">
        <h6 className="font-bold text-muted-foreground mb-3">
          Estadísticas de Uso
        </h6>

        {/* Barras de Estadísticas */}
        <div className="grid grid-cols-12 gap-3 mb-4">
          <div className="col-span-full md:col-span-6">
            <div className="stat-card bg-muted rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle
                    size={16}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                  <span className="text-muted-foreground text-sm font-bold">
                    USOS REALIZADOS
                  </span>
                </div>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors bg-emerald-600">
                  {usados}
                </span>
              </div>
              <div className="progress" style={{ height: "8px" }}>
                <div
                  className="progress-bar bg-emerald-600"
                  role="progressbar"
                  style={{ width: `${limite ? (usados / limite) * 100 : 0}%` }}
                  aria-valuenow={usados}
                  aria-valuemin="0"
                  aria-valuemax={limite || 100}
                ></div>
              </div>
            </div>
          </div>

          <div className="col-span-full md:col-span-6">
            <div
              className={`stat-card rounded p-3 ${isAgotado ? "bg-danger-subtle" : "bg-muted"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp
                    size={16}
                    className={
                      isAgotado
                        ? "text-destructive"
                        : "text-sky-600 dark:text-sky-400"
                    }
                  />
                  <span
                    className={`text-muted-foreground text-sm font-bold ${isAgotado ? "text-destructive" : ""}`}
                  >
                    DISPONIBLES
                  </span>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${isAgotado ? "bg-destructive" : "bg-blue-500"}`}
                >
                  {disponibles}
                </span>
              </div>
              <div className="progress" style={{ height: "8px" }}>
                <div
                  className={`progress-bar ${isAgotado ? "bg-destructive" : "bg-blue-500"}`}
                  role="progressbar"
                  style={{
                    width: `${limite ? ((limite - usados) / limite) * 100 : 100}%`,
                  }}
                  aria-valuenow={disponibles}
                  aria-valuemin="0"
                  aria-valuemax={limite || 100}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Indicador de Porcentaje */}
        {limite && (
          <div className="relative w-full rounded-lg px-4 py-3 text-sm border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400 mb-0 flex items-center gap-2">
            <AlertCircle size={18} />
            <span>
              Se ha utilizado el <strong>{porcentajeUso}%</strong> del límite
              total (<strong>{usados}</strong> de <strong>{limite}</strong>{" "}
              usos)
            </span>
          </div>
        )}
      </div>

      {/* Sección 4: Estado de la Campaña */}
      <div className="mb-0">
        <h6 className="font-bold text-muted-foreground mb-3">Estado</h6>
        <div className="info-card bg-muted rounded p-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm font-bold">
              ESTADO ACTUAL
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${campana.estado ? "bg-emerald-600" : "bg-amber-500"}`}
            >
              {campana.estado ? "ACTIVA" : "INACTIVA"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
