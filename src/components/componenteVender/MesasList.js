import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIdPreventaMesa } from "../../redux/mesaSlice";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import ModalRight from "../componentesReutilizables/ModalRight";
import ListReservas from "../componentesVentas/reservasMesas/ListReservas";
import FormAddReservarMesa from "../componentesVentas/reservasMesas/FormAddReservarMesa";

const TiempoOcupacion = ({ fechaApertura }) => {
  const [minutos, setMinutos] = useState(0);

  useEffect(() => {
    if (!fechaApertura) return;

    const calcularTiempo = () => {
      const fechaParseada = new Date(fechaApertura);
      const ahora = new Date();
      const diferenciaMs = ahora - fechaParseada;
      const diffMinutos = Math.floor(diferenciaMs / 60000);

      setMinutos(diffMinutos > 0 ? diffMinutos : 0);
    };

    calcularTiempo();
    const intervalo = setInterval(calcularTiempo, 60000);

    return () => clearInterval(intervalo);
  }, [fechaApertura]);

  const esDemorado = minutos >= 60;

  return (
    <span
      className={`small d-flex align-items-center gap-1 fw-bold ${
        esDemorado ? "text-danger" : "text-muted"
      }`}
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
  const queryClient = useQueryClient();
  const {
    data: mesas = [],
    isLoading: loading,
    isError: error,
    refetch,
  } = useQuery({
    queryKey: ["mesas"],
    queryFn: GetMesasVender,
  });
  // PARA ABRIR LAS RESERVAS
  const [modalReservasOpen, setModalReservasOpen] = useState(false);
  const [vistaReserva, setVistaReserva] = useState("lista");
  const [reservaEdit, setReservaEdit] = useState(null);

  //ESTADOS
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

  const handleEliminarPreventeMesa = async (idEliminar) => {
    try {
      const response = await axiosInstance.delete(
        `/vender/eliminarPreventaMesa/${idEliminar}`,
      );
      if (response.data.success) {
        ToastAlert("success", response.data.message);
        queryClient.invalidateQueries(["mesas"]);
        setModalQuestion(false);
        navigate(`/vender/mesas`);
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      ToastAlert("error", "Error al anular pedido");
    }
  };

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

  const pisosUnicos = ["Todos", ...new Set(listaMesas.map((m) => m.piso))];
  const mesasFiltradas =
    filtroPiso === "Todos"
      ? listaMesas
      : listaMesas.filter((m) => m.piso === filtroPiso);

  //  CONTADORES DE ESTADO
  const mesasDisponibles = listaMesas.filter(
    (mesa) => mesa.estado === 1,
  ).length;
  const mesasOcupadas = listaMesas.filter((mesa) => mesa.estado === 0).length;
  const mesasReservadas = listaMesas.filter((mesa) => mesa.estado === 2).length;

  return (
    <div className="card mesas-map m-0 h-100 overflow-auto p-3">
      {/* HEADER PRINCIPAL */}
      <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center mb-3 px-2">
        <div className="d-flex align-items-center gap-3">
          <h3 className="m-0 fw-bold" style={{ color: "var(--text-main)" }}>
            Mapa de Mesas
          </h3>
          <button
            className="btn btn-sm btn-outline-dark d-flex align-items-center gap-2 rounded-pill px-3"
            onClick={() => {
              setVistaReserva("lista"); // Siempre abrimos primero la lista
              setModalReservasOpen(true);
            }}
          >
            <CalendarDays size={16} /> Reservas
          </button>
        </div>

        <div className="mesa-status-summary d-flex align-items-center gap-3 bg-white px-3 py-2 rounded-pill border">
          <div className="d-flex align-items-center gap-2">
            <span className="fw-indicator bg-success"></span>
            <span className="small fw-bold text-muted">
              {mesasDisponibles} Libres
            </span>
          </div>

          {/* 🔥 SECCIÓN DE RESERVAS EN EL HEADER (Solo si hay > 0, o siempre visible) */}
          <div className="vr"></div>
          <div className="d-flex align-items-center gap-2">
            <span className="fw-indicator bg-warning"></span>
            <span className="small fw-bold text-muted">
              {mesasReservadas} Reservadas
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
            className={`mesa-floor-filter badge rounded-pill px-3 py-2 border transition-smooth ${
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
                  // 🔥 CLASES DINÁMICAS: Agregamos una clase "reservada" (Añádela a tu CSS si quieres cambiar bordes)
                  className={`mesa-card h-100 ${
                    mesa.estado === 1
                      ? "disponible"
                      : mesa.estado === 0
                        ? "en-atencion"
                        : "reservada border-warning" // <-- Puedes darle estilos en EstilosMesas.css
                  }`}
                  onClick={() => {
                    // 🔥 PROTECCIÓN DE CLIC
                    if (mesa.estado === 1) {
                      handleMesaAddPlato(mesa);
                    } else if (mesa.estado === 0) {
                      handleShowPedido(mesa.id);
                    } else {
                      ToastAlert(
                        "warning",
                        "Mesa reservada. Revisa el módulo de reservas.",
                      );
                    }
                  }}
                  style={{
                    cursor: mesa.estado === 2 ? "not-allowed" : "pointer",
                    opacity: mesa.estado === 2 ? 0.9 : 1, // Ligeramente difuminada si está reservada
                  }}
                >
                  {/* AVATAR Y DROPDOWN (Solo para mesas Ocupadas = 0) */}
                  {mesa.estado === 0 && (
                    <div
                      className="position-absolute top-0 end-0 p-2 z-3 d-flex align-items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {mesa.mesero && (
                        <span
                          className="text-muted text-truncate me-1"
                          style={{
                            fontSize: "0.65rem",
                            fontWeight: "600",
                            maxWidth: "110px",
                            letterSpacing: "0.3px",
                          }}
                        >
                          {mesa.mesero}
                        </span>
                      )}
                      {/* 1. FOTO DEL MESERO */}
                      {mesa.mesero && (
                        <div
                          className="mesa-avatar bg-white rounded-circle border border-2 d-flex align-items-center justify-content-center overflow-hidden"
                          style={{
                            width: "28px",
                            height: "28px",
                            borderColor: "var(--fw-strawberry)",
                          }}
                          title={`Atiende: ${mesa.mesero}`}
                        >
                          {mesa.foto_mesero ? (
                            <img
                              src={mesa.foto_mesero}
                              alt={mesa.mesero}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <span
                            className="fw-bold text-secondary"
                            style={{
                              fontSize: "0.75rem",
                              display: mesa.foto_mesero ? "none" : "flex",
                            }}
                          >
                            {mesa.mesero.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}

                      {/* 2. DROPDOWN (3 Puntitos) */}
                      <div className="dropdown">
                        <div
                          className="bg-white rounded-circle border d-flex align-items-center justify-content-center "
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

                        <ul
                          className="dropdown-menu dropdown-menu-end"
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
                              <ArrowRightLeft size={15} className="text-dark" />{" "}
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
                    </div>

                    {/* VISTA PREVIA TOTAL Y TIEMPO (Si está ocupada = 0) */}
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
                          {mesa.tiempo_apertura && (
                            <TiempoOcupacion
                              fechaApertura={mesa.tiempo_apertura}
                            />
                          )}
                        </div>
                        <span className="fw-bold fs-6">
                          S/ {Number(mesa.total || 0).toFixed(2)}
                        </span>
                      </div>
                    )}

                    {/* 🔥 VISTA PREVIA RESERVA (Si está reservada = 2) */}
                    {mesa.estado === 2 && (
                      <div className="mesa-total-preview mesa-reserva-preview mt-2 d-flex flex-column gap-1 rounded p-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <span
                            className="text-warning small"
                            style={{
                              fontSize: "0.65rem",
                              fontWeight: "800",
                              letterSpacing: "0.5px",
                            }}
                          >
                            RESERVADA PARA
                          </span>
                          <span className="small fw-bold text-warning d-flex align-items-center gap-1">
                            <Clock size={13} /> {mesa.reserva_hora}
                          </span>
                        </div>
                        <span
                          className="fw-bold fs-6 text-dark text-truncate mt-1"
                          title={mesa.reserva_cliente}
                        >
                          <UserRound size={14} className="me-1 text-warning" />
                          {mesa.reserva_cliente}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* FOOTER ACCIONES */}
                  <div className="mesa-footer">
                    {/* ESTADO 1: LIBRE */}
                    {mesa.estado === 1 && (
                      <div className="mesa-action-label">
                        <PlusCircle size={14} /> <span>ABRIR MESA</span>
                      </div>
                    )}

                    {/* ESTADO 0: OCUPADA */}
                    {mesa.estado === 0 && (
                      <div className="d-flex w-100 gap-1">
                        <div className="mesa-action-label flex-grow-1">
                          <Eye size={14} /> <span>VER PEDIDO</span>
                        </div>
                        <button
                          className="btn-informativo btn-icon text-auto m-0 d-flex align-items-center justify-content-center"
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

                    {/* 🔥 ESTADO 2: RESERVADA */}
                    {mesa.estado === 2 && (
                      <div className="mesa-action-label mesa-reserva-action w-100">
                        <CalendarDays size={14} /> <span>RESERVADA</span>
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

      {/* MODAL RIGHT DE RESERVAS */}
      <ModalRight
        isOpen={modalReservasOpen}
        onClose={() => setModalReservasOpen(false)}
        title={
          vistaReserva === "lista"
            ? "Gestión de Reservas"
            : reservaEdit
              ? "Editar Reserva"
              : "Nueva Reserva"
        }
        subtitulo={
          vistaReserva === "lista"
            ? "Reservas del día y futuras"
            : "Registrar cliente y mesa"
        }
        width="450px"
        hideFooter={true}
      >
        {vistaReserva === "lista" ? (
          <ListReservas
            irAFormulario={(reserva = null) => {
              setReservaEdit(reserva); // Si mandamos null es "Nueva", si mandamos el objeto es "Editar"
              setVistaReserva("formulario");
            }}
          />
        ) : (
          <FormAddReservarMesa
            volverALista={() => setVistaReserva("lista")}
            onCloseModal={() => setModalReservasOpen(false)}
            todasLasMesas={listaMesas}
            reservaToEdit={reservaEdit}
          />
        )}
      </ModalRight>
    </div>
  );
}
