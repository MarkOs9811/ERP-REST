export function ImprimirTicket({
  itemsCarrito,
  imprimirTicket,
  setImprimirTicket,
}) {
  return (
    <div>
      {itemsCarrito?.length > 0 && (
        <div
          className={`flex items-center justify-center gap-2 mb-3 p-2 rounded transition-smooth ${
            !itemsCarrito ? "bg-muted text-muted-foreground" : "border border-amber-500"
          }`}
          style={{
            backgroundColor: itemsCarrito
              ? "var(--bg-saffron-soft)"
              : "transparent",
          }}
        >
          <input
            id="switchImprimirTicket"
            className="size-4 shrink-0 rounded border-input accent-primary m-0"
            type="checkbox"
            role="switch"
            checked={imprimirTicket}
            onChange={(e) => setImprimirTicket(e.target.checked)}
            style={{ cursor: "pointer" }}
          />
          <label
            className={`font-medium text-sm m-0 ${itemsCarrito ? "text-foreground font-bold" : ""}`}
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
