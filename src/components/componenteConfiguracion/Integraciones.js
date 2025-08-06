import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { GetConfi } from "../../service/accionesConfiguracion/GetConfi";
import { Cargando } from "../componentesReutilizables/Cargando";
import ToastAlert from "../componenteToast/ToastAlert";
import {
  BellRing,
  Cloud,
  FileText,
  Globe2,
  Key,
  MessageCircleMore,
  User,
  Wheat,
} from "lucide-react";

// Función para retornar el icono según el nombre
function getIcon(nombre) {
  const n = nombre.toLowerCase();
  if (n.includes("google"))
    return <Globe2 color="#489ee7" height="32px" width="32px" />;
  if (n.includes("sunat") || n.includes("greenter"))
    return <FileText color="#5a7a98" height="32px" width="32px" />;
  if (n.includes("openai") || n.includes("chatgpt"))
    return <MessageCircleMore color="#ee5252" height="32px" width="32px" />;
  if (n.includes("twilio") || n.includes("whatsapp"))
    return <Wheat color="#25d366" height="32px" width="32px" />;
  if (n.includes("pusher") || n.includes("notificacion"))
    return <BellRing color="#489ee7" height="32px" width="32px" />;
  if (n.includes("ocr") || n.includes("tesseract"))
    return <Key color="#5a7a98" height="32px" width="32px" />;
  if (n.includes("socialite") || n.includes("login"))
    return <User color="#ffa716" height="32px" width="32px" />;
  if (n.includes("cloud"))
    return <Cloud color="#5a7a98" height="32px" width="32px" />;
  return <Key color="#b0b0b0" height="32px" width="32px" />; // Icono por defecto
}

export function Integraciones() {
  const {
    data: configuracion = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["configuraciones"],
    queryFn: GetConfi,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Filtrar solo las de tipo "integracion"
  const integraciones = configuracion.filter(
    (item) => item.tipo?.toLowerCase() === "integracion"
  );

  // Inicializa switches solo si está vacío y hay integraciones
  const [switches, setSwitches] = useState({});
  if (Object.keys(switches).length === 0 && integraciones.length > 0) {
    const initial = {};
    integraciones.forEach((item) => {
      initial[item.id] = item.estado === 1;
    });
    setSwitches(initial);
  }

  const handleSwitch = (id) => {
    setSwitches((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    ToastAlert("info", "cambiando estado de la integracion" + id);
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Aquí puedes manejar el envío de todas las configuraciones
    console.log("Datos enviados:", data);
  };

  if (isLoading) {
    return (
      <div className="w-100 p-3 text-center">
        <span className="text-secondary">
          <Cargando />
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-100 p-3 text-center">
        <span className="text-danger">
          Error: {error?.message || "No se pudieron cargar las integraciones."}
        </span>
      </div>
    );
  }

  return (
    <div className="container w-100 p-3">
      <div className="row g-3">
        {integraciones.map((item) => (
          <div className="col-md-6" key={item.id}>
            <div
              className="card border-0 shadow-sm p-4 h-100"
              style={{ borderRadius: 18 }}
            >
              <div className="d-flex align-items-center mb-2">
                <div className="me-3">{getIcon(item.nombre)}</div>
                <div className="flex-grow-1">
                  <span
                    className="fw-semibold"
                    style={{ color: "#1d2530", fontSize: 18 }}
                  >
                    {item.nombre}
                  </span>
                </div>
                <div className="form-switch m-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`flexSwitchCheckDefault${item.id}`}
                    checked={!!switches[item.id]}
                    onChange={() => handleSwitch(item.id)}
                    style={{
                      accentColor: "#ee5252",
                      width: 40,
                      height: 22,
                      cursor: "pointer",
                    }}
                  />
                </div>
              </div>
              <div className="text-muted small mb-2">{item.descripcion}</div>
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-outline-dark btn-sm"
                  // Aquí puedes abrir tu modal cuando lo implementes
                >
                  Configurar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
