import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../api/AxiosInstance";
import { ToastContainer } from "react-toastify";
import ToastAlert from "../components/componenteToast/ToastAlert";
import { ClockPlus, DoorOpenIcon, LogOut } from "lucide-react";
import { HoraLive } from "../utils/HoraLive";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


export function TakeAsistencia() {
  const [loading, setLoading] = useState(false); // 🔥 Control de peticiones concurrentes
  const dniInputRef = useRef(null);

  const {
    register,
    reset,
    setError,
    formState: { errors },
    getValues,
  } = useForm();

  const validateDni = () => {
    const dni = getValues("documento_identidad");
    if (!dni || dni.length < 8) {
      setError("documento_identidad", {
        type: "manual",
        message: "El campo DNI debe tener al menos 8 dígitos",
      });
      return null;
    }
    return dni;
  };

  const registrarEntrada = async () => {
    const dni = validateDni();
    if (!dni || loading) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post(`/asistencia/ingreso`, { dni });

      if (response.data.success) {
        reset({ documento_identidad: "" });
        ToastAlert("success", "Entrada registrada con éxito");
      } else {
        ToastAlert("error", "Error: " + response.data.message);
      }
    } catch (error) {
      ToastAlert(
        "error",
        error.response?.data?.message || "Error al registrar la entrada.",
      );
    } finally {
      setLoading(false);
      dniInputRef.current?.focus();
    }
  };

  const registrarSalida = async () => {
    const dni = validateDni();
    if (!dni || loading) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post(`/asistencia/salida`, { dni });

      if (response.data.success) {
        reset({ documento_identidad: "" });
        ToastAlert(
          "success",
          response.data.message || "Salida registrada con éxito",
        );
      } else {
        ToastAlert(
          "error",
          response.data.message || "Error al registrar salida",
        );
      }
    } catch (error) {
      if (error.response?.data?.errors?.dni) {
        setError("documento_identidad", {
          // 🔥 Corregido: Era "documento_identidad", no "dni"
          type: "manual",
          message: error.response.data.errors.dni[0],
        });
      } else {
        ToastAlert(
          error.response?.data?.message || "Error al procesar la salida",
        );
      }
    } finally {
      setLoading(false);
      dniInputRef.current?.focus();
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Card className="my-3 p-4 rounded-2xl justify-center">
        <CardHeader className="bg-background border-0 text-center mb-3 flex flex-col items-center gap-2 p-3">
          <h4 className="fw-bold text-main mb-1">
            <ClockPlus className="me-2" /> Registro de Asistencia
          </h4>
          <div className="d-flex justify-content-center align-items-center text-muted">
            <p
              className="mb-0 h2 fw-bold"
              style={{ color: "var(--brand-primary)" }}
            >
              <HoraLive />
            </p>
          </div>
        </CardHeader>

        <CardContent className="">
          <div className="mb-4">
            <label htmlFor="dni" className="small">
              DNI del Empleado
            </label>
            <input
              type="text"
              id="dni"
              disabled={loading}
              {...register("documento_identidad", {
                required: "El DNI es obligatorio",
              })}
              className={`form-control form-control-lg  ${
                errors.documento_identidad ? "is-invalid" : ""
              }`}
              placeholder="Ingrese su DNI"
              ref={(e) => {
                register("documento_identidad").ref(e);
                dniInputRef.current = e; // Mantener ref para el foco
              }}
            />
            {errors.documento_identidad && (
              <div className="invalid-feedback">
                {errors.documento_identidad.message}
              </div>
            )}
          </div>

          <div className="d-flex justify-content-between gap-3">
            <Button
              type="button"
              className="btn-guardar w-100"
              style={{ backgroundColor: "var(--fw-emerald)" }}
              onClick={registrarEntrada}
              disabled={loading}
             variant="default">
              <DoorOpenIcon height="20px" width="20px" className="me-2" />
              {loading ? "Procesando..." : "Entrada"}
            </Button>
            <Button
              type="button"
              className="btn-eliminar w-100"
              style={{ backgroundColor: "var(--fw-strawberry)" }}
              onClick={registrarSalida}
              disabled={loading}
             variant="destructive">
              <LogOut height="20px" width="20px" className="me-2" />
              {loading ? "Procesando..." : "Salida"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <ToastContainer />
    </div>
  );
}
