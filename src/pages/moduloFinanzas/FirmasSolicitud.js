import { File, Mail } from "lucide-react";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";

export function FirmasSolicitud() {
  return (
    <ContenedorPrincipal>
      <div className="row g-3">
        <div className="col-md-12">
          <div className="card shadow-sm">
            <div className="card-header p-3 d-flex align-items-center">
              <Mail color={"#ea4f4f"} height="45px" width="45px" />
              <div>
                <p className="h4 card-title ms-2 mb-0">Firmar solicitud</p>
                <small
                  className=" ms-2 text-secondary"
                  style={{ fontWeight: "none" }}
                >
                  Firma solicitudes de compras y pedidos.
                </small>
              </div>

              <div className="d-flex ms-auto">
                <button className="btn btn-outline-dark ms-auto mx-2 d-flex align-items-center p-2">
                  <File color={"auto"} className={"mx-2"} />
                  Reportes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContenedorPrincipal>
  );
}
