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
} from "lucide-react";
import "../../css/estilosAgente/EstilosChatAgente.css"; // <-- Importamos los estilos
import axiosInstance from "../../api/AxiosInstance";

export function FormAgenteChat() {
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);
  const { register, handleSubmit, reset, watch } = useForm();
  const agenteSeleccionado = watch("agenteType");

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (datos) => {
      const response = await axiosInstance.post(
        `/chatAgent/${datos.agenteType}`,
        {
          pregunta: datos.prompt,
        },
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

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-agent-selector">
          {agenteSeleccionado === "ventas" ? (
            <ShoppingCart className="chat-select-icon" aria-hidden="true" />
          ) : agenteSeleccionado === "finanzas" ? (
            <WalletCards className="chat-select-icon" aria-hidden="true" />
          ) : (
            <ChefHat className="chat-select-icon" aria-hidden="true" />
          )}
          <select
            {...register("agenteType")}
            className="chat-select"
            aria-label="Seleccionar agente"
          >
            <option value="platos">
              <ShoppingCart className="chat-select-icon" aria-hidden="true" />
              Agente Platos (Gestión de Menú)
            </option>
            <option value="ventas">Agente Ventas (Próximamente)</option>
            <option value="finanzas">Agente Finanzas (Próximamente)</option>
          </select>
        </div>
      </div>

      <div className="chat-box cajaRespuestas">
        {messages.length === 0 ? (
          <div className="chat-empty-state">
            <Bot size={40} style={{ margin: "0 auto 10px", opacity: 0.5 }} />
            <p>Selecciona un agente y escribe tu orden.</p>
            <small>Ej: "Sube el precio del Lomo Saltado a 25 soles"</small>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message-row ${msg.role === "user" ? "chat-user-row" : "chat-agent-row"}`}
            >
              <div
                className={`chat-bubble ${msg.role === "user" ? "chat-user-bubble" : "chat-agent-bubble"}`}
              >
                {msg.role === "agent" && (
                  <Bot
                    size={25}
                    style={{ marginTop: "2px", color: "#198754" }}
                  />
                )}
                <span style={{ whiteSpace: "pre-wrap" }}>{msg.content}</span>
                {msg.role === "user" && (
                  <User size={18} style={{ marginTop: "2px" }} />
                )}
              </div>
            </div>
          ))
        )}

        {chatMutation.isPending && (
          <div className="chat-message-row chat-agent-row">
            <div className="chat-loading-box">
              <Loader2 size={16} className="animacion-rotar" />
              <span>El agente está trabajando...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="chat-form-container">
        <input
          {...register("prompt")}
          type="text"
          autoComplete="off"
          disabled={chatMutation.isPending || !agenteSeleccionado}
          placeholder="Ej: Desactiva de la web la chicha morada"
          className="chat-input"
        />
        <button
          type="submit"
          disabled={chatMutation.isPending || !agenteSeleccionado}
          className="btn-guardar chat-btn-submit"
        >
          {chatMutation.isPending ? (
            <Loader2 size={18} className="animacion-rotar" />
          ) : (
            <SendIcon size={18} />
          )}
          Ejecutar
        </button>
      </form>
    </div>
  );
}
