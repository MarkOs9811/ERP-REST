import {
  Settings,
  Save,
  Percent,
  Coins,
  Globe,
  CreditCard,
  ExternalLink,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { GetConfi } from "../../service/accionesConfiguracion/GetConfi";
import { PutData } from "../../service/CRUD/PutData";
import { PostData } from "../../service/CRUD/PostData";

export function Generales() {
  const navigate = useNavigate();

  // 1. Obtener configuración
  const { data: configuracion = [] } = useQuery({
    queryKey: ["configuraciones"],
    queryFn: GetConfi,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // 2. Configurar formularios
  const {
    register: registerIgv,
    handleSubmit: handleSubmitIgv,
    setValue: setValueIgv,
    watch: watchIgv,
  } = useForm({ defaultValues: { igv: 18 } });

  const {
    register: registerMoneda,
    handleSubmit: handleSubmitMoneda,
    setValue: setValueMoneda,
  } = useForm({ defaultValues: { simbolo: "S/." } });

  const {
    register: registerZona,
    handleSubmit: handleSubmitZona,
    setValue: setValueZona,
  } = useForm({ defaultValues: { zona: "America/Lima" } });

  const igvSeleccionado = watchIgv("igv");

  // 3. Memorizar valores del backend
  const itemIgv = useMemo(
    () =>
      configuracion.find((item) => item.tipo?.toLowerCase() === "impuestos") ||
      {},
    [configuracion],
  );
  const itemMoneda = useMemo(
    () =>
      configuracion.find((item) => item.tipo?.toLowerCase() === "moneda") || {},
    [configuracion],
  );
  const itemZona = useMemo(
    () =>
      configuracion.find(
        (item) => item.tipo?.toLowerCase() === "zona_horaria",
      ) || {},
    [configuracion],
  );

  // Carga inicial de datos
  useEffect(() => {
    if (itemIgv.clave)
      setValueIgv("igv", Math.round(parseFloat(itemIgv.clave) * 100));
    if (itemMoneda.clave) setValueMoneda("simbolo", itemMoneda.clave);
    if (itemZona.clave) setValueZona("zona", itemZona.clave);
  }, [
    itemIgv,
    itemMoneda,
    itemZona,
    setValueIgv,
    setValueMoneda,
    setValueZona,
  ]);

  // 4. Mutaciones (Reemplazan los useState manuales)
  const mutationIgv = useMutation({
    mutationFn: async (data) => {
      const igvDecimal = (data.igv / 100).toFixed(2);
      return await PutData("configIgv", igvDecimal);
    },
  });

  const mutationMoneda = useMutation({
    mutationFn: async (data) => {
      const success = await PostData("configMoneda", { simbolo: data.simbolo });
      if (success) {
        localStorage.setItem("simboloMoneda", data.simbolo);
      }
      return success;
    },
  });

  const mutationZona = useMutation({
    mutationFn: async (data) => {
      const success = await PostData("configZona", { zona: data.zona });
      if (success) {
        localStorage.setItem("zonaHoraria", data.zona);
      }
      return success;
    },
  });

  return (
    <div className="container py-4">
      <h3
        className="fw-bold mb-4 d-flex align-items-center gap-2"
        style={{ color: "var(--text-main)" }}
      >
        <Settings size={22} /> Configuración General
      </h3>

      <div className="row g-4">
        {/* Card IGV */}
        <div className="col-md-6">
          <form
            onSubmit={handleSubmitIgv((data) => mutationIgv.mutate(data))}
            className="h-100"
          >
            <div className="card border p-3">
              <div className="mb-3 d-flex gap-2 align-items-center">
                <span
                  className="alert border-0 fw-bold p-2 mb-0"
                  style={{
                    backgroundColor: "var(--bg-saffron-soft)",
                    color: "var(--fw-saffron)",
                  }}
                >
                  <Percent size={22} />
                </span>
                <div className="d-flex flex-column gap-1">
                  <span
                    className="fw-bold"
                    style={{ color: "var(--text-main)" }}
                  >
                    Impuesto General (IGV/IVA)
                  </span>
                  <p
                    className="small mb-0"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Establece el porcentaje aplicable a las ventas.
                  </p>
                </div>
              </div>
              <div className="d-flex gap-3 mt-3 align-items-center mb-4">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  inputMode="numeric"
                  className="form-control border "
                  {...registerIgv("igv", { required: true })}
                />
                <div
                  className="form-control bg-light border w-25 text-center"
                  style={{ color: "var(--text-muted)" }}
                >
                  {igvSeleccionado || 0}%
                </div>
              </div>
              <div className="d-flex justify-content-end mt-auto">
                <button
                  type="submit"
                  disabled={mutationIgv.isPending}
                  className="btn-guardar px-3"
                >
                  {mutationIgv.isPending ? (
                    "Guardando..."
                  ) : (
                    <>
                      <Save size={18} className="me-2" /> Guardar IGV
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Card Moneda */}
        <div className="col-md-6">
          <form
            onSubmit={handleSubmitMoneda((data) => mutationMoneda.mutate(data))}
            className="h-100"
          >
            <div className="card border p-3">
              <div className="mb-3 d-flex gap-2 align-items-center">
                <span
                  className="alert border-0 fw-bold p-2 mb-0"
                  style={{
                    backgroundColor: "var(--bg-emerald-soft)",
                    color: "var(--fw-emerald)",
                  }}
                >
                  <Coins size={22} />
                </span>
                <div className="d-flex flex-column gap-1">
                  <span
                    className="fw-bold"
                    style={{ color: "var(--text-main)" }}
                  >
                    Moneda del Sistema
                  </span>
                  <p
                    className="small mb-0"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Símbolo monetario para reportes y tickets.
                  </p>
                </div>
              </div>
              <div className="mt-3 mb-4">
                <select
                  className="form-select border "
                  {...registerMoneda("simbolo", { required: true })}
                >
                  <option value="S/.">S/. (Sol Peruano)</option>
                  <option value="$">$ (Dólar / Peso)</option>
                  <option value="€">€ (Euro)</option>
                  <option value="Bs.">Bs. (Bolívar / Boliviano)</option>
                  <option value="Q">Q (Quetzal)</option>
                </select>
              </div>
              <div className="small text-muted ms-4">
                <span>Moneda actual: </span>"<b>{itemMoneda.clave}</b>"
              </div>
              <div className="d-flex justify-content-end mt-auto">
                <button
                  type="submit"
                  disabled={mutationMoneda.isPending}
                  className="btn-guardar px-3"
                >
                  {mutationMoneda.isPending ? (
                    "Guardando..."
                  ) : (
                    <>
                      <Save size={18} className="me-2" /> Guardar Moneda
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Card Zona Horaria */}
        <div className="col-md-6">
          <form
            onSubmit={handleSubmitZona((data) => mutationZona.mutate(data))}
            className="h-100"
          >
            <div className="card border p-3">
              <div className="mb-3 d-flex gap-2 align-items-center">
                <span
                  className="alert border-0 fw-bold p-2 mb-0"
                  style={{
                    backgroundColor: "var(--bg-strawberry-soft)",
                    color: "var(--fw-strawberry)",
                  }}
                >
                  <Globe size={22} />
                </span>
                <div className="d-flex flex-column gap-1">
                  <span
                    className="fw-bold"
                    style={{ color: "var(--text-main)" }}
                  >
                    Zona Horaria (Timezone)
                  </span>
                  <p
                    className="small mb-0"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Sincroniza la hora de las ventas con tu región.
                  </p>
                </div>
              </div>

              <div className="mt-3 mb-4">
                <select
                  className="form-select border "
                  {...registerZona("zona", { required: true })}
                >
                  <option value="America/Lima">América / Lima (Perú)</option>
                  <option value="America/Bogota">
                    América / Bogotá (Colombia)
                  </option>
                  <option value="America/Mexico_City">
                    América / Ciudad de México
                  </option>
                  <option value="America/Santiago">
                    América / Santiago (Chile)
                  </option>
                  <option value="America/Argentina/Buenos_Aires">
                    América / Buenos Aires
                  </option>
                </select>
              </div>
              <div className="small text-muted ms-4">
                <span>Zona Horaria actual: </span>
                <b>{itemZona.clave}</b>
              </div>
              <div className="d-flex justify-content-end mt-auto">
                <button
                  type="submit"
                  disabled={mutationZona.isPending}
                  className="btn-guardar px-3"
                >
                  {mutationZona.isPending ? (
                    "Guardando..."
                  ) : (
                    <>
                      <Save size={18} className="me-2" /> Guardar Zona
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Card Accesos Rápidos: Métodos de Pago */}
        <div className="col-md-6">
          <div className="card border p-3">
            <div className="mb-3 d-flex gap-2 align-items-center">
              <span
                className="alert border-0 fw-bold p-2 mb-0"
                style={{
                  backgroundColor: "rgba(25, 143, 80, 0.1)",
                  color: "var(--fw-emerald)",
                }}
              >
                <CreditCard size={22} />
              </span>
              <div className="d-flex flex-column gap-1">
                <span className="fw-bold" style={{ color: "var(--text-main)" }}>
                  Métodos de Pago
                </span>
                <p
                  className="small mb-0"
                  style={{ color: "var(--text-muted)" }}
                >
                  Configura Yape, Plin, tarjetas y efectivo.
                </p>
              </div>
            </div>
            <div className="mt-2 mb-4">
              <p className="small" style={{ color: "var(--text-muted)" }}>
                Los métodos de pago, integraciones bancarias y billeteras
                digitales se gestionan centralizados dentro del módulo de
                ventas.
              </p>
            </div>
            <div className="d-flex justify-content-end mt-auto">
              <button
                type="button"
                className="btn-generico d-flex align-items-center gap-2"
                onClick={() => navigate("/ventas/ajustesVentas")}
              >
                Configurar Pagos <ExternalLink size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
