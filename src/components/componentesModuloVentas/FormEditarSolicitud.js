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
        data
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
    <div
      className="card p-4 h-100 d-flex flex-column"
      style={{ margin: "0 auto" }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="d-flex flex-column flex-grow-1 h-100"
        style={{ minHeight: 0 }}
      >
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label small text-muted d-flex align-items-center gap-2">
              <Tag size={18} /> Producto
            </label>
            <input
              type="text"
              className={`form-control ${
                errors.nombre_producto ? "is-invalid" : ""
              }`}
              {...register("nombre_producto", {
                required: "El producto es obligatorio",
              })}
              placeholder="Nombre del producto"
            />
            {errors.nombre_producto && (
              <div className="invalid-feedback">
                {errors.nombre_producto.message}
              </div>
            )}
          </div>
          <div className="col-md-3">
            <label className="form-label small text-muted d-flex align-items-center gap-2">
              <Hash size={18} /> Cantidad
            </label>
            <input
              type="number"
              className={`form-control ${errors.cantidad ? "is-invalid" : ""}`}
              {...register("cantidad", {
                required: "La cantidad es obligatoria",
                min: 1,
              })}
              placeholder="Cantidad"
            />
            {errors.cantidad && (
              <div className="invalid-feedback">{errors.cantidad.message}</div>
            )}
          </div>
          <div className="col-md-3">
            <label className="form-label small text-muted d-flex align-items-center gap-2">
              <ListChecks size={18} /> Unidad
            </label>
            <select
              className={`form-select ${errors.idUnidad ? "is-invalid" : ""}`}
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
              <div className="invalid-feedback">{errors.idUnidad.message}</div>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label small text-muted d-flex align-items-center gap-2">
              <Tag size={18} /> Categoría
            </label>
            <select
              className={`form-select ${
                errors.idCategoria ? "is-invalid" : ""
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
              <div className="invalid-feedback">
                {errors.idCategoria.message}
              </div>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label small text-muted d-flex align-items-center gap-2">
              <Tag size={18} /> Marca
            </label>
            <input
              type="text"
              className={`form-control ${errors.marcaProd ? "is-invalid" : ""}`}
              {...register("marcaProd")}
              placeholder="Marca"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small text-muted d-flex align-items-center gap-2">
              <FileEdit size={18} /> Motivo
            </label>
            <input
              type="text"
              className={`form-control ${errors.motivo ? "is-invalid" : ""}`}
              {...register("motivo")}
              placeholder="Motivo"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small text-muted d-flex align-items-center gap-2">
              <FileEdit size={18} /> Descripción
            </label>
            <input
              type="text"
              className={`form-control ${
                errors.descripcion ? "is-invalid" : ""
              }`}
              {...register("descripcion")}
              placeholder="Descripción"
            />
          </div>
          <div className="col-md-4">
            <label className="form-label small text-muted d-flex align-items-center gap-2">
              Precio estimado
            </label>
            <input
              type="number"
              step="0.01"
              className={`form-control ${
                errors.precio_estimado ? "is-invalid" : ""
              }`}
              {...register("precio_estimado")}
              placeholder="Precio estimado"
            />
          </div>
          <div className="col-md-4">
            <label className="form-label small text-muted d-flex align-items-center gap-2">
              <FileEdit size={18} /> Prioridad
            </label>
            <select
              className={`form-select ${errors.prioridad ? "is-invalid" : ""}`}
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
              <div className="invalid-feedback">{errors.prioridad.message}</div>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label small text-muted d-flex align-items-center gap-2">
              <FileEdit size={18} /> Uso previsto
            </label>
            <input
              type="text"
              className={`form-control ${
                errors.uso_previsto ? "is-invalid" : ""
              }`}
              {...register("uso_previsto")}
              placeholder="Uso previsto"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small text-muted d-flex align-items-center gap-2">
              <User size={18} /> Solicitante
            </label>
            <input
              type="text"
              className={`form-control ${
                errors.nombre_solicitante ? "is-invalid" : ""
              }`}
              {...register("nombre_solicitante", {
                required: "El solicitante es obligatorio",
              })}
              placeholder="Nombre del solicitante"
            />
            {errors.nombre_solicitante && (
              <div className="invalid-feedback">
                {errors.nombre_solicitante.message}
              </div>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label small text-muted d-flex align-items-center gap-2">
              <Mail size={18} /> Email
            </label>
            <input
              type="email"
              className={`form-control ${
                errors.correo_electronico ? "is-invalid" : ""
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
              <div className="invalid-feedback">
                {errors.correo_electronico.message}
              </div>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label small text-muted d-flex align-items-center gap-2">
              <Phone size={18} /> Teléfono
            </label>
            <input
              type="text"
              className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
              {...register("telefono")}
              placeholder="Teléfono"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small text-muted d-flex align-items-center gap-2">
              <Tag size={18} /> Área
            </label>
            <select
              className={`form-select ${errors.idArea ? "is-invalid" : ""}`}
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
              <div className="invalid-feedback">{errors.idArea.message}</div>
            )}
          </div>
        </div>
        <div className="mt-auto pt-3">
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn-cerrar-modal"
              onClick={() => {
                reset();
                onClose && onClose();
              }}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-guardar align-items-center gap-2"
              disabled={isSubmitting}
            >
              <FileEdit size={18} /> Guardar Cambios
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
