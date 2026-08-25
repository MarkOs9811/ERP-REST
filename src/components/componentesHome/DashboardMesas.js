import { useQuery } from "@tanstack/react-query";
import { GetMesasVender } from "../../service/accionesVender/GetMesasVender";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";
import "../../css/EstilosHome.css";
import { Clock, Cookie, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
    queryKey: ["mesas"],
    queryFn: GetMesasVender,
    refetchOnWindowFocus: true,
  });

  const navigate = useNavigate();
  // FIX: Si tu API devuelve { data: [...] } lo extraemos.
  // Si ya es un array, lo tomamos directo. Si llega vacío o undefined, pasamos un [].
  const listaMesas = Array.isArray(mesas) ? mesas : mesas?.data || [];

  return (
    <div className="salon-container card m-0 h-100 overflow-auto p-2">
      {/* --- CABECERA --- */}
      <div className="card-header bg-white border-bottom-0 p-2 mb-3 d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center">
        <div className="d-flex align-items-center  justify-content-center ">
          <span
            className="rounded-circle p-2 me-2"
            style={{
              background: "var(--bg-emerald-soft)",
              color: "var(--fw-emerald)",
            }}
          >
            <Cookie size={24} />
          </span>
          <h5 className="d-flex fw-bold align-items-center m-0 gap-2">
            Salón de mesas ({listaMesas.length} Mesas)
            {listaMesas.length === 0 ? (
              <button
                onClick={() => navigate("/ventas/mesas")}
                className="btn-principal "
              >
                <Plus /> Crear Mesas
              </button>
            ) : (
              <button
                onClick={() => navigate("/ventas/mesas")}
                className="btn-principal"
              >
                <Plus /> Gestionar Mesas
              </button>
            )}
          </h5>
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
        <div className="card-body ">
          {/* Si a pesar del fix listaMesas sigue vacío, mostramos este aviso para debuggear */}
          {listaMesas.length === 0 && !loading && (
            <div className="alert alert-warning text-center d-flex flex-column align-items-center justify-content-center">
              <span className="mb-2">No se encontraron mesas.</span>
              {/* Corregimos el 'to' y agregamos clases de botón */}
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
                      {mesa.estado === 0 && (
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
