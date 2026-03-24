import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetAreas as GetAreasReport } from "../../service/accionesAreasCargos/GetAreas";
import { GetAreas } from "../../service/GetAreas";
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
    queryKey: ["areasReport"],
    queryFn: GetAreasReport,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const {
    data: listAreas = [],
    isLoading: isLoadingList,
    isError: isErrorList,
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
        <div className="row g-4">
          <div className="col-md-4">
            <div className="h-100 p-3 bg-light rounded shadow-sm border">
               <h6 className="fw-bold mb-3 text-center border-bottom pb-2">Distribución de Personal</h6>
               {isloading && <Cargando />}
               {isError && (
                 <div className="text-danger">Error al cargar gráfico.</div>
               )}
               {!isloading &&
                 !isError &&
                 labels.length > 0 &&
                 empleadosCount.length > 0 && (
                   <GraficoAreas labels={labels} data={empleadosCount} />
                 )}
            </div>
          </div>
          <div className="col-md-8">
            <div className="list-group shadow-sm">
              {isLoadingList && <Cargando />}
              {isErrorList && <div className="text-danger">Error al cargar la lista de áreas.</div>}
              {!isLoadingList && listAreas.length === 0 && (
                 <div className="text-muted text-center p-4">No hay áreas registradas.</div>
              )}
              {listAreas.map((area) => (
                <div key={area.id} className="list-group-item list-group-item-action d-flex align-items-center justify-content-between p-3">
                   <div className="d-flex flex-column">
                     <span className="fw-bold fs-5 text-dark">{area.nombre || 'Sin Nombre'}</span>
                     <span className="text-muted small mt-1 d-flex align-items-center gap-1">
                        Sede: {area.sede?.nombre || 'General'} | Código: {area.codigo || '-'}
                     </span>
                   </div>
                   <div className="d-flex align-items-center gap-2">
                     <span className="badge bg-primary-subtle text-primary border rounded-pill px-3 py-2">
                        {area.empleados_count || 0} Empleados
                     </span>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
