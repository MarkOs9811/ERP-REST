import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  Briefcase,
  DollarSign,
  Clock,
  FileText,
  CreditCard,
  LayoutGrid,
  Save,
  X,
  Building2,
  ImagePlus,
  Trash2Icon,
  Phone,
} from "lucide-react";

import ToastAlert from "../componenteToast/ToastAlert";
import axiosInstance from "../../api/AxiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function UsuarioEditar({ handleCloseModal, data, onUsuarioUpdated }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    reset, // Usamos reset para poblar todo de golpe cuando los datos estén listos
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tipo_documento: "DNI",
      numero_documento: "",
      nombres: "",
      apellidos: "",
      telefono: "",
      correo_electronico: "",
      sede: "",
      area: "",
      cargo: "",
      salario: "",
      horario: "",
      fotoPerfil: null,
    },
  });

  const tipoDocumentoSeleccionado = watch("tipo_documento");

  const [cargos, setCargos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [horarios, setHorarios] = useState([]);

  const [fotoPreview, setFotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const initModalData = async () => {
      if (!data) return;

      try {
        // 1. Cargar listas de selects primero
        const [cargosRes, areasRes, horariosRes, sedesRes] = await Promise.all([
          axiosInstance.get("/cargos"),
          axiosInstance.get("/areas"),
          axiosInstance.get("/horarios"),
          axiosInstance.get("/sedesAll"),
        ]);

        const listCargos = cargosRes.data || [];
        const listAreas = areasRes.data.data || [];
        const listHorarios = horariosRes.data || [];
        const listSedes = sedesRes.data.data || [];

        setCargos(listCargos);
        setAreas(listAreas);
        setHorarios(listHorarios);
        setSedes(listSedes);

        // 2. Una vez cargadas las opciones en el estado, reseteamos el formulario con los valores del usuario
        reset({
          tipo_documento: data.empleado?.persona?.tipo_documento || "DNI",
          numero_documento: data.empleado?.persona?.documento_identidad || "",
          nombres: data.empleado?.persona?.nombre || "",
          apellidos: data.empleado?.persona?.apellidos || "",
          telefono: data.empleado?.persona?.telefono || "",
          correo_electronico: data.empleado?.persona?.correo || "",
          sede: data.sede?.id ? String(data.sede.id) : "",
          area: data.empleado?.area?.id ? String(data.empleado.area.id) : "",
          cargo: data.empleado?.cargo?.id ? String(data.empleado.cargo.id) : "",
          salario: data.empleado?.salario || "",
          horario: data.empleado?.horario?.id ? String(data.empleado.horario.id) : "",
          fotoPerfil: null,
        });

        // 3. Cargar la vista previa de la foto de Cloudflare/S3
        const fotoRegistrada = data.foto_url;
        if (fotoRegistrada) {
          setFotoPreview(fotoRegistrada);
        } else {
          setFotoPreview(null);
        }
      } catch (err) {
        setApiError("Hubo un error al cargar los datos auxiliares.");
      }
    };

    initModalData();
  }, [data, reset]);

  const handleCargoChange = async (e) => {
    const selectedCargoId = e.target.value;
    if (selectedCargoId) {
      try {
        const response = await axiosInstance.get(
          `/getSalarioCargo/${selectedCargoId}`,
        );
        setValue("salario", response.data.salario || "", { shouldValidate: true });
      } catch (error) {
        console.error("Error al obtener el salario:", error);
      }
    } else {
      setValue("salario", "");
    }
  };

  const onSubmitForm = async (formData) => {
    if (loading) return;
    setApiError("");
    setLoading(true);

    try {
      const payload = new FormData();

      payload.append("tipo_documento", String(formData.tipo_documento));
      payload.append("numero_documento", String(formData.numero_documento));
      payload.append("nombres", String(formData.nombres));
      payload.append("apellidos", String(formData.apellidos));
      payload.append("telefono", String(formData.telefono));
      payload.append("correo_electronico", String(formData.correo_electronico));
      payload.append("sede", String(formData.sede));
      payload.append("area", String(formData.area));
      payload.append("cargo", String(formData.cargo));
      payload.append("salario", String(formData.salario));
      payload.append("horario", String(formData.horario));

      if (formData.fotoPerfil) {
        payload.append("foto_perfil", formData.fotoPerfil);
      }

      payload.append("_method", "POST");

      const response = await axiosInstance.post(
        `/updateUsuario/${data.id}`,
        payload,
      );

      if (response.data.success) {
        ToastAlert("success", "Usuario actualizado con éxito");
        queryClient.invalidateQueries({ queryKey: ["usuarios"] });
        handleCloseModal();
        setTimeout(() => {
          onUsuarioUpdated();
        }, 3000);
      }
    } catch (error) {
      console.error("Error completo:", error);
      const msg =
        error.response?.data?.message ||
        "Error al actualizar. Intente nuevamente.";
      ToastAlert("error", msg);
    } finally {
      setLoading(false);
    }
  };

  const sectionTitleStyle =
    "text-destructive font-bold text-sm uppercase mb-3 mt-2 border-b pb-1";

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0)
        return ToastAlert("error", "Solo imágenes.");
      const file = acceptedFiles[0];
      if (file) {
        setFotoPreview(URL.createObjectURL(file));
        setValue("fotoPerfil", file, { shouldValidate: true });
      }
    },
  });

  const removePhoto = (e) => {
    e.stopPropagation();
    setFotoPreview(null);
    setValue("fotoPerfil", null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="p-3">
      {loading && !watch("nombres") ? (
        <div className="text-center p-4">Cargando...</div>
      ) : (
        <>
          {apiError && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-3 text-sm">
              {apiError}
            </div>
          )}

          {/* SECCIÓN 1: FOTO DE PERFIL */}
          <div className="flex items-center gap-3 mb-4 p-3 rounded-md border-dashed">
            <div
              {...getRootProps()}
              className="relative flex items-center justify-center bg-background rounded-full shadow-sm"
              style={{
                width: "80px",
                height: "80px",
                cursor: "pointer",
                overflow: "hidden",
                border: "2px solid #e2e8f0",
              }}
            >
              <input {...getInputProps()} id="fotoPerfil" />
              {fotoPreview ? (
                <img
                  src={fotoPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImagePlus
                  size={28}
                  className="text-muted-foreground opacity-50"
                />
              )}
            </div>

            <div className="grow">
              <h6
                className="m-0 font-bold text-muted-foreground"
                style={{ fontSize: "0.9rem" }}
              >
                Foto de Perfil
              </h6>
              <p className="m-0 text-muted-foreground text-sm leading-tight mb-2">
                Haz clic en el círculo para subir una imagen.
              </p>
              {fotoPreview && (
                <Button
                  type="button"
                  onClick={removePhoto}
                  className="h-7 text-xs px-2"
                  variant="destructive"
                >
                  <Trash2Icon size={12} className="mr-1" /> Quitar foto
                </Button>
              )}
            </div>
          </div>

          {/* SECCIÓN 2: INFORMACIÓN PERSONAL */}
          <h6 className={sectionTitleStyle}>Información Personal</h6>
          <div className="grid grid-cols-12 gap-3 mb-3">
            {/* Tipo Doc */}
            <div className="col-span-full md:col-span-4">
              <Label className="mb-1.5 block">Tipo Doc.</Label>
              <div className="relative w-full">
                <FileText
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <select
                  className={`flex h-9 w-full items-center justify-between rounded-md border bg-background px-3 pl-9 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring ${
                    errors.tipo_documento ? "border-destructive ring-destructive" : "border-input"
                  }`}
                  {...register("tipo_documento", {
                    required: "Seleccione tipo",
                    onChange: () => setValue("numero_documento", "", { shouldValidate: true })
                  })}
                >
                  <option value="DNI">DNI</option>
                  <option value="extranjeria">C. Extranjería</option>
                </select>
              </div>
              {errors.tipo_documento && <span className="text-xs text-destructive font-medium mt-1 block">{errors.tipo_documento.message}</span>}
            </div>

            {/* Num Documento */}
            <div className="col-span-full md:col-span-4">
              <Label className="mb-1.5 block">Nº Documento</Label>
              <div className="relative w-full">
                <CreditCard
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="text"
                  className={`pl-9 ${errors.numero_documento ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  placeholder="Ingrese número"
                  {...register("numero_documento", {
                    required: "Documento requerido",
                    pattern: {
                      value: tipoDocumentoSeleccionado === "DNI" ? /^[0-9]{8}$/ : /^[a-zA-Z0-9]{1,12}$/,
                      message: tipoDocumentoSeleccionado === "DNI" ? "Debe tener 8 dígitos exactos" : "Máximo 12 caracteres",
                    }
                  })}
                  onInput={(e) => {
                    if (tipoDocumentoSeleccionado === "DNI") {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 8);
                    } else {
                      e.target.value = e.target.value.replace(/\s/g, "").slice(0, 12);
                    }
                  }}
                />
              </div>
              {errors.numero_documento && <span className="text-xs text-destructive font-medium mt-1 block">{errors.numero_documento.message}</span>}
            </div>

            {/* Teléfono */}
            <div className="col-span-full md:col-span-4">
              <Label className="mb-1.5 block">Teléfono</Label>
              <div className="relative w-full">
                <Phone
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="tel"
                  className={`pl-9 ${errors.telefono ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  placeholder="Ej. 987654321"
                  {...register("telefono", {
                    required: "Teléfono requerido",
                    pattern: {
                      value: /^[0-9]{9}$/,
                      message: "Debe contener 9 números exactos",
                    }
                  })}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 9);
                  }}
                />
              </div>
              {errors.telefono && <span className="text-xs text-destructive font-medium mt-1 block">{errors.telefono.message}</span>}
            </div>

            {/* Nombres */}
            <div className="col-span-full md:col-span-6">
              <Label className="mb-1.5 block">Nombres</Label>
              <div className="relative w-full">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="text"
                  className={`pl-9 ${errors.nombres ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  placeholder="Ej. Juan Carlos"
                  {...register("nombres", { required: "Los nombres son requeridos" })}
                />
              </div>
              {errors.nombres && <span className="text-xs text-destructive font-medium mt-1 block">{errors.nombres.message}</span>}
            </div>

            {/* Apellidos */}
            <div className="col-span-full md:col-span-6">
              <Label className="mb-1.5 block">Apellidos</Label>
              <div className="relative w-full">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="text"
                  className={`pl-9 ${errors.apellidos ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  placeholder="Ej. Pérez López"
                  {...register("apellidos", { required: "Los apellidos son requeridos" })}
                />
              </div>
              {errors.apellidos && <span className="text-xs text-destructive font-medium mt-1 block">{errors.apellidos.message}</span>}
            </div>
          </div>

          {/* SECCIÓN 3: CUENTA Y ACCESO */}
          <h6 className={sectionTitleStyle}>Cuenta y Acceso</h6>
          <div className="grid grid-cols-12 gap-3 mb-3">
            <div className="col-span-full">
              <Label className="mb-1.5 block">Correo Electrónico</Label>
              <div className="relative w-full">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="email"
                  className={`pl-9 ${errors.correo_electronico ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  placeholder="usuario@empresa.com"
                  {...register("correo_electronico", {
                    required: "El correo es requerido",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Formato de correo inválido",
                    }
                  })}
                />
              </div>
              {errors.correo_electronico && <span className="text-xs text-destructive font-medium mt-1 block">{errors.correo_electronico.message}</span>}
            </div>
          </div>

          {/* SECCIÓN 4: DATOS LABORALES */}
          <h6 className={sectionTitleStyle}>Datos Laborales</h6>
          <div className="grid grid-cols-12 gap-3">
            {/* Sede */}
            <div className="col-span-full md:col-span-6">
              <Label className="mb-1.5 block">Sede</Label>
              <div className="relative w-full">
                <Building2
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <select
                  className={`flex h-9 w-full items-center justify-between rounded-md border bg-background px-3 pl-9 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring ${
                    errors.sede ? "border-destructive ring-destructive" : "border-input"
                  }`}
                  {...register("sede", { required: "Seleccione sede" })}
                >
                  <option value="">Seleccione...</option>
                  {sedes.map((s) => (
                    <option key={s.id} value={String(s.id)}>
                      {s.nombre}
                    </option>
                  ))}
                </select>
              </div>
              {errors.sede && <span className="text-xs text-destructive font-medium mt-1 block">{errors.sede.message}</span>}
            </div>

            {/* Área */}
            <div className="col-span-full md:col-span-6">
              <Label className="mb-1.5 block">Área</Label>
              <div className="relative w-full">
                <LayoutGrid
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <select
                  className={`flex h-9 w-full items-center justify-between rounded-md border bg-background px-3 pl-9 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring ${
                    errors.area ? "border-destructive ring-destructive" : "border-input"
                  }`}
                  {...register("area", { required: "Seleccione área" })}
                >
                  <option value="">Seleccione...</option>
                  {areas.map((a) => (
                    <option key={a.id} value={String(a.id)}>
                      {a.nombre}
                    </option>
                  ))}
                </select>
              </div>
              {errors.area && <span className="text-xs text-destructive font-medium mt-1 block">{errors.area.message}</span>}
            </div>

            {/* Cargo */}
            <div className="col-span-full md:col-span-6">
              <Label className="mb-1.5 block">Cargo</Label>
              <div className="relative w-full">
                <Briefcase
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <select
                  className={`flex h-9 w-full items-center justify-between rounded-md border bg-background px-3 pl-9 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring ${
                    errors.cargo ? "border-destructive ring-destructive" : "border-input"
                  }`}
                  {...register("cargo", {
                    required: "Seleccione cargo",
                    onChange: handleCargoChange
                  })}
                >
                  <option value="">Seleccione...</option>
                  {cargos.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>
              {errors.cargo && <span className="text-xs text-destructive font-medium mt-1 block">{errors.cargo.message}</span>}
            </div>

            {/* Horario */}
            <div className="col-span-full md:col-span-6">
              <Label className="mb-1.5 block">Horario</Label>
              <div className="relative w-full">
                <Clock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <select
                  className={`flex h-9 w-full items-center justify-between rounded-md border bg-background px-3 pl-9 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring ${
                    errors.horario ? "border-destructive ring-destructive" : "border-input"
                  }`}
                  {...register("horario", { required: "Seleccione horario" })}
                >
                  <option value="">Seleccione...</option>
                  {horarios.map((h) => (
                    <option key={h.id} value={String(h.id)}>
                      {h.horaEntrada} - {h.horaSalida}
                    </option>
                  ))}
                </select>
              </div>
              {errors.horario && <span className="text-xs text-destructive font-medium mt-1 block">{errors.horario.message}</span>}
            </div>

            {/* Salario */}
            <div className="col-span-full md:col-span-6">
              <Label className="mb-1.5 block">Salario</Label>
              <div className="relative w-full">
                <DollarSign
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="text"
                  className="pl-9 bg-muted/50 cursor-not-allowed"
                  readOnly
                  placeholder="0.00"
                  {...register("salario")}
                />
              </div>
            </div>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
            <Button
              type="button"
              onClick={handleCloseModal}
              variant="outline"
              className="flex items-center gap-2"
            >
              <X size={16} /> Cancelar
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Save size={16} />
              {loading ? "Guardando..." : "Actualizar Usuario"}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}