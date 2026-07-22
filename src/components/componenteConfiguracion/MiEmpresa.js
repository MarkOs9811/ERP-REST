import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";
import { useQuery } from "@tanstack/react-query";
import { GetConfi } from "../../service/accionesConfiguracion/GetConfi";
import { Cargando } from "../componentesReutilizables/Cargando";
import ModalRight from "../componentesReutilizables/ModalRight";
import FormConfiguracionEmpresa from "./confiIntegraciones/FormConfiguracionEmpresa";
import { UtensilsCrossed, Store, Settings2 } from "lucide-react";

export function MiEmpresa() {
  const [logoActual, setLogoActual] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [datosEmpresa, setDatosEmpresa] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  // PARA CONFIGURACION
  const [openModal, setOpenModal] = useState(false);
  const [tituloModal, setTituloModal] = useState("");
  const [data, setData] = useState([]);
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
    (item) => item.tipo?.toLowerCase() === "empresa",
  );

  useEffect(() => {
    const fetchDatosEmpresa = async () => {
      try {
        const response = await axiosInstance.get("/configuracion/getMiEmpresa");
        if (response.data) {
          setDatosEmpresa(response.data);
          setLogoActual(response.data.logo_url);
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
        formData,
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
          `Error: ${error.response.data.message || "Algo salió mal."}`,
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

  // HELPER: Determina la interfaz visual según el tipo de venta
  const getVisualsTipoVenta = (clave) => {
    const tipo = (clave || "").toLowerCase();

    if (tipo === "comida" || tipo === "restaurante") {
      return {
        label: "Gastronomía",
        color: "var(--fw-saffron)",
        bgSoft: "var(--bg-saffron-soft)",
        icon: (
          <UtensilsCrossed
            size={40}
            color="var(--fw-saffron)"
            strokeWidth={1.5}
          />
        ),
      };
    } else if (tipo === "retail") {
      return {
        label: "Retail / Tienda",
        color: "var(--fw-emerald)",
        bgSoft: "var(--bg-emerald-soft)",
        icon: <Store size={40} color="var(--fw-emerald)" strokeWidth={1.5} />,
      };
    }

    return {
      label: "Sin definir",
      color: "var(--brand-secondary)",
      bgSoft: "#f3f4f6",
      icon: (
        <Store size={40} color="var(--brand-secondary)" strokeWidth={1.5} />
      ),
    };
  };

  return (
    <div className="w-100 p-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row g-3 mb-4">
          {/* Columna Logo y carga */}
          <div className="col-md-4 col-sm-12">
            <div
              className="card p-4 d-flex flex-column justify-content-center align-items-center h-100"
              style={{ borderRadius: "var(--radius-lg)" }}
            >
              <h4
                className="mb-3 fw-bold text-center"
                style={{ color: "var(--text-main)" }}
              >
                Configuración de la Empresa
              </h4>
              {/* Logo actual */}
              {logoActual && !logoPreview && (
                <img
                  src={logoActual}
                  alt="Logo de la empresa"
                  className="img-fluid mb-3"
                  style={{
                    maxWidth: "120px",
                    borderRadius: "10px",
                    boxShadow: "var(--shadow-hover)",
                  }}
                />
              )}
              {/* Previsualización del logo */}
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Logo Previsualizado"
                  className="img-fluid mb-3"
                  style={{
                    maxWidth: "120px",
                    borderRadius: "10px",
                    border: "2px solid var(--fw-saffron)",
                    boxShadow: "var(--shadow-hover)",
                  }}
                />
              )}
              <div className="mb-3 w-100">
                <label
                  htmlFor="logo"
                  className="form-label small fw-semibold"
                  style={{ color: "var(--text-muted)" }}
                >
                  Logo de la Empresa
                </label>
                <div
                  {...getRootProps()}
                  className="dropzone rounded p-4 text-center d-flex flex-column justify-content-center align-items-center"
                  style={{
                    cursor: "pointer",
                    minHeight: "100px",
                    border: "1px dashed var(--fw-muetd)",
                    backgroundColor: "var(--bg-saffron-soft)",
                  }}
                >
                  <input
                    {...getInputProps()}
                    id="logo"
                    name="logo"
                    className="d-none"
                  />
                  {!logoPreview && (
                    <p
                      className="small mb-2"
                      style={{ color: "var(--brand-secondary)" }}
                    >
                      Haz clic o arrastra aquí para cargar el logo
                    </p>
                  )}
                  <button
                    type="button"
                    className="btn btn-sm fw-semibold"
                    style={{
                      backgroundColor: "var(--fw-white)",
                      color: "var(--fw-saffron)",
                      border: "1px solid var(--fw-saffron)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    Seleccionar archivo
                  </button>
                </div>
                <p className="text-danger small mt-1">{errors.logo?.message}</p>
              </div>
            </div>
          </div>

          {/* Columna datos */}
          <div className="col-md-8 col-sm-12">
            <div
              className="card p-4 h-100"
              style={{
                borderRadius: "var(--radius-lg)",
                backgroundColor: "var(--bg-card)",
              }}
            >
              <h5
                className="fw-bold mb-4"
                style={{ color: "var(--brand-secondary)" }}
              >
                Datos Generales
              </h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label
                    htmlFor="ruc"
                    className="form-label small fw-semibold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    RUC
                  </label>
                  <input
                    type="text"
                    id="ruc"
                    className="form-control"
                    {...register("ruc", { required: "El RUC es obligatorio" })}
                    defaultValue={datosEmpresa?.ruc || ""}
                  />
                  <p className="text-danger small m-0">{errors.ruc?.message}</p>
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="nombre"
                    className="form-label small fw-semibold"
                    style={{ color: "var(--text-muted)" }}
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
                  <p className="text-danger small m-0">
                    {errors.nombre?.message}
                  </p>
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="correo"
                    className="form-label small fw-semibold"
                    style={{ color: "var(--text-muted)" }}
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
                  <p className="text-danger small m-0">
                    {errors.correo?.message}
                  </p>
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="numero"
                    className="form-label small fw-semibold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Número de Teléfono
                  </label>
                  <input
                    type="tel"
                    id="numero"
                    className="form-control"
                    {...register("numero", {
                      required: "El número es obligatorio",
                      pattern: {
                        value: /^[0-9]{9}$/,
                        message: "Número de teléfono inválido",
                      },
                    })}
                    defaultValue={datosEmpresa?.numero || ""}
                  />
                  <p className="text-danger small m-0">
                    {errors.numero?.message}
                  </p>
                </div>
                <div className="col-12">
                  <label
                    htmlFor="direccion"
                    className="form-label small fw-semibold"
                    style={{ color: "var(--text-muted)" }}
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
                  <p className="text-danger small m-0">
                    {errors.direccion?.message}
                  </p>
                </div>
              </div>
              <div className="mt-auto pt-4 d-flex justify-content-end">
                <button type="submit" className="btn-guardar px-4">
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Sección Configuraciones Extras */}
      <div className="row g-3 align-items-stretch">
        {isLoading && (
          <div className="col-12 text-center py-4">
            <Cargando />
          </div>
        )}

        {isError && (
          <div className="col-12">
            <p className="text-danger">
              Hubo un error al obtener las configuraciones.
            </p>
          </div>
        )}

        {!isLoading && !isError && configuracionEmpresa.length === 0 && (
          <div className="col-12">
            <p className="text-muted">
              No hay configuraciones de tipo "empresa" registradas.
            </p>
          </div>
        )}

        {!isLoading &&
          !isError &&
          configuracionEmpresa.map((item) => {
            // TARJETA ESPECIAL: TIPO DE VENTA
            if (item.nombre === "Tipo Venta") {
              const visuals = getVisualsTipoVenta(item.clave);

              return (
                <div key={item.id} className="col-12 col-sm-6 col-lg-4 d-flex">
                  <div className="card ">
                    <div className="card-header border-0 px-5 pt-5">
                      <h5
                        className="fw-bold mb-1"
                        style={{ color: "var(--text-main)" }}
                      >
                        {item.nombre}
                      </h5>
                    </div>
                    <div className="card-body mb-auto d-flex flex-column align-items-center px-5 p-0">
                      <p
                        className="small mb-3"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {item.descripcion}
                      </p>

                      <div
                        className="d-flex justify-content-center align-items-center mb-3"
                        style={{
                          width: "72px",
                          height: "72px",
                          borderRadius: "50%",
                          backgroundColor: visuals.bgSoft,
                        }}
                      >
                        {visuals.icon}
                      </div>

                      <span
                        className="badge px-3 py-2 rounded-pill mb-4"
                        style={{
                          backgroundColor: visuals.bgSoft,
                          color: visuals.color,
                          border: `1px solid ${visuals.color}`,
                          fontSize: "0.85rem",
                          fontWeight: "600",
                        }}
                      >
                        Modo actual: {visuals.label}
                      </span>
                    </div>
                    <div className="card-footer border-0 p-3 d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn-generico px-3"
                        onClick={() => {
                          setOpenModal(true);
                          setTituloModal(item.nombre);
                          setData(item);
                        }}
                      >
                        <Settings2 size={18} className="me-2" />
                        Configurar
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // TARJETA GENÉRICA
            return (
              <div key={item.id} className="col-12 col-sm-6 col-lg-4 d-flex">
                <div className="card w-100 p-4  d-flex flex-column ">
                  <div className="mb-auto">
                    <h5
                      className="fw-bold mb-2"
                      style={{ color: "var(--text-main)" }}
                    >
                      {item.nombre}
                    </h5>
                    <p
                      className="small m-0"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item.descripcion}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-generico"
                    onClick={() => {
                      setOpenModal(true);
                      setTituloModal(item.nombre);
                      setData(item);
                    }}
                  >
                    <Settings2 size={18} className="me-2" />
                    Configuración
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      <ModalRight
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title={tituloModal}
        hideFooter={true}
      >
        {data && Object.keys(data).length > 0 && (
          <FormConfiguracionEmpresa
            configuracion={data}
            onClose={() => setOpenModal(false)}
          />
        )}
      </ModalRight>
    </div>
  );
}
