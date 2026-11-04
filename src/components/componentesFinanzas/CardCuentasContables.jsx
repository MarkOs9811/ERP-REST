import { ChartNoAxesCombined, Lock } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function CardCuentaContable({ nombreCuenta, items }) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const cuenta = items[0]?.cuenta || {};
  const grupoCuenta = cuenta.grupoCuenta || {};
  const cuentaCerrada = cuenta.estado === 0;

  return (
    <div className="col-span-full md:col-span-3 rounded h-full">
      <Card
        className={`card-cuentasContables relative ${
          cuentaCerrada ? "cuenta-cerrada" : ""
        }`}
      >
        <div className={cuentaCerrada ? "cuenta-bloqueada-contenido" : ""}>
          <CardHeader className="flex justify-between items-center rounded-none card-cuenta-libro">
            <div
              className="flex items-center"
              style={{
                fontSize: 12,
                borderLeft: "2px solid var(--fw-emerald)",
              }}
            >
              <span className="fw-libro-subtitle font-bold mx-2">
                {grupoCuenta.codigo}
              </span>
              <small className="fw-libro-subtitle font-bold me-2">Grupo</small>
            </div>
            <div className="text-center grow">
              <CardDescription asChild>
                <p className="fw-flow-description mb-0">{cuenta.codigo}</p>
              </CardDescription>
              <h6 className="mb-0">{nombreCuenta}</h6>
            </div>
            <div style={{ width: 30 }}></div>
          </CardHeader>
          <CardContent className="registrosCuenta-Cuerpo">
            <div className="grid grid-cols-12 gap-3">
              <div
                className="col-span-full md:col-span-6"
                style={{ borderRight: "2px solid var(--text-main)" }}
              >
                <h6>DEBE</h6>
                {items.map((item, idx) => (
                  <div className="mb-2" key={idx}>
                    <span title={`${item.descripcion} - ${item.fecha}`}>
                      S/ {Number(item.debe).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="col-span-full md:col-span-6 text-right">
                <h6>HABER</h6>
                {items.map((item, idx) => (
                  <div className="mb-2" key={idx}>
                    <span title={`${item.descripcion} - ${item.fecha}`}>
                      S/ {Number(item.haber).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-muted-foreground">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-full md:col-span-6">
                <strong>Total:</strong> S/{" "}
                {items.reduce((acc, i) => acc + Number(i.debe), 0).toFixed(2)}
              </div>
              <div className="col-span-full md:col-span-6 text-right">
                <strong>Total:</strong> S/{" "}
                {items.reduce((acc, i) => acc + Number(i.haber), 0).toFixed(2)}
              </div>
            </div>
          </CardFooter>
        </div>
        {/* Overlay para cuenta cerrada */}
        {cuentaCerrada ? (
          <div className="cuenta-cerrada-overlay">
            <div className="text-center cuenta-cerrada-mensaje">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 48, color: "var(--text-main)" }}
              >
                lock
              </span>
              <h2 style={{ color: "var(--text-main)" }}>Cuenta Cerrada</h2>
              <Button
                type="button"
                className="bg-primary text-primary-foreground shadow hover:bg-primary/90 btn-aperturarCuenta inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 text-xs"
                title="Aperturar Cuenta"
                variant="default"
              >
                <span className="material-symbols-outlined">open_in_new</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-4gap-2">
            <div className="col-span-full md:col-span-12 text-center">
              <Button
                type="button"
                className="btn-eliminar inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 text-xs m-2"
                title="Cerrar Cuenta"
                variant="destructive"
              >
                <Lock />
              </Button>
              <Button
                type="button"
                className="btn-principal inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 text-xs m-2"
                title="Reporte"
                variant="default"
              >
                <ChartNoAxesCombined />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
