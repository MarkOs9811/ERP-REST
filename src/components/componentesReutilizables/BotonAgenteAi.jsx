import { Brain, Sparkles } from "lucide-react";
import ModalRight from "./ModalRight";
import { FormAgenteChat } from "../componenteAgentes/FormAgenteChat";
import { useState } from "react";
import { Button } from "../ui/button";

export function BotonAgenteAi() {
  const [modalAgenteAi, setModalAgenteAi] = useState(false);

  return (
    <div>
      <Button
        className="absolute bottom-4 right-8 z-50 flex h-10 w-10 items-center justify-center rounded-full p-0  hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 sm:h-12 sm:w-12"
        title="Abrir agente IA"
        aria-label="Abrir agente IA"
        onClick={() => setModalAgenteAi(true)}
        variant="default"
      >
        <Brain aria-hidden="true" />
      </Button>

      <ModalRight
        isOpen={modalAgenteAi}
        onClose={() => setModalAgenteAi(false)}
        width={"520px"}
        hideFooter={true}
        title={"Asistente IA (BETA)"}
        subtitulo="Asistentes inteligentes para consultar y gestionar tu operación."
        icono={<Sparkles />}
      >
        <FormAgenteChat />
      </ModalRight>
    </div>
  );
}
