import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";

export function SunatFormIntegracion({ data }) {
  const defaultValues = data
    ? {
        ruc: data?.clave || "",
        usuarioSol: data?.valor3 || "",
        claveSol: data?.valor4 || "",
        endpoint: data?.valor2 || "",
      }
    : {
        ruc: "",
        usuarioSol: "",
        claveSol: "",
        endpoint: "",
      };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues,
  });

  const [activo, setActivo] = useState(data?.estado === 1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setActivo(data?.estado === 1);
  }, [data]);

  const certificadoFile = watch("certificado");

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const payload = new FormData();
      payload.append("ruc", formData.ruc.trim());
      payload.append("usuarioSol", formData.usuarioSol.trim());
      payload.append("claveSol", formData.claveSol.trim());
      payload.append("endpoint", formData.endpoint.trim());
      if (formData.certificado instanceof File) {
        payload.append("certificado", formData.certificado);
      }

      const response = await axiosInstance.post(
        `/configuracionesSunat/${data.id}`,
        payload
      );

      if (response.data.success) {
        ToastAlert("success", "Se actualizó la configuración");
      } else {
        ToastAlert("error", "Ocurrió un error al actualizar la configuración");
      }
    } catch (error) {
      console.error("Error al guardar la configuración:", error);
      ToastAlert("error", "Error al guardar la configuración");
    } finally {
      setLoading(false);
    }
  };

  const isConfigured =
    data?.clave?.trim() !== "" &&
    data?.valor1?.trim() !== "" &&
    data?.valor2?.trim() !== "" &&
    data?.valor3?.trim() !== "" &&
    data?.valor4?.trim() !== "";

  return (
    <div
      className="card border-0  p-4 flex-grow-1"
      style={{ borderRadius: 18 }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {isConfigured ? (
          <div
            className="alert alert-success d-flex align-items-center"
            role="alert"
          >
            <CheckCircle size={24} className="me-2" />
            Todo correcto con la configuración para Sunat
          </div>
        ) : (
          <div
            className="alert alert-danger d-flex align-items-center"
            role="alert"
          >
            <XCircle size={24} className="me-2" />
            Hay algún dato faltante en la configuración
          </div>
        )}

        {/* RUC */}
        <div className="mb-3">
          <label
            htmlFor="ruc"
            className="form-label text-secondary small fw-semibold"
          >
            RUC
          </label>
          <input
            id="ruc"
            className="form-control form-control-sm"
            placeholder="Número de RUC"
            disabled={!activo}
            {...register("ruc", {
              required: "El RUC es obligatorio",
              minLength: { value: 11, message: "El RUC debe tener 11 dígitos" },
              maxLength: { value: 11, message: "El RUC debe tener 11 dígitos" },
            })}
          />
          <div className="text-danger small">{errors.ruc?.message}</div>
        </div>

        {/* Usuario SOL */}
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
          <div className="text-danger small">{errors.usuarioSol?.message}</div>
        </div>

        {/* Clave SOL */}
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

        {/* Certificado Digital */}
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
            {...register("certificado", {})}
            onChange={(e) => setValue("certificado", e.target.files[0])}
          />
          <div className="text-muted small">
            {certificadoFile && certificadoFile.name
              ? `Archivo seleccionado: ${certificadoFile.name}`
              : "Selecciona tu archivo .pem"}
          </div>
          <div className="text-danger small">{errors.certificado?.message}</div>
        </div>

        {/* Endpoint */}
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

        {/* Botón */}
        <div className="d-flex justify-content-end">
          <button
            type="submit"
            className="btn-guardar"
            disabled={!activo || loading}
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
