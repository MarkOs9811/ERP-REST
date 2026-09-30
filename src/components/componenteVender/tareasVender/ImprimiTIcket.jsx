export function ImprimirTicket({
  itemsCarrito,
  imprimirTicket,
  setImprimirTicket,
}) {
  return (
    <div>
      {itemsCarrito?.length > 0 && (
        <div
          className={`form-check form-switch d-flex align-items-center justify-content-center gap-2 mb-3 p-2 rounded transition-smooth ${
            !itemsCarrito ? "bg-light text-muted" : "border border-warning"
          }`}
          style={{
            backgroundColor: itemsCarrito
              ? "var(--bg-saffron-soft)"
              : "transparent",
          }}
        >
          <input
            id="switchImprimirTicket"
            className="form-check-input m-0"
            type="checkbox"
            role="switch"
            checked={imprimirTicket}
            onChange={(e) => setImprimirTicket(e.target.checked)}
            style={{ cursor: "pointer" }}
          />
          <label
            className={`form-check-label small m-0 ${itemsCarrito ? "text-dark fw-bold" : ""}`}
            htmlFor="switchImprimirTicket"
            style={{ cursor: "pointer" }}
          >
            Imprimir ticket para esta selección
          </label>
        </div>
      )}
    </div>
  );
}
