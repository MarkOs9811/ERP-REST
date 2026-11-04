import { Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { Button } from "../ui/button";
import { Card } from "@/components/ui/card";

export function CabeceraHome({ cajaAbierta = false }) {
  const { user } = useAuth();
  const nombre = user?.empleado?.persona?.nombre || "Usuario";
  const fecha = new Date().toLocaleDateString("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="h-full min-h-[220px]">
      <Card
        className="relative h-full min-h-[220px] justify-between rounded-2xl border-border/70 bg-cover bg-center p-0 text-white shadow-none"
        style={{ backgroundImage: "url('/images/background2.jpg')" }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-900/65 to-slate-950/25"
        />

        <div className="relative z-10 flex min-h-[220px] flex-col justify-between gap-6 p-5 sm:p-7">
          <div className="space-y-3">
            <span className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white/90">
              Panel de control
            </span>
            <h1 className="mb-0 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Hola, {nombre}
            </h1>
            <p className="mb-0 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
              Revisa ventas, salón y alertas del día desde un solo lugar.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              asChild
              className="h-10 w-fit rounded-lg px-4"
              variant="default"
            >
              <Link to={cajaAbierta ? "/vender/mesas" : "/abrirCaja"}>
                Comenzar a vender
              </Link>
            </Button>
            <div className="inline-flex items-center gap-2 text-xs font-medium capitalize text-white/75">
              <Activity className="size-4" aria-hidden="true" />
              <span>Hoy, {fecha}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
