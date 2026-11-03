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
    <div className="md:col-span-12 h-100">
      <Card className="shadow-sm border h-full">
        <CardContent className="">
          <div className="d-flex justify-content-between align-items-center">
            <CardTitle asChild><p className="mb-0 h5">Unidades de Medida</p></CardTitle>
            <Button
              className="btn btn-light"
              title="Agregar Unidad"
              onClick={() => setModalAddUnidadMedida(true)}
             variant="default">
              <PlusIcon className="text-auto" />
            </Button>
          </div>
          <ul className="list-group mt-3">
            {unidades.map((unidad) => (
              <li
                key={unidad.id}
                className="list-group-item border-0 d-flex justify-content-between align-items-center"
              >
                <div>
                  <h6 className="mb-1">{unidad.nombre}</h6>
                  <small className="text-muted">
                    <div
                      className={`badge ${
                        unidad.estado == 1
                          ? "bg-success text-white"
                          : "bg-secondary text-white"
                      }`}
                    >
                      {unidad.estado == 1 ? "Activo" : "Desactivado"}
                    </div>
                  </small>
                </div>
                <div className="form-switch">
                  <input
                    className="form-check-input"
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
          <CardContent asChild><form
            className="row g-3"
            onSubmit={handleSubmit(handleSubmitMetodo)}
          >
            <div className="col-12">
              <label className="form-label">Nombre del la unidad medida</label>
              <input
                type="text"
                className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
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
                <div className="invalid-feedback">{errors.nombre.message}</div>
              )}
            </div>

            <div className="col-12 text-end">
              <Button type="submit" className="btn-guardar" variant="default">
                Guardar
              </Button>
            </div>
          </form></CardContent>
        </Card>
      </ModalRight>
    </div>
  );
};

export default UnidadMedida;
