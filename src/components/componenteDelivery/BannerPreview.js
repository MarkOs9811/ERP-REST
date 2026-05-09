import React from "react";
import * as LucideIcons from "lucide-react";
import "../../css/estilosDelivery/EstiloBannerPreview.css";

const BannerPreview = ({ config }) => {
  const Icon = config.iconName ? LucideIcons[config.iconName] : null;

  const getThemeClass = (theme) => {
    switch (theme) {
      case "red":
        return "bg-danger text-white";
      case "black":
        return "bg-dark text-white";
      case "white":
        return "bg-white text-dark border";
      default:
        return "";
    }
  };

  const bannerStyle = {
    backgroundColor: config.bgColor,
    color: config.textColor,
    backgroundImage: config.gradient
      ? `linear-gradient(135deg, ${config.bgColor}, ${config.gradientColor})`
      : "none",
    borderRadius: config.borderRadius || "1.5rem",
  };

  if (config.theme === "glass") {
    bannerStyle.backdropFilter = "blur(12px)";
    bannerStyle.backgroundColor = config.bgColor.startsWith("#")
      ? config.bgColor + "4D"
      : config.bgColor; // Add transparency if hex
    bannerStyle.border = "1px solid rgba(255,255,255,0.2)";
  }

  return (
    <div className="banner-preview-phone">
      <div className="phone-notch"></div>

      <div className="phone-screen">
        {/* Simulación de barra de estado */}
        <div
          className="d-flex justify-content-between px-4 pt-2 pb-1"
          style={{ fontSize: "10px", fontWeight: "bold" }}
        >
          <span>9:41</span>
          <div className="d-flex gap-1 align-items-center">
            <LucideIcons.Wifi size={10} />
            <LucideIcons.Battery size={10} />
          </div>
        </div>

        {/* Simulación de Header de App */}
        <div className="d-flex justify-content-between align-items-center px-3 py-2">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-dark rounded p-1">
              <LucideIcons.Bell size={12} className="text-white" />
            </div>
            <span className="fw-900 fst-italic" style={{ fontSize: "14px" }}>
              FIRE WOK
            </span>
          </div>
          <div className="bg-light rounded-circle p-1">
            <LucideIcons.Users size={12} />
          </div>
        </div>

        {/* Simulación de Buscador */}
        <div className="px-3 mb-4">
          <div
            className="bg-light rounded-3 p-2 d-flex align-items-center gap-2 text-muted"
            style={{ fontSize: "10px" }}
          >
            <LucideIcons.Search size={12} />
            <span>¿Qué comerás hoy?</span>
          </div>
        </div>

        {/* El Banner real */}
        <div className="px-2 mb-4">
          <div
            className={`banner-content-box ${getThemeClass(config.theme)}`}
            style={bannerStyle}
          >
            {config.hasAura && (
              <div
                className="aura-effect"
                style={{
                  background: `radial-gradient(circle at center, ${config.auraColor || "#ffffff"} 0%, transparent 70%)`,
                }}
              />
            )}

            <div className="position-relative" style={{ zIndex: 10 }}>
              <div className="d-flex align-items-center gap-1 banner-tag">
                {config.hasIcon && Icon && <Icon size={10} />}
                <span>{config.tag || "EXCLUSIVO"}</span>
              </div>
              <h2 className="banner-title">{config.title || "Título"}</h2>
              <p className="banner-subtitle mb-0">
                {config.subtitle || "Subtítulo"}
              </p>
            </div>

            <div
              className="d-flex align-items-end justify-content-between position-relative"
              style={{ zIndex: 10 }}
            >
              <div className="banner-offer">{config.offer || "OFERTA"}</div>
              {config.code && (
                <div className="banner-coupon">
                  <span className="coupon-label">CODE:</span>
                  <span className="coupon-code">{config.code}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Simulación de Categorías */}
        <div className="px-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-bold" style={{ fontSize: "12px" }}>
              Categorías
            </span>
            <span className="text-danger fw-bold" style={{ fontSize: "10px" }}>
              Ver todo
            </span>
          </div>
          <div className="d-flex gap-3 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div
                  className="bg-light rounded-4 mb-1"
                  style={{ width: "50px", height: "50px" }}
                ></div>
                <div style={{ fontSize: "8px" }}>Categoría</div>
              </div>
            ))}
          </div>
        </div>

        {/* Nav inferior silueteada */}
        <div
          className="position-absolute bottom-0 w-100 bg-white border-top d-flex justify-content-around align-items-center py-3"
          style={{
            borderBottomLeftRadius: "42px",
            borderBottomRightRadius: "42px",
          }}
        >
          <div className="bg-danger-subtle rounded-circle p-2 text-danger">
            <LucideIcons.LayoutGrid size={16} />
          </div>
          <div
            className="bg-light rounded-pill"
            style={{ width: "40px", height: "6px" }}
          ></div>
          <div
            className="bg-light rounded-pill"
            style={{ width: "40px", height: "6px" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BannerPreview;
