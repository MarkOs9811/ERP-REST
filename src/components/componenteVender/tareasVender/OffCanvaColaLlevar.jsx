import { useEffect, useRef, useState } from "react";
import {
  Clock,
  Printer,
  CheckCircle,
  ListOrderedIcon,
  Search,
  AlertCircle,
  User,
  XCircle,
  LoaderCircle,
} from "lucide-react";
import { BadgeComponent } from "../../componentesReutilizables/BadgeComponent";
import { obtenerTiempoRelativo } from "../../../utils/formatoFechas";
import { BotonImprimirComanda } from "./BotonImprimirComanda";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";

export function OffcanvasColaLlevar({ pedidosCola = [] }) {
  const offcanvasRef = useRef(null);

  const queryCliente = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTab, setFiltroTab] = useState("todos"); // "todos" | "pendientes" | "entregados"

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
    // 1. Filtrado por pestañas (estado)
    if (filtroTab === "pendientes" && pedido.estado !== 0) return false;
    if (filtroTab === "entregados" && pedido.estado !== 1) return false;

    // 2. Filtrado por texto de búsqueda (código o cliente)
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

  // FUNCIÓN AYUDANTE: Centraliza la lógica de los estados
  const obtenerConfigEstado = (estado) => {
    switch (estado) {
      case 0:
        return (
          <BadgeComponent label="Pendiente" className="px-2 text-capitalize" />
        );

      case 2:
        return (
          <BadgeComponent
            label="En Proceso"
            className="px-2 text-capitalize "
          />
        );

      case 1:
        return (
          <BadgeComponent label="Listo" className="px-2 text-capitalize" />
        );

      default:
        return (
          <BadgeComponent
            label="Desconocido"
            className="px-2 text-capitalize"
          />
        );
    }
  };
  const [pedidoProcesando, setPedidoProcesando] = useState(null);
  const cambiarEstado = useMutation({
    mutationFn: async ({ idPedido }) => {
      const { data } = await axiosInstance.put(`/pedidoCocina/${idPedido}`);
      return data;
    },
    onSuccess: () => {
      ToastAlert("success", "Estado del pedido actualizado correctamente");
      queryCliente.invalidateQueries({ queryKey: ["pedidosEstado"] });
    },
    onError: (error) => {
      ToastAlert(
        "error",
        "Error al actualizar el estado del pedido: " +
          (error?.response?.data?.message || error.message),
      );
    },
  });

  const handleCambiarEstadoPedido = (idPedido) => {
    setPedidoProcesando(idPedido);
    cambiarEstado.mutate(
      { idPedido },
      {
        onSettled: () => {
          setPedidoProcesando(null);
        },
      },
    );
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
            {" "}
            Pedidos en Cola
          </h5>
          <button
            type="button"
            className="btn-close shadow-none"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        {/* PESTAÑAS DE FILTRO (Por entregar / Entregados / Todos) */}
        <div className="w-100 d-flex gap-1 p-1 bg-light rounded-pill border">
          <button
            type="button"
            className={`flex-fill btn btn-sm rounded-pill fw-semibold py-1 transition-all ${
              filtroTab === "todos"
                ? "bg-white text-dark shadow-sm"
                : "text-muted border-0 bg-transparent"
            }`}
            onClick={() => setFiltroTab("todos")}
            style={{ fontSize: "0.85rem" }}
          >
            Todos
          </button>
          <button
            type="button"
            className={`flex-fill btn btn-sm rounded-pill fw-semibold py-1 transition-all ${
              filtroTab === "pendientes"
                ? "bg-white text-dark shadow-sm"
                : "text-muted border-0 bg-transparent"
            }`}
            onClick={() => setFiltroTab("pendientes")}
            style={{ fontSize: "0.85rem" }}
          >
            Por entregar
          </button>
          <button
            type="button"
            className={`flex-fill btn btn-sm rounded-pill fw-semibold py-1 transition-all ${
              filtroTab === "entregados"
                ? "bg-white text-dark shadow-sm"
                : "text-muted border-0 bg-transparent"
            }`}
            onClick={() => setFiltroTab("entregados")}
            style={{ fontSize: "0.85rem" }}
          >
            Entregados
          </button>
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

            // Usamos la función para obtener el color y texto exacto
            const configEstado = obtenerConfigEstado(pedido.estado);

            return (
              <div
                key={`cola-${pedido.id}`}
                className="card mb-3 "
                style={{
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
                        className=" d-flex align-items-center gap-1 text-dark opacity-50"
                        style={{ fontSize: "0.8rem" }}
                      >
                        <Clock size={12} />{" "}
                        {obtenerTiempoRelativo(pedido.created_at)}
                      </small>
                    </div>
                    <div>{configEstado}</div>
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
                      <BotonImprimirComanda dataPedido={pedido} />

                      {pedido.estado === 0 || pedido.estado === 1 ? (
                        <button
                          key={`btn-estado-${pedido.id}`}
                          type="button"
                          className={`d-flex align-items-center gap-1 rounded-pill px-3 fw-bold ${
                            pedido.estado === 0 ? "btn-editar" : "btn-generico"
                          } ${
                            pedidoProcesando === pedido.id
                              ? "disabled cursor-not-allowed"
                              : ""
                          }`}
                          disabled={pedidoProcesando === pedido.id}
                          onClick={() => handleCambiarEstadoPedido(pedido.id)}
                        >
                          {pedidoProcesando === pedido.id ? (
                            <LoaderCircle size={16} className="animate-spin" />
                          ) : pedido.estado === 0 ? (
                            <CheckCircle size={16} />
                          ) : (
                            <XCircle size={16} />
                          )}

                          {pedidoProcesando === pedido.id
                            ? "Procesando..."
                            : pedido.estado === 0
                              ? "Entregar"
                              : "Reabrir"}
                        </button>
                      ) : null}
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
