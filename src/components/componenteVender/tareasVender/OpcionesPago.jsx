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
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
      // LÓGICA DE SEPARACIÓN (Asumiendo formato: PATERNO MATERNO NOMBRES)
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
          className="mr-1 size-6 rounded-full object-contain"
        />
      );
    }
    if (nombreLower === "plin") {
      return (
        <img
          src="/images/plin-log.png"
          alt="Plin"
          className="mr-1 size-6 rounded-full object-contain"
        />
      );
    }
    if (nombreLower === "efectivo")
      return <Banknote className="size-4" aria-hidden="true" />;
    if (nombreLower === "tarjeta" || nombreLower === "tarjeta credito")
      return <CreditCard className="size-4" aria-hidden="true" />;
    return <WalletCards className="size-4" aria-hidden="true" />;
  };

  return (
    <Card className="flex h-full min-h-110 flex-col gap-0 overflow-hidden rounded-xl border-border/70 bg-card p-0 shadow-none">
      <CardHeader className="border-b border-border/70  px-4 py-4">
        <h2 className="mb-0 text-base font-semibold tracking-tight text-foreground">
          Método de pago
        </h2>
        <p className="mb-0 text-xs text-muted-foreground">
          Selecciona cómo se realizará el cobro y el comprobante.
        </p>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
        {/* ================================================================ */}
        {/* MÉTODOS DE PAGO PRINCIPALES */}
        {/* ================================================================ */}
        <section className="space-y-2.5">
          <div
            className="grid grid-cols-1 gap-2 sm:grid-cols-4"
            role="group"
            aria-label="Método de Pago"
          >
            {metodosActivos.map((metodo) => (
              <Button
                key={metodo.id}
                type="button"
                className={`h-11 justify-start gap-2 rounded-lg border px-3 transition-colors ${
                  metodoSeleccionado === metodo.nombre
                    ? "border-primary/40 bg-green-400 dark:bg-green-400 dark:text-black text-foreground ring-1 ring-primary/15"
                    : "border-border/70   hover:bg-muted hover:text-foreground"
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
                variant="outline"
              >
                {getIconoMetodo(metodo.nombre)}
                <span className="font-medium">
                  {metodo.nombre.charAt(0).toUpperCase() +
                    metodo.nombre.slice(1)}
                </span>
              </Button>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* TARJETAS (DÉBITO / CRÉDITO) */}
        {/* ================================================================ */}
        <section className={`space-y-2.5 ${tarjetas ? "block" : "hidden"}`}>
          <div>
            <h3 className="mb-0 text-sm font-medium text-foreground">
              Tipo de tarjeta
            </h3>
            <p className="mb-0 text-xs text-muted-foreground">
              Indica si es débito o crédito.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="group">
            <Button
              type="button"
              className={`h-11 justify-start gap-2 rounded-lg border px-3 ${
                typeTarjeta === "debito"
                  ? "border-primary/40 bg-primary/5 text-foreground ring-1 ring-primary/15"
                  : "border-border/70  text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              onClick={() => handleTypeTarjeta("debito")}
              variant="outline"
            >
              <CreditCard size={18} /> Tarjeta Débito
            </Button>
            <Button
              type="button"
              className={`h-11 justify-start gap-2 rounded-lg border px-3 ${
                typeTarjeta === "credito"
                  ? "border-primary/40 bg-primary/5 text-foreground ring-1 ring-primary/15"
                  : "border-border/70  text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              onClick={() => handleTypeTarjeta("credito")}
              variant="outline"
            >
              <BanknoteArrowDown size={18} /> Tarjeta Crédito
            </Button>
          </div>
        </section>

        {/* ================================================================ */}
        {/* TIPO DE COMPROBANTE */}
        {/* ================================================================ */}
        <section
          className={`space-y-2.5 ${tipoComporbante ? "block" : "hidden"}`}
        >
          <div>
            <h3 className="mb-0 text-sm font-medium text-foreground">
              Comprobante
            </h3>
            <p className="mb-0 text-xs text-muted-foreground">
              Selecciona el documento para esta venta.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3" role="group">
            {sunatActivo ? (
              <Button
                type="button"
                className={`h-11 justify-start gap-2 rounded-lg border px-3 ${
                  comprobante === "B"
                    ? "border-primary/40 bg-primary text-red ring-1 ring-primary/15"
                    : "border-border/70  text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => {
                  handleShowFactura(false);
                  handleShowDatosClientes(true); // Mostrar datos cliente para boleta si es necesario
                  handleSlectComprobante("B");
                }}
                variant="outline"
              >
                <ReceiptText size={18} /> Boleta
              </Button>
            ) : (
              <div className="flex items-center justify-center p-2 rounded bg-muted text-muted-foreground w-full">
                <small
                  className="text-center"
                  style={{ fontSize: "0.7rem", lineHeight: "1.2" }}
                >
                  Boleta inactiva <br /> (Venta interna)
                </small>
              </div>
            )}

            <Button
              type="button"
              className={`h-11 justify-start gap-2 rounded-lg border px-3 ${
                comprobante === "S"
                  ? "border-primary/40 bg-green-400 dark:bg-green-400 dark:text-black text-foreground ring-1 ring-primary/15"
                  : "border-border/70  text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              onClick={() => {
                handleShowFactura(false);
                handleShowDatosClientes(false);
                handleSlectComprobante("S");
              }}
              variant="outline"
            >
              <ReceiptText size={18} /> Boleta Simple
            </Button>

            {sunatActivo ? (
              <Button
                type="button"
                className={`h-11 justify-start gap-2 rounded-lg border px-3 ${
                  comprobante === "F"
                    ? "border-primary/40 bg-primary/5 text-foreground ring-1 ring-primary/15"
                    : "border-border/70  text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => {
                  handleShowFactura(true);
                  handleShowDatosClientes(true);
                  handleSlectComprobante("F");
                }}
                variant="outline"
              >
                <ReceiptText size={18} /> Factura
              </Button>
            ) : (
              <div className="flex items-center justify-center p-2 rounded bg-muted text-muted-foreground w-full">
                <small
                  className="text-center"
                  style={{ fontSize: "0.7rem", lineHeight: "1.2" }}
                >
                  Facturación inactiva <br /> (Venta interna)
                </small>
              </div>
            )}
          </div>
        </section>

        {/* ================================================================ */}
        {/* INFORMACIÓN DEL CLIENTE: BOLETA */}
        {/* ================================================================ */}
        <section
          className={`space-y-3 rounded-lg border border-border/70 bg-muted/20 p-3 ${clienteBoleta ? "block" : "hidden"}`}
        >
          <h3 className="mb-0 text-sm font-semibold text-foreground">
            Datos del Cliente (Boleta)
          </h3>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Tipo Doc.
              </label>
              <select
                id="tipo_documento"
                className="h-10 w-full appearance-auto rounded-md border border-input  px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Número de Documento
              </label>
              <div className="relative">
                <input
                  type="text"
                  className={`h-10 w-full rounded-md border border-input  px-3 pr-9 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${errors.numeroDocumento ? "border-destructive focus-visible:ring-destructive" : ""} ${dniExitoso ? "border-emerald-500" : ""}`}
                  placeholder="Ingrese número..."
                  value={numeroDocumento}
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
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  {isSearchingDni ? (
                    <Loader2 size={16} className="text-foreground" />
                  ) : dniExitoso ? (
                    <CheckCircle
                      size={16}
                      className="text-emerald-600 dark:text-emerald-400"
                    />
                  ) : (
                    <Search
                      size={16}
                      className="text-muted-foreground opacity-50"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Nombres
              </label>
              <input
                type="text"
                id="nombres"
                className="h-10 w-full rounded-md border border-input  px-3 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Nombres..."
                onChange={(e) => {
                  setNombres(e.target.value);
                  setDniExitoso(false);
                }}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Apellidos
              </label>
              <input
                type="text"
                id="apellidos"
                className="h-10 w-full rounded-md border border-input  px-3 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Apellidos..."
                onChange={(e) => {
                  setApellidos(e.target.value);
                  setDniExitoso(false);
                }}
              />
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* INFORMACIÓN DEL CLIENTE: FACTURA */}
        {/* ================================================================ */}
        <section
          className={`space-y-3 rounded-lg border border-border/70 bg-muted/20 p-3 ${clienteFactura ? "block" : "hidden"}`}
        >
          <h3 className="mb-0 text-sm font-semibold text-foreground">
            Datos de Facturación
          </h3>

          <div className="mb-2">
            <label className="text-xs font-medium text-muted-foreground">
              Número de RUC <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                className={`h-10 w-full rounded-md border border-input  px-3 pr-9 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${rucExitoso ? "border-emerald-500" : ""}`}
                id="num_documento_ruc"
                placeholder="Ingrese 11 dígitos..."
                maxLength={11}
                value={rucLocal}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setRuc(val);
                  setRucLocal(val);
                  setRucExitoso(false);
                }}
              />
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                {isSearchingRuc ? (
                  <Loader2 size={16} className="text-foreground" />
                ) : rucExitoso ? (
                  <CheckCircle
                    size={16}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                ) : (
                  <Building2
                    size={16}
                    className="text-muted-foreground opacity-50"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="mb-2">
            <label className="text-xs font-medium text-muted-foreground">
              Razón Social
            </label>
            <input
              type="text"
              className="h-10 w-full rounded-md border border-input  px-3 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              id="nombreRazonSocial"
              placeholder="Nombre de la empresa..."
              onChange={(e) => {
                setRazonSocial(e.target.value);
                setRucExitoso(false);
              }}
            />
          </div>

          <div className="mb-2">
            <label className="text-xs font-medium text-muted-foreground">
              Dirección Fiscal
            </label>
            <div className="relative">
              <input
                type="text"
                className="h-10 w-full rounded-md border border-input  py-1 pl-9 pr-3 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                id="direccion"
                placeholder="Dirección..."
                onChange={(e) => setDireccion(e.target.value)}
              />
              <MapPin
                size={14}
                className="text-muted-foreground absolute top-1/2 left-0 -translate-y-1/2 ms-2"
              />
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* CUOTAS (CRÉDITO) */}
        {/* ================================================================ */}
        <div
          className={`space-y-2 rounded-lg border border-border/70 bg-muted/30 p-3 ${cuotas ? "block" : "hidden"}`}
        >
          {/* 🔥 Eliminamos el texto azul (text-primary -> text-dark) */}
          <h3 className="mb-0 text-sm font-semibold text-foreground">
            Pago a crédito
          </h3>
          <label className="text-xs font-medium text-muted-foreground">
            Número de Cuotas
          </label>
          <input
            id="cuotas"
            type="number"
            min="1"
            className="h-10 w-full rounded-md border border-input  px-3 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            onChange={(e) => setNumeroCuotas(e.target.value)}
            placeholder="Ej. 3"
          />
        </div>
      </CardContent>
    </Card>
  );
}
