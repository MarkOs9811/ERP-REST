import {
  Minus,
  Package,
  Plus,
  ShoppingCart,
  AlertCircle,
  Beaker,
  Pill,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export const CardPlatos = ({
  item,
  isSelected,
  handleAdd,
  handleRemove,
  capitalizeFirstLetter,
  esComida = false,
  cantidadEnCarrito = 1,
}) => {
  const nombre = capitalizeFirstLetter(item.nombre || "Producto sin nombre");
  const precio = Number(item.precio || 0).toFixed(2);
  const sinStock = !esComida && Number(item.stock) <= 0;
  const stockBajo = !esComida && Number(item.stock) <= 5;

  // Datos específicos de farmacia (asegúrate de que tu backend los envíe)
  const laboratorio = item.laboratorio
    ? capitalizeFirstLetter(item.laboratorio)
    : null;
  const presentacion = item.presentacion
    ? capitalizeFirstLetter(item.presentacion)
    : "Unidad";

  // Lógica para fecha de vencimiento (Opcional, asumiendo formato YYYY-MM-DD)
  let vencimientoAlerta = false;
  let vencido = false;
  if (item.fecha_vencimiento) {
    const fechaVencimiento = new Date(item.fecha_vencimiento);
    const hoy = new Date();
    const diasRestantes = Math.ceil(
      (fechaVencimiento - hoy) / (1000 * 60 * 60 * 24),
    );

    if (diasRestantes <= 0) vencido = true;
    else if (diasRestantes <= 90) vencimientoAlerta = true; // Alerta si vence en menos de 3 meses
  }

  return (
    <Card
      className={`group flex h-full min-w-0 flex-col gap-0 overflow-hidden rounded-xl border bg-card p-0 shadow-sm transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-primary/60 ring-1 ring-primary/20"
          : "border-border hover:border-primary/30"
      }`}
    >
      {/* Contenedor de Imagen y Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-white p-3 border-b border-border/40 flex items-center justify-center">
        <img
          src={item.foto_url || "/images/img-default.jpg"}
          alt={nombre}
          loading="lazy"
          className={`size-full object-contain transition-transform duration-300 group-hover:scale-105 ${sinStock ? "opacity-50 grayscale" : ""}`}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = "/images/img-default.jpg";
          }}
        />

        {/* Badges de Categoría o Stock */}
        <div className="absolute left-2 top-2 flex flex-col gap-1.5">
          {esComida ? (
            <Badge
              variant="secondary"
              className="max-w-full truncate border border-border/70 bg-background/95 text-foreground shadow-sm backdrop-blur text-xs"
            >
              {capitalizeFirstLetter(item.categoria?.nombre || "Sin categoría")}
            </Badge>
          ) : (
            <Badge
              variant={stockBajo ? "outline" : "secondary"}
              className={`gap-1.5 border shadow-sm backdrop-blur font-medium text-[11px] px-2 py-0.5 ${
                stockBajo
                  ? "border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400"
              }`}
            >
              <Package className="size-3" />
              {sinStock ? "Agotado" : `${item.stock ?? 0} disp.`}
            </Badge>
          )}

          {/* Badge de Vencimiento para Farmacia */}
          {!esComida &&
            item.fecha_vencimiento &&
            (vencido || vencimientoAlerta) && (
              <Badge
                variant="outline"
                className={`gap-1 text-[10px] px-1.5 py-0 border ${
                  vencido
                    ? "border-red-300 bg-red-100 text-red-700"
                    : "border-orange-300 bg-orange-100 text-orange-700"
                }`}
              >
                <AlertCircle className="size-3" />
                {vencido ? "Vencido" : "Próx. Vencer"}
              </Badge>
            )}
        </div>

        {/* Badge de Cantidad en Carrito */}
        {isSelected && (
          <Badge className="absolute right-2 top-2 bg-primary text-primary-foreground text-sm font-bold size-7 flex items-center justify-center p-0 rounded-full shadow-md">
            {cantidadEnCarrito}
          </Badge>
        )}
      </div>

      {/* Contenido (Textos e Info) */}
      <CardContent className="flex flex-1 flex-col gap-1.5 p-3 pb-2">
        {/* Marca / Laboratorio (Solo Farmacia) */}
        {!esComida && laboratorio && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium uppercase tracking-wide">
            <Beaker className="size-3" />
            <span className="truncate">{laboratorio}</span>
          </div>
        )}

        {/* Nombre del Producto */}
        <h3
          className="mb-0 line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-5 text-foreground"
          title={nombre}
        >
          {nombre}
        </h3>

        {/* Datos Técnicos Farmacia (Presentación, Lote) */}
        {!esComida && (
          <div className="flex flex-col gap-0.5 mt-0.5 mb-1 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <Pill className="size-3" />
              <span className="truncate">{presentacion}</span>
            </div>
            {item.lote && (
              <span className="text-[10px] opacity-75">
                Lote: {item.lote}{" "}
                {item.registro_sanitario && `| Reg: ${item.registro_sanitario}`}
              </span>
            )}
          </div>
        )}

        {/* Precio */}
        <div className="mt-auto flex items-end justify-between pt-1">
          <span className="text-xs text-muted-foreground mb-0.5">Precio</span>
          <span className="text-lg font-bold tracking-tight text-primary">
            S/. {precio}
          </span>
        </div>
      </CardContent>

      {/* Footer (Botones de Acción) */}
      <CardFooter className="mt-auto border-t border-border/60 bg-muted/20 p-2">
        {isSelected ? (
          <div className="flex h-full w-full items-center justify-between rounded-lg border border-border/80 bg-background px-2 shadow-sm">
            <Button
              type="button"
              className="size-7 p-5 bg-gray-200 border-gray-800  rounded-md text-gray-900 hover:bg-gray-600 hover:text-white  transition-colors"
              onClick={() => handleRemove(item.id)}
              aria-label={`Quitar unidad`}
            >
              <Minus className="size-4" />
            </Button>
            <span className="min-w-8 p-5 text-center text-lg font-bold tabular-nums text-foreground">
              {cantidadEnCarrito}
            </span>
            <Button
              type="button"
              className="size-7 p-5 bg-green-300 border-green-800 rounded-md text-green-900 hover:bg-green-600 hover:text-green-950 transition-colors"
              onClick={() => handleAdd(item)}
              disabled={sinStock || cantidadEnCarrito >= item.stock}
              aria-label={`Agregar unidad`}
            >
              <Plus className="size-4" />
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            className="w-full gap-2 h-9 text-sm font-medium shadow-sm transition-all"
            variant={sinStock ? "secondary" : "default"}
            onClick={() => handleAdd(item)}
            disabled={sinStock}
          >
            {sinStock ? (
              <>
                <Package className="size-4 opacity-70" />
                <span>Agotado</span>
              </>
            ) : (
              <>
                <ShoppingCart className="size-4" strokeWidth={2} />
                <span>Agregar</span>
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
