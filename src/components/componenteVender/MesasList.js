import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIdPreventaMesa } from "../../redux/mesaSlice";
import { useQuery } from "@tanstack/react-query";
import { GetMesasVender } from "../../service/accionesVender/GetMesasVender";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";
import {
  Eye,
  Layers,
  PlusCircle,
  Users,
  UtensilsCrossed,
  PrinterIcon,
  Clock,
  MoreVertical,
  CalendarDays,
  UserRound,
  ArrowRightLeft,
  Trash2,
} from "lucide-react";
import ToastAlert from "../componenteToast/ToastAlert";
import axiosInstance from "../../api/AxiosInstance";
import "../../css/EstilosMesas.css";
import ModalAlertQuestion from "../componenteToast/ModalAlertQuestion";
import { TransferirToMesa } from "./tareasVender/TransferirToMesa";

// 🔥 Importa tus modales aquí (Ajusta la ruta exacta según cómo esté tu carpeta)

// =================================================================================
// 🔥 MINI-COMPONENTE: Calcula el tiempo en vivo sin saturar Redux ni la API
// =================================================================================
const TiempoOcupacion = ({ fechaApertura }) => {
  const [minutos, setMinutos] = useState(0);

  useEffect(() => {
    if (!fechaApertura) return;

    const calcularTiempo = () => {
      // Reemplazamos '-' por '/' para evitar bugs de formato de fecha en Safari
      const fechaParseada = new Date(fechaApertura.replace(/-/g, "/"));
      const ahora = new Date();
      const diferenciaMs = ahora - fechaParseada;
      const diffMinutos = Math.floor(diferenciaMs / 60000);

      setMinutos(diffMinutos > 0 ? diffMinutos : 0);
    };

    calcularTiempo(); // Cálculo inicial
    const intervalo = setInterval(calcularTiempo, 60000); // Recalcula cada 1 minuto

    return () => clearInterval(intervalo);
  }, [fechaApertura]);

  // Si pasa de 60 minutos, se pone en rojo para alertar al cajero
  const esDemorado = minutos >= 60;

  return (
    <span
      className={`small d-flex align-items-center gap-1 fw-bold ${esDemorado ? "text-danger" : "text-muted"}`}
    >
      <Clock size={13} /> {minutos} min
    </span>
  );
};

