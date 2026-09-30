import { PrinterCheck } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";

export function BotonImprimirComanda({ dataPedido }) {
  // Definimos la mutación con React Query
  const imprimirMutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post(
        "/vender/imprimirCocina",
        payload,
      );
      return data;
    },
    onSuccess: (response) => {
      ToastAlert("success", "Comanda enviada a cocina correctamente");
    },
    onError: (error) => {
      console.error(
        "Error al imprimir comanda:",
        error?.response?.data?.message || error.message,
      );
      ToastAlert(
        "error",
        "Hubo un error al enviar a cocina: " +
          (error?.response?.data?.message || error.message),
      );
    },
  });

  const handleImprimir = () => {
    if (!dataPedido) return;

    // 1. Extraemos la mesa de forma inteligente según el tipo de pedido
    // Si es para llevar, usamos el nombre del cliente o "Llevar #ID", si es mesa el número.
    let mesaIdentificador = "Mesa Desconocida";
    if (dataPedido.tipo_pedido === "llevar") {
      mesaIdentificador = `Llevar: ${dataPedido.detalle_cliente || dataPedido.idPedidoLLevar || "General"}`;
    } else {
      mesaIdentificador = dataPedido.numeroMesa
        ? `Mesa ${dataPedido.numeroMesa}`
        : `Pedido #${dataPedido.id}`;
    }

    // 2. Extraemos y formateamos los productos del objeto anidado (pedido_llevar -> detalle_pedidos)
    // O si viniera plano en detalle_platos, lo manejamos con respaldo.
    let productosFormateados = [];

    if (dataPedido.pedido_llevar?.detalle_pedidos) {
      productosFormateados = dataPedido.pedido_llevar.detalle_pedidos.map(
        (item) => ({
          nombre: item.producto?.nombre || "Producto",
          cantidad: item.cantidad || 1,
          precio: item.precio_unitario || "0.00",
        }),
      );
    } else if (dataPedido.detalle_platos) {
      // Por si viene como string JSON en otra estructura
      try {
        productosFormateados =
          typeof dataPedido.detalle_platos === "string"
            ? JSON.parse(dataPedido.detalle_platos)
            : dataPedido.detalle_platos;
      } catch (e) {
        productosFormateados = [];
      }
    }

    // 3. Armamos el payload exacto que tu backend valida (requiere 'mesa' y 'productos')
    const payload = {
      mesa: mesaIdentificador,
      productos: productosFormateados,
      usuario: "Sistema", // O el usuario logueado si lo tienes a la mano
      nota: dataPedido.detalles_extras || "",
    };

    // Disparamos la mutación
    imprimirMutation.mutate(payload);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleImprimir}
        disabled={imprimirMutation.isPending}
        className="btn-icon border d-flex align-items-center justify-content-center text-muted rounded-pill px-3"
        title="Reimprimir"
        style={{
          cursor: imprimirMutation.isPending ? "not-allowed" : "pointer",
        }}
      >
        <PrinterCheck
          size={16}
          className={
            imprimirMutation.isPending ? "spinner-border spinner-border-sm" : ""
          }
        />
      </button>
    </div>
  );
}
