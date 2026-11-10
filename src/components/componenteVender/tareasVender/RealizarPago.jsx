import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import BotonAnimado from "../../componentesReutilizables/BotonAnimado";
// 🔥 Agregamos CheckCircle a los iconos de Lucide
import {
  Search,
  Printer,
  StickyNote,
  Loader2,
  CheckCircle,
} from "lucide-react";
import ToastAlert from "../../componenteToast/ToastAlert";
import { ConsultarDocumento } from "../../../service/accionesVender/ConsultaDocumentos";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function RealizarPago({
  totalPreventa,
  igv,
  handleCrearJson,
  loading,
  error,
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setFocus,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: {
      nombreReferencia: "",
      pagoCon: 0,
      imprimirTicket: true,
      notas: "",
    },
  });

  const [isSearching, setIsSearching] = useState(false);
  const [tipoDocBusqueda, setTipoDocBusqueda] = useState("DNI");
  const [numDocBusqueda, setNumDocBusqueda] = useState("");
  const [errorBusqueda, setErrorBusqueda] = useState(null);
  const [busquedaExitosa, setBusquedaExitosa] = useState(false);

  const pagoCon = watch("pagoCon");
  const vuelto =
    pagoCon - totalPreventa > 0 ? (pagoCon - totalPreventa).toFixed(2) : "0.00";

  const onSubmit = (data) => {
    handleCrearJson(data);
  };

  const subTotal = (totalPreventa - igv).toFixed(2);

  const generarBilletesSugeridos = (total) => {
    const t = Number(total) || 0;
    let sugerencias = [t];

    const redondeo10 = Math.ceil(t / 10) * 10;
    if (redondeo10 > t) sugerencias.push(redondeo10);

    if (t < 20 && !sugerencias.includes(20)) sugerencias.push(20);
    if (t < 50 && !sugerencias.includes(50)) sugerencias.push(50);
    if (t < 100 && !sugerencias.includes(100)) sugerencias.push(100);
    if (t >= 100) sugerencias.push(Math.ceil(t / 100) * 100);

    return [...new Set(sugerencias)].sort((a, b) => a - b).slice(0, 4);
  };

  const billetes = generarBilletesSugeridos(totalPreventa);

  // 🔥 LÓGICA DE BÚSQUEDA
  const ejecutarBusqueda = async (documento) => {
    setErrorBusqueda(null);
    setBusquedaExitosa(false);
    clearErrors("nombreReferencia");

    setIsSearching(true);
    const resultado = await ConsultarDocumento(documento, tipoDocBusqueda);

    if (resultado.success) {
      setValue("nombreReferencia", resultado.nombre, { shouldValidate: true });
      setBusquedaExitosa(true);

      setTimeout(() => setFocus("nombreReferencia"), 50);

      ToastAlert("success", "Cliente encontrado");
    } else {
      setErrorBusqueda(resultado.message);
      ToastAlert("warning", "No encontrado. Ingrese el nombre manualmente.");
      setFocus("nombreReferencia");
    }
    setIsSearching(false);
  };

  // 🔥 Búsqueda automática
  useEffect(() => {
    const docLength = numDocBusqueda.length;
    if (tipoDocBusqueda === "DNI" && docLength === 8) {
      ejecutarBusqueda(numDocBusqueda);
    } else if (tipoDocBusqueda === "RUC" && docLength === 11) {
      ejecutarBusqueda(numDocBusqueda);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numDocBusqueda, tipoDocBusqueda]);

  // 🔥 NUEVO: Manejador global del Enter para procesar el pago desde cualquier input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Evitamos que haga un submit nativo descontrolado
      if (!loading) {
        handleSubmit(onSubmit)(); // Disparamos la validación de RHF y el envío
      }
    }
  };

  return (
    <Card className="flex h-full min-h-[440px] flex-col gap-0 overflow-hidden rounded-xl border-border/70 bg-card p-0 shadow-none">
      <CardHeader className="border-b border-border/70  px-4 py-4">
        <h2 className="mb-0 text-base font-semibold tracking-tight text-foreground">
          Cobro y resumen
        </h2>
        <p className="mb-0 text-xs text-muted-foreground">
          Confirma los datos del cliente y el monto recibido.
        </p>
      </CardHeader>

      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={handleKeyDown} // 🔥 Escuchamos el Enter en todo el formulario
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <CardContent className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
          {/* ========================================== */}
          {/* 1. SECCIÓN DE BÚSQUEDA AUTOMÁTICA COMPACTA */}
          {/* ========================================== */}
          <section className="space-y-2 rounded-lg border border-border/70 bg-muted/30 p-3">
            <label className="text-sm text-muted-foreground font-bold mb-1">
              Buscar en SUNAT/RENIEC (Opcional)
            </label>
            <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-2">
              <select
                className="h-10 rounded-md border border-input  px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={tipoDocBusqueda}
                onChange={(e) => {
                  setTipoDocBusqueda(e.target.value);
                  setNumDocBusqueda("");
                  setErrorBusqueda(null);
                  setBusquedaExitosa(false);
                }}
              >
                <option value="DNI">DNI</option>
                <option value="RUC">RUC</option>
              </select>

              {/* Input con icono flotante */}
              <div className="relative min-w-0">
                <input
                  type="text"
                  className={`h-10 w-full rounded-md border border-input  px-3 pr-9 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                    errorBusqueda
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                  placeholder={`Nº de ${tipoDocBusqueda}...`}
                  value={numDocBusqueda}
                  maxLength={tipoDocBusqueda === "DNI" ? 8 : 11}
                  onChange={(e) => {
                    const soloNumeros = e.target.value.replace(/\D/g, "");
                    setNumDocBusqueda(soloNumeros);
                    setErrorBusqueda(null);
                    setBusquedaExitosa(false);
                  }}
                />
                <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center">
                  {isSearching ? (
                    <Loader2 size={16} className="text-primary" />
                  ) : (
                    <Search size={16} className="text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
            {errorBusqueda && (
              <small className="block text-xs text-destructive">
                {errorBusqueda}
              </small>
            )}
          </section>

          {/* ========================================== */}
          {/* 2. CAMPO DE SALIDA FINAL */}
          {/* ========================================== */}
          <div className="space-y-1.5">
            <label
              htmlFor="nombreReferencia"
              className="text-sm font-medium text-foreground"
            >
              Nombre / Razón Social <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                id="nombreReferencia"
                type="text"
                className={`h-10 w-full rounded-md border border-input  px-3 pr-9 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                  errors.nombreReferencia
                    ? "border-destructive focus-visible:ring-destructive"
                    : busquedaExitosa
                      ? "border-emerald-600 text-emerald-700 dark:text-emerald-400" // 🔥 Solo cambiamos borde y texto sin usar is-valid
                      : ""
                }`}
                placeholder="Nombre completo..."
                {...register("nombreReferencia", {
                  required: "Requerido",
                  onChange: () => setBusquedaExitosa(false), // Quitamos el éxito si lo edita manual
                })}
              />
              {/* 🔥 Icono flotante CheckCircle nativo de Lucide */}
              {busquedaExitosa && !errors.nombreReferencia && (
                <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center">
                  <CheckCircle
                    size={16}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                </div>
              )}
              {errors.nombreReferencia && (
                <div className="block text-xs text-destructive">
                  {errors.nombreReferencia.message}
                </div>
              )}
            </div>
          </div>

          {/* ========================================== */}
          {/* 3. PAGOS Y VUELTO */}
          {/* ========================================== */}
          <div className="space-y-2">
            <label
              htmlFor="pagoCon"
              className="text-sm font-medium text-foreground"
            >
              Pagar con: S/.
            </label>
            <input
              id="pagoCon"
              type="number"
              step="0.1"
              className="h-11 w-full rounded-md border border-input  px-3 text-lg font-semibold tabular-nums transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="0.00"
              {...register("pagoCon")}
            />

            <div className="flex flex-wrap gap-2">
              {billetes.map((monto, index) => (
                <Button
                  key={index}
                  type="button"
                  className="h-8 rounded-full border border-border/70 bg-muted/50 px-3 text-xs font-medium text-foreground hover:bg-muted"
                  onClick={() => setValue("pagoCon", monto)}
                  variant="outline"
                >
                  {index === 0 ? "EXACTO" : `S/ ${monto.toFixed(2)}`}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="vuelto"
              className="text-sm font-medium text-foreground"
            >
              Cambio S/.
            </label>
            <input
              id="vuelto"
              type="text"
              className="h-10 w-full rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 text-base font-semibold tabular-nums text-emerald-700 focus-visible:outline-none dark:text-emerald-300"
              readOnly
              value={vuelto}
            />
          </div>

          {/* ========================================== */}
          {/* 4. IMPRESIÓN Y NOTAS */}
          {/* ========================================== */}
          <section className="space-y-3 rounded-lg border border-border/70 bg-muted/30 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Imprimir comprobante
                </span>
              </div>
              <label
                className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground"
                htmlFor="imprimirTicket"
              >
                Activar
                <input
                  className="size-4 cursor-pointer rounded border-input accent-primary"
                  type="checkbox"
                  role="switch"
                  id="imprimirTicket"
                  {...register("imprimirTicket")}
                />
              </label>
            </div>

            <div className="flex gap-2">
              <StickyNote
                size={16}
                className="mt-2 size-4 shrink-0 text-muted-foreground"
              />
              <textarea
                className="min-h-16 w-full resize-y rounded-md border border-input  px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                rows="2"
                placeholder="Observaciones..."
                {...register("notas")}
              ></textarea>
            </div>
          </section>
        </CardContent>

        {/* ========================================== */}
        {/* TOTALES Y BOTÓN (Fijos al fondo) */}
        {/* ========================================== */}
        <div className="mt-auto border-t border-border/70  p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground text-sm">Sub Total</span>
              <span className="font-medium text-foreground text-sm">
                S/. {subTotal}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground text-sm">IGV</span>
              <span className="text-muted-foreground text-sm">S/. {igv}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border/60 pt-2">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-lg font-semibold tabular-nums text-emerald-700 dark:text-emerald-300">
                S/. {totalPreventa}
              </span>
            </div>
          </div>

          <div className="mt-3">
            <BotonAnimado
              type="submit"
              loading={loading}
              error={error}
              className="h-11 w-full rounded-lg text-sm font-semibold"
            >
              Realizar Pago
            </BotonAnimado>
          </div>
        </div>
      </form>
    </Card>
  );
}
