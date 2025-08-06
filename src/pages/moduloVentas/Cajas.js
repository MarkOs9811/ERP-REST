import { CajasList } from "../../components/componentesModuloVentas/CajasList";
import { useState } from "react";
import { RegistroCajas } from "../../components/componentesModuloVentas/RegistrosCajasList";

import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import ModalRight from "../../components/componentesReutilizables/ModalRight";

import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import { FormAddCaja } from "../../components/componentesModuloVentas/accionesCaja/FormAddCaja";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";

export function Cajas() {
  const [search, setSearch] = useState("");
  const [modalAddCaja, setModalAddCaja] = useState(false);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post("/cajas", data);
      if (response.data.success) {
        ToastAlert("success", "Caja creada correctamente");
        queryClient.invalidateQueries({ queryKey: ["cajas"] });
        setModalAddCaja(false);
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const msg = error.response.data.message || "Error de validación";
        ToastAlert("error", msg);
      } else {
        ToastAlert("error", "Error al guardar la caja");
      }
    }
  };
  return (
    <ContenedorPrincipal>
      <div className="row g-3">
        <div className="col-lg-12 col-sm-12">
          <div className="card shadow-sm overflow-hidden">
            <div className="card-header">
              <div className="container-fluid">
                <div className="row align-items-center">
                  {/* Título de la lista */}
                  <div className="col-12 col-md-6 mb-3 mb-md-0">
                    <h3 className="text-center text-md-start">Lista Caja</h3>
                  </div>

                  {/* Input de búsqueda y botón */}
                  <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-center justify-content-md-end">
                    <button
                      type="button"
                      className="btn  ms-0 ms-md-2"
                      onClick={() => setModalAddCaja(true)}
                    >
                      <Plus className="text-auto" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body p-4 mb-3">
              <CajasList />
            </div>
          </div>
        </div>
        <div className="col-lg-12 col-sm-12">
          <div className="card shadow-sm overflow-hidden">
            <div className="card-header">
              <div className="container-fluid">
                <div className="row align-items-center">
                  {/* Título de la lista */}
                  <div className="col-12 col-md-6 mb-3 mb-md-0">
                    <h3 className="text-center text-md-start">
                      Registros Caja
                    </h3>
                  </div>

                  {/* Input de búsqueda y botón */}
                  <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-center justify-content-md-end">
                    <input
                      type="search"
                      className="form-control mb-3 mb-md-0"
                      placeholder="Buscar..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <RegistroCajas search={search} />
            </div>
          </div>
        </div>
      </div>
      <ModalRight
        isOpen={modalAddCaja}
        onClose={() => {
          setModalAddCaja(false);
        }}
        title={"Crear una caja"}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="p-3">
          <FormAddCaja
            onSubmit={handleSubmit(onSubmit)}
            register={register}
            errors={errors}
          />
        </div>
      </ModalRight>
    </ContenedorPrincipal>
  );
}
