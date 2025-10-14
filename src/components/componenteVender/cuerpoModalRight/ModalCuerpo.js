import { capitalizeFirstLetter } from "../../../hooks/FirstLetterUp";

export function ModalCuerpo({ selectedPedido }) {
  return (
    <div className="card-body h-100 p-0">
      <ul className=" m-3">
        {selectedPedido?.detalles_pedido?.length > 0 ? (
          <>
            {selectedPedido.detalles_pedido.map((detalle) => (
              <li
                key={detalle.id}
                className="list-group-item d-flex align-items-center"
              >
                {/* Nombre y precio unitario alineados a la izquierda */}
                <div
                  className="d-flex flex-column mx-2 text-start"
                  style={{ flex: 2 }}
                >
                  <span>{capitalizeFirstLetter(detalle?.plato?.nombre)}</span>
                  <small className="text-muted">
                    Precio Unit. S/
                    {parseFloat(detalle?.plato?.precio).toFixed(2)}
                  </small>
                </div>

                {/* Cantidad centrada */}
                <div className="text-center" style={{ flex: 1 }}>
                  <p className="mb-0">{detalle?.cantidad}</p>
                </div>

                {/* Total alineado a la derecha */}
                <div className="text-end" style={{ flex: 1 }}>
                  <strong>S/{parseFloat(detalle?.precio).toFixed(2)}</strong>
                </div>
              </li>
            ))}

            {/* Calcular y mostrar el total general SIN MULTIPLICAR */}
            <li className="list-group-item d-flex justify-content-between py-4">
              <strong className="ms-auto">
                TOTAL: S/
                {selectedPedido.detalles_pedido
                  .reduce(
                    (total, detalle) => total + parseFloat(detalle.precio),
                    0
                  )
                  .toFixed(2)}
              </strong>
            </li>
          </>
        ) : (
          <li className="list-group-item text-muted">
            No hay detalles disponibles
          </li>
        )}
      </ul>
    </div>
  );
}
