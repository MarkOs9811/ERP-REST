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
          (usuario) => usuario?.empleado?.cargo?.nombre === "delivery",
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
      <div className="container-fluid w-100   ">
        {/* Cabecera Forzada a la Izquierda para romper el centrado del Modal */}
        <div className="modal-header-custom  d-flex align-items-center gap-3 mb-4">
          <div className="w-10 h-10  bg-dark rounded-3 text-white flex items-center justify-center p-2">
            <UserPlus size={25} />
          </div>
          <div className="flex flex-col ">
            <h4 className="text-xl font-bold mb-0">Asignar Repartidor</h4>
            <p className="text-secondary ln-sm small">
              Pedido{" "}
              <span className="font-bold text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded">
                {dataPedido?.codigo_pedido || idPedido}
              </span>
            </p>
          </div>
        </div>

        {/* CONTENEDOR HORIZONTAL BLINDADO */}
        {dataPedido && (
          /* CONTENEDOR PADRE */
          <div
            className="d-flex flex-row w-100 gap-3 mb-4"
            style={{ display: "flex", flexDirection: "row", width: "100%" }}
          >
            {/* IZQUIERDA: Datos de Entrega */}
            <div
              className="w-50 border rounded-4 p-3 d-flex flex-column"
              style={{ width: "50%" }}
            >
              <h5 className="fw-bold text-danger small text-uppercase d-flex align-items-center gap-2 mb-3">
                {/* Cambiado de text-primary a text-danger para quitar el azul */}
                <Navigation size={18} className="" />
                Entrega a
              </h5>

              <div className="d-flex align-items-start mb-3">
                <div
                  className="d-flex align-items-center justify-content-center mb-0 alert border-danger bg-white text-danger p-2"
                  style={{ width: "36px", height: "36px" }}
                >
                  <User size={18} />
                </div>
                <div className="d-flex flex-column mx-2">
                  <span className="small fw-bolder text-dark">
                    {dataPedido.nombre_cliente || "Cliente"}
                  </span>
                  <span className="text-muted small">
                    {dataPedido.numero_cliente || "Sin teléfono"}
                  </span>
                </div>
              </div>

              {/* Agregado align-items-start para arreglar el ícono alargado */}
              <div className="d-flex align-items-start">
                <div
                  className="d-flex align-items-center justify-content-center mb-0 alert border-danger bg-white text-danger p-2"
                  style={{ width: "36px", height: "36px" }}
                >
                  <MapPin size={18} className="flex-shrink-0" />
                </div>
                <div className="d-flex flex-column mx-2">
                  <span className="small lh-sm text-dark mb-1 fw-light">
                    {dataPedido.direccion?.calle || "Dirección no especificada"}
                  </span>
                  {dataPedido.tipo_entrega && (
                    <span
                      className="fw-bold text-uppercase text-danger bg-danger bg-opacity-10 px-2 py-1 rounded border border-danger-subtle"
                      style={{ width: "max-content", fontSize: "10px" }}
                    >
                      {dataPedido.tipo_entrega}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* DERECHA: Resumen de Platos (Este lado estaba perfecto, lo mantengo igual) */}
            <div className="w-50 border rounded-4 p-3 d-flex flex-column  wh-100">
              <h5 className="fw-bold text-warning small text-uppercase d-flex align-items-center gap-2 mb-3">
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
                      className="d-flex align-items-start gap-2 text-start mb-1"
                    >
                      <span
                        className="small fw-bold flex-shrink-0"
                        style={{ color: "#ea580c" }}
                      >
                        {item.cantidad}x
                      </span>
                      <span className="small text-secondary lh-sm">
                        {item?.plato?.nombre || item.producto || "Plato"}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="small text-muted">Sin detalles.</span>
                )}
              </div>

              <div className="d-flex flex-row justify-content-between align-items-end border-top pt-2 mt-auto">
                <div className="d-flex flex-column text-start">
                  <span
                    className="fw-bold text-muted text-uppercase"
                    style={{ fontSize: "10px" }}
                  >
                    Envío
                  </span>
                  <span className="small fw-medium text-secondary">
                    S/ {Number(dataPedido.costo_envio || 0).toFixed(2)}
                  </span>
                </div>
                <div className="d-flex flex-column text-end">
                  <span
                    className="fw-bold text-muted text-uppercase"
                    style={{ fontSize: "10px" }}
                  >
                    Total
                  </span>
                  <span className="small fw-bold text-dark">
                    S/ {Number(dataPedido.total || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SELECTOR ABAJO (Bloque Completo) */}
        <div className="row border rounded p-3 m–0">
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
            Asignar a
          </label>

          {isLoading ? (
            <div className="w-full flex flex-row items-center gap-2 p-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 text-sm">
              <Loader2 className="animate-spin" size={16} /> Cargando
              repartidores...
            </div>
          ) : isError ? (
            <div className="w-full flex flex-row items-center gap-2 p-2.5 border border-red-200 bg-red-50 text-red-600 rounded-lg text-sm">
              <AlertCircle size={16} /> Error de conexión.
            </div>
          ) : (
            <div className="relative w-full">
              <select
                {...register("id_repartidor", {
                  required: "Selecciona un repartidor",
                })}
                className={`w-full  pl-3 form-select pr-8 py-2.5 border ${
                  errors.id_repartidor ? "border-red-400" : "border-slate-300"
                } rounded-lg bg-white text-sm text-slate-800 appearance-none focus:outline-none focus:border-slate-500 cursor-pointer`}
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
