import { capitalizeFirstLetter } from "../../../hooks/FirstLetterUp";
import { Button } from "../../ui/button";
import { Card } from "@/components/ui/card";

export function FormularioVenderDias({
  onSubmitVender,
  handleSubmit,
  vacacionesId,
  register,
  errors,
}) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  return (
    <form onSubmit={handleSubmit(onSubmitVender)}>
      {/* Mostrar la imagen del usuario */}
      <Card className="flex flex-row items-center p-3 mb-3">
        {/* Imagen del usuario */}
        <div className="me-3">
          {vacacionesId.usuario?.fotoPerfil ? (
            <img
              src={`${BASE_URL}/storage/${vacacionesId.usuario.fotoPerfil}`}
              alt="Foto de perfil"
              className="rounded-full"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                border: "4px solid rgb(194, 194, 194)",
                boxShadow: "0 0 5px rgba(13, 15, 17, 0.5)",
              }}
            />
          ) : (
            <div
              className="rounded-full bg-secondary flex items-center justify-center"
              style={{ width: "80px", height: "80px" }}
            >
              <p className="text-white mb-0">Sin Foto</p>
            </div>
          )}
        </div>

        {/* Nombre y apellidos */}
        <div className="text-center grow">
          <h5 className="mb-1">
            {vacacionesId.usuario?.empleado?.persona?.nombre
              ? capitalizeFirstLetter(
                  vacacionesId.usuario.empleado.persona.nombre.toLowerCase(),
                )
              : "Nombre no disponible"}
          </h5>
          <h6 className="text-muted-foreground">
            {vacacionesId.usuario?.empleado?.persona?.apellidos
              ? capitalizeFirstLetter(
                  vacacionesId.usuario.empleado.persona.apellidos.toLowerCase(),
                )
              : "Apellidos no disponibles"}
          </h6>
          <small className="text-primary font-bold">
            {vacacionesId.usuario?.empleado?.cargo?.nombre
              ? capitalizeFirstLetter(
                  vacacionesId.usuario.empleado.cargo.nombre.toLowerCase(),
                )
              : "Cargo no disponible"}
          </small>
        </div>
      </Card>
      <Card className="border p-3 mb-3">
        <div className="grow">
          <h6 className="text-muted-foreground">
            <span> Dias Totales </span>
            {vacacionesId.dias_totales ? (
              <p className="font-bold">{vacacionesId.dias_totales}</p>
            ) : (
              "Dias totales no disponibles"
            )}
          </h6>
          <h6 className="text-muted-foreground">
            <span> Dias Utilizados </span>
            {vacacionesId.dias_utilizados ? (
              <p className="font-bold">{vacacionesId.dias_utilizados}</p>
            ) : (
              "Dias totales no disponibles"
            )}
          </h6>
          <h6 className="text-muted-foreground">
            <span> Dias Disponibles a vender </span>

            <p className="font-bold">
              {vacacionesId.dias_totales - vacacionesId.dias_utilizados}
            </p>

            {vacacionesId.dias_totales - vacacionesId.dias_utilizados < 0
              ? "Dias totales no disponibles"
              : ""}
          </h6>
        </div>
      </Card>

      {/* Input para los días a vender */}
      <div className="mb-3 grid gap-2">
        <label
          htmlFor="diasVender"
          className="text-sm font-medium text-foreground"
        >
          Días a vender
        </label>
        <input
          type="number"
          className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          id="diasVender"
          {...register("diasVender", {
            required: "Debe ingresar los días a vender",
            min: { value: 1, message: "Debe vender al menos 1 día" },
          })}
        />
        {errors.diasVender && (
          <div className="text-sm text-destructive">
            {errors.diasVender.message}
          </div>
        )}
        <small className="text-muted-foreground">
          Los dias a vender no deben superar los dias Totales
        </small>
      </div>

      {/* Botón para confirmar */}
      <Button
        type="submit"
        className="btn-guardar p-3 w-full"
        variant="default"
      >
        Confirmar Venta
      </Button>
    </form>
  );
}
