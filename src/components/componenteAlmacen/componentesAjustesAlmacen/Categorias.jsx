import { PlusIcon } from "lucide-react";
import ModalRight from "../../componentesReutilizables/ModalRight";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";
import { Button } from "../../ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";


const Categorias = ({ categorias, onToggle }) => {
  const [modalAddMetodoPago, setModalAddCategoria] = useState(false);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleSubmitMetodo = async (data) => {
    try {
      const response = await axiosInstance.post("/categorias", {
        nombre: data.nombre,
      });
      if (response.data.success) {
        ToastAlert("success", "Categoria agregado");
        setModalAddCategoria(false);
        reset();
        queryClient.invalidateQueries(["metodosPago"]);
      } else {
        ToastAlert("error", "No se pudo agregar el Categoria");
      }
    } catch (error) {
      ToastAlert("error", "Error al agregar el Categoria");
      console.error("Error al agregar el Categoria:", error);
    }
  };
  return (
    <div className="md:col-span-12">
      <Card className="shadow-sm border h-full">
        <CardContent className="">
          <div className="d-flex justify-content-between align-items-center">
            <CardTitle asChild><p className="mb-0 h5">Categorías</p></CardTitle>
            <Button
              className="btn btn-light"
              title="Agregar Categoría"
              onClick={() => setModalAddCategoria(true)}
             variant="default">
              <PlusIcon className="text-auto" />
            </Button>
          </div>
          <ul className="list-group border-0 mt-3">
            {categorias.map((cat) => (
              <li
                key={cat.id}
                className="list-group-item border-0 d-flex justify-content-between align-items-center"
              >
                <div>
                  <h6 className="mb-1">{cat.nombre}</h6>
                  <small className="text-muted">
                    <div
                      className={`badge ${
                        cat.estado == 1
                          ? "bg-success text-white"
                          : "bg-secondary text-white"
                      }`}
                    >
                      {cat.estado == 1 ? "Activo" : "Desactivado"}
                    </div>
                  </small>
                </div>
                <div className="form-switch">
                  <input
                    type="checkbox"
                    checked={cat.estado == 1}
                    onChange={() => onToggle(cat.id)}
                    className="form-check-input"
                    id={`categoriaCheck${cat.id}`}
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
        onClose={() => setModalAddCategoria(false)}
        title="Agregar Categoria"
        hideFooter={true}
      >
        <Card className="flex h-full bg-transparent">
          <CardContent asChild><form
            className="row g-3"
            onSubmit={handleSubmit(handleSubmitMetodo)}
          >
            <div className="col-12">
              <label className="form-label">Nombre del la categoria</label>
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
                placeholder="Ej: Dulces, electrodomesticos."
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

export default Categorias;
