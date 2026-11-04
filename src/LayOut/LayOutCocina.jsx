import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";
import { ChefHat, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "@/components/ui/card";


export function LayOutCocina() {
  const { user } = useAuth();

  const cargoUsuario = user?.empleado?.cargo?.nombre;

  return (
    <div
      className="mx-auto w-full max-w-7xl px-4 flex items-center justify-center"
      style={{ minHeight: "85vh" }}
    >
      <Card
        className="overflow-hidden"
        style={{
          maxWidth: 650,
          width: "100%",
          borderRadius: 20,
        }}
      >
        <CardContent className="p-5 text-center">
          {/* Icono */}
          <div
            className="mx-auto flex items-center justify-center rounded-full mb-3"
            style={{
              width: 70,
              height: 70,
              background: "#FFF4E5",
            }}
          >
            <ChefHat size={34} strokeWidth={2} color="#F59E0B" />
          </div>

          <h2 className="font-bold mb-2">Bienvenido al Panel de Cocina</h2>

          <div className="mb-4">
            <p className="text-muted-foreground mb-0">
              Revisa los pedidos pendientes, prioriza las preparaciones y mantén
              el flujo de trabajo durante el turno.
            </p>
          </div>

          <Button asChild className="gap-2 px-4" variant="default">
            <Link to="/cocina">
              Revisar pedidos
              <ArrowRight size={20} />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
