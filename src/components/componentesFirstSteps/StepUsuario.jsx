import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Importamos iconos de Lucide relacionados con personas y equipos
import {
  UserPlus,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { PutData } from "../../service/CRUD/PutData";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


export function StepUsuario({ onFinish }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const cambiarEstado = async (estado) => {
    setLoading(true); // Bloqueamos el botón para que no den doble click
    navigate("/usuarios");
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

  const handleSkip = async () => {
    setLoading(true); // Bloqueamos el botón para que no den doble click
    navigate("/usuarios");
    const success = await PutData("superadmin/empresasSteps/complete-setup");

    if (success) {
      const empresa = JSON.parse(localStorage.getItem("empresa")) || {};
      empresa.setup_steps = 1;
      localStorage.setItem("empresa", JSON.stringify(empresa));

      // 2. Cerramos el modal
      if (onFinish) onFinish();
    }

    setLoading(false);
  };

  return (
    <Card className="p-0 text-center border-0 rounded-none shadow-sm animate-fade-in overflow-hidden">
      {/* 1. CARD HEADER: Tema Púrpura (Equipo/Admin) */}
      <CardHeader className="py-4 relative border-0 m-0">
        {/* Fondo degradado suave Violeta/Lila */}
        <div
          className="absolute top-0 left-0 w-full h-full p-0"
          style={{
            background: "linear-gradient(to bottom, #f3e8ff, #ffffff)", // Lila muy suave
            opacity: 1,
          }}
        />

        <div className="relative z-1">
          {/* Imagen Principal (3D Team Icon) */}
          <img
            src="https://cdn-icons-png.flaticon.com/512/3215/3215935.png" // Icono 3D de Colaboración/Team
            alt="Equipo de Trabajo"
            className="mb-2"
            style={{
              width: "100px",
              filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
            }}
          />

          {/* Icono Flotante (Badge) */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 mt-2">
            <div className="bg-background p-2 rounded-full shadow-sm flex items-center justify-center">
              <UserPlus
                className="text-primary" // O un color morado personalizado
                style={{ color: "#6f42c1" }} // Púrpura Bootstrap
                size={30}
                strokeWidth={2.5}
              />
            </div>
          </div>
        </div>
      </CardHeader>

      {/* 2. CARD BODY */}
      <CardContent className="pt-5 pb-4 px-4">
        {/* Título */}
        <h3 className="font-bold text-foreground mb-3 mt-2">Tu Equipo de Trabajo</h3>

        {/* Descripción (Enfatizando que es opcional) */}
        <p
          className="text-muted-foreground mx-auto mb-4"
          style={{ maxWidth: "580px", fontSize: "1.1rem" }}
        >
          Si tienes colaboradores, regístralos ahora para asignarles roles
          (Cajero, Mozo). Cada usuario tendrá su propio acceso y permisos.{" "}
          <br />
          <span className="font-semibold text-foreground italic">
            ¿Trabajas solo? Puedes saltar este paso.
          </span>
        </p>

        {/* 3. Beneficios (Pills) */}
        <div className="flex flex-wrap justify-center gap-3 mb-5">
          <div className="flex items-center text-muted-foreground bg-muted px-3 py-2 rounded-full border">
            <ShieldCheck
              className="me-2"
              style={{ color: "#6f42c1" }}
              size={18}
            />
            <span className="text-sm font-bold">Accesos</span>
          </div>

          <div className="flex items-center text-muted-foreground bg-muted px-3 py-2 rounded-full border">
            <Clock className="me-2" style={{ color: "#6f42c1" }} size={18} />
            <span className="text-sm font-bold">Turnos</span>
          </div>

          <div className="flex items-center text-muted-foreground bg-muted px-3 py-2 rounded-full border">
            <CheckCircle2
              className="me-2"
              style={{ color: "#6f42c1" }}
              size={18}
            />
            <span className="text-sm font-bold">Rendimiento</span>
          </div>
        </div>

        {/* 4. Botones de Acción (Principal y Secundario) */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-2">
          {/* Opción A: Crear Usuario (Principal) */}
          <Button
            type="button"
            className="btn-guardar w-auto text-white justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-10 px-5 py-3 rounded-full shadow inline-flex items-center gap-2"
            style={{
              background: "linear-gradient(90deg, #6f42c1, #a66efa)", // Gradiente Púrpura
              border: "none",
              transition: "transform 0.2s",
            }}
            onClick={() => cambiarEstado(5)}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
           variant="default">
            Crear Usuario
            <ArrowRight size={20} />
          </Button>
        </div>

        {/* Opción B: Omitir (Secundario/Link) */}
        <div className="mt-3">
          <Button
            onClick={handleSkip}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary shadow hover:bg-primary/90 text-primary no-underline text-sm"
            disabled={loading}
           variant="default">
            {loading
              ? "Finalizando..."
              : "No tengo personal por ahora, finalizar configuración"}
          </Button>
        </div>

        <div className="mt-3 text-muted-foreground text-sm">Paso 5 de 5 - Último paso</div>
      </CardContent>
    </Card>
  );
}
