import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addItem, clearPedidoWeb } from "../../redux/pedidoWebSlice";
import { setEstado } from "../../redux/tipoVentaSlice";

export const useProcesarPagoWeb = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const procesarPago = (pedido) => {
    try {
      console.log("🚀 Iniciando servicio de pago para pedido:", pedido?.id);

      // 1. Validación de datos
      const detalles = pedido?.detalles_pedido;

      if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
        console.warn(
          "⚠️ El pedido no tiene detalles o el formato es incorrecto.",
        );
        return false;
      }

      // 2. Limpiar carrito previo (CRUCIAL para evitar duplicados)
      dispatch(clearPedidoWeb());

      // 3. Agregar al carrito
      detalles.forEach((item) => {
        // Validación defensiva
        if (!item.plato && !item.nombre) return;

        const itemToAdd = {
          id: item.plato?.id || item.idPlato,
          nombre: item.plato?.nombre || "Plato sin nombre",
          precio: parseFloat(item.precio),
          cantidad: parseInt(item.cantidad),
          subtotal: parseFloat(item.precio) * parseInt(item.cantidad),
        };

        dispatch(addItem(itemToAdd));
      });

      // 4. Configurar estado y Navegar
      dispatch(setEstado("web"));

      navigate(`/vender/mesas/detallesPago/${pedido.id}`);

      return true; // Retorna éxito
    } catch (error) {
      console.error("❌ Error en useProcesarPagoWeb:", error);
      return false;
    }
  };

  return { procesarPago };
};
