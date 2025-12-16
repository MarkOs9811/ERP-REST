import { Settings, Sun, Save, Percent } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { GetConfi } from "../../service/accionesConfiguracion/GetConfi";
import { PutData } from "../../service/CRUD/PutData";
import ToastAlert from "../componenteToast/ToastAlert";

export function Generales() {
  const [loading, setLoading] = useState(false);
  const [loadingIgv, setLoadingIgv] = useState(false);

  // 1. Obtener configuración
  const { data: configuracion = [] } = useQuery({
    queryKey: ["configuraciones"],
    queryFn: GetConfi,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // 2. Configurar formularios
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      color: "#ee5252", // Color por defecto
    },
  });

  const {
    register: registerIgv,
    handleSubmit: handleSubmitIgv,
    setValue: setValueIgv,
    watch: watchIgv,
  } = useForm({
    defaultValues: {
      igv: 18, // IGV por defecto en porcentaje entero
    },
  });

  // 3. Lógica de observación y carga inicial
  const colorSeleccionado = watch("color");
  const igvSeleccionado = watchIgv("igv");

  const itemEstilo = useMemo(() => {
    return (
      configuracion.find((item) => item.tipo?.toLowerCase() === "estilos") || {}
    );
  }, [configuracion]);

  const itemIgv = useMemo(() => {
    return (
      configuracion.find((item) => item.tipo?.toLowerCase() === "impuestos") ||
      {}
    );
  }, [configuracion]);

  useEffect(() => {
    if (itemEstilo.clave) {
      setValue("color", itemEstilo.clave);
    }
  }, [itemEstilo, setValue]);

  useEffect(() => {
    if (itemIgv.clave) {
      // Convertir de decimal a porcentaje entero (0.18 -> 18)
      const igvPercent = Math.round(parseFloat(itemIgv.clave) * 100);
      setValueIgv("igv", igvPercent);
    }
  }, [itemIgv, setValueIgv]);

  const onSubmitColor = async (data) => {
    setLoading(true);

    // Quitamos el '#' para enviarlo por URL
    const colorSinHash = data.color.replace("#", "");

    const success = await PutData("estiloGeneral", colorSinHash);

    if (success) {
      // Actualizamos visualmente la variable CSS global
      document.documentElement.style.setProperty("--color-brand", data.color);

      const estilosArray =
        JSON.parse(localStorage.getItem("estiloEmpresa")) || [];

      if (estilosArray.length > 0) {
        estilosArray[0].clave = data.color;
      }

      localStorage.setItem("estiloEmpresa", JSON.stringify(estilosArray));
    }

    setLoading(false);
  };

  const onSubmitIgv = async (data) => {
    setLoadingIgv(true);

    // Convertir porcentaje a decimal (18 -> 0.18)
    const igvDecimal = (data.igv / 100).toFixed(2);

    const success = await PutData("configIgv", igvDecimal);

    if (success) {
      ToastAlert("success", "IGV actualizado correctamente");
    }

    setLoadingIgv(false);
  };

  return (
    <div className="container py-4">
      <h3
        className="fw-bold mb-4 d-flex align-items-center gap-2"
        style={{ color: "#3b5162" }}
      >
        <Settings size={22} /> Configuración General
      </h3>

      <div className="row g-4">
        {/* Card de Configuración de Color */}
        <div className="col-md-6">
          <form onSubmit={handleSubmit(onSubmitColor)}>
            <div
              className="card shadow-sm border-0 h-100 p-3"
              style={{ borderRadius: 12 }}
            >
              <div className="mb-3 d-flex gap-2 align-middle">
                <span
                  className="alert border-0 fw-bold p-3 mb-0"
                  style={{
                    backgroundColor: `${colorSeleccionado}20`, // Transparencia al 20%
                    color: colorSeleccionado,
                    transition: "all 0.3s ease",
                  }}
                >
                  <Sun size={22} />
                </span>
                <div className="d-flex flex-column gap-1">
                  <span className="fw-bold">Tema y Color</span>
                  <p className="text-muted small mb-0">
                    Elige el color principal de tu marca
                  </p>
                </div>
              </div>

              <div className="d-flex gap-3 mt-3 align-items-center mb-4">
                {/* Input Color */}
                <input
                  type="color"
                  className="form-control form-control-color border-0 shadow-sm"
                  id="colorInput"
                  title="Elige tu color"
                  {...register("color", { required: true })}
                />

                <div className="form-control bg-light text-muted">
                  {colorSeleccionado?.toUpperCase()}
                </div>
              </div>

              {/* Botón Guardar */}
              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn text-white d-flex align-items-center gap-2"
                  style={{ backgroundColor: colorSeleccionado || "#ee5252" }}
                >
                  {loading ? (
                    "Guardando..."
                  ) : (
                    <>
                      <Save size={18} /> Guardar Color
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Card de Configuración de IGV */}
        <div className="col-md-6">
          <form onSubmit={handleSubmitIgv(onSubmitIgv)}>
            <div
              className="card shadow-sm border-0 h-100 p-3"
              style={{ borderRadius: 12 }}
            >
              <div className="mb-3 d-flex gap-2 align-middle">
                <span className="alert border-0 fw-bold p-3 mb-0 alert-dark">
                  <Percent size={22} />
                </span>
                <div className="d-flex flex-column gap-1">
                  <span className="fw-bold">Configuración de IGV</span>
                  <p className="text-muted small mb-0">
                    Establece el porcentaje de IGV para ventas
                  </p>
                </div>
              </div>

              <div className="d-flex gap-3 mt-3 align-items-center mb-4">
                {/* Input IGV */}
                <input
                  type="number"
                  min="1"
                  max="100"
                  step="1"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="form-control border-0 shadow-sm"
                  onInput={(e) => {
                    // Prevenir comenzar con 0 y limitar a 100
                    let value = e.target.value;
                    if (value.startsWith("0") && value.length > 1) {
                      e.target.value = value.slice(1);
                    }
                    if (parseInt(value) > 100) {
                      e.target.value = "100";
                    }
                  }}
                  onKeyDown={(e) => {
                    // Prevenir ingreso de punto y coma
                    if (e.key === "." || e.key === ",") {
                      e.preventDefault();
                    }
                  }}
                  {...registerIgv("igv", {
                    required: "El IGV es requerido",
                    min: { value: 1, message: "El IGV debe ser al menos 1%" },
                    max: {
                      value: 100,
                      message: "El IGV no puede exceder 100%",
                    },
                    validate: (value) => {
                      if (!Number.isInteger(Number(value))) {
                        return "El IGV debe ser un número entero";
                      }
                      if (value.toString().startsWith("0") && value !== "0") {
                        return "No puede comenzar con 0";
                      }
                      return true;
                    },
                  })}
                />

                <div className="form-control bg-light text-muted">
                  {igvSeleccionado || 0}%
                </div>
              </div>

              {/* Botón Guardar */}
              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  disabled={loadingIgv}
                  className="btn-principal d-flex align-items-center gap-2"
                >
                  {loadingIgv ? (
                    "Guardando..."
                  ) : (
                    <>
                      <Save size={18} /> Guardar IGV
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
