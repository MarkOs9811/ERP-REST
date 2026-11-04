import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Network, Shield, ArrowRight, Users2 } from "lucide-react";
import { PutData } from "../../service/CRUD/PutData";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


export function StepAreaCargo({ onFinish }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const cambiarEstado = async (estado) => {
    setLoading(true); // Bloqueamos el botón para que no den doble click
    navigate("/rrhh/areas-y-cargos");
    const success = await PutData("empresasSteps", estado);

    if (success) {
      const empresa =
        JSON.parse(
          localStorage.getItem("empresa") || sessionStorage.getItem("empresa"),
        ) || {};
      empresa.setup_steps = estado;
      localStorage.setItem(
        "empresa",
        JSON.stringify(empresa) ||
          sessionStorage.setItem("empresa", JSON.stringify(empresa)),
      );

      // 2. Cerramos el modal
      if (onFinish) onFinish();
    }

    setLoading(false);
  };
  return (
    <Card className="text-center border-0 shadow-sm animate-fade-in overflow-hidden">
      {/* 1. CARD HEADER: Imagen e Identidad Visual */}
      <CardHeader className="bg-muted py-4 relative border-0">
        {/* Fondo decorativo sutil */}
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background: "linear-gradient(to bottom, #f0fff4, #ffffff)", // Gradiente verde muy suave
            opacity: 0.8,
          }}
        ></div>

        <div className="relative z-1">
          {/* Imagen Principal */}
          <img
            src="https://cdn-icons-png.flaticon.com/512/2679/2679269.png"
            alt="Estructura Organizacional"
            className="mb-2"
            style={{
              width: "90px",
              filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
            }}
          />

          {/* Icono Flotante Superpuesto (Badge) */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 mt-2">
            <div className="bg-background p-2 rounded-full shadow-sm flex items-center justify-center">
              <Network className="text-emerald-600 dark:text-emerald-400" size={28} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </CardHeader>

      {/* 2. CARD BODY: Contenido */}
      <CardContent className="pt-5 pb-4 px-4">
        {/* Título */}
        <h3 className="font-bold text-foreground mb-3 mt-2">Define tu Estructura</h3>

        {/* Descripción */}
        <p
          className="text-muted-foreground mx-auto mb-4"
          style={{ maxWidth: "550px", fontSize: "1.1rem" }}
        >
          Para que tu empresa funcione como un reloj, necesitas orden. Crea tus{" "}
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Áreas</span> (ej. Cocina,
          Ventas) y asigna sus{" "}
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Cargos</span> correspondientes
          (ej. Chef, Cajero).
        </p>

        {/* Beneficios (Features) */}
        <div className="flex flex-wrap justify-center gap-3 mb-5">
          <div className="flex items-center text-muted-foreground bg-muted px-3 py-2 rounded-full border">
            <Briefcase className="me-2 text-emerald-600 dark:text-emerald-400" size={18} />
            <span className="text-sm font-bold">Roles Claros</span>
          </div>

          <div className="flex items-center text-muted-foreground bg-muted px-3 py-2 rounded-full border">
            <Shield className="me-2 text-emerald-600 dark:text-emerald-400" size={18} />
            <span className="text-sm font-bold">Seguridad</span>
          </div>

          <div className="flex items-center text-muted-foreground bg-muted px-3 py-2 rounded-full border">
            <Users2 className="me-2 text-emerald-600 dark:text-emerald-400" size={18} />
            <span className="text-sm font-bold">Nómina</span>
          </div>
        </div>

        {/* Botón de Acción */}
        <div className="mb-2">
          <Button
            type="button"
            onClick={() => cambiarEstado(2)}
            className="btn-guardar w-auto justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-10 px-5 py-3 rounded-full shadow inline-flex items-center gap-2"
            style={{
              background: "linear-gradient(90deg, #198754, #20c997)",
              border: "none",
              transition: "transform 0.2s",
              textDecoration: "none",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
           variant="default">
            Crear Áreas y Cargos
            <ArrowRight size={20} />
          </Button>
        </div>

        <div className="mt-3 text-muted-foreground text-sm">
          Paso 2 de 5 para completar la configuración
        </div>
      </CardContent>
    </Card>
  );
}
