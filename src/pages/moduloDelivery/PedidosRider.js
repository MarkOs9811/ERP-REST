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
import { getPedidosListos } from "../../service/GetPedidosListos";
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

// Importación del Modal General

export function PedidosRider() {
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
      await axiosInstance.put("/pedidosPendientes/cambiarEstado", {
        idPedido: idPedido,
        nuevoEstado: nuevoEstado,
      });

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
    <div className="d-flex flex-column h-100  ">
      {/* --- NAVEGACIÓN POR PESTAÑAS (TABS) MODERNAS --- */}
      <div
        className="d-flex mb-4 p-1 rounded-pill shadow-sm bg-white"
        style={{ border: "1px solid #eef0f2" }}
      >
        <button
          className={`btn flex-grow-1 fw-bold rounded-pill border-0 transition-all ${
            activeTab === "recoger" ? "shadow-sm" : "bg-transparent text-muted"
          }`}
          style={{
            backgroundColor:
              activeTab === "recoger" ? "#0c0c0c" : "transparent",
            color: activeTab === "recoger" ? "white" : "#6c757d",
            padding: "10px 0",
          }}
          onClick={() => setActiveTab("recoger")}
        >
          <Package className="me-2" size={18} style={{ marginBottom: "2px" }} />
          Asignados
          <span className="badge bg-white text-dark ms-2 rounded-pill px-2">
            {listaRecoger.length}
          </span>
        </button>

        <button
          className={`btn flex-grow-1 fw-bold rounded-pill border-0 transition-all ${
            activeTab === "camino"
              ? "shadow-sm bg-dark text-white"
              : "bg-transparent text-muted"
          }`}
          style={{ padding: "10px 0" }}
          onClick={() => setActiveTab("camino")}
        >
          <Bike className="me-2" size={18} style={{ marginBottom: "2px" }} />
          En Moto
          <span
            className={`badge ms-2 rounded-pill px-2 ${activeTab === "camino" ? "bg-white text-dark" : "bg-light text-muted"}`}
          >
            {listaCamino.length}
          </span>
        </button>
      </div>

      {/* --- LISTA DE PEDIDOS --- */}
      <div className="flex-grow-1 overflow-auto pb-5 px-1">
        {/* TAB 1: ESTADO 5 (Por Recoger) */}
        {activeTab === "recoger" && (
          <div className="d-flex flex-column gap-3">
            {loadRecoger ? (
              <Cargando />
            ) : listaRecoger.length === 0 ? (
              <div className="text-center mt-5 pt-5 opacity-50">
                <CheckCircle2 size={60} className="mb-3 text-secondary" />
                <h5 className="fw-bold text-dark">Área Despejada</h5>
                <p className="text-muted">No hay pedidos asiganos.</p>
              </div>
            ) : (
              listaRecoger.map((pedido) => (
                <div
                  key={pedido.id}
                  className="bg-white rounded-4 shadow-sm border-0 overflow-hidden"
                >
                  <PedidoCard
                    pedido={pedido}
                    onOpenModal={() => handleAbrirDetalle(pedido)}
                  />
                  <div className="p-3 bg-white border-top border-light">
                    <button
                      className="btn-ver w-100 fw-bold rounded-pill py-2 shadow-sm d-flex justify-content-center align-items-center gap-2"
                      onClick={() => solicitarCambioEstado(pedido.id, 55)}
                    >
                      <Bike size={20} />
                      Iniciar Ruta
                      <ArrowRight size={18} className="ms-1" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: ESTADO 55 (En Camino) */}
        {activeTab === "camino" && (
          <div className="d-flex flex-column gap-3">
            {loadCamino ? (
              <Cargando />
            ) : listaCamino.length === 0 ? (
              <div className="text-center mt-5 pt-5 opacity-50">
                <Bike size={60} className="mb-3 text-secondary" />
                <h5 className="fw-bold text-dark">Sin Rutas Activas</h5>
                <p className="text-muted">No tienes pedidos en la moto.</p>
              </div>
            ) : (
              listaCamino.map((pedido) => (
                <div
                  key={pedido.id}
                  className="bg-white rounded-4 shadow-sm border-0 overflow-hidden"
                  style={{ borderLeft: "5px solid #212529" }}
                >
                  <PedidoCard
                    pedido={pedido}
                    onOpenModal={() => handleAbrirDetalle(pedido)}
                  />
                  <div className="p-3 bg-white border-top border-light d-flex gap-3">
                    <button
                      className="btn flex-grow-1 fw-bold rounded-pill py-2 d-flex justify-content-center align-items-center gap-2"
                      style={{
                        backgroundColor: "#f1f3f5",
                        color: "#495057",
                        border: "none",
                      }}
                      onClick={() => handleAbrirDetalle(pedido)}
                    >
                      <MapPin size={18} /> Ver Mapa
                    </button>
                    <button
                      className="btn flex-grow-1 fw-bold rounded-pill py-2 d-flex justify-content-center align-items-center gap-2 shadow-sm"
                      style={{
                        backgroundColor: "#212529",
                        color: "white",
                        border: "none",
                      }}
                      onClick={() => solicitarCambioEstado(pedido.id, 6)}
                    >
                      <CheckCircle2 size={18} /> Entregado
                    </button>
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
          <div className="d-flex flex-column h-100 w-100">
            <div className="flex-grow-1 overflow-y-auto">
              <ModalCabecera selectedPedido={selectedPedido} />
              <ModalCuerpo selectedPedido={selectedPedido} />
              <ModalFooter selectedPedido={selectedPedido} />
            </div>

            <div
              className="flex-shrink-0 p-3 bg-white border-top shadow-sm"
              style={{ zIndex: 10 }}
            >
              {activeTab === "recoger" ? (
                <button
                  className="btn w-100 fw-bold py-3 rounded-pill shadow-sm d-flex justify-content-center align-items-center gap-2"
                  style={{
                    background: "#ff3a3a",
                    color: "white",
                    border: "none",
                  }}
                  onClick={() => solicitarCambioEstado(selectedPedido.id, 55)}
                >
                  <Bike size={20} />
                  Iniciar Ruta de Entrega
                </button>
              ) : (
                <button
                  className="btn w-100 fw-bold py-3 rounded-pill shadow-sm d-flex justify-content-center align-items-center gap-2"
                  style={{
                    background: "#212529",
                    color: "white",
                    border: "none",
                  }}
                  onClick={() => solicitarCambioEstado(selectedPedido.id, 6)}
                >
                  <CheckCircle2 size={20} />
                  Confirmar Entrega
                </button>
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
        btnConfirmColor="btn-danger" // Puedes cambiarlo a btn-dark si prefieres
      >
        <div className="d-flex flex-column align-items-center">
          {/* Ícono llamativo para la acción */}
          <div
            className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center mb-3"
            style={{ width: "64px", height: "64px" }}
          >
            <AlertCircleIcon size={32} />
          </div>

          <p className="text-muted mb-4 px-2" style={{ fontSize: "1.05rem" }}>
            ¿Estás seguro de que deseas cambiar el estado de este pedido?
          </p>

          {/* Caja de resumen de la acción */}
          <div className="w-100 p-3 bg-light rounded-4 border border-light shadow-sm d-flex flex-column align-items-center">
            <span className="badge bg-white text-secondary border px-3 py-1 rounded-pill mb-2 shadow-sm">
              Pedido #{confirmConfig.idPedido}
            </span>
            <h5 className="text-danger fw-bold m-0">
              {confirmConfig.accionTexto}
            </h5>
          </div>
        </div>
      </ModalGenerales>
    </div>
  );
}
