import { PlusIcon } from "lucide-react";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import ModalRight from "../../componentesReutilizables/ModalRight";
import { Button } from "../../ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const UnidadMedida = ({ unidades, onToggle }) => {
  const [modalAddMetodoPago, setModalAddUnidadMedida] = useState(false);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleSubmitMetodo = async (data) => {
    try {
      const response = await axiosInstance.post("/unidadMedida", {
        nombre: data.nombre,
      });
      if (response.data.success) {
        ToastAlert("success", "Unidad de medida agregado");
        setModalAddUnidadMedida(false);
        reset();
        queryClient.invalidateQueries(["metodosPago"]);
      } else {
        ToastAlert("error", "No se pudo agregar el Unidad de medida");
      }
    } catch (error) {
      ToastAlert("error", "Error al agregar el Unidad de medida");
      console.error("Error al agregar el Unidad de medida:", error);
    }
  };

  return (
    <div className="col-span-full md:col-span-12 h-full">
      <Card className="shadow-sm h-full">
        <CardContent className="">
          <div className="flex justify-between items-center">
            <CardTitle asChild>
              <p className="mb-0 h5">Unidades de Medida</p>
            </CardTitle>
            <Button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-muted text-foreground shadow-sm hover:bg-muted/80"
              title="Agregar Unidad"
              onClick={() => setModalAddUnidadMedida(true)}
              variant="default"
            >
              <PlusIcon className="text-auto" />
            </Button>
          </div>
          <ul className="flex flex-col divide-y mt-3">
            {unidades.map((unidad) => (
              <li
                key={unidad.id}
                className="relative bg-background px-4 py-3 text-foreground border-0 flex justify-between items-center"
              >
                <div>
                  <h6 className="mb-1">{unidad.nombre}</h6>
                  <small className="text-muted-foreground">
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                        unidad.estado == 1
                          ? "bg-emerald-600 text-white"
                          : "bg-secondary text-white"
                      }`}
                    >
                      {unidad.estado == 1 ? "Activo" : "Desactivado"}
                    </div>
                  </small>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    className="size-4 shrink-0 rounded border-input accent-primary"
                    type="checkbox"
                    id={`unidadCheck${unidad.id}`}
                    checked={unidad.estado == 1}
                    onChange={() => onToggle(unidad.id)}
                    style={{
                      width: 40,
                      height: 22,
                      cursor: "pointer",
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <ModalRight
        isOpen={modalAddMetodoPago}
        onClose={() => setModalAddUnidadMedida(false)}
        title="Agregar Unidad Medida"
        hideFooter={true}
      >
        <Card className="flex h-full bg-transparent">
          <CardContent asChild>
            <form
              className="grid grid-cols-12 gap-3"
              onSubmit={handleSubmit(handleSubmitMetodo)}
            >
              <div className="col-span-full">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Nombre del la unidad medida
                </label>
                <input
                  type="text"
                  className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.nombre ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  {...register("nombre", {
                    required: "El nombre es obligatorio",
                    maxLength: {
                      value: 20,
                      message: "El nombre no debe exceder los 20 caracteres",
                    },
                  })}
                  placeholder="Ej: Six pack, Bolsa, paquete."
                  autoFocus
                />
                {errors.nombre && (
                  <div className="text-sm text-destructive">
                    {errors.nombre.message}
                  </div>
                )}
              </div>

              <div className="col-span-full text-right">
                <Button type="submit" className="btn-guardar" variant="default">
                  Guardar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </ModalRight>
    </div>
  );
};

export default UnidadMedida;
