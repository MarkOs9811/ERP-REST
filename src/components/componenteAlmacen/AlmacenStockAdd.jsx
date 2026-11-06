import axios from "axios";
import { useForm } from "react-hook-form";
import ToastAlert from "../componenteToast/ToastAlert";
import { useState } from "react";
import { Button } from "../ui/button";
import axiosInstance from "@/api/AxiosInstance";
import { useQueryClient } from "@tanstack/react-query";

export function AlmacenStockAdd({
  handleCloseModal,
  producto,
  onAlmacenUpdate,
}) {
  const [cantidad, setCantidad] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [cantidadError, setCantidadError] = useState(false);

  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (!producto) {
    return <div>Cargando...</div>;
  }

  const validateCantidad = () => {
    if (cantidad <= 0 || isNaN(cantidad)) {
      setCantidadError(true);
      return false;
    }
    setCantidadError(false);
    return true;
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("idProductoEdit", producto.id);
    formData.append("stockActual", producto.cantidad);
    formData.append("cantidadIngresar", cantidad);

    if (pdfFile) {
      formData.append("pdf_file", pdfFile);
    }
    if (imageFile) {
      formData.append("image_file", imageFile);
    }

    try {
      const response = await axiosInstance.post("/almacen/add-stock", formData);

      // Validamos correctamente el estado que viene del backend
      if (response.data.success === "true" || response.data.success === true) {
        ToastAlert(
          "success",
          response.data.message || "Stock actualizado correctamente",
        );

        // Pequeño delay para permitir que el ToastAlert se dibuje antes de destruir el modal
        setTimeout(() => {
          if (typeof handleCloseModal === "function") {
            handleCloseModal();
          }
          if (typeof onAlmacenUpdate === "function") {
            onAlmacenUpdate();
          }
        }, 100);

        queryClient.invalidateQueries({ queryKey: ["almacen"] });
      } else {
        ToastAlert(
          "error",
          response.data.message || "No se pudo actualizar el stock.",
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al actualizar el stock.";
      ToastAlert("error", errorMessage);
      console.error("Error al actualizar el stock:", error);
    }
  };

  return (
    <div className="p-3">
      <div
        className="relative w-full rounded-lg px-4 py-3 text-sm border-destructive/30 bg-destructive/10 text-destructive flex items-center"
        role="alert"
      >
        <span className="me-2">
          <i className="fas fa-exclamation-circle"></i>
        </span>
        La información del documento debe reflejarse aquí. Para agregar un nuevo
        producto, ingrese{" "}
        <a href="#" className="no-underline">
          aquí
        </a>
        .
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Nombres del Producto */}
        <div className="mb-3">
          <label
            htmlFor="productoNombre"
            className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-muted-foreground"
          >
            Nombres Producto/activo
          </label>
          <input
            type="text"
            id="productoNombre"
            className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={producto.nombre}
            readOnly
          />
        </div>

        {/* Categoría, Unidad de medida, Proveedor */}
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-full md:col-span-4">
            <label
              htmlFor="productoCategoria"
              className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-muted-foreground"
            >
              Categoría
            </label>
            <select
              className="h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              id="productoCategoria"
              disabled
            >
              <option>{producto.categoria?.nombre || "Sin categoría"}</option>
            </select>
          </div>
          <div className="col-span-full md:col-span-4">
            <label
              htmlFor="productoUnidad"
              className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-muted-foreground"
            >
              Unidad de medida
            </label>
            <select
              className="h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              id="productoUnidad"
              disabled
            >
              <option>{producto.unidad?.nombre || "Sin unidad"}</option>
            </select>
          </div>
          <div className="col-span-full md:col-span-4">
            <label
              htmlFor="productoProveedor"
              className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-muted-foreground"
            >
              Proveedor
            </label>
            <select
              className="h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              id="productoProveedor"
              disabled
            >
              <option>{producto.proveedor?.nombre || "Sin proveedor"}</option>
            </select>
          </div>
        </div>

        {/* Stock actual */}
        <div className="my-3">
          <label
            htmlFor="stockActual"
            className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-muted-foreground"
          >
            Stock actual
          </label>
          <input
            type="number"
            id="stockActual"
            className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={producto.cantidad}
            readOnly
          />
        </div>

        {/* Cantidad a ingresar */}
        <div className="mb-3">
          <label
            htmlFor="nuevaCantidad"
            className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-muted-foreground"
          >
            Cantidad a ingresar
          </label>
          <div className="flex w-full items-stretch">
            <input
              type="number"
              id="nuevaCantidad"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                cantidadError
                  ? "border-destructive focus-visible:ring-destructive"
                  : "input-add-stock"
              }`}
              placeholder="Ingrese cantidad ingresada"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              onBlur={validateCantidad}
              required
            />
            {cantidadError && (
              <div className="text-sm text-destructive">
                <i className="fas fa-exclamation-circle"></i> La cantidad
                ingresada es inválida.
              </div>
            )}
          </div>
        </div>

        {/* Archivos */}
        <div className="mb-3">
          <label
            htmlFor="archivoPDF"
            className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-muted-foreground"
          >
            Seleccionar PDF
          </label>
          <input
            className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            type="file"
            id="archivoPDF"
            accept="application/pdf"
            {...register("pdf")}
            onChange={(e) => {
              register("pdf").onChange(e);
              setPdfFile(e.target.files[0]);
            }}
          />
          {errors.pdf && (
            <p className="text-destructive">{errors.pdf.message}</p>
          )}

          <small className="text-emerald-600 dark:text-emerald-400">
            <i className="fas fa-info-circle"></i> Cargar archivo firmado por
            Administrador/finanzas
          </small>
        </div>

        <div className="mb-3">
          <label
            htmlFor="archivoFirma"
            className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-muted-foreground"
          >
            Cargar firma
          </label>
          <input
            className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            type="file"
            id="archivoFirma"
            accept="image/*"
            {...register("firma")}
            onChange={(e) => {
              register("firma").onChange(e);
              setImageFile(e.target.files[0]);
            }}
          />
          {errors.firma && (
            <p className="text-destructive">{errors.firma.message}</p>
          )}

          <small className="text-amber-600 dark:text-amber-400">
            <i className="fas fa-exclamation-circle"></i> El archivo cargado no
            debe ser pesado
          </small>
        </div>

        {/* Botones */}
        <div className="flex justify-end">
          <Button
            type="button"
            className="btn-cerrar-modal me-2 rounded-full"
            onClick={handleCloseModal} // Corregido: Sin paréntesis
            variant="default"
          >
            <i className="fas fa-times"></i> Cerrar
          </Button>
          <Button
            type="submit"
            className="btn-guardar rounded-full"
            variant="default"
          >
            <i className="fas fa-save"></i> Firmar y actualizar
          </Button>
        </div>
      </form>
    </div>
  );
}
