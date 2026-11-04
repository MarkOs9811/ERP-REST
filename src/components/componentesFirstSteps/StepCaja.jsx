import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Importamos iconos de Lucide relacionados con dinero y ventas
import {
  CircleDollarSign,
  Receipt,
  LockKeyhole,
  ArrowRight,
  Store,
} from "lucide-react";
import { PutData } from "../../service/CRUD/PutData";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


export function StepCaja({ onFinish }) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const cambiarEstado = async (estado) => {
    setLoading(true); // Bloqueamos el botón para que no den doble click
    navigate("/ventas/cajas");
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
    <Card className="p-0 text-center border-0 shadow-sm animate-fade-in overflow-hidden">
      {/* 1. CARD HEADER: Tema Dorado (Dinero) */}
      <CardHeader className="py-4 relative border-0 m-0">
        {/* Fondo degradado suave Ámbar/Dorado */}
        <div
          className="absolute top-0 left-0 w-full h-full p-0"
          style={{
            background: "linear-gradient(to bottom, #fff8e1, #ffffff)", // Un crema/dorado muy suave
            opacity: 1,
          }}
        />

        <div className="relative z-1">
          {/* Imagen Principal */}
          <img
            src="https://cdn-icons-png.flaticon.com/512/2454/2454282.png" // Icono de Caja Registradora 3D
            alt="Caja Registradora"
            className="mb-2"
            style={{
              width: "90px",
              filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
            }}
          />

          {/* Icono Flotante (Badge) */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 mt-2">
            <div className="bg-background p-2 rounded-full shadow-sm flex items-center justify-center">
              <CircleDollarSign
                className="text-amber-600 dark:text-amber-400"
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
        <h3 className="font-bold text-foreground mb-3 mt-2">Crea tu Punto de Venta</h3>

        {/* Descripción Mejorada */}
        <p
          className="text-muted-foreground mx-auto mb-4"
          style={{ maxWidth: "580px", fontSize: "1.1rem" }}
        >
          Para empezar a facturar, necesitas definir{" "}
          <b>dónde ingresa el dinero</b>. Crea tu primera Caja (ej.{" "}
          <i>"Caja Principal"</i> o <i>"Barra"</i>) para controlar ventas,
          cortes de turno y movimientos de efectivo de forma segura.
        </p>

        {/* 3. Beneficios (Pills) */}
        <div className="flex flex-wrap justify-center gap-3 mb-5">
          <div className="flex items-center text-muted-foreground bg-muted px-3 py-2 rounded-full border">
            <Store className="me-2 text-amber-600 dark:text-amber-400" size={18} />
            <span className="text-sm font-bold">Facturación</span>
          </div>

          <div className="flex items-center text-muted-foreground bg-muted px-3 py-2 rounded-full border">
            <Receipt className="me-2 text-amber-600 dark:text-amber-400" size={18} />
            <span className="text-sm font-bold">Cortes y Arqueos</span>
          </div>

          <div className="flex items-center text-muted-foreground bg-muted px-3 py-2 rounded-full border">
            <LockKeyhole className="me-2 text-amber-600 dark:text-amber-400" size={18} />
            <span className="text-sm font-bold">Seguridad</span>
          </div>
        </div>

        {/* 4. Botones de Acción */}
        <div className="flex gap-3 justify-center items-center mb-2">
          {/* Botón Principal (Estilo Dorado/Ámbar) */}
          <Button
            type="button"
            onClick={() => cambiarEstado(3)}
            className="btn-guardar w-auto text-white justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-10 px-5 py-3 rounded-full shadow inline-flex items-center gap-2"
            style={{
              background: "linear-gradient(90deg, #f59e0b, #d97706)", // Gradiente Ámbar
              border: "none",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
           variant="default">
            Ir a Crear Caja
            <ArrowRight size={20} />
          </Button>
        </div>

        <div className="mt-4 text-muted-foreground text-sm">
          Paso 3 de 5 para completar la configuración
        </div>
      </CardContent>
    </Card>
  );
}
