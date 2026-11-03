import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { ChefHat, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "@/components/ui/card";


export function LayOutCocina() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const cargoUsuario = user?.empleado?.cargo?.nombre;

  return (
    <div
      className="container d-flex align-items-center justify-content-center"
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
            className="mx-auto d-flex align-items-center justify-content-center rounded-circle mb-3"
            style={{
              width: 70,
              height: 70,
              background: "#FFF4E5",
            }}
          >
            <ChefHat size={34} strokeWidth={2} color="#F59E0B" />
          </div>

          <h2 className="fw-bold mb-2">Bienvenido al Panel de Cocina</h2>

          <div className="mb-4">
            <p className="text-secondary mb-0">
              Revisa los pedidos pendientes, prioriza las preparaciones y mantén
              el flujo de trabajo durante el turno.
            </p>
          </div>

          <Button
            className="btn-principal d-inline-flex align-items-center gap-2 px-4 py-3"
            onClick={() => navigate("/cocina")}
           variant="default">
            Revisar pedidos
            <ArrowRight size={20} />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
