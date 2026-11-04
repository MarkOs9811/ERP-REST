import { useState } from "react";
import {
  Clock,
  Printer,
  CheckCircle,
  ListOrderedIcon,
  Search,
  AlertCircle,
  User,
  XCircle,
  LoaderCircle,
  X,
} from "lucide-react";
import { BadgeComponent } from "../../componentesReutilizables/BadgeComponent";
import { obtenerTiempoRelativo } from "../../../utils/formatoFechas";
import { BotonImprimirComanda } from "./BotonImprimirComanda";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";
import { Button } from "../../ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog as DialogPrimitive } from "radix-ui";


export function OffcanvasColaLlevar({
  pedidosCola = [],
  open,
  onOpenChange,
}) {
  const queryCliente = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTab, setFiltroTab] = useState("todos"); // "todos" | "pendientes" | "entregados"

  const pedidosFiltrados = pedidosCola.filter((pedido) => {
    // 1. Filtrado por pestañas (estado)
    if (filtroTab === "pendientes" && pedido.estado !== 0) return false;
    if (filtroTab === "entregados" && pedido.estado !== 1) return false;

    // 2. Filtrado por texto de búsqueda (código o cliente)
    const termino = searchTerm.toLowerCase();
    const codigo = `ped-${pedido.idPedidoLLevar || pedido.id}`.toLowerCase();
    const clienteStr =
      typeof pedido.detalle_cliente === "string"
        ? pedido.detalle_cliente
        : "Cliente Genérico";

    return (
      codigo.includes(termino) || clienteStr.toLowerCase().includes(termino)
    );
  });

  // FUNCIÓN AYUDANTE: Centraliza la lógica de los estados
  const obtenerConfigEstado = (estado) => {
    switch (estado) {
      case 0:
        return (
          <BadgeComponent label="Pendiente" className="px-2" />
        );

      case 2:
        return (
          <BadgeComponent
            label="En Proceso"
            className="px-2"
          />
        );

      case 1:
        return (
          <BadgeComponent label="Listo" className="px-2" />
        );

      default:
        return (
          <BadgeComponent
            label="Desconocido"
            className="px-2"
          />
        );
    }
  };
  const [pedidoProcesando, setPedidoProcesando] = useState(null);
  const cambiarEstado = useMutation({
    mutationFn: async ({ idPedido }) => {
      const { data } = await axiosInstance.put(`/pedidoCocina/${idPedido}`);
      return data;
    },
    onSuccess: () => {
      ToastAlert("success", "Estado del pedido actualizado correctamente");
      queryCliente.invalidateQueries({ queryKey: ["pedidosEstado"] });
    },
    onError: (error) => {
      ToastAlert(
        "error",
        "Error al actualizar el estado del pedido: " +
          (error?.response?.data?.message || error.message),
      );
    },
  });

  const handleCambiarEstadoPedido = (idPedido) => {
    setPedidoProcesando(idPedido);
    cambiarEstado.mutate(
      { idPedido },
      {
        onSettled: () => {
          setPedidoProcesando(null);
        },
      },
    );
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          id="offcanvasColaLlevar"
          className="fixed inset-y-0 right-0 z-50 flex h-full w-[min(420px,100vw)] flex-col border-l bg-background shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right"
        >
      <div className="flex flex-col items-start gap-3 border-b p-4">
        <div className="flex justify-between items-center w-full">
          <DialogPrimitive.Title
            className="m-0 flex items-center gap-2 font-bold"
            style={{ color: "var(--brand-primary)" }}
          >
            Pedidos en Cola
          </DialogPrimitive.Title>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Cerrar pedidos en cola"
            onClick={() => onOpenChange(false)}
          >
            <X />
          </Button>
        </div>

        {/* PESTAÑAS DE FILTRO (Por entregar / Entregados / Todos) */}
        <div className="w-full flex gap-1 p-1 bg-muted rounded-full border">
          <Button
            type="button"
            className={`flex-1 bg-primary text-primary-foreground shadow hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 text-xs rounded-full font-semibold py-1 transition-all ${
              filtroTab === "todos"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground border-0 bg-transparent"
            }`}
            onClick={() => setFiltroTab("todos")}
            style={{ fontSize: "0.85rem" }}
           variant="default">
            Todos
          </Button>
          <Button
            type="button"
            className={`flex-1 bg-primary text-primary-foreground shadow hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 text-xs rounded-full font-semibold py-1 transition-all ${
              filtroTab === "pendientes"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground border-0 bg-transparent"
            }`}
            onClick={() => setFiltroTab("pendientes")}
            style={{ fontSize: "0.85rem" }}
           variant="default">
            Por entregar
          </Button>
          <Button
            type="button"
            className={`flex-1 bg-primary text-primary-foreground shadow hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 text-xs rounded-full font-semibold py-1 transition-all ${
              filtroTab === "entregados"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground border-0 bg-transparent"
            }`}
            onClick={() => setFiltroTab("entregados")}
            style={{ fontSize: "0.85rem" }}
           variant="default">
            Entregados
          </Button>
        </div>

        <div className="relative w-full mt-1">
          <input
            type="text"
            className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 shadow-none border"
            placeholder="Buscar por código (PED-123) o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              paddingRight: "38px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "#f9fbfc",
              transition: "var(--transition-smooth)",
            }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 text-muted-foreground flex items-center"
            style={{ right: "12px", pointerEvents: "none" }}
          >
            <Search size={16} />
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto bg-background p-3">
        {pedidosFiltrados.length === 0 ? (
          <div className="text-center text-muted-foreground mt-5 opacity-50">
            <AlertCircle size={40} className="mb-2" />
            <p>No se encontraron pedidos en cola.</p>
          </div>
        ) : (
          pedidosFiltrados.map((pedido) => {
            const items = pedido.pedido_llevar?.detalle_pedidos || [];

            const totalPedido = items.reduce((suma, item) => {
              return suma + item.cantidad * Number(item.precio_unitario);
            }, 0);

            // Usamos la función para obtener el color y texto exacto
            const configEstado = obtenerConfigEstado(pedido.estado);

            return (
              <Card
                key={`cola-${pedido.id}`}
                className="mb-3"
                style={{
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h6 className="font-bold mb-1 text-foreground">
                        PED-{pedido.idPedidoLLevar || pedido.id}
                      </h6>
                      <small
                        className="text-muted-foreground flex items-center gap-1 mb-1"
                        style={{ fontSize: "0.8rem" }}
                      >
                        <User size={12} />{" "}
                        {pedido.detalle_cliente || "Cliente Genérico"}
                      </small>
                      <small
                        className="flex items-center gap-1 text-foreground opacity-50"
                        style={{ fontSize: "0.8rem" }}
                      >
                        <Clock size={12} />{" "}
                        {obtenerTiempoRelativo(pedido.created_at)}
                      </small>
                    </div>
                    <div>{configEstado}</div>
                  </div>

                  <div className="text-sm mb-3 text-foreground border-t pt-2 mt-2">
                    {items.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between gap-2 mb-1"
                      >
                        <div>
                          <span className="font-bold text-muted-foreground me-2">
                            {item.cantidad}x
                          </span>
                          <span>{item.producto?.nombre || "Plato"}</span>
                        </div>
                        <span
                          className="text-muted-foreground"
                          style={{ fontSize: "0.75rem" }}
                        >
                          S/.{" "}
                          {Number(item.cantidad * item.precio_unitario).toFixed(
                            2,
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-2 border-t">
                    <div className="flex gap-2">
                      <BotonImprimirComanda dataPedido={pedido} />

                      {pedido.estado === 0 || pedido.estado === 1 ? (
                        <Button
                          key={`btn-estado-${pedido.id}`}
                          type="button"
                          className={`flex items-center gap-1 rounded-full px-3 font-bold ${
                            pedido.estado === 0 ? "btn-editar" : "btn-generico"
                          }${
                            pedidoProcesando === pedido.id
                              ? "disabled cursor-not-allowed"
                              : ""
                          }`}
                          disabled={pedidoProcesando === pedido.id}
                          onClick={() => handleCambiarEstadoPedido(pedido.id)}
                         variant="secondary">
                          {pedidoProcesando === pedido.id ? (
                            <LoaderCircle size={16} className="animate-spin" />
                          ) : pedido.estado === 0 ? (
                            <CheckCircle size={16} />
                          ) : (
                            <XCircle size={16} />
                          )}

                          {pedidoProcesando === pedido.id
                            ? "Procesando..."
                            : pedido.estado === 0
                              ? "Entregar"
                              : "Reabrir"}
                        </Button>
                      ) : null}
                    </div>
                    <span className="font-bold text-base text-foreground">
                      S/. {totalPedido.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
