import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { User, Phone, Mail, Hash, Car } from "lucide-react";
import { PutData } from "../../service/CRUD/PutData";
import {
  limitDNIInput,
  limitTelefonoInput,
  validateDNI,
  validateTelefono,
} from "../../hooks/InputHandlers";
import { Button } from "../ui/button";

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
        telefono:
          repartidor?.telefono || repartidor?.empleado?.persona?.telefono || "",
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

    const exito = await PutData(
      "delivery/repartidores",
      repartidor.id,
      payload,
    );

    if (exito) {
      queryClient.invalidateQueries(["repartidores"]);
      onClose();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col h-full p-4"
    >
      {/* DATOS PERSONALES */}
      <h6 className="font-bold mb-3 mt-2 text-foreground border-b pb-2">
        Datos Personales
      </h6>
      <div className="grid grid-cols-12 gap-3 mb-4">
        <div className="col-span-full">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground text-sm">
            <span className="">
              <User size={16} className="text-muted-foreground" />
            </span>
            Nombres
          </label>

          <div className="flex w-full items-stretch">
            <input
              type="text"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.nombres ? "border-destructive focus-visible:ring-destructive" : ""}`}
              placeholder="Nombres completos"
              {...register("nombres", { required: "Campo obligatorio" })}
            />
          </div>
          {errors.nombres && (
            <span className="text-destructive text-sm">
              {errors.nombres.message}
            </span>
          )}
        </div>

        <div className="col-span-full">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground text-sm">
            <span className="">
              <User size={16} className="text-muted-foreground" />
            </span>
            Apellidos
          </label>
          <div className="flex w-full items-stretch">
            <input
              type="text"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.apellidos ? "border-destructive focus-visible:ring-destructive" : ""}`}
              placeholder="Apellidos completos"
              {...register("apellidos", { required: "Campo obligatorio" })}
            />
          </div>
          {errors.apellidos && (
            <span className="text-destructive text-sm">
              {errors.apellidos.message}
            </span>
          )}
        </div>

        <div className="col-span-6">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground text-sm">
            DNI / Documento
          </label>
          <div className="flex w-full items-stretch">
            <span className="inline-flex items-center rounded-md border-input px-3 text-sm text-muted-foreground bg-background">
              <Hash size={16} className="text-muted-foreground" />
            </span>
            <input
              type="text"
              inputMode="numeric"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.dni ? "border-destructive focus-visible:ring-destructive" : ""}`}
              placeholder="N° de doc."
              {...register("dni", {
                required: "Campo obligatorio",
                validate: validateDNI,
              })}
              onInput={limitDNIInput}
            />
          </div>
          {errors.dni && (
            <span className="text-destructive text-sm">
              {errors.dni.message}
            </span>
          )}
        </div>

        <div className="col-span-6">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground text-sm">
            Teléfono
          </label>
          <div className="flex w-full items-stretch">
            <span className="inline-flex items-center rounded-md border-input px-3 text-sm text-muted-foreground bg-background">
              <Phone size={16} className="text-muted-foreground" />
            </span>
            <input
              type="text"
              inputMode="numeric"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.telefono ? "border-destructive focus-visible:ring-destructive" : ""}`}
              placeholder="ej: 987654321"
              {...register("telefono", {
                required: "Campo obligatorio",
                validate: validateTelefono,
              })}
              onInput={limitTelefonoInput}
            />
          </div>
          {errors.telefono && (
            <span className="text-destructive text-sm">
              {errors.telefono.message}
            </span>
          )}
        </div>
      </div>

      {/* DATOS DE CONTACTO & VEHÍCULO */}
      <h6 className="font-bold mb-3 text-foreground border-b pb-2">
        Información Adicional
      </h6>
      <div className="grid grid-cols-12 gap-3 mb-4">
        <div className="col-span-full">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground text-sm">
            Correo Electrónico (Opcional)
          </label>
          <div className="flex w-full items-stretch">
            <span className="inline-flex items-center rounded-md border-input px-3 text-sm text-muted-foreground bg-background">
              <Mail size={16} className="text-muted-foreground" />
            </span>
            <input
              type="email"
              className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="correo@ejemplo.com"
              {...register("email")}
            />
          </div>
        </div>

        <div className="col-span-full">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground text-sm">
            Placa de Vehículo (Moto/Auto)
          </label>
          <div className="flex w-full items-stretch mb-1">
            <span className="inline-flex items-center rounded-md border-input px-3 text-sm text-muted-foreground bg-background">
              <Car size={16} className="text-muted-foreground" />
            </span>
            <input
              type="text"
              className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 uppercase"
              placeholder="A1B-234"
              {...register("placa")}
            />
          </div>
          <small
            className="text-muted-foreground block"
            style={{ fontSize: "0.80rem" }}
          >
            Si el repartidor usa bicicleta, déjalo en blanco.
          </small>
        </div>
      </div>

      {/* Controles del Footer */}
      <div className="mt-auto flex justify-end gap-2 border-t p-3">
        <Button
          type="button"
          className="btn-cerrar-modal"
          onClick={onClose}
          disabled={isSubmitting}
          variant="default"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="btn-guardar"
          disabled={isSubmitting}
          variant="default"
        >
          {isSubmitting ? "Actualizando..." : "Actualizar Repartidor"}
        </Button>
      </div>
    </form>
  );
}
