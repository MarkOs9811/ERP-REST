import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Save, ArrowRight, ArrowLeft } from "lucide-react";

// Importa tus servicios (Mantenemos los tuyos intactos)
import { GetCargos } from "../../service/GetCargos";
import { GetAreas } from "../../service/GetAreas";
import { GetTipoContrato } from "../../service/GetTipoContrato";
import { GetHorarios } from "../../service/GetHorarios";
import { GetDeducciones } from "../../service/GetDeducciones";
import { GetBonificacion } from "../../service/GetBonificacion";
import { GetDepartamento } from "../../service/GetDepartamento";
import { GetProvincia } from "../../service/GetProvincia";
import { GetDistrito } from "../../service/GetDistrito";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import axiosInstance from "../../api/AxiosInstance";
import { BotonMotionGeneral } from "../../components/componentesReutilizables/BotonMotionGeneral";

// Importa tus nuevos componentes
import { Paso1Personales } from "../../components/componentePlanillas/componentesIngresarNomina/Paso1Personales";
import { Paso2Laborales } from "../../components/componentePlanillas/componentesIngresarNomina/Paso2Laborales";
import { Paso3Aportes } from "../../components/componentePlanillas/componentesIngresarNomina/Paso3Aportes";

export function IngresoPlanilla() {
  // Extraemos 'trigger' para validar campos manualmente
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    trigger,
    watch,
    formState: { errors },
  } = useForm();

  // ESTADOS DEL STEPPER Y FORMULARIO
  const [pasoActual, setPasoActual] = useState(1);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  // ESTADOS DE UBICACIÓN
  const [selectedDepartamento, setSelectedDepartamento] = useState("");
  const [selectedProvincia, setSelectedProvincia] = useState("");

  // TUS USE-QUERYS (Reducidos para la vista, mantén tu lógica original si lo prefieres)
  const { data: cargosList } = useQuery({
    queryKey: ["cargos"],
    queryFn: GetCargos,
  });
  const { data: areasList = [] } = useQuery({
    queryKey: ["areas"],
    queryFn: GetAreas,
  });
  const { data: contratoList } = useQuery({
    queryKey: ["contratos"],
    queryFn: GetTipoContrato,
  });
  const { data: horariosList } = useQuery({
    queryKey: ["horarios"],
    queryFn: GetHorarios,
  });
  const {
    data: deduccionesList,
    isLoading: loadingDeducciones,
    isError: errorDeducciones,
  } = useQuery({ queryKey: ["deducciones"], queryFn: GetDeducciones });
  const {
    data: bonificacionesList,
    isLoading: loadingDBonificaciones,
    isError: errorBonificaciones,
  } = useQuery({ queryKey: ["bonificacion"], queryFn: GetBonificacion });
  const { data: departamentoList } = useQuery({
    queryKey: ["departamentos"],
    queryFn: GetDepartamento,
    staleTime: 1000 * 60 * 60,
  });
  const { data: provinciaList } = useQuery({
    queryKey: ["provincias", selectedDepartamento],
    queryFn: () => GetProvincia(selectedDepartamento),
    enabled: !!selectedDepartamento,
    staleTime: 1000 * 60 * 60,
  });
  const { data: distritoList } = useQuery({
    queryKey: ["distritos", selectedProvincia],
    queryFn: () => GetDistrito(selectedProvincia),
    enabled: !!selectedProvincia,
    staleTime: 1000 * 60 * 60,
  });

  // === LÓGICA DE NAVEGACIÓN Y VALIDACIÓN ===
  const camposPorPaso = {
    1: [
      "fotoPerfil",
      "tipo_documento",
      "num_documento",
      "nombre",
      "apellidos",
      "fecha_nacimiento",
      "telefono",
      "departamento",
      "provincia",
      "distrito",
      "direccion",
      "correo",
    ],
    2: [
      "contrato",
      "fecha_contrato",
      "fecha_fin_contrato",
      "area",
      "cargo",
      "horario",
      "salario",
    ],
    3: [], // Aportes suelen ser opcionales, no requieren validación estricta
  };

  const avanzarPaso = async () => {
    // Valida solo los campos de la pantalla actual antes de avanzar
    const esValido = await trigger(camposPorPaso[pasoActual]);
    if (esValido) {
      setPasoActual((prev) => prev + 1);
    } else {
      ToastAlert(
        "error",
        "Por favor, completa los campos obligatorios en rojo.",
      );
    }
  };

  const retrocederPaso = () => {
    setPasoActual((prev) => prev - 1);
  };

  // === ENVÍO FINAL ===
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "fotoPerfil")
          formData.append("fotoPerfil", data.fotoPerfil);
        else if (key === "deducciones" || key === "bonificaciones") {
          data[key]?.forEach((item, index) =>
            formData.append(`${key}[${index}]`, item),
          );
        } else {
          formData.append(key, data[key]);
        }
      });

      const response = await axiosInstance.post("/planilla", formData);

      if (response.data.success) {
        reset();
        setPreview(null);
        setPasoActual(1); // Volvemos al inicio al terminar
        ToastAlert("success", "Trabajador registrado y contrato generado");
        if (response.data.pdf_url) window.open(response.data.pdf_url, "_blank");
      } else {
        ToastAlert("error", response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) =>
          setError(key, { type: "manual", message: errors[key][0] }),
        );
      } else {
        ToastAlert("error", "Error en el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card container ">
      <div className="card-header border-0 p-3 d-flex justify-content-between align-items-center">
        <h4>Registro de Nuevo Empleado</h4>
        <span className="badge bg-primary px-3 py-2">
          Paso {pasoActual} de 3
        </span>
      </div>

      <div className="card-body px-4 m-0 mt-3">
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          {/* RENDERIZADO CONDICIONAL DE PASOS */}
          {pasoActual === 1 && (
            <Paso1Personales
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
              departamentoList={departamentoList}
              provinciaList={provinciaList}
              distritoList={distritoList}
              selectedDepartamento={selectedDepartamento}
              setSelectedDepartamento={setSelectedDepartamento}
              selectedProvincia={selectedProvincia}
              setSelectedProvincia={setSelectedProvincia}
              preview={preview}
              setPreview={setPreview}
              fileInputRef={fileInputRef}
            />
          )}

          {pasoActual === 2 && (
            <Paso2Laborales
              register={register}
              errors={errors}
              setValue={setValue}
              contratoList={contratoList}
              areasList={areasList}
              cargosList={cargosList}
              horariosList={horariosList}
            />
          )}

          {pasoActual === 3 && (
            <Paso3Aportes
              register={register}
              deduccionesList={deduccionesList}
              loadingDeducciones={loadingDeducciones}
              errorDeducciones={errorDeducciones}
              bonificacionesList={bonificacionesList}
              loadingDBonificaciones={loadingDBonificaciones}
              errorBonificaciones={errorBonificaciones}
            />
          )}

          {/* CONTROLES DE NAVEGACIÓN */}
          <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
            <button
              type="button"
              className="btn btn-outline-secondary d-flex align-items-center"
              onClick={retrocederPaso}
              disabled={pasoActual === 1}
            >
              <ArrowLeft size={18} className="me-2" /> Atrás
            </button>

            {pasoActual < 3 ? (
              <button
                type="button"
                className="btn-guardar d-flex align-items-center px-4"
                onClick={avanzarPaso}
              >
                Siguiente <ArrowRight size={18} className="ms-2" />
              </button>
            ) : (
              <BotonMotionGeneral
                type="submit"
                text="Registrar y Generar contrato"
                loading={loading}
                icon={<Save size={18} />}
                classDefault="btn btn-success d-flex align-items-center px-4"
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