// =================================================================================
// COMPONENTE PRINCIPAL
// =================================================================================
export function MesasList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    data: mesas = [],
    isLoading: loading,
    isError: error,
    refetch, // Importante para recargar las mesas si anulamos un pedido
  } = useQuery({
    queryKey: ["mesas"],
    queryFn: GetMesasVender,
    refetchOnWindowFocus: true,
  });

  // 🔥 ESTADOS
  const [filtroPiso, setFiltroPiso] = useState("Todos");
  const [modalTransferir, setModalTransferir] = useState(false);
  const [modalQuestion, setModalQuestion] = useState(false);
  const [mesaActiva, setMesaActiva] = useState({ id: null, numero: null });

  const handleCloseTransferir = () => setModalTransferir(false);
  const handleCloseModalQuestionEliminar = () => setModalQuestion(false);

  const handleMesaAddPlato = (data) => {
    dispatch(setIdPreventaMesa({ id: data.id, numero: data.numero }));
    navigate(`/vender/mesas/platos`);
  };

  const handleShowPedido = (id) => {
    dispatch(setIdPreventaMesa({ id: id, numero: null }));
    navigate(`/vender/mesas/preVenta`);
  };

  const handleReservas = () => {
    ToastAlert("info", "El módulo de Reservas estará disponible muy pronto.");
  };

  // 🔥 ACCIÓN: Anular pedido desde el modal
  const handleEliminarPreventeMesa = async (idMesaEliminar) => {
    try {
      // 👉 REEMPLAZA AQUÍ con tu ruta real de Axios para eliminar
      // await axiosInstance.delete(`/vender/mesa/preventa/${idMesaEliminar}`);

      ToastAlert("success", "Pedido anulado correctamente.");
      handleCloseModalQuestionEliminar();
      refetch(); // Recargamos el mapa de mesas
    } catch (error) {
      ToastAlert("error", "No se pudo anular el pedido.");
    }
  };

  // 🔥 ACCIÓN: Imprimir Pre-cuenta Rápida
  const handleImprimirPrecuentaRapida = async (e, mesa) => {
    e.stopPropagation();

    const preventas = mesa.preventas || [];
    if (preventas.length === 0) {
      return ToastAlert("error", "No hay pedidos registrados en esta mesa.");
    }

    const contenidoFormateado = preventas.map((item) => ({
      nombre: item.plato?.nombre || "Plato desconocido",
      cantidad: item.cantidad,
      precio: item.precio,
      subtotal: item.cantidad * item.precio,
    }));

    const payload = {
      titulo: `PRE-CUENTA MESA ${mesa.numero}`,
      contenido: contenidoFormateado,
      total: mesa.total || 0,
    };

    try {
      const response = await axiosInstance.post(
        "/vender/imprimirGenerico",
        payload,
      );

      if (response.data.success) {
        ToastAlert(
          "success",
          `Pre-cuenta de Mesa ${mesa.numero} enviada a impresión.`,
        );
      } else {
        ToastAlert(
          "error",
          response.data.message || "No se pudo imprimir la pre-cuenta.",
        );
      }
    } catch (error) {
      ToastAlert(
        "error",
        error.response?.data?.message || "Error de conexión con el servidor.",
      );
    }
  };

  const listaMesas = Array.isArray(mesas) ? mesas : [];

  // Procesamiento de Filtros
  const pisosUnicos = ["Todos", ...new Set(listaMesas.map((m) => m.piso))];
  const mesasFiltradas =
    filtroPiso === "Todos"
      ? listaMesas
      : listaMesas.filter((m) => m.piso === filtroPiso);

  const mesasDisponibles = listaMesas.filter(
    (mesa) => mesa.estado === 1,
  ).length;
  const mesasOcupadas = listaMesas.filter((mesa) => mesa.estado === 0).length;

  return (
    <div className="card m-0 h-100 overflow-auto p-3 bg-app">
      {/* HEADER PRINCIPAL */}
      <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center mb-3 px-2">
        <div className="d-flex align-items-center gap-3">
          <h3 className="m-0 fw-bold" style={{ color: "var(--text-main)" }}>
            Mapa de Mesas
          </h3>
          <button
            className="btn btn-sm btn-outline-dark d-flex align-items-center gap-2 rounded-pill px-3"
            onClick={handleReservas}
          >
            <CalendarDays size={16} /> Reservas
          </button>
        </div>

        <div className="d-flex align-items-center gap-3 bg-white px-3 py-2 rounded-pill shadow-sm border">
          <div className="d-flex align-items-center gap-2">
            <span className="fw-indicator bg-success"></span>
            <span className="small fw-bold text-muted">
              {mesasDisponibles} Libres
            </span>
          </div>
          <div className="vr"></div>
          <div className="d-flex align-items-center gap-2">
            <span className="fw-indicator bg-danger"></span>
            <span className="small fw-bold text-muted">
              {mesasOcupadas} Ocupadas
            </span>
          </div>
        </div>
      </div>

      {/* RENDERIZADO DE PÍLDORAS PARA EL FILTRO POR PISO */}
      <div className="d-flex gap-2 px-2 mb-3 overflow-auto pb-1">
        {pisosUnicos.map((piso) => (
          <button
            key={piso}
            type="button"
            className={`badge rounded-pill px-3 py-2 border transition-smooth ${
              filtroPiso === piso
                ? "bg-dark text-white border-dark"
                : "bg-white text-muted border-secondary"
            }`}
            style={{ cursor: "pointer", fontSize: "0.85rem" }}
            onClick={() => setFiltroPiso(piso)}
          >
            {piso === "Todos" ? "Todos los Pisos" : `Piso ${piso}`}
          </button>
        ))}
      </div>

      <CondicionCarga isLoading={loading} isError={error} mode="cards">
        <div className="p-1">
          <div className="row g-3">
            {mesasFiltradas.map((mesa) => (
              <div key={mesa.id} className="col-6 col-md-4 col-lg-3 col-xl-2">
                <div
                  className={`mesa-card h-100 ${
                    mesa.estado === 1 ? "disponible" : "en-atencion"
                  }`}
                  onClick={() =>
                    mesa.estado === 1
                      ? handleMesaAddPlato(mesa)
                      : handleShowPedido(mesa.id)
                  }
                >
                  {/* 🔥 BOTÓN DROPDOWN (Trasladar / Anular) */}
                  {mesa.estado === 0 && (
                    <div
                      className="position-absolute top-0 end-0 p-2 z-3 dropdown"
                      onClick={(e) => e.stopPropagation()} // Evita abrir la tarjeta al clicar el menú
                    >
                      <div
                        className="bg-white rounded-circle shadow-sm border d-flex align-items-center justify-content-center"
                        style={{
                          width: "28px",
                          height: "28px",
                          cursor: "pointer",
                        }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <MoreVertical
                          size={16}
                          className="text-muted hover-text-dark"
                        />
                      </div>

                      {/* Opciones del menú Bootstrap */}
                      <ul
                        className="dropdown-menu dropdown-menu-end shadow-sm border-0"
                        style={{ fontSize: "0.85rem" }}
                      >
                        <li>
                          <button
                            className="dropdown-item d-flex align-items-center gap-2 py-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMesaActiva({
                                id: mesa.id,
                                numero: mesa.numero,
                              });
                              setModalTransferir(true);
                            }}
                          >
                            <ArrowRightLeft
                              size={15}
                              className="text-primary"
                            />{" "}
                            Trasladar Mesa
                          </button>
                        </li>
                        <li>
                          <hr className="dropdown-divider my-1" />
                        </li>
                        <li>
                          <button
                            className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMesaActiva({
                                id: mesa.id,
                                numero: mesa.numero,
                              });
                              setModalQuestion(true);
                            }}
                          >
                            <Trash2 size={15} /> Anular Pedido
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}

                  {/* CONTENIDO DE LA TARJETA */}
                  <div className="mesa-content">
                    <h6 className="mesa-numero">
                      <UtensilsCrossed size={16} />
                      Mesa {mesa.numero}
                    </h6>

                    <div className="mesa-detalles mt-2">
                      <p>
                        <Layers size={13} /> Piso {mesa.piso}
                      </p>
                      <p>
                        <Users size={13} /> Cap: {mesa.capacidad}
                      </p>
                      {/* MESERO ASIGNADO */}
                      {mesa.estado === 0 && mesa.mesero && (
                        <p
                          className="text-truncate"
                          title={`Atiende: ${mesa.mesero}`}
                        >
                          <UserRound size={13} /> {mesa.mesero}
                        </p>
                      )}
                    </div>

                    {/* VISTA PREVIA TOTAL Y TIEMPO (Si está ocupada) */}
                    {mesa.estado === 0 && (
                      <div className="mesa-total-preview mt-2 d-flex flex-column gap-1">
                        <div className="d-flex justify-content-between align-items-center">
                          <span
                            className="text-muted small"
                            style={{
                              fontSize: "0.65rem",
                              fontWeight: "700",
                              letterSpacing: "0.5px",
                            }}
                          >
                            TOTAL ACTUAL
                          </span>
                          {/* INDICADOR DE TIEMPO (Asume que el backend devuelve created_at) */}
                          {mesa.created_at && (
                            <TiempoOcupacion fechaApertura={mesa.created_at} />
                          )}
                        </div>
                        <span className="fw-bold fs-6">
                          S/ {Number(mesa.total || 0).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* FOOTER ACCIONES */}
                  <div className="mesa-footer">
                    {mesa.estado === 1 ? (
                      <div className="mesa-action-label">
                        <PlusCircle size={14} /> <span>ABRIR MESA</span>
                      </div>
                    ) : (
                      <div className="d-flex w-100 gap-1">
                        <div className="mesa-action-label flex-grow-1">
                          <Eye size={14} /> <span>VER PEDIDO</span>
                        </div>
                        <button
                          className="btn-informativo m-0 d-flex align-items-center justify-content-center"
                          style={{ width: "40px", flexShrink: 0, padding: 0 }}
                          onClick={(e) =>
                            handleImprimirPrecuentaRapida(e, mesa)
                          }
                          title="Imprimir Pre-cuenta"
                        >
                          <PrinterIcon size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CondicionCarga>

      {/* ========================================== */}
      {/* MODALES EXTERNOS                             */}
      {/* ========================================== */}
      <ModalAlertQuestion
        show={modalQuestion}
        idEliminar={mesaActiva.id}
        nombre={`Mesa ${mesaActiva.numero}`}
        tipo="Pedidos"
        handleEliminar={handleEliminarPreventeMesa}
        handleCloseModal={handleCloseModalQuestionEliminar}
      />

      <TransferirToMesa
        show={modalTransferir}
        idMesa={mesaActiva.id}
        mesa={mesaActiva.numero}
        handleCloseModal={handleCloseTransferir}
      />
    </div>
  );
}
