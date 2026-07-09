import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import "../../css/estilosDelivery/EstiloVistaBanners.css";
import BannerEditor from "../../components/componenteDelivery/BannerEditor";
import BannerList from "../../components/componenteDelivery/BannerList";
import BannerPreview from "../../components/componenteDelivery/BannerPreview";

// Arquitectura: Mantenemos las propiedades que necesita la UI aunque no vayan a la BD.
const INITIAL_CONFIG = {
  tag: "EXCLUSIVO",
  title: "¡Súper Descuento!",
  subtitle: "Solo en nuestra App",
  offer: "40% OFF",
  code: "APP40",
  theme: "red",
  bg_color: "#E11D48",
  text_color: "#FFFFFF",
  has_icon: true,
  icon_name: "Flame",
  gradient: true,
  gradient_color: "#9F1239",
  has_aura: true,
  aura_color: "#F87171",
  border_radius: "1.5",
  layout: "simple", // <- RESTAURADO: Necesario para que BannerPreview no colapse
  is_active: true,
};

const Banner = () => {
  const [config, setConfig] = useState(INITIAL_CONFIG);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: (formData) => {
      // PATRÓN DTO: Sanitización del payload antes de tocar Laravel
      const payload = { ...formData };
      delete payload.layout; // Evitamos error en Laravel (columna no encontrada)

      const url = isEditing
        ? `delivery/bannerPromo/${payload.id}`
        : "delivery/bannerPromo";
      const method = isEditing ? "put" : "post";

      return axiosInstance[method](url, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      ToastAlert(
        "success",
        isEditing ? "Actualizado con éxito" : "Registrado con éxito",
      );
      handleCancel();
    },
    onError: (error) => {
      const msg = error.response?.data?.message || "Error de conexión";
      ToastAlert("error", msg);
    },
  });

  const handleSave = (formData) => {
    saveMutation.mutate(formData);
  };

  const handleEdit = (banner) => {
    const formattedBanner = {
      ...INITIAL_CONFIG, // Inyectamos defaults visuales primero
      ...banner, // Sobrescribimos con los datos de BD
      has_icon: !!banner.has_icon,
      gradient: !!banner.gradient,
      has_aura: !!banner.has_aura,
      is_active: !!banner.is_active,
    };
    setConfig(formattedBanner);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setConfig(INITIAL_CONFIG);
    setIsEditing(false);
  };

  return (
    <div className="banner-generator-container p-2">
      <div className="container-fluid">
        <div className="row ">
          <div className="col-12">
            <h4 className="generator-title">Generador de Banners</h4>
            <p className="generator-subtitle">
              Diseña banners dinámicos con previsualización móvil.
            </p>
          </div>
        </div>

        <div className="row g-5">
          <div className="col-lg-7">
            <BannerEditor
              key={isEditing ? `edit-${config.id}` : "new"}
              initialData={config}
              onLiveChange={setConfig}
              onSave={handleSave}
              isEditing={isEditing}
              onCancel={handleCancel}
            />
            <div className="mt-5">
              <BannerList onEdit={handleEdit} />
            </div>
          </div>

          <div className="col-lg-5">
            <div className="sticky-top" style={{ top: "2rem" }}>
              <div className="text-center mb-3">
                <span className="badge rounded-pill bg-dark py-2 px-3 fw-bold">
                  <div
                    className="spinner-grow spinner-grow-sm text-danger me-2"
                    style={{ width: "8px", height: "8px" }}
                  ></div>
                  MÓVIL PREVIEW
                </span>
              </div>
              <BannerPreview config={config} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
