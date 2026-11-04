import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, Info } from "lucide-react";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";
import { Button } from "../../ui/button";

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
      className="flex flex-col h-full bg-background"
    >
      <div className="p-4 grow overflow-auto">
        <div className="mb-4">
          <label className="text-sm font-bold mb-1 block">
            Nombre del Cliente *
          </label>
          <input
            type="text"
            className={`h-9 w-full rounded-md px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-secondary bg-muted ${errors.nombre_cliente ? "border-destructive focus-visible:ring-destructive" : ""}`}
            placeholder="Ej: Familia Pérez"
            {...register("nombre_cliente", { required: "Requerido" })}
          />
        </div>

        <div
          className="flex items-start gap-2 p-3 mb-4 rounded"
          style={{
            backgroundColor: "#f1f5f9",
            border: "1px solid #e2e8f0",
            color: "#475569",
          }}
        >
          <Info size={18} className="shrink-0 mt-1" />
          <span style={{ fontSize: "0.85rem", lineHeight: "1.4" }}>
            El sistema bloquea la mesa por un rango de <strong>2 horas</strong>.
            Las mesas cruzadas no se podrán seleccionar.
          </span>
        </div>

        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-6">
            <label className="text-sm font-bold mb-1 block">Fecha *</label>
            <input
              type="date"
              className={`h-9 w-full rounded-md px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-secondary bg-muted ${errors.fecha_reserva ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("fecha_reserva", { required: "Requerida" })}
            />
          </div>
          <div className="col-span-6">
            <label className="text-sm font-bold mb-1 block">Hora *</label>
            <input
              type="time"
              className={`h-9 w-full rounded-md px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-secondary bg-muted ${errors.hora_reserva ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("hora_reserva", { required: "Requerida" })}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-8">
            <label className="text-sm font-bold mb-1 block">Mesa *</label>
            <select
              className={`h-9 w-full appearance-auto rounded-md px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-secondary bg-muted ${errors.idMesa ? "border-destructive focus-visible:ring-destructive" : ""}`}
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
                className="text-destructive mt-1 block"
                style={{ fontSize: "0.7rem", fontWeight: "600" }}
              >
                * Selecciona fecha y hora primero
              </small>
            )}
          </div>
          <div className="col-span-4">
            <label className="text-sm font-bold mb-1 block">Personas</label>
            <input
              type="number"
              min="1"
              className="h-9 w-full rounded-md px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-secondary bg-muted"
              {...register("cantidad_personas")}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-bold mb-1 block">
            Celular (Opcional)
          </label>
          <input
            type="text"
            className="h-9 w-full rounded-md px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-secondary bg-muted"
            placeholder="Ej: 987654321"
            {...register("telefono_cliente")}
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-bold mb-1 block">
            Notas (Opcional)
          </label>
          <textarea
            className="h-9 w-full rounded-md px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-secondary bg-muted"
            rows="3"
            placeholder="Ej: Cumpleaños..."
            {...register("nota")}
          ></textarea>
        </div>
      </div>

      <div className="p-3 border-t flex justify-between shrink-0">
        <Button
          type="button"
          className="btn-cerrar flex items-center gap-2 px-3 font-bold text-foreground shadow-sm"
          onClick={volverALista}
          disabled={loading}
          variant="default"
        >
          <ArrowLeft size={16} /> Volver
        </Button>
        {/* Cambié el color del botón para que combine con el botón "Comenzar a vender" de tu dashboard */}
        <Button
          type="submit"
          className="btn-guardar flex items-center gap-2 px-4 font-bold shadow-sm"
          disabled={loading}
          variant="default"
        >
          {loading ? (
            "Procesando..."
          ) : (
            <>
              <Save size={16} /> {reservaToEdit ? "Actualizar" : "Guardar"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
