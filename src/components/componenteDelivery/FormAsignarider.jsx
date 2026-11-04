import React, { forwardRef, useImperativeHandle } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { GetUsuarios } from "../../service/GetUsuarios";
import {
  UserPlus,
  AlertCircle,
  Loader2,
  MapPin,
  ShoppingBag,
  User,
  Navigation,
} from "lucide-react";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";

export const FormAsignarRider = forwardRef(
  ({ idPedido, dataPedido = null, handleCloseModal }, ref) => {
    const queryClient = useQueryClient();

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();

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
          (usuario) =>
            usuario?.empleado?.cargo?.nombre === "conductor" ||
            usuario?.empleado?.cargo?.nombre === "repartidor" ||
            usuario?.empleado?.cargo?.nombre === "delivery",
        )
      : [];

    const asignarRiderMutation = useMutation({
      mutationFn: async (data) => {
        const response = await axiosInstance.post(
          `/pedidosWeb/asignarRepartidor`,
          {
            idPedido: idPedido,
            idDeliveryRider: data.id_repartidor,
          },
        );
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["pedidosAsignadosRider"] });
        queryClient.invalidateQueries({ queryKey: ["listaPedidosListos"] });
        queryClient.invalidateQueries({ queryKey: ["listaPedidosEnCamino"] });
        queryClient.invalidateQueries({ queryKey: ["listaPedidosProceso"] });
        ToastAlert("success", "Rider asignado exitosamente");
        handleCloseModal();
      },
      onError: (error) => {
        ToastAlert("error", "Error al asignar rider", error);
        console.error("Error al asignar rider:", error);
      },
    });

    useImperativeHandle(ref, () => ({
      submitForm: () => {
        return new Promise((resolve) => {
          handleSubmit(
            async (data) => {
              try {
                // OJO AQUÍ: Usamos mutateAsync para poder hacer el await a tu API
                await asignarRiderMutation.mutateAsync({
                  id_repartidor: data.id_repartidor,
                });
                resolve(true); //
              } catch (error) {
                resolve(false);
              }
            },
            () => {
              resolve(false); // Retorna false para que el loader se apague y el modal siga abierto mostrando el error en rojo
            },
          )();
        });
      },
      isSaving: asignarRiderMutation.isPending,
    }));

    const detallesPlatos = dataPedido?.detalles_pedido || [];

    return (
      <div className="w-full">
        {/* Cabecera ARREGLADA: Solo cambiamos esto */}
        <div className="flex items-center gap-3 mb-4 p-3">
          <div
            className="rounded-md flex items-center justify-center shrink-0"
            style={{ width: "48px", height: "48px" }}
          >
            <UserPlus size={24} />
          </div>
          <div className="flex flex-col justify-center">
            <h4 className="text-xl font-bold mb-0 leading-none">
              Asignar Repartidor
            </h4>
            <p className="text-muted-foreground text-sm mb-0 mt-1">
              Pedido{" "}
              <span className="font-bold text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded">
                {dataPedido?.codigo_pedido || idPedido}
              </span>
            </p>
          </div>
        </div>

        {/* CONTENEDOR HORIZONTAL BLINDADO (Tu código exacto) */}
        {dataPedido && (
          /* CONTENEDOR PADRE */
          <div
            className="flex flex-row w-full gap-3 mb-4"
            style={{ display: "flex", flexDirection: "row", width: "100%" }}
          >
            {/* IZQUIERDA: Datos de Entrega */}
            <div
              className="w-1/2 rounded-lg p-3 flex flex-col"
              style={{ width: "50%" }}
            >
              <h5 className="font-bold text-sm uppercase flex items-center gap-2 mb-3">
                {/* Cambiado de text-primary a text-danger para quitar el azul */}
                <Navigation size={18} className="" />
                Entrega a
              </h5>

              <div className="flex items-start mb-3">
                <div
                  className="flex items-center justify-center mb-0 relative w-full rounded-lg text-sm border-destructive bg-background text-destructive p-2"
                  style={{ width: "36px", height: "36px" }}
                >
                  <User size={18} />
                </div>
                <div className="flex flex-col mx-2">
                  <span className="text-sm font-extrabold text-foreground">
                    {dataPedido.nombre_cliente || "Cliente"}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {dataPedido.numero_cliente || "Sin teléfono"}
                  </span>
                </div>
              </div>

              {/* Agregado align-items-start para arreglar el ícono alargado */}
              <div className="flex items-start">
                <div
                  className="flex items-center justify-center mb-0 relative w-full rounded-lg text-sm border-destructive bg-background text-destructive p-2"
                  style={{ width: "36px", height: "36px" }}
                >
                  <MapPin size={18} className="shrink-0" />
                </div>
                <div className="flex flex-col mx-2">
                  <span className="text-sm leading-tight text-foreground mb-1 font-light">
                    {dataPedido.direccion?.calle || "Dirección no especificada"}
                  </span>
                  {dataPedido.tipo_entrega && (
                    <span
                      className="font-bold text-destructive bg-destructive/10 px-2 py-1 rounded border-danger-subtle"
                      style={{ width: "max-content", fontSize: "10px" }}
                    >
                      {dataPedido.tipo_entrega}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* DERECHA: Resumen de Platos (Este lado estaba perfecto, lo mantengo igual) */}
            <div className="w-1/2 rounded-lg p-3 flex flex-col w-full h-full">
              <h5 className="font-bold dark:text-amber-400 text-sm uppercase flex items-center gap-2 mb-3">
                <ShoppingBag size={18} />
                Detalle
              </h5>

              <div
                className="overflow-y-auto mb-3 pe-1 custom-scrollbar"
                style={{ maxHeight: "6rem" }}
              >
                {detallesPlatos.length > 0 ? (
                  detallesPlatos.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-left mb-1"
                    >
                      <span
                        className="text-sm font-bold shrink-0"
                        style={{ color: "#ea580c" }}
                      >
                        {item.cantidad}x
                      </span>
                      <span className="text-sm text-muted-foreground leading-tight">
                        {item?.plato?.nombre || item.producto || "Plato"}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Sin detalles.
                  </span>
                )}
              </div>

              <div className="flex flex-row justify-between items-end border-t pt-2 mt-auto">
                <div className="flex flex-col text-left">
                  <span
                    className="font-bold uppercase"
                    style={{ fontSize: "10px" }}
                  >
                    Envío
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    S/ {Number(dataPedido.costo_envio || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span
                    className="font-bold uppercase"
                    style={{ fontSize: "10px" }}
                  >
                    Total
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    S/ {Number(dataPedido.total || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SELECTOR ABAJO (Tu código exacto, solo corregí el m–0 a m-0) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4border rounded p-3 m-0">
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
            Asignar a
          </label>

          {isLoading ? (
            <div className="w-full flex flex-row items-center gap-2 p-2.5 border-slate-200 rounded-lg bg-slate-50 text-slate-500 text-sm">
              <Loader2 className="animate-spin" size={16} /> Cargando
              repartidores...
            </div>
          ) : isError ? (
            <div className="w-full flex flex-row items-center gap-2 p-2.5 border-red-200 bg-red-50 text-red-600 rounded-lg text-sm">
              <AlertCircle size={16} /> Error de conexión.
            </div>
          ) : (
            <div className="relative w-full">
              <select
                {...register("id_repartidor", {
                  required: "Selecciona un repartidor",
                })}
                className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pr-8 py-2.5 ${
                  errors.id_repartidor ? "border-red-400" : "border-slate-300"
                } rounded-lg bg-background text-sm text-slate-800 appearance-auto focus:outline-none focus:border-slate-500 cursor-pointer`}
                disabled={asignarRiderMutation.isPending}
              >
                <option value="">-- Selecciona el rider en turno --</option>
                {usuariosRepartidores.map((rider) => (
                  <option key={rider.id} value={rider.id}>
                    {rider.empleado.persona?.nombre}{" "}
                    {rider.empleado.persona?.apellidos}
                  </option>
                ))}
              </select>
            </div>
          )}
          {errors.id_repartidor && (
            <p className="text-xs font-bold text-red-500 mt-1">
              {errors.id_repartidor.message}
            </p>
          )}
        </div>
      </div>
    );
  },
);
