import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetCargos } from "../../service/GetCargos";
import { Cargando } from "../componentesReutilizables/Cargando";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";

import { useState } from "react";
import ModalRight from "../componentesReutilizables/ModalRight";
import { useForm } from "react-hook-form";
import { AddCargo } from "./componentesCargo/AddCargo";
import axiosInstance from "../../api/AxiosInstance";

import ToastAlert from "../componenteToast/ToastAlert";
import { EditCargo } from "./componentesCargo/EditCargo";
import { Plus } from "lucide-react";

export function Cargos() {
  const [modalAddCargo, setModalAddCargo] = useState(false);

  const [modalViewCargo, setModalViewCargo] = useState(false);
  const [cargoSeleccionado, setCargoSeleccionado] = useState(null);

  const queryClient = useQueryClient();
  const {
    data: cargos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cargos"],
    queryFn: GetCargos,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    setValue,
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post("/cargosAll", data);
      if (response.data.success) {
        ToastAlert("success", "Cargo creado exitosamente");
        setModalAddCargo(false);
        reset();
        queryClient.invalidateQueries({ queryKey: ["cargos"] });
      } else {
        ToastAlert("error", "Ha ocurrido un error");
      }
    } catch (error) {
      ToastAlert("error", "Ha ocurrido un error" + error);
    }
  };

  const onSubmitEdit = async (data) => {
    try {
      const response = await axiosInstance.put("/cargosAll", data);
      if (response.data.success) {
        ToastAlert("success", "Cargo actualizado exitosamente");
        setModalViewCargo(false);
        reset();
        queryClient.invalidateQueries({ queryKey: ["cargos"] });
      } else {
        ToastAlert("error", "Ha ocurrido un error");
      }
    } catch (error) {
      ToastAlert("error", "Ha ocurrido un error" + error);
    }
  };

  const handleCancel = () => {
    setModalAddCargo(false);
    setModalViewCargo(false);
    setCargoSeleccionado([]);
    reset();
  };
  return (
    <div className="card shadow-sm p-3">
      <div className="card-header  d-flex align-items-center justify-content-between">
        <p className="h4  align-middle mb-0">Cargos</p>
        <button
          type="button"
          className="btn ms-auto border"
          title="Agregar un cargo"
          onClick={() => setModalAddCargo(true)}
        >
          <Plus className="text-auto" />
        </button>
      </div>
      <div className="card-body p-4">
        {isLoading && <Cargando />}
        {isError && (
          <div>
            <p>Error al cargar datos</p>
          </div>
        )}
        <div className="list-group">
          {cargos.map((items) => (
            <div
              type="button"
              key={items.id}
              className="list-group-item list-group-item-action cursor-pointer d-flex align-items-center justify-content-between"
              onClick={() => {
                setModalViewCargo(true);
                setCargoSeleccionado(items);
              }}
            >
              <span className="text-left w-50 d-flex flex-column">
                <span className="">{capitalizeFirstLetter(items.nombre)}</span>
                <small className="text-muted">
                  Empleados {items.empleados_count}
                </small>
              </span>
              <div className="text-end">
                <p className="h5 mb-0">S/. {items.salario}</p>
                <p className="small mb-0">S/. {items.pagoPorHoras}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ModalRight
        isOpen={modalAddCargo}
        onClose={handleCancel}
        title="Nuevo Cargo"
        subtitulo="Registra un nuevo cargo en el sistema"
        onSubmit={handleSubmit(onSubmit)}
        onCancel={handleCancel}
      >
        <AddCargo
          onSubmit={handleSubmit(onSubmit)}
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
          trigger={trigger}
        />
      </ModalRight>

      <ModalRight
        isOpen={modalViewCargo}
        onClose={handleCancel}
        title={cargoSeleccionado?.nombre || "Cargando..."}
        subtitulo="Detalles del cargo"
        onSubmit={handleSubmit(onSubmitEdit)}
        submitText={"Actualizar"}
        onCancel={handleCancel}
      >
        <EditCargo
          onSubmit={handleSubmit(onSubmitEdit)}
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
          trigger={trigger}
          data={cargoSeleccionado}
        />
      </ModalRight>
    </div>
  );
}
