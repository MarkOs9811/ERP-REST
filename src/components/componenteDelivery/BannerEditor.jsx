import React, { useEffect } from "react";
import * as LucideIcons from "lucide-react";
import { useForm } from "react-hook-form";
import "../../css/estilosDelivery/EstilosBannerEditro.css";

const BannerEditor = ({
  initialData,
  onSave,
  isEditing,
  onCancel,
  onLiveChange,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
  });

  // Observamos TODOS los campos para la previsualización
  const formData = watch();

  // EFECTO CRÍTICO: Envía los cambios al padre conforme el usuario escribe
  useEffect(() => {
    const subscription = watch((value) => {
      onLiveChange(value);
    });
    return () => subscription.unsubscribe();
  }, [watch, onLiveChange]);

  const presets = [
    {
      name: "Fire Glow",
      config: {
        theme: "custom",
        bg_color: "#9F1239",
        gradient: true,
        gradient_color: "#E11D48",
        has_aura: true,
        aura_color: "#F87171",
        text_color: "#ffffff",
      },
      color: "#9F1239",
    },
    {
      name: "Cyber Night",
      config: {
        theme: "custom",
        bg_color: "#09090b",
        gradient: true,
        gradient_color: "#27272a",
        has_aura: true,
        aura_color: "#3b82f6",
        text_color: "#ffffff",
      },
      color: "#09090b",
    },
    {
      name: "Sunset Glass",
      config: {
        theme: "glass",
        bg_color: "#f97316",
        gradient: true,
        gradient_color: "#fb923c",
        has_aura: true,
        aura_color: "#ffffff",
        text_color: "#ffffff",
      },
      color: "#f97316",
    },
    {
      name: "Green oferta",
      config: {
        theme: "glass",
        bg_color: "#37bd6a",
        gradient: true,
        gradient_color: "#12aa33",
        has_aura: true,
        aura_color: "#ffffff",
        text_color: "#ffffff",
      },
      color: "#12d171",
    },
  ];

  // Reemplaza tu función applyPreset con esta:
  const applyPreset = (presetConfig) => {
    Object.entries(presetConfig).forEach(([key, value]) => {
      setValue(key, value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    });
  };

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <form className="card p-3 " onSubmit={handleSubmit(onSubmit)}>
      <div className="card-header editor-header">
        <h3 className="editor-title">
          {isEditing ? "Editando Banner" : "Editor de Diseño"}
        </h3>
        <div className="d-flex gap-2">
          {presets.map((p) => (
            <div
              key={p.name}
              className="preset-dot"
              style={{
                backgroundColor: p.color,
                cursor: "pointer",
                border: "2px solid white",
                boxShadow: "0 0 5px rgba(0,0,0,0.2)",
              }}
              onClick={() => applyPreset(p.config)}
              title={p.name}
            />
          ))}
        </div>
      </div>

      <div className="card-body row g-3">
        {/* Información de Contenido */}
        <div className="col-md-6">
          <label className="form-label">Etiqueta (Tag)</label>
          <input type="text" className="form-control" {...register("tag")} />
        </div>

        <div className="col-md-6">
          <label className="form-label">
            Título <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.title ? "is-invalid" : ""}`}
            {...register("title", { required: "El título es obligatorio" })}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Subtítulo</label>
          <input
            type="text"
            className="form-control"
            {...register("subtitle")}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Oferta (Ej: 50% OFF)</label>
          <input
            type="text"
            className="form-control fw-bold"
            {...register("offer")}
          />
        </div>

        {/* Estilización */}
        <div className="col-md-6">
          <label className="form-label">Tema Base</label>
          <select className="form-select" {...register("theme")}>
            <option value="red">Fire Red</option>
            <option value="black">Night Black</option>
            <option value="glass">Glass Morphism</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">
            Redondez ({formData.border_radius}rem)
          </label>
          <input
            type="range"
            className="form-range"
            min="0"
            max="3"
            step="0.25"
            {...register("border_radius")}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Icono</label>
          <div className="d-flex gap-2">
            <div className="form-check form-switch">
              <input
                type="checkbox"
                className="form-check-input"
                {...register("has_icon")}
              />
            </div>
            {formData.has_icon && (
              <select
                className="form-select form-select-sm"
                {...register("icon_name")}
              >
                <option value="Flame">Fuego</option>
                <option value="Sparkles">Destellos</option>
                <option value="Gift">Regalo</option>
                <option value="Zap">Rayo</option>
              </select>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <label className="form-label">Estado</label>
          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              {...register("is_active")}
            />
            <span className="small text-muted">
              {formData.is_active ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>

        {/* Colores */}
        <div className="col-12 pt-3 border-top">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label small">Fondo</label>
              <input
                type="color"
                className="form-control form-control-color w-100"
                {...register("bg_color")}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small">Texto</label>
              <input
                type="color"
                className="form-control form-control-color w-100"
                {...register("text_color")}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small">Gradiente</label>
              <div className="form-check form-switch mb-1">
                <input
                  type="checkbox"
                  className="form-check-input"
                  {...register("gradient")}
                />
              </div>
              {formData.gradient && (
                <input
                  type="color"
                  className="form-control form-control-color w-100"
                  {...register("gradient_color")}
                />
              )}
            </div>
            <div className="col-md-3">
              <label className="form-label small">Aura</label>
              <div className="form-check form-switch mb-1">
                <input
                  type="checkbox"
                  className="form-check-input"
                  {...register("has_aura")}
                />
              </div>
              {formData.has_aura && (
                <input
                  type="color"
                  className="form-control form-control-color w-100"
                  {...register("aura_color")}
                />
              )}
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="col-12 pt-4 d-flex gap-2">
          {isEditing && (
            <button
              type="button"
              className="btn btn-light w-50 py-3 rounded-4"
              onClick={onCancel}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className={` ${isEditing ? "btn-activar " : "btn-guardar "}   fw-bold`}
          >
            {isEditing ? (
              <>
                <LucideIcons.Save size={18} className="me-2" /> Actualizar
              </>
            ) : (
              <>
                <LucideIcons.Plus size={18} className="me-2" /> Guardar Banner
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default BannerEditor;
