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
    <div className="flex justify-center items-center">
      <Card className="my-3 p-4 rounded-2xl justify-center">
        <CardHeader className="bg-background border-0 text-center mb-3 flex flex-col items-center gap-2 p-3">
          <h4 className="font-bold text-main mb-1">
            <ClockPlus className="me-2" /> Registro de Asistencia
          </h4>
          <div className="flex justify-center items-center text-muted-foreground">
            <p
              className="mb-0 h2 font-bold"
              style={{ color: "var(--brand-primary)" }}
            >
              <HoraLive />
            </p>
          </div>
        </CardHeader>

        <CardContent className="">
          <div className="mb-4">
            <label htmlFor="dni" className="text-sm">
              DNI del Empleado
            </label>
            <input
              type="text"
              id="dni"
              disabled={loading}
              {...register("documento_identidad", {
                required: "El DNI es obligatorio",
              })}
              className={`w-full rounded-md border-input bg-background py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-10 px-4 text-base ${
                errors.documento_identidad
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
              placeholder="Ingrese su DNI"
              ref={(e) => {
                register("documento_identidad").ref(e);
                dniInputRef.current = e; // Mantener ref para el foco
              }}
            />
            {errors.documento_identidad && (
              <div className="text-sm text-destructive">
                {errors.documento_identidad.message}
              </div>
            )}
          </div>

          <div className="flex justify-between gap-3">
            <Button
              type="button"
              className="btn-guardar w-full"
              style={{ backgroundColor: "var(--fw-emerald)" }}
              onClick={registrarEntrada}
              disabled={loading}
              variant="default"
            >
              <DoorOpenIcon height="20px" width="20px" className="me-2" />
              {loading ? "Procesando..." : "Entrada"}
            </Button>
            <Button
              type="button"
              className="btn-eliminar w-full"
              style={{ backgroundColor: "var(--fw-strawberry)" }}
              onClick={registrarSalida}
              disabled={loading}
              variant="destructive"
            >
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
