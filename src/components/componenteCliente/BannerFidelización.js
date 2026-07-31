import { StarHalfIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BannerFidelizacion({
  botonAction,
  modalAddCampaña = false,
  setModalAddCampaña = null,
}) {
  const navigate = useNavigate();

  return (
    <div className="fw-promo-card">
      <div className="mb-3">
        <span className="fw-badge fw-badge-strawberry">
          <StarHalfIcon size={14} /> Fidelización
        </span>
      </div>

      <h2 className="fw-promo-title">Programa de beneficios</h2>

      <p className="fw-promo-text mb-0">
        Premia a tus clientes más leales creando campañas exclusivas y sumando
        puntos por cada compra.
      </p>

      <button
        onClick={() => {
          botonAction === "crear"
            ? setModalAddCampaña(true)
            : navigate("/clientes/fidelizacion");
        }}
        className="fw-btn-action fw-btn-strawberry mt-auto w-100"
      >
        {botonAction === "crear" ? "Crear Campaña" : "Ver Campañas"}
      </button>
    </div>
  );
}
