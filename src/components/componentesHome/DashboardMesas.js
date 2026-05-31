import { useQuery } from "@tanstack/react-query";
import { GetMesasVender } from "../../service/accionesVender/GetMesasVender";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";
import "../../css/EstilosHome.css";
import { Cookie } from "lucide-react";

export function DashboardMesas() {
  const {
    data: mesas,
    isLoading: loading,
    isError: error,
  } = useQuery({
    queryKey: ["mesas"],
    queryFn: GetMesasVender,
    refetchOnWindowFocus: true,
  });

  // FIX: Si tu API devuelve { data: [...] } lo extraemos.
  // Si ya es un array, lo tomamos directo. Si llega vacío o undefined, pasamos un [].
  const listaMesas = Array.isArray(mesas) ? mesas : mesas?.data || [];

  return (
    <div className="salon-container card m-0 h-100 overflow-auto">
      {/* --- CABECERA --- */}
      <div className="card-header bg-white border-bottom-0 p-2 mb-3 d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center">
        <div className="mb-lg-0 d-flex justify-content-center items-center">
          <div
            className="rounded-circle p-2 me-2"
            style={{
              color: "var(--fw-emerald)",
              background: "var(--bg-emerald-soft)",
            }}
          >
            <Cookie />
          </div>
          <h2 className="salon-title d-flex align-items-center m-0 gap-2">
            Salón de mesas ({listaMesas.length} Mesas)
          </h2>
        </div>

        {/* --- LEYENDA (Contadores) --- */}
        <div className="d-flex gap-2">
          <span className="status-badge badge-libre">
            <span className="dot dot-libre"></span> LIBRE (
            {listaMesas.filter((m) => m.estado === 1).length})
          </span>
          <span className="status-badge badge-ocupado">
            <span className="dot dot-ocupado"></span> OCUPADO (
            {listaMesas.filter((m) => m.estado === 0).length})
          </span>
          <span className="status-badge badge-reservado">
            <span className="dot dot-reservado"></span> RESERVADO
          </span>
        </div>
      </div>

      {/* --- GRID VISUAL --- */}
      <CondicionCarga isLoading={loading} isError={error} mode="cards">
        <div className="card-body px-4 pb-4 pt-0">
          {/* Si a pesar del fix listaMesas sigue vacío, mostramos este aviso para debuggear */}
          {listaMesas.length === 0 && !loading && (
            <div className="alert alert-warning text-center">
              No se encontraron mesas o el formato de la API no es un Array.
            </div>
          )}

          <div className="row g-3">
            {listaMesas.map((mesa) => {
              // 1 = Libre, 0 = Ocupado
              const isLibre = mesa.estado === 1;
              const statusClass = isLibre ? "libre" : "ocupado";

              return (
                <div className="col-12 col-md-6 col-lg-3" key={mesa.id}>
                  <div
                    className={`card p-3 mesa-card-flat card-${statusClass} w-100 text-start h-100`}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-3 w-100">
                      <span className="mesa-capacidad-flat small text-muted">
                        CAPACIDAD: {mesa.capacidad}p
                      </span>
                      <span className={`dot dot-${statusClass}`}></span>
                    </div>

                    <h4 className="mesa-numero-flat">Mesa {mesa.numero}</h4>

                    <div className="mesa-footer-flat mt-4 w-100">
                      {!isLibre ? (
                        <div className="d-flex flex-column">
                          <span className="consumo-label">
                            Consumo comanda:
                          </span>
                          <span className="consumo-monto">
                            S/ {mesa.consumo ? mesa.consumo : "0.00"}
                          </span>
                        </div>
                      ) : (
                        // Bloque vacío para mantener la estructura de la tarjeta sin textos
                        <div style={{ minHeight: "42px" }}></div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CondicionCarga>
    </div>
  );
}
