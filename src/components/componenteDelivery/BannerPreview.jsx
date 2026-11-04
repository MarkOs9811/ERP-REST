import React from "react";
import * as LucideIcons from "lucide-react";


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
          className="flex justify-between px-4 pt-3 pb-2"
          style={{ fontSize: "11px", fontWeight: "600" }}
        >
          <span>9:41</span>
          <div className="flex gap-2 items-center">
            <LucideIcons.Wifi size={12} />
            <LucideIcons.Battery size={12} />
          </div>
        </div>

        {/* Header de App (Corregido) */}
        <div className="flex justify-between items-center px-3 py-2">
          <div className="flex items-center gap-2">
            {/* Contenedor cuadrado perfecto para la campana */}
            <div
              className="bg-foreground rounded-md flex items-center justify-center"
              style={{ width: "32px", height: "32px" }}
            >
              <LucideIcons.Bell size={14} className="text-white" />
            </div>
            <span
              className="fw-900 italic mb-0"
              style={{ fontSize: "16px", lineHeight: "1" }}
            >
              FIRE WOK
            </span>
          </div>
          {/* Contenedor circular perfecto para el avatar */}
          <div
            className="bg-muted rounded-full flex items-center justify-center border"
            style={{ width: "32px", height: "32px" }}
          >
            <LucideIcons.Users size={14} className="text-muted-foreground" />
          </div>
        </div>

        {/* Buscador */}
        <div className="px-3 mb-4 mt-2">
          <div
            className="bg-muted rounded-full p-2 px-3 flex items-center gap-2 text-muted-foreground border-0 shadow-sm"
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

            <div className="relative" style={{ zIndex: 10 }}>
              <div className="flex items-center gap-1 banner-tag mb-1">
                {config.has_icon && Icon && <Icon size={12} strokeWidth={3} />}
                <span>{tag}</span>
              </div>
              <p className="banner-title truncate">{title}</p>
              <p className="banner-subtitle mb-0 truncate">{subtitle}</p>
            </div>

            <div
              className="flex items-end justify-between relative mt-3"
              style={{ zIndex: 10 }}
            >
              <div className="banner-offer">{offer}</div>
            </div>
          </div>
        </div>

        {/* Categorías */}
        <div className="px-3">
          <div className="flex justify-between items-center mb-3">
            <span
              className="font-bold text-foreground"
              style={{ fontSize: "14px" }}
            >
              Categorías
            </span>
            <span
              className="text-destructive font-bold"
              style={{ fontSize: "12px", cursor: "pointer" }}
            >
              Ver todo
            </span>
          </div>
          <div className="flex justify-between gap-2 overflow-hidden px-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="text-center flex flex-col items-center w-1/4"
              >
                {/* Cuadrado perfecto usando aspect-ratio */}
                <div
                  className="bg-muted rounded-lg mb-2 w-full shadow-sm border-light"
                  style={{ aspectRatio: "1/1" }}
                ></div>
                <span
                  className="text-muted-foreground font-medium"
                  style={{ fontSize: "9px" }}
                >
                  Categoría
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Nav inferior silueteada (Corregida para ser un círculo perfecto) */}
        <div className="absolute bottom-0 w-full bg-background border-t flex justify-around items-center py-3 shadow-lg">
          {/* CÍRCULO PERFECTO: width y height fijos + flexbox */}
          <div
            className="bg-destructive/10 rounded-full text-destructive flex items-center justify-center"
            style={{ width: "45px", height: "45px" }}
          >
            <LucideIcons.LayoutGrid size={20} />
          </div>
          <div
            className="bg-muted rounded-full"
            style={{ width: "40px", height: "6px" }}
          ></div>
          <div
            className="bg-muted rounded-full"
            style={{ width: "40px", height: "6px" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BannerPreview;
