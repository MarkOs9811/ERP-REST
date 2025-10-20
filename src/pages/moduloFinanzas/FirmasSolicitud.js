import { File, Mail } from "lucide-react";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { FormularioFirmarDoc } from "../../components/componentesFinanzas/FormularioFirmarDoc";
import { ListaDocumentosFirmados } from "../../components/componentesFinanzas/ListaDocumentosFirmados";

export function FirmasSolicitud() {
  return (
    <div>
      <div className="row g-3">
        <div className="col-md-12">
          <div className="card shadow-sm py-2">
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
                  <File className={"mx-2 text-auto"} />
                  Reportes
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm py-2">
            <FormularioFirmarDoc />
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm py-2">
            <ListaDocumentosFirmados />
          </div>
        </div>
      </div>
    </div>
  );
}
