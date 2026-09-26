import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {
  Bot,
  ChefHat,
  Loader2,
  SendIcon,
  ShoppingCart,
  User,
  WalletCards,
  Sparkles,
  MessageSquareDashed, // <-- Un icono extra para los badges
} from "lucide-react";
import "../../css/estilosAgente/EstilosChatAgente.css";
import axiosInstance from "../../api/AxiosInstance";

export function FormAgenteChat() {
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  // Añadimos setValue para poder escribir en el input mediante código
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const agenteSeleccionado = watch("agenteType");

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

  // NUEVO: Función para ejecutar la orden al hacer clic en un badge
  const handleBadgeClick = (textoSugerencia) => {
    setValue("prompt", textoSugerencia); // Llena el input visualmente
    onSubmit({ prompt: textoSugerencia, agenteType: agenteSeleccionado }); // Lo envía automáticamente
  };

  // NUEVO: Lista de sugerencias por defecto
  const sugerenciasPlatos = [
    "Sube el precio del Lomo Saltado a 25 soles",
    "¿Qué platos tienen la palabra pollo?",
    "Desactiva la chicha morada de la web",
    "Crea un plato a 35 soles",
  ];

  return (
    <div className="chat-ai-container d-flex flex-column w-100 h-100 overflow-hidden rounded-0 border-0">
      {/* HEADER */}
      <div className="chat-ai-header d-flex flex-wrap flex-shrink-0 justify-content-between align-items-center">
        <div className="chat-ai-title d-flex align-items-center">
          <Sparkles className="icon-sparkle" size={20} />
          <span>Asistente Inteligente</span>
        </div>
        <div className="chat-agent-selector d-flex align-items-center">
          {agenteSeleccionado === "ventas" ? (
            <ShoppingCart className="selector-icon" size={16} />
          ) : agenteSeleccionado === "finanzas" ? (
            <WalletCards className="selector-icon" size={16} />
          ) : (
            <ChefHat className="selector-icon" size={16} />
          )}
          <select
            {...register("agenteType")}
            className="chat-select-clean"
            defaultValue="platos"
          >
            <option value="platos">Agente Platos (Menú)</option>
            <option value="ventas" disabled>
              Agente Ventas (Pronto)
            </option>
            <option value="finanzas" disabled>
              Agente Finanzas (Pronto)
            </option>
          </select>
        </div>
      </div>

      {/* ZONA DE MENSAJES */}
      <div className="chat-ai-body d-flex flex-column flex-grow-1 overflow-y-auto custom-scrollbar">
        {messages.length === 0 ? (
          <div className="chat-empty-state d-flex flex-column align-items-center text-center m-auto">
            <div className="empty-icon-wrapper">
              <Bot size={48} strokeWidth={1.5} />
            </div>
            <h3>¿En qué te ayudo hoy?</h3>
            <p>Selecciona un agente o usa una de las sugerencias.</p>

            {/* NUEVO: Contenedor de Badges */}
            <div className="chat-suggestions-container mt-4 d-flex flex-wrap justify-content-center gap-2">
              {sugerenciasPlatos.map((sugerencia, index) => (
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
                    <Bot size={18} />
                  </div>
                )}
                <div
                  className={`chat-bubble ${
                    msg.role === "user" ? "bubble-user" : "bubble-agent"
                  }`}
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
          <div className="chat-row d-flex align-items-end row-agent animate-slide-up">
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

      {/* ZONA DE INPUT */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="chat-ai-footer flex-shrink-0 w-100 bg-light"
      >
        <div className="input-wrapper d-flex align-items-center w-100 bg-white">
          <input
            {...register("prompt")}
            type="text"
            autoComplete="off"
            disabled={chatMutation.isPending || !agenteSeleccionado}
            placeholder="Escribe tu instrucción aquí..."
            className="chat-input-clean form-control border-0 shadow-none"
          />
          <button
            type="submit"
            disabled={chatMutation.isPending || !agenteSeleccionado}
            className="chat-btn-send btn-icon d-flex align-items-center justify-content-center"
          >
            {chatMutation.isPending ? (
              <Loader2 size={25} className="animacion-rotar" />
            ) : (
              <SendIcon sizes={25} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
