import React, { useEffect } from "react";
import * as LucideIcons from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
    <Card asChild>
      <form className="p-3" onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="editor-header">
          <h3 className="editor-title">
            {isEditing ? "Editando Banner" : "Editor de Diseño"}
          </h3>
          <div className="flex gap-2">
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
        </CardHeader>

        <CardContent className="grid grid-cols-12 gap-3">
          {/* Información de Contenido */}
          <div className="col-span-full md:col-span-6">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Etiqueta (Tag)
            </label>
            <input
              type="text"
              className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register("tag")}
            />
          </div>

          <div className="col-span-full md:col-span-6">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Título <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.title ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("title", { required: "El título es obligatorio" })}
            />
          </div>

          <div className="col-span-full md:col-span-6">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Subtítulo
            </label>
            <input
              type="text"
              className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register("subtitle")}
            />
          </div>

          <div className="col-span-full md:col-span-6">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Oferta (Ej: 50% OFF)
            </label>
            <input
              type="text"
              className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-bold"
              {...register("offer")}
            />
          </div>

          {/* Estilización */}
          <div className="col-span-full md:col-span-6">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Tema Base
            </label>
            <select
              className="h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register("theme")}
            >
              <option value="red">Fire Red</option>
              <option value="black">Night Black</option>
              <option value="glass">Glass Morphism</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>

          <div className="col-span-full md:col-span-6">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Redondez ({formData.border_radius}rem)
            </label>
            <input
              type="range"
              className="w-full accent-primary"
              min="0"
              max="3"
              step="0.25"
              {...register("border_radius")}
            />
          </div>

          <div className="col-span-full md:col-span-6">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Icono
            </label>
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="size-4 shrink-0 rounded border-input accent-primary"
                  {...register("has_icon")}
                />
              </div>
              {formData.has_icon && (
                <select
                  className="w-full appearance-auto rounded-md border-input bg-background py-1 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs"
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

          <div className="col-span-full md:col-span-6">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Estado
            </label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="size-4 shrink-0 rounded border-input accent-primary"
                {...register("is_active")}
              />
              <span className="text-sm text-muted-foreground">
                {formData.is_active ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>

          {/* Colores */}
          <div className="col-span-full pt-3 border-t">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-full md:col-span-3">
                <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                  Fondo
                </label>
                <input
                  type="color"
                  className="h-9 rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 form-control-color w-full"
                  {...register("bg_color")}
                />
              </div>
              <div className="col-span-full md:col-span-3">
                <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                  Texto
                </label>
                <input
                  type="color"
                  className="h-9 rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 form-control-color w-full"
                  {...register("text_color")}
                />
              </div>
              <div className="col-span-full md:col-span-3">
                <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                  Gradiente
                </label>
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    className="size-4 shrink-0 rounded border-input accent-primary"
                    {...register("gradient")}
                  />
                </div>
                {formData.gradient && (
                  <input
                    type="color"
                    className="h-9 rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 form-control-color w-full"
                    {...register("gradient_color")}
                  />
                )}
              </div>
              <div className="col-span-full md:col-span-3">
                <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                  Aura
                </label>
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    className="size-4 shrink-0 rounded border-input accent-primary"
                    {...register("has_aura")}
                  />
                </div>
                {formData.has_aura && (
                  <input
                    type="color"
                    className="h-9 rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 form-control-color w-full"
                    {...register("aura_color")}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="col-span-full pt-4 flex gap-2">
            {isEditing && (
              <Button
                type="button"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-muted text-foreground shadow-sm hover:bg-muted/80 w-1/2 py-3 rounded-lg"
                onClick={onCancel}
                variant="default"
              >
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              className={`${isEditing ? "btn-activar " : "btn-guardar "} font-bold`}
              variant="default"
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
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
};

export default BannerEditor;
