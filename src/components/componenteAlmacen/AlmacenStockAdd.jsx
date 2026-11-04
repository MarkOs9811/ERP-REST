import axios from "axios";
import { useForm } from "react-hook-form";
import ToastAlert from "../componenteToast/ToastAlert";
import { useState } from "react";
import { Button } from "../ui/button";
export function AlmacenStockAdd({
  handleCloseModal,
  producto,
  onAlmacenUpdate,
}) {
  const [cantidad, setCantidad] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [cantidadError, setCantidadError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (!producto) {
    return <div>Cargando...</div>; // O cualquier otro mensaje de carga
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
    // Ahora data contiene los valores del formulario procesados por react-hook-form

    const formData = new FormData();
    formData.append("idProductoEdit", producto.id);
    formData.append("stockActual", producto.cantidad);
    formData.append("cantidadIngresar", cantidad);
    formData.append("pdf_file", pdfFile);
    formData.append("image_file", imageFile);
    const token = localStorage.getItem("token");
    if (!token) {
      ToastAlert("error", "No estás autenticado. Por favor, inicia sesión.");
      return; // Detén la ejecución si no hay token.
    }

    try {
      const response = await axios.post(
        "http://erp-api.test/api/almacen/add-stock",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.status === "success") {
        ToastAlert("success", response.data.message); // Mostrar mensaje de éxito
        handleCloseModal();
        onAlmacenUpdate();
      } else {
        ToastAlert("error", "Algo salió mal, intenta nuevamente.");
      }
    } catch (error) {
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
              <option>{producto.categoria.nombre || "Sin categoría"}</option>
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
              <option>{producto.unidad.nombre || "Sin unidad"}</option>
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
              <option>{producto.proveedor.nombre || "Sin proveedor"}</option>
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
              onBlur={validateCantidad} // Validar cuando el campo pierde el foco
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
            {...register("pdf", {
              required: "El archivo PDF es obligatorio",
              validate: (value) =>
                value?.length > 0 || "Debe cargar un archivo PDF",
            })}
            onChange={(e) => setPdfFile(e.target.files[0])}
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
            {...register("firma", {
              required: "La firma es obligatoria",
              validate: (value) =>
                value?.length > 0 || "Debe cargar una imagen de firma",
            })}
            onChange={(e) => setImageFile(e.target.files[0])}
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
            onClick={handleCloseModal}
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
