import { useQuery } from "@tanstack/react-query";
import { GetMesasVender } from "../../service/accionesVender/GetMesasVender";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";
import "../../css/EstilosHome.css";
import { Clock, Cookie, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
const TiempoOcupacion = ({ fechaApertura }) => {
  const [minutos, setMinutos] = useState(0);

  useEffect(() => {
    if (!fechaApertura) return;

    const calcularTiempo = () => {
      const fechaParseada = new Date(fechaApertura);
      const ahora = new Date();
      const diferenciaMs = ahora - fechaParseada;
      const diffMinutos = Math.floor(diferenciaMs / 60000);

      setMinutos(diffMinutos > 0 ? diffMinutos : 0);
    };

    calcularTiempo();
    const intervalo = setInterval(calcularTiempo, 60000);

    return () => clearInterval(intervalo);
  }, [fechaApertura]);

  const esDemorado = minutos >= 60;

  return (
    <span
      className={`small d-flex align-items-center gap-1 fw-bold ${
        esDemorado ? "text-danger" : "text-muted"
      }`}
    >
      <Clock size={13} /> {minutos} min
    </span>
  );
};
export function DashboardMesas() {
  const {
    data: mesas,
    isLoading: loading,
    isError: error,
  } = useQuery({
    queryKey: ["mesasVender"],
    queryFn: GetMesasVender,
    refetchOnWindowFocus: true,
  });

  const navigate = useNavigate();
  // FIX: Si tu API devuelve { data: [...] } lo extraemos.
  // Si ya es un array, lo tomamos directo. Si llega vacío o undefined, pasamos un [].
  const listaMesas = Array.isArray(mesas) ? mesas : mesas?.data || [];

  return (
    <div className="salon-container card m-0 h-100 p-3">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-3">
        <div className="d-flex align-items-center gap-2">
          <span
            className="rounded-circle p-2"
            style={{
              background: "var(--bg-emerald-soft)",
              color: "var(--fw-emerald)",
            }}
          >
            <Cookie size={22} />
          </span>
          <div>
            <h5 className="fw-bold mb-0">Salón de mesas</h5>
            <small className="text-muted">{listaMesas.length} mesas</small>
          </div>
          <button
            type="button"
            onClick={() => navigate("/ventas/mesas")}
            className="btn-principal ms-2"
          >
            <Plus size={16} />{" "}
            {listaMesas.length === 0 ? "Crear Mesas" : "Gestionar Mesas"}
          </button>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <span className="status-badge badge-libre">
            <span className="dot dot-libre"></span> LIBRE (
            {listaMesas.filter((m) => Number(m.estado) === 1).length})
          </span>
          <span className="status-badge badge-ocupado">
            <span className="dot dot-ocupado"></span> OCUPADO (
            {listaMesas.filter((m) => Number(m.estado) === 0).length})
          </span>
          <span className="status-badge badge-reservado">
            <span className="dot dot-reservado"></span> RESERVADO
          </span>
        </div>
      </div>

      {/* --- GRID VISUAL --- */}
      <CondicionCarga isLoading={loading} isError={error} mode="cards">
        <div className="card-body p-0 home-salon-grid">
          {listaMesas.length === 0 && !loading && (
            <div className="alert alert-warning text-center mb-0">
              No se encontraron mesas.
            </div>
          )}

          <div className="row g-3">
            {listaMesas.map((mesa) => {
              const isLibre = Number(mesa.estado) === 1;
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
                      {Number(mesa.estado) === 0 && (
                        <div className="mesa-total-preview mt-2 d-flex flex-column gap-1">
                          <div className="d-flex justify-content-between align-items-center">
                            <span
                              className="text-muted small"
                              style={{
                                fontSize: "0.65rem",
                                fontWeight: "700",
                                letterSpacing: "0.5px",
                              }}
                            >
                              TOTAL ACTUAL
                            </span>
                            {mesa.tiempo_apertura && (
                              <TiempoOcupacion
                                fechaApertura={mesa.tiempo_apertura}
                              />
                            )}
                          </div>
                          <span className="fw-bold fs-6">
                            S/ {Number(mesa.total || 0).toFixed(2)}
                          </span>
                        </div>
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
