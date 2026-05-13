import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/AxiosInstance";
import * as LucideIcons from "lucide-react";
import "../../css/estilosDelivery/EstiloBannerList.css";
import { GetData } from "../../service/CRUD/GetData";
import ToastAlert from "../componenteToast/ToastAlert";
import ModalAlertQuestion from "../componenteToast/ModalAlertQuestion";

const BannerList = ({ onEdit }) => {
  const queryClient = useQueryClient();

  // 1. Estado para controlar el Modal de Eliminación
  const [modalState, setModalState] = useState({
    show: false,
    banner: null,
  });

  // 2. Query para obtener banners
  const { data: banners = [], isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: () => GetData("delivery/banners"),
  });

  // 3. Mutación para Cambiar Estado (El Switch)
  const statusMutation = useMutation({
    mutationFn: async ({ id, is_active }) => {
      // CORRECCIÓN CRÍTICA: Enviar is_active en snake_case
      await axiosInstance.patch(`/delivery/bannerPromo/${id}/status`, {
        is_active,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      ToastAlert("success", "Estado actualizado correctamente");
    },
    onError: (error) => {
      const msg = error.response?.data?.message || "Error al actualizar estado";
      ToastAlert("error", msg);
    },
  });

  // 4. Mutación para Eliminar (Usamos mutateAsync luego)
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axiosInstance.delete(`/delivery/bannerPromo/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });

  const openDeleteModal = (banner) => {
    setModalState({ show: true, banner });
  };

  // Cerrar modal y limpiar selección
  const closeDeleteModal = () => {
    setModalState({ show: false, banner: null });
  };

  // Función que el Modal ejecuta al darle a "Confirmar"
  const handleConfirmDelete = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
      ToastAlert("success", "Banner eliminado con éxito");
      return true; // Le dice al modal que fue exitoso y puede cerrarse
    } catch (error) {
      const msg =
        error.response?.data?.message || "Error al eliminar el banner";
      ToastAlert("error", msg);
      return false; // Le dice al modal que falló y NO debe cerrarse (o manejarlo según tu lógica)
    }
  };

  if (isLoading)
    return (
      <div className="text-center py-5 text-muted">
        <span
          className="spinner-border spinner-border-sm me-2"
          role="status"
        ></span>
        Cargando banners...
      </div>
    );

  return (
    <>
      <div className="banner-list-card">
        <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
          <LucideIcons.LayoutGrid size={20} />
          Banners Activos
        </h4>

        <div className="list-group list-group-flush">
          {Array.isArray(banners) && banners.length > 0 ? (
            banners.map((banner) => (
              <div
                key={banner.id}
                className="border banner-item rounded-4 my-2 p-3 d-flex justify-content-between align-items-center flex-wrap gap-"
              >
                <div className="banner-info d-flex align-items-center gap-3">
                  <div
                    className="banner-mini-preview rounded-3"
                    style={{
                      width: "50px",
                      height: "30px",
                      backgroundColor: banner.bg_color,
                      backgroundImage: banner.gradient
                        ? `linear-gradient(135deg, ${banner.bg_color}, ${banner.gradient_color})`
                        : "none",
                    }}
                  />
                  <div>
                    <p className="banner-name fw-bold mb-0">{banner.title}</p>
                    <small className="text-muted">
                      {banner.tag} • {banner.offer}
                    </small>
                  </div>
                </div>

                <div className="banner-actions d-flex align-items-center gap-2">
                  {/* Botón Editar */}
                  <button
                    className="btn-editar btn-sm rounded-3 border-0 bg-warning-subtle text-warning"
                    onClick={() => onEdit(banner)}
                  >
                    <LucideIcons.Edit2 size={16} />
                  </button>

                  {/* Switch de Estado */}
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      style={{ cursor: "pointer" }}
                      checked={!!banner.is_active} // Casteo seguro a booleano
                      disabled={
                        statusMutation.isPending &&
                        statusMutation.variables?.id === banner.id
                      }
                      onChange={(e) =>
                        statusMutation.mutate({
                          id: banner.id,
                          is_active: e.target.checked, // <-- CORRECCIÓN
                        })
                      }
                    />
                  </div>

                  {/* Botón Eliminar (Llama al modal) */}
                  <button
                    className="btn-eliminar btn-sm rounded-3 border-0 bg-danger-subtle text-danger"
                    onClick={() => openDeleteModal(banner)}
                  >
                    <LucideIcons.Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted">
              No hay banners configurados.
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      <ModalAlertQuestion
        show={modalState.show}
        idEliminar={modalState.banner?.id}
        nombre={modalState.banner?.title}
        tipo="banner"
        pregunta="¿Estás seguro de eliminar este"
        handleEliminar={handleConfirmDelete}
        handleCloseModal={closeDeleteModal}
        loading={deleteMutation.isPending} // Pasamos el estado de carga al modal
      />
    </>
  );
};

export default BannerList;
