import {
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { GetPedidosCocina } from "../../service/accionesVender/GetPedidosCocina";
import { useEffect, useMemo, useState } from "react";
import BotonAnimado from "../../components/componentesReutilizables/BotonAnimado";
import {
  CheckCheck,
  PrinterIcon,
  RotateCcw,
  Timer,
  FlameIcon,
  CheckCheckIcon,
} from "lucide-react";
import { PutData } from "../../service/CRUD/PutData";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";
import { BadgeComponent } from "../../components/componentesReutilizables/BadgeComponent";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import axiosInstance from "../../api/AxiosInstance";
import echoEvents from "../../api/echoEvents";


import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const estados = {
  0: { texto: "En espera", variant: "warning" },
  2: { texto: "En preparación", variant: "secondary" },
  1: { texto: "Listo", variant: "success" },
};

const generarCodigoReal = (pedido) => {
  if (pedido.tipo_pedido === "mesa" && pedido.idPedidoMesa)
    return `PED-${pedido.idPedidoMesa}`;
  if (
    pedido.tipo_pedido === "llevar" &&
    (pedido.idPedidoLlevar || pedido.idPedidoLLevar)
  )
    return `LL-${pedido.idPedidoLlevar || pedido.idPedidoLLevar}`;
  if (pedido.tipo_pedido === "web" && pedido.idPedidoWsp)
    return `WSP-${pedido.idPedidoWsp}`;
  return `#${pedido.id}`;
};

function TarjetaPedido({ pedido }) {
  const queryClient = useQueryClient();

  // 1. ESCUDO GLOBAL: Cuenta si alguna tarjeta en toda la pantalla está cambiando de estado
  const mutacionesCambiandoEstado = useIsMutating({
    mutationKey: ["cambiarEstadoCocina"],
  });

  const esListo = pedido.estado === 1;
  const esEnPreparacion = pedido.estado === 2;

  const mutationCambiarEstado = useMutation({
    mutationKey: ["cambiarEstadoCocina"], // 🔥 Le asignamos una llave para identificar esta acción
    mutationFn: async (nuevoEstado) => {
      const success = await PutData("pedidoCocina", pedido.id, {
        estado: nuevoEstado,
      });
      if (!success) throw new Error("Error al actualizar");
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pedidosEstado"]);
    },
  });

  const cambiarEstado = () => {
    //  2. BLOQUEO MULTI-TARJETA: Si hay alguna otra tarjeta cargando, se anula el clic
    if (mutacionesCambiandoEstado > 0 || mutationCambiarEstado.isPending)
      return;

    const nuevoEstado = pedido.estado === 0 ? 2 : pedido.estado === 2 ? 1 : 0;
    mutationCambiarEstado.mutate(nuevoEstado);
  };

  const platos = useMemo(() => {
    try {
      return JSON.parse(pedido.detalle_platos);
    } catch {
      return [];
    }
  }, [pedido.detalle_platos]);

  // MUTACIÓN PARA IMPRIMIR
  const mutationImprimir = useMutation({
    mutationKey: ["imprimirCocina"],
    mutationFn: async (payload) => {
      return (await axiosInstance.post("/vender/imprimirCocina", payload)).data;
    },
    onSuccess: (data) => {
      if (data.success) {
        ToastAlert("success", `Pedido enviado a impresión.`);
      } else {
        ToastAlert("error", data.message || "No se pudo imprimir el pedido.");
      }
    },
    onError: (error) => {
      ToastAlert(
        "error",
        error.response?.data?.message || "Error de conexión.",
      );
    },
  });

  const handleImprimirPedidoCocina = (e) => {
    e.stopPropagation();

    // Bloqueo de impresora
    if (mutationImprimir.isPending) return;

    if (!platos || platos.length === 0) {
      return ToastAlert("error", "No hay platos para imprimir en este pedido.");
    }

    const contenidoFormateado = platos.map((item) => {
      const cantidad = Number(item.cantidad ?? 1);
      const precio = Number(item.precio ?? 0);
      return {
        nombre: item.nombre || "Plato desconocido",
        cantidad,
        precio,
        subtotal: cantidad * precio,
      };
    });

    const payload = {
      mesa:
        pedido.tipo_pedido === "mesa"
          ? `Mesa ${pedido.numeroMesa}`
          : generarCodigoReal(pedido),
      fecha: new Date().toLocaleString("es-PE"),
      usuario: "Cajero",
      productos: contenidoFormateado,
      nota: pedido.detalles_extras || "",
    };

    mutationImprimir.mutate(payload);
  };

  const tipoPedidoInfo = {
    mesa: {
      titulo: `MESA ${pedido?.numeroMesa ?? "?"}`,
      colorPunto: "bg-rose-500",
    },
    llevar: { titulo: "LLEVAR", colorPunto: "bg-emerald-500" },
    web: { titulo: "DELIVERY", colorPunto: "bg-sky-500" },
  };

  const { titulo, colorPunto } = tipoPedidoInfo[pedido.tipo_pedido] ?? {
    titulo: "SIN TIPO",
    colorPunto: "bg-muted-foreground",
  };

  // 🔥 3. Variable que desactiva el botón visualmente si esta u otra tarjeta está procesando
  const botonBloqueadoGlobal = mutacionesCambiandoEstado > 0;

  return (
    <Card
      className={`mb-0 overflow-hidden rounded-xl border-border/70 bg-card py-0 shadow-none ${
        esListo ? "opacity-80" : ""
      }`}
    >
      <CardHeader
        className={`flex items-center justify-between gap-2 border-b px-3 py-2 ${
          esListo
            ? "bg-emerald-500/5"
            : esEnPreparacion
              ? "bg-sky-500/5"
              : "bg-amber-500/5"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex shrink-0 items-center rounded-md border border-border/70 bg-background px-2 py-1 text-[11px] font-semibold text-foreground">
            {generarCodigoReal(pedido)}
          </span>
          <span className="flex min-w-0 items-center gap-1.5 truncate text-xs font-medium text-muted-foreground">
            <span className={`size-1.5 shrink-0 rounded-full ${colorPunto}`} />
            {titulo}
          </span>
        </div>
        <BadgeComponent
          className="px-2"
          variant={estados[pedido.estado]?.variant}
          label={estados[pedido.estado]?.texto}
        />
      </CardHeader>

      <CardContent className="p-0 py-2">
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {platos.map((plato, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 px-3 py-1 text-sm text-foreground"
            >
              <span className="mt-0.5 inline-flex min-w-6 items-center justify-center rounded-md bg-muted px-1.5 py-0.5 text-xs font-semibold tabular-nums text-muted-foreground">
                {plato.cantidad}
              </span>
              <span className={`min-w-0 flex-1 font-medium ${esListo ? "line-through text-muted-foreground" : ""}`}>
                {plato.nombre}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="flex items-center gap-2 border-t border-border/60 bg-transparent px-3 py-2.5">
        <Button
          className="size-8"
          size="icon"
          title="Imprimir Ticket"
          onClick={handleImprimirPedidoCocina}
          disabled={mutationImprimir.isPending}
          variant="outline"
        >
          {mutationImprimir.isPending ? (
            <div
              className="inline-block animate-spin rounded-full border-current border-r-transparent size-4 border"
              role="status"
            ></div>
          ) : (
            <PrinterIcon className="size-4" />
          )}
        </Button>

        <BotonAnimado
          className="ml-auto h-8 rounded-lg px-3 text-xs font-medium"
          onClick={cambiarEstado}
          loading={mutationCambiarEstado.isPending} // El spinner solo gira en la tarjeta cliqueada
          disabled={botonBloqueadoGlobal} // 🔥 Todas las demás tarjetas se bloquean y oscurecen un segundo
          icon={
            pedido.estado === 0 ? (
              <CheckCheck size={18} />
            ) : pedido.estado === 2 ? (
              <CheckCheck size={18} />
            ) : (
              <RotateCcw size={16} />
            )
          }
        >
          {pedido.estado === 0
            ? "Mover a preparar"
            : pedido.estado === 2
              ? "Marcar Listo"
              : "Reabrir"}
        </BotonAnimado>
      </CardFooter>
    </Card>
  );
}

export function CocinaDespacho() {
  const queryClient = useQueryClient();
  const {
    data: pedidos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pedidosEstado"],
    queryFn: GetPedidosCocina,
    retry: 0, //  Apagamos el retry local porque Axios ya lo maneja
    refetchOnWindowFocus: false,
    staleTime: 2000, //  Espera 2 segundos antes de permitir otra recarga masiva por WebSockets
  });

  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  const filtroOpciones = [
    { label: "Todos", value: "Todos" },
    { label: "Mesa", value: "mesa" },
    { label: "Llevar", value: "llevar" },
    { label: "Delivery", value: "web" },
  ];

  const pedidosFiltrados = useMemo(() => {
    let result = pedidos;
    if (filtroTipo !== "Todos") {
      result = result.filter((pedido) => pedido.tipo_pedido === filtroTipo);
    }
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((pedido) => {
        const codigo = generarCodigoReal(pedido).toLowerCase();
        const textoMesa = pedido.numeroMesa
          ? `mesa ${pedido.numeroMesa}`.toLowerCase()
          : "";
        return codigo.includes(term) || textoMesa.includes(term);
      });
    }
    return result;
  }, [pedidos, filtroTipo, searchTerm]);

  const pedidosEnEspera = pedidosFiltrados.filter((p) => p.estado === 0);
  const pedidosEnPreparacion = pedidosFiltrados.filter((p) => p.estado === 2);
  const pedidosListos = pedidosFiltrados.filter((p) => p.estado === 1);
  const columnas = [
    {
      id: "espera",
      titulo: "En espera",
      descripcion: "Pedidos nuevos",
      pedidos: pedidosEnEspera,
      icono: Timer,
      iconClass: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
      countClass: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    },
    {
      id: "preparacion",
      titulo: "En preparación",
      descripcion: "Cocinando ahora",
      pedidos: pedidosEnPreparacion,
      icono: FlameIcon,
      iconClass: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
      countClass: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
    },
    {
      id: "listos",
      titulo: "Listos",
      descripcion: "Para despacho",
      pedidos: pedidosListos,
      icono: CheckCheckIcon,
      iconClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      countClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    },
  ];

  useEffect(() => {
    const canalCocina = echoEvents.channel("pedidosEstado");
    canalCocina.listen(".pedidosEstado.creado", () => {
      queryClient.invalidateQueries(["pedidosEstado"]);
    });
    return () => echoEvents.leaveChannel("pedidosEstado");
  }, [queryClient]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <CondicionCarga isLoading={isLoading} isError={isError}>
        <div className="flex h-full min-h-0 flex-col gap-3 p-1">
          <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-1 overflow-x-auto">
              {filtroOpciones.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  size="sm"
                  className="h-8 shrink-0 rounded-lg"
                  onClick={() => setFiltroTipo(option.value)}
                  variant={filtroTipo === option.value ? "default" : "ghost"}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <div className="flex min-w-0 items-center gap-3">
              <span className="shrink-0 text-xs text-muted-foreground">
                {pedidosFiltrados.length} pedidos
              </span>
              <Input
                type="search"
                className="h-9 w-full sm:w-64"
                placeholder="Buscar pedido o mesa..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                aria-label="Buscar pedido por código o mesa"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden pb-1">
            <div className="grid h-full min-w-[900px] grid-cols-3 gap-3">
              {columnas.map((columna) => {
                const Icon = columna.icono;
                return (
                  <Card
                    key={columna.id}
                    className="flex min-h-0 min-w-0 flex-col gap-0 overflow-hidden rounded-xl border-border/70 bg-muted/30 p-0 shadow-none"
                  >
                    <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-border/70 bg-card px-3 py-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span
                          className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${columna.iconClass}`}
                        >
                          <Icon className="size-[18px]" />
                        </span>
                        <div className="min-w-0">
                          <h2 className="mb-0 truncate text-sm font-semibold tracking-tight text-foreground">
                            {columna.titulo}
                          </h2>
                          <p className="mb-0 text-xs text-muted-foreground">
                            {columna.descripcion}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex min-w-7 items-center justify-center rounded-full px-2 py-1 text-xs font-semibold tabular-nums ${columna.countClass}`}
                      >
                        {columna.pedidos.length > 0 && (
                          <span
                            className={`mr-1.5 size-1.5 rounded-full ${
                              columna.id === "espera"
                                ? "animate-pulse bg-amber-500"
                                : columna.id === "preparacion"
                                  ? "bg-sky-500"
                                  : "bg-emerald-500"
                            }`}
                          />
                        )}
                        {columna.pedidos.length}
                      </span>
                    </CardHeader>
                    <CardContent className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2">
                      {columna.pedidos.length ? (
                        columna.pedidos.map((pedido, index) => (
                          <TarjetaPedido
                            key={`${columna.id}-${pedido.id}-${index}`}
                            pedido={pedido}
                          />
                        ))
                      ) : (
                        <div className="flex min-h-32 flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-border/70 bg-background/60 px-3 py-6 text-center">
                          <CheckCheck className="mb-2 size-5 text-muted-foreground/60" />
                          <p className="mb-0 text-xs text-muted-foreground">
                            {searchTerm || filtroTipo !== "Todos"
                              ? "Sin pedidos para estos filtros"
                              : "No hay pedidos en esta etapa"}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </CondicionCarga>
    </div>
  );
}
