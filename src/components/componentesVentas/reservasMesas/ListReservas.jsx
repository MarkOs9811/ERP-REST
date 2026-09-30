import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, CalendarDays, Search } from "lucide-react";
import axiosInstance from "../../../api/AxiosInstance";
import { CondicionCarga } from "../../componentesReutilizables/CondicionCarga";
import ToastAlert from "../../componenteToast/ToastAlert";
import ModalAlertQuestion from "../../componenteToast/ModalAlertQuestion"; // Asegúrate de que la ruta sea correcta

import { CardReservas } from "./CardReservas";

export default function ListReservas({ irAFormulario }) {
  const queryClient = useQueryClient();

  const [fechaFiltro, setFechaFiltro] = useState(
    new Date().toISOString().split("T")[0],
  );

  //  Estado para tu Modal de Confirmación
  const [modalDelete, setModalDelete] = useState({
    show: false,
    id: null,
    nombre: "",
  });

  const {
    data: reservas = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["reservasActivas"],
    queryFn: async () => {
      const response = await axiosInstance.get("/vender/reservas");
      return response.data.data;
    },
  });

  //  Función adaptada para tu ModalAlertQuestion (Debe retornar true/false)
  const handleEliminarConfirmado = async (id) => {
    try {
      const response = await axiosInstance.delete(`/vender/reservas/${id}`);
      if (response.data.success) {
        ToastAlert("success", "Reserva anulada correctamente");
        queryClient.invalidateQueries(["reservasActivas"]);
        queryClient.invalidateQueries(["mesas"]);
        return true;
      }
      return false;
    } catch (error) {
      ToastAlert("error", "Error al cancelar la reserva");
      return false;
    }
  };

  const reservasFiltradas = reservas.filter(
    (r) => r.fecha_reserva === fechaFiltro, // ✅ Verifica cómo te lo devuelve el backend
  );

  return (
    <div className="d-flex flex-column h-100 bg-white">
      {" "}
      {/* Fondo blanco limpio */}
      <div className="p-3 border-bottom flex-shrink-0">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="fw-bold text-dark small">
            {reservasFiltradas.length} Reservas Programadas
          </span>
          <button
            className="btn-principal btn-sm d-flex align-items-center gap-1 rounded-pill px-3 shadow-sm"
            onClick={() => irAFormulario(null)} // null = Crear nueva
          >
            <Plus size={14} /> Nueva
          </button>
        </div>

        <div className="d-flex gap-2">
          <div className="input-group input-group-sm">
            <span className="input-group-text  border-0 bg-transparent text-muted">
              <CalendarDays size={14} />
            </span>
            <input
              type="date"
              className="form-control border-start-0 ps-3 ps-0 bg-light"
              value={fechaFiltro}
              onChange={(e) => setFechaFiltro(e.target.value)}
              style={{ boxShadow: "none" }}
            />
          </div>
        </div>
      </div>
      <div
        className="overflow-x-hidden   reservas-container"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <CondicionCarga isLoading={isLoading} isError={isError} mode="list">
          {reservasFiltradas.length === 0 ? (
            <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted opacity-50 py-5">
              <Search size={40} className="mb-3" />
              <p className="mb-0">No hay reservas para esta fecha</p>
            </div>
          ) : (
            <div className="row g-3 p-3">
              {reservasFiltradas.map((reserva) => (
                <CardReservas
                  key={reserva.id}
                  reserva={reserva}
                  setModalDelete={setModalDelete}
                  irAFormulario={irAFormulario}
                />
              ))}
            </div>
          )}
        </CondicionCarga>
      </div>
      {/*  Tu Modal de Confirmación integrado */}
      <ModalAlertQuestion
        show={modalDelete.show}
        idEliminar={modalDelete.id}
        nombre={modalDelete.nombre}
        tipo="la reserva de"
        pregunta="¿Estás seguro de anular"
        handleEliminar={handleEliminarConfirmado}
        handleCloseModal={() =>
          setModalDelete({ show: false, id: null, nombre: "" })
        }
      />
    </div>
  );
}
