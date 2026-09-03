import { Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

export function CabeceraHome({ cajaAbierta = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const nombre = user?.empleado?.persona?.nombre || "Usuario";
  const fecha = new Date().toLocaleDateString();
  const hora = new Date().toLocaleTimeString();

  return (
    <div className="h-100">
        <div
          className="card rounded-4 overflow-hidden position-relative h-100 home-hero-banner"
          style={{ backgroundImage: "url('/images/background2.jpg')" }}
        >
          <div className="home-banner-overlay"></div>

          <div className="card-body position-relative p-4 p-lg-5 home-banner-content d-flex flex-column justify-content-between h-100">
            <div>
              <span className="home-hero-kicker mb-3">Panel de control</span>
              <h2 className="mb-2 text-white home-banner-title">
                <strong>Hola, {nombre}</strong>
              </h2>
              <p className="text-white-50 mb-4 mb-lg-0">
                Revisa ventas, salón y alertas del día desde un solo lugar.
              </p>
            </div>

            <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mt-4">
              <button
                className="btn-eliminar py-3 px-4"
                onClick={() =>
                  navigate(cajaAbierta ? "/vender/mesas" : "/abrirCaja")
                }
              >
                Comenzar a vender
              </button>
              <div className="d-flex align-items-center home-banner-meta">
                <Activity color="#fff" size={18} />
                <small className="opacity-75 ms-2">
                  {fecha} · Última actualización: {hora}
                </small>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
