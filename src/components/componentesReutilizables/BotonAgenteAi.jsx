import { Brain } from "lucide-react";
import "../../css/EstilosBotonAgenteAi.css";
import ModalRight from "./ModalRight";
import { FormAgenteChat } from "../componenteAgentes/FormAgenteChat";
import { useState } from "react";

export function BotonAgenteAi() {
  const [modalAgenteAi, setModalAgenteAi] = useState(false);

  return (
    <div>
      <button
        className="agent-ai-button d-flex align-items-center justify-content-center overflow-hidden"
        title="Abrir agente IA"
        aria-label="Abrir agente IA"
        onClick={() => setModalAgenteAi(true)}
      >
        <Brain aria-hidden="true" />
      </button>

      <ModalRight
        isOpen={modalAgenteAi}
        onClose={() => setModalAgenteAi(false)}
        width={"450px"}
        hideFooter={true}
        title={"Gestione el sistema"}
      >
        <FormAgenteChat />
      </ModalRight>
    </div>
  );
}
