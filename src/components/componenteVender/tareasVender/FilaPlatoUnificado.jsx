import { useState, useEffect } from "react";
import { Minus, Plus, Repeat, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";

export const FilaPlatoUnificado = ({
  item,
  tipo,
  onDelete,
  onUpdateQuantity,
  loadingUpdate,
  loadingDelete,
  isSplitMode,
  reduxItem,
  onToggleSelect,
  onChangeSplitQty,
}) => {
  const nombrePlato = item.plato?.nombre || item.nombre;
  const precioUnitario = item.plato?.precio || item.precio;

  // ESTADO LOCAL (UI Instantánea)
  const [cantidadLocal, setCantidadLocal] = useState(item.cantidad);

  // Sincronizar el estado local si la BD cambia
  useEffect(() => {
    setCantidadLocal(item.cantidad);
  }, [item.cantidad]);

  // EFECTO DEBOUNCE (Frena las peticiones)
  useEffect(() => {
    if (cantidadLocal !== item.cantidad) {
      const timer = setTimeout(() => {
        if (onUpdateQuantity) {
          const idReferencia = tipo === "nuevo" ? item.id : item.idPlato;
          onUpdateQuantity(idReferencia, cantidadLocal, tipo); // Envía la cantidad final
        }
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [
    cantidadLocal,
    item.cantidad,
    item.id,
    item.idPlato,
    tipo,
    onUpdateQuantity,
  ]);

  // Manejador de clics
  const handleCambioLocal = (delta) => {
    setCantidadLocal((prev) => {
      const nuevaCantidad = prev + delta;
      return nuevaCantidad > 0 ? nuevaCantidad : 1;
    });
  };

  const precioTotal = cantidadLocal * precioUnitario;
  const isSelected = !!reduxItem;
  const cantidadSeleccionada = reduxItem ? reduxItem.cantidad : 0;
  const precioSeleccionado = reduxItem ? reduxItem.subtotal : 0;

  // 💡 NUEVO: Control centralizado para bloquear edición
  const isReadOnly = tipo === "entregado" || tipo === "cocinando";

  const opacityClass =
    isSplitMode && !isSelected ? "opacity-50" : "opacity-100";
  const stateClasses =
    tipo === "entregado"
      ? "border-emerald-500/20 bg-emerald-500/[0.04]"
      : tipo === "cocinando"
        ? "border-sky-500/20 bg-sky-500/[0.04]"
        : tipo === "nuevo"
          ? "border-amber-500/20 bg-amber-500/[0.05]"
          : "border-border/70 bg-card";

  const canSelect = tipo !== "nuevo";
  const idReferencia = tipo === "nuevo" ? item.id : item.idPlato;
  const isUpdating = loadingUpdate === idReferencia;

  return (
    <div
      className={`mb-2 flex min-w-0 items-center gap-2 rounded-xl border p-2.5 transition-colors ${stateClasses} ${opacityClass}`}
    >
      {isSplitMode && canSelect && (
        <div className="shrink-0">
          <input
            type="checkbox"
            className="size-4 rounded border-input accent-primary"
            checked={isSelected}
            onChange={() => onToggleSelect(item)}
            aria-label={`Seleccionar ${nombrePlato} para separar la cuenta`}
          />
        </div>
      )}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-sm font-semibold text-foreground">
            {nombrePlato}
          </span>
          <span className="text-xs text-muted-foreground">
            S/. {Number(precioUnitario).toFixed(2)}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-center">
        {!isSplitMode && (
          <>
            {!isReadOnly ? (
              <div className="flex h-8 items-center gap-0.5 rounded-lg border border-border/70 bg-background p-0.5">
                <Button
                  type="button"
                  size="icon-sm"
                  className="size-7 rounded-md text-muted-foreground"
                  onClick={() => handleCambioLocal(-1)}
                  disabled={isUpdating}
                  variant="ghost"
                  aria-label={`Quitar una unidad de ${nombrePlato}`}
                >
                  <Minus className="size-4" />
                </Button>
                <span className="min-w-7 text-center text-sm font-semibold tabular-nums text-foreground">
                  {cantidadLocal}
                </span>
                <Button
                  type="button"
                  size="icon-sm"
                  className="size-7 rounded-md text-muted-foreground"
                  onClick={() => handleCambioLocal(1)}
                  disabled={isUpdating}
                  variant="ghost"
                  aria-label={`Agregar una unidad de ${nombrePlato}`}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            ) : (
              <span
                className={`font-bold text-base ${tipo === "entregado" ? "text-emerald-700 dark:text-emerald-400" : "text-secondary-foreground"}`}
              >
                x{cantidadLocal}
              </span>
            )}
          </>
        )}
        {isSplitMode && canSelect && isSelected && (
          <div className="flex h-8 items-center gap-0.5 rounded-lg border border-primary/20 bg-primary/5 p-0.5">
            <Button
              type="button"
              size="icon-sm"
              className="size-7 rounded-md text-primary"
              onClick={(e) => {
                e.stopPropagation();
                onChangeSplitQty(item.id, -1, item.cantidad);
              }}
              variant="ghost"
              aria-label={`Quitar cantidad seleccionada de ${nombrePlato}`}
            >
              <Minus className="size-4" />
            </Button>
            <span className="min-w-16 text-center text-xs font-semibold tabular-nums text-primary">
              {cantidadSeleccionada} / {item.cantidad}
            </span>
            <Button
              type="button"
              size="icon-sm"
              className="size-7 rounded-md text-primary"
              onClick={(e) => {
                e.stopPropagation();
                onChangeSplitQty(item.id, 1, item.cantidad);
              }}
              variant="ghost"
              aria-label={`Agregar cantidad seleccionada de ${nombrePlato}`}
            >
              <Plus className="size-4" />
            </Button>
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-center justify-end gap-1.5">
        <span className="whitespace-nowrap text-sm font-semibold tabular-nums text-foreground">
          S/.{" "}
          {Number(
            isSplitMode && isSelected ? precioSeleccionado : precioTotal,
          ).toFixed(2)}
        </span>
        {!isSplitMode && !isReadOnly && (
          <Button
            type="button"
            size="icon-sm"
            className="size-7 rounded-md text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 dark:text-rose-400"
            onClick={() => onDelete(item.id)}
            disabled={loadingDelete === item.id}
            variant="ghost"
            aria-label={`Eliminar ${nombrePlato}`}
          >
            {loadingDelete === item.id ? (
              <Repeat className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
