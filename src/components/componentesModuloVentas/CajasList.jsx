import { Cargando } from "../componentesReutilizables/Cargando";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import ModalAlertQuestion from "../componenteToast/ModalAlertQuestion";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetCajas } from "../../service/accionesVentas/GetCajas";
import ModalAlertActivar from "../componenteToast/ModalAlertActivar";
import ModalRight from "../componentesReutilizables/ModalRight";
import { useForm } from "react-hook-form";
import { FormEditCaja } from "./accionesCaja/FormEditCaja";
import { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { BadgeComponent } from "../componentesReutilizables/BadgeComponent";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


export function CajasList({ search }) {
  const [modalEliminarCaja, setModalEliminarCaja] = useState(false);
  const [modalAlertActivarCaja, setModalActivarCaja] = useState(false);
  const [modalEditarCaja, setModalEditarCaja] = useState(false);

  const [dataCaja, setDataCaja] = useState([]);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();
  const {
    data: cajas = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cajas"],
    queryFn: GetCajas,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <Cargando />;
  }

  if (isError) {
    return (
      <div className="error-message">
        <h2>Error:</h2>
        <pre>{isError.message || "Error al cargar"}</pre>
      </div>
    );
  }

  const handleCloseModal = () => {
    setModalEliminarCaja(false);
    setModalActivarCaja(false);
    setDataCaja([]);
  };

  const handleEliminarCaja = async (id) => {
    try {
      const response = await axiosInstance.put(`/cajas/${id}`);
      if (response.data.success) {
        ToastAlert("success", "Caja suspendida correctamente");
        queryClient.invalidateQueries({ queryKey: ["cajas"] });
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      ToastAlert("error", "Error de conexión");
    }
  };

  const handleActivarCaja = async (id) => {
    try {
      const response = await axiosInstance.put(`/cajasActivar/${id}`);
      if (response.data.success) {
        ToastAlert("success", "Caja activada correctamente");
        queryClient.invalidateQueries({ queryKey: ["cajas"] });
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      ToastAlert("error", "Error de conexión");
    }
  };

  const onSubmitEdit = async (formData) => {
    try {
      const response = await axiosInstance.put(
        `/cajasUpdate/${dataCaja.id}`,
        formData,
      );
      if (response.data.success) {
        ToastAlert("success", "Caja actualizada correctamente");
        queryClient.invalidateQueries({ queryKey: ["cajas"] });
        handleCloseModal(); // Cierra modal si es necesario
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const msg = error.response.data.message || "Error de validación";
        ToastAlert("error", msg);
      } else {
        ToastAlert("error", "Error al actualizar la caja");
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 m-0 w-100">
      {Array.isArray(cajas) && cajas.length > 0 ? (
        cajas.map((item) => (
          <div className="col-lg-3 col-md-4 col-sm-12">
            <Card className="w-full" key={item.id}>
              <CardHeader className="">
                <p className="h4">{capitalizeFirstLetter(item.nombreCaja)}</p>
                <div
                  className="dropdown"
                  style={{ position: "absolute", top: "10px", right: "10px" }}
                >
                  <Button
                    className="btn-generico btn-icon btn-sm"
                    type="button"
                    id={`dropdownMenuButton-${item.id}`}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                   variant="default">
                    <EllipsisVertical className="text-auto" size={18} />
                  </Button>

                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby={`dropdownMenuButton-${item.id}`}
                    style={{ zIndex: 1050 }}
                  >
                    <li>
                      <Button
                        className="dropdown-item text-start"
                        type="button"
                        onClick={() => {
                          setModalEditarCaja(true);
                          setDataCaja(item);
                        }}
                       variant="default">
                        Editar
                      </Button>
                    </li>
                    {item.estado === 1 ? (
                      <li>
                        <Button
                          className="dropdown-item text-start"
                          type="button"
                          onClick={() => {
                            setModalEliminarCaja(true);
                            setDataCaja(item);
                          }}
                         variant="default">
                          Desactivar
                        </Button>
                      </li>
                    ) : (
                      <li>
                        <Button
                          className="dropdown-item text-start"
                          type="button"
                          onClick={() => {
                            setModalActivarCaja(true);
                            setDataCaja(item);
                          }}
                         variant="default">
                          Activar
                        </Button>
                      </li>
                    )}
                  </ul>
                </div>
              </CardHeader>
              <CardContent className="flex">
                <BadgeComponent
                  label={
                    item.estado === 1
                      ? item.estadoCaja === 1
                        ? "Abierta"
                        : "Cerrado"
                      : "Deshabilitado"
                  }
                  variant={
                    item.estado === 1
                      ? item.estadoCaja === 1
                        ? "success"
                        : "danger"
                      : "secondary"
                  }
                />
                <span className="ms-auto">{item.sedes?.nombre}</span>
              </CardContent>
            </Card>
          </div>
        ))
      ) : (
        <p>No hay cajas disponibles</p>
      )}

      <ModalAlertQuestion
        show={modalEliminarCaja}
        handleCloseModal={handleCloseModal}
        handleEliminar={handleEliminarCaja}
        nombre={dataCaja.nombreCaja}
        tipo={"caja"}
        idEliminar={dataCaja.id}
      />

      <ModalRight
        isOpen={modalEditarCaja}
        onClose={() => setModalEditarCaja(false)}
        title={"Editar " + dataCaja.nombreCaja}
        submitText="Actualizar"
        onSubmit={handleSubmit(onSubmitEdit)}
      >
        <FormEditCaja
          watch={watch}
          setValue={setValue}
          data={dataCaja}
          errors={errors}
          register={register}
          onSubmit={handleSubmit(onSubmitEdit)}
        />
      </ModalRight>

      <ModalAlertActivar
        show={modalAlertActivarCaja}
        handleCloseModal={handleCloseModal}
        handleActivar={handleActivarCaja}
        nombre={dataCaja.nombreCaja}
        tipo={"caja"}
        idActivar={dataCaja.id}
      />
    </div>
  );
}
