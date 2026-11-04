import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

// ICONOS LUCIDE
import {
  User,
  Mail,
  Lock,
  Building2,
  Briefcase,
  Banknote,
  Clock,
  IdCard,
  ImagePlus,
  Trash2,
  CreditCard,
} from "lucide-react";

import ToastAlert from "../componenteToast/ToastAlert";
import axiosInstance from "../../api/AxiosInstance";

import {
  handleInputChange,
  handleSelectChange,
  limitDocumentoInput,
  validateDNI,
  validateDocumento,
} from "../../hooks/InputHandlers";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function UsuarioForm({ handleCloseModal }) {
  const queryClient = useQueryClient();

  // Estado local para datos auxiliares
  const [formData, setFormData] = useState({
    cargo: "",
    salario: "",
  });

  const [areas, setAreas] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [fotoPreview, setFotoPreview] = useState(null);

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [areasRes, cargosRes, horariosRes] = await Promise.all([
          axiosInstance.get("/areas"),
          axiosInstance.get("/cargos"),
          axiosInstance.get("/horarios"),
        ]);
        setAreas(areasRes.data.data);
        setCargos(cargosRes.data);
        setHorarios(horariosRes.data);
      } catch (error) {
        ToastAlert("error", "Error cargando datos: " + error);
      }
    };
    fetchData();
  }, []);

  // --- 2. REACT HOOK FORM ---
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm();

  // --- 3. LÓGICA DE NEGOCIO ---

  // Cambio de cargo -> Fetch Salario
  const handleCargoChange = async (selectedCargoId) => {
    setFormData({ ...formData, cargo: selectedCargoId });

    if (selectedCargoId) {
      try {
        const response = await axiosInstance.get(
          `/getSalarioCargo/${selectedCargoId}`,
        );
        const salario = response.data.salario;
        setFormData({ ...formData, cargo: selectedCargoId, salario });
        setValue("salario", salario);
      } catch (error) {
        console.error("Error al obtener salario:", error);
      }
    } else {
      setFormData({ ...formData, salario: "" });
      setValue("salario", "");
    }
  };

  // Submit
  const onSubmit = async (data) => {
    const formDataToSend = new FormData();
    Object.keys(data).forEach((key) => {
      formDataToSend.append(key, data[key]);
    });

    if (formData.fotoPerfil) {
      formDataToSend.append("fotoPerfil", formData.fotoPerfil);
    }

    try {
      const response = await axiosInstance.post(
        "/storeUsuario",
        formDataToSend,
      );
      if (response.data.success) {
        ToastAlert("success", response.data.success);
        queryClient.invalidateQueries({ queryKey: ["usuarios"] });
        handleCloseModal(); // Cerrar modal al guardar
      } else {
        ToastAlert("error", response.data.message || "Error inesperado");
      }
    } catch (error) {
      // Manejo de errores simplificado para el ejemplo
      if (error.response?.data?.errors) {
        ToastAlert("error", "Verifique los campos ingresados");
      } else {
        ToastAlert(
          "error",
          error.response?.data?.error || "Error al registrar",
        );
      }
    }
  };

  // Dropzone
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] }, // Sintaxis moderna de dropzone
    maxFiles: 1,
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0)
        return ToastAlert("error", "Solo imágenes.");
      const file = acceptedFiles[0];
      if (file) {
        setFotoPreview(URL.createObjectURL(file));
        setFormData({ ...formData, fotoPerfil: file });
      }
    },
  });

  const removePhoto = (e) => {
    e.stopPropagation();
    setFotoPreview(null);
    setFormData({ ...formData, fotoPerfil: null });
  };

  // --- 4. RENDER ---
  return (
    <Card className="border-0 shadow-none bg-transparent p-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="p-2">
          {/* SECCIÓN 1: FOTO DE PERFIL (Diseño Horizontal Compacto) */}
          <div className="flex items-center gap-3 mb-4 p-3 rounded-md border-dashed">
            <div
              {...getRootProps()}
              className="relative flex items-center justify-center bg-background rounded-full shadow-sm"
              style={{
                width: "80px",
                height: "80px",
                cursor: "pointer",
                overflow: "hidden",
                border: errors.fotoPerfil
                  ? "2px solid var(--bs-danger)"
                  : "2px solid #e2e8f0",
              }}
            >
              <input {...getInputProps()} id="fotoPerfil" />
              {fotoPreview ? (
                <img
                  src={fotoPreview}
                  alt="Preview"
                  className="w-full h-full object-fit-cover"
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
                  className="shadow h-8 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-destructive bg-background text-destructive hover:bg-destructive/10 py-0 px-2"
                  style={{ fontSize: "0.75rem" }}
                  variant="destructive"
                >
                  <Trash2 size={12} className="me-1" /> Quitar foto
                </Button>
              )}
              {errors.fotoPerfil && (
                <div className="text-destructive text-sm mt-1">
                  {errors.fotoPerfil.message}
                </div>
              )}
            </div>
          </div>

          {/* SECCIÓN 2: DOCUMENTOS */}
          <h6 className="font-bold uppercase text-sm mb-3 border-b pb-2">
            Información Personal
          </h6>
          <div className="grid grid-cols-12 gap-3 mb-3">
            {/* Tipo Documento */}
            <div className="col-span-full md:col-span-4">
              <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                <IdCard size={16} />
                Tipo Doc.
              </label>
              <select
                className={`w-full appearance-auto rounded-md border-input bg-background py-1 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs ${
                  errors.tipo_documento
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                {...register("tipo_documento", {
                  required: "Requerido",
                  onChange: (e) => {
                    // Cuando cambia el tipo de documento, limpiamos el campo del número
                    // para evitar que un DNI se quede guardado como Carnet y pase validaciones falsas.
                    setValue("numero_documento", "", {
                      shouldValidate: true,
                    });
                  },
                })}
              >
                <option value="DNI">DNI</option>
                <option value="extranjeria">Carnet Ext.</option>
              </select>
            </div>

            {/* Número Documento */}
            <div className="col-span-full md:col-span-8">
              <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                <CreditCard size={16} />
                Número Documento
              </label>
              <input
                type="text"
                inputMode="numeric"
                className={`w-full rounded-md border-input bg-background py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs ${
                  errors.numero_documento
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                placeholder="Ingrese número"
                {...register("numero_documento", {
                  validate: validateDocumento,
                })}
                // Pasamos el watch o el estado actual del tipo de documento para limitar el DOM
                onInput={limitDocumentoInput(watch("tipo_documento"))}
              />
              {errors.numero_documento && (
                <span className="text-destructive text-sm">
                  {errors.numero_documento.message}
                </span>
              )}
            </div>
          </div>

          {/* Nombres y Apellidos */}
          <div className="grid grid-cols-12 gap-3 mb-3">
            <div className="col-span-full md:col-span-6">
              <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                <User size={16} />
                Nombres
              </label>
              <input
                type="text"
                className={`w-full rounded-md border-input bg-background py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs ${
                  errors.nombres
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                placeholder="Ej. Juan Carlos"
                {...register("nombres", { required: "Nombre requerido" })}
              />
              {errors.nombres && (
                <span className="text-destructive text-sm">
                  {errors.nombres.message}
                </span>
              )}
            </div>
            <div className="col-span-full md:col-span-6">
              <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                <User size={16} />
                Apellidos
              </label>
              <input
                type="text"
                className={`w-full rounded-md border-input bg-background py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs ${
                  errors.apellidos
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                placeholder="Ej. Pérez López"
                {...register("apellidos", { required: "Apellido requerido" })}
              />
              {errors.apellidos && (
                <span className="text-destructive text-sm">
                  {errors.apellidos.message}
                </span>
              )}
            </div>
          </div>

          {/* SECCIÓN 3: CUENTA Y ACCESO */}
          <h6 className="font-bold uppercase text-sm mt-4 mb-3 border-b pb-2">
            Cuenta y Acceso
          </h6>
          <div className="grid grid-cols-12 gap-3 mb-3">
            <div className="col-span-full md:col-span-7">
              <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                <Mail size={16} />
                Correo Electrónico
              </label>
              <input
                type="email"
                inputMode="email"
                className={`w-full rounded-md border-input bg-background py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs ${
                  errors.correo
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                placeholder="usuario@empresa.com"
                {...register("correo", {
                  required: "Correo requerido",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Correo inválido",
                  },
                })}
              />
              {errors.correo && (
                <span className="text-destructive text-sm">
                  {errors.correo.message}
                </span>
              )}
            </div>
            <div className="col-span-full md:col-span-5">
              <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                <Lock size={16} />
                Método Auth
              </label>
              <select
                className={`w-full appearance-auto rounded-md border-input bg-background py-1 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs ${
                  errors.tipoAuth
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                {...register("tipoAuth", { required: "Requerido" })}
              >
                <option value="">Seleccione...</option>
                <option value="manual">Manual</option>
                <option value="google Oauth2">Google</option>
              </select>
              {errors.tipoAuth && (
                <span className="text-destructive text-sm">
                  {errors.tipoAuth.message}
                </span>
              )}
            </div>
          </div>

          {/* SECCIÓN 4: DATOS LABORALES */}
          <h6 className="font-bold uppercase text-sm mt-4 mb-3 border-b pb-2">
            Datos Laborales
          </h6>
          <div className="grid grid-cols-12 gap-3 mb-3">
            {/* Área */}
            <div className="col-span-full md:col-span-6">
              <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                <Building2 size={16} />
                Área
              </label>
              <select
                className={`w-full appearance-auto rounded-md border-input bg-background py-1 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs ${
                  errors.area
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                {...register("area", { required: "Requerido" })}
              >
                <option value="">Seleccione...</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre}
                  </option>
                ))}
              </select>
              {errors.area && (
                <span className="text-destructive text-sm">
                  {errors.area.message}
                </span>
              )}
            </div>

            {/* Cargo */}
            <div className="col-span-full md:col-span-6">
              <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                <Briefcase size={16} />
                Cargo
              </label>
              <select
                className={`w-full appearance-auto rounded-md border-input bg-background py-1 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs ${
                  errors.cargo
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                {...register("cargo", { required: "Requerido" })}
                onChange={(e) => {
                  setValue("cargo", e.target.value);
                  handleCargoChange(e.target.value);
                }}
              >
                <option value="">Seleccione...</option>
                {cargos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
              {errors.cargo && (
                <span className="text-destructive text-sm">
                  {errors.cargo.message}
                </span>
              )}
            </div>

            {/* Salario */}
            <div className="col-span-full md:col-span-4">
              <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                <Banknote size={16} />
                Salario
              </label>
              <input
                type="number"
                readOnly
                className="w-full rounded-md border-input bg-background py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs"
                {...register("salario", { required: "Requerido" })}
              />
            </div>

            {/* Horario */}
            <div className="col-span-full md:col-span-8">
              <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                <Clock size={16} />
                Horario
              </label>
              <select
                className={`w-full appearance-auto rounded-md border-input bg-background py-1 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs ${
                  errors.horario
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                {...register("horario", { required: "Requerido" })}
              >
                <option value="">Seleccione Horario...</option>
                {horarios.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.horaEntrada} - {h.horaSalida}
                  </option>
                ))}
              </select>
              {errors.horario && (
                <span className="text-destructive text-sm">
                  {errors.horario.message}
                </span>
              )}
            </div>
          </div>
        </CardContent>

        {/* FOOTER ACCIONES */}
        <CardFooter className="border-0 flex justify-end bg-transparent gap-2 pt-2 pb-0">
          <Button
            type="button"
            className="btn-cerrar px-4 rounded-md"
            onClick={handleCloseModal}
            variant="default"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="btn-guardar inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 text-xs px-4 rounded-md font-bold"
            variant="default"
          >
            Registrar Usuario
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
