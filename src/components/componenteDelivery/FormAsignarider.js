import React, { forwardRef, useImperativeHandle } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { GetUsuarios } from "../../service/GetUsuarios";
import { UserPlus, ChevronDown, AlertCircle, Loader2 } from "lucide-react";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";

export const FormAsignarRider = forwardRef(
  ({ idPedido, handleCloseModal }, ref) => {
    const queryClient = useQueryClient();

    // 1. Configuración de React Hook Form
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();

    // 2. Fetch de Usuarios (Repartidores)
    const {
      data: repartidores,
      isLoading,
      isError,
    } = useQuery({
      queryKey: ["repartidores"],
      queryFn: GetUsuarios,
    });

    const usuariosRepartidores = repartidores
      ? repartidores.filter(
          (usuario) => usuario?.empleado?.cargo?.nombre === "delivery",
        )
      : [];

    // 3. Mutación para asignar el rider
    const asignarRiderMutation = useMutation({
      mutationFn: async (data) => {
        // CORREGIDO: Ruta sin parámetro en la URL y enviando el payload exacto que espera Laravel
        const response = await axiosInstance.post(
          `/pedidosWeb/asignarRepartidor`,
          {
            idPedido: idPedido, // Viene de las props del componente
            idDeliveryRider: data.id_repartidor, // Viene del React Hook Form
          },
        );
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["listaPedidosListos"] });
        queryClient.invalidateQueries({ queryKey: ["listaPedidosEnCamino"] });
        queryClient.invalidateQueries({ queryKey: ["listaPedidosProceso"] });
        ToastAlert("success", "Rider asignado exitosamente");
        handleCloseModal();
      },
      onError: (error) => {
        console.error("Error al asignar rider:", error);
      },
    });

    // 4. Función de envío (se ejecuta tras la validación)
    const onSubmit = (data) => {
      asignarRiderMutation.mutate({
        id_repartidor: data.id_repartidor,
      });
    };

    // --- MAGIA AQUÍ ---
    // Exponemos la función submitForm al componente padre (el Modal)
    useImperativeHandle(ref, () => ({
      submitForm: () => {
        // Esto ejecuta la validación de React Hook Form y luego onSubmit
        handleSubmit(onSubmit)();
      },
      isSaving: asignarRiderMutation.isPending,
    }));

    return (
      <div className="p-4 bg-white font-sans">
        {/* Cabecera Centrada y Profesional */}
        <div className="mb-6 text-center">
          <div className="mx-auto w-14 h-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3">
            <UserPlus size={28} strokeWidth={2} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Asignar Pedido #{idPedido}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Selecciona un rider de la flota disponible para realizar la entrega.
          </p>
        </div>

        <form className="space-y-4">
          {/* Campo Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Personal de Delivery
            </label>

            {isLoading ? (
              <div className="w-full flex justify-center items-center gap-2 p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 text-sm">
                <Loader2 className="animate-spin text-orange-500" size={16} />
                Cargando flota activa...
              </div>
            ) : isError ? (
              <div className="w-full flex items-center gap-2 p-3 border border-red-200 bg-red-50 text-red-700 rounded-xl text-sm">
                <AlertCircle size={16} />
                Error al conectar con el servicio de usuarios.
              </div>
            ) : (
              <div className="relative">
                <select
                  {...register("id_repartidor", {
                    required: "Debes seleccionar un repartidor.",
                  })}
                  className={`w-full pl-4 pr-10 py-3 border ${
                    errors.id_repartidor
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-white"
                  } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none cursor-pointer text-gray-800 text-sm font-medium`}
                  disabled={asignarRiderMutation.isPending}
                >
                  <option value="">-- Seleccionar --</option>
                  {usuariosRepartidores.map((rider) => (
                    <option key={rider.id} value={rider.id}>
                      {rider.empleado.persona?.nombre}{" "}
                      {rider.empleado.persona?.apellidos}
                    </option>
                  ))}
                </select>

                {/* Icono de flecha Lucide Outline */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                  <ChevronDown size={18} strokeWidth={2.5} />
                </div>
              </div>
            )}

            {/* Mensaje de validación centrado con Lucide */}
            {errors.id_repartidor && (
              <p className="mt-2 text-xs font-medium text-red-600 flex items-center justify-center gap-1.5">
                <AlertCircle size={14} />
                {errors.id_repartidor.message}
              </p>
            )}

            {usuariosRepartidores.length === 0 && !isLoading && !isError && (
              <p className="mt-2 text-xs text-orange-700 text-center font-medium bg-orange-50 p-2 rounded-lg">
                No hay repartidores configurados con el cargo 'delivery'.
              </p>
            )}
          </div>
        </form>
      </div>
    );
  },
);
