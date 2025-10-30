import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../api/AxiosInstance";
import { toast, ToastContainer } from "react-toastify";
import ToastAlert from "../components/componenteToast/ToastAlert";
import { DoorOpenIcon, LogOut } from "lucide-react";

export function TakeAsistencia() {
  const [currentTime, setCurrentTime] = useState("");
  const dniInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
    getValues,
  } = useForm();

  useEffect(() => {
    if (dniInputRef.current) {
      dniInputRef.current.focus();
    }

    const updateClock = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setCurrentTime(formatted);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const registrarEntrada = async () => {
    const dni = getValues("documento_identidad");

    try {
      if (!dni) {
        setError("documento_identidad", {
          type: "manual",
          message: "El campo DNI es obligatorio",
        });
        return;
      }

      const response = await axiosInstance.post(`/asistencia/ingreso`, {
        dni: dni,
      });

      if (response.data.success) {
        // Reiniciar solo el campo DNI
        reset({ documento_identidad: "" });

        ToastAlert("success", "Entrada registrada con éxito");
      } else {
        reset(); // Si prefieres resetear todo
        toast.error("Error " + response.data.message);
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Error inesperado al registrar la entrada.";
      toast.error(message);
    }
  };

  const registrarSalida = async () => {
    const dni = getValues("documento_identidad");

    if (!dni) {
      setError("dni", {
        type: "manual",
        message: "El campo DNI es obligatorio",
      });
      return;
    }

    try {
      const response = await axiosInstance.post(`/asistencia/salida`, {
        dni: dni,
      });

      if (response.data.success) {
        reset({ documento_identidad: "" }); // Reiniciar solo el campo DNI
        toast.success(response.data.message || "Salida registrada");
      } else {
        reset(); // Si prefieres resetear todo
        toast.error(response.data.message || "Error al registrar salida");
      }

      dniInputRef.current.focus();
    } catch (error) {
      if (error.response?.data?.errors?.dni) {
        setError("dni", {
          type: "manual",
          message: error.response.data.errors.dni[0],
        });
      } else {
        toast.error(
          error.response?.data?.message || "Error al registrar salida"
        );
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center h-100 "
      style={{ backgroundColor: "#f0f2f5" }}
    >
      <div
        className="card shadow-lg border-0 p-4 rounded-4 justify-content-center"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <div className="card-header bg-white border-0 text-center mb-3">
          <h4 className="fw-bold text-primary mb-1">
            <i className="fas fa-user-clock me-2"></i> Registro de Asistencia
          </h4>
          <div className="d-flex justify-content-center align-items-center text-secondary">
            <i className="fa-regular fa-clock me-2"></i>
            <p className="mb-0 h2">{currentTime}</p>
          </div>
        </div>

        <div className="card-body">
          <div className="mb-4">
            <label htmlFor="dni" className="form-label fw-semibold">
              <i className="fas fa-id-card me-2 text-secondary"></i>DNI del
              Empleado
            </label>
            <input
              type="text"
              id="dni"
              {...register("documento_identidad", {
                required: "El DNI es obligatorio",
                minLength: {
                  value: 8,
                  message: "El DNI debe tener al menos 8 dígitos",
                },
              })}
              className={`form-control form-control-lg rounded-3 shadow-sm ${
                errors.documento_identidad ? "is-invalid" : ""
              }`}
              placeholder="Ingrese su DNI"
            />
            {errors.documento_identidad && (
              <div className="invalid-feedback">
                {errors.documento_identidad.message}
              </div>
            )}
          </div>

          <div className="d-flex justify-content-between gap-2">
            <button
              type="button"
              className="btn btn-success flex-fill py-3 fw-semibold shadow-sm d-flex align-items-center justify-content-center"
              onClick={registrarEntrada}
            >
              <DoorOpenIcon
                color="white"
                height="20px"
                width="20px"
                className="me-2"
              />
              Entrada
            </button>
            <button
              type="button"
              className="btn btn-danger flex-fill py-3 fw-semibold shadow-sm d-flex align-items-center justify-content-center"
              onClick={registrarSalida}
            >
              <LogOut
                color="white"
                height="20px"
                width="20px"
                className="me-2"
              />
              Salida
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
