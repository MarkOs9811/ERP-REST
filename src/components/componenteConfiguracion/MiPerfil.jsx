import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { GetMiPerfil } from "../../service/accionesConfiguracion/GetMiPerfil";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";
import { Camera, KeyRound, Pencil, ShieldCheck, UserRound } from "lucide-react";
import ModalRight from "../componentesReutilizables/ModalRight";
import { FormPassChange } from "./formularios/FormPassChange";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
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

  const { data: perfil = {} } = useQuery({
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

  useEffect(() => {
    if (!previewImage) return undefined;
    return () => URL.revokeObjectURL(previewImage);
  }, [previewImage]);

  // Manejar clic en "Cambiar foto"
  const handleFotoClick = () => {
    if (editable) {
      fileInputRef.current?.click();
    }
  };

  // Manejar cambio de archivo (Previsualización)
  const onFileChange = (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (file) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        ToastAlert("error", "La foto debe estar en formato JPG o PNG.");
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        ToastAlert("error", "La foto no debe superar los 3 MB.");
        return;
      }
      setPreviewImage(URL.createObjectURL(file));
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
    <div className="mx-auto w-full max-w-7xl space-y-5 p-3 sm:p-5">
      <header className="flex flex-col gap-3 border-b border-border/70 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UserRound className="size-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Cuenta personal
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              Mi perfil
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Administra tus datos personales y la seguridad de tu cuenta.
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 sm:self-center">
          <ShieldCheck className="size-4" />
          Informacion de tu cuenta
        </div>
      </header>

      <div className="grid grid-cols-12 gap-4 lg:gap-5">
        {/* Perfil lateral */}
        <div className="col-span-full md:col-span-4">
          <Card
            className="flex h-full flex-col items-center justify-center rounded-2xl border-border bg-card p-5 shadow-sm sm:p-6"
            style={{
              minHeight: 430,
            }}
          >
            <div className="mb-6 flex w-full items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Foto de perfil
              </span>
              <label
                htmlFor="switch-editar"
                className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground"
              >
                Editar
                <input
                  className="size-4 accent-primary"
                  type="checkbox"
                  id="switch-editar"
                  role="switch"
                  checked={editable}
                  onChange={() => {
                    if (editable) {
                      reset();
                      setPreviewImage(null);
                      setValue("foto_file", null);
                      setEditable(false);
                      return;
                    }
                    setEditable(true);
                  }}
                />
              </label>
            </div>
            <div className="mb-3">
              <div
                className="mx-auto flex size-36 items-center justify-center overflow-hidden rounded-full bg-muted ring-4 ring-background shadow-lg"
              >
                <img
                  src={currentImageSrc}
                  alt="Avatar"
                  className="size-full object-cover"
                />
              </div>
              <div className="mt-4 text-center">
                <p className="font-semibold text-foreground">
                  {persona.nombre || perfil.name || "Tu perfil"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {empleado.cargo?.nombre || "Usuario"}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  JPG o PNG, maximo 3 MB
                </p>
              </div>
            </div>
            {/* Input oculto para el archivo */}
            <input
              type="file"
              accept="image/jpeg,image/png"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={onFileChange}
            />
            <div className="flex flex-col gap-2 w-full">
              <Button
                className="mx-auto mt-3 w-full max-w-xs gap-2 rounded-xl"
                type="button"
                onClick={handleFotoClick}
                disabled={!editable}
                variant="outline"
              >
                <Camera className="size-4" />
                Cambiar foto
              </Button>
              <Button
                className="mx-auto w-full max-w-xs gap-2 rounded-xl"
                onClick={() => setModalPass(true)}
                variant="secondary"
              >
                <KeyRound className="size-4" />
                Cambiar contraseña
              </Button>
            </div>
          </Card>
        </div>

        {/* Formulario de datos */}
        <div className="col-span-full md:col-span-8">
          <Card asChild>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="h-full rounded-2xl border-border bg-card p-5 shadow-sm sm:p-6"
            >
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    Informacion personal
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Los campos marcados se guardaran en tu perfil.
                  </p>
                </div>
                {editable && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    <Pencil className="size-3.5" />
                    Modo edicion
                  </span>
                )}
              </div>

              <div className="grid grid-cols-12 gap-3">
                {/* Datos personales con Register */}
                <div className="col-span-full md:col-span-6">
                  <label
                    htmlFor="perfil-nombre"
                    className="text-sm font-medium text-foreground"
                  >
                    Nombre
                  </label>
                  <Input
                    id="perfil-nombre"
                    disabled={!editable}
                    aria-invalid={Boolean(errors.nombre)}
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
                  <label
                    htmlFor="perfil-apellidos"
                    className="text-sm font-medium text-foreground"
                  >
                    Apellidos
                  </label>
                  <Input
                    id="perfil-apellidos"
                    disabled={!editable}
                    aria-invalid={Boolean(errors.apellidos)}
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
                  <label
                    htmlFor="perfil-fecha"
                    className="text-sm font-medium text-foreground"
                  >
                    Fecha de nacimiento
                  </label>
                  <Input
                    id="perfil-fecha"
                    type="date"
                    disabled={!editable}
                    {...register("fecha_nacimiento")}
                  />
                </div>

                <div className="col-span-full md:col-span-6">
                  <label
                    htmlFor="perfil-tipo-documento"
                    className="text-sm font-medium text-foreground"
                  >
                    Tipo de documento
                  </label>
                  <Input
                    id="perfil-tipo-documento"
                    disabled={!editable}
                    {...register("tipo_documento")}
                  />
                </div>

                <div className="col-span-full md:col-span-6">
                  <label
                    htmlFor="perfil-documento"
                    className="text-sm font-medium text-foreground"
                  >
                    Documento de identidad
                  </label>
                  <Input
                    id="perfil-documento"
                    disabled={!editable}
                    {...register("documento_identidad")}
                  />
                </div>

                <div className="col-span-full md:col-span-6">
                  <label
                    htmlFor="perfil-telefono"
                    className="text-sm font-medium text-foreground"
                  >
                    Teléfono
                  </label>
                  <Input
                    id="perfil-telefono"
                    disabled={!editable}
                    {...register("telefono")}
                  />
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="perfil-direccion"
                    className="text-sm font-medium text-foreground"
                  >
                    Dirección
                  </label>
                  <Input
                    id="perfil-direccion"
                    disabled={!editable}
                    {...register("direccion")}
                  />
                </div>

                {/* Ubicación (Solo lectura por ahora, o podrías hacer selects si quisieras editarlos) */}
                <div className="col-span-full md:col-span-4">
                  <label
                    htmlFor="perfil-departamento"
                    className="text-sm font-medium text-foreground"
                  >
                    Departamento
                  </label>
                  <Input
                    id="perfil-departamento"
                    value={departamento?.nombre || ""}
                    disabled
                  />
                </div>
                <div className="col-span-full md:col-span-4">
                  <label
                    htmlFor="perfil-provincia"
                    className="text-sm font-medium text-foreground"
                  >
                    Provincia
                  </label>
                  <Input
                    id="perfil-provincia"
                    value={provincia?.nombre || ""}
                    disabled
                  />
                </div>
                <div className="col-span-full md:col-span-4">
                  <label
                    htmlFor="perfil-distrito"
                    className="text-sm font-medium text-foreground"
                  >
                    Distrito
                  </label>
                  <Input
                    id="perfil-distrito"
                    value={distrito?.nombre || ""}
                    disabled
                  />
                </div>

                {/* Datos laborales (Visualización) */}
                <Card className="col-span-full mb-3 rounded-xl border-border bg-muted/30 p-4">
                  <div className="mb-3 text-sm font-semibold text-foreground">
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
                  className="rounded-xl px-5"
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
