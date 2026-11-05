import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Bot,
  ChefHat,
  CircleHelp,
  LockKeyhole,
  Loader2,
  MessageSquareText,
  Send,
  Sparkles,
  Store,
  UserRound,
  WalletCards,
} from "lucide-react";

import axiosInstance from "../../api/AxiosInstance";
import { useAuth } from "../../AuthContext";
import { GetConfi } from "../../service/accionesConfiguracion/GetConfi";
import {
  hasModuleAccess,
  isRestaurantBusiness,
} from "../../utils/modulePermissions";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const AGENTES_CONFIG = [
  {
    id: "platos",
    nombre: "Agente Platos",
    descripcion: "Administra platos, precios y productos del menu.",
    icono: ChefHat,
    disponible: true,
  },
  {
    id: "pos",
    nombre: "Agente POS",
    descripcion: "Consulta la actividad y las operaciones de tu punto de venta.",
    icono: Store,
    disponible: true,
  },
  {
    id: "ventas",
    nombre: "Agente Ventas",
    descripcion: "Analiza resultados y tendencias de venta.",
    icono: WalletCards,
    disponible: false,
  },
];

const SUGERENCIAS_POR_AGENTE = {
  platos: [
    "Sube el precio del Lomo Saltado a 25 soles",
    "Que platos tienen la palabra pollo?",
    "Desactiva la chicha morada de la web",
    "Crea un plato a 35 soles",
  ],
  pos: [
    "Cuanto he vendido hoy en mi caja?",
    "Que mesas estan libres?",
    "Reserva una mesa para manana a las 8pm",
    "Abre mi caja con 100 soles",
  ],
  ventas: [],
};

const SUGERENCIAS_POS_RETAIL = [
  "Cuanto se vendio hoy en mi caja?",
  "Que productos tienen poco stock?",
  "Cuales fueron los productos mas vendidos?",
  "Cuanto se recaudo esta semana?",
];

