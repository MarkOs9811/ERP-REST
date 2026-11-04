import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  MapPin,
  Package,
  CheckCircle2,
  Bike,
  ArrowRight,
  AlertCircleIcon,
} from "lucide-react";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import { Cargando } from "../../components/componentesReutilizables/Cargando";
import PedidoCard from "../../components/componenteVender/CardPedidosDelivery";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { ModalCabecera } from "../../components/componenteVender/cuerpoModalRight/ModalCabecera";
import { ModalCuerpo } from "../../components/componenteVender/cuerpoModalRight/ModalCuerpo";
import { ModalFooter } from "../../components/componenteVender/cuerpoModalRight/ModalFooter";
import { GetPedidosEnCamino } from "../../service/GetPedidosEnCamino";
import ModalGenerales from "../../components/componentesReutilizables/ModalGenerales";
import { GetPedidosAsignados } from "../../service/GetPedidosAsignados";
import { useGeolocalizacion } from "../../hooks/useGeolocalizacion";
import { Button } from "../../components/ui/button";

// Importación del Modal General

export function PedidosRider() {
  const { obtenerUbicacion } = useGeolocalizacion();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("recoger");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);

  // --- ESTADO PARA EL MODAL DE CONFIRMACIÓN ---
  const [confirmConfig, setConfirmConfig] = useState({
    show: false,
    idPedido: null,
    nuevoEstado: null,
    accionTexto: "",
  });

  // --- QUERIES ---
  const { data: listaRecoger = [], isLoading: loadRecoger } = useQuery({
    queryKey: ["listaPedidosAsiganados"],
    queryFn: GetPedidosAsignados,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const { data: listaCamino = [], isLoading: loadCamino } = useQuery({
    queryKey: ["listaPedidosEnCamino"],
    queryFn: GetPedidosEnCamino,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // --- PUSHER ---
  useEffect(() => {
    const pusher = new Pusher("3a474e6680223eaa4e3f", {
      cluster: "eu",
      forceTLS: true,
    });

    const channel = pusher.subscribe("pedidosPendiente");
    channel.bind("pedido.creado", () => {
      queryClient.invalidateQueries(["listaPedidosListos"]);
    });

    return () => {
      channel.unbind_all();
      pusher.disconnect();
    };
  }, [queryClient]);

  // --- FUNCIÓN PARA ABRIR MODAL DE CONFIRMACIÓN ---
  const solicitarCambioEstado = (idPedido, nuevoEstado) => {
    const accionTexto =
      nuevoEstado === 55 ? "Iniciar Ruta de Entrega" : "Confirmar Entrega";
    setConfirmConfig({
      show: true,
      idPedido: idPedido,
      nuevoEstado: nuevoEstado,
      accionTexto: accionTexto,
    });
  };

  const cerrarConfirmacion = () => {
    setConfirmConfig({
      show: false,
      idPedido: null,
      nuevoEstado: null,
      accionTexto: "",
    });
  };

  // --- ACCIÓN DEFINITIVA: CAMBIAR ESTADO ---
  const ejecutarCambioEstado = async () => {
    const { idPedido, nuevoEstado } = confirmConfig;
    if (!idPedido || !nuevoEstado) return;

    try {
      const payload = {
        idPedido: idPedido,
        nuevoEstado: nuevoEstado,
      };

      if (nuevoEstado === 55 || nuevoEstado === "55") {
        try {
          const ubicacion = await obtenerUbicacion();

          payload.latitud = ubicacion.latitud;
          payload.longitud = ubicacion.longitud;
        } catch (geoError) {
          console.warn("No se pudo obtener el GPS:", geoError);
          // Avisamos el error y DETENEMOS el proceso
          ToastAlert(
            "error",
            "No se pudo obtener tu ubicación. Verifica que el GPS esté encendido.",
          );
          cerrarConfirmacion();
          return false; // <-- Esto evita que la petición llegue al backend sin coordenadas
        }
      }

      // IMPORTANTE: Enviamos la variable 'payload' que contiene la latitud y longitud
      await axiosInstance.put("/pedidosPendientes/cambiarEstado", payload);

      ToastAlert("success", "Ruta actualizada exitosamente");

      queryClient.invalidateQueries(["listaPedidosListos"]);
      queryClient.invalidateQueries(["listaPedidosEnCamino"]);

      setIsModalOpen(false);
      setSelectedPedido(null);
      cerrarConfirmacion();

      return true;
    } catch (error) {
      const mensaje =
        error.response?.data?.message || "Error al actualizar la ruta";
      ToastAlert("error", mensaje);
      cerrarConfirmacion();
      return false;
    }
  };

  // Función auxiliar para abrir el modal de detalles
  const handleAbrirDetalle = (pedido) => {
    setSelectedPedido(pedido);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* --- NAVEGACIÓN POR PESTAÑAS (TABS) MODERNAS --- */}
      <div
        className="flex mb-4 p-1 rounded-full shadow-sm bg-background"
        style={{ border: "1px solid #eef0f2" }}
      >
        <Button
          className={`inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 grow font-bold rounded-full border-0 transition-all ${
            activeTab === "recoger"
              ? "shadow-sm"
              : "bg-transparent text-muted-foreground"
          }`}
          style={{
            backgroundColor:
              activeTab === "recoger" ? "#0c0c0c" : "transparent",
            color: activeTab === "recoger" ? "white" : "#6c757d",
            padding: "10px 0",
          }}
          onClick={() => setActiveTab("recoger")}
          variant="default"
        >
          <Package className="me-2" size={18} style={{ marginBottom: "2px" }} />
          Asignados
          <span className="inline-flex items-center py-0.5 text-xs font-semibold transition-colors bg-background text-foreground ms-2 rounded-full px-2">
            {listaRecoger.length}
          </span>
        </Button>

        <Button
          className={`inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 grow font-bold rounded-full border-0 transition-all ${
            activeTab === "camino"
              ? "shadow-sm bg-foreground text-white"
              : "bg-transparent text-muted-foreground"
          }`}
          style={{ padding: "10px 0" }}
          onClick={() => setActiveTab("camino")}
          variant="default"
        >
          <Bike className="me-2" size={18} style={{ marginBottom: "2px" }} />
          En Moto
          <span
            className={`inline-flex items-center py-0.5 text-xs font-semibold transition-colors ms-2 rounded-full px-2 ${activeTab === "camino" ? "bg-background text-foreground" : "bg-muted text-muted-foreground"}`}
          >
            {listaCamino.length}
          </span>
        </Button>
      </div>

      {/* --- LISTA DE PEDIDOS --- */}
      <div className="grow overflow-auto pb-5 px-1">
        {/* TAB 1: ESTADO 5 (Por Recoger) */}
        {activeTab === "recoger" && (
          <div className="flex flex-col gap-3">
            {loadRecoger ? (
              <Cargando />
            ) : listaRecoger.length === 0 ? (
              <div className="text-center mt-5 pt-5 opacity-50">
                <CheckCircle2
                  size={60}
                  className="mb-3 text-muted-foreground"
                />
                <h5 className="font-bold text-foreground">Área Despejada</h5>
                <p className="text-muted-foreground">
                  No hay pedidos asiganos.
                </p>
              </div>
            ) : (
              listaRecoger.map((pedido) => (
                <div
                  key={pedido.id}
                  className="bg-background rounded-lg shadow-sm border-0 overflow-hidden"
                >
                  <PedidoCard
                    pedido={pedido}
                    onOpenModal={() => handleAbrirDetalle(pedido)}
                  />
                  <div className="p-3 bg-background border-t border-light">
                    <Button
                      className="btn-generico w-full font-bold rounded-full py-2 shadow-sm flex justify-center items-center gap-2"
                      onClick={() => solicitarCambioEstado(pedido.id, 55)}
                      variant="default"
                    >
                      <Bike size={20} />
                      Iniciar Ruta
                      <ArrowRight size={18} className="ms-1" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: ESTADO 55 (En Camino) */}
        {activeTab === "camino" && (
          <div className="flex flex-col gap-3">
            {loadCamino ? (
              <Cargando />
            ) : listaCamino.length === 0 ? (
              <div className="text-center mt-5 pt-5 opacity-50">
                <Bike size={60} className="mb-3 text-muted-foreground" />
                <h5 className="font-bold text-foreground">Sin Rutas Activas</h5>
                <p className="text-muted-foreground">
                  No tienes pedidos en la moto.
                </p>
              </div>
            ) : (
              listaCamino.map((pedido) => (
                <div
                  key={pedido.id}
                  className="bg-background rounded-lg shadow-sm border-0 overflow-hidden"
                  style={{ borderLeft: "5px solid #212529" }}
                >
                  <PedidoCard
                    pedido={pedido}
                    onOpenModal={() => handleAbrirDetalle(pedido)}
                  />
                  <div className="p-3 bg-background border-t border-light flex gap-3">
                    <Button
                      className="whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 grow font-bold rounded-full py-2 flex justify-center items-center gap-2"
                      style={{
                        backgroundColor: "#f1f3f5",
                        color: "#495057",
                        border: "none",
                      }}
                      onClick={() => handleAbrirDetalle(pedido)}
                      variant="default"
                    >
                      <MapPin size={18} /> Ver Mapa
                    </Button>
                    <Button
                      className="whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 grow font-bold rounded-full py-2 flex justify-center items-center gap-2 shadow-sm"
                      style={{
                        backgroundColor: "#212529",
                        color: "white",
                        border: "none",
                      }}
                      onClick={() => solicitarCambioEstado(pedido.id, 6)}
                      variant="default"
                    >
                      <CheckCircle2 size={18} /> Entregado
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* --- MODAL DETALLES DEL PEDIDO --- */}
      <ModalRight
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPedido(null);
        }}
        title="Detalle de Entrega"
        hideFooter={true}
        width={"400px"}
      >
        {selectedPedido ? (
          <div className="flex flex-col h-full w-full">
            <div className="grow overflow-y-auto">
              <ModalCabecera selectedPedido={selectedPedido} />
              <ModalCuerpo selectedPedido={selectedPedido} />
              <ModalFooter selectedPedido={selectedPedido} />
            </div>

            <div
              className="shrink-0 p-3 bg-background border-t shadow-sm"
              style={{ zIndex: 10 }}
            >
              {activeTab === "recoger" ? (
                <Button
                  className="whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 w-full font-bold py-3 rounded-full shadow-sm flex justify-center items-center gap-2"
                  style={{
                    background: "#ff3a3a",
                    color: "white",
                    border: "none",
                  }}
                  onClick={() => solicitarCambioEstado(selectedPedido.id, 55)}
                  variant="default"
                >
                  <Bike size={20} />
                  Iniciar Ruta de Entrega
                </Button>
              ) : (
                <Button
                  className="whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 w-full font-bold py-3 rounded-full shadow-sm flex justify-center items-center gap-2"
                  style={{
                    background: "#212529",
                    color: "white",
                    border: "none",
                  }}
                  onClick={() => solicitarCambioEstado(selectedPedido.id, 6)}
                  variant="default"
                >
                  <CheckCircle2 size={20} />
                  Confirmar Entrega
                </Button>
              )}
            </div>
          </div>
        ) : (
          <Cargando />
        )}
      </ModalRight>

      {/* --- MODAL GENERAL DE CONFIRMACIÓN --- */}
      <ModalGenerales
        show={confirmConfig.show}
        handleAccion={ejecutarCambioEstado}
        handleCloseModal={cerrarConfirmacion}
        mensaje="Confirmar Acción"
        btnConfirmColor="bg-destructive text-destructive-foreground"
      >
        <div className="flex flex-col items-center">
          {/* Ícono llamativo para la acción */}
          <div
            className="bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-3"
            style={{ width: "64px", height: "64px" }}
          >
            <AlertCircleIcon size={32} />
          </div>

          <p
            className="text-muted-foreground mb-4 px-2"
            style={{ fontSize: "1.05rem" }}
          >
            ¿Estás seguro de que deseas cambiar el estado de este pedido?
          </p>

          {/* Caja de resumen de la acción */}
          <div className="w-full p-3 bg-muted rounded-lg border-light shadow-sm flex flex-col items-center">
            <span className="inline-flex items-center text-xs font-semibold transition-colors bg-background text-muted-foreground px-3 py-1 rounded-full mb-2 shadow-sm">
              Pedido #{confirmConfig.idPedido}
            </span>
            <h5 className="text-destructive font-bold m-0">
              {confirmConfig.accionTexto}
            </h5>
          </div>
        </div>
      </ModalGenerales>
    </div>
  );
}
