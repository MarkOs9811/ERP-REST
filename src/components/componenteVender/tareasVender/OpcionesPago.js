import {
  Banknote,
  BanknoteArrowDown,
  CreditCard,
  ReceiptText,
  User,
  WalletCards,
} from "lucide-react";
import React, { useEffect, useState } from "react"; // Asegúrate de importar lo necesario
import { useForm } from "react-hook-form";
import { EstadoIntegraciones } from "../../../hooks/EstadoIntegraciones";

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

  // 1. Configuramos el hook, pero NO dejamos que bloquee la renderización
  const {
    data: estadoSunat,
    isLoading,
    isError,
    // error, // Ya no necesitamos mostrar el error en pantalla completa
    refetch: refetchSunat,
  } = EstadoIntegraciones("sunat", { enabled: false });

  // 2. Eliminamos los IF que retornaban <p>Error...</p>.
  // Ahora calculamos si Sunat está disponible de forma segura.
  // Se considera activo SOLO si no está cargando, no hay error y el estado es 1.
  const sunatActivo = !isLoading && !isError && estadoSunat?.estado === 1;

  return (
    <div className="card shadow-sm flex-grow-1 h-100 d-flex flex-column h-100">
      <div className="card-header">
        <h5>Método de pago</h5>
      </div>
      <div
        className="card-body overflow-auto"
        style={{ height: "calc(100vh - 480px)" }}
      >
        {/* Métodos de pago */}
        <div className="mt-0">
          <div
            className="btn-group w-100"
            role="group"
            aria-label="Método de Pago"
          >
            <button
              type="button"
              className={`boton-opcion-pago p-3 w-33 ${
                metodoSeleccionado === "efectivo"
                  ? "btn-seleccionado"
                  : "btn-outline-dark"
              }`}
              onClick={() => {
                handleSelectMetodo("efectivo");
                handleSelectCardType(false);
                // El refetch se intenta, pero si falla, no rompe la UI gracias a la lógica nueva
                refetchSunat();
              }}
            >
              <Banknote className="text-auto" /> Efectivo
            </button>
            <button
              type="button"
              className={`boton-opcion-pago p-3 w-33 ${
                metodoSeleccionado === "tarjeta"
                  ? "btn-seleccionado"
                  : "btn-outline-dark"
              }`}
              onClick={() => {
                handleSelectMetodo("tarjeta");
                handleSelectCardType(true);
              }}
            >
              <CreditCard className="text-auto" /> Tarjeta
            </button>
            <button
              type="button"
              className={`boton-opcion-pago p-3 w-33 ${
                metodoSeleccionado === "yape"
                  ? "btn-seleccionado"
                  : "btn-outline-dark"
              }`}
              onClick={() => {
                handleSelectMetodo("yape");
                handleSelectCardType(false);
                refetchSunat();
              }}
            >
              <img
                src="/images/yape-logo.png"
                alt="Yape"
                className="img-fluid rounded-pill"
                style={{ maxHeight: "30px", marginRight: "8px" }}
              />
              Yape
            </button>
            <button
              type="button"
              className={`boton-opcion-pago p-3 w-33 ${
                metodoSeleccionado === "plin"
                  ? "btn-seleccionado"
                  : "btn-outline-dark"
              }`}
              onClick={() => {
                handleSelectMetodo("plin");
                handleSelectCardType(false);
                refetchSunat();
              }}
            >
              <img
                src="/images/plin-log.png"
                alt="Plin"
                className="img-fluid rounded-pill"
                style={{ maxHeight: "30px", marginRight: "8px" }}
              />
              Plin
            </button>
          </div>
        </div>

        {/* Tarjeta debito o credito */}
        <div className={`mt-4 ${tarjetas ? "d-block" : "d-none"}`}>
          <h6>Tarjeta</h6>
          <div
            className="btn-group w-100"
            role="group"
            aria-label="Método de Pago"
          >
            <button
              type="button"
              className={`boton-opcion-pago p-3 w-33 ${
                typeTarjeta === "debito"
                  ? "btn-seleccionado"
                  : "btn-outline-dark"
              }`}
              onClick={() => {
                handleTypeTarjeta("debito");
              }}
            >
              <CreditCard color={"auto"} /> Tarjeta Debito
            </button>
            <button
              type="button"
              className={`boton-opcion-pago p-3 w-33 ${
                typeTarjeta === "credito"
                  ? "btn-seleccionado"
                  : "btn-outline-dark"
              }`}
              onClick={() => {
                handleTypeTarjeta("credito");
              }}
            >
              <BanknoteArrowDown color={"auto"} /> Tarjeta Credito
            </button>
          </div>
        </div>

        {/* Opciones de Boleta/Factura */}
        <div className={`mt-4 ${tipoComporbante ? "d-block" : "d-none"}`}>
          <h6>Tipo de documento</h6>

          <div
            className="btn-group w-100 d-flex align-content-center"
            role="group"
            aria-label="Tipo de Documento"
          >
            {sunatActivo ? (
              <button
                type="button"
                className={`boton-opcion-pago p-3 w-50 ${
                  comprobante === "B" ? "btn-seleccionado" : "btn-outline-dark"
                }`}
                onClick={() => {
                  handleShowFactura(false);
                  handleShowDatosClientes(false);
                  handleSlectComprobante("B");
                }}
              >
                <ReceiptText color="auto" /> Boleta
              </button>
            ) : (
              // Si falla sunat, carga o no existe, mostramos el aviso pero el componente sigue vivo
              <div className="d-flex align-items-center justify-content-center w-50 p-1 border rounded bg-light text-muted">
                <small
                  className="text-center"
                  style={{ fontSize: "0.75rem", lineHeight: "1.2" }}
                >
                  Boleta no disponible <br /> (Venta interna)
                </small>
              </div>
            )}
            {/* Boleta Simple siempre visible (Backup) */}
            <button
              type="button"
              className={`boton-opcion-pago p-3 w-50 ${
                comprobante === "S" ? "btn-seleccionado" : "btn-outline-dark"
              }`}
              onClick={() => {
                handleShowFactura(false);
                handleShowDatosClientes(false);
                handleSlectComprobante("S");
              }}
            >
              <ReceiptText color="auto" /> Boleta Simple
            </button>

            {/* Factura visible SOLO si Sunat respondió correctamente y está activo */}
            {sunatActivo ? (
              <button
                type="button"
                className={`boton-opcion-pago p-3 w-50 ${
                  comprobante === "F" ? "btn-seleccionado" : "btn-outline-dark"
                }`}
                onClick={() => {
                  handleShowFactura(true);
                  handleShowDatosClientes(true);
                  handleSlectComprobante("F");
                }}
              >
                <ReceiptText color="auto" /> Factura
              </button>
            ) : (
              // Si falla sunat, carga o no existe, mostramos el aviso pero el componente sigue vivo
              <div className="d-flex align-items-center justify-content-center w-50 p-1 border rounded bg-light text-muted">
                <small
                  className="text-center"
                  style={{ fontSize: "0.75rem", lineHeight: "1.2" }}
                >
                  Facturación no disponible <br /> (Venta interna)
                </small>
              </div>
            )}
          </div>
        </div>

        {/* RESTO DEL CODIGO (Inputs de cliente, RUC, etc) SE MANTIENE IGUAL */}
        {/* INFORMACION DEL CLIENTE BOLETAS */}
        <div className={`mt-4 ${clienteBoleta ? "d-block" : "d-none"}`}>
          {/* ... Inputs de Boleta ... */}
          {/* (Mantén tu código original aquí abajo sin cambios) */}
          <div className="mb-3">
            <div className="form-floating">
              <select
                id="tipo_documento"
                className="form-select"
                {...register("tipo_documento", {
                  required: "Seleeciona un tipo de documento",
                })}
                onChange={handleSelectChange(
                  setTipoDocumento,
                  setValue,
                  "tipo_documento",
                  [{ name: "numero_documento", setter: setNumeroDocumento }],
                )}
                style={{ border: "1px solid black" }}
              >
                <option value="DNI">DNI</option>
                <option value="extranjeria">Carnet de Extranjería</option>
              </select>
              <label htmlFor="tipo_documento">
                <WalletCards color={"auto"} />
                Tipo de Documento
              </label>
              {errors.tipo_documento && (
                <div className="invalid-feedback">
                  {errors.tipo_documento.message}
                </div>
              )}
            </div>
          </div>
          {/* ... Resto de tus inputs ... */}
          {/* Por brevedad, asumo que el resto de inputs de DNI/RUC siguen aquí tal cual */}
          {/* Número de documento */}
          <div className="mb-3">
            <div className="form-floating">
              <input
                type="text"
                placeholder=" "
                className={`form-control ${
                  errors.numeroDocumento ? "is-invalid" : ""
                }`}
                id="numero_documento"
                value={numeroDocumento}
                {...register("numero_documento", {
                  required: "Este campo es obligatorio",
                  minLength: {
                    value: tipoDocumento === "DNI" ? 8 : 10,
                    message: `Debe tener ${
                      tipoDocumento === "DNI" ? "8" : "10"
                    } caracteres`,
                  },
                  maxLength: {
                    value: tipoDocumento === "DNI" ? 8 : 10,
                    message: `Debe tener ${
                      tipoDocumento === "DNI" ? "8" : "10"
                    } caracteres`,
                  },
                })}
                onChange={handleInputChange(
                  setNumeroDocumento,
                  setValue,
                  "numero_documento",
                  /^\d*$/,
                  tipoDocumento === "DNI" ? 8 : 10,
                )}
                style={{ border: "1px solid black" }}
              />
              <label htmlFor="numero_documento">Número de Documento</label>
              {errors.numeroDocumento && (
                <div className="invalided-feedback">
                  {errors.numeroDocumento.message}
                </div>
              )}
            </div>
          </div>

          {/* Nombres y Apellidos */}
          <div className="row">
            <div className="col-md-6">
              <div className="form-floating">
                <input
                  type="text"
                  placeholder=" "
                  className="form-control"
                  onChange={(e) => setNombres(e.target.value)}
                  style={{ border: "1px solid black" }}
                />
                <label htmlFor="nombres">
                  <User color={"auto"} />
                  Nombres
                </label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating">
                <input
                  type="text"
                  placeholder=" "
                  className="form-control"
                  id="apellidos"
                  onChange={(e) => setApellidos(e.target.value)}
                  style={{ border: "1px solid black" }}
                />
                <label htmlFor="apellidos">
                  <User color={"auto"} />
                  Apellidos
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* INFORMACION PARA CLIENTE FACTURA */}
        <div className={`mt-4 ${clienteFactura ? "d-block" : "d-none"}`}>
          {/* ... Tus inputs de factura ... */}
          <div className="mb-3">
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="num_documento_ruc"
                placeholder="Ingrese Ruc"
                onChange={(e) => setRuc(e.target.value)}
                style={{ border: "1px solid black" }}
              />
              <label>
                <i className="fas fa-id-card"></i> RUC
              </label>
            </div>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="nombreRazonSocial"
              onChange={(e) => setRazonSocial(e.target.value)}
              placeholder="Razón social"
              style={{ border: "1px solid black" }}
            />
            <label>
              <i className="fas fa-user"></i> Razón social
            </label>
          </div>

          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="direccion"
              onChange={(e) => setDireccion(e.target.value)}
              placeholder=" "
              style={{ border: "1px solid black" }}
            />
            <label>
              <i className="fa-solid fa-location-dot"></i> Dirección
            </label>
          </div>
        </div>

        {/* CREDITO */}
        <div className={`mt-4 ${cuotas ? "d-block" : "d-none"}`}>
          {/* ... Tus inputs de cuotas ... */}
          <h6>Ingrese el numero de cuotas</h6>
          <div className="form-floating w-100">
            <input
              id="cuotas"
              type="number"
              className="form-control "
              onChange={(e) => setNumeroCuotas(e.target.value)}
              style={{ border: "1px solid black" }}
              placeholder=" "
            />
            <label htmlFor="cuotas">Nº de Cuotas</label>
          </div>
        </div>
      </div>
    </div>
  );
}