export function FormAgenteChat() {
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);
  const { user } = useAuth();
  const { data: configurations = [], isLoading: isLoadingConfigurations } =
    useQuery({
      queryKey: ["confiEmpresa"],
      queryFn: GetConfi,
      retry: 1,
      refetchOnWindowFocus: false,
    });
  const isRestaurant = isRestaurantBusiness(configurations);

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: { agenteType: "pos", prompt: "" },
  });

  const agenteSeleccionado = watch("agenteType");
  const initialAgent =
    isRestaurant && hasModuleAccess(user, "platos") ? "platos" : "pos";
  const agentes = AGENTES_CONFIG.map((agent) => ({
    ...agent,
    disponible:
      agent.disponible &&
      (agent.id !== "platos" ||
        (isRestaurant && hasModuleAccess(user, "platos"))) &&
      (agent.id !== "pos" || hasModuleAccess(user, "ventas")),
  }));
  const agenteInfo =
    agentes.find((agent) => agent.id === agenteSeleccionado) || agentes[1];
  const sugerenciasActuales =
    agenteSeleccionado === "pos" && !isRestaurant
      ? SUGERENCIAS_POS_RETAIL
      : SUGERENCIAS_POR_AGENTE[agenteSeleccionado] || [];

  useEffect(() => {
    if (!isLoadingConfigurations) {
      setValue("agenteType", initialAgent);
      setMessages([]);
    }
  }, [initialAgent, isLoadingConfigurations, setValue]);

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
      setMessages((previous) => [
        ...previous,
        { role: "agent", content: data.respuesta },
      ]);
    },
    onError: (error) => {
      console.error("Error al consultar el agente:", error);
      const message =
        error.response?.data?.respuesta ||
        error.response?.data?.message ||
        error.message ||
        "No se pudo completar la consulta.";

      setMessages((previous) => [
        ...previous,
        { role: "agent", content: message, isError: true },
      ]);
    },
  });

  const sendMessage = (data) => {
    const prompt = data.prompt.trim();
    if (
      !prompt ||
      chatMutation.isPending ||
      isLoadingConfigurations ||
      !agenteInfo.disponible
    ) {
      return;
    }

    setMessages((previous) => [...previous, { role: "user", content: prompt }]);
    chatMutation.mutate({ agenteType: agenteSeleccionado, prompt });
    reset({ agenteType: agenteSeleccionado, prompt: "" });
  };

  const selectSuggestion = (suggestion) => {
    setValue("prompt", suggestion);
    sendMessage({ prompt: suggestion });
  };

  return (
    <div className="-mx-5 -my-5 flex min-h-[min(74vh,720px)] flex-col bg-background sm:-mx-6 sm:-my-5">
      <input type="hidden" {...register("agenteType")} />

      <div className="border-b border-border/70 bg-muted/20 px-4 py-4 sm:px-5">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          <Sparkles className="size-4 text-primary" />
          Asistentes disponibles
        </div>
        <div className="grid gap-2">
          {agentes.map((agent) => {
            const Icon = agent.icono;
            const selected = agenteSeleccionado === agent.id;
            const lockedByBusiness =
              agent.id === "platos" &&
              !isRestaurant &&
              !isLoadingConfigurations;
            const lockedByRole =
              ((agent.id === "platos" && isRestaurant) ||
                agent.id === "pos") &&
              !agent.disponible &&
              !isLoadingConfigurations &&
              !lockedByBusiness;

            return (
              <button
                key={agent.id}
                type="button"
                disabled={
                  !agent.disponible ||
                  isLoadingConfigurations ||
                  chatMutation.isPending
                }
                onClick={() => {
                  setValue("agenteType", agent.id);
                  setMessages([]);
                }}
                aria-pressed={selected}
                title={
                  lockedByBusiness
                    ? "Disponible solo para empresas con tipo de venta Gastronomía"
                    : agent.nombre
                }
                className={`group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed ${
                  selected
                    ? "border-primary/40 bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:bg-accent/60"
                } ${!agent.disponible ? "opacity-55" : ""}`}
              >
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    {agent.nombre}
                    {lockedByBusiness && (
                      <LockKeyhole
                        aria-label="No disponible para este tipo de negocio"
                        className="size-3.5 text-muted-foreground"
                      />
                    )}
                    {lockedByRole && (
                      <LockKeyhole
                        aria-label="Tu usuario no tiene habilitado este módulo"
                        className="size-3.5 text-muted-foreground"
                      />
                    )}
                    {!agent.disponible && !lockedByBusiness && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        Proximamente
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                    {lockedByBusiness
                      ? "Requiere que el tipo de venta de la empresa sea Gastronomia."
                      : lockedByRole
                        ? "Tu usuario no tiene habilitado el modulo relacionado."
                        : agent.descripcion}
                  </span>
                </span>
                {selected && (
                  <span className="size-2 shrink-0 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-5 sm:px-5">
        {messages.length === 0 ? (
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center py-5 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15">
              <agenteInfo.icono className="size-8" strokeWidth={1.7} />
            </div>
            <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <Sparkles className="size-3.5" />
              Asistente inteligente
            </p>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Hola, en que te ayudo?
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Estas conversando con {agenteInfo.nombre}. Escribe una consulta o
              empieza con una de estas sugerencias.
            </p>

            {isLoadingConfigurations ? (
              <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Cargando opciones para tu negocio...
              </p>
            ) : sugerenciasActuales.length > 0 ? (
              <div className="mt-6 grid w-full gap-2 text-left">
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  PRUEBA PREGUNTANDO
                </p>
                {sugerenciasActuales.map((suggestion) => (
                  <Button
                    key={suggestion}
                    type="button"
                    variant="outline"
                    disabled={chatMutation.isPending}
                    onClick={() => selectSuggestion(suggestion)}
                    className="h-auto min-h-11 justify-start gap-2 whitespace-normal rounded-xl border-border bg-card px-3 py-2.5 text-left text-xs leading-relaxed text-foreground hover:border-primary/30 hover:bg-primary/5"
                  >
                    <MessageSquareText className="size-4 shrink-0 text-primary" />
                    {suggestion}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="mt-6 flex items-start gap-2 rounded-xl border border-border bg-muted/40 p-3 text-left text-xs leading-relaxed text-muted-foreground">
                <CircleHelp className="mt-0.5 size-4 shrink-0" />
                Este asistente aun no tiene sugerencias. Puedes escribir tu
                consulta directamente.
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
            {messages.map((message, index) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex items-end gap-2 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      {message.isError ? (
                        <CircleHelp className="size-4" />
                      ) : (
                        <agenteInfo.icono className="size-4" />
                      )}
                    </span>
                  )}
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isUser
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : message.isError
                          ? "rounded-bl-md border border-destructive/20 bg-destructive/5 text-foreground"
                          : "rounded-bl-md border border-border bg-card text-card-foreground shadow-sm"
                    }`}
                  >
                    {message.content}
                  </div>
                  {isUser && (
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                      <UserRound className="size-4" />
                    </span>
                  )}
                </div>
              );
            })}
            {chatMutation.isPending && (
              <div className="flex items-end gap-2">
                <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Bot className="size-4" />
                </span>
                <div
                  className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3 text-sm text-muted-foreground"
                  role="status"
                >
                  <Loader2 className="size-4 animate-spin" />
                  Preparando respuesta...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit(sendMessage)}
        className="shrink-0 border-t border-border/70 bg-background/95 p-3 backdrop-blur sm:p-4"
      >
        <div className="mx-auto flex w-full max-w-2xl items-center gap-2 rounded-2xl border border-border bg-card p-1.5 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-ring/40">
          <Input
            {...register("prompt")}
            type="text"
            autoComplete="off"
            disabled={
              chatMutation.isPending ||
              isLoadingConfigurations ||
              !agenteInfo.disponible
            }
            placeholder={`Escribe al ${agenteInfo.nombre}...`}
            className="h-10 min-w-0 border-0 bg-transparent shadow-none focus-visible:ring-0"
            aria-label={`Mensaje para ${agenteInfo.nombre}`}
          />
          <Button
            type="submit"
            size="icon"
            disabled={
              chatMutation.isPending ||
              isLoadingConfigurations ||
              !agenteInfo.disponible
            }
            aria-label="Enviar mensaje"
            className="size-10 shrink-0 rounded-xl"
          >
            {chatMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </div>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          Revisa las acciones sugeridas antes de confirmar cambios en tu sistema.
        </p>
      </form>
    </div>
  );
}
