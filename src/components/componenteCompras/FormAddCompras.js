import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { GetPorveedores } from "../../service/GetPorveedores";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";

export function FormAddCompras() {
  const queryClient = useQueryClient();
  const {
    data: proveedoresData,
    isLoading: proveedoresLoading,
    error: proveedoresError,
  } = useQuery({
    queryKey: ["proveedores"],
    queryFn: GetPorveedores,
    retry: false,
    refeftchOnWindowFocus: false,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const metodoPago = watch("metodoPago"); // 👈 observamos el campo tipo de compra

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("idProveedor", data.idProveedor);
      formData.append("fecha_compra", data.fecha_compra);
      formData.append("totalPagado", data.totalPagado); // 👈 aquí ya es number
      formData.append("metodoPago", data.metodoPago);
      formData.append("numeroCuotas", data.numeroCuotas || "");
      formData.append("observaciones", data.observaciones || "");

      if (data.documento?.[0]) {
        formData.append("documento", data.documento[0]);
      }

      const response = await axiosInstance.post("/compras", formData);

      if (response.data.success) {
        ToastAlert("success", "Compra registrada con éxito");
        queryClient.invalidateQueries({ queryKey: ["compras"] });
        reset();
      } else {
        ToastAlert("error", "Error al registrar la compra");
      }
    } catch (error) {
      if (error.response) {
        ToastAlert(
          "error",
          error.response.data.message || "Error en el servidor"
        );
      } else {
        ToastAlert("error", "Error de red o del servidor");
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Proveedor */}
        <div className="mb-3">
          <label className="form-label small fw-semibold">Proveedor</label>
          <select
            className={`form-select ${errors.idProveedor ? "is-invalid" : ""}`}
            {...register("idProveedor", {
              required: "Seleccione un proveedor",
            })}
          >
            <option value="">Seleccione...</option>
            {proveedoresData &&
              proveedoresData.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.nombre}
                </option>
              ))}
          </select>
          {errors.idProveedor && (
            <div className="invalid-feedback">{errors.idProveedor.message}</div>
          )}
        </div>

        {/* Fecha de Compra */}
        <div className="mb-3">
          <label className="form-label small fw-semibold">
            Fecha de Compra
          </label>
          <input
            type="date"
            className={`form-control ${
              errors.fecha_compra ? "is-invalid" : ""
            }`}
            {...register("fecha_compra", {
              required: "La fecha es obligatoria",
            })}
          />
          {errors.fecha_compra && (
            <div className="invalid-feedback">
              {errors.fecha_compra.message}
            </div>
          )}
        </div>

        {/* Total Pagado */}
        <div className="mb-3">
          <label className="form-label small fw-semibold">
            Total Pagado (S/.)
          </label>
          <input
            type="number"
            step="0.01"
            className={`form-control ${errors.totalPagado ? "is-invalid" : ""}`}
            {...register("totalPagado", {
              required: "El total es obligatorio",
              min: { value: 0.01, message: "Debe ser mayor a 0" },
              valueAsNumber: true,
            })}
          />
          {errors.totalPagado && (
            <div className="invalid-feedback">{errors.totalPagado.message}</div>
          )}
        </div>

        {/* Documento de Compra */}
        <div className="mb-3">
          <label className="form-label small fw-semibold">
            Documento de Compra (PDF, JPG, PNG)
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className={`form-control ${errors.documento ? "is-invalid" : ""}`}
            {...register("documento", {
              required: "Debe subir el documento de compra",
            })}
          />
          {errors.documento && (
            <div className="invalid-feedback">{errors.documento.message}</div>
          )}
        </div>

        {/* Observaciones */}
        <div className="mb-3">
          <label className="form-label small fw-semibold">Observaciones</label>
          <textarea
            rows="3"
            className="form-control"
            placeholder="Ingrese observaciones (opcional)..."
            {...register("observaciones")}
          ></textarea>
        </div>

        {/* Tipo de Compra */}
        <div className="mb-3">
          <label className="form-label small fw-semibold">Tipo de Compra</label>
          <select
            className={`form-select ${errors.metodoPago ? "is-invalid" : ""}`}
            {...register("metodoPago", {
              required: "Seleccione el tipo de compra",
            })}
          >
            <option value="">Seleccione...</option>
            <option value="contado">Contado</option>
            <option value="credito">Crédito</option>
          </select>
          {errors.metodoPago && (
            <div className="invalid-feedback">{errors.metodoPago.message}</div>
          )}
        </div>

        {/* Número de Cuotas */}
        <div className="mb-3">
          <label className="form-label small fw-semibold">
            Número de Cuotas
          </label>
          <input
            type="number"
            step="1"
            className={`form-control ${
              errors.numeroCuotas ? "is-invalid" : ""
            }`}
            {...register("numeroCuotas", {
              required:
                metodoPago === "credito"
                  ? "El número de cuotas es obligatorio para compras a crédito"
                  : false,
              min: { value: 1, message: "Debe ser al menos 1" },
              valueAsNumber: true,
            })}
            disabled={metodoPago !== "credito"}
            onKeyDown={(e) => {
              if ([".", ",", "e"].includes(e.key)) {
                e.preventDefault();
              }
            }}
          />
          {errors.numeroCuotas && (
            <div className="invalid-feedback">
              {errors.numeroCuotas.message}
            </div>
          )}
        </div>

        {/* Botón */}
        <div className="d-grid">
          <button type="submit" className="btn-guardar">
            Registrar Compra
          </button>
        </div>
      </form>
    </div>
  );
}
