import { Minus, Package, Plus, ShoppingCart } from "lucide-react";
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
  const nombre = capitalizeFirstLetter(item.nombre);
  const precio = Number(item.precio || 0).toFixed(2);
  const sinStock = !esComida && Number(item.stock) <= 0;
  const stockBajo = !esComida && Number(item.stock) <= 5;

  return (
    <Card
      className={`group flex h-full min-w-0 flex-col gap-0 overflow-hidden rounded-xl border bg-card p-0 shadow-none transition-colors duration-200 ${
        isSelected
          ? "border-primary/50 ring-1 ring-primary/15"
          : "border-border/70 hover:border-foreground/25"
      }`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-muted/50 via-background to-muted/30 p-2">
        <img
          src={item.foto_url || "/images/img-default.jpg"}
          alt={nombre}
          loading="lazy"
          className="size-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = "/images/img-default.jpg";
          }}
        />
        {esComida ? (
          <Badge
            variant="secondary"
            className="absolute left-2 top-2 max-w-[calc(100%-1rem)] truncate border border-border/70 bg-background/90 text-foreground shadow-none backdrop-blur"
          >
            {capitalizeFirstLetter(item.categoria?.nombre || "Sin categoría")}
          </Badge>
        ) : (
          <Badge
            variant={stockBajo ? "outline" : "secondary"}
            className={`absolute left-2 top-2 gap-1 border shadow-sm backdrop-blur ${
              stockBajo
                ? "border-amber-200 bg-amber-50/95 text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/80 dark:text-amber-300"
                : "border-border/70 bg-background/90 text-foreground"
            }`}
          >
            <Package className="size-3" />
            {sinStock ? "Agotado" : `Stock ${item.stock ?? 0}`}
          </Badge>
        )}
        {isSelected && (
          <Badge className="absolute right-2 top-2">
            {cantidadEnCarrito}
          </Badge>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col gap-1 p-3 pb-2">
        <p className="mb-0 line-clamp-2 min-h-10 text-sm font-medium leading-5 text-foreground">
          {nombre}
        </p>
        <p className="mb-0 mt-auto text-base font-semibold tracking-tight text-foreground">
          S/. {precio}
        </p>
      </CardContent>

      <CardFooter className="mt-auto border-t border-border/60 bg-muted/15 p-2.5">
        {isSelected ? (
          <div className="flex h-9 w-full items-center justify-between rounded-lg border border-border/70 bg-background px-1">
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              className="size-7 rounded-md text-muted-foreground hover:text-foreground"
              onClick={() => handleRemove(item.id)}
              aria-label={`Quitar una unidad de ${nombre}`}
            >
              <Minus className="size-4" />
            </Button>
            <span className="min-w-8 text-center text-sm font-semibold tabular-nums">
              {cantidadEnCarrito}
            </span>
            <Button
              type="button"
              size="icon"
              variant="default"
              className="rounded-md"
              onClick={() => handleAdd(item)}
              disabled={sinStock}
              aria-label={`Agregar una unidad de ${nombre}`}
            >
              <Plus className="size-4" />
            </Button>
          </div>
        ) : (
          <div className="flex w-full items-center justify-between gap-2">
            <span className="truncate text-xs text-muted-foreground">
              {sinStock ? "Sin stock" : esComida ? "Agregar al pedido" : "Agregar"}
            </span>
            <Button
              type="button"
              size="icon"
              variant={sinStock ? "outline" : "default"}
              className="size-8 shrink-0 rounded-full"
              onClick={() => handleAdd(item)}
              disabled={sinStock}
              aria-label={`${sinStock ? "Agotado" : "Agregar"} ${nombre}`}
            >
              {sinStock ? (
                <Package className="size-4" />
              ) : (
                <ShoppingCart className="size-4" strokeWidth={1.8} />
              )}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
