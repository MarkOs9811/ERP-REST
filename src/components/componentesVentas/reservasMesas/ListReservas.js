import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Clock,
  UserRound,
  UtensilsCrossed,
  Trash2,
  CalendarDays,
  Search,
  Users2,
  Pencil,
} from "lucide-react";
import axiosInstance from "../../../api/AxiosInstance";
import { CondicionCarga } from "../../componentesReutilizables/CondicionCarga";
import ToastAlert from "../../componenteToast/ToastAlert";
import ModalAlertQuestion from "../../componenteToast/ModalAlertQuestion"; // Asegúrate de que la ruta sea correcta

export default function ListReservas({ irAFormulario }) {
  const queryClient = useQueryClient();

  const [fechaFiltro, setFechaFiltro] = useState(
    new Date().toISOString().split("T")[0],
  );

  // 🔥 Estado para tu Modal de Confirmación
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

  // 🔥 Función adaptada para tu ModalAlertQuestion (Debe retornar true/false)
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
    (r) => r.fecha_reserva === fechaFiltro,
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
            className="btn btn-dark btn-sm d-flex align-items-center gap-1 rounded-pill px-3 shadow-sm"
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
        className="overflow-auto  reservas-container"
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
                <div key={reserva.id} className="reserva-col">
                  <div
                    key={reserva.id}
                    className="card w-100 h-100"
                    style={{ borderLeft: "4px solid #ef4444!important" }} // Un rojo/coral sutil que combina con tu UI
                  >
                    <div className="p-3 position-relative">
                      {/* Botones de Acción */}
                      <div className="position-absolute top-0 end-0 m-2 d-flex gap-1">
                        <button
                          className="btn-editar btn-icon p-1 hover-dark"
                          style={{ background: "transparent" }}
                          title="Editar Reserva"
                          onClick={() => irAFormulario(reserva)} // Mandamos el objeto para editar
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="btn-eliminar btn-icon p-1"
                          style={{ background: "transparent" }}
                          title="Anular Reserva"
                          onClick={() =>
                            setModalDelete({
                              show: true,
                              id: reserva.id,
                              nombre: reserva.nombre_cliente,
                            })
                          }
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <h6 className="m-0 fw-bold d-flex align-items-center gap-2 mb-3 pe-5 text-dark">
                        <UserRound size={16} className="text-muted" />
                        {reserva.nombre_cliente}
                      </h6>

                      <div className="d-flex flex-wrap gap-2 mb-2">
                        <span className="badge bg-light text-dark border d-flex align-items-center gap-1 px-2 py-1">
                          <Clock size={12} className="text-danger" />
                          {reserva.hora_reserva.substring(0, 5)}
                        </span>
                        <span className="badge bg-light text-dark border d-flex align-items-center gap-1 px-2 py-1">
                          <UtensilsCrossed size={12} className="text-muted" />
                          Mesa {reserva.mesa?.numero || reserva.idMesa}
                        </span>
                        <span className="badge bg-light text-dark border d-flex align-items-center gap-1 px-2 py-1">
                          <Users2 size={12} className="text-muted" />
                          {reserva.cantidad_personas} Pax
                        </span>
                      </div>

                      {reserva.nota && (
                        <div
                          className="mt-3 p-2 rounded text-secondary"
                          style={{
                            fontSize: "0.8rem",
                            backgroundColor: "#f1f5f9",
                          }}
                        >
                          <span className="fst-italic">"{reserva.nota}"</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CondicionCarga>
      </div>
      {/* 🔥 Tu Modal de Confirmación integrado */}
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
