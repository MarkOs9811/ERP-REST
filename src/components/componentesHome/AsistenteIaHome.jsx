
import { Button } from "../ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
export function AsistenteIaHome() {
  return (
    <div className="ai-assistant-floating">
      <Button
        className="btn btn-primary rounded-pill shadow"
        id="aiAssistantButton"
       variant="default">
        <i className="bi bi-robot me-2"></i>Asistente IA
      </Button>
      <div className="ai-assistant-card" id="aiAssistantCard">
        <CardHeader className="flex justify-between">
          <span>Asistente del Restaurante</span>
          <Button className="btn btn-sm btn-close" id="closeAssistant" variant="default"></Button>
        </CardHeader>
        <CardContent className="">
          <div className="ai-message ai-response">
            <p>Hola, ¿en qué puedo ayudarte hoy?</p>
            <small className="text-muted">
              Ejemplo: "¿Qué promociones recomiendas?"
            </small>
          </div>
          <div className="input-group mt-3">
            <input
              type="text"
              className="form-control"
              placeholder="Pregunta al asistente..."
            />
            <Button className="btn btn-outline-primary" variant="default">
              <i className="bi bi-send"></i>
            </Button>
          </div>
        </CardContent>
      </div>
    </div>
  );
}
