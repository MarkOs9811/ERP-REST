import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";
import { useQuery } from "@tanstack/react-query";
import { GetConfi } from "../../service/accionesConfiguracion/GetConfi";
import { Cargando } from "../componentesReutilizables/Cargando";

export function MiEmpresa() {
  const [logoActual, setLogoActual] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [datosEmpresa, setDatosEmpresa] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const {
    data: configEmpresa = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["confiEmpresa"],
    queryFn: GetConfi,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const configuracionEmpresa = configEmpresa.filter(
    (item) => item.tipo?.toLowerCase() === "empresa"
  );

  useEffect(() => {
    const fetchDatosEmpresa = async () => {
      try {
        const response = await axiosInstance.get("/configuracion/getMiEmpresa");
        console.log("BASE_URL:", BASE_URL);
        console.log("Dato crudo backend:", response.data.logo);
        if (response.data) {
          setDatosEmpresa(response.data);
          setLogoActual(`${BASE_URL}${response.data.logo}`);
          reset({
            nombre: response.data.nombre,
            ruc: response.data.ruc,
            correo: response.data.correo,
            numero: response.data.numero,
            direccion: response.data.direccion,
          });
        }
      } catch (error) {
        console.error("Error al cargar datos de la empresa:", error.message);
      }
    };

    fetchDatosEmpresa();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("nombre", data.nombre);
      formData.append("ruc", data.ruc);
      formData.append("correo", data.correo);
      formData.append("numero", data.numero);
      formData.append("direccion", data.direccion);

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const response = await axiosInstance.post(
        "/configuracion/updateMiempresa",
        formData
      );

      if (response.status === 200) {
        ToastAlert("success", "Datos actualizados correctamente");
      } else {
        ToastAlert("error", "Error al actualizar los datos");
      }
    } catch (error) {
      if (error.response) {
        ToastAlert(
          "error",
          `Error: ${error.response.data.message || "Algo salió mal."}`
        );
      } else {
        ToastAlert("error", `Error:${error}`);
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        setLogoPreview(objectUrl);
        setLogoFile(file);
      }
    },
  });

  return (
    <div className="w-100 p-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row g-3">
          {/* Columna Logo y carga */}
          <div className="col-md-4 col-sm-12">
            <div
              className="card border-0 p-4 d-flex flex-column justify-content-center align-items-center h-100 shadow-sm"
              style={{ borderRadius: 20 }}
            >
              <h4 className="mb-3 fw-bold text-center">
                Configuración de la Empresa
              </h4>
              {/* Logo actual */}
              {logoActual && (
                <img
                  src={logoActual}
                  alt="Logo de la empresa"
                  className="img-fluid mb-2"
                  style={{
                    maxWidth: "120px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px #0001",
                  }}
                />
              )}
              {/* Previsualización del logo */}
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Logo Previsualizado"
                  className="img-fluid mb-2"
                  style={{
                    maxWidth: "120px",
                    borderRadius: "10px",
                    border: "2px solid #5a7a98",
                    boxShadow: "0 2px 8px #0001",
                  }}
                />
              )}
              <div className="mb-3 w-100">
                <label
                  htmlFor="logo"
                  className="form-label text-secondary small fw-semibold"
                >
                  Logo de la Empresa
                </label>
                <div
                  {...getRootProps()}
                  className="dropzone border border-primary-subtle rounded p-4 text-center "
                  style={{ cursor: "pointer", minHeight: "100px" }}
                >
                  <input
                    {...getInputProps()}
                    id="logo"
                    name="logo"
                    className="d-none"
                  />
                  {!logoPreview && (
                    <p className="text-muted mb-2">
                      Haz clic o arrastra aquí para cargar el logo
                    </p>
                  )}
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Seleccionar archivo
                  </button>
                </div>
                <p className="text-danger small">{errors.logo?.message}</p>
              </div>
            </div>
          </div>
          {/* Columna datos */}
          <div className="col-md-8 col-sm-12">
            <div
              className="card border-0 p-4 bg-white shadow-sm"
              style={{ borderRadius: 20 }}
            >
              <h5 className="fw-bold mb-3 text-secondary">Datos Generales</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label
                    htmlFor="ruc"
                    className="form-label text-secondary small"
                  >
                    RUC
                  </label>
                  <input
                    type="text"
                    id="ruc"
                    className="form-control"
                    {...register("ruc", {
                      required: "El RUC es obligatorio",
                    })}
                    defaultValue={datosEmpresa?.ruc || ""}
                  />
                  <p className="text-danger small">{errors.ruc?.message}</p>
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="nombre"
                    className="form-label text-secondary small"
                  >
                    Nombre de la Empresa
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    className="form-control"
                    {...register("nombre", {
                      required: "El nombre es obligatorio",
                    })}
                    defaultValue={datosEmpresa?.nombre || ""}
                  />
                  <p className="text-danger small">{errors.nombre?.message}</p>
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="correo"
                    className="form-label text-secondary small"
                  >
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="correo"
                    className="form-control"
                    {...register("correo", {
                      required: "El correo es obligatorio",
                      pattern: {
                        value:
                          /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                        message: "Correo electrónico inválido",
                      },
                    })}
                    defaultValue={datosEmpresa?.correo || ""}
                  />
                  <p className="text-danger small">{errors.correo?.message}</p>
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="numero"
                    className="form-label text-secondary small"
                  >
                    Número de Teléfono
                  </label>
                  <input
                    type="tel"
                    id="numero"
                    className="form-control"
                    {...register("numero", {
                      required: "El número de teléfono es obligatorio",
                      pattern: {
                        value: /^[0-9]{9}$/,
                        message: "Número de teléfono inválido",
                      },
                    })}
                    defaultValue={datosEmpresa?.numero || ""}
                  />
                  <p className="text-danger small">{errors.numero?.message}</p>
                </div>
                <div className="col-12">
                  <label
                    htmlFor="direccion"
                    className="form-label text-secondary small"
                  >
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="direccion"
                    className="form-control"
                    {...register("direccion", {
                      required: "La dirección es obligatoria",
                    })}
                    defaultValue={datosEmpresa?.direccion || ""}
                  />
                  <p className="text-danger small">
                    {errors.direccion?.message}
                  </p>
                </div>
              </div>
              <div className="mt-4 d-flex ">
                <button type="submit" className="btn-guardar   ms-auto">
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-12 ">
            <div className="row d-flex gap-3  flex-wrap">
              {isLoading && (
                <p>
                  <Cargando />
                </p>
              )}

              {isError && <p>Hubo un error al obtener las configuraciones.</p>}

              {!isLoading && !isError && configuracionEmpresa.length === 0 && (
                <p>No hay configuraciones de tipo "empresa".</p>
              )}

              {!isLoading &&
                !isError &&
                configuracionEmpresa.map((item) => (
                  <div
                    key={item.id}
                    className="col-12 col-sm-6 col-md-4 col-lg-3   d-flex justify-content-center"
                  >
                    <div
                      className="card p-3 shadow-sm"
                      style={{ borderRadius: 20 }}
                    >
                      <div>
                        <h5>{item.nombre}</h5>
                        <p>{item.descripcion}</p>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline-dark btn-sm ms-auto float-right"
                      >
                        Configuracion
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
