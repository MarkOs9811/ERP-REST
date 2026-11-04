import { Button } from "../ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
export function AsistenteIaHome() {
  return (
    <div className="ai-assistant-floating">
      <Button
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow"
        id="aiAssistantButton"
        variant="default"
      >
        <i className="bi bi-robot me-2"></i>Asistente IA
      </Button>
      <div className="ai-assistant-card" id="aiAssistantCard">
        <CardHeader className="flex justify-between">
          <span>Asistente del Restaurante</span>
          <Button
            className="bg-primary text-primary-foreground shadow hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 size-8 p-0 opacity-70 hover:opacity-100"
            id="closeAssistant"
            variant="default"
          ></Button>
        </CardHeader>
        <CardContent className="">
          <div className="ai-message ai-response">
            <p>Hola, ¿en qué puedo ayudarte hoy?</p>
            <small className="text-muted-foreground">
              Ejemplo: "¿Qué promociones recomiendas?"
            </small>
          </div>
          <div className="flex w-full items-stretch mt-3">
            <input
              type="text"
              className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Pregunta al asistente..."
            />
            <Button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
              variant="default"
            >
              <i className="bi bi-send"></i>
            </Button>
          </div>
        </CardContent>
      </div>
    </div>
  );
}
