import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form"; // <--- Importamos React Hook Form
import { GetMiPerfil } from "../../service/accionesConfiguracion/GetMiPerfil";
import { PostData } from "../../service/CRUD/PostData";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";
import { KeyIcon } from "lucide-react";
import ModalRight from "../componentesReutilizables/ModalRight";
import { FormPassChange } from "./formularios/FormPassChange";
import { Button } from "../ui/button";
import { Card } from "@/components/ui/card";

export const MiPerfil = () => {
  const queryClient = useQueryClient();
  const [editable, setEditable] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // Estado para previsualizar foto nueva
  const fileInputRef = useRef(null); // Referencia al input de archivo oculto

  // PARA ABRIR MODAL DE CAMBIO DE CONTRASEÑA
  const [modalPass, setModalPass] = useState(false);
  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const { data: perfil = {}, isLoading } = useQuery({
    queryKey: ["perfil"],
    queryFn: GetMiPerfil,
    refetchOnWindowFocus: false,
    retry: 1,
    refetchOnMount: false,
  });

  const persona = perfil?.empleado?.persona || {};
  const empleado = perfil?.empleado || {};
  const distrito = persona?.distrito || {};
  const provincia = distrito?.provincia || {};
  const departamento = provincia?.departamento || {};

  // Cargar datos en el formulario cuando llegan del backend
  useEffect(() => {
    if (persona.id) {
      reset({
        nombre: persona.nombre,
        apellidos: persona.apellidos,
        fecha_nacimiento: persona.fecha_nacimiento,
        tipo_documento: persona.tipo_documento,
        documento_identidad: persona.documento_identidad,
        telefono: persona.telefono,
        direccion: persona.direccion,
      });
    }
  }, [persona, reset]);

  // Manejar clic en "Cambiar foto"
  const handleFotoClick = () => {
    if (editable) {
      fileInputRef.current.click();
    }
  };

  // Manejar cambio de archivo (Previsualización)
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file)); // Crea URL temporal para vista previa
      // IMPORTANTE: Guardamos el archivo binario real en react-hook-form bajo la key "foto_file"
      setValue("foto_file", file);
    }
  };

  // Enviar formulario
  const onSubmit = async (data) => {
    // Usamos FormData para enviar archivos y textos (multipart/form-data)
    const formData = new FormData();

    // Agregamos campos de texto
    formData.append("nombre", data.nombre);
    formData.append("apellidos", data.apellidos);
    formData.append("fecha_nacimiento", data.fecha_nacimiento || "");
    formData.append("tipo_documento", data.tipo_documento || "");
    formData.append("documento_identidad", data.documento_identidad || "");
    formData.append("telefono", data.telefono || "");
    formData.append("direccion", data.direccion || "");

    // CORRECCIÓN CLAVE: Agregamos el archivo binario almacenado, no una URL.
    if (data.foto_file) {
      formData.append("foto", data.foto_file);
    }

    try {
      // Importante: No uses headers de Content-Type manuales, Axios lo calcula automático con FormData.
      // Si tu axiosInstance.post no soporta form-data de manera nativa, asegúrate de que use config con 'multipart/form-data'
      const response = await axiosInstance.post("/miPerfilUpdate", formData);

      if (response.data.success) {
        ToastAlert("success", "Perfil actualizado correctamente");
        setEditable(false);
        setPreviewImage(null); // Limpiar preview
        queryClient.invalidateQueries(["perfil"]); // Recargar datos del perfil
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al actualizar perfil";
      ToastAlert("error", errorMessage);
    }
  };

  // Determinar qué imagen mostrar (Nueva > Backend > Default)
  const currentImageSrc = previewImage
    ? previewImage
    : perfil.foto_url
      ? `${perfil.foto_url}`
      : "/images/avatar_default.png";

  return (
    <div className="w-full p-3">
      <div className="grid grid-cols-12 gap-3">
        {/* Perfil lateral */}
        <div className="col-span-full md:col-span-4">
          <Card
            className="border p-4 h-full"
            style={{
              borderRadius: 20,
              background: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 450,
            }}
          >
            {" "}
            <div className="flex justify-end mb-2 items-center">
              <label
                htmlFor="switch-editar"
                className="text-muted-foreground me-2 mb-0"
                style={{ cursor: "pointer" }}
              >
                Editar
              </label>
              <div className="items-center gap-2 flex m-0 p-0">
                <input
                  className="size-4 shrink-0 rounded border-input accent-primary m-0"
                  type="checkbox"
                  id="switch-editar"
                  role="switch"
                  checked={editable}
                  onChange={() => {
                    setEditable((e) => !e);
                    if (editable) reset(); // Si cancela edición, resetear cambios
                  }}
                />
              </div>
            </div>
            <div className="mb-3">
              <div
                style={{
                  width: 140,
                  height: 140,
                  margin: "0 auto",
                  borderRadius: "50%",
                  border: "2px dashed #e8c7c7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#faf0f0",
                  overflow: "hidden", // Importante para que la img no salga del borde
                }}
              >
                <img
                  src={currentImageSrc}
                  alt="Avatar"
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="mt-2 text-muted-foreground text-sm text-center">
                Permitido <b>*.jpeg, *.jpg, *.png </b>
                <br />
                Tamaño máximo de 3 Mb
              </div>
            </div>
            {/* Input oculto para el archivo */}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={onFileChange}
            />
            <div className="flex flex-col gap-2 w-full">
              <Button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 w-1/2 mx-auto"
                type="button"
                onClick={handleFotoClick}
                disabled={!editable} // Solo habilitado si está en modo edición
                style={{
                  background: editable ? "#ffeaea" : "#f0f0f0",
                  color: editable ? "#ee5252" : "#999",
                  fontWeight: 500,
                  cursor: editable ? "pointer" : "not-allowed",
                }}
                variant="default"
              >
                Cambiar foto
              </Button>
              <Button
                className="btn-principal w-1/2 mx-auto"
                onClick={() => setModalPass(true)}
                variant="default"
              >
                <KeyIcon />
                Cambiar contraseña
              </Button>
            </div>
          </Card>
        </div>

        {/* Formulario de datos */}
        <div className="col-span-full md:col-span-8">
          <Card asChild>
            <form
              onSubmit={handleSubmit(onSubmit)} // Conectamos handleSubmit
              className="border p-4 h-full"
              style={{ borderRadius: 20, background: "#fff" }}
            >
              <div className="flex justify-between items-center border-b mb-3">
                <p className="h4">Mi Información</p>
              </div>

              <div className="grid grid-cols-12 gap-3">
                {/* Datos personales con Register */}
                <div className="col-span-full md:col-span-6">
                  <label className="text-muted-foreground text-sm">
                    Nombre
                  </label>
                  <input
                    className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                      errors.nombre
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }`}
                    disabled={!editable}
                    {...register("nombre", {
                      required: "El nombre es obligatorio",
                    })}
                  />
                  {errors.nombre && (
                    <small className="text-destructive">
                      {errors.nombre.message}
                    </small>
                  )}
                </div>

                <div className="col-span-full md:col-span-6">
                  <label className="text-muted-foreground text-sm">
                    Apellidos
                  </label>
                  <input
                    className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                      errors.apellidos
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }`}
                    disabled={!editable}
                    {...register("apellidos", {
                      required: "El apellido es obligatorio",
                    })}
                  />
                  {errors.apellidos && (
                    <small className="text-destructive">
                      {errors.apellidos.message}
                    </small>
                  )}
                </div>

                <div className="col-span-full md:col-span-6">
                  <label className="text-muted-foreground text-sm">
                    Fecha de nacimiento
                  </label>
                  <input
                    type="date"
                    className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!editable}
                    {...register("fecha_nacimiento")}
                  />
                </div>

                <div className="col-span-full md:col-span-6">
                  <label className="text-muted-foreground text-sm">
                    Tipo de documento
                  </label>
                  <input
                    className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!editable}
                    {...register("tipo_documento")}
                  />
                </div>

                <div className="col-span-full md:col-span-6">
                  <label className="text-muted-foreground text-sm">
                    Documento de identidad
                  </label>
                  <input
                    className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!editable}
                    {...register("documento_identidad")}
                  />
                </div>

                <div className="col-span-full md:col-span-6">
                  <label className="text-muted-foreground text-sm">
                    Teléfono
                  </label>
                  <input
                    className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!editable}
                    {...register("telefono")}
                  />
                </div>

                <div className="col-span-full">
                  <label className="text-muted-foreground text-sm">
                    Dirección
                  </label>
                  <input
                    className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!editable}
                    {...register("direccion")}
                  />
                </div>

                {/* Ubicación (Solo lectura por ahora, o podrías hacer selects si quisieras editarlos) */}
                <div className="col-span-full md:col-span-4">
                  <label className="text-muted-foreground text-sm">
                    Departamento
                  </label>
                  <input
                    className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={departamento?.nombre || ""}
                    disabled
                  />
                </div>
                <div className="col-span-full md:col-span-4">
                  <label className="text-muted-foreground text-sm">
                    Provincia
                  </label>
                  <input
                    className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={provincia?.nombre || ""}
                    disabled
                  />
                </div>
                <div className="col-span-full md:col-span-4">
                  <label className="text-muted-foreground text-sm">
                    Distrito
                  </label>
                  <input
                    className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={distrito?.nombre || ""}
                    disabled
                  />
                </div>

                {/* Datos laborales (Visualización) */}
                <Card className="border p-3 mb-3">
                  {/* ... (Todo tu bloque de datos laborales igual que antes) ... */}
                  <div className="h6 text-muted-foreground mb-3">
                    Información del Empleado
                  </div>
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-full md:col-span-4">
                      <div className="text-muted-foreground text-sm mb-1">
                        Salario
                      </div>
                      <div className="font-semibold">
                        {empleado.salario || "-"}
                      </div>
                    </div>
                    <div className="col-span-full md:col-span-4">
                      <div className="text-muted-foreground text-sm mb-1">
                        Cargo
                      </div>
                      <div className="font-semibold">
                        {empleado.cargo?.nombre || "-"}
                      </div>
                    </div>
                    <div className="col-span-full md:col-span-4">
                      <div className="text-muted-foreground text-sm mb-1">
                        Área
                      </div>
                      <div className="font-semibold">
                        {empleado.area?.nombre || "-"}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  className="btn-guardar" // Asegúrate de tener una clase para esto
                  type="submit"
                  disabled={!editable}
                  variant="default"
                >
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      <ModalRight
        isOpen={modalPass}
        onClose={() => setModalPass(false)}
        title="Cambiar Contraseña"
        subtitulo="Protege tu cuenta con una contraseña segura."
        width="450px"
        hideFooter={true} // CRÍTICO: Delega el control de botones al hijo
      >
        <FormPassChange onClose={() => setModalPass(false)} />
      </ModalRight>
    </div>
  );
};
