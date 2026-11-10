import { ChevronLeft, ClipboardList, PackageCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function DetallePedido({
  preVentas = [],
  estadoTipoVenta,
  totalPreventa,
  mesa,
  igv,
}) {
  const navigate = useNavigate();

  const subTotal = (Number(totalPreventa) - Number(igv)).toFixed(2);
  const cantidadTotal = preVentas.reduce(
    (total, item) => total + Number(item.cantidad || 0),
    0,
  );
  const nombreCuenta =
    estadoTipoVenta === "llevar"
      ? "Para llevar"
      : mesa
        ? `Mesa ${mesa}`
        : "Pedido web";

  const volver = () => {
    if (estadoTipoVenta === "llevar") {
      navigate("/vender/ventasLlevar");
    } else if (estadoTipoVenta === "web") {
      navigate("/vender/pedidosWeb");
    } else {
      navigate(-1);
    }
  };

  return (
    <Card className="flex h-full min-h-[440px] flex-col gap-0 overflow-hidden rounded-xl border-border/70 bg-card p-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-border/70  px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
            <ClipboardList className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="mb-0 text-xs font-medium text-muted-foreground">
              Resumen de cuenta
            </p>
            <h2 className="mb-0 truncate text-base font-semibold tracking-tight text-foreground">
              {nombreCuenta}
            </h2>
          </div>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 shrink-0 gap-1 rounded-lg border-border/70"
          onClick={volver}
        >
          <ChevronLeft className="size-4" />
          Volver
        </Button>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 overflow-y-auto p-3">
        {preVentas.length > 0 ? (
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {preVentas.map((item, index) => {
              const precio = Number(item.plato?.precio || item.precio || 0);
              const cantidad = Number(item.cantidad || 0);
              return (
                <li
                  key={`${item.id}-${index}`}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border/60  px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="mb-1 line-clamp-2 text-sm font-medium text-foreground">
                      {item.plato?.nombre || item.nombre}
                    </p>
                    <p className="mb-0 text-xs text-muted-foreground">
                      {cantidad} × S/. {precio.toFixed(2)}
                    </p>
                  </div>
                  <span className="shrink-0 pt-0.5 text-sm font-semibold tabular-nums text-foreground">
                    S/. {(cantidad * precio).toFixed(2)}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex h-full min-h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/70 bg-muted/20 px-4 text-center">
            <PackageCheck className="size-6 text-muted-foreground/60" />
            <p className="mb-0 text-sm text-muted-foreground">
              No hay productos en esta cuenta.
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="mt-auto flex-col items-stretch gap-3 border-t border-border/70  p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium tabular-nums">S/. {subTotal}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">IGV</span>
            <span className="tabular-nums text-muted-foreground">
              S/. {igv}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border/60 pt-2">
            <span className="font-semibold text-foreground">Total</span>
            <span className="text-lg font-semibold tabular-nums text-emerald-700 dark:text-emerald-300">
              S/. {totalPreventa}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-border/60 bg-muted/40 p-2.5">
            <p className="mb-1 text-xs text-muted-foreground">Productos</p>
            <p className="mb-0 text-base font-semibold tabular-nums">
              {preVentas.length}
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/40 p-2.5">
            <p className="mb-1 text-xs text-muted-foreground">Unidades</p>
            <p className="mb-0 text-base font-semibold tabular-nums">
              {cantidadTotal}
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
