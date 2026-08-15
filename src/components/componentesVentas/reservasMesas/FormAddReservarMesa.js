import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, Info } from "lucide-react";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";

export default function FormAddReservarMesa({
  volverALista,
  onCloseModal,
  todasLasMesas = [],
  reservaToEdit = null, //  Recibimos el prop
}) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fecha_reserva: new Date().toISOString().split("T")[0],
      cantidad_personas: 1,
    },
  });

  // Rellenar el formulario si estamos en modo Edición
  useEffect(() => {
    if (reservaToEdit) {
      reset({
        ...reservaToEdit,
        hora_reserva: reservaToEdit.hora_reserva.substring(0, 5), // Quitar los segundos si los trae la BD
      });
    } else {
      // Limpiar formulario si es "Nueva Reserva"
      reset({
        nombre_cliente: "",
        fecha_reserva: new Date().toISOString().split("T")[0],
        hora_reserva: "",
        idMesa: "",
        cantidad_personas: 1,
        telefono_cliente: "",
        nota: "",
      });
    }
  }, [reservaToEdit, reset]);

  const fechaSeleccionada = useWatch({ control, name: "fecha_reserva" });
  const horaSeleccionada = useWatch({ control, name: "hora_reserva" });

  const { data: reservasActivas = [] } = useQuery({
    queryKey: ["reservasActivas"],
    queryFn: async () => {
      const response = await axiosInstance.get("/vender/reservas");
      return response.data.data || [];
    },
  });

  const isMesaReservadaEnRango = (idMesa) => {
    if (!fechaSeleccionada || !horaSeleccionada) return false;

    return reservasActivas.some((reserva) => {
      // Si estamos editando, ignoramos nuestra propia reserva en la validación
      if (reservaToEdit && reserva.id === reservaToEdit.id) return false;

      if (reserva.idMesa !== idMesa) return false;
      if (reserva.fecha_reserva !== fechaSeleccionada) return false;

      const horaReservaMinutos =
        parseInt(reserva.hora_reserva.split(":")[0]) * 60 +
        parseInt(reserva.hora_reserva.split(":")[1]);
      const horaSeleccionadaMinutos =
        parseInt(horaSeleccionada.split(":")[0]) * 60 +
        parseInt(horaSeleccionada.split(":")[1]);

      return Math.abs(horaReservaMinutos - horaSeleccionadaMinutos) < 120;
    });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let response;
      if (reservaToEdit) {
        //  Modo Edición (PUT)
        response = await axiosInstance.put(
          `/vender/reservas/${reservaToEdit.id}`,
          data,
        );
      } else {
        //  Modo Creación (POST)
        response = await axiosInstance.post("/vender/reservas", data);
      }

      if (response.data.success) {
        ToastAlert(
          "success",
          reservaToEdit ? "Reserva actualizada" : "Reserva creada",
        );
        queryClient.invalidateQueries(["reservasActivas"]);
        queryClient.invalidateQueries(["mesas"]);
        setTimeout(() => {
          volverALista();
        }, 150);
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      ToastAlert("error", "Error al guardar la reserva");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="d-flex flex-column h-100 bg-white"
    >
      <div className="p-4 flex-grow-1 overflow-auto">
        <div className="mb-4">
          <label className="small fw-bold  mb-1  d-block">
            Nombre del Cliente *
          </label>
          <input
            type="text"
            className={`form-control border-secondary bg-light ${errors.nombre_cliente ? "is-invalid" : ""}`}
            placeholder="Ej: Familia Pérez"
            {...register("nombre_cliente", { required: "Requerido" })}
          />
        </div>

        <div
          className="d-flex align-items-start gap-2 p-3 mb-4 rounded"
          style={{
            backgroundColor: "#f1f5f9",
            border: "1px solid #e2e8f0",
            color: "#475569",
          }}
        >
          <Info size={18} className="flex-shrink-0 mt-1" />
          <span style={{ fontSize: "0.85rem", lineHeight: "1.4" }}>
            El sistema bloquea la mesa por un rango de <strong>2 horas</strong>.
            Las mesas cruzadas no se podrán seleccionar.
          </span>
        </div>

        <div className="row mb-4">
          <div className="col-6">
            <label className="small fw-bold  mb-1  d-block">Fecha *</label>
            <input
              type="date"
              className={`form-control border-secondary bg-light ${errors.fecha_reserva ? "is-invalid" : ""}`}
              {...register("fecha_reserva", { required: "Requerida" })}
            />
          </div>
          <div className="col-6">
            <label className="small fw-bold  mb-1  d-block">Hora *</label>
            <input
              type="time"
              className={`form-control border-secondary bg-light ${errors.hora_reserva ? "is-invalid" : ""}`}
              {...register("hora_reserva", { required: "Requerida" })}
            />
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-8">
            <label className="small fw-bold  mb-1  d-block">Mesa *</label>
            <select
              className={`form-select border-secondary bg-light ${errors.idMesa ? "is-invalid" : ""}`}
              {...register("idMesa", { required: "Requerida" })}
              disabled={!fechaSeleccionada || !horaSeleccionada}
            >
              <option value="">Seleccionar mesa...</option>
              {todasLasMesas.map((m) => {
                const estaBloqueada = isMesaReservadaEnRango(m.id);
                return (
                  <option key={m.id} value={m.id} disabled={estaBloqueada}>
                    Mesa {m.numero} {estaBloqueada ? "(Ocupada)" : ""}
                  </option>
                );
              })}
            </select>
            {(!fechaSeleccionada || !horaSeleccionada) && (
              <small
                className="text-danger mt-1 d-block"
                style={{ fontSize: "0.7rem", fontWeight: "600" }}
              >
                * Selecciona fecha y hora primero
              </small>
            )}
          </div>
          <div className="col-4">
            <label className="small fw-bold  mb-1  d-block">Personas</label>
            <input
              type="number"
              min="1"
              className="form-control border-secondary bg-light"
              {...register("cantidad_personas")}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="small fw-bold  mb-1  d-block">
            Celular (Opcional)
          </label>
          <input
            type="text"
            className="form-control border-secondary bg-light"
            placeholder="Ej: 987654321"
            {...register("telefono_cliente")}
          />
        </div>

        <div className="mb-4">
          <label className="small fw-bold  mb-1  d-block">
            Notas (Opcional)
          </label>
          <textarea
            className="form-control border-secondary bg-light"
            rows="3"
            placeholder="Ej: Cumpleaños..."
            {...register("nota")}
          ></textarea>
        </div>
      </div>

      <div
        className="p-3 border-top d-flex justify-content-between flex-shrink-0"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <button
          type="button"
          className="btn-cerrar-modal border d-flex align-items-center gap-2 px-3 fw-bold text-dark shadow-sm"
          onClick={volverALista}
          disabled={loading}
        >
          <ArrowLeft size={16} /> Volver
        </button>
        {/* Cambié el color del botón para que combine con el botón "Comenzar a vender" de tu dashboard */}
        <button
          type="submit"
          className="btn-guardar d-flex align-items-center gap-2 px-4 fw-bold shadow-sm"
          disabled={loading}
        >
          {loading ? (
            "Procesando..."
          ) : (
            <>
              <Save size={16} /> {reservaToEdit ? "Actualizar" : "Guardar"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
