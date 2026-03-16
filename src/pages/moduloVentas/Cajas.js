import { CajasList } from "../../components/componentesModuloVentas/CajasList";
import { useState } from "react";

import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import ModalRight from "../../components/componentesReutilizables/ModalRight";

import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import { FormAddCaja } from "../../components/componentesModuloVentas/accionesCaja/FormAddCaja";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
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
            <div className="card-header border-bottom-0 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
              <div className="d-flex align-items-center">
                <h4 className="card-title mb-0 titulo-card-especial">
                  Panel de Cajas
                </h4>
                <span className="badge-header">Registro</span>
              </div>
              <div className="d-flex align-items-center flex-wrap gap-2 mt-3 mt-md-0">
                <button
                  type="button"
                  className="btn btn-dark px-3"
                  onClick={() => setModalAddCaja(true)}
                >
                  <Plus size={18} />
                  Abrir Caja
                </button>
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
            <div className="card-header border-bottom-0 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
              <div className="d-flex align-items-center">
                <h4 className="card-title mb-0 titulo-card-especial">
                  Registros Caja
                </h4>
                <span className="badge-header">Historial</span>
              </div>

              <div className="d-flex flex-column flex-md-row align-items-center justify-content-md-end gap-2 mt-3 mt-md-0">
                <div className="header-search-container">
                  <Search className="search-icon" />
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Buscar registro..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <select
                  className="form-select"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{minWidth: "150px"}}
                >
                  <option value="">Todas las cajas</option>
                  {cajas?.map((caja) => (
                    <option key={caja.id} value={caja.nombreCaja}>
                      {caja.nombreCaja}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  className="form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{maxWidth: "180px"}}
                />
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
