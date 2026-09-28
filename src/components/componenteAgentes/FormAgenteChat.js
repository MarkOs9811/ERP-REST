import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {
  Bot,
  ChefHat,
  Loader2,
  SendIcon,
  Store,
  User,
  WalletCards,
  Sparkles,
  MessageSquareDashed,
} from "lucide-react";
import "../../css/estilosAgente/EstilosChatAgente.css";
import axiosInstance from "../../api/AxiosInstance";

const AGENTES_CONFIG = [
  { id: "platos", nombre: "Agente Platos", icono: ChefHat, disponible: true },
  { id: "pos", nombre: "Agente POS", icono: Store, disponible: true },
  {
    id: "ventas",
    nombre: "Agente Ventas",
    icono: WalletCards,
    disponible: false,
  },
];

const SUGERENCIAS_POR_AGENTE = {
  platos: [
    "Sube el precio del Lomo Saltado a 25 soles",
    "¿Qué platos tienen la palabra pollo?",
    "Desactiva la chicha morada de la web",
    "Crea un plato a 35 soles",
  ],
  pos: [
    "¿Cuánto he vendido hoy en mi caja?",
    "¿Qué mesas están libres?",
    "Reserva una mesa para mañana a las 8pm",
    "Abre mi caja con 100 soles",
  ],
  ventas: [],
};

export function FormAgenteChat() {
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: { agenteType: "platos", prompt: "" },
  });

  const agenteSeleccionado = watch("agenteType");
  const agenteInfo =
    AGENTES_CONFIG.find((ag) => ag.id === agenteSeleccionado) ||
    AGENTES_CONFIG[0];
  const sugerenciasActuales = SUGERENCIAS_POR_AGENTE[agenteSeleccionado] || [];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (datos) => {
      const response = await axiosInstance.post(
        `/chatAgent/${datos.agenteType}`,
        { pregunta: datos.prompt },
      );
      return response.data;
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: data.respuesta },
      ]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: "❌ Error de conexión con el orquestador." },
      ]);
    },
  });

  const onSubmit = (data) => {
    if (!data.prompt.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: data.prompt }]);
    chatMutation.mutate(data);
    reset({ prompt: "" });
  };

  const handleBadgeClick = (textoSugerencia) => {
    setValue("prompt", textoSugerencia);
    onSubmit({ prompt: textoSugerencia, agenteType: agenteSeleccionado });
  };

  return (
    <div className="chat-ai-container d-flex flex-column w-100 h-100 border-0">
      <input type="hidden" {...register("agenteType")} />

      {/* HEADER */}
      <div className="card d-flex p-3 rounded-none border-0  justify-content-between align-items-center">
        <div className="chat-agent-selector  d-flex align-items-center">
          {AGENTES_CONFIG.map((ag) => {
            const Icono = ag.icono;
            const isSelected = agenteSeleccionado === ag.id;
            return (
              <button
                key={ag.id}
                type="button"
                disabled={!ag.disponible || chatMutation.isPending}
                onClick={() => {
                  setValue("agenteType", ag.id);
                  setMessages([]);
                }}
                title={!ag.disponible ? "Próximamente" : ag.nombre}
                // AQUI ESTÁ EL CAMBIO: pill-activa en vez de selected
                className={`agent-pill d-flex  align-items-center px-3 justify-content-center ${isSelected ? "pill-activa" : ""}`}
              >
                <Icono size={22} className={isSelected ? "me-1" : ""} />
                {isSelected && <span>{ag.nombre}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* BODY */}
      <div className="chat-ai-body d-flex flex-column flex-grow-1 custom-scrollbar ">
        {messages.length === 0 ? (
          <div className="chat-empty-state d-flex flex-column align-items-center text-center">
            <div className="empty-icon-wrapper">
              <agenteInfo.icono size={48} strokeWidth={1.5} />
            </div>
            <h3>¿En qué te ayudo hoy?</h3>
            <p>Selecciona una sugerencia para el {agenteInfo.nombre}.</p>

            <div className="chat-suggestions-container d-flex flex-wrap justify-content-center gap-2 mt-3">
              {sugerenciasActuales.map((sugerencia, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleBadgeClick(sugerencia)}
                  className="suggestion-badge d-flex align-items-center"
                  disabled={chatMutation.isPending}
                >
                  <MessageSquareDashed size={14} className="me-2 text-muted" />
                  {sugerencia}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat-messages-list d-flex flex-column">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-row d-flex align-items-end ${
                  msg.role === "user"
                    ? "row-user justify-content-end"
                    : "row-agent"
                } animate-slide-up`}
              >
                {msg.role === "agent" && (
                  <div className="avatar-agent d-flex align-items-center justify-content-center">
                    <agenteInfo.icono size={18} />
                  </div>
                )}
                <div
                  className={`chat-bubble ${msg.role === "user" ? "bubble-user" : "bubble-agent"}`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="avatar-user d-flex align-items-center justify-content-center">
                    <User size={18} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {chatMutation.isPending && (
          <div className="chat-row d-flex align-items-end row-agent animate-slide-up mt-3 bg-light">
            <div className="avatar-agent d-flex align-items-center justify-content-center pulse-anim">
              <Bot size={18} />
            </div>
            <div className="chat-bubble bubble-agent typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* FOOTER */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="chat-ai-footer flex-shrink-0 w-100 "
      >
        <div className="input-wrapper d-flex align-items-center w-100">
          <input
            {...register("prompt")}
            type="text"
            autoComplete="off"
            disabled={chatMutation.isPending || !agenteInfo.disponible}
            placeholder={`Habla con el ${agenteInfo.nombre}...`}
            className="chat-input-clean flex-grow-1 bg-transparent"
          />
          <button
            type="submit"
            disabled={chatMutation.isPending || !agenteInfo.disponible}
            className="chat-btn-send d-flex align-items-center justify-content-center"
          >
            {chatMutation.isPending ? (
              <Loader2 size={18} className="animacion-rotar" />
            ) : (
              <SendIcon size={18} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
