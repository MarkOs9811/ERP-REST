import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  FileEdit,
  Hash,
  Tag,
  Phone,
  ListChecks,
} from "lucide-react";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetCategoria } from "../../service/serviceAlmacen/GetCategoria";
import { GetAreas } from "../../service/GetAreas";
import { GetUnidades } from "../../service/serviceAlmacen/GetUnidades";
import { Button } from "../ui/button";

export function FormEditarSolicitud({ dataSolicitud, onClose }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      nombre_producto: dataSolicitud?.nombre_producto || "",
      cantidad: dataSolicitud?.cantidad || "",
      idUnidad: dataSolicitud?.idUnidadMedida || "",
      marcaProd: dataSolicitud?.marcaProd || "",
      motivo: dataSolicitud?.motivo || "",
      descripcion: dataSolicitud?.descripcion || "",
      prioridad: dataSolicitud?.prioridad || "",
      precio_estimado: dataSolicitud?.precio_estimado || "",
      uso_previsto: dataSolicitud?.uso_previsto || "",
      nombre_solicitante: dataSolicitud?.nombre_solicitante || "",
      correo_electronico: dataSolicitud?.correo_electronico || "",
      telefono: dataSolicitud?.telefono || "",
      idArea: dataSolicitud?.area?.id || "", //
      idCategoria: dataSolicitud?.idCategoria || "",
    },
  });

  const {
    data: categorias,
    isLoading: loadingCategorias,
    error: errorCategorias,
  } = useQuery({
    queryKey: ["categorias"],
    queryFn: GetCategoria,
    retry: false,
    onError: (error) => {
      console.error("Error al cargar las categorías:", error);
      ToastAlert("error", "Error al cargar las categorías");
    },
  });

  const {
    data: areasResponse,
    isLoading: loadingAreas,
    error: errorAreas,
  } = useQuery({
    queryKey: ["areas"],
    queryFn: GetAreas,
    retry: false,
    onError: (error) => {
      console.error("Error al cargar las Areas:", error);
      ToastAlert("error", "Error al cargar las Areas");
    },
  });
  const areas = areasResponse?.data || [];

  const {
    data: UmedidasResponse,
    isLoading: loadingUmedidas,
    error: errorUmedidas,
  } = useQuery({
    queryKey: ["umedidas"],
    queryFn: GetUnidades,
    retry: false,
    onError: (error) => {
      console.error("Error al cargar las unidades de medida:", error);
      ToastAlert("error", "Error al cargar las unidades de medida");
    },
  });
  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.put(
        `/solicitudes/${dataSolicitud.id}`,
        data,
      );
      if (response.data.success) {
        onClose && onClose();

        ToastAlert("success", "Solicitud actualizada con éxito");
        queryClient.invalidateQueries(["misSolicitudes"]);
        return true;
      } else {
        ToastAlert("error", "Error al actualizar la solicitud");
        return false;
      }
    } catch (error) {
      ToastAlert("error", "Error", error.message);
      console.error("Error al enviar los datos:", error);
      return false;
    }
  };

  return (
    <div className="p-4 h-full flex flex-col" style={{ margin: "0 auto" }}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col grow h-full"
        style={{ minHeight: 0 }}
      >
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-full md:col-span-6">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              <Tag size={18} /> Producto
            </label>
            <input
              type="text"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.nombre_producto
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
              {...register("nombre_producto", {
                required: "El producto es obligatorio",
              })}
              placeholder="Nombre del producto"
            />
            {errors.nombre_producto && (
              <div className="text-sm text-destructive">
                {errors.nombre_producto.message}
              </div>
            )}
          </div>
          <div className="col-span-full md:col-span-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              <Hash size={18} /> Cantidad
            </label>
            <input
              type="number"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.cantidad ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("cantidad", {
                required: "La cantidad es obligatoria",
                min: 1,
              })}
              placeholder="Cantidad"
            />
            {errors.cantidad && (
              <div className="text-sm text-destructive">
                {errors.cantidad.message}
              </div>
            )}
          </div>
          <div className="col-span-full md:col-span-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              <ListChecks size={18} /> Unidad
            </label>
            <select
              className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.idUnidad ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("idUnidad", {
                required: "La unidad es obligatoria",
              })}
              disabled={loadingUmedidas}
            >
              <option value="">Selecciona unidad</option>
              {UmedidasResponse &&
                UmedidasResponse.map((unidad) => (
                  <option key={unidad.id} value={unidad.id}>
                    {unidad.nombre}
                  </option>
                ))}
            </select>
            {errors.idUnidad && (
              <div className="text-sm text-destructive">
                {errors.idUnidad.message}
              </div>
            )}
          </div>
          <div className="col-span-full md:col-span-6">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              <Tag size={18} /> Categoría
            </label>
            <select
              className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.idCategoria
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
              {...register("idCategoria", {
                required: "La categoría es obligatoria",
              })}
              disabled={loadingCategorias}
            >
              <option value="">Selecciona categoría</option>
              {categorias &&
                categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
            </select>
            {errors.idCategoria && (
              <div className="text-sm text-destructive">
                {errors.idCategoria.message}
              </div>
            )}
          </div>
          <div className="col-span-full md:col-span-6">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              <Tag size={18} /> Marca
            </label>
            <input
              type="text"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.marcaProd ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("marcaProd")}
              placeholder="Marca"
            />
          </div>
          <div className="col-span-full md:col-span-6">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              <FileEdit size={18} /> Motivo
            </label>
            <input
              type="text"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.motivo ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("motivo")}
              placeholder="Motivo"
            />
          </div>
          <div className="col-span-full md:col-span-6">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              <FileEdit size={18} /> Descripción
            </label>
            <input
              type="text"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.descripcion
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
              {...register("descripcion")}
              placeholder="Descripción"
            />
          </div>
          <div className="col-span-full md:col-span-4">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Precio estimado
            </label>
            <input
              type="number"
              step="0.01"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.precio_estimado
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
              {...register("precio_estimado")}
              placeholder="Precio estimado"
            />
          </div>
          <div className="col-span-full md:col-span-4">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              <FileEdit size={18} /> Prioridad
            </label>
            <select
              className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.prioridad ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("prioridad", {
                required: "La prioridad es obligatoria",
              })}
            >
              <option value="">Selecciona prioridad</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
            {errors.prioridad && (
              <div className="text-sm text-destructive">
                {errors.prioridad.message}
              </div>
            )}
          </div>
          <div className="col-span-full md:col-span-4">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              <FileEdit size={18} /> Uso previsto
            </label>
            <input
              type="text"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.uso_previsto
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
              {...register("uso_previsto")}
              placeholder="Uso previsto"
            />
          </div>
          <div className="col-span-full md:col-span-6">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              <User size={18} /> Solicitante
            </label>
            <input
              type="text"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.nombre_solicitante
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
              {...register("nombre_solicitante", {
                required: "El solicitante es obligatorio",
              })}
              placeholder="Nombre del solicitante"
            />
            {errors.nombre_solicitante && (
              <div className="text-sm text-destructive">
                {errors.nombre_solicitante.message}
              </div>
            )}
          </div>
          <div className="col-span-full md:col-span-6">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              <Mail size={18} /> Email
            </label>
            <input
              type="email"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.correo_electronico
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
              {...register("correo_electronico", {
                required: "El email es obligatorio",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Email inválido",
                },
              })}
              placeholder="Correo electrónico"
            />
            {errors.correo_electronico && (
              <div className="text-sm text-destructive">
                {errors.correo_electronico.message}
              </div>
            )}
          </div>
          <div className="col-span-full md:col-span-6">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              <Phone size={18} /> Teléfono
            </label>
            <input
              type="text"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.telefono ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("telefono")}
              placeholder="Teléfono"
            />
          </div>
          <div className="col-span-full md:col-span-6">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              <Tag size={18} /> Área
            </label>
            <select
              className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.idArea ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("idArea", { required: "El área es obligatoria" })}
              disabled={loadingAreas}
            >
              <option value="">Selecciona área</option>
              {areas &&
                areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.nombre}
                  </option>
                ))}
            </select>
            {errors.idArea && (
              <div className="text-sm text-destructive">
                {errors.idArea.message}
              </div>
            )}
          </div>
        </div>
        <div className="mt-auto pt-3">
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              className="btn-cerrar-modal"
              onClick={() => {
                reset();
                onClose && onClose();
              }}
              disabled={isSubmitting}
              variant="default"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="btn-guardar items-center gap-2"
              disabled={isSubmitting}
              variant="default"
            >
              <FileEdit size={18} /> Guardar Cambios
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
