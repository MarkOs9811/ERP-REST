import { Settings, Sun, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { GetConfi } from "../../service/accionesConfiguracion/GetConfi";
import { PutData } from "../../service/CRUD/PutData";

export function Generales() {
  const [loading, setLoading] = useState(false);

  // 1. Obtener configuración
  const { data: configuracion = [] } = useQuery({
    queryKey: ["configuraciones"],
    queryFn: GetConfi,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // 2. Configurar formulario
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      color: "#ee5252", // Color por defecto
    },
  });

  // 3. Lógica de observación y carga inicial
  const colorSeleccionado = watch("color");
  const itemEstilo = useMemo(() => {
    return (
      configuracion.find((item) => item.tipo?.toLowerCase() === "estilos") || {}
    );
  }, [configuracion]);

  useEffect(() => {
    if (itemEstilo.clave) {
      setValue("color", itemEstilo.clave);
    }
  }, [itemEstilo, setValue]);

  const onSubmit = async (data) => {
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
          <form onSubmit={handleSubmit(onSubmit)}>
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
      </div>
    </div>
  );
}
