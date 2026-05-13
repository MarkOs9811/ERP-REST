import React from "react";
import * as LucideIcons from "lucide-react";
import "../../css/estilosDelivery/EstiloBannerPreview.css";

const BannerPreview = ({ config = {} }) => {
  // 1. EXTRACCIÓN SEGURA
  const theme = config.theme || "red";
  const bgColor = config.bg_color || "#E11D48";
  const textColor = config.text_color || "#FFFFFF";
  const gradientColor = config.gradient_color || "#9F1239";
  const auraColor = config.aura_color || "#ffffff";
  const borderRadius = config.border_radius || "1.5";
  const tag = config.tag || "EXCLUSIVO";
  const title = config.title || "Título";
  const subtitle = config.subtitle || "Subtítulo";
  const offer = config.offer || "OFERTA";

  const Icon =
    config.icon_name && LucideIcons[config.icon_name]
      ? LucideIcons[config.icon_name]
      : null;

  const getThemeClass = (currentTheme) => {
    switch (currentTheme) {
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

  // 2. CONSTRUCCIÓN DE ESTILOS SEGUROS
  const bannerStyle = {
    backgroundColor: bgColor,
    color: textColor,
    backgroundImage: config.gradient
      ? `linear-gradient(135deg, ${bgColor}, ${gradientColor})`
      : "none",
    borderRadius: `${borderRadius}rem`,
  };

  if (theme === "glass") {
    bannerStyle.backdropFilter = "blur(12px)";
    bannerStyle.backgroundColor = bgColor?.startsWith?.("#")
      ? `${bgColor}4D`
      : bgColor;
    bannerStyle.border = "1px solid rgba(255,255,255,0.2)";
  }

  return (
    <div className="banner-preview-phone shadow-lg">
      {/* Notch (Isla del teléfono) */}
      <div className="phone-notch"></div>

      <div className="phone-screen">
        {/* Barra de estado */}
        <div
          className="d-flex justify-content-between px-4 pt-3 pb-2"
          style={{ fontSize: "11px", fontWeight: "600" }}
        >
          <span>9:41</span>
          <div className="d-flex gap-2 align-items-center">
            <LucideIcons.Wifi size={12} />
            <LucideIcons.Battery size={12} />
          </div>
        </div>

        {/* Header de App (Corregido) */}
        <div className="d-flex justify-content-between align-items-center px-3 py-2">
          <div className="d-flex align-items-center gap-2">
            {/* Contenedor cuadrado perfecto para la campana */}
            <div
              className="bg-dark rounded-3 d-flex align-items-center justify-content-center"
              style={{ width: "32px", height: "32px" }}
            >
              <LucideIcons.Bell size={14} className="text-white" />
            </div>
            <span
              className="fw-900 fst-italic mb-0"
              style={{ fontSize: "16px", lineHeight: "1" }}
            >
              FIRE WOK
            </span>
          </div>
          {/* Contenedor circular perfecto para el avatar */}
          <div
            className="bg-light rounded-circle d-flex align-items-center justify-content-center border"
            style={{ width: "32px", height: "32px" }}
          >
            <LucideIcons.Users size={14} className="text-secondary" />
          </div>
        </div>

        {/* Buscador */}
        <div className="px-3 mb-4 mt-2">
          <div
            className="bg-light rounded-pill p-2 px-3 d-flex align-items-center gap-2 text-muted border-0 shadow-sm"
            style={{ fontSize: "12px" }}
          >
            <LucideIcons.Search size={14} />
            <span>¿Qué comerás hoy?</span>
          </div>
        </div>

        {/* El Banner real */}
        <div className="px-3 mb-4">
          <div
            className={`banner-content-box shadow-sm ${getThemeClass(theme)}`}
            style={bannerStyle}
          >
            {config.has_aura && (
              <div
                className="aura-effect"
                style={{
                  background: `radial-gradient(circle at center, ${auraColor} 0%, transparent 70%)`,
                }}
              />
            )}

            <div className="position-relative" style={{ zIndex: 10 }}>
              <div className="d-flex align-items-center gap-1 banner-tag mb-1">
                {config.has_icon && Icon && <Icon size={12} strokeWidth={3} />}
                <span>{tag}</span>
              </div>
              <p className="banner-title text-truncate">{title}</p>
              <p className="banner-subtitle mb-0 text-truncate">{subtitle}</p>
            </div>

            <div
              className="d-flex align-items-end justify-content-between position-relative mt-3"
              style={{ zIndex: 10 }}
            >
              <div className="banner-offer">{offer}</div>
            </div>
          </div>
        </div>

        {/* Categorías */}
        <div className="px-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fw-bold text-dark" style={{ fontSize: "14px" }}>
              Categorías
            </span>
            <span
              className="text-danger fw-bold"
              style={{ fontSize: "12px", cursor: "pointer" }}
            >
              Ver todo
            </span>
          </div>
          <div className="d-flex justify-content-between gap-2 overflow-hidden px-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="text-center d-flex flex-column align-items-center w-25"
              >
                {/* Cuadrado perfecto usando aspect-ratio */}
                <div
                  className="bg-light rounded-4 mb-2 w-100 shadow-sm border border-light"
                  style={{ aspectRatio: "1/1" }}
                ></div>
                <span
                  className="text-muted fw-medium"
                  style={{ fontSize: "9px" }}
                >
                  Categoría
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Nav inferior silueteada (Corregida para ser un círculo perfecto) */}
        <div className="position-absolute bottom-0 w-100 bg-white border-top d-flex justify-content-around align-items-center py-3 shadow-lg">
          {/* CÍRCULO PERFECTO: width y height fijos + flexbox */}
          <div
            className="bg-danger-subtle rounded-circle text-danger d-flex align-items-center justify-content-center"
            style={{ width: "45px", height: "45px" }}
          >
            <LucideIcons.LayoutGrid size={20} />
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
