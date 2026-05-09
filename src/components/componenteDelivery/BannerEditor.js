import React from "react";
import * as LucideIcons from "lucide-react";
import "../../css/estilosDelivery/EstilosBannerEditro.css";

const BannerEditor = ({ config, onChange, onSave, isEditing, onCancel }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({
      ...config,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const presets = [
    {
      name: "Fire Glow",
      config: {
        theme: "custom",
        bgColor: "#9F1239",
        gradient: true,
        gradientColor: "#E11D48",
        hasAura: true,
        auraColor: "#F87171",
        textColor: "#ffffff",
      },
      color: "#9F1239",
    },
    {
      name: "Cyber Night",
      config: {
        theme: "custom",
        bgColor: "#09090b",
        gradient: true,
        gradientColor: "#27272a",
        hasAura: true,
        auraColor: "#3b82f6",
        textColor: "#ffffff",
      },
      color: "#09090b",
    },
    {
      name: "Sunset Glass",
      config: {
        theme: "glass",
        bgColor: "#f97316",
        gradient: true,
        gradientColor: "#fb923c",
        hasAura: true,
        auraColor: "#ffffff",
        textColor: "#ffffff",
      },
      color: "#f97316",
    },
    {
      name: "Electric Purple",
      config: {
        theme: "custom",
        bgColor: "#4c1d95",
        gradient: true,
        gradientColor: "#7c3aed",
        hasAura: true,
        auraColor: "#a78bfa",
        textColor: "#ffffff",
      },
      color: "#7c3aed",
    },
    {
      name: "Clean Emerald",
      config: {
        theme: "custom",
        bgColor: "#064e3b",
        gradient: true,
        gradientColor: "#059669",
        hasAura: true,
        auraColor: "#34d399",
        textColor: "#ffffff",
      },
      color: "#059669",
    },
    {
      name: "Golden Luxury",
      config: {
        theme: "custom",
        bgColor: "#78350f",
        gradient: true,
        gradientColor: "#d97706",
        hasAura: true,
        auraColor: "#fef3c7",
        textColor: "#ffffff",
      },
      color: "#d97706",
    },
    {
      name: "Midnight Bloom",
      config: {
        theme: "custom",
        bgColor: "#1e1b4b",
        gradient: true,
        gradientColor: "#4338ca",
        hasAura: true,
        auraColor: "#818cf8",
        textColor: "#ffffff",
      },
      color: "#1e1b4b",
    },
    {
      name: "Pastel Dream",
      config: {
        theme: "custom",
        bgColor: "#fdf2f8",
        gradient: true,
        gradientColor: "#fae8ff",
        hasAura: true,
        auraColor: "#f472b6",
        textColor: "#be185d",
      },
      color: "#fae8ff",
    },
    {
      name: "Ocean breeze",
      config: {
        theme: "custom",
        bgColor: "#0c4a6e",
        gradient: true,
        gradientColor: "#0ea5e9",
        hasAura: true,
        auraColor: "#7dd3fc",
        textColor: "#ffffff",
      },
      color: "#0ea5e9",
    },
    {
      name: "Neon Night",
      config: {
        theme: "custom",
        bgColor: "#000000",
        gradient: true,
        gradientColor: "#1a1a1a",
        hasAura: true,
        auraColor: "#39ff14",
        textColor: "#39ff14",
      },
      color: "#39ff14",
    },
  ];

  return (
    <div className="banner-editor-card">
      <div className="editor-header">
        <h3 className="editor-title">
          {isEditing ? "Editando Banner" : "Editor de Diseño"}
        </h3>
        <div className="d-flex gap-2">
          {presets.map((p) => (
            <div
              key={p.name}
              className="preset-dot"
              style={{ backgroundColor: p.color }}
              onClick={() => onChange({ ...config, ...p.config })}
              title={p.name}
            />
          ))}
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Etiqueta (Tag)</label>
          <input
            type="text"
            name="tag"
            className="form-control"
            value={config.tag}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Título</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={config.title}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Subtítulo</label>
          <input
            type="text"
            name="subtitle"
            className="form-control"
            value={config.subtitle}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Oferta Principal</label>
          <input
            type="text"
            name="offer"
            className="form-control fw-bold"
            value={config.offer}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Código Cupón</label>
          <input
            type="text"
            name="code"
            className="form-control"
            value={config.code}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Tema Base</label>
          <select
            name="theme"
            className="form-select"
            value={config.theme}
            onChange={handleChange}
          >
            <option value="red">Fire Red</option>
            <option value="black">Night Black</option>
            <option value="white">Clean White</option>
            <option value="glass">Glass Morphism</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Icono</label>
          <div className="d-flex gap-2 align-items-center">
            <div className="form-check form-switch m-0">
              <input
                type="checkbox"
                name="hasIcon"
                className="form-check-input"
                checked={config.hasIcon}
                onChange={handleChange}
              />
            </div>
            {config.hasIcon && (
              <select
                name="iconName"
                className="form-select form-select-sm"
                value={config.iconName}
                onChange={handleChange}
              >
                <option value="Flame">Fuego</option>
                <option value="Sparkles">Destellos</option>
                <option value="Gift">Regalo</option>
                <option value="Star">Estrella</option>
                <option value="Zap">Rayo</option>
                <option value="Ticket">Ticket</option>
                <option value="Clock">Reloj</option>
              </select>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <label className="form-label">Redondez ({config.borderRadius})</label>
          <input
            type="range"
            name="borderRadius"
            className="form-range"
            min="0"
            max="3"
            step="0.25"
            value={parseFloat(config.borderRadius)}
            onChange={(e) =>
              onChange({ ...config, borderRadius: `${e.target.value}rem` })
            }
          />
        </div>

        <div className="col-12 pt-2 border-top border-light">
          <h6 className="form-label text-dark mb-3">
            Personalización Avanzada
          </h6>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Color Fondo / Base</label>
              <input
                type="color"
                name="bgColor"
                className="form-control color-input"
                value={config.bgColor}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Color Texto</label>
              <input
                type="color"
                name="textColor"
                className="form-control color-input"
                value={config.textColor}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <label className="form-label mb-0">Usar Gradiente</label>
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    name="gradient"
                    className="form-check-input"
                    checked={config.gradient}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {config.gradient && (
                <input
                  type="color"
                  name="gradientColor"
                  className="form-control color-input"
                  value={config.gradientColor}
                  onChange={handleChange}
                />
              )}
            </div>

            <div className="col-md-6">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <label className="form-label mb-0">Resplandor (Aura)</label>
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    name="hasAura"
                    className="form-check-input"
                    checked={config.hasAura}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {config.hasAura && (
                <input
                  type="color"
                  name="auraColor"
                  className="form-control color-input"
                  value={config.auraColor}
                  onChange={handleChange}
                />
              )}
            </div>
          </div>
        </div>

        <div className="col-12 pt-3 d-flex gap-2">
          {isEditing && (
            <button
              className="btn btn-outline-secondary w-50 py-3 rounded-4 fw-bold text-uppercase"
              onClick={onCancel}
            >
              Cancelar
            </button>
          )}
          <button
            className={`btn ${isEditing ? "btn-success w-50" : "btn-dark w-100"} py-3 rounded-4 fw-bold fst-italic text-uppercase`}
            onClick={onSave}
          >
            {isEditing ? (
              <>
                <LucideIcons.Save size={18} className="me-2" />
                Actualizar
              </>
            ) : (
              <>
                <LucideIcons.Plus size={18} className="me-2" />
                Guardar Banner
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerEditor;
