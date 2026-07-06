import { Activity, User } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";

export function CabeceraHome({ load, error }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();
  const goVender = () => {
    navigate("/vender");
  };
  return (
    <div className="row mb-3 g-3 h-100">
      <div className="col-md-12 col-sm-12">
        <CondicionCarga isLoading={load} isError={error}>
          <div
            className="home-banner-card position-relative h-100"
            style={{ backgroundImage: "url('/images/background2.jpg')" }}
          >
            <div className="home-banner-overlay"></div>

            <div className="card-body text-auto position-relative p-4 p-lg-5 home-banner-content">
              <h2 className="mb-1 text-white home-banner-title">
                <strong>
                  Hola, {user?.empleado?.persona?.nombre || "Usuario"}
                </strong>
              </h2>
              <button className="home-banner-cta" onClick={() => goVender()}>
                Comenzar a vender
              </button>
              <User
                color={"#fff"}
                height="30px"
                width="30px"
                className="home-banner-user"
              />
              <div className="d-flex align-items-center mt-3 home-banner-meta">
                <Activity color={"#fff"} height="18px" width="18px" />
                <small className="opacity-75 ms-2">
                  Panel de control - {new Date().toLocaleDateString()} | Última
                  actualización: {new Date().toLocaleTimeString()}
                </small>
              </div>
            </div>
          </div>
        </CondicionCarga>
      </div>
    </div>
  );
}
