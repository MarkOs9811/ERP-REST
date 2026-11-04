import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// 1. Importamos los iconos necesarios de Lucide
import { MapPin, Building2, Store, Users, ArrowRight } from "lucide-react";
import { PutData } from "../../service/CRUD/PutData";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


export function StepSede({ onFinish }) {
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
    <Card className="text-center p-3">
      <CardHeader className="">
        {/* 1. Cabecera con Banner Vectorial */}
        <div className="mb-4 flex justify-center items-center">
          {/* Aquí iría tu imagen real. He puesto un placeholder visual. */}
          <div style={{ maxWidth: "300px", opacity: 0.9 }}>
            {/* Ejemplo de imagen temporal (puedes borrar esto cuando pongas la tuya) */}
            <img
              src="https://cdn-icons-png.flaticon.com/512/869/869636.png"
              alt="Sede Config"
              style={{ width: "120px" }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="">
        {/* 2. Título y Descripción */}
        <h3 className="font-bold text-foreground mb-3 flex items-center justify-center gap-2">
          <MapPin className="text-destructive" size={32} strokeWidth={2.5} />
          Establece tu Sede Principal
        </h3>

        <p
          className="text-muted-foreground mx-auto mb-4"
          style={{ maxWidth: "550px", fontSize: "1.1rem" }}
        >
          Todo comienza aquí. Antes de contratar personal o vender productos,
          necesitas definir <b>dónde</b> opera tu negocio. Registra la dirección
          y los datos de contacto de tu local principal.
        </p>

        {/* 3. Pequeños iconos informativos (Beneficios) */}
        <div className="flex flex-wrap justify-center gap-4 mb-5">
          <div className="flex items-center text-muted-foreground bg-muted px-3 py-2 rounded shadow-sm">
            <Building2 className="me-2 text-primary" size={20} />
            <span>Control de Stock</span>
          </div>

          <div className="flex items-center text-muted-foreground bg-muted px-3 py-2 rounded shadow-sm">
            <Store className="me-2 text-primary" size={20} />
            <span>Punto de Facturación</span>
          </div>

          <div className="flex items-center text-muted-foreground bg-muted px-3 py-2 rounded shadow-sm">
            <Users className="me-2 text-primary" size={20} />
            <span>Asignación de Personal</span>
          </div>
        </div>

        {/* 4. Botón de Acción Principal */}
        <Button
          type="button"
          onClick={() => cambiarEstado(1)}
          className="btn-guardar justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-10 px-5 shadow py-2 rounded-full inline-flex items-center gap-2 w-auto"
          style={{ transition: "transform 0.2s", textDecoration: "none" }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
         variant="default">
          Ir a Crear Sede
          <ArrowRight size={20} />
        </Button>

        <div className="mt-3 text-muted-foreground text-sm">
          <small>Paso 1 de 5 para completar la configuración</small>
        </div>
      </CardContent>
    </Card>
  );
}
