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
import { Card } from "@/components/ui/card";


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
          className="text-auto mb-1 sm:mb-0 sm:me-2"
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
          className="text-auto mb-1 sm:mb-0 sm:me-2"
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
          className="text-auto mb-1 sm:mb-0 sm:me-2"
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
          className="text-auto mb-1 sm:mb-0 sm:me-2"
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
          className="text-auto mb-1 sm:mb-0 sm:me-2"
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
          className="text-auto mb-1 sm:mb-0 sm:me-2"
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
          className="text-auto mb-1 sm:mb-0 sm:me-2"
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
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-full md:col-span-12">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-full md:col-span-12">
              <Card className="border-0 h-full">
                <ul className="divide-y bg-muted flex flex-row text-center border-0 w-full overflow-auto">
                  {opciones.map((op) => (
                    <Link
                      key={op.to}
                      to={op.to}
                      className={`w-auto relative bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground flex flex-col sm:flex-row items-center justify-center p-2 border-0 flex-1 ${
                        isActive(op.path) ? "btn-principal" : ""
                      }`}
                    >
                      {op.icon}
                      <p className="text-sm m-0">{op.label}</p>
                    </Link>
                  ))}
                </ul>
              </Card>
            </div>
            <div className="col-span-full md:col-span-12">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
