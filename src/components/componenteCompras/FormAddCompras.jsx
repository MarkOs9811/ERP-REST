import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";
import { GetProveedores } from "../../service/GetProveedores";
import { Button } from "../ui/button";

export function FormAddCompras() {
  const queryClient = useQueryClient();
  const {
    data: proveedoresData,
    isLoading: proveedoresLoading,
    error: proveedoresError,
  } = useQuery({
    queryKey: ["proveedores"],
    queryFn: GetProveedores,
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
          error.response.data.message || "Error en el servidor",
        );
      } else {
        ToastAlert("error", "Error de red o del servidor");
      }
    }
  };

  return (
    <div className="p-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Proveedor */}
        <div className="mb-3">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold">
            Proveedor
          </label>
          <select
            className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.idProveedor ? "border-destructive focus-visible:ring-destructive" : ""}`}
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
            <div className="text-sm text-destructive">
              {errors.idProveedor.message}
            </div>
          )}
        </div>

        {/* Fecha de Compra */}
        <div className="mb-3">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold">
            Fecha de Compra
          </label>
          <input
            type="date"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
              errors.fecha_compra
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }`}
            {...register("fecha_compra", {
              required: "La fecha es obligatoria",
            })}
          />
          {errors.fecha_compra && (
            <div className="text-sm text-destructive">
              {errors.fecha_compra.message}
            </div>
          )}
        </div>

        {/* Total Pagado */}
        <div className="mb-3">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold">
            Total Pagado (S/.)
          </label>
          <input
            type="number"
            step="0.01"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.totalPagado ? "border-destructive focus-visible:ring-destructive" : ""}`}
            {...register("totalPagado", {
              required: "El total es obligatorio",
              min: { value: 0.01, message: "Debe ser mayor a 0" },
              valueAsNumber: true,
            })}
          />
          {errors.totalPagado && (
            <div className="text-sm text-destructive">
              {errors.totalPagado.message}
            </div>
          )}
        </div>

        {/* Documento de Compra */}
        <div className="mb-3">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold">
            Documento de Compra (PDF, JPG, PNG)
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.documento ? "border-destructive focus-visible:ring-destructive" : ""}`}
            {...register("documento", {
              required: "Debe subir el documento de compra",
            })}
          />
          {errors.documento && (
            <div className="text-sm text-destructive">
              {errors.documento.message}
            </div>
          )}
        </div>

        {/* Observaciones */}
        <div className="mb-3">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold">
            Observaciones
          </label>
          <textarea
            rows="3"
            className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Ingrese observaciones (opcional)..."
            {...register("observaciones")}
          ></textarea>
        </div>

        {/* Tipo de Compra */}
        <div className="mb-3">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold">
            Tipo de Compra
          </label>
          <select
            className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.metodoPago ? "border-destructive focus-visible:ring-destructive" : ""}`}
            {...register("metodoPago", {
              required: "Seleccione el tipo de compra",
            })}
          >
            <option value="">Seleccione...</option>
            <option value="contado">Contado</option>
            <option value="credito">Crédito</option>
          </select>
          {errors.metodoPago && (
            <div className="text-sm text-destructive">
              {errors.metodoPago.message}
            </div>
          )}
        </div>

        {/* Número de Cuotas */}
        <div className="mb-3">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold">
            Número de Cuotas
          </label>
          <input
            type="number"
            step="1"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
              errors.numeroCuotas
                ? "border-destructive focus-visible:ring-destructive"
                : ""
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
            <div className="text-sm text-destructive">
              {errors.numeroCuotas.message}
            </div>
          )}
        </div>

        {/* Botón */}
        <div className="grid">
          <Button type="submit" className="btn-guardar" variant="default">
            Registrar Compra
          </Button>
        </div>
      </form>
    </div>
  );
}
