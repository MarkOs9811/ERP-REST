import { Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { Button } from "../ui/button";
import { Card } from "@/components/ui/card";


export function CabeceraHome({ cajaAbierta = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const nombre = user?.empleado?.persona?.nombre || "Usuario";
  const fecha = new Date().toLocaleDateString();
  const hora = new Date().toLocaleTimeString();

  return (
    <div className="h-full min-h-[220px]">
      <Card
        className="home-hero-banner relative h-full min-h-[220px] overflow-hidden rounded-2xl"
        style={{ backgroundImage: "url('/images/background2.jpg')" }}
      >
        <div className="home-banner-overlay"></div>

        <div className="home-banner-content relative z-[2] flex h-full flex-col justify-between p-5 sm:p-8">
          <div>
            <span className="mb-3 inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
              Panel de control
            </span>
            <h1 className="home-banner-title mb-2 text-2xl font-bold text-white sm:text-3xl">
              Hola, {nombre}
            </h1>
            <p className="mb-0 max-w-xl text-sm text-white/80 sm:text-base">
              Revisa ventas, salón y alertas del día desde un solo lugar.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              className="btn-eliminar rounded-lg px-4 py-3"
              onClick={() =>
                navigate(cajaAbierta ? "/vender/mesas" : "/abrirCaja")
              }
             variant="destructive">
              Comenzar a vender
            </Button>
            <div className="home-banner-meta flex items-center gap-2 text-sm text-white/80">
              <Activity color="#fff" size={18} />
              <span>
                {fecha} · Última actualización: {hora}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
