import React, { useState, useEffect } from "react";
import { Store, UtensilsCrossed, CheckCircle2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";

export default function FormConfiguracionEmpresa({ configuracion, onClose }) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  // Usamos 'clave' porque en tu BD el valor ("comida") está en la columna clave
  const [valorConfig, setValorConfig] = useState("");

  useEffect(() => {
    if (configuracion) {
      // Normalizamos el valor inicial
      const valorInicial =
        configuracion.clave?.toLowerCase() === "comida"
          ? "restaurante"
          : configuracion.clave || "";
      setValorConfig(valorInicial);
    }
  }, [configuracion]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Endpoint para actualizar la tabla configuraciones
      const response = await axiosInstance.put(
        `/configuracionesTipoVenta/${configuracion.id}`,
        {
          clave: valorConfig,
        },
      );

      if (response.data.success) {
        ToastAlert("success", "Configuración actualizada correctamente");
        // Refrescamos la data global sin recargar la página
        queryClient.invalidateQueries(["confiEmpresa"]);
        onClose();
      } else {
        ToastAlert("error", "Error al actualizar");
      }
    } catch (error) {
      ToastAlert("error", error.response?.data?.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDERIZADO CONDICIONAL SEGÚN EL TIPO DE CONFIGURACIÓN ---

  // CASO 1: Es la configuración de Tipo de Venta (POS)
  if (configuracion?.nombre === "Tipo Venta") {
    return (
      <form onSubmit={handleUpdate} className="d-flex flex-column h-100 p-3">
        <p className="text-muted small mb-4">{configuracion.descripcion}</p>

        <div className="d-flex flex-column gap-3 mb-4">
          {/* Opcion Restaurante */}
          <div
            className="p-3 border d-flex align-items-center gap-3"
            style={{
              borderRadius: "var(--radius-md)",
              backgroundColor:
                valorConfig === "restaurante"
                  ? "var(--bg-saffron-soft)"
                  : "var(--bg-card)",
              borderColor:
                valorConfig === "restaurante"
                  ? "var(--fw-saffron)"
                  : "var(--glass-border)",
              cursor: "pointer",
              transition: "var(--transition-smooth)",
            }}
            onClick={() => setValorConfig("restaurante")}
          >
            <div
              className="d-flex justify-content-center align-items-center rounded p-2"
              style={{
                backgroundColor:
                  valorConfig === "restaurante"
                    ? "var(--fw-saffron)"
                    : "#f3f4f6",
                color:
                  valorConfig === "restaurante"
                    ? "var(--fw-white)"
                    : "var(--brand-secondary)",
              }}
            >
              <UtensilsCrossed size={28} />
            </div>
            <div className="flex-grow-1">
              <h6
                className="fw-bold mb-1"
                style={{ color: "var(--text-main)" }}
              >
                Gastronomía / Restaurante
              </h6>
              <p className="mb-0 small text-muted">
                Habilita mesas, comandas y pantalla de cocina (KDS).
              </p>
            </div>
            <div>
              {valorConfig === "restaurante" && (
                <CheckCircle2 color="var(--fw-saffron)" size={24} />
              )}
            </div>
          </div>

          {/* Opcion Retail */}
          <div
            className="p-3 border d-flex align-items-center gap-3"
            style={{
              borderRadius: "var(--radius-md)",
              backgroundColor:
                valorConfig === "retail"
                  ? "var(--bg-emerald-soft)"
                  : "var(--bg-card)",
              borderColor:
                valorConfig === "retail"
                  ? "var(--fw-emerald)"
                  : "var(--glass-border)",
              cursor: "pointer",
              transition: "var(--transition-smooth)",
            }}
            onClick={() => setValorConfig("retail")}
          >
            <div
              className="d-flex justify-content-center align-items-center rounded p-2"
              style={{
                backgroundColor:
                  valorConfig === "retail" ? "var(--fw-emerald)" : "#f3f4f6",
                color:
                  valorConfig === "retail"
                    ? "var(--fw-white)"
                    : "var(--brand-secondary)",
              }}
            >
              <Store size={28} />
            </div>
            <div className="flex-grow-1">
              <h6
                className="fw-bold mb-1"
                style={{ color: "var(--text-main)" }}
              >
                Retail / Tienda
              </h6>
              <p className="mb-0 small text-muted">
                Enfocado en ventas rápidas y lector de código de barras.
              </p>
            </div>
            <div>
              {valorConfig === "retail" && (
                <CheckCircle2 color="var(--fw-emerald)" size={24} />
              )}
            </div>
          </div>
        </div>

        <div className="mt-auto d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-light px-4 fw-semibold"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-guardar px-4" disabled={loading}>
            {loading ? "Guardando..." : "Aplicar Cambios"}
          </button>
        </div>
      </form>
    );
  }

  // CASO 2: Es cualquier otra configuración futura de tipo "empresa"
  return (
    <form onSubmit={handleUpdate} className="d-flex flex-column h-100 p-3">
      <p className="text-muted small mb-4">{configuracion?.descripcion}</p>

      <div className="mb-3">
        <label className="form-label fw-semibold text-secondary small">
          Valor de Configuración
        </label>
        <input
          type="text"
          className="form-control"
          value={valorConfig}
          onChange={(e) => setValorConfig(e.target.value)}
          required
        />
      </div>

      <div className="mt-auto d-flex justify-content-end gap-2">
        <button
          type="button"
          className="btn btn-light px-4 fw-semibold"
          onClick={onClose}
        >
          Cancelar
        </button>
        <button type="submit" className="btn-guardar px-4" disabled={loading}>
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </form>
  );
}
