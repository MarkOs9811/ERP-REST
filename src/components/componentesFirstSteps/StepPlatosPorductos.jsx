import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Importamos iconos de Lucide relacionados con comida y productos
import {
  UtensilsCrossed,
  Soup,
  Tags,
  ArrowRight,
  PackageSearch,
} from "lucide-react";
import { PutData } from "../../service/CRUD/PutData";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


export function StepPlatosProductos({ onFinish }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const cambiarEstado = async (estado) => {
    setLoading(true); // Bloqueamos el botón para que no den doble click
    navigate("/platos");
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
      {/* 1. CARD HEADER: Tema Naranja (Comida/Creatividad) */}
      <CardHeader className="py-4 relative border-0 m-0">
        {/* Fondo degradado suave Naranja/Melocotón */}
        <div
          className="absolute top-0 left-0 w-full h-full p-0"
          style={{
            background: "linear-gradient(to bottom, #ffcdcdff, #ffffff)", // Un naranja pastel muy suave
            opacity: 1,
          }}
        />

        <div className="relative z-1">
          {/* Imagen Principal (3D Food Icon) */}
          <img
            src="https://cdn-icons-png.flaticon.com/512/2921/2921822.png" // Icono de Hamburguesa/Comida 3D
            alt="Menú y Productos"
            className="mb-2"
            style={{
              width: "100px",
              filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
            }}
          />

          {/* Icono Flotante (Badge) */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 mt-2">
            <div className="bg-background p-2 rounded-full shadow-sm flex items-center justify-center">
              <UtensilsCrossed
                className="text-destructive" // Color rojo/naranja
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
        <h3 className="font-bold text-foreground mb-3 mt-2">Arma tu Menú o Catálogo</h3>

        {/* Descripción */}
        <p
          className="text-muted-foreground mx-auto mb-4"
          style={{ maxWidth: "580px", fontSize: "1.1rem" }}
        >
          Dale vida a tu negocio. Crea tus <b>Categorías</b> (ej.{" "}
          <i>Entradas, Bebidas</i>) y registra tus <b>Platos o Productos</b>.
          Define precios, fotos y controla el stock para empezar a tomar
          pedidos.
        </p>

        {/* 3. Beneficios (Pills) */}
        <div className="flex flex-wrap justify-center gap-3 mb-5">
          <div className="flex items-center text-muted-foreground bg-muted px-3 py-2 rounded-full border">
            <Tags className="me-2 text-destructive" size={18} />
            <span className="text-sm font-bold">Categorías</span>
          </div>

          <div className="flex items-center text-muted-foreground bg-muted px-3 py-2 rounded-full border">
            <Soup className="me-2 text-destructive" size={18} />
            <span className="text-sm font-bold">Carta Digital</span>
          </div>

          <div className="flex items-center text-muted-foreground bg-muted px-3 py-2 rounded-full border">
            <PackageSearch className="me-2 text-destructive" size={18} />
            <span className="text-sm font-bold">Control de Stock</span>
          </div>
        </div>

        {/* 4. Botones de Acción */}
        <div className="flex gap-3 justify-center items-center mb-2">
          {/* Botón Principal (Estilo Naranja Vibrante) */}
          <Button
            type="button"
            onClick={() => cambiarEstado(4)}
            className="btn-guardar w-auto text-white justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-10 px-5 py-3 rounded-full shadow inline-flex items-center gap-2"
            style={{
              background: "linear-gradient(90deg, #fd7e14, #dc3545)", // Gradiente Naranja a Rojo
              border: "none",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
           variant="default">
            Crear Menú / Productos
            <ArrowRight size={20} />
          </Button>
        </div>

        <div className="mt-4 text-muted-foreground text-sm">
          Paso 4 de 5 para completar la configuración
        </div>
      </CardContent>
    </Card>
  );
}
