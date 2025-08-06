import { BellRing, Languages, Lock, Moon, Sun } from "lucide-react";
import { useState } from "react";

const temas = [
  {
    nombre: "Claro",
    valor: "light",
    icon: <Sun color="#ffa716" height="22px" width="22px" />,
  },
  {
    nombre: "Oscuro",
    valor: "dark",
    icon: <Moon color="#fff" height="22px" width="22px" />,
  },
];

export function Generales() {
  const [tema, setTema] = useState("light");
  const [notificaciones, setNotificaciones] = useState(true);
  const [idioma, setIdioma] = useState("es");

  return (
    <div className="w-100 p-3 ">
      <div className="card p-3 shadow-sm" style={{ borderRadius: 18 }}>
        <h3 className="fw-bold mb-4" style={{ color: "#5a7a98" }}>
          Configuración General
        </h3>
        <div className="row g-3 mb-4">
          {/* Bloque Tema */}
          <div className="col-md-4">
            <div className="card border shadow-sm p-4 h-100">
              <label
                className="form-label fw-semibold"
                style={{ color: "#1d2530" }}
              >
                Tema
              </label>
              <div className="d-flex gap-3 mt-2">
                {temas.map((t) => {
                  const isSelected = tema === t.valor;
                  const isDark = t.valor === "dark";
                  return (
                    <button
                      key={t.valor}
                      type="button"
                      className="btn d-flex align-items-center"
                      style={{
                        background: isSelected && isDark ? "#1d2530" : "#fff",
                        color: isSelected && isDark ? "#fff" : "#1d2530",
                        borderColor: "#1d2530",
                        minWidth: 110,
                        fontWeight: isSelected ? "bold" : "normal",
                        boxShadow: isSelected
                          ? "0 2px 8px #0002"
                          : "0 1px 3px #0001",
                      }}
                      onClick={() => setTema(t.valor)}
                    >
                      {isDark ? (
                        <Moon
                          color={isSelected && isDark ? "#fff" : "#1d2530"}
                          height="22px"
                          width="22px"
                          className="me-2"
                        />
                      ) : (
                        <Sun
                          color="#ffa716"
                          height="22px"
                          width="22px"
                          className="me-2"
                        />
                      )}
                      <span className="ms-2">{t.nombre}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Bloque Idioma */}
          <div className="col-md-4">
            <div className="card border shadow-sm p-4 h-100">
              <label
                className="form-label fw-semibold"
                style={{ color: "#1d2530" }}
              >
                <Languages
                  color="#489ee7"
                  height="22px"
                  width="22px"
                  className="me-2"
                />
                Idioma
              </label>
              <select
                className="form-select mt-2"
                value={idioma}
                onChange={(e) => setIdioma(e.target.value)}
                style={{
                  maxWidth: 200,
                  borderColor: "#d4f4ff",
                  color: "#5a7a98",
                }}
              >
                <option value="es">Español</option>
                <option value="en">Inglés</option>
              </select>
            </div>
          </div>
          {/* Bloque Notificaciones */}
          <div className="col-md-4">
            <div className="card border shadow-sm p-4 h-100">
              <label
                className="form-label fw-semibold"
                style={{ color: "#1d2530" }}
              >
                <BellRing
                  color="#ffa716"
                  height="22px"
                  width="22px"
                  className="me-2"
                />
                Notificaciones
              </label>
              <div className="form-check form-switch mt-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="notificaciones"
                  checked={notificaciones}
                  onChange={() => setNotificaciones((n) => !n)}
                  style={{
                    background: notificaciones ? "#ee5252" : "#d4f4ff",
                    borderColor: "#d4f4ff",
                  }}
                />
                <label
                  className="form-check-label ms-2"
                  htmlFor="notificaciones"
                >
                  {notificaciones ? "Activadas" : "Desactivadas"}
                </label>
              </div>
            </div>
          </div>
          {/* Bloque Seguridad */}
          <div className="col-md-4">
            <div className="card border shadow-sm p-4 h-100">
              <label
                className="form-label fw-semibold"
                style={{ color: "#1d2530" }}
              >
                <Lock
                  color="#ee5252"
                  height="22px"
                  width="22px"
                  className="me-2"
                />
                Seguridad
              </label>
              <div className="mt-2">
                <button type="button" className="btn btn-outline-danger btn-sm">
                  Cambiar contraseña
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
