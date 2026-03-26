import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { User, Phone, Mail, Hash, Car } from "lucide-react";
import { PutData } from "../../service/CRUD/PutData";

export function FormEditRepartidor({ onClose, repartidor }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      nombres: "",
      apellidos: "",
      dni: "",
      telefono: "",
      email: "",
      placa: "",
    },
  });

  useEffect(() => {
    if (repartidor) {
      reset({
        nombres: repartidor?.empleado?.persona?.nombre || "",
        apellidos: repartidor?.empleado?.persona?.apellidos || "",
        dni: repartidor?.empleado?.persona?.documento_identidad || "",
        telefono: repartidor?.telefono || repartidor?.empleado?.persona?.telefono || "",
        email: repartidor?.email || "",
        placa: repartidor?.placa_vehiculo || repartidor?.empleado?.placa || "", // Si existe en un futuro
      });
    }
  }, [repartidor, reset]);

  const onSubmit = async (data) => {
    const payload = {
      nombres: data.nombres,
      apellidos: data.apellidos,
      dni: data.dni,
      telefono: data.telefono,
      email: data.email,
      placa: data.placa,
    };

    const exito = await PutData("delivery/repartidores", repartidor.id, payload);

    if (exito) {
      queryClient.invalidateQueries(["repartidores"]);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column h-100 p-4">
      {/* DATOS PERSONALES */}
      <h6 className="fw-bold mb-3 mt-2 text-dark border-bottom pb-2">Datos Personales</h6>
      <div className="row g-3 mb-4">
        <div className="col-12">
          <label className="form-label fw-medium text-dark small">Nombres</label>
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white">
              <User size={16} className="text-muted" />
            </span>
            <input
              type="text"
              className={`form-control ${errors.nombres ? "is-invalid" : ""}`}
              placeholder="Nombres completos"
              {...register("nombres", { required: "Campo obligatorio" })}
            />
          </div>
          {errors.nombres && <span className="text-danger small">{errors.nombres.message}</span>}
        </div>

        <div className="col-12">
          <label className="form-label fw-medium text-dark small">Apellidos</label>
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white">
              <User size={16} className="text-muted" />
            </span>
            <input
              type="text"
              className={`form-control ${errors.apellidos ? "is-invalid" : ""}`}
              placeholder="Apellidos completos"
              {...register("apellidos", { required: "Campo obligatorio" })}
            />
          </div>
          {errors.apellidos && <span className="text-danger small">{errors.apellidos.message}</span>}
        </div>

        <div className="col-6">
          <label className="form-label fw-medium text-dark small">DNI / Documento</label>
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white">
              <Hash size={16} className="text-muted" />
            </span>
            <input
              type="text"
              className={`form-control ${errors.dni ? "is-invalid" : ""}`}
              placeholder="N° de doc."
              {...register("dni", { required: "Campo obligatorio" })}
            />
          </div>
          {errors.dni && <span className="text-danger small">{errors.dni.message}</span>}
        </div>

        <div className="col-6">
          <label className="form-label fw-medium text-dark small">Teléfono</label>
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white">
              <Phone size={16} className="text-muted" />
            </span>
            <input
              type="text"
              className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
              placeholder="ej: 987654321"
              {...register("telefono", { required: "Campo obligatorio" })}
            />
          </div>
          {errors.telefono && <span className="text-danger small">{errors.telefono.message}</span>}
        </div>
      </div>

      {/* DATOS DE CONTACTO & VEHÍCULO */}
      <h6 className="fw-bold mb-3 text-dark border-bottom pb-2">Información Adicional</h6>
      <div className="row g-3 mb-4">
        <div className="col-12">
          <label className="form-label fw-medium text-dark small">Correo Electrónico (Opcional)</label>
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white">
              <Mail size={16} className="text-muted" />
            </span>
            <input
              type="email"
              className="form-control"
              placeholder="correo@ejemplo.com"
              {...register("email")}
            />
          </div>
        </div>

        <div className="col-12">
          <label className="form-label fw-medium text-dark small">Placa de Vehículo (Moto/Auto)</label>
          <div className="input-group shadow-sm mb-1">
            <span className="input-group-text bg-white">
              <Car size={16} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control text-uppercase"
              placeholder="A1B-234"
              {...register("placa")}
            />
          </div>
          <small className="text-muted d-block" style={{ fontSize: "0.80rem" }}>
            Si el repartidor usa bicicleta, déjalo en blanco.
          </small>
        </div>
      </div>

      {/* Controles del Footer */}
      <div className="mt-auto d-flex justify-content-end gap-2 border-top p-3">
        <button
          type="button"
          className="btn-cerrar-modal"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button type="submit" className="btn-guardar" disabled={isSubmitting}>
          {isSubmitting ? "Actualizando..." : "Actualizar Repartidor"}
        </button>
      </div>
    </form>
  );
}
