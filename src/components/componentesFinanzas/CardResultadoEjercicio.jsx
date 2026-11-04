import {
  AlertTriangle,
  ArrowDown,
  ArrowRightLeft,
  ArrowUp,
  Calendar,
  History,
  Info,
  Meh,
  Frown,
  Scale,
  Smile,
  PiggyBank, // Reemplazo para "savings"
  Wallet, // Reemplazo para "account_balance_wallet"
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


export function CardResultadoEjercicio({ registroEjercicio, resultado }) {
  if (!registroEjercicio) {
    return (
      <div className="fw-libro-info-box text-center flex justify-center items-center gap-2">
        <AlertTriangle size={20} />
        No se encontró ningún registro de resultados del ejercicio.
      </div>
    );
  }

  // Helper para decidir qué ícono de cara mostrar
  const getResultIcon = (res) => {
    if (res > 0) return <Smile className="me-2" />;
    if (res < 0) return <Frown className="me-2" />;
    return <Meh className="me-2" />;
  };

  return (
    <Card className="p-2 border">
      <CardHeader className="bg-transparent border-b-0 pb-0">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <h5 className="mb-1 flex items-center gap-2">
              <ArrowRightLeft
                style={{ color: "var(--brand-secondary)" }}
                size={20}
              />
              Resultado del Ejercicio - {registroEjercicio.temporada}
            </h5>
            <small className="fw-flow-description flex items-center gap-1">
              <Calendar size={14} />
              Desde: {registroEjercicio.fechaInicio} Hasta:{" "}
              {registroEjercicio.fechaFin}
            </small>
          </div>
          <div className="flex gap-2">
            <Button
              className="justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 p-2 flex items-center gap-2"
              style={{
                border: "1px solid var(--fw-border)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-main)",
              }}
              title="Registros de balances"
             variant="default">
              <History size={16} /> Balances anteriores
            </Button>
            <Button
              className="justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 p-2 flex items-center gap-2"
              style={{
                fontSize: "1rem",
                border: "1px solid var(--fw-border)",
                backgroundColor: "var(--bg-emerald-soft)",
                color: "var(--fw-emerald)",
              }}
              title="Realizar Balance"
             variant="default">
              <Scale size={16} /> Nuevo Balance
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="">
        <p className="fw-flow-description flex items-center gap-2">
          <Info size={16} />
          Resultados del ejercicio para la temporada{" "}
          {registroEjercicio.temporada}.
        </p>

        <div className="grid grid-cols-12 gap-3 mt-2">
          {/* Ingresos */}
          <div className="col-span-full md:col-span-6">
            <Card className="p-3 relative overflow-hidden h-full fw-libro-ingresos-card">
              <p className="fw-libro-positive flex items-center gap-2 mb-1">
                <ArrowUp size={20} />
                <strong>Ingresos:</strong>
              </p>
              <h3 className="fw-libro-positive font-bold">
                S/. {Number(registroEjercicio.ingresos).toFixed(2)}
              </h3>

              {/* ÍCONO LUCIDE DE FONDO (PiggyBank) */}
              <PiggyBank
                className="absolute"
                size={80}
                strokeWidth={1}
                style={{
                  color: "currentColor", // Usa el color del texto (verde)
                  opacity: 0.15, // Muy sutil
                  right: -10,
                  bottom: -10,
                }}
              />
            </Card>
          </div>

          {/* Gastos */}
          <div className="col-span-full md:col-span-6">
            <Card className="p-3 relative overflow-hidden h-full fw-libro-gastos-card">
              <p className="fw-libro-negative flex items-center gap-2 mb-1">
                <ArrowDown size={20} />
                <strong>Gastos:</strong>
              </p>
              <h3 className="fw-libro-negative font-bold">
                S/. {Number(registroEjercicio.gastos).toFixed(2)}
              </h3>

              {/* ÍCONO LUCIDE DE FONDO (Wallet) */}
              <Wallet
                className="absolute"
                size={80}
                strokeWidth={1}
                style={{
                  color: "currentColor",
                  opacity: 0.15,
                  right: -10,
                  bottom: -10,
                }}
              />
            </Card>
          </div>
        </div>

        {/* Resultado Final */}
        <div
          className={`fw-libro-resultado-box text-center mt-3 flex items-center justify-center ${
            resultado > 0
              ? "fw-libro-resultado-positive"
              : resultado < 0
                ? "fw-libro-resultado-negative"
                : "fw-libro-resultado-neutral"
          }`}
          role="alert"
        >
          {getResultIcon(resultado)}
          <span className="text-lg">
            <strong>Resultado:</strong> S/. {Number(resultado).toFixed(2)}{" "}
            <span className="font-normal italic ms-1">
              {resultado > 0
                ? "(Beneficio)"
                : resultado < 0
                  ? "(Pérdida)"
                  : "(Equilibrio)"}
            </span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
