import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import BotonAnimado from "../../componentesReutilizables/BotonAnimado";
// 🔥 Agregamos CheckCircle a los iconos de Lucide
import {
  Search,
  Printer,
  StickyNote,
  Loader2,
  CheckCircle,
} from "lucide-react";
import ToastAlert from "../../componenteToast/ToastAlert";
import { ConsultarDocumento } from "../../../service/accionesVender/ConsultaDocumentos";

export function RealizarPago({
  totalPreventa,
  igv,
  handleCrearJson,
  loading,
  error,
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setFocus,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: {
      nombreReferencia: "",
      pagoCon: 0,
      imprimirTicket: true,
      notas: "",
    },
  });

  const [isSearching, setIsSearching] = useState(false);
  const [tipoDocBusqueda, setTipoDocBusqueda] = useState("DNI");
  const [numDocBusqueda, setNumDocBusqueda] = useState("");
  const [errorBusqueda, setErrorBusqueda] = useState(null);
  const [busquedaExitosa, setBusquedaExitosa] = useState(false);

  const pagoCon = watch("pagoCon");
  const vuelto =
    pagoCon - totalPreventa > 0 ? (pagoCon - totalPreventa).toFixed(2) : "0.00";

  const onSubmit = (data) => {
    handleCrearJson(data);
  };

  const subTotal = (totalPreventa - igv).toFixed(2);

  const generarBilletesSugeridos = (total) => {
    const t = Number(total) || 0;
    let sugerencias = [t];

    const redondeo10 = Math.ceil(t / 10) * 10;
    if (redondeo10 > t) sugerencias.push(redondeo10);

    if (t < 20 && !sugerencias.includes(20)) sugerencias.push(20);
    if (t < 50 && !sugerencias.includes(50)) sugerencias.push(50);
    if (t < 100 && !sugerencias.includes(100)) sugerencias.push(100);
    if (t >= 100) sugerencias.push(Math.ceil(t / 100) * 100);

    return [...new Set(sugerencias)].sort((a, b) => a - b).slice(0, 4);
  };

  const billetes = generarBilletesSugeridos(totalPreventa);

  // 🔥 LÓGICA DE BÚSQUEDA
  const ejecutarBusqueda = async (documento) => {
    setErrorBusqueda(null);
    setBusquedaExitosa(false);
    clearErrors("nombreReferencia");

    setIsSearching(true);
    const resultado = await ConsultarDocumento(documento, tipoDocBusqueda);

    if (resultado.success) {
      setValue("nombreReferencia", resultado.nombre, { shouldValidate: true });
      setBusquedaExitosa(true);

      setTimeout(() => setFocus("nombreReferencia"), 50);

      ToastAlert("success", "Cliente encontrado");
    } else {
      setErrorBusqueda(resultado.message);
      ToastAlert("warning", "No encontrado. Ingrese el nombre manualmente.");
      setFocus("nombreReferencia");
    }
    setIsSearching(false);
  };

  // 🔥 Búsqueda automática
  useEffect(() => {
    const docLength = numDocBusqueda.length;
    if (tipoDocBusqueda === "DNI" && docLength === 8) {
      ejecutarBusqueda(numDocBusqueda);
    } else if (tipoDocBusqueda === "RUC" && docLength === 11) {
      ejecutarBusqueda(numDocBusqueda);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numDocBusqueda, tipoDocBusqueda]);

  // 🔥 NUEVO: Manejador global del Enter para procesar el pago desde cualquier input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Evitamos que haga un submit nativo descontrolado
      if (!loading) {
        handleSubmit(onSubmit)(); // Disparamos la validación de RHF y el envío
      }
    }
  };

  return (
    <div className="card flex-grow-1 d-flex flex-column h-100 border overflow-auto">
      <div className="card-header bg-white py-3">
        <h5 className="mb-0 fw-bold">Resumen</h5>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={handleKeyDown} // 🔥 Escuchamos el Enter en todo el formulario
        className="d-flex flex-column h-100 overflow-hidden"
      >
        <div
          className="card-body overflow-auto p-3"
          style={{ maxHeight: "calc(100vh - 250px)" }}
        >
          {/* ========================================== */}
          {/* 1. SECCIÓN DE BÚSQUEDA AUTOMÁTICA COMPACTA */}
          {/* ========================================== */}
          <div className="mb-2 p-2 bg-light rounded border">
            <label
              className="small text-muted fw-bold mb-1"
              style={{ fontSize: "0.75rem" }}
            >
              Buscar en SUNAT/RENIEC (Opcional)
            </label>
            <div className="input-group input-group-sm">
              <select
                className="form-select text-center"
                style={{ maxWidth: "70px", fontWeight: "600" }}
                value={tipoDocBusqueda}
                onChange={(e) => {
                  setTipoDocBusqueda(e.target.value);
                  setNumDocBusqueda("");
                  setErrorBusqueda(null);
                  setBusquedaExitosa(false);
                }}
              >
                <option value="DNI">DNI</option>
                <option value="RUC">RUC</option>
              </select>

              {/* Input con icono flotante */}
              <div className="position-relative flex-grow-1">
                <input
                  type="text"
                  className={`form-control form-control-sm w-100 ${
                    errorBusqueda ? "is-invalid" : ""
                  }`}
                  placeholder={`Nº de ${tipoDocBusqueda}...`}
                  value={numDocBusqueda}
                  maxLength={tipoDocBusqueda === "DNI" ? 8 : 11}
                  style={{ paddingRight: "30px" }}
                  onChange={(e) => {
                    const soloNumeros = e.target.value.replace(/\D/g, "");
                    setNumDocBusqueda(soloNumeros);
                    setErrorBusqueda(null);
                    setBusquedaExitosa(false);
                  }}
                />
                <div
                  className="position-absolute top-50 end-0 translate-middle-y pe-2 d-flex align-items-center"
                  style={{ zIndex: 4, pointerEvents: "none" }}
                >
                  {isSearching ? (
                    <Loader2
                      size={16}
                      className="text-primary"
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                  ) : (
                    <Search size={16} className="text-muted" />
                  )}
                </div>
              </div>
            </div>
            {errorBusqueda && (
              <small
                className="text-danger mt-1 d-block"
                style={{ fontSize: "0.7rem", lineHeight: "1" }}
              >
                {errorBusqueda}
              </small>
            )}
          </div>

          {/* ========================================== */}
          {/* 2. CAMPO DE SALIDA FINAL */}
          {/* ========================================== */}
          <div className="mb-2">
            <label
              htmlFor="nombreReferencia"
              className="small text-muted mb-1"
              style={{ fontSize: "0.75rem" }}
            >
              Nombre / Razón Social <span className="text-danger">*</span>
            </label>
            <div className="position-relative">
              <input
                id="nombreReferencia"
                type="text"
                className={`form-control form-control-sm fw-medium ${
                  errors.nombreReferencia
                    ? "is-invalid"
                    : busquedaExitosa
                      ? "border-success text-success" // 🔥 Solo cambiamos borde y texto sin usar is-valid
                      : ""
                }`}
                style={{ paddingRight: busquedaExitosa ? "30px" : "10px" }}
                placeholder="Nombre completo..."
                {...register("nombreReferencia", {
                  required: "Requerido",
                  onChange: () => setBusquedaExitosa(false), // Quitamos el éxito si lo edita manual
                })}
              />
              {/* 🔥 Icono flotante CheckCircle nativo de Lucide */}
              {busquedaExitosa && !errors.nombreReferencia && (
                <div
                  className="position-absolute top-50 end-0 translate-middle-y pe-2 d-flex align-items-center"
                  style={{ pointerEvents: "none", zIndex: 4 }}
                >
                  <CheckCircle size={16} className="text-success" />
                </div>
              )}
              {errors.nombreReferencia && (
                <div
                  className="invalid-feedback"
                  style={{ fontSize: "0.7rem", display: "block" }}
                >
                  {errors.nombreReferencia.message}
                </div>
              )}
            </div>
          </div>

          {/* ========================================== */}
          {/* 3. PAGOS Y VUELTO */}
          {/* ========================================== */}
          <div className="mb-2">
            <label
              htmlFor="pagoCon"
              className="small text-muted mb-1"
              style={{ fontSize: "0.75rem" }}
            >
              Pagar con: S/.
            </label>
            <input
              id="pagoCon"
              type="number"
              step="0.1"
              className="form-control form-control-sm"
              placeholder="0.00"
              {...register("pagoCon")}
              style={{ fontSize: "1.1rem", fontWeight: "600" }}
            />

            <div className="d-flex gap-1 mt-1 flex-wrap">
              {billetes.map((monto, index) => (
                <button
                  key={index}
                  type="button"
                  className="badge rounded-pill bg-light text-dark border p-1 px-2 fw-medium"
                  style={{
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#e5e7eb")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#f8fafc")
                  }
                  onClick={() => setValue("pagoCon", monto)}
                >
                  {index === 0 ? "EXACTO" : `S/ ${monto.toFixed(2)}`}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-2">
            <label
              htmlFor="vuelto"
              className="small text-muted mb-1"
              style={{ fontSize: "0.75rem" }}
            >
              Cambio S/.
            </label>
            <input
              id="vuelto"
              type="text"
              className="form-control form-control-sm bg-light text-success border-success border-opacity-50"
              readOnly
              value={vuelto}
              style={{ fontSize: "1.1rem", fontWeight: "700" }}
            />
          </div>

          {/* ========================================== */}
          {/* 4. IMPRESIÓN Y NOTAS */}
          {/* ========================================== */}
          <div className="bg-light p-2 rounded mb-2 border">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="d-flex align-items-center gap-2">
                <Printer size={16} className="text-muted" />
                <span
                  className="fw-medium text-dark"
                  style={{ fontSize: "0.8rem" }}
                >
                  Imprimir
                </span>
              </div>
              <div className="form-switch m-0 p-0">
                <input
                  className="form-check-input m-0"
                  type="checkbox"
                  role="switch"
                  id="imprimirTicket"
                  {...register("imprimirTicket")}
                />
              </div>
            </div>

            <div className="d-flex gap-2">
              <StickyNote size={16} className="text-muted mt-1 flex-shrink-0" />
              <textarea
                className="form-control form-control-sm border-0 bg-white"
                rows="1"
                placeholder="Observaciones..."
                style={{ fontSize: "0.8rem", resize: "none" }}
                {...register("notas")}
              ></textarea>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* TOTALES Y BOTÓN (Fijos al fondo) */}
        {/* ========================================== */}
        <div className="mt-auto bg-white border-top p-3">
          <div className="p-2">
            <div className="d-flex justify-content-between mb-1">
              <span className="text-muted small">Sub Total</span>
              <span className="fw-medium text-dark small">S/. {subTotal}</span>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span className="text-muted small">IGV</span>
              <span className="text-secondary small">S/. {igv}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-1">
              <span className="h5 mb-0 fw-bold">Total</span>
              <span className="h4 fw-bold text-success mb-0">
                S/. {totalPreventa}
              </span>
            </div>
          </div>

          <div className="p-2 pt-0">
            <BotonAnimado
              type="submit"
              loading={loading}
              error={error}
              className="btn-guardar w-100 py-3 fs-6"
              style={{ borderRadius: "10px" }}
            >
              Realizar Pago
            </BotonAnimado>
          </div>
        </div>
      </form>
    </div>
  );
}
