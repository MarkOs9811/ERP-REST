import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import "../../css/estilosDelivery/EstiloVistaBanners.css";
import BannerEditor from "../../components/componenteDelivery/BannerEditor";
import BannerList from "../../components/componenteDelivery/BannerList";
import BannerPreview from "../../components/componenteDelivery/BannerPreview";

const INITIAL_CONFIG = {
  tag: "EXCLUSIVO",
  title: "¡Súper Descuento!",
  subtitle: "Solo en nuestra App",
  offer: "40% OFF",
  code: "APP40",
  theme: "red",
  bgColor: "#E11D48",
  textColor: "#FFFFFF",
  hasIcon: true,
  iconName: "Flame",
  gradient: true,
  gradientColor: "#9F1239",
  hasAura: true,
  auraColor: "#F87171",
  layout: "simple",
  borderRadius: "1.5rem",
};

const Banner = () => {
  const [config, setConfig] = useState(INITIAL_CONFIG);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: (newBanner) =>
      isEditing
        ? axios.patch(`/api/delivery/bannerPromo/${newBanner.id}`, newBanner)
        : axios.post("/api/delivery/bannerPromo", newBanner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      alert(isEditing ? "Banner actualizado" : "Banner guardado");
      if (!isEditing) setConfig(INITIAL_CONFIG);
      setIsEditing(false);
    },
    onError: (error) => {
      alert("Error en la operación");
      console.error(error);
    },
  });

  const handleSave = () => {
    saveMutation.mutate(config);
  };

  const handleEdit = (banner) => {
    setConfig(banner);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setConfig(INITIAL_CONFIG);
    setIsEditing(false);
  };

  return (
    <div className="banner-generator-container">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <h1 className="generator-title">Generador de Banners</h1>
            <p className="generator-subtitle">
              Diseña banners dinámicos con previsualización móvil en tiempo
              real.
            </p>
          </div>
        </div>

        <div className="row g-5">
          <div className="col-lg-7">
            <BannerEditor
              config={config}
              onChange={setConfig}
              onSave={handleSave}
              isEditing={isEditing}
              onCancel={handleCancel}
            />

            <BannerList onEdit={handleEdit} />
          </div>

          <div className="col-lg-5 d-flex justify-content-center">
            <div className="sticky-top">
              <div className="text-center mb-3">
                <span
                  className="badge rounded-pill bg-dark py-2 px-3 fw-bold"
                  style={{ letterSpacing: "0.1em" }}
                >
                  <div
                    className="spinner-grow spinner-grow-sm text-danger me-2"
                    role="status"
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
