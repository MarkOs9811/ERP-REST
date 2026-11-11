import React, { useState, useEffect } from "react";
import { Store, UtensilsCrossed, CheckCircle2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

export default function FormConfiguracionEmpresa({ configuracion, onClose }) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  // Usamos 'clave' porque en tu BD el valor ("comida") está en la columna clave
  const [valorConfig, setValorConfig] = useState("");

  useEffect(() => {
    if (configuracion) {
      // Normalizamos el valor inicial
      const valorInicial =
        configuracion.clave?.toLowerCase() === "comida"
          ? "restaurante"
          : configuracion.clave || "";
      setValorConfig(valorInicial);
    }
  }, [configuracion]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Endpoint para actualizar la tabla configuraciones
      const response = await axiosInstance.put(
        `/configuracionesTipoVenta/${configuracion.id}`,
        {
          clave: valorConfig,
        },
      );

      if (response.data.success) {
        ToastAlert("success", "Configuración actualizada correctamente");
        // Refrescamos la data global sin recargar la página
        await queryClient.invalidateQueries({
          queryKey: ["confiEmpresa"],
        });
        onClose();
      } else {
        ToastAlert("error", "Error al actualizar");
      }
    } catch (error) {
      ToastAlert("error", error.response?.data?.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDERIZADO CONDICIONAL SEGÚN EL TIPO DE CONFIGURACIÓN ---

  // CASO 1: Es la configuración de Tipo de Venta (POS)
  if (configuracion?.nombre === "Tipo Venta") {
    return (
      <form onSubmit={handleUpdate} className="flex flex-col h-full p-3">
        <p className="text-sm text-muted-foreground mb-4">
          {configuracion.descripcion}
        </p>

        <div className="flex flex-col gap-3 mb-4">
          {/* Opción Restaurante */}
          <div
            className={`flex items-center gap-4 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              valorConfig === "restaurante"
                ? "bg-amber-500/5 border-amber-500 shadow-sm"
                : "bg-card border-border/50 hover:border-amber-500/50 hover:bg-amber-500/5"
            }`}
            onClick={() => setValorConfig("restaurante")}
          >
            <div
              className={`flex items-center justify-center p-2.5 rounded-md transition-colors ${
                valorConfig === "restaurante"
                  ? "bg-amber-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <UtensilsCrossed size={24} />
            </div>
            
            <div className="grow">
              <h6 className="font-bold text-foreground mb-0.5">
                Gastronomía / Restaurante
              </h6>
              <p className="text-xs text-muted-foreground m-0 leading-tight">
                Habilita mesas, comandas y pantalla de cocina (KDS).
              </p>
            </div>
            
            <div className="shrink-0">
              {valorConfig === "restaurante" ? (
                <CheckCircle2 className="text-amber-500 size-6 animate-in zoom-in" />
              ) : (
                <div className="size-6 rounded-full border-2 border-muted" />
              )}
            </div>
          </div>

          {/* Opción Retail */}
          <div
            className={`flex items-center gap-4 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              valorConfig === "retail"
                ? "bg-emerald-500/5 border-emerald-500 shadow-sm"
                : "bg-card border-border/50 hover:border-emerald-500/50 hover:bg-emerald-500/5"
            }`}
            onClick={() => setValorConfig("retail")}
          >
            <div
              className={`flex items-center justify-center p-2.5 rounded-md transition-colors ${
                valorConfig === "retail"
                  ? "bg-emerald-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Store size={24} />
            </div>
            
            <div className="grow">
              <h6 className="font-bold text-foreground mb-0.5">
                Retail / Tienda
              </h6>
              <p className="text-xs text-muted-foreground m-0 leading-tight">
                Enfocado en ventas rápidas y lector de código de barras.
              </p>
            </div>
            
            <div className="shrink-0">
              {valorConfig === "retail" ? (
                <CheckCircle2 className="text-emerald-500 size-6 animate-in zoom-in" />
              ) : (
                <div className="size-6 rounded-full border-2 border-muted" />
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-auto pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="px-4"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="px-4"
          >
            {loading ? "Guardando..." : "Aplicar Cambios"}
          </Button>
        </div>
      </form>
    );
  }

  // CASO 2: Es cualquier otra configuración futura de tipo "empresa"
  return (
    <form onSubmit={handleUpdate} className="flex flex-col h-full p-3">
      <p className="text-sm text-muted-foreground mb-4">
        {configuracion?.descripcion}
      </p>

      <div className="mb-4">
        <Label className="block mb-2">Valor de Configuración</Label>
        <Input
          type="text"
          value={valorConfig}
          onChange={(e) => setValorConfig(e.target.value)}
          placeholder="Ingrese el valor..."
          required
        />
      </div>

      <div className="flex justify-end gap-2 mt-auto pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="px-4"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="px-4"
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  );
}