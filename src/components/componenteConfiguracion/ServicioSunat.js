import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { GetConfi } from "../../service/accionesConfiguracion/GetConfi";
import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";

export function ServicioSunat() {
  const {
    data: configuracion = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["configuracion"],
    queryFn: GetConfi,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const sunatConfig = configuracion.find(
    (item) => item.nombre?.toLowerCase() === "sunat"
  );

  const [activo, setActivo] = useState(sunatConfig?.estado === 1);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const certificadoFile = watch("certificado");

  useEffect(() => {
    setActivo(sunatConfig?.estado === 1);
  }, [sunatConfig]);

  const onSubmit = (data) => {
    alert("Cambios guardados:\n" + JSON.stringify(data, null, 2));
  };

  if (isLoading) {
    return (
      <div className="w-100 p-3 text-center">
        <span className="text-secondary">Cargando configuración...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-100 p-3 text-center">
        <span className="text-danger">
          Error: No se pudo cargar la configuración de SUNAT.
        </span>
      </div>
    );
  }

  return (
    <div className="container-fluid w-100 p-3 d-flex gap-4 align-items-stretch flex-wrap">
      {/* Card de información SUNAT */}
      <div
        className="card p-4 shadow-sm flex-grow-1"
        style={{ borderRadius: 18 }}
      >
        <div className="d-flex align-items-center mb-3">
          <FileText
            color={"#ee5252"}
            height="30px"
            width="30px"
            className="me-2"
          />
          <span
            className="fw-semibold"
            style={{ color: "#1d2530", fontSize: 18 }}
          >
            Configuración de Servicio SUNAT
          </span>
          <div className="form-switch ms-auto">
            <input
              className="form-check-input"
              type="checkbox"
              id="switch-sunat"
              checked={activo}
              onChange={() => setActivo((a) => !a)}
              style={{
                accentColor: "#ee5252",
                width: 40,
                height: 22,
                cursor: "pointer",
              }}
            />
          </div>
        </div>
        <p className="text-secondary small mb-3">
          {sunatConfig?.descripcion ||
            "Configuración del servicio de SUNAT para la emisión de comprobantes electrónicos."}
        </p>
        <div className="mb-2">
          <span className="badge bg-light text-dark me-2">RUC</span>
          <span className="small">{sunatConfig?.clave || "-"}</span>
        </div>
        <div className="mb-2">
          <span className="badge bg-light text-dark me-2">Archivo .pem</span>
          <span className="small">{sunatConfig?.valor1 || "-"}</span>
        </div>
        <div className="mb-2">
          <span className="badge bg-light text-dark me-2">Endpoint</span>
          <span className="small">{sunatConfig?.valor2 || "-"}</span>
        </div>
        <div className="mb-2">
          <span className="badge bg-light text-dark me-2">MODDATOS 1</span>
          <span className="small">{sunatConfig?.valor3 || "-"}</span>
        </div>
        <div className="mb-2">
          <span className="badge bg-light text-dark me-2">MODDATOS 2</span>
          <span className="small">{sunatConfig?.valor4 || "-"}</span>
        </div>
      </div>

      {/* Card de formulario SUNAT */}
      <div
        className="card border-0 shadow-sm p-4 flex-grow-1"
        style={{ borderRadius: 18 }}
      >
        <div className="d-flex align-items-center mb-3">
          <span
            className="fw-semibold"
            style={{ color: "#1d2530", fontSize: 18 }}
          >
            SUNAT (Greenter)
          </span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label
              htmlFor="usuarioSol"
              className="form-label text-secondary small fw-semibold"
            >
              Usuario SOL
            </label>
            <input
              id="usuarioSol"
              className="form-control form-control-sm"
              placeholder="Usuario SOL"
              disabled={!activo}
              {...register("usuarioSol", {
                required: "El usuario SOL es obligatorio",
              })}
            />
            <div className="text-danger small">
              {errors.usuarioSol?.message}
            </div>
          </div>
          <div className="mb-3">
            <label
              htmlFor="claveSol"
              className="form-label text-secondary small fw-semibold"
            >
              Clave SOL
            </label>
            <input
              id="claveSol"
              type="password"
              className="form-control form-control-sm"
              placeholder="Clave SOL"
              disabled={!activo}
              {...register("claveSol", {
                required: "La clave SOL es obligatoria",
              })}
            />
            <div className="text-danger small">{errors.claveSol?.message}</div>
          </div>
          <div className="mb-3">
            <label
              htmlFor="certificado"
              className="form-label text-secondary small fw-semibold"
            >
              Certificado Digital (.pem)
            </label>
            <input
              id="certificado"
              type="file"
              accept=".pem"
              className="form-control form-control-sm"
              disabled={!activo}
              {...register("certificado", {
                required: "El certificado es obligatorio",
              })}
              onChange={(e) => setValue("certificado", e.target.files[0])}
            />
            <div className="text-muted small">
              {certificadoFile && certificadoFile.name
                ? `Archivo seleccionado: ${certificadoFile.name}`
                : "Selecciona tu archivo .pem"}
            </div>
            <div className="text-danger small">
              {errors.certificado?.message}
            </div>
          </div>
          <div className="mb-3">
            <label
              htmlFor="endpoint"
              className="form-label text-secondary small fw-semibold"
            >
              Endpoint SUNAT
            </label>
            <input
              id="endpoint"
              className="form-control form-control-sm"
              placeholder="Endpoint SUNAT"
              disabled={!activo}
              {...register("endpoint", {
                required: "El endpoint es obligatorio",
              })}
            />
            <div className="text-danger small">{errors.endpoint?.message}</div>
          </div>
          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!activo}
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
