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

  console.log("CajasList data:", cajas);
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
        formData
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
    <div className="row g-3 m-0 w-100">
      {Array.isArray(cajas) && cajas.length > 0 ? (
        cajas.map((item) => (
          <div className="col-lg-3 col-md-4 col-sm-12">
            <div className="card border w-100" key={item.id}>
              <div className="card-header rounded-pill">
                <p className="h3">{capitalizeFirstLetter(item.nombreCaja)}</p>
                <div
                  className="dropdown"
                  style={{ position: "absolute", top: "10px", right: "10px" }}
                >
                  <button
                    className="btn btn-light btn-sm"
                    type="button"
                    id={`dropdownMenuButton-${item.id}`}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <EllipsisVertical className="text-auto" />
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby={`dropdownMenuButton-${item.id}`}
                    style={{ zIndex: 1050 }}
                  >
                    <li>
                      <button
                        className="dropdown-item"
                        type="button"
                        onClick={() => {
                          setModalEditarCaja(true);
                          setDataCaja(item);
                        }}
                      >
                        Editar
                      </button>
                    </li>
                    {item.estado === 1 ? (
                      <li>
                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={() => {
                            setModalEliminarCaja(true);
                            setDataCaja(item);
                          }}
                        >
                          Desactivar
                        </button>
                      </li>
                    ) : (
                      <li>
                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={() => {
                            setModalActivarCaja(true);
                            setDataCaja(item);
                          }}
                        >
                          Activar
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              <div className="card-body d-flex">
                <span
                  className={`badge ${
                    item.estado === 1
                      ? item.estadoCaja === 1
                        ? "bg-success"
                        : "bg-danger"
                      : "bg-secondary"
                  }`}
                >
                  {item.estado === 1
                    ? item.estadoCaja === 1
                      ? "Abierta"
                      : "Cerrado"
                    : "Deshabilitado"}
                </span>
                <span className="ms-auto">{item.sedes.nombre}</span>
              </div>
            </div>
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
