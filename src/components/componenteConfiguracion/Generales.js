import {
  BellRing,
  Lock,
  Moon,
  Sun,
  ShieldCheck,
  Clock,
  Settings,
  Key,
} from "lucide-react";
import { useState } from "react";

const temas = [
  { nombre: "Claro", valor: "light", icon: <Sun size={18} /> },
  { nombre: "Oscuro", valor: "dark", icon: <Moon size={18} /> },
];

export function Generales() {
  const [tema, setTema] = useState("light");
  const [idioma, setIdioma] = useState("es");
  const [zonaHoraria, setZonaHoraria] = useState("GMT-5");
  const [notificaciones, setNotificaciones] = useState(true);
  const [privacidad, setPrivacidad] = useState(false);
  const [accesibilidad, setAccesibilidad] = useState(false);
  const [autoLogout, setAutoLogout] = useState(15);
  const [paginaInicio, setPaginaInicio] = useState("dashboard");

  return (
    <div className="container py-4">
      <h3
        className="fw-bold mb-4 d-flex align-items-center gap-2"
        style={{ color: "#3b5162" }}
      >
        <Settings size={22} /> Configuración General
      </h3>

      {/* Grid de Cards */}
      <div className="row g-4">
        {/* Apariencia */}
        <div className="col-md-6">
          <div
            className="card shadow-sm border-0 h-100 p-3"
            style={{ borderRadius: 12 }}
          >
            <div className="mb-3 d-flex gap-2 align-middle">
              <span className="alert border-0 alert-warning  fw-bold p-3 mb-0">
                <Sun size={22} />
              </span>
              <h6 className=" mb-1 d-flex flex-column gap-1">
                <span className="fw-bold">Tema</span>
                <p className="text-muted small mb-0">
                  Elige entre tema claro u oscuro
                </p>
              </h6>
            </div>
            <div className="d-flex gap-2 mt-3">
              {temas.map((t) => (
                <button
                  key={t.valor}
                  className="flex-fill d-flex align-items-center gap-2 fw-semibold"
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    padding: "0.7rem 1rem",
                    background: tema === t.valor ? "#fbbf24" : "#f9fafb",
                    color: tema === t.valor ? "#fff" : "#374151",
                    justifyContent: "center",
                    boxShadow:
                      tema === t.valor ? "0 2px 6px rgba(0,0,0,0.1)" : "none",
                    transition: "all 0.2s ease-in-out",
                  }}
                  onClick={() => setTema(t.valor)}
                >
                  {t.icon} {t.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notificaciones */}
        <div className="col-md-6">
          <div
            className="card shadow-sm border-0 h-100 p-3"
            style={{ borderRadius: 12 }}
          >
            <div className="mb-3 d-flex gap-2 align-middle">
              <span className="alert border-0 alert-primary text-primary p-3 mb-0">
                <BellRing size={22} />
              </span>
              <h6 className=" mb-1 d-flex flex-column gap-1">
                <span className="fw-bold">Notificaciones</span>
                <p className="text-muted small mb-0">
                  Recibe alertas importantes del sistema
                </p>
              </h6>
            </div>
            <div className="form-check form-switch ms-1">
              <input
                type="checkbox"
                className="form-check-input"
                checked={notificaciones}
                onChange={() => setNotificaciones((n) => !n)}
              />
              <label className="form-check-label">
                {notificaciones ? "Activadas" : "Desactivadas"}
              </label>
            </div>
          </div>
        </div>

        {/* Seguridad */}
        <div className="col-md-6">
          <div
            className="card shadow-sm border-0 h-100 p-3"
            style={{ borderRadius: 12 }}
          >
            <div className="mb-3 d-flex gap-2 align-middle">
              <span className="alert border-0 alert-danger text-danger p-23mb-0">
                <Lock size={22} />
              </span>
              <h6 className=" mb-1 d-flex flex-column gap-1">
                <span className="fw-bold">Seguridad</span>
                <p className="text-muted small mb-0">
                  Protege tu cuenta y datos
                </p>
              </h6>
            </div>
            <button className="btn border btn-sm d-flex align-items-start p-3 w-100">
              <Key className="me-2" />
              <div className="text-start d-flex flex-column">
                <span className="fw-semibold">Cambiar contraseña</span>
                <small className="text-muted">
                  Actualiza tu contraseña de acceso
                </small>
              </div>
            </button>
          </div>
        </div>

        {/* Privacidad */}
        <div className="col-md-6">
          <div
            className="card shadow-sm border-0 h-100 p-3"
            style={{ borderRadius: 12 }}
          >
            <div className="mb-3 d-flex gap-2 align-middle">
              <span className="alert border-0 alert-success text-success p-3 mb-0">
                <ShieldCheck size={22} />
              </span>
              <h6 className=" mb-1 d-flex flex-column gap-1">
                <span className="fw-bold">Accesibilidad</span>
                <p className="text-muted small mb-0">
                  Controla tus datos y la visualización
                </p>
              </h6>
            </div>
            <div className="form-check form-switch mb-3 ms-1">
              <input
                type="checkbox"
                className="form-check-input"
                checked={privacidad}
                onChange={() => setPrivacidad((p) => !p)}
              />
              <label className="form-check-label">
                {privacidad
                  ? "Compartir datos con integraciones"
                  : "No compartir datos"}
              </label>
            </div>
            <div className="form-check form-switch ms-1">
              <input
                type="checkbox"
                className="form-check-input"
                checked={accesibilidad}
                onChange={() => setAccesibilidad((a) => !a)}
              />
              <label className="form-check-label">
                {accesibilidad
                  ? "Modo alto contraste activado"
                  : "Modo estándar"}
              </label>
            </div>
          </div>
        </div>

        {/* Sesión */}
        <div className="col-12">
          <div
            className="card shadow-sm border-0 h-100 p-3"
            style={{ borderRadius: 12 }}
          >
            <div className="mb-3 d-flex gap-2 align-middle">
              <span className="alert border-0 alert-secondary 3-2 mb-0">
                <Clock size={22} />
              </span>
              <h6 className=" mb-1 d-flex flex-column gap-1">
                <span className="fw-bold">Sesión</span>
                <p className="text-muted small mb-0">
                  Configura opciones de inicio y cierre automático
                </p>
              </h6>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="fw-semibold">
                  Cierre automático por inactividad
                </label>
                <select
                  className="form-select mt-1"
                  value={autoLogout}
                  onChange={(e) => setAutoLogout(Number(e.target.value))}
                >
                  <option value={5}>5 min</option>
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={60}>60 min</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="fw-semibold">Página de inicio</label>
                <select
                  className="form-select mt-1"
                  value={paginaInicio}
                  onChange={(e) => setPaginaInicio(e.target.value)}
                >
                  <option value="dashboard">Dashboard</option>
                  <option value="ventas">Ventas</option>
                  <option value="compras">Compras</option>
                  <option value="almacen">Almacén</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
