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
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

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
    <div className="w-full p-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-3 mb-4">
          {/* Columna Logo y carga */}
          <div className="md:col-span-4 col-span-full">
            <Card
              className="p-4 flex flex-col justify-center items-center h-full"
              style={{ borderRadius: "var(--radius-lg)" }}
            >
              <h4
                className="mb-3 font-bold text-center"
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
              <div className="mb-3 w-full">
                <label
                  htmlFor="logo"
                  className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold"
                  style={{ color: "var(--text-muted)" }}
                >
                  Logo de la Empresa
                </label>
                <div
                  {...getRootProps()}
                  className="dropzone rounded p-4 text-center flex flex-col justify-center items-center"
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
                    className="hidden"
                  />
                  {!logoPreview && (
                    <p
                      className="text-sm mb-2"
                      style={{ color: "var(--brand-secondary)" }}
                    >
                      Haz clic o arrastra aquí para cargar el logo
                    </p>
                  )}
                  <Button
                    type="button"
                    className="bg-primary text-primary-foreground shadow hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 text-xs font-semibold"
                    style={{
                      backgroundColor: "var(--fw-white)",
                      color: "var(--fw-saffron)",
                      border: "1px solid var(--fw-saffron)",
                      borderRadius: "var(--radius-sm)",
                    }}
                    variant="default"
                  >
                    Seleccionar archivo
                  </Button>
                </div>
                <p className="text-destructive text-sm mt-1">
                  {errors.logo?.message}
                </p>
              </div>
            </Card>
          </div>

          {/* Columna datos */}
          <div className="md:col-span-8 col-span-full">
            <Card
              className="p-4 h-full"
              style={{
                borderRadius: "var(--radius-lg)",
                backgroundColor: "var(--bg-card)",
              }}
            >
              <h5
                className="font-bold mb-4"
                style={{ color: "var(--brand-secondary)" }}
              >
                Datos Generales
              </h5>
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-full md:col-span-6">
                  <label
                    htmlFor="ruc"
                    className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    RUC
                  </label>
                  <input
                    type="text"
                    id="ruc"
                    className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    {...register("ruc", { required: "El RUC es obligatorio" })}
                    defaultValue={datosEmpresa?.ruc || ""}
                  />
                  <p className="text-destructive text-sm m-0">
                    {errors.ruc?.message}
                  </p>
                </div>
                <div className="col-span-full md:col-span-6">
                  <label
                    htmlFor="nombre"
                    className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Nombre de la Empresa
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    {...register("nombre", {
                      required: "El nombre es obligatorio",
                    })}
                    defaultValue={datosEmpresa?.nombre || ""}
                  />
                  <p className="text-destructive text-sm m-0">
                    {errors.nombre?.message}
                  </p>
                </div>
                <div className="col-span-full md:col-span-6">
                  <label
                    htmlFor="correo"
                    className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="correo"
                    className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
                  <p className="text-destructive text-sm m-0">
                    {errors.correo?.message}
                  </p>
                </div>
                <div className="col-span-full md:col-span-6">
                  <label
                    htmlFor="numero"
                    className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Número de Teléfono
                  </label>
                  <input
                    type="tel"
                    id="numero"
                    className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    {...register("numero", {
                      required: "El número es obligatorio",
                      pattern: {
                        value: /^[0-9]{9}$/,
                        message: "Número de teléfono inválido",
                      },
                    })}
                    defaultValue={datosEmpresa?.numero || ""}
                  />
                  <p className="text-destructive text-sm m-0">
                    {errors.numero?.message}
                  </p>
                </div>
                <div className="col-span-full">
                  <label
                    htmlFor="direccion"
                    className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="direccion"
                    className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    {...register("direccion", {
                      required: "La dirección es obligatoria",
                    })}
                    defaultValue={datosEmpresa?.direccion || ""}
                  />
                  <p className="text-destructive text-sm m-0">
                    {errors.direccion?.message}
                  </p>
                </div>
              </div>
              <div className="mt-auto pt-4 flex justify-end">
                <Button
                  type="submit"
                  className="btn-guardar px-4"
                  variant="default"
                >
                  Guardar Cambios
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>

      {/* Sección Configuraciones Extras */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
        {isLoading && (
          <div className="col-span-full text-center py-4">
            <Cargando />
          </div>
        )}

        {isError && (
          <div className="col-span-full">
            <p className="text-destructive">
              Hubo un error al obtener las configuraciones.
            </p>
          </div>
        )}

        {!isLoading && !isError && configuracionEmpresa.length === 0 && (
          <div className="col-span-full">
            <p className="text-muted-foreground">
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
                <div
                  key={item.id}
                  className="col-span-full sm:col-span-6 lg:col-span-4 flex"
                >
                  <Card className="">
                    <CardHeader className="border-0 px-5 pt-5">
                      <h5
                        className="font-bold mb-1"
                        style={{ color: "var(--text-main)" }}
                      >
                        {item.nombre}
                      </h5>
                    </CardHeader>
                    <CardContent className="mb-auto flex flex-col items-center p-0">
                      <p
                        className="text-sm mb-3"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {item.descripcion}
                      </p>

                      <div
                        className="flex justify-center items-center mb-3"
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
                        className="inline-flex items-center text-xs font-semibold transition-colors px-3 py-2 rounded-full mb-4"
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
                    </CardContent>
                    <CardFooter className="bg-transparent border-0 p-3 flex justify-end">
                      <Button
                        type="button"
                        className="btn-generico px-3"
                        onClick={() => {
                          setOpenModal(true);
                          setTituloModal(item.nombre);
                          setData(item);
                        }}
                        variant="default"
                      >
                        <Settings2 size={18} />
                        Configurar
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              );
            }

            // TARJETA GENÉRICA
            return (
              <div
                key={item.id}
                className="col-span-full sm:col-span-6 lg:col-span-4 flex"
              >
                <Card className="w-full p-4 flex flex-col">
                  <div className="mb-auto">
                    <h5
                      className="font-bold mb-2"
                      style={{ color: "var(--text-main)" }}
                    >
                      {item.nombre}
                    </h5>
                    <p
                      className="text-sm m-0"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item.descripcion}
                    </p>
                  </div>
                  <Button
                    type="button"
                    className="btn-generico"
                    onClick={() => {
                      setOpenModal(true);
                      setTituloModal(item.nombre);
                      setData(item);
                    }}
                    variant="default"
                  >
                    <Settings2 size={18} className="" />
                    Configuración
                  </Button>
                </Card>
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
