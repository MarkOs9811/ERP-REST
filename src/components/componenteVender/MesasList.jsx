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
  ChefHatIcon,
  CheckCheckIcon,
} from "lucide-react";
import ToastAlert from "../componenteToast/ToastAlert";
import axiosInstance from "../../api/AxiosInstance";
import ModalAlertQuestion from "../componenteToast/ModalAlertQuestion";
import { TransferirToMesa } from "./tareasVender/TransferirToMesa";
import ModalRight from "../componentesReutilizables/ModalRight";
import ListReservas from "../componentesVentas/reservasMesas/ListReservas";
import FormAddReservarMesa from "../componentesVentas/reservasMesas/FormAddReservarMesa";
import { BadgeComponent } from "../componentesReutilizables/BadgeComponent";
import echoEvents from "../../api/echoEvents";
import { Button } from "../ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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
      className={`text-sm flex items-center gap-1 font-bold ${
        esDemorado ? "text-destructive" : "text-muted-foreground"
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
    retry: 1,
    refetchOnWindowFocus: false,
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

  // =================================================================================
  // ESCUCHADOR DE WEBSOCKETS (Actualización en Tiempo Real de Estados de Cocina)
  // =================================================================================
  useEffect(() => {
    const canalCocina = echoEvents.channel("pedidosEstado");

    canalCocina.listen(".pedidosEstado.creado", (evento) => {
      if (evento.tipo_pedido === "mesa") {
        queryClient.invalidateQueries(["mesas"]);
      }
    });

    return () => {
      echoEvents.leaveChannel("pedidosEstado");
    };
  }, [queryClient]);

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
    <Card className="mesas-map m-0 h-full overflow-auto rounded-2xl border border-border bg-muted/50 p-3 shadow-none ring-0 sm:p-4">
      {/* HEADER PRINCIPAL */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 bg-background px-3 py-3">
        <div className="flex items-center gap-3">
          <h3 className="m-0 font-semibold tracking-tight text-foreground">
            Mapa de Mesas
          </h3>
          <Button
            size="sm"
            className="h-8 justify-center gap-2 rounded-lg border-border/70 px-3"
            onClick={() => {
              setVistaReserva("lista"); // Siempre abrimos primero la lista
              setModalReservasOpen(true);
            }}
            variant="outline"
          >
            <CalendarDays size={16} /> Reservas
          </Button>
        </div>

        <div className="mesa-status-summary flex flex-wrap items-center gap-2 rounded-lg border border-border/80 bg-muted/50 px-2.5 py-2">
          <div className="flex items-center gap-2">
            <BadgeComponent label={`${mesasDisponibles} libres`} variant="success" />
          </div>

          <div className="flex items-center gap-2">
            <BadgeComponent label={`${mesasReservadas} reservadas`} variant="warning" />
          </div>

          <div className="flex items-center gap-2">
            <BadgeComponent label={`${mesasOcupadas} ocupadas`} variant="danger" />
          </div>
        </div>
      </div>

      {/* RENDERIZADO DE PÍLDORAS PARA EL FILTRO POR PISO */}
      <div className="mb-4 flex gap-2 overflow-auto rounded-xl border border-border/80 bg-background p-2">
        {pisosUnicos.map((piso) => (
          <Button
            key={piso}
            type="button"
            size="sm"
            className={`mesa-floor-filter shrink-0 rounded-lg px-3 text-xs font-semibold transition-colors ${
              filtroPiso === piso
                ? ""
                : "border-border/70 bg-background text-muted-foreground shadow-none hover:bg-muted hover:text-foreground"
            }`}
            onClick={() => setFiltroPiso(piso)}
            variant={filtroPiso === piso ? "default" : "outline"}
            aria-pressed={filtroPiso === piso}
          >
            {piso === "Todos" ? "Todos los Pisos" : `Piso ${piso}`}
          </Button>
        ))}
      </div>

      <CondicionCarga isLoading={loading} isError={error} mode="cards">
        <div className="p-1">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
            {mesasFiltradas.map((mesa) => (
              <div key={mesa.id} className="min-w-0">
                <div
                  role="button"
                  tabIndex={mesa.estado === 2 ? -1 : 0}
                  aria-disabled={mesa.estado === 2}
                  aria-label={`Mesa ${mesa.numero}, ${
                    mesa.estado === 1
                      ? "libre"
                      : mesa.estado === 0
                        ? "ocupada"
                        : "reservada"
                  }`}
                  className={`mesa-card relative flex h-full min-h-52 cursor-pointer flex-col rounded-xl border-2 p-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 ${
                    mesa.estado === 1
                      ? "disponible border-emerald-600/50 bg-emerald-50/80 hover:border-emerald-700 hover:bg-emerald-100/80 dark:border-emerald-500/50 dark:bg-emerald-950/25 dark:hover:bg-emerald-950/45"
                      : mesa.estado === 0
                        ? "en-atencion border-rose-600/50 bg-rose-50/80 hover:border-rose-700 hover:bg-rose-100/80 dark:border-rose-500/50 dark:bg-rose-950/25 dark:hover:bg-rose-950/45"
                        : "reservada border-amber-600/60 bg-amber-50/90 dark:border-amber-500/60 dark:bg-amber-950/30"
                  }`}
                  onClick={() => {
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
                  onKeyDown={(event) => {
                    if (
                      event.currentTarget === event.target &&
                      mesa.estado !== 2 &&
                      (event.key === "Enter" || event.key === " ")
                    ) {
                      event.preventDefault();
                      if (mesa.estado === 1) {
                        handleMesaAddPlato(mesa);
                      } else {
                        handleShowPedido(mesa.id);
                      }
                    }
                  }}
                  style={{
                    cursor: mesa.estado === 2 ? "not-allowed" : "pointer",
                  }}
                >
                  {/* 1. ZONA SUPERIOR DERECHA (Avatar y Opciones) */}
                  {mesa.estado === 0 && (
                    <div
                      className="absolute right-2 top-2 z-10 flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {mesa.mesero && (
                        <span
                          className="text-muted-foreground truncate me-1"
                          style={{
                            fontSize: "0.65rem",
                            fontWeight: "600",
                            maxWidth: "85px",
                            letterSpacing: "0.3px",
                          }}
                        >
                          {mesa.mesero}
                        </span>
                      )}
                      {mesa.mesero && (
                        <div
                          className="mesa-avatar flex size-7 items-center justify-center overflow-hidden rounded-full border-2 bg-background"
                          style={{
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
                            className="font-bold text-muted-foreground"
                            style={{
                              fontSize: "0.75rem",
                              display: mesa.foto_mesero ? "none" : "flex",
                            }}
                          >
                            {mesa.mesero.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 rounded-full bg-background shadow-sm"
                            aria-label={`Acciones de la mesa ${mesa.numero}`}
                            onClick={(event) => event.stopPropagation()}
                          >
                            <MoreVertical
                              size={14}
                              className="text-muted-foreground"
                            />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onSelect={(event) => {
                              event.stopPropagation();
                              setMesaActiva({
                                id: mesa.id,
                                numero: mesa.numero,
                              });
                              setModalTransferir(true);
                            }}
                          >
                            <ArrowRightLeft size={15} />
                            Trasladar Mesa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onSelect={(event) => {
                              event.stopPropagation();
                              setMesaActiva({
                                id: mesa.id,
                                numero: mesa.numero,
                              });
                              setModalQuestion(true);
                            }}
                          >
                            <Trash2 size={15} />
                            Anular Pedido
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}

                  {/* 2. CONTENIDO PRINCIPAL */}
                  <div className="mesa-content flex flex-1 flex-col pt-1">
                    {/* Título y Etiquetas */}
                    <div className="mb-2 pr-16">
                      <h6
                        className="mesa-numero mb-1 flex items-center gap-1.5 font-semibold text-foreground"
                      >
                        <UtensilsCrossed size={16} className="text-muted-foreground" />
                        Mesa {mesa.numero}
                      </h6>
                      <BadgeComponent
                        label={
                          mesa.estado === 1
                            ? "Libre"
                            : mesa.estado === 0
                              ? "Ocupada"
                              : "Reservada"
                        }
                        variant={
                          mesa.estado === 1
                            ? "success"
                            : mesa.estado === 0
                              ? "danger"
                              : "warning"
                        }
                      />

                      {mesa.estado === 0 && mesa?.preventas?.[0]?.idPedido && (
                        <div className="flex items-center gap-1 flex-wrap">
                          <BadgeComponent
                            label={`PED-${mesa?.preventas?.[0]?.idPedido}`}
                            className="text-xs px-2"
                            variant="secondary"
                          />
                          {mesa.estado_cocina !== null &&
                            mesa.estado_cocina !== undefined && (
                              <BadgeComponent
                                className="text-xs px-2"
                                label={
                                  mesa.estado_cocina === 0
                                    ? "En espera"
                                    : mesa.estado_cocina === 2
                                      ? "Preparando"
                                      : "Listo"
                                }
                                variant={
                                  mesa.estado_cocina === 0
                                    ? "warning"
                                    : mesa.estado_cocina === 2
                                      ? "primary"
                                      : "success"
                                }
                                icon={
                                  mesa.estado_cocina === 0 ? (
                                    <Clock />
                                  ) : mesa.estado_cocina === 2 ? (
                                    <ChefHatIcon />
                                  ) : (
                                    <CheckCheckIcon />
                                  )
                                }
                              />
                            )}
                        </div>
                      )}
                    </div>

                    {/* Detalles (Alineados horizontalmente para ahorrar espacio) */}
                    <div
                      className="mb-2 flex items-center gap-3 text-xs font-medium text-muted-foreground"
                    >
                      <span className="flex items-center gap-1">
                        <Layers size={13} /> Piso {mesa.piso}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={13} /> Cap: {mesa.capacidad}
                      </span>
                    </div>

                    {/* Resumen Total */}
                    {mesa.estado === 0 && (
                      <div className="mesa-total-preview mt-auto rounded-lg border border-rose-600/30 bg-background/90 p-2 dark:border-rose-400/30">
                        <div className="flex justify-between items-center mb-1">
                          <span
                            className="text-muted-foreground"
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
                        <span
                          className="font-bold text-foreground"
                          style={{ fontSize: "1rem" }}
                        >
                          S/ {Number(mesa.total || 0).toFixed(2)}
                        </span>
                      </div>
                    )}

                    {/* Vista Reserva */}
                    {mesa.estado === 2 && (
                      <div className="mesa-total-preview mesa-reserva-preview mt-auto rounded-lg border border-amber-600/40 bg-background/90 p-2 dark:border-amber-400/40">
                        <div className="flex justify-between items-center mb-1">
                          <span
                            className="text-amber-600 dark:text-amber-400"
                            style={{
                              fontSize: "0.65rem",
                              fontWeight: "800",
                              letterSpacing: "0.5px",
                            }}
                          >
                            RESERVADA PARA
                          </span>
                          <span
                            className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1"
                            style={{ fontSize: "0.75rem" }}
                          >
                            <Clock size={12} /> {mesa.reserva_hora}
                          </span>
                        </div>
                        <span
                          className="font-bold text-foreground truncate block"
                          style={{ fontSize: "0.85rem" }}
                          title={mesa.reserva_cliente}
                        >
                          <UserRound
                            size={13}
                            className="me-1 text-amber-600 dark:text-amber-400"
                          />
                          {mesa.reserva_cliente}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 3. FOOTER BOTONES */}
                  <div className="mesa-footer mt-3 border-t border-border/70 pt-2">
                    {mesa.estado === 1 && (
                      <div className="mesa-action-label flex w-full items-center justify-center gap-1 py-1 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                        <PlusCircle size={15} className="me-1" /> ABRIR MESA
                      </div>
                    )}

                    {mesa.estado === 0 && (
                      <div className="flex w-full gap-2">
                        <div className="mesa-action-label flex grow items-center justify-center gap-1 py-1 text-sm font-semibold text-rose-700 dark:text-rose-400">
                          <Eye size={15} className="me-1" /> VER PEDIDO
                        </div>
                        <Button
                          size="icon"
                          className="size-8 border border-border/70 bg-background text-foreground"
                          onClick={(e) =>
                            handleImprimirPrecuentaRapida(e, mesa)
                          }
                          title="Imprimir Pre-cuenta"
                          variant="default"
                        >
                          <PrinterIcon size={15} />
                        </Button>
                      </div>
                    )}

                    {mesa.estado === 2 && (
                      <div className="mesa-action-label mesa-reserva-action flex w-full items-center justify-center gap-1 py-1 text-sm font-semibold text-amber-700 dark:text-amber-400">
                        <CalendarDays size={15} className="me-1" /> RESERVADA
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
    </Card>
  );
}
