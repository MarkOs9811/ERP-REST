import { useState } from "react";

const OPCIONES_BACKUP = [
  {
    key: "ventas",
    nombre: "Ventas",
    descripcion:
      "Respalda todas las transacciones y comprobantes de ventas realizadas en el sistema.",
  },
  {
    key: "productos",
    nombre: "Productos y Almacén",
    descripcion:
      "Respalda la información de productos, stock, movimientos y datos de almacén.",
  },
  {
    key: "clientes",
    nombre: "Clientes",
    descripcion:
      "Respalda la base de datos de clientes registrados y su historial.",
  },
  {
    key: "usuarios",
    nombre: "Usuarios y Permisos",
    descripcion:
      "Respalda la configuración de usuarios, roles y permisos del sistema.",
  },
  {
    key: "baseDatos",
    nombre: "Base de Datos Completa",
    descripcion:
      "Realiza un respaldo completo de toda la base de datos del sistema.",
  },
  {
    key: "configuracion",
    nombre: "Configuración General",
    descripcion:
      "Respalda la configuración general del sistema y preferencias.",
  },
];

export function Mantenimiento() {
  const [seleccion, setSeleccion] = useState({});
  const [mensaje, setMensaje] = useState("");

  const handleCheck = (key) => {
    setSeleccion((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleBackup = () => {
    const seleccionados = Object.keys(seleccion).filter((k) => seleccion[k]);
    if (seleccionados.length === 0) {
      setMensaje("Selecciona al menos una opción para respaldar.");
      return;
    }
    setMensaje("Respaldo en proceso...");
    setTimeout(() => {
      setMensaje("¡Respaldo realizado con éxito!");
    }, 1500);
  };

  return (
    <div className="w-100 p-3">
      <div className="card shadow-sm p-4" style={{ borderRadius: 18 }}>
        <h3>Backups y mantenimiento</h3>

        <div className="row g-4">
          {OPCIONES_BACKUP.map((op) => (
            <div className="col-md-6" key={op.key}>
              <div
                className="card border shadow-sm p-4 h-100"
                style={{ borderRadius: 18 }}
              >
                <div className="d-flex align-items-center mb-2">
                  <input
                    type="checkbox"
                    className="form-check-input me-3"
                    id={`backup-${op.key}`}
                    checked={!!seleccion[op.key]}
                    onChange={() => handleCheck(op.key)}
                  />
                  <label
                    htmlFor={`backup-${op.key}`}
                    className="form-label text-secondary small fw-semibold mb-0"
                    style={{
                      fontSize: 18,
                      color: "#1d2530",
                      cursor: "pointer",
                    }}
                  >
                    {op.nombre}
                  </label>
                </div>
                <div className="text-muted small">{op.descripcion}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-end mt-4">
          <button className="btn-guardar btn-sm" onClick={handleBackup}>
            Realizar Backup
          </button>
        </div>
        {mensaje && (
          <div className="alert alert-info mt-3 py-2 px-3">{mensaje}</div>
        )}
      </div>
    </div>
  );
}
