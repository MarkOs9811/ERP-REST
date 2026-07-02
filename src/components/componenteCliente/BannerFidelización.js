import { StarHalfIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
export function BannerFidelizacion({
  botonAction,
  modalAddCampaña = false,
  setModalAddCampaña = null,
}) {
  const navigate = useNavigate();
  return (
    <div className="bannerFidelizacion w-100 rounded-4 p-4 h-100 d-flex flex-column justify-content-center align-items-start gap-2">
      <div className="bg-white rounded-pill opacity-75 d-inline-block px-2 me-2 mb-3 text-dark">
        <StarHalfIcon />
        Fidelización
      </div>
      <h2 className="fw-bold text-white mb-1">
        Programa de beneficios para clientes fieles
      </h2>
      <p className="text-white mb-0 ">
        Crea un programa de fidelización para premiar a tus clientes más leales.
      </p>
      <button
        onClick={() => {
          botonAction === "crear"
            ? setModalAddCampaña(true)
            : navigate("/clientes/fidelizacion");
        }}
        className="btn btn-outline-dark mt-5 text-white fw-bold fs-6"
      >
        {botonAction === "crear" ? "Crear Campaña" : "Ver Campañas"}
      </button>
    </div>
  );
}
