import { capitalizeFirstLetter } from "../../../hooks/FirstLetterUp";
import { CardContent } from "@/components/ui/card";


export function ModalCuerpo({ selectedPedido }) {
  console.log("Pedido seleccionado en ModalCuerpo:", selectedPedido);
  return (
    <CardContent className="p-0">
      <ul className="m-3">
        {selectedPedido?.detalles_pedido?.length > 0 ? (
          <>
            {selectedPedido.detalles_pedido.map((detalle) => (
              <li
                key={detalle.id}
                className="relative border-b bg-background px-4 py-3 text-foreground flex items-center"
              >
                {/* Nombre y precio unitario alineados a la izquierda */}
                <div
                  className="flex flex-col mx-2 text-left"
                  style={{ flex: 2 }}
                >
                  <span>
                    {capitalizeFirstLetter(
                      detalle?.plato?.nombre ||
                        detalle?.promociones?.plato?.nombre,
                    )}
                  </span>
                  <small className="text-muted-foreground">
                    Precio Unit. S/{" "}
                    {parseFloat(
                      detalle?.plato?.precio ||
                        detalle?.promociones?.precio_promocional ||
                        0,
                    ).toFixed(2)}
                  </small>
                </div>

                {/* Cantidad centrada */}
                <div className="text-center" style={{ flex: 1 }}>
                  <p className="mb-0">{detalle?.cantidad}</p>
                </div>

                {/* Total alineado a la derecha */}
                <div className="text-right" style={{ flex: 1 }}>
                  <strong>S/{parseFloat(detalle?.precio).toFixed(2)}</strong>
                </div>
              </li>
            ))}

            {/* Calcular y mostrar el total general SIN MULTIPLICAR */}
            <li className="relative border-b bg-background px-4 text-foreground flex justify-between py-4">
              <strong className="ms-auto">
                TOTAL: S/
                {selectedPedido.detalles_pedido
                  .reduce(
                    (total, detalle) => total + parseFloat(detalle.precio),
                    0,
                  )
                  .toFixed(2)}
              </strong>
            </li>
          </>
        ) : (
          <li className="relative block border-b bg-background px-4 py-3 text-muted-foreground">
            No hay detalles disponibles
          </li>
        )}
      </ul>
    </CardContent>
  );
}
