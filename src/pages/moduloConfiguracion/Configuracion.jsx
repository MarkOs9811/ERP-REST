import {
  BookCheck,
  Building2,
  DatabaseBackup,
  Link2,
  MessageCircleQuestionMark,
  Settings,
  Users,
} from "lucide-react";

import { Outlet, Link, useLocation } from "react-router-dom";

export function Configuracion() {
  const location = useLocation();

  // 🔥 SOLUCIÓN: Movimos esto ADENTRO de la función.
  // Ahora se ejecuta cada vez que el usuario entra a esta ruta, leyendo los datos actualizados.
  const cargo =
    JSON.parse(
      localStorage.getItem("user") || sessionStorage.getItem("user"),
    ) || {};
  const userRol = cargo?.empleado?.cargo?.nombre?.toLowerCase();

  const isActive = (path) =>
    location.pathname === path ||
    (path !== "/configuracion/general" && location.pathname.startsWith(path));

  // Opciones para administrador
  const opcionesAdmin = [
    {
      to: "/configuracion/general",
      icon: (
        <Settings
          height="24px"
          width="24px"
          className="text-auto mb-1 mb-sm-0 me-sm-2"
        />
      ),
      label: "Generales",
      path: "/configuracion/general",
    },
    {
      to: "/configuracion/MiPerfil",
      icon: (
        <Users
          height="24px"
          width="24px"
          className="text-auto mb-1 mb-sm-0 me-sm-2"
        />
      ),
      label: "Mis Datos",
      path: "/configuracion/MiPerfil",
    },
    {
      to: "/configuracion/MiEmpresa",
      icon: (
        <Building2
          height="24px"
          width="24px"
          className="text-auto mb-1 mb-sm-0 me-sm-2"
        />
      ),
      label: "Empresa",
      path: "/configuracion/MiEmpresa",
    },
    {
      to: "/configuracion/Integraciones",
      icon: (
        <Link2
          height="24px"
          width="24px"
          className="text-auto mb-1 mb-sm-0 me-sm-2"
        />
      ),
      label: "Integraciones",
      path: "/configuracion/Integraciones",
    },
    {
      to: "/configuracion/ServicioSunat",
      icon: (
        <BookCheck
          height="24px"
          width="24px"
          className="text-auto mb-1 mb-sm-0 me-sm-2"
        />
      ),
      label: "Servicio Sunat",
      path: "/configuracion/ServicioSunat",
    },

    {
      to: "/configuracion/SoporteContacto",
      icon: (
        <MessageCircleQuestionMark
          height="24px"
          width="24px"
          className="text-auto mb-1 mb-sm-0 me-sm-2"
        />
      ),
      label: "Soporte y Contacto",
      path: "/configuracion/SoporteContacto",
    },
  ];

  // Opciones para usuario normal
  const opcionesUsuario = [
    {
      to: "/configuracion/MiPerfil",
      icon: (
        <Users
          height="24px"
          width="24px"
          className="text-auto mb-1 mb-sm-0 me-sm-2"
        />
      ),
      label: "Mis Datos",
      path: "/configuracion/MiPerfil",
    },
  ];

  // Evaluamos el rol dinámicamente
  const opciones =
    userRol === "administrador" ? opcionesAdmin : opcionesUsuario;

  return (
    <div>
      <div className="row g-3">
        <div className="col-md-12">
          <div className="row g-2">
            <div className="col-md-12">
              <div className="card border-0 h-100">
                <ul className="list-group bg-muted list-group-horizontal text-center border-0 w-100 overflow-auto">
                  {opciones.map((op) => (
                    <Link
                      key={op.to}
                      to={op.to}
                      className={`w-auto list-group-item list-group-item-action d-flex flex-column flex-sm-row align-items-center justify-content-center p-2 border-0 flex-fill ${
                        isActive(op.path) ? "btn-principal" : ""
                      }`}
                    >
                      {op.icon}
                      <p className="small m-0">{op.label}</p>
                    </Link>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-md-12">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
