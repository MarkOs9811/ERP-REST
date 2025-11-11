import { CajasList } from "../../components/componentesModuloVentas/CajasList";
import { useState } from "react";

import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import ModalRight from "../../components/componentesReutilizables/ModalRight";

import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import { FormAddCaja } from "../../components/componentesModuloVentas/accionesCaja/FormAddCaja";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { RegistrosCajasList } from "../../components/componentesModuloVentas/RegistrosCajasList";
import { GetCajas } from "../../service/accionesVentas/GetCajas";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";

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
        setModalAddCaja(false);
        ToastAlert("success", "Caja creada correctamente");
        queryClient.invalidateQueries({ queryKey: ["cajas"] });
      } else {
        // Si llega con success: false desde backend (pero sin status 422)
        const msg =
          response.data.message || "Ocurrió un error al crear la caja";
        ToastAlert("error", msg);
      }
    } catch (error) {
      // Si el backend devuelve error de validación (422)
      if (error.response && error.response.status === 422) {
        const data = error.response.data;

        // Si Laravel devuelve errores múltiples (array en `errors`)
        if (data.errors) {
          const mensajes = Object.values(data.errors).flat().join("\n");
          ToastAlert("error", mensajes);
        }
        // Si Laravel devuelve solo un `message`
        else if (data.message) {
          ToastAlert("error", data.message);
        }
        // Fallback
        else {
          ToastAlert("error", "Error de validación desconocido");
        }
      }

      // Errores internos (500, 404, etc.)
      else if (error.response) {
        const msg =
          error.response.data?.message || "Error interno del servidor";
        ToastAlert("error", msg);
      }

      // Si no hay respuesta (error de red, timeout, etc.)
      else if (error.request) {
        ToastAlert("error", "No hay conexión con el servidor");
      }

      // Errores imprevistos del frontend
      else {
        ToastAlert("error", `Error inesperado: ${error.message}`);
      }
    }
  };

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

  return (
    <div className="row g-3">
      <div className="col-lg-12 col-sm-12">
        <CondicionCarga isLoading={isLoading} isError={isError}>
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
                      className="btn btn-outline-dark  ms-0 ms-md-2"
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
        </CondicionCarga>
      </div>
      <div className="col-lg-12 col-sm-12">
        <CondicionCarga isLoading={isLoading} isError={isError}>
          <div className="card shadow-sm overflow-hidden">
            <div className="card-header">
              <div className="container-fluid">
                <div className="align-items-center d-flex justify-content-between flex-wrap">
                  {/* Título de la lista */}
                  <div className="mb-3 mb-md-0">
                    <h3 className="text-center text-md-start">
                      Registros Caja
                    </h3>
                  </div>

                  {/* Input de búsqueda y botón */}
                  <div className=" d-flex flex-column flex-md-row align-items-center justify-content-md-end">
                    <input
                      type="search"
                      className="form-control mb-3 mb-md-0"
                      placeholder="Buscar..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                      className="form-select mb-3 mb-md-0 ms-0 ms-md-2"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    >
                      <option value="">Todos</option>
                      {cajas?.map((caja) => (
                        <option key={caja.id} value={caja.nombreCaja}>
                          {caja.nombreCaja}
                        </option>
                      ))}
                    </select>
                    <input
                      type="date"
                      className="form-control mb-3 mb-md-0 ms-0 ms-md-2"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <RegistrosCajasList search={search} />
            </div>
          </div>
        </CondicionCarga>
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
    </div>
  );
}
