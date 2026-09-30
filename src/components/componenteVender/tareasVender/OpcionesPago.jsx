import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  Banknote,
  BanknoteArrowDown,
  CreditCard,
  ReceiptText,
  User,
  WalletCards,
  Search,
  Loader2,
  CheckCircle,
  MapPin,
  Building2,
} from "lucide-react";

// Ajusta las rutas según tu proyecto
import { EstadoIntegraciones } from "../../../hooks/EstadoIntegraciones";
import { GetMetodosPago } from "../../../service/accionesVentas/GetMetodosPago";
import { ConsultarDocumento } from "../../../service/accionesVender/ConsultaDocumentos";
import ToastAlert from "../../componenteToast/ToastAlert";

export function OpcionesPago(props) {
  const {
    handleSelectMetodo,
    handleSelectCardType,
    handleTypeTarjeta,
    handleSlectComprobante,
    handleShowDatosClientes,
    handleShowFactura,
    handleSelectChange,
    handleInputChange,
    metodoSeleccionado,
    clienteFactura,
    clienteBoleta,
    tarjetas,
    typeTarjeta,
    comprobante,
    tipoComporbante,
    setNombres,
    setApellidos,
    setRuc,
    setRazonSocial,
    setDireccion,
    cuotas,
    setNumeroCuotas,
    setNumeroDocumento,
    setTipoDocumento,
    tipoDocumento,
    numeroDocumento,
  } = props;

  const {
    register,
    setValue,
    formState: { errors },
  } = useForm();

  // Integraciones y Data
  const {
    data: estadoSunat,
    isLoading,
    isError,
    refetch: refetchSunat,
  } = EstadoIntegraciones("sunat", { enabled: false });

  const { data: metodosData } = useQuery({
    queryKey: ["metodosPagos"],
    queryFn: GetMetodosPago,
  });

  const sunatActivo = !isLoading && !isError && estadoSunat?.estado === 1;
  const metodosActivos =
    metodosData?.filter((metodo) => metodo.estado === 1) || [];

  // 🔥 ESTADOS PARA BÚSQUEDA AUTOMÁTICA
  const [isSearchingDni, setIsSearchingDni] = useState(false);
  const [dniExitoso, setDniExitoso] = useState(false);

  const [isSearchingRuc, setIsSearchingRuc] = useState(false);
  const [rucExitoso, setRucExitoso] = useState(false);
  const [rucLocal, setRucLocal] = useState("");

  // ========================================================
  // LÓGICA DE BÚSQUEDA AUTOMÁTICA: BOLETA (DNI)
  // ========================================================
  useEffect(() => {
    if (tipoDocumento === "DNI" && numeroDocumento?.length === 8) {
      ejecutarBusquedaDni(numeroDocumento);
    } else {
      setDniExitoso(false);
    }
  }, [numeroDocumento, tipoDocumento]);

  const ejecutarBusquedaDni = async (doc) => {
    setIsSearchingDni(true);
    setDniExitoso(false);

    const resultado = await ConsultarDocumento(doc, "DNI");
    if (resultado.success) {
      // 🔥 LÓGICA DE SEPARACIÓN (Asumiendo formato: PATERNO MATERNO NOMBRES)
      const partes = resultado.nombre.trim().split(" ");
      let apellidosCalculados = "";
      let nombresCalculados = resultado.nombre;

      if (partes.length >= 3) {
        apellidosCalculados = `${partes[0]} ${partes[1]}`; // Toma las dos primeras palabras como apellidos
        nombresCalculados = partes.slice(2).join(" "); // El resto como nombres
      } else if (partes.length === 2) {
        apellidosCalculados = partes[0];
        nombresCalculados = partes[1];
      }

      setNombres(nombresCalculados);
      setApellidos(apellidosCalculados);

      // Actualizamos los inputs visualmente
      const inputNombres = document.getElementById("nombres");
      const inputApellidos = document.getElementById("apellidos");
      if (inputNombres) inputNombres.value = nombresCalculados;
      if (inputApellidos) inputApellidos.value = apellidosCalculados;

      setDniExitoso(true);
      ToastAlert("success", "Cliente encontrado");
    } else {
      ToastAlert("warning", "DNI no encontrado. Ingrese manualmente.");
    }
    setIsSearchingDni(false);
  };

  // ========================================================
  // LÓGICA DE BÚSQUEDA AUTOMÁTICA: FACTURA (RUC)
  // ========================================================
  useEffect(() => {
    if (rucLocal?.length === 11) {
      ejecutarBusquedaRuc(rucLocal);
    } else {
      setRucExitoso(false);
    }
  }, [rucLocal]);

  const ejecutarBusquedaRuc = async (doc) => {
    setIsSearchingRuc(true);
    setRucExitoso(false);

    const resultado = await ConsultarDocumento(doc, "RUC");
    if (resultado.success) {
      setRazonSocial(resultado.nombre);

      const inputRazon = document.getElementById("nombreRazonSocial");
      if (inputRazon) inputRazon.value = resultado.nombre;

      setRucExitoso(true);
      ToastAlert("success", "Empresa encontrada");
    } else {
      ToastAlert("warning", "RUC no encontrado. Ingrese manualmente.");
    }
    setIsSearchingRuc(false);
  };

  // Renderizado de iconos de pago
  const getIconoMetodo = (nombre) => {
    const nombreLower = nombre?.toLowerCase().trim();
    if (nombreLower === "yape") {
      return (
        <img
          src="/images/yape-logo.png"
          alt="Yape"
          className="img-fluid rounded-pill"
          style={{ maxHeight: "24px", marginRight: "8px" }}
        />
      );
    }
    if (nombreLower === "plin") {
      return (
        <img
          src="/images/plin-log.png"
          alt="Plin"
          className="img-fluid rounded-pill"
          style={{ maxHeight: "24px", marginRight: "8px" }}
        />
      );
    }
    if (nombreLower === "efectivo") return <Banknote size={18} />;
    if (nombreLower === "tarjeta" || nombreLower === "tarjeta credito")
      return <CreditCard size={18} />;
    return <WalletCards size={18} />;
  };

  return (
    <div className="card border flex-grow-1 h-100 d-flex flex-column overflow-auto">
      <div className="card-header bg-white py-3 border-bottom">
        <h5 className="mb-0 fw-bold">Método de pago</h5>
      </div>
      <div
        className="card-body overflow-auto p-3"
        style={{ height: "calc(100vh - 250px)" }}
      >
        {/* ================================================================ */}
        {/* MÉTODOS DE PAGO PRINCIPALES */}
        {/* ================================================================ */}
        <div className="mb-4">
          <div
            className="contenedor-pagos-grid"
            role="group"
            aria-label="Método de Pago"
          >
            {metodosActivos.map((metodo) => (
              <button
                key={metodo.id}
                type="button"
                className={`boton-opcion-pago p-2 ${
                  metodoSeleccionado === metodo.nombre
                    ? "btn-seleccionado"
                    : "btn-outline-dark"
                }`}
                onClick={() => {
                  handleSelectMetodo(metodo.nombre);
                  const nombreLower = metodo.nombre?.toLowerCase().trim();
                  if (
                    nombreLower === "tarjeta" ||
                    nombreLower === "tarjeta credito"
                  ) {
                    handleSelectCardType(true);
                  } else {
                    handleSelectCardType(false);
                    refetchSunat();
                  }
                }}
              >
                {getIconoMetodo(metodo.nombre)}
                <span className="fw-medium">
                  {metodo.nombre.charAt(0).toUpperCase() +
                    metodo.nombre.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ================================================================ */}
        {/* TARJETAS (DÉBITO / CRÉDITO) */}
        {/* ================================================================ */}
        <div className={`mb-4 ${tarjetas ? "d-block" : "d-none"}`}>
          <label className="small text-muted fw-bold mb-2">
            Tipo de Tarjeta
          </label>
          <div className="contenedor-pagos-grid" role="group">
            <button
              type="button"
              className={`boton-opcion-pago p-2 ${
                typeTarjeta === "debito"
                  ? "btn-seleccionado"
                  : "btn-outline-dark"
              }`}
              onClick={() => handleTypeTarjeta("debito")}
            >
              <CreditCard size={18} /> Tarjeta Débito
            </button>
            <button
              type="button"
              className={`boton-opcion-pago p-2 ${
                typeTarjeta === "credito"
                  ? "btn-seleccionado"
                  : "btn-outline-dark"
              }`}
              onClick={() => handleTypeTarjeta("credito")}
            >
              <BanknoteArrowDown size={18} /> Tarjeta Crédito
            </button>
          </div>
        </div>

        {/* ================================================================ */}
        {/* TIPO DE COMPROBANTE */}
        {/* ================================================================ */}
        <div className={`mb-4 ${tipoComporbante ? "d-block" : "d-none"}`}>
          <label className="small text-muted fw-bold mb-2">
            Tipo de Comprobante
          </label>
          <div className="contenedor-pagos-grid" role="group">
            {sunatActivo ? (
              <button
                type="button"
                className={`boton-opcion-pago p-2 ${
                  comprobante === "B" ? "btn-seleccionado" : "btn-outline-dark"
                }`}
                onClick={() => {
                  handleShowFactura(false);
                  handleShowDatosClientes(true); // Mostrar datos cliente para boleta si es necesario
                  handleSlectComprobante("B");
                }}
              >
                <ReceiptText size={18} /> Boleta
              </button>
            ) : (
              <div className="d-flex align-items-center justify-content-center p-2 border rounded bg-light text-muted w-100">
                <small
                  className="text-center"
                  style={{ fontSize: "0.7rem", lineHeight: "1.2" }}
                >
                  Boleta inactiva <br /> (Venta interna)
                </small>
              </div>
            )}

            <button
              type="button"
              className={`boton-opcion-pago p-2 ${
                comprobante === "S" ? "btn-seleccionado" : "btn-outline-dark"
              }`}
              onClick={() => {
                handleShowFactura(false);
                handleShowDatosClientes(false);
                handleSlectComprobante("S");
              }}
            >
              <ReceiptText size={18} /> Boleta Simple
            </button>

            {sunatActivo ? (
              <button
                type="button"
                className={`boton-opcion-pago p-2 ${
                  comprobante === "F" ? "btn-seleccionado" : "btn-outline-dark"
                }`}
                onClick={() => {
                  handleShowFactura(true);
                  handleShowDatosClientes(true);
                  handleSlectComprobante("F");
                }}
              >
                <ReceiptText size={18} /> Factura
              </button>
            ) : (
              <div className="d-flex align-items-center justify-content-center p-2 border rounded bg-light text-muted w-100">
                <small
                  className="text-center"
                  style={{ fontSize: "0.7rem", lineHeight: "1.2" }}
                >
                  Facturación inactiva <br /> (Venta interna)
                </small>
              </div>
            )}
          </div>
        </div>

        {/* ================================================================ */}
        {/* INFORMACIÓN DEL CLIENTE: BOLETA */}
        {/* ================================================================ */}
        <div className={`mt-2 ${clienteBoleta ? "d-block" : "d-none"}`}>
          <h6 className="fw-bold mb-3 text-dark">Datos del Cliente (Boleta)</h6>

          <div className="row g-2 mb-2">
            <div className="col-md-4">
              <label
                className="small text-muted mb-1"
                style={{ fontSize: "0.75rem" }}
              >
                Tipo Doc.
              </label>
              <select
                id="tipo_documento"
                className="form-select form-select-sm"
                {...register("tipo_documento")}
                onChange={handleSelectChange(
                  setTipoDocumento,
                  setValue,
                  "tipo_documento",
                  [{ name: "numero_documento", setter: setNumeroDocumento }],
                )}
              >
                <option value="DNI">DNI</option>
                <option value="extranjeria">Carnet Ext.</option>
              </select>
            </div>

            <div className="col-md-8">
              <label
                className="small text-muted mb-1"
                style={{ fontSize: "0.75rem" }}
              >
                Número de Documento
              </label>
              <div className="position-relative">
                <input
                  type="text"
                  className={`form-control form-control-sm ${errors.numeroDocumento ? "is-invalid" : ""}`}
                  placeholder="Ingrese número..."
                  value={numeroDocumento}
                  style={{
                    paddingRight: "30px",
                    // 🔥 Aquí forzamos la línea verde y anulamos el resplandor azul de focus
                    borderColor: dniExitoso ? "#198754" : undefined,
                    boxShadow: dniExitoso ? "none" : undefined,
                    outline: "none",
                  }}
                  {...register("numero_documento")}
                  onChange={(e) => {
                    setDniExitoso(false);
                    handleInputChange(
                      setNumeroDocumento,
                      setValue,
                      "numero_documento",
                      /^\d*$/,
                      tipoDocumento === "DNI" ? 8 : 12,
                    )(e);
                  }}
                />
                <div
                  className="position-absolute top-50 end-0 translate-middle-y pe-2"
                  style={{ pointerEvents: "none" }}
                >
                  {isSearchingDni ? (
                    <Loader2
                      size={16}
                      className="text-dark"
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                  ) : dniExitoso ? (
                    <CheckCircle size={16} className="text-success" />
                  ) : (
                    <Search size={16} className="text-muted opacity-50" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row g-2">
            <div className="col-md-6">
              <label
                className="small text-muted mb-1"
                style={{ fontSize: "0.75rem" }}
              >
                Nombres
              </label>
              <input
                type="text"
                id="nombres"
                className="form-control form-control-sm"
                placeholder="Nombres..."
                onChange={(e) => {
                  setNombres(e.target.value);
                  setDniExitoso(false);
                }}
              />
            </div>
            <div className="col-md-6">
              <label
                className="small text-muted mb-1"
                style={{ fontSize: "0.75rem" }}
              >
                Apellidos
              </label>
              <input
                type="text"
                id="apellidos"
                className="form-control form-control-sm"
                placeholder="Apellidos..."
                onChange={(e) => {
                  setApellidos(e.target.value);
                  setDniExitoso(false);
                }}
              />
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* INFORMACIÓN DEL CLIENTE: FACTURA */}
        {/* ================================================================ */}
        <div className={`mt-2 ${clienteFactura ? "d-block" : "d-none"}`}>
          <h6 className="fw-bold mb-3 text-dark">Datos de Facturación</h6>

          <div className="mb-2">
            <label
              className="small text-muted mb-1"
              style={{ fontSize: "0.75rem" }}
            >
              Número de RUC <span className="text-danger">*</span>
            </label>
            <div className="position-relative">
              <input
                type="text"
                className="form-control form-control-sm"
                id="num_documento_ruc"
                placeholder="Ingrese 11 dígitos..."
                maxLength={11}
                value={rucLocal}
                style={{
                  paddingRight: "30px",
                  borderColor: rucExitoso ? "#198754" : undefined,
                  boxShadow: rucExitoso ? "none" : undefined,
                  outline: "none",
                }}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setRuc(val);
                  setRucLocal(val);
                  setRucExitoso(false);
                }}
              />
              <div
                className="position-absolute top-50 end-0 translate-middle-y pe-2"
                style={{ pointerEvents: "none" }}
              >
                {isSearchingRuc ? (
                  <Loader2
                    size={16}
                    className="text-dark"
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                ) : rucExitoso ? (
                  <CheckCircle size={16} className="text-success" />
                ) : (
                  <Building2 size={16} className="text-muted opacity-50" />
                )}
              </div>
            </div>
          </div>

          <div className="mb-2">
            <label
              className="small text-muted mb-1"
              style={{ fontSize: "0.75rem" }}
            >
              Razón Social
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              id="nombreRazonSocial"
              placeholder="Nombre de la empresa..."
              onChange={(e) => {
                setRazonSocial(e.target.value);
                setRucExitoso(false);
              }}
            />
          </div>

          <div className="mb-2">
            <label
              className="small text-muted mb-1"
              style={{ fontSize: "0.75rem" }}
            >
              Dirección Fiscal
            </label>
            <div className="position-relative">
              <input
                type="text"
                className="form-control form-control-sm"
                id="direccion"
                placeholder="Dirección..."
                style={{ paddingLeft: "30px" }}
                onChange={(e) => setDireccion(e.target.value)}
              />
              <MapPin
                size={14}
                className="text-muted position-absolute top-50 start-0 translate-middle-y ms-2"
              />
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* CUOTAS (CRÉDITO) */}
        {/* ================================================================ */}
        <div
          className={`mt-4 bg-light p-3 rounded border ${cuotas ? "d-block" : "d-none"}`}
        >
          {/* 🔥 Eliminamos el texto azul (text-primary -> text-dark) */}
          <h6 className="fw-bold mb-2 text-dark">Pago a Crédito</h6>
          <label
            className="small text-muted mb-1"
            style={{ fontSize: "0.75rem" }}
          >
            Número de Cuotas
          </label>
          <input
            id="cuotas"
            type="number"
            min="1"
            className="form-control form-control-sm"
            onChange={(e) => setNumeroCuotas(e.target.value)}
            placeholder="Ej. 3"
          />
        </div>
      </div>
    </div>
  );
}
