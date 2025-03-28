import { CartOutline } from "react-ionicons";
import "../../css/CarritoCompras.css";
import { useSelector } from "react-redux";

export default function CarritoComprasWsp({ cantidad, onOpenModal }) {
  const pedidosWeb = useSelector((state) => state.pedidoWeb.items);
  const totalPlatos = pedidosWeb.length; // Cantidad de platos únicos en el pedido

  return (
    <div className="carrito-container btn border-0" onClick={onOpenModal}>
      {/* Reflejo agregado sin alterar nada más */}
      <div className="carrito-reflejo"></div>

      <div className="relative">
        {/* Icono del carrito con shake condicional */}
        <CartOutline
          className="carrito-icon"
          shake={totalPlatos > 0} // Se activa solo si hay platos en el pedido
          height="auto"
          width="auto"
          color="#fff"
        />

        {/* Contador de pedidos */}
        <span className="carrito-contador">{cantidad}</span>
      </div>
    </div>
  );
}
