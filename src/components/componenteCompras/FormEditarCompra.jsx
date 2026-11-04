import { CreditCard, File, FileDownIcon, ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { Card } from "@/components/ui/card";

export function FormEditarCompra({
  onSubmit,
  register,
  errors,
  data,
  watch,
  setValue,
}) {
  useEffect(() => {
    if (data) {
      setValue("proveedor", data?.proveedor?.nombre || "");
      setValue("usuario", data?.usuario?.email || "");
      setValue("numeroCompra", data?.numero_compra || "");
      setValue("totalPagado", data?.totalPagado || "");
      setValue("observaciones", data?.observaciones || "");
      setValue("tipoCompra", data?.tipoCompra || "");
      setValue("fechaCompra", data?.fecha_compra || "");
      setValue("creacion", data?.created_at || "");
      setValue("actualizacion", data?.updated_at || "");
    }
  }, [data, setValue]);

  return (
    <form className="p-4" onSubmit={onSubmit}>
      <div className="grid grid-cols-12 gap-3">
        {/* Tipo de Compra */}
        <div className="md:col-span-12 col-span-full">
          {watch("tipoCompra") === "credito" ? (
            <div className="flex items-center justify-between border-amber-500 rounded-md p-3 alert-warning-subtle shadow-sm">
              <div className="flex items-center gap-3">
                <CreditCard
                  size={28}
                  className="text-amber-600 dark:text-amber-400"
                />
                <div>
                  <h6 className="mb-0 font-bold text-amber-600 dark:text-amber-400">
                    Compra a Crédito
                  </h6>
                  <small className="text-muted-foreground">
                    Pago pendiente
                  </small>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between border-emerald-500 rounded-md p-3 alert-success-subtle shadow-sm">
              <div className="flex items-center gap-3">
                <ShoppingCart
                  size={28}
                  className="text-emerald-600 dark:text-emerald-400"
                />
                <div>
                  <h6 className="mb-0 font-bold text-emerald-600 dark:text-emerald-400">
                    Compra al Contado
                  </h6>
                  <small className="text-muted-foreground">
                    Pago realizado
                  </small>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Proveedor y Usuario */}
        <div className="col-span-full md:col-span-6">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-bold">
            Proveedor
          </label>
          <input
            type="text"
            className="h-9 w-full rounded-md border-input px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-muted"
            {...register("proveedor")}
            readOnly
          />
        </div>
        <div className="col-span-full md:col-span-6">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-bold">
            Usuario
          </label>
          <input
            type="text"
            className="h-9 w-full rounded-md border-input px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-muted"
            {...register("usuario")}
            readOnly
          />
        </div>

        {/* N° Compra */}
        <div className="col-span-full md:col-span-6">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-bold">
            N° Compra
          </label>
          <input
            type="text"
            className="h-9 w-full rounded-md border-input px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-muted"
            {...register("numeroCompra")}
            readOnly
          />
        </div>

        {/* Total Pagado */}
        <div className="col-span-full md:col-span-6">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-bold">
            Total Pagado
          </label>
          <input
            type="number"
            className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-bold text-emerald-600 dark:text-emerald-400"
            {...register("totalPagado")}
            readOnly
          />
        </div>

        {/* Observaciones */}
        <div className="col-span-full">
          <label
            htmlFor="observaciones"
            className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-bold"
          >
            Observaciones
          </label>
          <textarea
            className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            id="observaciones"
            rows="3"
            {...register("observaciones")}
          />
        </div>
        <div className="col-span-full">
          <Card className="border p-0">
            <Button
              className="border-0 bg-transparent p-3 m-0 flex items-center gap-2"
              variant="default"
            >
              <span className="text-muted-foreground text-sm italic">
                <FileDownIcon size={18} className="text-auto" /> Ver el
                documento de la compra para más detalles.
              </span>
            </Button>
          </Card>
        </div>
        <hr></hr>
        {/* Fechas */}
        <div className="col-span-full md:col-span-4">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-bold">
            Fecha de Compra
          </label>
          <input
            type="text"
            className="h-9 w-full rounded-md border-input px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-muted"
            {...register("fechaCompra")}
            readOnly
          />
        </div>
        <div className="col-span-full md:col-span-4">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-bold">
            Creación
          </label>
          <input
            type="text"
            className="h-9 w-full rounded-md border-input px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-muted"
            {...register("creacion")}
            readOnly
          />
        </div>
        <div className="col-span-full md:col-span-4">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-bold">
            Última actualización
          </label>
          <input
            type="text"
            className="h-9 w-full rounded-md border-input px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-muted"
            {...register("actualizacion")}
            readOnly
          />
        </div>
      </div>
    </form>
  );
}
