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
import { Store, Settings2, UtensilsCrossedIcon } from "lucide-react";
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

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
  }, [reset]);

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

  // HELPER: Determina la interfaz visual 100% con clases de Tailwind
  const getVisualsTipoVenta = (clave) => {
    const tipo = (clave || "").toLowerCase();

    if (tipo === "comida" || tipo === "restaurante") {
      return {
        label: "Gastronomía",
        bgSoft: "bg-amber-500/10",
        badgeClass: "bg-amber-500/20 text-amber-700 dark:text-amber-400",
        icon: <UtensilsCrossedIcon className="size-10 text-amber-500 stroke-[1.5]" />,
      };
    } else if (tipo === "retail") {
      return {
        label: "Retail / Tienda",
        bgSoft: "bg-emerald-500/10",
        badgeClass: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
        icon: <Store className="size-10 text-emerald-500 stroke-[1.5]" />,
      };
    }

    return {
      label: "Sin definir",
      bgSoft: "bg-slate-100 dark:bg-slate-800",
      badgeClass: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
      icon: <Store className="size-10 text-slate-500 stroke-[1.5]" />,
    };
  };

  return (
    <div className="w-full p-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-3 mb-4 items-stretch">
          
          {/* Columna Logo y carga */}
          <div className="col-span-full md:col-span-4">
            <Card className="flex flex-col items-center justify-center h-full p-4 rounded-xl border-border bg-card">
              <h4 className="mb-4 font-bold text-center text-foreground text-lg">
                Configuración de la Empresa
              </h4>
              
              {/* Logo actual */}
              {logoActual && !logoPreview && (
                <img
                  src={logoActual}
                  alt="Logo de la empresa"
                  className="mb-4 max-w-[120px] h-auto object-contain rounded-xl shadow-md hover:shadow-lg transition-shadow"
                />
              )}
              
              {/* Previsualización del logo */}
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Logo Previsualizado"
                  className="mb-4 max-w-[120px] h-auto object-contain rounded-xl border-2 border-primary shadow-md hover:shadow-lg transition-shadow"
                />
              )}

              <div className="w-full mb-2">
                <label
                  htmlFor="logo"
                  className="block text-sm font-semibold text-muted-foreground mb-1.5"
                >
                  Logo de la Empresa
                </label>
                <div
                  {...getRootProps()}
                  className="flex flex-col items-center justify-center p-4 text-center cursor-pointer min-h-[100px] rounded-lg border border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 transition-colors"
                >
                  <input
                    {...getInputProps()}
                    id="logo"
                    name="logo"
                    className="hidden"
                  />
                  {!logoPreview && (
                    <p className="mb-2 text-sm text-muted-foreground font-medium">
                      Haz clic o arrastra aquí para cargar el logo
                    </p>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 px-3 text-xs font-semibold bg-background hover:bg-accent border-primary/50 text-primary transition-colors"
                  >
                    Seleccionar archivo
                  </Button>
                </div>
                <p className="mt-1 text-sm text-destructive font-medium">
                  {errors.logo?.message}
                </p>
              </div>
            </Card>
          </div>

          {/* Columna datos */}
          <div className="col-span-full md:col-span-8">
            <Card className="flex flex-col h-full p-4 rounded-xl border-border bg-card">
              <h5 className="mb-4 font-bold text-foreground text-lg">
                Datos Generales
              </h5>
              
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-full md:col-span-6">
                  <label
                    htmlFor="ruc"
                    className="block text-sm font-semibold text-muted-foreground mb-1.5"
                  >
                    RUC
                  </label>
                  <input
                    type="text"
                    id="ruc"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    {...register("ruc", { required: "El RUC es obligatorio" })}
                  />
                  <p className="mt-1 text-sm text-destructive font-medium">
                    {errors.ruc?.message}
                  </p>
                </div>
                
                <div className="col-span-full md:col-span-6">
                  <label
                    htmlFor="nombre"
                    className="block text-sm font-semibold text-muted-foreground mb-1.5"
                  >
                    Nombre de la Empresa
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    {...register("nombre", {
                      required: "El nombre es obligatorio",
                    })}
                  />
                  <p className="mt-1 text-sm text-destructive font-medium">
                    {errors.nombre?.message}
                  </p>
                </div>
                
                <div className="col-span-full md:col-span-6">
                  <label
                    htmlFor="correo"
                    className="block text-sm font-semibold text-muted-foreground mb-1.5"
                  >
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="correo"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    {...register("correo", {
                      required: "El correo es obligatorio",
                      pattern: {
                        value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                        message: "Correo electrónico inválido",
                      },
                    })}
                  />
                  <p className="mt-1 text-sm text-destructive font-medium">
                    {errors.correo?.message}
                  </p>
                </div>
                
                <div className="col-span-full md:col-span-6">
                  <label
                    htmlFor="numero"
                    className="block text-sm font-semibold text-muted-foreground mb-1.5"
                  >
                    Número de Teléfono
                  </label>
                  <input
                    type="tel"
                    id="numero"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    {...register("numero", {
                      required: "El número es obligatorio",
                      pattern: {
                        value: /^[0-9]{9}$/,
                        message: "Número de teléfono inválido",
                      },
                    })}
                  />
                  <p className="mt-1 text-sm text-destructive font-medium">
                    {errors.numero?.message}
                  </p>
                </div>
                
                <div className="col-span-full">
                  <label
                    htmlFor="direccion"
                    className="block text-sm font-semibold text-muted-foreground mb-1.5"
                  >
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="direccion"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    {...register("direccion", {
                      required: "La dirección es obligatoria",
                    })}
                  />
                  <p className="mt-1 text-sm text-destructive font-medium">
                    {errors.direccion?.message}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end pt-4 mt-auto">
                <Button type="submit" variant="default" className="px-5">
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
          <div className="col-span-full py-4 text-center">
            <Cargando />
          </div>
        )}

        {isError && (
          <div className="col-span-full">
            <p className="text-destructive font-medium">
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
                  <Card className="flex flex-col w-full rounded-xl shadow-sm">
                    <CardHeader className="border-0 px-5 pt-5 pb-2">
                      <h5 className="font-bold text-foreground text-base">
                        {item.nombre}
                      </h5>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center flex-1 p-0 px-5">
                      <p className="mb-4 text-sm text-muted-foreground text-center">
                        {item.descripcion}
                      </p>

                      <div className={`flex items-center justify-center p-4 mb-4 rounded-full ${visuals.bgSoft}`}>
                        {visuals.icon}
                      </div>

                      <span className={`inline-flex items-center px-3 py-1 mb-4 text-xs font-semibold transition-colors rounded-full ${visuals.badgeClass}`}>
                        Modo actual: {visuals.label}
                      </span>
                    </CardContent>
                    <CardFooter className="flex justify-end p-4 pt-0 border-0 bg-transparent">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => {
                          setOpenModal(true);
                          setTituloModal(item.nombre);
                          setData(item);
                        }}
                      >
                        <Settings2 size={16} />
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
                <Card className="flex flex-col w-full p-5 rounded-xl shadow-sm">
                  <div className="flex-1 mb-4">
                    <h5 className="mb-2 text-base font-bold text-foreground">
                      {item.nombre}
                    </h5>
                    <p className="text-sm text-muted-foreground m-0">
                      {item.descripcion}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2 w-full sm:w-auto self-start"
                    onClick={() => {
                      setOpenModal(true);
                      setTituloModal(item.nombre);
                      setData(item);
                    }}
                  >
                    <Settings2 size={16} />
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