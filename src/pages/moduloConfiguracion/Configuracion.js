import {
  BookCheck,
  Building2,
  DatabaseBackup,
  Link2,
  MessageCircleQuestionMark,
  Settings,
  Users,
} from "lucide-react";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";

import { Outlet, Link, useLocation } from "react-router-dom";

export function Configuracion() {
  const location = useLocation();

  // Función para saber si la opción está activa
  const isActive = (path) =>
    location.pathname === path ||
    (path !== "/configuracion" && location.pathname.startsWith(path));

  return (
    <ContenedorPrincipal>
      <div className="row g-3">
        <div className="col-md-12">
          <div className="row g-2">
            <div className="col-md-12">
              <div className="card shadow-sm h-100">
                <ul className="list-group bg-muted list-group-horizontal text-center border-0 w-100 overflow-auto">
                  <Link
                    to="/configuracion"
                    className={`list-group-item list-group-item-action d-flex flex-column flex-sm-row align-items-center justify-content-center p-2 border-0 flex-fill ${
                      isActive("/configuracion") ? "active" : ""
                    }`}
                  >
                    <Settings
                      height="24px"
                      width="24px"
                      className="text-auto mb-1 mb-sm-0 me-sm-2"
                    />
                    <p className="h6 m-0">Generales</p>
                  </Link>
                  <Link
                    to="/configuracion/MiPerfil"
                    className={`list-group-item list-group-item-action d-flex flex-column flex-sm-row align-items-center justify-content-center p-2 border-0 flex-fill ${
                      isActive("/configuracion/MiPerfil") ? "active" : ""
                    }`}
                  >
                    <Users
                      height="24px"
                      width="24px"
                      className="text-auto mb-1 mb-sm-0 me-sm-2"
                    />
                    <p className="h6 m-0">Mis Datos</p>
                  </Link>
                  <Link
                    to="/configuracion/MiEmpresa"
                    className={`list-group-item list-group-item-action d-flex flex-column flex-sm-row align-items-center justify-content-center p-2 border-0 flex-fill ${
                      isActive("/configuracion/MiEmpresa") ? "active" : ""
                    }`}
                  >
                    <Building2
                      height="24px"
                      width="24px"
                      className="text-auto mb-1 mb-sm-0 me-sm-2"
                    />
                    <p className="h6 m-0">Empresa</p>
                  </Link>
                  <Link
                    to="/configuracion/Integraciones"
                    className={`list-group-item list-group-item-action d-flex flex-column flex-sm-row align-items-center justify-content-center p-2 border-0 flex-fill ${
                      isActive("/configuracion/Integraciones") ? "active" : ""
                    }`}
                  >
                    <Link2
                      height="24px"
                      width="24px"
                      className="text-auto mb-1 mb-sm-0 me-sm-2"
                    />
                    <p className="h6 m-0">Integraciones</p>
                  </Link>
                  <Link
                    to="/configuracion/ServicioSunat"
                    className={`list-group-item list-group-item-action d-flex flex-column flex-sm-row align-items-center justify-content-center p-2 border-0 flex-fill ${
                      isActive("/configuracion/ServicioSunat") ? "active" : ""
                    }`}
                  >
                    <BookCheck
                      height="24px"
                      width="24px"
                      className="text-auto mb-1 mb-sm-0 me-sm-2"
                    />
                    <p className="h6 m-0">Servicio Sunat</p>
                  </Link>
                  <Link
                    to="/configuracion/Mantenimiento"
                    className={`list-group-item list-group-item-action d-flex flex-column flex-sm-row align-items-center justify-content-center p-2 border-0 flex-fill ${
                      isActive("/configuracion/Mantenimiento") ? "active" : ""
                    }`}
                  >
                    <DatabaseBackup
                      height="24px"
                      width="24px"
                      className="text-auto mb-1 mb-sm-0 me-sm-2"
                    />
                    <p className="h6 m-0">Backup y Mantenimiento</p>
                  </Link>
                  <Link
                    to="/configuracion/SoporteContacto"
                    className={`list-group-item list-group-item-action d-flex flex-column flex-sm-row align-items-center justify-content-center p-2 border-0 flex-fill ${
                      isActive("/configuracion/SoporteContacto") ? "active" : ""
                    }`}
                  >
                    <MessageCircleQuestionMark
                      height="24px"
                      width="24px"
                      className="text-auto mb-1 mb-sm-0 me-sm-2"
                    />
                    <p className="h6 m-0">Soporte y Contacto</p>
                  </Link>
                </ul>
              </div>
            </div>
            <div className="col-md-12">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </ContenedorPrincipal>
  );
}
