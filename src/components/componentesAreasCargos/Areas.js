import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetAreas } from "../../service/accionesAreasCargos/GetAreas";
import { GraficoAreas } from "../../graficosChar/GraficoAreas";
import { Cargando } from "../componentesReutilizables/Cargando";

import { useState } from "react";
import ModalRight from "../componentesReutilizables/ModalRight";
import { AddArea } from "./componentesAreas/AddAreas";
import { useForm } from "react-hook-form";
import ToastAlert from "../componenteToast/ToastAlert";
import axiosInstance from "../../api/AxiosInstance";
import { LayoutGrid, Plus, PlusIcon } from "lucide-react";
import { BotonMotionGeneral } from "../componentesReutilizables/BotonMotionGeneral";

export function Areas() {
  const [modalAddAreas, setModalAddArea] = useState();
  const queryClient = useQueryClient();
  const {
    data: areas = [],
    isloading,
    isError,
  } = useQuery({
    queryKey: ["areas"],
    queryFn: GetAreas,
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
      const response = await axiosInstance.post("/areasAll", data);
      if (response.data.success) {
        ToastAlert("success", "Area creada exitosamente");
        setModalAddArea(false);
        reset();
        queryClient.invalidateQueries({ queryKey: ["areas"] });
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      ToastAlert("error", "Ha ocurrido un error" + error);
    }
  };

  const labels = areas.areasName || [];
  const empleadosCount = areas.empleadosCount || [];
  const handleCancel = () => {
    setModalAddArea(false);
    reset();
  };
  return (
    <div className="card shadow-sm p-3">
      <div className="card-header  d-flex align-items-center justify-content-between">
        <div className="d-flex gap-2 align-items-center">
          <div className="p-2 alert alert-primary rounded-lg mb-0">
            <LayoutGrid className="text-primary" size={20} />
          </div>
          <div className="d-flex flex-column">
            <h4 className="fw-bold m-0">Áreas</h4>
            <small className="text-muted">Gestiona los departamentos</small>
          </div>
        </div>

        <BotonMotionGeneral
          text="Agregar Área"
          icon={<Plus size={18} />}
          fullWidth={true}
          onClick={() => setModalAddArea(true)}
        />
      </div>
      <div className="card-body">
        {isloading && <Cargando />}
        {isError && (
          <div className="text-danger">Error al cargar las áreas.</div>
        )}
        {!isloading &&
          !isError &&
          labels.length > 0 &&
          empleadosCount.length > 0 && (
            <GraficoAreas labels={labels} data={empleadosCount} />
          )}
      </div>

      <ModalRight
        isOpen={modalAddAreas}
        onClose={handleCancel}
        title="Nueva Area "
        subtitulo="Registra una nueva area o deparatamento en el sistema"
        onSubmit={handleSubmit(onSubmit)}
        onCancel={handleCancel}
      >
        <AddArea
          onSubmit={handleSubmit(onSubmit)}
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
          trigger={trigger}
        />
      </ModalRight>
    </div>
  );
}
