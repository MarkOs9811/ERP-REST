import React, { useEffect, useRef, useState } from "react";
import {
  Clock,
  Printer,
  CheckCircle,
  ListOrderedIcon,
  Search,
  AlertCircle,
  User,
} from "lucide-react";

export function OffcanvasColaLlevar({ pedidosCola = [] }) {
  const offcanvasRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleInteraction = (e) => {
      if (!offcanvasRef.current?.classList.contains("show")) return;
      const isEscape = e.type === "keydown" && e.key === "Escape";
      const isClickOutside =
        e.type === "mousedown" && !offcanvasRef.current.contains(e.target);
      const isToggleButton = e.target.closest('[data-bs-toggle="offcanvas"]');

      if (isEscape || (isClickOutside && !isToggleButton)) {
        const bsOffcanvas = window.bootstrap?.Offcanvas?.getInstance(
          offcanvasRef.current,
        );
        if (bsOffcanvas) {
          bsOffcanvas.hide();
        } else {
          offcanvasRef.current.querySelector(".btn-close")?.click();
        }
      }
    };
    document.addEventListener("keydown", handleInteraction);
    document.addEventListener("mousedown", handleInteraction);
    return () => {
      document.removeEventListener("keydown", handleInteraction);
      document.removeEventListener("mousedown", handleInteraction);
    };
  }, []);

  const pedidosFiltrados = pedidosCola.filter((pedido) => {
    const termino = searchTerm.toLowerCase();
    const codigo = `ped-${pedido.idPedidoLLevar || pedido.id}`.toLowerCase();
    const clienteStr =
      typeof pedido.detalle_cliente === "string"
        ? pedido.detalle_cliente
        : "Cliente Genérico";

    return (
      codigo.includes(termino) || clienteStr.toLowerCase().includes(termino)
    );
  });

  // 🔥 FUNCIÓN AYUDANTE: Centraliza la lógica de los estados
  const obtenerConfigEstado = (estado) => {
    switch (estado) {
      case 0:
        return {
          label: "EN ESPERA",
          bg: "#F3F4F6",
          color: "var(--text-muted)",
        };
      case 2:
        return {
          label: "EN PREPARACIÓN",
          bg: "var(--bg-saffron-soft)",
          color: "var(--fw-saffron)",
        };
      case 1:
        return {
          label: "LISTO",
          bg: "var(--bg-emerald-soft)",
          color: "var(--fw-emerald)",
        };
      default:
        return {
          label: "DESCONOCIDO",
          bg: "transparent",
          color: "var(--fw-onyx)",
        };
    }
  };

  return (
    <div
      ref={offcanvasRef}
      className="offcanvas offcanvas-end h-100 border-0 shadow-lg rounded-0"
      tabIndex="-1"
      id="offcanvasColaLlevar"
      data-bs-scroll="true"
      data-bs-backdrop="false"
      style={{ width: "420px", borderLeft: "none" }}
    >
      <div className="offcanvas-header border-bottom flex-column align-items-start gap-3">
        <div className="d-flex justify-content-between align-items-center w-100">
          <h5
            className="offcanvas-title fw-bold d-flex align-items-center gap-2 m-0"
            style={{ color: "var(--brand-primary)" }}
          >
            <ListOrderedIcon size={20} /> Pedidos en Cola
          </h5>
          <button
            type="button"
            className="btn-close shadow-none"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        <div className="position-relative w-100 mt-1">
          <input
            type="text"
            className="form-control shadow-none border"
            placeholder="Buscar por código (PED-123) o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              paddingRight: "38px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "#f9fbfc",
              transition: "var(--transition-smooth)",
            }}
          />
          <div
            className="position-absolute top-50 translate-middle-y text-muted d-flex align-items-center"
            style={{ right: "12px", pointerEvents: "none" }}
          >
            <Search size={16} />
          </div>
        </div>
      </div>

      <div className="offcanvas-body p-3 bg-white overflow-auto">
        {pedidosFiltrados.length === 0 ? (
          <div className="text-center text-muted mt-5 opacity-50">
            <AlertCircle size={40} className="mb-2" />
            <p>No se encontraron pedidos en cola.</p>
          </div>
        ) : (
          pedidosFiltrados.map((pedido) => {
            const items = pedido.pedido_llevar?.detalle_pedidos || [];

            const totalPedido = items.reduce((suma, item) => {
              return suma + item.cantidad * Number(item.precio_unitario);
            }, 0);

            const horaFormateada = pedido.created_at
              ? new Date(pedido.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Hace un momento";

            // Usamos la función para obtener el color y texto exacto
            const configEstado = obtenerConfigEstado(pedido.estado);

            return (
              <div
                key={`cola-${pedido.id}`}
                className="card mb-3 border-0 shadow-sm"
                style={{
                  borderLeft: `4px solid ${configEstado.color} !important`, // El borde ahora coincide con el estado
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="fw-bold mb-1 text-dark">
                        PED-{pedido.idPedidoLLevar || pedido.id}
                      </h6>
                      <small
                        className="text-muted d-flex align-items-center gap-1 mb-1"
                        style={{ fontSize: "0.8rem" }}
                      >
                        <User size={12} />{" "}
                        {pedido.detalle_cliente || "Cliente Genérico"}
                      </small>
                      <small
                        className="text-muted d-flex align-items-center gap-1"
                        style={{ fontSize: "0.8rem" }}
                      >
                        <Clock size={12} /> {horaFormateada}
                      </small>
                    </div>

                    {/* 🔥 Aplicamos los estilos del estado aquí */}
                    <span
                      className="badge rounded-pill fw-bold"
                      style={{
                        backgroundColor: configEstado.bg,
                        color: configEstado.color,
                        fontSize: "0.7rem",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {configEstado.label}
                    </span>
                  </div>

                  <div className="small mb-3 text-dark border-top pt-2 mt-2">
                    {items.map((item, i) => (
                      <div
                        key={i}
                        className="d-flex justify-content-between gap-2 mb-1"
                      >
                        <div>
                          <span className="fw-bold text-muted me-2">
                            {item.cantidad}x
                          </span>
                          <span>{item.producto?.nombre || "Plato"}</span>
                        </div>
                        <span
                          className="text-muted"
                          style={{ fontSize: "0.75rem" }}
                        >
                          S/.{" "}
                          {Number(item.cantidad * item.precio_unitario).toFixed(
                            2,
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-light border d-flex align-items-center justify-content-center text-muted rounded-pill px-3"
                        title="Reimprimir"
                      >
                        <Printer size={16} />
                      </button>
                      <button
                        className="btn btn-sm d-flex align-items-center gap-1 rounded-pill px-3 fw-bold"
                        style={{
                          backgroundColor: "var(--bg-emerald-soft)",
                          color: "var(--fw-emerald)",
                          border: "1px solid var(--fw-emerald)",
                        }}
                      >
                        <CheckCircle size={16} /> Entregar
                      </button>
                    </div>
                    <span className="fw-bold fs-6 text-dark">
                      S/. {totalPedido.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
