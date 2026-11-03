import React from "react";
import { Rocket, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

export function StepBienvenida({ onStart }) {
  const empresa =
    JSON.parse(
      localStorage.getItem("empresa") || sessionStorage.getItem("empresa"),
    ) || {};

  return (
    // Agregamos overflow-hidden para que la imagen respete los bordes redondeados
    <div className="overflow-hidden rounded-xl bg-card text-center text-card-foreground shadow-sm">
      {/* 1. CABECERA TIPO PORTADA */}
      <div className="relative h-48 bg-muted">
        {/* IMAGEN: Accedemos directamente desde la raíz / */}
        <img
          src="/images/fondo_subMenu.svg"
          alt="Fondo bienvenida"
          className="h-full w-full object-cover opacity-85"
        />

        {/* Overlay opcional para oscurecer un poco la imagen si el texto no se lee */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(0,0,0,0.1))",
          }}
        ></div>
        {/* 2. ICONO FLOTANTE */}
        <div
          className="absolute bottom-0 left-1/2 flex size-20 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full bg-white p-4 shadow-lg"
          style={{
            zIndex: 10,
          }}
        >
          <Rocket size={48} className="text-rose-600 floating-icon" />
        </div>
      </div>

      <div className="px-5 pb-8 pt-12">
        {/* Estilos de animación en línea para el cohete */}
        <style>
          {`
            @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-8px); }
                100% { transform: translateY(0px); }
            }
            .floating-icon { animation: float 3s ease-in-out infinite; }
            `}
        </style>

        {/* 3. TÍTULO */}
        <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
          ¡Bienvenido a <br />
          <span
            style={{
              background: "linear-gradient(90deg, #fd0d0d, #f0270d)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {empresa.nombre || "Tu Plataforma"}
          </span>
          !
        </h2>

        <p className="mx-auto mb-6 max-w-xl text-base leading-relaxed text-muted-foreground">
          Estamos listos para despegar. Hemos preparado un asistente rápido para
          configurar los cimientos de tu negocio en minutos.
        </p>

        {/* 4. BENEFICIOS */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {["Configuración Guiada", "Gestión Eficiente", "Soporte 24/7"].map(
            (item, index) => (
              <div key={index}>
                <div className="flex items-center rounded-full border border-border bg-muted px-3 py-2">
                  <CheckCircle2 size={16} className="mr-2 text-emerald-600" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    {item}
                  </span>
                </div>
              </div>
            ),
          )}
        </div>

        {/* 5. BOTÓN DE ACCIÓN */}
        <div>
          <Button
            onClick={onStart}
            className="btn-guardar inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold shadow transition-transform hover:scale-105"
            style={{
              border: "none",
            }}
           variant="default">
            ¡Comencemos!
            <ArrowRight size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
}
